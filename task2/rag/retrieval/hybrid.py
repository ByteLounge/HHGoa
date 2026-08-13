import time
import json
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Tuple
from task2.rag.retrieval.dense import DenseRetriever
from task2.rag.retrieval.sparse import SparseRetriever

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
INDEX_DIR = DATA_DIR / "index"
METADATA_INDEX_PATH = INDEX_DIR / "metadata.json"

class HybridRetriever:
    def __init__(
        self,
        dense_weight: float = 0.6,
        sparse_weight: float = 0.4,
        index_dir: Path = INDEX_DIR
    ):
        self.dense_weight = dense_weight
        self.sparse_weight = sparse_weight
        self.dense_retriever = DenseRetriever(index_dir)
        self.sparse_retriever = SparseRetriever(index_dir)
        self.metadata = []
        self._load_metadata(index_dir)

    def _load_metadata(self, index_dir: Path):
        meta_path = index_dir / "metadata.json"
        if meta_path.exists():
            with open(meta_path, "r", encoding="utf-8") as f:
                self.metadata = json.load(f)

    def retrieve(
        self,
        query: str,
        query_vector: np.ndarray,
        top_k: int = 20,
        rrf_k: float = 60.0
    ) -> Tuple[List[Dict[str, Any]], Dict[str, float]]:
        t_start = time.perf_counter()

        # Step 1: Dense Retrieval
        t_dense_start = time.perf_counter()
        dense_results = self.dense_retriever.retrieve(query_vector, top_k=top_k)
        dense_ms = (time.perf_counter() - t_dense_start) * 1000.0

        # Step 2: Sparse BM25 Retrieval
        t_sparse_start = time.perf_counter()
        sparse_results = self.sparse_retriever.retrieve(query, top_k=top_k)
        sparse_ms = (time.perf_counter() - t_sparse_start) * 1000.0

        # Step 3: Reciprocal Rank Fusion (RRF)
        t_fusion_start = time.perf_counter()
        rrf_scores: Dict[int, float] = {}
        raw_dense_scores: Dict[int, float] = {}
        raw_sparse_scores: Dict[int, float] = {}

        for rank, (doc_idx, score) in enumerate(dense_results):
            raw_dense_scores[doc_idx] = score
            rrf_scores[doc_idx] = rrf_scores.get(doc_idx, 0.0) + self.dense_weight * (1.0 / (rrf_k + rank + 1))

        for rank, (doc_idx, score) in enumerate(sparse_results):
            raw_sparse_scores[doc_idx] = score
            rrf_scores[doc_idx] = rrf_scores.get(doc_idx, 0.0) + self.sparse_weight * (1.0 / (rrf_k + rank + 1))

        # Sort combined results
        sorted_docs = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)[:top_k]
        fusion_ms = (time.perf_counter() - t_fusion_start) * 1000.0

        fused_candidates = []
        for doc_idx, rrf_score in sorted_docs:
            if doc_idx < len(self.metadata):
                chunk_meta = self.metadata[doc_idx].copy()
                chunk_meta["dense_score"] = float(raw_dense_scores.get(doc_idx, 0.0))
                chunk_meta["sparse_score"] = float(raw_sparse_scores.get(doc_idx, 0.0))
                chunk_meta["hybrid_score"] = float(rrf_score)
                chunk_meta["doc_index"] = doc_idx
                fused_candidates.append(chunk_meta)

        total_retrieval_ms = (time.perf_counter() - t_start) * 1000.0

        metrics = {
            "dense_ms": dense_ms,
            "sparse_ms": sparse_ms,
            "fusion_ms": fusion_ms,
            "total_retrieval_ms": total_retrieval_ms
        }

        return fused_candidates, metrics
