"""
Amazon Polly — text-to-speech for AI voice responses.
"""
import logging

import boto3
from botocore.exceptions import ClientError

from config import settings

logger = logging.getLogger(__name__)


class PollyService:
    def __init__(self):
        self._client = None

    @property
    def client(self):
        if self._client is None:
            self._client = boto3.client(
                "polly",
                region_name=settings.AWS_REGION,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            )
        return self._client

    # Voice IDs that support Neural engine
    NEURAL_VOICES = {
        "en-IN": "Kajal",
        "en-US": "Joanna",
        "en-GB": "Amy",
        "hi-IN": "Kajal",
    }

    def synthesize_speech(
        self,
        text: str,
        voice_id: str = "Kajal",
        language_code: str = "en-IN",
        output_format: str = "mp3",
        engine: str = "neural",
    ) -> bytes:
        """
        Synthesize text to speech and return audio bytes.
        Falls back to standard engine if neural is not available.
        """
        try:
            response = self.client.synthesize_speech(
                Text=text,
                VoiceId=voice_id,
                LanguageCode=language_code,
                OutputFormat=output_format,
                Engine=engine,
            )
            return response["AudioStream"].read()
        except ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "ValidationException" and engine == "neural":
                logger.warning(f"Neural TTS not available for {voice_id}, falling back to standard.")
                return self.synthesize_speech(
                    text, voice_id, language_code, output_format, engine="standard"
                )
            logger.error(f"Polly synthesis failed: {e}")
            raise RuntimeError(f"TTS failed: {e}")

    def list_voices(self, language_code: str = "en-IN"):
        """List available Polly voices for a language."""
        try:
            response = self.client.describe_voices(LanguageCode=language_code)
            return response.get("Voices", [])
        except ClientError as e:
            logger.warning(f"Could not list Polly voices: {e}")
            return []


polly_service = PollyService()
