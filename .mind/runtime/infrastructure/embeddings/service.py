"""
Embedding Service

Generates embeddings for semantic search using sentence-transformers.
Based on Mind Protocol's embedding_service.py pattern.

DOCS: docs/infrastructure/embeddings/
"""

import hashlib
import json
import logging
import os
from pathlib import Path
from typing import List, Dict, Any, Optional
import numpy as np

logger = logging.getLogger(__name__)

# Singleton instance
_embedding_service: Optional['EmbeddingService'] = None

# Cache file location: .mind/cache/embeddings.json
_CACHE_DIR = Path(".mind/cache")
_CACHE_FILE = _CACHE_DIR / "embedding_hashes.json"


class EmbeddingService:
    """
    Embedding service using sentence-transformers.

    Uses all-mpnet-base-v2 (768 dimensions) for high-quality embeddings.
    Hash-based cache: if text hasn't changed, skip re-embedding.
    """

    def __init__(self, model_name: str = "sentence-transformers/all-mpnet-base-v2"):
        self.model_name = model_name
        self.model = None
        self.dimension = 768
        self._cache = {}  # hash -> embedding vector
        self._cache_hits = 0
        self._cache_misses = 0
        self._load_cache()

        logger.info(f"[EmbeddingService] Initializing with {model_name}")

    def _load_cache(self):
        """Load hash→embedding cache from disk."""
        try:
            if _CACHE_FILE.exists():
                data = json.loads(_CACHE_FILE.read_text())
                self._cache = data
                logger.info(f"[EmbeddingService] Cache loaded: {len(self._cache)} entries")
        except Exception as e:
            logger.debug(f"[EmbeddingService] Cache load failed: {e}")
            self._cache = {}

    def save_cache(self):
        """Persist cache to disk. Called after batch operations."""
        try:
            _CACHE_DIR.mkdir(parents=True, exist_ok=True)
            _CACHE_FILE.write_text(json.dumps(self._cache))
            logger.info(
                f"[EmbeddingService] Cache saved: {len(self._cache)} entries "
                f"(hits={self._cache_hits}, misses={self._cache_misses})"
            )
        except Exception as e:
            logger.debug(f"[EmbeddingService] Cache save failed: {e}")

    @staticmethod
    def _hash_text(text: str) -> str:
        return hashlib.sha256(text.encode()).hexdigest()[:16]

    def _load_model(self):
        """Lazy load the model. Fails if sentence-transformers not installed."""
        if self.model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self.model = SentenceTransformer(self.model_name)
                self.dimension = self.model.get_sentence_embedding_dimension()
                logger.info(f"[EmbeddingService] Loaded model ({self.dimension} dimensions)")
            except ImportError as e:
                raise ImportError(
                    "sentence-transformers is required for embeddings. "
                    "Install with: pip install sentence-transformers"
                ) from e

    def embed(self, text: str) -> List[float]:
        """Generate embedding for text, using cache if available."""
        if not text or not text.strip():
            return [0.0] * self.dimension

        h = self._hash_text(text)
        if h in self._cache:
            self._cache_hits += 1
            return self._cache[h]

        self._load_model()
        embedding = self.model.encode(text, normalize_embeddings=True).tolist()
        self._cache[h] = embedding
        self._cache_misses += 1
        return embedding

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts, skipping cached ones.

        Only sends uncached texts to the model. Returns all results in order.
        """
        if not texts:
            return []

        valid_texts = [t if t and t.strip() else " " for t in texts]
        hashes = [self._hash_text(t) for t in valid_texts]

        # Separate cached from uncached
        results = [None] * len(valid_texts)
        uncached_indices = []
        uncached_texts = []

        for i, h in enumerate(hashes):
            if h in self._cache:
                results[i] = self._cache[h]
                self._cache_hits += 1
            else:
                uncached_indices.append(i)
                uncached_texts.append(valid_texts[i])

        # Only embed what's new
        if uncached_texts:
            self._load_model()
            new_embeddings = self.model.encode(uncached_texts, normalize_embeddings=True).tolist()
            for idx, emb in zip(uncached_indices, new_embeddings):
                results[idx] = emb
                self._cache[hashes[idx]] = emb
                self._cache_misses += 1

        # Auto-save cache after batch
        if uncached_texts:
            self.save_cache()

        cached_pct = round(self._cache_hits / max(self._cache_hits + self._cache_misses, 1) * 100)
        if len(texts) > 10:
            logger.info(
                f"[EmbeddingService] Batch: {len(texts)} total, "
                f"{len(uncached_texts)} new, {len(texts) - len(uncached_texts)} cached ({cached_pct}%)"
            )

        return results

    def embed_node(self, node: Dict[str, Any]) -> List[float]:
        """
        Generate embedding for a node based on its type.

        Args:
            node: Node dict with 'type' and relevant fields

        Returns:
            Embedding vector
        """
        node_type = node.get('type', '')
        text = self._node_to_text(node, node_type)
        return self.embed(text)

    def _node_to_text(self, node: Dict[str, Any], node_type: str) -> str:
        """Convert node to embeddable text."""
        parts = []

        if node_type == 'character':
            parts.append(f"{node.get('name', '')}")
            if node.get('backstory_wound'):
                parts.append(f"Wound: {node['backstory_wound']}")
            if node.get('backstory_why_here'):
                parts.append(f"Why here: {node['backstory_why_here']}")
            if node.get('values'):
                vals = node['values']
                if isinstance(vals, list):
                    parts.append(f"Values: {', '.join(vals)}")

        elif node_type == 'place':
            parts.append(f"{node.get('name', '')}, {node.get('place_type', 'place')}")
            if node.get('mood'):
                parts.append(f"Mood: {node['mood']}")
            if node.get('details'):
                details = node['details']
                if isinstance(details, list):
                    parts.append(f"Details: {', '.join(details)}")

        elif node_type == 'thing':
            parts.append(f"{node.get('name', '')}")
            if node.get('content'):
                parts.append(node['content'])
            if node.get('significance') and node['significance'] != 'mundane':
                parts.append(f"Significance: {node['significance']}")

        elif node_type == 'narrative':
            parts.append(f"{node.get('name', '')}: {node.get('content', '')}")
            if node.get('interpretation'):
                parts.append(f"Meaning: {node['interpretation']}")

        elif node_type == 'moment':
            if node.get('speaker'):
                parts.append(f"{node['speaker']}: {node.get('content', '')}")
            else:
                parts.append(node.get('content', ''))

        else:
            # Generic fallback: name + content
            parts.append(node.get('name', ''))
            parts.append(node.get('content', ''))

        return '. '.join(p for p in parts if p)

    def embed_link(self, props: Dict[str, Any], link_type: str) -> List[float]:
        """
        Generate embedding for a link based on its semantic properties.

        Mirrors LinkBase.embeddable_text() pattern:
        - type and direction
        - name and description
        - role
        - emotions (if present)

        Args:
            props: Link properties dict
            link_type: Link type string (e.g., 'RELATES', 'ABOUT')

        Returns:
            Embedding vector (768 dimensions)
        """
        parts = [f"{link_type} link"]

        if props.get('name'):
            parts.append(props['name'])

        if props.get('direction'):
            parts.append(f"direction: {props['direction']}")

        if props.get('role'):
            parts.append(f"role: {props['role']}")

        if props.get('description'):
            parts.append(props['description'])

        # Emotions are stored as list of [name, intensity]
        emotions = props.get('emotions', [])
        if emotions and isinstance(emotions, list):
            emotion_strs = []
            for e in emotions[:3]:
                if isinstance(e, list) and len(e) >= 1:
                    emotion_strs.append(str(e[0]))
                elif isinstance(e, str):
                    emotion_strs.append(e)
            if emotion_strs:
                parts.append(f"emotions: {', '.join(emotion_strs)}")

        text = ". ".join(parts)
        return self.embed(text)

    def similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """
        Compute cosine similarity between two vectors.

        Args:
            vec1: First vector
            vec2: Second vector

        Returns:
            Similarity score (0-1 for normalized vectors)
        """
        a = np.array(vec1)
        b = np.array(vec2)
        return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def get_embedding_service() -> EmbeddingService:
    """Get singleton embedding service instance."""
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = EmbeddingService()
    return _embedding_service
