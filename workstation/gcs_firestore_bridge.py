"""
gcs_firestore_bridge.py
-----------------------

Handles all communication between the local workstation and Google Cloud:
  - Downloads patient videos from Google Cloud Storage
  - Writes TUG analysis results to Firestore
  - Tracks which videos have already been processed

Prerequisites:
    pip install google-cloud-storage google-cloud-firestore

Authentication:
    Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the path
    of your service account JSON key file:
    
    export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/gcloud-keys/tug-pipeline-sa.json"
"""

from google.cloud import storage, firestore
from pathlib import Path
from datetime import datetime, timezone
import json
import logging
from typing import List, Dict, Optional

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# --------------------------------------------------------------------------
# CDC STEADI fall-risk classification based on TUG total duration (seconds).
# --------------------------------------------------------------------------
PIPELINE_VERSION = "1.0"

def classify_fall_risk(tug_seconds: float) -> str:
    """
    Classify fall risk based on TUG total duration.
    
    CDC STEADI guidelines:
      <= 12s  -> low risk (normal for most community-dwelling older adults)
      12-20s  -> moderate risk (may indicate functional limitations)
      > 20s   -> high risk (strong predictor of falls)
    """
    if tug_seconds <= 12.0:
        return "low"
    elif tug_seconds <= 20.0:
        return "moderate"
    else:
        return "high"


class GCSFirestoreBridge:
    """
    Manages the data flow:
        GCS bucket (videos) -> local workstation -> Firestore (results)
    """

    def __init__(
        self,
        bucket_name: str,
        video_prefix: str = "",
        firestore_collection: str = "Users-StudyData",
    ):
        """
        Args:
            bucket_name:          Name of the GCS bucket (e.g. 'walking-test-video-uploads')
            video_prefix:         Folder path within the bucket where videos live (default: "")
            firestore_collection: Firestore collection to write results to (default: "Users-StudyData")
        """
        # ---- GCS client ----
        self.storage_client = storage.Client()
        self.bucket = self.storage_client.bucket(bucket_name)
        self.video_prefix = video_prefix

        # Verify bucket is accessible on startup
        if not self.bucket.exists():
            raise ValueError(
                f"Bucket '{bucket_name}' not found or not accessible. "
                f"Check that the service account has Storage Object Viewer role."
            )
        logger.info(f"Connected to GCS bucket: {bucket_name}")

        # ---- Firestore client ----
        self.db = firestore.Client()
        self.collection_name = firestore_collection
        logger.info(f"Connected to Firestore collection: {firestore_collection}")

    # ------------------------------------------------------------------
    # Discovery: which videos still need processing?
    # ------------------------------------------------------------------
    def get_pending_videos(self) -> List[Dict]:
        video_extensions = ('.mp4', '.mov', '.avi', '.mkv')
        blobs = self.bucket.list_blobs(prefix=self.video_prefix)
    
        pending = []
        for blob in blobs:
            if blob.name.lower().endswith(video_extensions):
                # filename: {participantID}_{sessionId}_{timestamp}.mp4
                stem = Path(blob.name).stem  
                parts = stem.split("_")
                participant_id = parts[0]                     
                session_id = f"{parts[1]}"          
                pending.append({
                    "participant_id": participant_id,
                    "session_id": session_id,
                    "blob_name": blob.name
                })
    
        logger.info(f"Found {len(pending)} video(s) pending processing.")
        return pending
        
    # ------------------------------------------------------------------
    # Download
    # ------------------------------------------------------------------
    def download_video(self, blob_name: str, local_dir: str) -> Path:
        """
        Download a video from GCS to the local workstation.

        Args:
            blob_name: Full blob path in GCS (e.g. '{uid}/{participantID}_{timestamp}.mp4')
            local_dir: Local directory to save the video

        Returns:
            Path to the downloaded local file.
        """
        local_dir = Path(local_dir).expanduser()
        local_dir.mkdir(parents=True, exist_ok=True)

        local_path = local_dir / Path(blob_name).name
        blob = self.bucket.blob(blob_name)
        blob.download_to_filename(str(local_path))

        size_mb = local_path.stat().st_size / (1024 * 1024)
        logger.info(f"Downloaded gs://{self.bucket.name}/{blob_name} -> {local_path} ({size_mb:.1f} MB)")
        return local_path

    # ------------------------------------------------------------------
    # Delete from bucket after download
    # ------------------------------------------------------------------
    def delete_video(self, blob_name: str):
        """
        Delete a video from GCS after it has been successfully downloaded
        and queued for processing.

        Args:
            blob_name: Full blob path in GCS (e.g. '{uid}/{participantID}_{timestamp}.mp4')
        """
        blob = self.bucket.blob(blob_name)
        blob.delete()
        logger.info(f"Deleted gs://{self.bucket.name}/{blob_name} from bucket.")

    # ------------------------------------------------------------------
    # Firestore writes
    # ------------------------------------------------------------------
    def mark_processing(self, participant_id: str, session_id: str, video_blob_name: str):
      self.db.collection(self.collection_name)\
          .document(participant_id)\
          .collection("assessments")\
          .document(session_id)\
          .set({
              "tugTest": {
                  "status": "processing",
                  "source_video_gcs_path": video_blob_name,
                  "pipeline_version": PIPELINE_VERSION,
                  "created_at": firestore.SERVER_TIMESTAMP,
                  "processed_at": None,
                  "tug_count": None,
                  "fall_risk": None,
                  "tug_tests": None,
                  "fps": None,
                  "error_message": None,
              }
          }, merge=True)
      logger.info(f"Marked processing: {participant_id}/assessments/{session_id}")


    def save_results(self, participant_id: str, session_id: str, json_results_path: str, fps: float):
        """
        Read the pipeline's JSON output and merge results into the existing
        Users-StudyData document for this participant.

        Args:
            participant_id:    The participant ID extracted from the video filename
            json_results_path: Path to the _tug_results.json file produced by the pipeline
            fps:               Frames per second used during analysis
        """
        with open(json_results_path, 'r') as f:
          tug_tests = json.load(f)
    
        if tug_tests:
            avg_duration = sum(t['tug_duration'] for t in tug_tests) / len(tug_tests)
            fall_risk = classify_fall_risk(avg_duration)
        else:
            fall_risk = "unknown"
    
        self.db.collection(self.collection_name)\
            .document(participant_id)\
            .collection("assessments")\
            .document(session_id)\
            .set({
                "tugTest": {
                    "status": "completed",
                    "processed_at": firestore.SERVER_TIMESTAMP,
                    "fps": fps,
                    "tug_count": len(tug_tests),
                    "fall_risk": fall_risk,
                    "tug_tests": tug_tests,
                    "error_message": None,
                }
            }, merge=True)
        logger.info(f"Saved results: {participant_id}/assessments/{session_id} | fall_risk={fall_risk}")


    def mark_failed(self, participant_id: str, session_id: str, error_message: str):
      self.db.collection(self.collection_name)\
        .document(participant_id)\
        .collection("assessments")\
        .document(session_id)\
        .set({
            "tugTest": {
                "status": "failed",
                "processed_at": firestore.SERVER_TIMESTAMP,
                "error_message": error_message,
            }
        }, merge=True)
      logger.error(f"Failed: {participant_id}/assessments/{session_id} | {error_message}")

    # NEW METHOD
    def find_video_blob(self, prefix: str, patient_id: str) -> Optional[str]:
        """
        Search the bucket for a video file matching the patient_id,
        regardless of file extension.

        Args:
            prefix:     Folder prefix (e.g. 'videos/')
            patient_id: Filename stem to match (e.g. 'patient_x_video')

        Returns:
            The full blob name (e.g. 'videos/patient_x_video.mov') or None
        """
        video_extensions = ('.mp4', '.mov', '.avi', '.mkv')

        # List only blobs that start with the prefix + patient_id
        # This narrows the search so we're not scanning the entire bucket
        blobs = self.bucket.list_blobs(prefix=f"{prefix}{patient_id}")

        for blob in blobs:
            stem = Path(blob.name).stem
            ext = Path(blob.name).suffix.lower()
            if stem == patient_id and ext in video_extensions:
                logger.info(f"Found video: {blob.name}")
                return blob.name

        return None