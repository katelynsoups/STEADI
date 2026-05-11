# -*- coding: utf-8 -*-
"""
poll_and_process.py
-------------------

Polling orchestrator for the TUG analysis pipeline.

This script is designed to be run on a schedule (e.g., via cron).
Each run it will:
    1. Connect to GCS and Firestore
    2. Discover videos in the bucket (anything present is pending)
    3. For each pending video:
        a. Download it from GCS to the local input directory
        b. Delete it from the bucket to prevent reprocessing
        c. Mark a Firestore document as 'processing'
        d. Run tug_pipeline.py on the video
        e. Read the JSON results and write them to Firestore
        f. Clean up the local video file (keep results for debugging)
    4. Exit

Usage:
    python poll_and_process.py --bucket walking-test-video-uploads
    python poll_and_process.py --bucket walking-test-video-uploads --fps 29.97
    python poll_and_process.py --bucket walking-test-video-uploads --patient P001_1712345678
    python poll_and_process.py --bucket walking-test-video-uploads --dry-run

Prerequisites:
    pip install google-cloud-storage google-cloud-firestore

    export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/gcloud-keys/tug-pipeline-sa.json"
"""

import argparse
import subprocess
import sys
from pathlib import Path
from datetime import datetime, timezone
from gcs_firestore_bridge import GCSFirestoreBridge

# -------------------------------------------------------------------
# Local paths - must match what tug_pipeline.py expects
# -------------------------------------------------------------------
LOCAL_VIDEO_DIR = Path.home() / "workspace" / "test_input" / "user_videos"
LOCAL_OUTPUT_DIR = Path.home() / "workspace" / "test_output" / "tug_analysis"
PIPELINE_SCRIPT = Path(__file__).parent / "tug_pipeline.py"


def run_pipeline(video_path: Path, fps: float, output_dir: Path) -> dict:
    """
    Invoke tug_pipeline.py as a subprocess and return paths to its outputs.

    We run it as a subprocess rather than importing it because:
      - The pipeline uses argparse at module level, which conflicts with our own args
      - It keeps the pipeline isolated: if it crashes, this script can catch it
      - It mirrors how you'd run it manually, so behavior is identical

    Args:
        video_path:  Path to the downloaded video file
        fps:         Frames per second
        output_dir:  Directory for pipeline outputs

    Returns:
        dict with paths to the JSON results and plot files

    Raises:
        subprocess.CalledProcessError if the pipeline exits with a non-zero code
    """
    video_stem = video_path.stem

    cmd = [
        sys.executable,
        str(PIPELINE_SCRIPT),
        str(video_path),
        "--fps", str(fps),
        "--output-dir", str(output_dir),
    ]

    print(f"\n{'='*60}")
    print(f"  Running pipeline: {video_stem}")
    print(f"  Command: {' '.join(cmd)}")
    print(f"{'='*60}\n")

    subprocess.run(
        cmd,
        capture_output=False,
        text=True,
        check=True,
    )

    return {
        "json": output_dir / f"{video_stem}_tug_summary.json",
        "plot": output_dir / f"{video_stem}_tug_plot.png",
        "keypoints": output_dir / f"{video_stem}_keypoints_3d.npy",
    }


def process_single_video(bridge, participant_id, session_id, blob_name, fps, cleanup_video=True):
    """
    Full lifecycle for one video: download -> delete from bucket -> process -> write results.

    Args:
        bridge:         The GCS/Firestore bridge instance
        participant_id: Participant ID extracted from the video filename
        blob_name:      GCS blob path (e.g. '{uid}/{participantID}_{timestamp}.mp4')
        fps:            Frames per second for the pipeline
        cleanup_video:  If True, delete the local video after processing
    """
    try:
        # Step 1: Mark as processing in Firestore
        bridge.mark_processing(participant_id, session_id, blob_name)

        # Step 2: Download video from GCS
        local_video = bridge.download_video(blob_name, str(LOCAL_VIDEO_DIR))

        # Step 3: Delete from bucket immediately after download
        # This prevents reprocessing if the script is interrupted and rerun
        bridge.delete_video(blob_name)

        # Step 4: Run the TUG pipeline
        outputs = run_pipeline(local_video, fps, LOCAL_OUTPUT_DIR)

        # Step 5: Verify the JSON output exists
        json_path = outputs["json"]
        if not json_path.exists():
            raise FileNotFoundError(
                f"Pipeline completed but JSON output not found at {json_path}"
            )

        # Step 6: Write results to Firestore
        bridge.save_results(participant_id, session_id, str(outputs["json"]), fps)

        # Step 7: Clean up local video (keep results for debugging)
        if cleanup_video and local_video.exists():
            local_video.unlink()
        
        print(f"Successfully processed: {participant_id}/{session_id}")

    except Exception as e:
      error_msg = f"{type(e).__name__}: {str(e)}"
      print(f"\nFailed to process {participant_id}: {error_msg}")
      bridge.mark_failed(participant_id, error_msg)
      # Clean up local video so next cron run doesn't reprocess it
      if local_video.exists():
          local_video.unlink()

def main():
    parser = argparse.ArgumentParser(
        description="Poll GCS for new STEADI videos and run TUG analysis"
    )
    parser.add_argument(
        "--bucket", required=True,
        help="GCS bucket name (e.g. 'walking-test-video-uploads')"
    )
    parser.add_argument(
        "--fps", type=float, default=30.0,
        help="Frames per second of the input videos (default: 30)"
    )
    parser.add_argument(
        "--patient", type=str, default=None,
        help="Process a specific video by filename stem (e.g. 'P001_1712345678'). "
             "If omitted, all videos in the bucket are processed."
    )
    parser.add_argument(
        "--video-prefix", type=str, default="",
        help="Folder prefix in the GCS bucket where videos are stored (default: '')"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="List pending videos without processing them"
    )
    parser.add_argument(
        "--keep-video", action="store_true",
        help="Don't delete the local video file after processing"
    )
    args = parser.parse_args()

    # --- Startup ---
    now = datetime.now(timezone.utc)
    print(f"\n{'#'*60}")
    print(f"  TUG Pipeline Poller")
    print(f"  {now.strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print(f"  Bucket: {args.bucket}")
    print(f"  FPS: {args.fps}")
    print(f"{'#'*60}\n")

    bridge = GCSFirestoreBridge(
        bucket_name=args.bucket,
        video_prefix=args.video_prefix,
    )

    # --- Discover work ---
    if args.patient:
        # Process a specific video by filename stem e.g. "P001_1712345678"
        # Dynamic extension discovery
        blob_name = bridge.find_video_blob(args.video_prefix, args.patient)
        if blob_name is None:
            print(f"No video found for patient '{args.patient}' in gs://{args.bucket}/{args.video_prefix}")
            return
        pending = [{"patient_id": args.patient, "blob_name": blob_name}]
        # Current (hardcoded extension)
        # blob_name = f"{args.video_prefix}{args.patient}.mp4"
        # participant_id = args.patient.split("_")[0]
        # pending = [{"participant_id": participant_id, "blob_name": blob_name}]
        print(f"Targeting specific video: {blob_name}")
    else:
        pending = bridge.get_pending_videos()

    if not pending:
        print("Nothing to process. Exiting.")
        return

    print(f"\nPending videos ({len(pending)}):")
    for v in pending:
        print(f"  - {v['participant_id']}  ({v['blob_name']})")

    if args.dry_run:
        print("\n(Dry run - no processing performed)")
        return

    # --- Process each video ---
    succeeded = 0
    failed = 0

    for video_info in pending:
      process_single_video(
          bridge=bridge,
          participant_id=video_info["participant_id"],
          session_id=video_info["session_id"],
          blob_name=video_info["blob_name"],
          fps=args.fps,
          cleanup_video=not args.keep_video,
      )
      if success:
        succeeded += 1
      else:
        failed += 1
    
    # --- Summary ---
    print(f"\n{'#'*60}")
    print(f"  Polling complete")
    print(f"  Processed: {succeeded} succeeded, {failed} failed")
    print(f"  {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print(f"{'#'*60}\n")


if __name__ == "__main__":
    main()