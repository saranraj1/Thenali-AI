"""
Voice API routes — transcription and speech synthesis.
"""
import logging
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import Response

from config import settings
from models.schemas import SpeakRequest
from utils.auth import get_current_user
from services.aws.s3 import s3_service
from services.aws.transcribe import transcribe_service
from services.aws.polly import polly_service
from services.evaluation import evaluation_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/voice", tags=["Voice"])


@router.post("/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    language_code: str = Form(default="en-US"),
    current_user: dict = Depends(get_current_user),
):
    """
    Upload audio to S3, transcribe with Amazon Transcribe.
    Returns transcript text.
    """
    user_id = current_user["sub"]

    # Validate content type
    allowed_types = {"audio/mpeg", "audio/mp3", "audio/wav", "audio/webm", "audio/ogg", "audio/flac"}
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format: {file.content_type}. Allowed: {', '.join(allowed_types)}",
        )

    # Upload to S3
    ext = file.filename.rsplit(".", 1)[-1] if file.filename and "." in file.filename else "mp3"
    s3_key = f"voice/{user_id}/{uuid.uuid4().hex}.{ext}"

    try:
        s3_service.ensure_bucket_exists(settings.S3_VOICE_BUCKET)
        s3_service.upload_file(
            bucket=settings.S3_VOICE_BUCKET,
            key=s3_key,
            file_obj=file.file,
            content_type=file.content_type or "audio/mpeg",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"S3 upload failed: {e}")

    # Transcribe
    try:
        s3_uri = f"s3://{settings.S3_VOICE_BUCKET}/{s3_key}"
        transcript = transcribe_service.transcribe_s3_audio(
            s3_uri=s3_uri,
            language_code=language_code,
        )
        return {
            "transcript": transcript,
            "s3_key": s3_key,
            "language_code": language_code,
        }
    except TimeoutError as e:
        raise HTTPException(status_code=504, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {e}")


@router.post("/speak")
async def text_to_speech(
    body: SpeakRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Convert text to speech using Amazon Polly.
    Returns audio bytes as audio/mpeg.
    """
    try:
        audio_bytes = polly_service.synthesize_speech(
            text=body.text[:3000],  # Polly limit
            voice_id=body.voice_id or "Kajal",
            language_code=body.language_code or "en-IN",
            output_format=body.output_format or "mp3",
        )
        return Response(
            content=audio_bytes,
            media_type=f"audio/{body.output_format or 'mpeg'}",
            headers={"Content-Disposition": "inline; filename=speech.mp3"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS failed: {e}")


@router.get("/voices")
async def list_voices(
    language_code: str = "en-IN",
    current_user: dict = Depends(get_current_user),
):
    """List available Polly voices."""
    voices = polly_service.list_voices(language_code=language_code)
    return {"voices": voices, "language_code": language_code}
