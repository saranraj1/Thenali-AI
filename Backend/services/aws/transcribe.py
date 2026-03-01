"""
Amazon Transcribe — speech-to-text for voice interviews.
"""
import logging
import time
import uuid

import boto3
from botocore.exceptions import ClientError

from config import settings

logger = logging.getLogger(__name__)


class TranscribeService:
    def __init__(self):
        self._client = None

    @property
    def client(self):
        if self._client is None:
            self._client = boto3.client(
                "transcribe",
                region_name=settings.AWS_REGION,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            )
        return self._client

    def transcribe_s3_audio(
        self,
        s3_uri: str,
        language_code: str = "en-US",
        max_wait_seconds: int = 120,
    ) -> str:
        """
        Start a transcription job for an S3 audio file and poll until done.
        Returns the transcript text.
        """
        job_name = f"bharat-ai-{uuid.uuid4().hex[:8]}"

        try:
            self.client.start_transcription_job(
                TranscriptionJobName=job_name,
                Media={"MediaFileUri": s3_uri},
                MediaFormat=s3_uri.rsplit(".", 1)[-1].lower() or "mp3",
                LanguageCode=language_code,
            )
        except ClientError as e:
            logger.error(f"Transcribe start failed: {e}")
            raise RuntimeError(f"Transcribe start failed: {e}")

        # Poll for completion
        elapsed = 0
        poll_interval = 5
        while elapsed < max_wait_seconds:
            try:
                response = self.client.get_transcription_job(
                    TranscriptionJobName=job_name
                )
                job = response["TranscriptionJob"]
                status = job["TranscriptionJobStatus"]

                if status == "COMPLETED":
                    transcript_uri = job["Transcript"]["TranscriptFileUri"]
                    import urllib.request, json as _json
                    with urllib.request.urlopen(transcript_uri) as resp:
                        data = _json.loads(resp.read().decode())
                    return data["results"]["transcripts"][0]["transcript"]

                if status == "FAILED":
                    reason = job.get("FailureReason", "Unknown")
                    raise RuntimeError(f"Transcription failed: {reason}")

            except ClientError as e:
                logger.warning(f"Transcribe poll error: {e}")

            time.sleep(poll_interval)
            elapsed += poll_interval

        raise TimeoutError(f"Transcription job '{job_name}' timed out after {max_wait_seconds}s")


transcribe_service = TranscribeService()
