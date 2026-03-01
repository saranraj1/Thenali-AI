"""
General utility helpers.
"""
import uuid
import hashlib
from datetime import datetime, timezone
from typing import Any, Dict


def generate_id(prefix: str = "") -> str:
    """Generate a unique ID with optional prefix."""
    uid = str(uuid.uuid4()).replace("-", "")
    return f"{prefix}{uid}" if prefix else uid


def utc_now_iso() -> str:
    """Return current UTC time in ISO 8601 format."""
    return datetime.now(timezone.utc).isoformat()


def sanitize_repo_name(url: str) -> str:
    """Extract a safe repo name from a GitHub URL."""
    parts = url.rstrip("/").split("/")
    return parts[-1].replace(".git", "") if parts else "repo"


def truncate_text(text: str, max_len: int = 4000) -> str:
    """Truncate text to fit within model context limits."""
    return text[:max_len] + "..." if len(text) > max_len else text


def flatten_dict(d: Dict[str, Any], parent_key: str = "", sep: str = ".") -> Dict[str, Any]:
    """Flatten a nested dictionary."""
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)


def chunk_list(lst: list, size: int) -> list:
    """Split a list into chunks of given size."""
    return [lst[i : i + size] for i in range(0, len(lst), size)]


def sha256_hash(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()
