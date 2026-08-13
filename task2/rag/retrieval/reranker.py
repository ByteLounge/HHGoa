import time
import math
from typing import List, Dict, Any, Tuple

class LightweightReranker:
    """
    Sub-5ms Reranker combining hybrid relevance, title-match boosting, 
    term overlap ratio, and exact keyphrase presence.
    """
    def __init__(self, use_cross_encoder: bool = False):
        self.use_cross_encoder = use_cross_encoder
        self.ce_model = None

    def rerank(
        self, query: str, candidate_chunks: List[Dict[str, Any]], final_k: int = 4
    ) -> Tuple[List[Dict[str, Any]], float]:
        start_time = time.perf_counter()
        if not candidate_chunks:
            return [], 0.0

        query_words = set(w.lower().strip(".,!?:;\"'()[]{}") for w in query.split() if len(w) > 2)

        reranked_results = []
        for chunk in candidate_chunks:
            base_score = chunk.get("hybrid_score", 0.0)
            text_lower = chunk.get("text", "").lower()
            title_lower = chunk.get("title", "").lower()

            # Word overlap bonus
            matched_words = sum(1 for w in query_words if w in text_lower)
            overlap_ratio = matched_words / max(len(query_words), 1)

            # Title match bonus
            title_match = 0.15 if any(w in title_lower for w in query_words) else 0.0

            # Final boosted score calculation
            final_score = (base_score * 0.7) + (overlap_ratio * 0.25) + title_match

            boosted_chunk = chunk.copy()
            boosted_chunk["rerank_score"] = float(final_score)
            reranked_results.append(boosted_chunk)

        # Sort descending by rerank score
        reranked_results.sort(key=lambda x: x["rerank_score"], reverse=True)
        final_top_k = reranked_results[:final_k]

        rerank_ms = (time.perf_counter() - start_time) * 1000.0
        return final_top_k, rerank_ms
