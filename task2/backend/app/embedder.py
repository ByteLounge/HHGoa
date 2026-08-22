"""
Native Embedder Module for RAG Eval Loop
Satisfies TARGET_INTERFACE.md contract:
  - embed(texts: list[str]) -> np.ndarray (len(texts), dim)
  - embed_one(text: str) -> np.ndarray (dim,)
  - get_model() -> Any
"""
import sys
from pathlib import Path
from typing import List, Union
import numpy as np

# Ensure backend root is in sys.path
CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent
ROOT_DIR = BACKEND_DIR.parent

for p in [str(BACKEND_DIR), str(ROOT_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from rag.ingestion.embed_dataset import EmbeddingEngine
except ImportError:
    from task2.rag.ingestion.embed_dataset import EmbeddingEngine

_engine: Union[EmbeddingEngine, None] = None


def get_engine() -> EmbeddingEngine:
    global _engine
    if _engine is None:
        _engine = EmbeddingEngine()
    return _engine


def get_model():
    """Called once by eval suite; side effect loads model."""
    eng = get_engine()
    return eng.st_model or eng.model_name


def embed_one(text: str) -> np.ndarray:
    """Embed single text string returning 1D numpy array of shape (dim,)."""
    eng = get_engine()
    vec = eng.embed_query(text)
    if not isinstance(vec, np.ndarray):
        vec = np.array(vec, dtype=np.float32)
    return vec.astype(np.float32).ravel()


def embed(texts: List[str]) -> np.ndarray:
    """Embed a list of text strings returning 2D numpy array of shape (len(texts), dim)."""
    if not texts:
        eng = get_engine()
        return np.zeros((0, eng.dimension), dtype=np.float32)

    eng = get_engine()
    vecs = eng.embed_texts(texts)
    if not isinstance(vecs, np.ndarray):
        vecs = np.array(vecs, dtype=np.float32)
    return vecs.astype(np.float32)


# Backward-compatible aliases
def embed_query(query: str) -> List[float]:
    return embed_one(query).tolist()


def embed_passage(passage: str) -> List[float]:
    return embed_one(passage).tolist()


def embed_passages(passages: List[str]) -> List[List[float]]:
    return embed(passages).tolist()
