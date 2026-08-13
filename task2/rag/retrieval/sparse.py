import time
import pickle
import numpy as np
from pathlib import Path
from typing import List, Tuple

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
INDEX_DIR = DATA_DIR / "index"
BM25_INDEX_PATH = INDEX_DIR / "bm25.pkl"

class SparseRetriever:
    def __init__(self, index_dir: Path = INDEX_DIR):
        self.index_dir = index_dir
        self.bm25_index = None
        self._load_index()

    def _load_index(self):
        bm25_path = self.index_dir / "bm25.pkl"
        if bm25_path.exists():
            with open(bm25_path, "rb") as f:
                self.bm25_index = pickle.load(f)
        else:
            from task2.rag.ingestion.build_index import build_index
            build_index()
            if bm25_path.exists():
                with open(bm25_path, "rb") as f:
                    self.bm25_index = pickle.load(f)

    def retrieve(self, query: str, top_k: int = 20) -> List[Tuple[int, float]]:
        start_time = time.perf_counter()
        if self.bm25_index is None:
            return []

        scores = self.bm25_index.get_scores(query)
        top_indices = np.argsort(scores)[::-1][:top_k]
        
        # Filter out 0 scores if there are non-zero scores
        results = [(int(idx), float(scores[idx])) for idx in top_indices if scores[idx] > 0]
        if not results and len(top_indices) > 0:
            results = [(int(idx), float(scores[idx])) for idx in top_indices[:5]]

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        return results
