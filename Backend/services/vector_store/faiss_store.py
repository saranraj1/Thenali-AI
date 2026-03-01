"""
FAISS vector store — per-repository index management.
Each repository gets its own FAISS index stored at:
  {FAISS_INDEX_PATH}/{repo_id}/index.faiss
  {FAISS_INDEX_PATH}/{repo_id}/chunks.json
"""
import os
import json
import logging
import numpy as np
from typing import List, Dict, Any, Optional, Tuple

from config import settings
from services.embeddings import embed_texts, embed_single, get_embedding_dimension

logger = logging.getLogger(__name__)

try:
    import faiss
    FAISS_AVAILABLE = True
except ImportError:
    logger.warning("faiss-cpu not installed. Vector store will be disabled.")
    FAISS_AVAILABLE = False


class VectorStore:
    """
    Per-repository FAISS index with chunk metadata persistence.
    """

    def __init__(self, repo_id: str):
        self.repo_id = repo_id
        self.index_dir = os.path.join(settings.FAISS_INDEX_PATH, repo_id)
        self.index_path = os.path.join(self.index_dir, "index.faiss")
        self.chunks_path = os.path.join(self.index_dir, "chunks.json")
        self._index = None
        self._chunks: List[Dict[str, Any]] = []

    def _load(self):
        """Load index and chunks from disk if they exist."""
        if not FAISS_AVAILABLE:
            return
        if os.path.exists(self.index_path) and os.path.exists(self.chunks_path):
            self._index = faiss.read_index(self.index_path)
            with open(self.chunks_path, "r", encoding="utf-8") as f:
                self._chunks = json.load(f)
            logger.info(f"Loaded FAISS index for repo '{self.repo_id}' with {len(self._chunks)} chunks.")

    def _save(self):
        """Persist index and chunks to disk."""
        if not FAISS_AVAILABLE or self._index is None:
            return
        os.makedirs(self.index_dir, exist_ok=True)
        faiss.write_index(self._index, self.index_path)
        with open(self.chunks_path, "w", encoding="utf-8") as f:
            json.dump(self._chunks, f, ensure_ascii=False)
        logger.info(f"Saved FAISS index for repo '{self.repo_id}' with {len(self._chunks)} chunks.")

    def build(self, chunks: List[Dict[str, Any]]):
        """
        Build a new FAISS index from chunks.
        Each chunk dict must have 'text' key.
        """
        if not FAISS_AVAILABLE:
            logger.warning("FAISS not available, skipping index build.")
            return

        texts = [c["text"] for c in chunks]
        if not texts:
            logger.warning(f"No texts to index for repo '{self.repo_id}'.")
            return

        embeddings = embed_texts(texts)
        dim = embeddings.shape[1]

        self._index = faiss.IndexFlatIP(dim)  # Inner product on normalized vectors = cosine sim
        self._index.add(embeddings.astype(np.float32))
        self._chunks = chunks
        self._save()
        logger.info(f"Built FAISS index with {len(chunks)} chunks for repo '{self.repo_id}'.")

    def search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Search the index for the most relevant chunks.
        Returns list of chunk dicts with added 'score' field.
        """
        if not FAISS_AVAILABLE:
            return []

        if self._index is None:
            self._load()

        if self._index is None or self._index.ntotal == 0:
            logger.warning(f"Empty or missing FAISS index for repo '{self.repo_id}'.")
            return []

        query_vec = embed_single(query).reshape(1, -1).astype(np.float32)
        k = min(top_k, self._index.ntotal)
        scores, indices = self._index.search(query_vec, k)

        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < 0 or idx >= len(self._chunks):
                continue
            chunk = dict(self._chunks[idx])
            chunk["score"] = float(score)
            results.append(chunk)

        return results

    def exists(self) -> bool:
        return os.path.exists(self.index_path) and os.path.exists(self.chunks_path)


class VectorStoreManager:
    """Manages VectorStore instances per repository (cached in memory)."""

    def __init__(self):
        self._stores: Dict[str, VectorStore] = {}

    def get_store(self, repo_id: str) -> VectorStore:
        if repo_id not in self._stores:
            self._stores[repo_id] = VectorStore(repo_id)
        return self._stores[repo_id]

    def build_store(self, repo_id: str, chunks: List[Dict[str, Any]]) -> VectorStore:
        store = self.get_store(repo_id)
        store.build(chunks)
        return store

    def search_store(self, repo_id: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        store = self.get_store(repo_id)
        return store.search(query, top_k=top_k)

    def store_exists(self, repo_id: str) -> bool:
        return self.get_store(repo_id).exists()


vector_store_manager = VectorStoreManager()
