import time
import numpy as np
from pathlib import Path
from typing import List, Tuple, Dict, Any

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
INDEX_DIR = DATA_DIR / "index"
FAISS_INDEX_PATH = INDEX_DIR / "faiss.index"
NUMPY_INDEX_PATH = INDEX_DIR / "faiss.npy"

class DenseRetriever:
    def __init__(self, index_dir: Path = INDEX_DIR):
        self.index_dir = index_dir
        self.faiss_index = None
        self.embeddings_matrix = None
        self.index_type = "numpy"
        self._load_index()

    def _load_index(self):
        faiss_path = self.index_dir / "faiss.index"
        numpy_path = self.index_dir / "faiss.npy"

        if faiss_path.exists():
            try:
                import faiss
                self.faiss_index = faiss.read_index(str(faiss_path))
                self.index_type = "faiss"
                return
            except Exception as e:
                print(f"[DenseRetriever] Could not load FAISS file, checking numpy matrix: {e}")

        if numpy_path.exists():
            self.embeddings_matrix = np.load(numpy_path)
            self.index_type = "numpy"
        else:
            # Generate fallback index if not already pre-built
            try:
                from rag.ingestion.build_index import build_index
            except ImportError:
                from task2.rag.ingestion.build_index import build_index
            build_index()
            if numpy_path.exists():
                self.embeddings_matrix = np.load(numpy_path)
                self.index_type = "numpy"

    def retrieve(self, query_vector: np.ndarray, top_k: int = 20) -> List[Tuple[int, float]]:
        start_time = time.perf_counter()
        query_vector = np.array([query_vector], dtype=np.float32)

        if self.index_type == "faiss" and self.faiss_index is not None:
            scores, indices = self.faiss_index.search(query_vector, top_k)
            results = [(int(idx), float(score)) for idx, score in zip(indices[0], scores[0]) if idx >= 0]
        elif self.embeddings_matrix is not None:
            # High speed matrix dot product: O(N * D)
            sims = np.dot(self.embeddings_matrix, query_vector[0])
            top_indices = np.argsort(sims)[::-1][:top_k]
            results = [(int(idx), float(sims[idx])) for idx in top_indices]
        else:
            results = []

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        return results
