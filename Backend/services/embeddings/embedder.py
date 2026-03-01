"""
Embedding service using sentence-transformers all-MiniLM-L6-v2.
Lazy loads the model on first use.
"""
import logging
import numpy as np
from typing import List, Optional

from config import settings

logger = logging.getLogger(__name__)

_model = None


def get_embedding_model():
    global _model
    if _model is None:
        logger.info(f"Loading embedding model: {settings.EMBEDDING_MODEL}")
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer(settings.EMBEDDING_MODEL)
        logger.info("Embedding model loaded successfully.")
    return _model


def embed_texts(texts: List[str], batch_size: int = 32) -> np.ndarray:
    """
    Generate embeddings for a list of texts.
    Returns numpy array of shape (N, D).
    """
    if not texts:
        return np.array([])
    model = get_embedding_model()
    embeddings = model.encode(
        texts,
        batch_size=batch_size,
        show_progress_bar=len(texts) > 100,
        convert_to_numpy=True,
        normalize_embeddings=True,
    )
    return embeddings


def embed_single(text: str) -> np.ndarray:
    """Embed a single text string."""
    return embed_texts([text])[0]


def get_embedding_dimension() -> int:
    """Return the embedding dimension (384 for all-MiniLM-L6-v2)."""
    model = get_embedding_model()
    return model.get_sentence_embedding_dimension()
