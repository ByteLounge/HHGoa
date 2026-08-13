import time
import numpy as np
from pathlib import Path
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

try:
    from rag.config import config
    from rag.ingestion.embed_dataset import EmbeddingEngine
    from rag.retrieval.hybrid import HybridRetriever
    from rag.retrieval.reranker import LightweightReranker
    from rag.generation.answer import GroundedAnswerGenerator
    from rag.guardrails.guardrails import SafetyGuardrails
except ImportError:
    from task2.rag.config import config
    from task2.rag.ingestion.embed_dataset import EmbeddingEngine
    from task2.rag.retrieval.hybrid import HybridRetriever
    from task2.rag.retrieval.reranker import LightweightReranker
    from task2.rag.generation.answer import GroundedAnswerGenerator
    from task2.rag.guardrails.guardrails import SafetyGuardrails

class LatencyBreakdown(BaseModel):
    stt_ms: float = 0.0
    embedding_ms: float = 0.0
    retrieval_ms: float = 0.0
    rerank_ms: float = 0.0
    generation_ms: float = 0.0
    guardrail_ms: float = 0.0
    total_ms: float = 0.0

class RAGResponse(BaseModel):
    query: str
    transcript: Optional[str] = None
    answer: str
    sources: List[Dict[str, Any]] = Field(default_factory=list)
    confidence: float = 1.0
    grounded: bool = True
    guardrail_triggered: Optional[str] = None
    latency: LatencyBreakdown

class RAGOrchestrator:
    def __init__(self, index_dir: Optional[Path] = None):
        self.embedding_engine = EmbeddingEngine()
        self.hybrid_retriever = HybridRetriever(
            dense_weight=config.get("retrieval", "dense_weight", 0.6),
            sparse_weight=config.get("retrieval", "sparse_weight", 0.4),
            index_dir=index_dir or (Path(__file__).resolve().parent.parent / "data" / "index")
        )
        self.reranker = LightweightReranker()
        self.generator = GroundedAnswerGenerator()
        self.guardrails = SafetyGuardrails(
            min_similarity=config.get("guardrails", "minimum_similarity", 0.35),
            min_context_score=config.get("guardrails", "minimum_context_score", 0.35)
        )

    def process_query(
        self,
        query: str,
        transcript: Optional[str] = None,
        stt_ms: float = 0.0,
        top_k: int = 20,
        final_k: int = 4
    ) -> RAGResponse:
        t_total_start = time.perf_counter()
        timing = LatencyBreakdown(stt_ms=stt_ms)

        # Step 1: Input Validation & Injection / Harm Guardrails
        t_guard_start = time.perf_counter()
        is_safe, err_msg, guard_name = self.guardrails.validate_input(query)
        timing.guardrail_ms += (time.perf_counter() - t_guard_start) * 1000.0

        if not is_safe:
            total_ms = (time.perf_counter() - t_total_start) * 1000.0
            timing.total_ms = total_ms
            return RAGResponse(
                query=query,
                transcript=transcript,
                answer=err_msg,
                sources=[],
                confidence=0.0,
                grounded=False,
                guardrail_triggered=guard_name,
                latency=timing
            )

        # Step 2: Runtime Query Vector Embedding
        t_embed_start = time.perf_counter()
        query_vec = self.embedding_engine.embed_query(query)
        timing.embedding_ms = (time.perf_counter() - t_embed_start) * 1000.0

        # Step 3: Dense + Sparse BM25 Hybrid Retrieval
        t_ret_start = time.perf_counter()
        fused_candidates, ret_metrics = self.hybrid_retriever.retrieve(
            query=query,
            query_vector=query_vec,
            top_k=top_k
        )
        timing.retrieval_ms = (time.perf_counter() - t_ret_start) * 1000.0

        # Step 4: Retrieval Confidence Check (Off-Topic / Low similarity)
        t_guard_start = time.perf_counter()
        conf_passed, conf_msg = self.guardrails.check_retrieval_confidence(fused_candidates)
        timing.guardrail_ms += (time.perf_counter() - t_guard_start) * 1000.0

        if not conf_passed:
            total_ms = (time.perf_counter() - t_total_start) * 1000.0
            timing.total_ms = total_ms
            return RAGResponse(
                query=query,
                transcript=transcript,
                answer=conf_msg,
                sources=[],
                confidence=0.2,
                grounded=True,
                guardrail_triggered="retrieval_confidence",
                latency=timing
            )

        # Step 5: Lightweight Reranking
        t_rerank_start = time.perf_counter()
        final_top_chunks, rerank_time = self.reranker.rerank(
            query=query,
            candidate_chunks=fused_candidates,
            final_k=final_k
        )
        timing.rerank_ms = rerank_time

        # Step 6: Grounded LLM Answer Generation
        t_gen_start = time.perf_counter()
        answer_text, sources, gen_time = self.generator.generate_answer(
            query=query,
            retrieved_contexts=final_top_chunks
        )
        timing.generation_ms = gen_time

        # Step 7: Post-Generation Context Grounding Validation
        t_guard_start = time.perf_counter()
        is_grounded, ground_msg = self.guardrails.validate_grounding(answer_text, final_top_chunks)
        timing.guardrail_ms += (time.perf_counter() - t_guard_start) * 1000.0

        top_confidence = round(
            final_top_chunks[0].get("rerank_score", final_top_chunks[0].get("hybrid_score", 0.85)), 4
        ) if final_top_chunks else 0.5

        total_ms = (time.perf_counter() - t_total_start) * 1000.0
        timing.total_ms = round(total_ms, 2)

        return RAGResponse(
            query=query,
            transcript=transcript,
            answer=answer_text,
            sources=sources,
            confidence=top_confidence,
            grounded=is_grounded,
            guardrail_triggered=None if is_grounded else "grounding_warning",
            latency=timing
        )
