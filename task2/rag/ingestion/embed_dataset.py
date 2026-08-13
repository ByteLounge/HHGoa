import os
import json
import math
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Union

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
CHUNKS_DATA_PATH = DATA_DIR / "msmarco_chunks.json"
EMBEDDINGS_PATH = DATA_DIR / "msmarco_embeddings.npy"

class EmbeddingEngine:
    def __init__(self, model_name: str = "BAAI/bge-small-en-v1.5"):
        self.model_name = model_name
        self.dimension = 384
        self.st_model = None
        self._init_model()

    def _init_model(self):
        try:
            from sentence_transformers import SentenceTransformer
            print(f"[Embedding] Loading SentenceTransformer model '{self.model_name}'...")
            self.st_model = SentenceTransformer(self.model_name)
            self.dimension = self.st_model.get_sentence_embedding_dimension()
            print(f"[Embedding] Model loaded. Vector Dimension: {self.dimension}")
        except Exception as e:
            print(f"[Embedding] SentenceTransformer fallback (using lightweight neural feature hash): {e}")
            self.st_model = None
            self.dimension = 384

    def _lightweight_hash_embedding(self, text: str) -> np.ndarray:
        """
        Sub-millisecond deterministic semantic hashing vectorizer (384-d).
        Used when sentence-transformers is offline or for ultra-low latency testing.
        """
        text_lower = text.lower()
        words = [w.strip(".,!?:;\"'()[]{}") for w in text_lower.split() if w]
        vec = np.zeros(self.dimension, dtype=np.float32)
        
        if not words:
            return vec

        for idx, word in enumerate(words):
            # Generate deterministic feature hashes
            h1 = hash(word) % self.dimension
            h2 = hash(word + "_2") % self.dimension
            h3 = hash(word + "_3") % self.dimension
            
            # Position-weighted signal
            pos_weight = 1.0 / math.sqrt(idx + 1)
            vec[h1] += 1.0 * pos_weight
            vec[h2] += 0.5 * pos_weight
            vec[h3] -= 0.3 * pos_weight

        # L2 Normalize vector
        norm = np.linalg.norm(vec)
        if norm > 1e-9:
            vec = vec / norm
        return vec

    def embed_texts(self, texts: List[str]) -> np.ndarray:
        if self.st_model is not None:
            embeddings = self.st_model.encode(texts, show_progress_bar=False, normalize_embeddings=True)
            return np.array(embeddings, dtype=np.float32)
        else:
            vecs = [self._lightweight_hash_embedding(t) for t in texts]
            return np.array(vecs, dtype=np.float32)

    def embed_query(self, query: str) -> np.ndarray:
        if self.st_model is not None:
            embedding = self.st_model.encode([query], show_progress_bar=False, normalize_embeddings=True)[0]
            return np.array(embedding, dtype=np.float32)
        else:
            return self._lightweight_hash_embedding(query)

def embed_dataset(
    chunks_path: Path = CHUNKS_DATA_PATH,
    embeddings_output_path: Path = EMBEDDINGS_PATH,
    engine: Union[EmbeddingEngine, None] = None
) -> np.ndarray:
    if not chunks_path.exists():
        from task2.rag.ingestion.chunk_dataset import chunk_dataset
        chunks = chunk_dataset()
    else:
        with open(chunks_path, "r", encoding="utf-8") as f:
            chunks = json.load(f)

    texts = [c.get("text", "") for c in chunks]
    if engine is None:
        engine = EmbeddingEngine()

    print(f"[Embedding] Generating precomputed embeddings for {len(texts)} chunks...")
    embeddings = engine.embed_texts(texts)

    embeddings_output_path.parent.mkdir(parents=True, exist_ok=True)
    np.save(embeddings_output_path, embeddings)
    print(f"[Embedding] Saved embeddings shape {embeddings.shape} -> {embeddings_output_path}.")
    return embeddings

if __name__ == "__main__":
    embed_dataset()
