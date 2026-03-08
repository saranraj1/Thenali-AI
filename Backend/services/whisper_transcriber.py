"""
Whisper-based speech-to-text transcription.
Replaces Amazon Transcribe.
Runs locally on CPU — no AWS subscription needed.
"""
import os
import sys
import tempfile
import logging
import shutil
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)

# ── ffmpeg PATH fix for Windows ──────────────────────────────────────────────
# Whisper needs ffmpeg to decode audio formats (webm, ogg, mp4, etc.)
# winget installs it under AppData but doesn't always update the current
# process PATH. We probe common locations and inject whichever we find.
def _ensure_ffmpeg_in_path() -> None:
    """
    Add ffmpeg to current process PATH if not already there.
    Cross-platform: works on Linux (EC2) and Windows (dev machine).
    """
    import shutil, platform

    # Already on PATH — nothing to do
    if shutil.which("ffmpeg"):
        return

    system = platform.system()

    if system == "Windows":
        _static_locations = [
            r"C:\ffmpeg\bin",
            r"C:\Program Files\ffmpeg\bin",
            r"C:\Program Files (x86)\ffmpeg\bin",
            r"C:\ProgramData\chocolatey\bin",
            r"C:\tools\ffmpeg\bin",
            os.path.expanduser(r"~\ffmpeg\bin"),
        ]
        # Dynamically scan WinGet packages directory for any ffmpeg install
        winget_root = os.path.join(
            os.environ.get("LOCALAPPDATA", ""),
            "Microsoft", "WinGet", "Packages"
        )
        if os.path.isdir(winget_root):
            try:
                for pkg in os.listdir(winget_root):
                    if "ffmpeg" in pkg.lower():
                        pkg_path = os.path.join(winget_root, pkg)
                        for sub in os.listdir(pkg_path):
                            candidate = os.path.join(pkg_path, sub, "bin")
                            if os.path.isdir(candidate):
                                _static_locations.insert(0, candidate)
                        if os.path.isdir(os.path.join(pkg_path, "bin")):
                            _static_locations.insert(0, os.path.join(pkg_path, "bin"))
            except Exception:
                pass
    else:
        # Linux / macOS (EC2 Ubuntu, etc.)
        _static_locations = [
            "/usr/bin",
            "/usr/local/bin",
            "/snap/bin",
            "/opt/homebrew/bin",   # macOS with Homebrew
        ]

    current_path = os.environ.get("PATH", "")
    exe_name = "ffmpeg.exe" if system == "Windows" else "ffmpeg"

    for loc in _static_locations:
        ffmpeg_exe = os.path.join(loc, exe_name)
        if os.path.isfile(ffmpeg_exe) and loc not in current_path:
            os.environ["PATH"] = loc + os.pathsep + current_path
            logger.info(f"Added ffmpeg to PATH: {loc}")
            return



# Run at import time so the PATH is set before Whisper tries to call ffmpeg
_ensure_ffmpeg_in_path()

# ─────────────────────────────────────────────────────────────────────────────

# Global model instance — loaded once, reused
_whisper_model = None
_executor = ThreadPoolExecutor(max_workers=2)


def get_whisper_model():
    """
    Load Whisper base model.
    Downloads ~150MB on first run, then cached at ~/.cache/whisper/
    Thread-safe singleton.
    """
    global _whisper_model
    if _whisper_model is None:
        logger.info("Loading Whisper model (first run downloads ~150MB)...")
        import whisper
        _whisper_model = whisper.load_model("base")
        logger.info("Whisper model loaded OK")
    return _whisper_model


def _verify_ffmpeg() -> str:
    """
    Locate ffmpeg executable.
    Re-runs path fix then does a shutil.which search.
    Raises RuntimeError with actionable message if not found.
    """
    _ensure_ffmpeg_in_path()

    ffmpeg_path = shutil.which("ffmpeg")
    if ffmpeg_path:
        return ffmpeg_path

    raise RuntimeError(
        "ffmpeg not found. Whisper requires ffmpeg to decode audio.\n"
        "Fix (Linux/EC2):  sudo apt update && sudo apt install -y ffmpeg\n"
        "Fix (Windows):    winget install ffmpeg   (then restart server)\n"
        "Then restart the backend server."
    )


def transcribe_sync(
    audio_bytes: bytes,
    content_type: str = "audio/webm"
) -> str:
    """
    Transcribe audio bytes to text using Whisper.
    Runs synchronously — call via transcribe_async() to avoid
    blocking the FastAPI event loop.

    Args:
        audio_bytes: Raw audio file bytes
        content_type: MIME type of audio

    Returns:
        Transcribed text string
    """
    # Ensure ffmpeg is reachable (re-checks in case env changed)
    ffmpeg_path = _verify_ffmpeg()
    logger.info(f"Using ffmpeg at: {ffmpeg_path}")

    # Determine file extension from content type
    suffix = ".webm"
    if "wav" in content_type:
        suffix = ".wav"
    elif "mp4" in content_type:
        suffix = ".mp4"
    elif "ogg" in content_type:
        suffix = ".ogg"
    elif "mpeg" in content_type or "mp3" in content_type:
        suffix = ".mp3"

    tmp_path = None
    try:
        # Write to temp file (Whisper needs a file path, not bytes)
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        logger.info(f"Transcribing: {len(audio_bytes)} bytes, format={suffix}")

        model = get_whisper_model()
        result = model.transcribe(
            tmp_path,
            language="en",
            fp16=False,      # CPU mode — no GPU required
            verbose=False,
        )

        transcript = result["text"].strip()

        if len(transcript) > 50:
            logger.info(f"Transcription complete: '{transcript[:50]}...'")
        else:
            logger.info(f"Transcription complete: '{transcript}'")

        return transcript if transcript else "[No speech detected]"

    except Exception as e:
        logger.error(f"Whisper transcription failed: {e}", exc_info=True)
        raise RuntimeError(f"Transcription failed: {str(e)}")

    finally:
        # Always clean up temp file
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except Exception:
                pass


async def transcribe_async(
    audio_bytes: bytes,
    content_type: str = "audio/webm"
) -> str:
    """
    Async wrapper for transcribe_sync.
    Runs Whisper in a thread pool to avoid blocking FastAPI event loop.
    """
    import asyncio
    loop = asyncio.get_event_loop()
    transcript = await loop.run_in_executor(
        _executor,
        transcribe_sync,
        audio_bytes,
        content_type,
    )
    return transcript


def test_whisper() -> dict:
    """
    Quick self-test — verifies Whisper is installed and model loads.
    Returns status dict.
    """
    try:
        model = get_whisper_model()
        return {
            "status": "ok",
            "model": "base",
            "device": str(getattr(model, "device", "cpu")),
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
        }
