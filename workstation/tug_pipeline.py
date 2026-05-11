"""
tug_pipeline.py
===============

Slope-Based seated detection + Turn analysis for TUG test videos.

Key features:
- Detects seated regions based on the slope of the pelvis Z signal, rather than absolute height.
- Ranks flat regions by mean height to select the four seated positions (two per TUG).
- Analyzes each TUG interval for sit-to-stand, stand-to-sit, mid-test turn, and turn durations.
- Detects two turns per TUG test: mid-test turn and near-chair turn using zero-crossing of the right-left hip X-difference signal.
- Generates a comprehensive diagnostic plot showing all signals, detected regions, and TUG phase breakdown.
- Exports results to JSON for easy integration with downstream systems.

End-to-end pipeline: input video ? 2D pose extraction ? 3D pose lifting ? TUG metrics + plot + JSON.

Usage:

    python tug_pipeline.py <video_path> [options]

Examples:

    python tug_pipeline.py ~/workspace/test_input/user_videos/patient_x_video.mov
    python tug_pipeline.py ~/workspace/test_input/user_videos/patient_x_video.mov --fps 29.97 --output-dir ~/workspace/test_output/tug_analysis/
    python tug_pipeline.py ~/workspace/test_input/user_videos/patient_x_video.mov --skip-inference --keypoints ~/workspace/test_input/user_videos/patient_x_keypoints_3d.npy
"""

import matplotlib

matplotlib.use("Agg")  # Use non-interactive backend for plotting
import matplotlib.pyplot as plt
from scipy.signal import savgol_filter, find_peaks
import mpl_toolkits.mplot3d  # ensure 3D plotting capabilities are available
import numpy as np
import argparse
import json
import os
import cv2
import sys
import torch

if not torch.cuda.is_available():
    print("ERROR: No GPU available. Exiting.")
    sys.exit(1)

# CLI Arguments
parser = argparse.ArgumentParser(description="TUG Test Analysis Pipeline")
parser.add_argument("video_path", help="Path to input video file")
parser.add_argument(
    "--fps",
    type=float,
    default=30.0,
    help="Frames per second of the input video (default: 30)",
)
parser.add_argument(
    "--min-seated",
    type=float,
    default=2.80,
    help="Minimum time spent in seated position (default: 2.80 seconds)",
)
parser.add_argument(
    "--output-dir",
    default=os.path.expanduser("~/workspace/test_output/tug_analysis/"),
    help="Directory to save outputs (default: ~/workspace/test_output/tug_analysis/)",
)
parser.add_argument(
    "--skip-inference",
    action="store_true",
    help="Skip pose inference, use existing keypoints file",
)
parser.add_argument(
    "--keypoints",
    help="Path to existing 3D keypoints .npy file (required if --skip-inference is set)",
)
args = parser.parse_args()


VIDEO_PATH = os.path.expanduser(args.video_path)
if not args.skip_inference:
    cap = cv2.VideoCapture(VIDEO_PATH)
    detected_fps = cap.get(cv2.CAP_PROP_FPS)
    cap.release()
    FPS = detected_fps if detected_fps > 0 else args.fps
    print(f"\nDetected FPS: {FPS}\n")
else:
    FPS = args.fps
    print(f"\nUsing provided FPS: {FPS}\n")

MIN_SEATED_SECONDS = args.min_seated
OUTPUT_DIR = (
    os.path.expanduser(args.output_dir)
    if args.output_dir
    else os.path.expanduser("~/workspace/test_output/tug_analysis/")
)
os.makedirs(OUTPUT_DIR, exist_ok=True)
video_name = os.path.splitext(os.path.basename(VIDEO_PATH))[0]
KEYPOINTS_PATH = os.path.join(OUTPUT_DIR, f"{video_name}_keypoints_3d.npy")

# Analysis Parameters
EXPECTED_SEATED_REGIONS = 4
SLOPE_THRESHOLD = 0.05  # Maximum absolute slope (units/sec) to consider "flat" (tune this if too many or too few flat regions are found)


# Turn detection function
def find_turns_by_zero_crossings(
    right_x,
    left_x,
    tug_start,
    tug_end,
    fps,
    min_amplitude=0.005,
    min_duration_sec=0.3,
):
    """
    Detect turns using zero-crossings of (right_hip_x - left_hip_x) signal.

    A turn causes the hip to swap lateral postition, producing a zero-crossing in the difference signal. Each crossing is the midpoint of a turn; the full turn inverval spans from the nearest peak before the crossing to the nearest peak after it.

    The function returns all valid turns sorted by time. Typically the two strongest by amplitude correspond to the mid-test trun and near-chair turn.

    Args:
        right_x (np.array): Right hip X positions over time.
        left_x (np.array): Left hip X positions over time.
        tug_start (int): Start frame of the TUG test interval.
        tug_end (int): End frame of the TUG test interval.
        fps (float): Frames per second of the video.
        min_amplitude (float): Minimum required amplitude of the turn signal to be considered valid (default: 0.005).
        min_duration_sec (float): Minimum duration of a turn in seconds (default: 0.3).

    Returns:
        List of dictionaries, each containing:
            - 'start_frame': Starting frame of the turn interval.
            - 'end_frame': Ending frame of the turn interval.
            - 'duration_sec': Duration of the turn in seconds.
            - 'amplitude': Amplitude of the turn signal (peak-to-peak) within the turn interval.
    """
    # Compute the difference signal
    diff = right_x[tug_start:tug_end] - left_x[tug_start:tug_end]

    # Find frames where the difference signal changes sign
    sign_changes = np.where(np.diff(np.sign(diff)))[0]
    if len(sign_changes) == 0:
        return []  # No turns detected

    default_radius = int(
        2.0 * fps
    )  # Search radius for peaks around zero-crossing (2 seconds)
    near_left_radius = int(0.75 * fps)  # Tighter search for near-chair turn

    turns = []
    for i, zc in enumerate(sign_changes):
        # Fence each crossing search to its own territory:
        # don't look past the previous or next zero crossing
        prev_zc = sign_changes[i - 1] if i > 0 else 0
        next_zc = sign_changes[i + 1] if i < len(sign_changes) - 1 else len(diff)

        # Use tighter left radius for late crossings (near-chair turn)
        left_radius = near_left_radius if i > 0 else default_radius

        left_start = max(prev_zc, zc - left_radius)
        right_end = min(next_zc, zc + default_radius)

        left_segment = diff[left_start:zc]
        right_segment = diff[zc + 1 : right_end]

        if len(left_segment) < 3 or len(right_segment) < 3:
            continue  # Not enough data to analyze this crossing

        # Find he larges absolute extreme on eaxh side of he crossing.
        # This represents the peak hip separation before and after the turn.
        left_peak = left_start + np.argmax(np.abs(left_segment))
        right_peak = zc + 1 + np.argmax(np.abs(right_segment))

        duration = (right_peak - left_peak) / fps
        amplitude = abs(diff[left_peak]) + abs(diff[right_peak])

        if duration < min_duration_sec:
            continue  # Too brief to be a valid turn
        if amplitude < min_amplitude:
            continue  # Not a strong enough turn signal

        turns.append(
            {
                "start": tug_start + left_peak,
                "end": tug_start + right_peak,
                "amplitude": amplitude,
                "duration": duration,
            }
        )
    return turns


# Step 1: Inference (2D -> 3D pose estimation)
if args.skip_inference:
    if not args.keypoints:
        print("\nError: Must provide --keypoints path if --skip-inference is used.")
        exit(1)
    KEYPOINTS_PATH = os.path.expanduser(args.keypoints)
    print(f"\nSkipping inference. Loading keypoints from {KEYPOINTS_PATH}")
    kpts = np.load(KEYPOINTS_PATH)
else:
    print(f"Running pose inference on video: {VIDEO_PATH}")
    from mmpose.apis import MMPoseInferencer  # import only when needed

    inferencer = MMPoseInferencer(
        pose2d="human", pose3d="motionbert_dstformer-ft-243frm_8xb32-120e_h36m"
    )

    vis_dir = os.path.join(OUTPUT_DIR, "visualizations")
    result_generator = inferencer(
        inputs=VIDEO_PATH, show=False, out_dir=vis_dir, disable_norm_pose_2d=True
    )
    results = list(result_generator)
    print(f"Inference completed. Processed {len(results)} frames.")

    # Extract 3D keypoints and save to .npy
    all_keypoints = []
    for frame in results:
        preds = frame["predictions"][0]
        if len(preds) > 0:
            kp = np.array(
                preds[0]["keypoints"]
            )  # shape (17, 3) for 17 joints with (x,y,z)
            all_keypoints.append(kp)
        else:
            all_keypoints.append(
                np.full((17, 3), np.nan)
            )  # placeholder for missing detections

    kpts = np.array(all_keypoints)  # shape (num_frames, 17, 3)
    np.save(KEYPOINTS_PATH, kpts)
    print(f"\nSaved 3D keypoints to {KEYPOINTS_PATH}")

print(f"\nKeypoints shape: {kpts.shape}")

# Step 2: smooth singals
# H3.6M join indeces: 0=pelvis, 1=right hip, 4=left hip
pelvis_z = kpts[:, 0, 2]  # Z axis (height)
right_hip_x = kpts[:, 1, 0]  # right hip X axis (lateral)
left_hip_x = kpts[:, 4, 0]  # left hip X axis (lateral)

pelvis_z_smooth = savgol_filter(pelvis_z, window_length=31, polyorder=2)
right_hip_x_smooth = savgol_filter(right_hip_x, window_length=21, polyorder=2)
left_hip_x_smooth = savgol_filter(left_hip_x, window_length=21, polyorder=2)

# Get time array for plotting
num_frames = len(pelvis_z)
time_sec = np.arange(num_frames) / FPS

# Step 3: Compute derivative of smoothed pelvis Z
pelvis_z_slope = savgol_filter(
    pelvis_z_smooth, window_length=31, polyorder=2, deriv=1, delta=1 / FPS
)

# Step 4: Detect seated regions
is_flat = np.abs(pelvis_z_slope) < SLOPE_THRESHOLD
diff = np.diff(is_flat.astype(int))
starts = np.where(diff == 1)[0] + 1
ends = np.where(diff == -1)[0] + 1

if is_flat[0]:  # signal starts in a flat region
    starts = np.insert(starts, 0, 0)
if is_flat[-1]:  # signal ends in a flat region
    ends = np.append(ends, num_frames)

# Keep only regions that are long enough to be considered seated (e.g. >3 seconds)
min_frames = int(MIN_SEATED_SECONDS * FPS)
flat_regions = [(s, e) for s, e in zip(starts, ends) if (e - s) >= min_frames]

print(
    f"\nFound {len(flat_regions)} flat regions (|slope| < {SLOPE_THRESHOLD}, duration >= {MIN_SEATED_SECONDS}s):"
)
for i, (s, e) in enumerate(flat_regions):
    mean_height = np.mean(pelvis_z_smooth[s:e])
    print(
        f"  Region {i+1}: {s/FPS:.2f}s - {e/FPS:.2f}s  |  duration: {(e-s)/FPS:.2f}s  |  mean height: {mean_height:.3f}"
    )

# Select the 4 most likely seated regions based on mean height (lowest)
flat_with_height = [(s, e, np.mean(pelvis_z_smooth[s:e])) for s, e in flat_regions]
flat_sorted_by_height = sorted(flat_with_height, key=lambda x: x[2])

if len(flat_sorted_by_height) < EXPECTED_SEATED_REGIONS:
    print(
        f"\n*** ERROR: Only found {len(flat_sorted_by_height)} candidate regions, expected {EXPECTED_SEATED_REGIONS}. ***"
    )
    print(
        "Possible cause: patient did not hold seated position for 3+ second between each TUG test."
    )
    seated_regions = sorted(
        [(s, e) for s, e, _ in flat_sorted_by_height]
    )  # fallback to just taking the longest regions if we don't have enough candidates
else:
    seated_candidates = flat_sorted_by_height[:EXPECTED_SEATED_REGIONS]
    seated_regions = sorted([(s, e) for s, e, _ in seated_candidates])  # sort by time

print(f"\nSelected {len(seated_regions)} seated regions:")
for i, (s, e) in enumerate(seated_regions):
    mean_h = np.mean(pelvis_z_smooth[s:e])
    print(
        f"  Seated Region {i+1}: {s/FPS:.2f}s - {e/FPS:.2f}s  |  duration: {(e-s)/FPS:.2f}s  |  mean height: {mean_h:.3f}"
    )

# Gap sanity check
print("\nChecking gaps between seated regions...")
for i in range(len(seated_regions) - 1):
    gap_duration = (seated_regions[i + 1][0] - seated_regions[i][1]) / FPS
    print(f"  Gap {i+1} (Seated {i+1} to Seated {i+2}): {gap_duration:.2f} seconds")
    if gap_duration < 3.0:
        print(
            f"    *** WARNING: Short gap of {gap_duration:.2f}s between seated regions {i+1} and {i+2}. This may indicate a missed detection or that the patient did not fully stand up. Consider reviewing the video and adjusting parameters if needed. ***"
        )
    if gap_duration > 30.0:
        print(
            f"    *** WARNING: Long gap of {gap_duration:.2f}s between seated regions {i+1} and {i+2}. This may indicate an unusually long rest period or a missed detection. Consider reviewing the video and adjusting parameters if needed. ***"
        )

# Step 5: Define TUG windows
print(f"\n=== Tug Windows ===")
tug_windows = []
for i in range(len(seated_regions) - 1):
    tug_start = seated_regions[i][1]  # end of seated region
    tug_end = seated_regions[i + 1][0]  # start of next seated region
    tug_windows.append((tug_start, tug_end))
    print(
        f"  TUG {i+1}: frames {tug_start} - {tug_end}  | "
        f"{tug_start/FPS:.2f}s - {tug_end/FPS:.2f}s | "
        f"Duration: {(tug_end-tug_start)/FPS:.2f}s"
    )

# Step 6: Analyze each TUG test
print(f"\n=== TUG Test Breakdown ===")
tug_results = []
for i, (tug_start, tug_end) in enumerate(tug_windows):

    # Sit-to-Stand Detection
    # Find the sharp positive slope peak right after the seated region ends
    sts_search_end = min(tug_start + int(4.0 * FPS), tug_end)
    slope_after_seated = pelvis_z_slope[tug_start:sts_search_end]
    rise_peak_rel = np.argmax(slope_after_seated)

    # End of sit-to-stand: first local minimum after the rise peak
    slope_after_peak = pelvis_z_slope[tug_start + rise_peak_rel : sts_search_end]
    local_mins, _ = find_peaks(-slope_after_peak, prominence=0.01)

    if len(local_mins) > 0:
        sit_to_stand_end = tug_start + rise_peak_rel + local_mins[0]
    else:
        # Fallback: where slope drops below 10% of peak value
        peak_val = slope_after_seated[rise_peak_rel]
        sit_to_stand_end = tug_start + rise_peak_rel
        for j in range(rise_peak_rel, len(slope_after_seated)):
            if slope_after_seated[j] < peak_val * 0.1:
                sit_to_stand_end = tug_start + j
                break

    # Stand-to-Sit Detection
    # Find the sharp negative slope trough just before the next seated region
    sts2_search_start = max(tug_end - int(2.5 * FPS), tug_start)
    slope_before_seated = pelvis_z_slope[sts2_search_start:tug_end]
    descent_trough_rel = np.argmin(slope_before_seated)

    # Start of stand-to-sit: last local maximum before the descent trough
    slope_before_trough = slope_before_seated[:descent_trough_rel]
    local_maxs, _ = find_peaks(slope_before_trough, prominence=0.01)

    if len(local_maxs) > 0:
        stand_to_sit_start = sts2_search_start + local_maxs[-1]
    else:
        # Fallback: where slope rises above 10% of trough value
        trough_val = slope_before_seated[descent_trough_rel]
        stand_to_sit_start = sts2_search_start + descent_trough_rel
        for j in range(descent_trough_rel - 1, -1, -1):
            if slope_before_seated[j] > trough_val * 0.1:
                stand_to_sit_start = sts2_search_start + j
                break

    # Turn Detection
    # Search from end of sit-to-stand through end of TUG window.
    # Uses zero crossings of (right_hip_x - left_hip_x) to find turns.
    turns = find_turns_by_zero_crossings(
        right_hip_x_smooth,
        left_hip_x_smooth,
        sit_to_stand_end,
        tug_end,
        FPS,
    )

    mid_turn_start = mid_turn_end = mid_turn_duration = None
    near_turn_start = near_turn_end = near_turn_duration = None

    if len(turns) >= 2:
        # Take the two strongest turns by amplitude, then sort by time
        # so the earlier one is the mid-test turn and the later is near-chair
        top_two = sorted(turns, key=lambda t: t["amplitude"], reverse=True)[:2]
        top_two.sort(key=lambda t: t["start"])

        mid_turn_start = top_two[0]["start"]
        mid_turn_end = top_two[0]["end"]
        mid_turn_duration = top_two[0]["duration"]

        near_turn_start = top_two[1]["start"]
        near_turn_end = top_two[1]["end"]
        near_turn_duration = top_two[1]["duration"]

    elif len(turns) == 1:
        # Only one turn found then assume it's the mid-test turn
        mid_turn_start = turns[0]["start"]
        mid_turn_end = turns[0]["end"]
        mid_turn_duration = turns[0]["duration"]

    # Compute Durations
    sit_to_stand_duration = (sit_to_stand_end - tug_start) / FPS
    stand_to_sit_duration = (tug_end - stand_to_sit_start) / FPS
    tug_duration = (tug_end - tug_start) / FPS

    tug_results.append(
        {
            "tug_number": i + 1,
            "tug_start": tug_start,
            "tug_end": tug_end,
            "sit_to_stand_end": sit_to_stand_end,
            "stand_to_sit_start": stand_to_sit_start,
            "sit_to_stand_duration": sit_to_stand_duration,
            "stand_to_sit_duration": stand_to_sit_duration,
            "mid_turn_start": mid_turn_start,
            "mid_turn_end": mid_turn_end,
            "mid_turn_duration": mid_turn_duration,
            "near_turn_start": near_turn_start,
            "near_turn_end": near_turn_end,
            "near_turn_duration": near_turn_duration,
            "tug_duration": tug_duration,
        }
    )

    # Print summary
    mid_text = f"{mid_turn_duration:.2f}s" if mid_turn_duration is not None else "N/A"
    near_text = (
        f"{near_turn_duration:.2f}s" if near_turn_duration is not None else "N/A"
    )
    print(
        f"  TUG {i+1}: {tug_start/FPS:.2f}s - {tug_end/FPS:.2f}s | duration: {tug_duration:.2f}s"
    )
    print(
        f"    Sit-to-Stand:             {sit_to_stand_duration:.2f}s ({tug_start/FPS:.2f}s - {sit_to_stand_end/FPS:.2f}s)"
    )
    print(
        f"    Stand-to-Sit:             {stand_to_sit_duration:.2f}s ({stand_to_sit_start/FPS:.2f}s - {tug_end/FPS:.2f}s)"
    )
    print(f"    Mid-test turn:            {mid_text}")
    print(f"    Near-chair turn:          {near_text}\n")

# Step 7: Diagnostic plot
fig, axes = plt.subplots(
    3, 1, figsize=(18, 14), sharex=True, gridspec_kw={"height_ratios": [3, 1.5, 1.5]}
)
ax1, ax2, ax3 = axes

# Top panel: All signals + detected phases
ax1.plot(time_sec, pelvis_z, label="Pelvis Z (raw)", color="gray", alpha=0.3)
ax1.plot(
    time_sec, pelvis_z_smooth, label="Pelvis Z (smoothed)", color="green", linewidth=2
)

# Seated regions
for i, (s, e) in enumerate(seated_regions):
    ax1.axvspan(
        s / FPS,
        e / FPS,
        color="yellow",
        alpha=0.3,
        label="Seated region" if i == 0 else None,
    )
    mid_time = (s + e) / 2 / FPS
    mean_h = np.mean(pelvis_z_smooth[s:e])
    ax1.text(
        mid_time,
        mean_h + 0.03,
        f"Seated {i+1}\n{(e-s)/FPS:.1f}s",
        ha="center",
        va="bottom",
        fontsize=8,
        fontweight="bold",
        bbox=dict(boxstyle="round,pad=0.2", facecolor="yellow", alpha=0.7),
    )

# TUG phase overlays
for tug in tug_results:
    ts, te = tug["tug_start"], tug["tug_end"]
    sts_end = tug["sit_to_stand_end"]
    sts2_start = tug["stand_to_sit_start"]
    is_first = tug["tug_number"] == 1

    # Sit-to-stand (green)
    ax1.axvspan(
        ts / FPS,
        sts_end / FPS,
        color="lime",
        alpha=0.2,
        label="Sit-to-Stand" if is_first else None,
    )
    ax2.axvspan(
        ts / FPS,
        sts_end / FPS,
        color="lime",
        alpha=0.2,
        label="Sit-to-Stand" if is_first else None,
    )

    # Stand-to-sit (salmon)
    ax1.axvspan(
        sts2_start / FPS,
        te / FPS,
        color="salmon",
        alpha=0.2,
        label="Stand-to-Sit" if is_first else None,
    )
    ax2.axvspan(
        sts2_start / FPS,
        te / FPS,
        color="salmon",
        alpha=0.2,
        label="Stand-to-Sit" if is_first else None,
    )

    # TUG summary label
    walk_mid = (sts_end + sts2_start) / 2 / FPS
    mid_t = f"{tug['mid_turn_duration']:.2f}s" if tug["mid_turn_duration"] else "N/A"
    near_t = f"{tug['near_turn_duration']:.2f}s" if tug["near_turn_duration"] else "N/A"
    ax1.text(
        walk_mid,
        0.25,
        f"TUG {tug['tug_number']}: {tug['tug_duration']:.2f}s\n"
        f"Up: {tug['sit_to_stand_duration']:.2f}s  Down: {tug['stand_to_sit_duration']:.2f}s\n"
        f"Mid turn: {mid_t}  Near turn: {near_t}",
        ha="center",
        va="bottom",
        fontsize=7,
        bbox=dict(boxstyle="round", pad=0.3, facecolor="white", alpha=1),
    )

ax1.set_ylabel("Position")
ax1.set_title(f"TUG Test Analysis: {video_name}")
ax1.legend(loc="upper right", fontsize=8)
ax1.grid(True, alpha=0.3)

# Middle panel: Pelvis Z slope
ax2.plot(time_sec, pelvis_z_slope, label="Pelvis Z slope", color="green", linewidth=1.5)
ax2.axhline(
    y=SLOPE_THRESHOLD,
    color="red",
    linestyle="--",
    alpha=0.7,
    label=f"+/-{SLOPE_THRESHOLD} slope threshold",
)
ax2.axhline(y=-SLOPE_THRESHOLD, color="red", linestyle="--", alpha=0.7)
ax2.axhline(y=0, color="gray", linestyle="dashdot", alpha=0.3)
for s, e in seated_regions:
    ax2.axvspan(s / FPS, e / FPS, color="yellow", alpha=0.3)
ax2.set_ylabel("Slope (height/sec)")
ax2.set_title("Pelvis Z Derivative (slope)")
ax2.legend(loc="upper right", fontsize=8)
ax2.grid(True, alpha=0.3)

# Bottom panel: Hip X signals for turn visualization
ax3.plot(
    time_sec,
    right_hip_x_smooth,
    label="Right Hip X (smoothed)",
    color="red",
    linewidth=1.5,
)
ax3.plot(
    time_sec,
    left_hip_x_smooth,
    label="Left Hip X (smoothed)",
    color="blue",
    linewidth=1.5,
)
ax3.axhline(y=0, color="gray", linestyle="-", alpha=0.3)

for tug in tug_results:
    is_first = tug["tug_number"] == 1
    if tug["mid_turn_duration"] is not None:
        ax3.axvspan(
            tug["mid_turn_start"] / FPS,
            tug["mid_turn_end"] / FPS,
            color="purple",
            alpha=0.3,
            label="Mid-test Turn" if is_first else None,
        )
    if tug["near_turn_duration"] is not None:
        ax3.axvspan(
            tug["near_turn_start"] / FPS,
            tug["near_turn_end"] / FPS,
            color="orange",
            alpha=0.3,
            label="Near-chair Turn" if is_first else None,
        )

ax3.set_xlabel("Time (seconds)")
ax3.set_ylabel("Hip X Position")
ax3.set_title("Hip X Signals for Turn Detection")
ax3.legend(loc="upper right", fontsize=8)
ax3.grid(True, alpha=0.3)

plt.tight_layout()
plot_path = os.path.join(OUTPUT_DIR, f"{video_name}_tug_plot.png")
plt.savefig(plot_path, dpi=150)
print(f"Diagnostic plot saved to {plot_path}")

# Step 8: Save results to JSON
tug_summary = []
for tug in tug_results:
    mid_turn = None
    if tug["mid_turn_duration"] is not None:
        mid_turn = {
            "start_time": round(tug["mid_turn_start"] / FPS, 2),
            "end_time": round(tug["mid_turn_end"] / FPS, 2),
            "duration": round(tug["mid_turn_duration"], 2),
        }

    near_turn = None
    if tug["near_turn_duration"] is not None:
        near_turn = {
            "start_time": round(tug["near_turn_start"] / FPS, 2),
            "end_time": round(tug["near_turn_end"] / FPS, 2),
            "duration": round(tug["near_turn_duration"], 2),
        }

    tug_summary.append(
        {
            "tug_number": tug["tug_number"],
            "tug_start_time": round(tug["tug_start"] / FPS, 2),
            "tug_end_time": round(tug["tug_end"] / FPS, 2),
            "tug_duration": round(tug["tug_duration"], 2),
            "sit_to_stand_duration": round(tug["sit_to_stand_duration"], 2),
            "stand_to_sit_duration": round(tug["stand_to_sit_duration"], 2),
            "mid_test_turn": mid_turn,
            "near_chair_turn": near_turn,
        }
    )

json_path = os.path.join(OUTPUT_DIR, f"{video_name}_tug_summary.json")
with open(json_path, "w") as f:
    json.dump(tug_summary, f, indent=4)
print(f"Saved TUG results to {json_path}")

print("\n=== Pipeline completed successfully ===\n")