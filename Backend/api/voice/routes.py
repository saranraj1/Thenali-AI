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
    Transcribe audio using local Whisper model.

    AWS Transcribe is NOT available in ap-south-1, so we use Whisper (CPU)
    consistently with the assessment voice endpoint.

    Accepts: webm, wav, mp4 (Safari), ogg, mp3, flac
    Returns: { transcript, language_code }
    """
    content_type = file.content_type or "audio/webm"

    # Some browsers (Safari, older Android) send application/octet-stream
    # for recorded audio — be lenient and accept it.
    allowed_types = {
        "audio/mpeg", "audio/mp3", "audio/wav",
        "audio/webm", "audio/ogg", "audio/flac",
        "audio/mp4", "video/mp4",          # Safari records mp4
        "application/octet-stream",        # fallback
    }
    if content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format: {content_type}. "
                   f"Allowed: webm, wav, mp4, ogg, mp3, flac",
        )

    try:
        audio_bytes = await file.read()
        if len(audio_bytes) < 500:
            raise HTTPException(
                status_code=400,
                detail="Audio too short — please record a longer answer.",
            )

        from services.whisper_transcriber import transcribe_async
        transcript = await transcribe_async(audio_bytes, content_type)

        return {
            "transcript": transcript,
            "language_code": language_code,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Voice transcription error: {e}", exc_info=True)
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
