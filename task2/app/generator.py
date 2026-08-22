"""
Native Generator Module for RAG Eval Loop
Satisfies TARGET_INTERFACE.md contract:
  - generate_answer(query: str, results: list[<context object>]) -> <answer object>
  Context object has .text and .source
  Answer object has .text: str, .grounded: bool, .generation_ms: float, .model: str
"""
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import List, Dict, Any, Union, Optional

# Ensure backend root is in sys.path
CURRENT_DIR = Path(__file__).resolve().parent
TASK2_DIR = CURRENT_DIR.parent
ROOT_DIR = TASK2_DIR.parent
BACKEND_DIR = TASK2_DIR / "backend"

for p in [str(BACKEND_DIR), str(TASK2_DIR), str(ROOT_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from rag.generation.answer import GroundedAnswerGenerator
    from rag.harness.orchestrator import RAGOrchestrator
except ImportError:
    from task2.rag.generation.answer import GroundedAnswerGenerator
    from task2.rag.harness.orchestrator import RAGOrchestrator


@dataclass
class GeneratedAnswer:
    text: str
    grounded: bool
    generation_ms: float
    model: str


_generator: Union[GroundedAnswerGenerator, None] = None
_orchestrator: Union[RAGOrchestrator, None] = None

_STOPWORDS = {
    "what", "is", "the", "a", "an", "of", "to", "in", "and", "for", "on", "how",
    "why", "who", "where", "when", "which", "can", "do", "does", "did", "are",
    "was", "were", "be", "been", "being", "have", "has", "had", "with", "from",
    "by", "at", "about", "into", "through", "after", "before", "between", "under",
    "during", "without", "again", "further", "then", "once", "here", "there",
    "all", "any", "both", "each", "few", "more", "most", "other", "some", "such",
    "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s",
    "t", "will", "just", "don", "should", "now"
}


def _check_context_relevance(query: str, contexts: List[Dict[str, Any]]) -> bool:
    """
    Evaluates whether the candidate chunks actually contain relevant information
    for the specific query terms, returning False for unanswerable/irrelevant query-context pairs.
    """
    if not contexts:
        return False

    query_lower = query.lower()
    raw_words = [w.strip(".,!?:;\"'()[]{}") for w in query_lower.split()]
    content_words = [w for w in raw_words if w and w not in _STOPWORDS and len(w) > 2]

    if not content_words:
        content_words = [w for w in raw_words if len(w) > 2]

    if not content_words:
        return True

    # Combine top candidate chunks
    combined_texts = " ".join([c.get("text", "").lower() for c in contexts[:3]])

    matches = sum(1 for w in content_words if w in combined_texts)
    match_ratio = matches / len(content_words)

    # If none of the content terms appear, or less than 50% for multi-term queries, decline
    if matches == 0:
        return False
    if len(content_words) >= 3 and match_ratio < 0.50:
        return False
    if len(content_words) == 2 and matches < 1:
        return False

    return True


def get_generator() -> GroundedAnswerGenerator:
    global _generator
    if _generator is None:
        _generator = GroundedAnswerGenerator()
    return _generator


def get_orchestrator() -> RAGOrchestrator:
    global _orchestrator
    if _orchestrator is None:
        _orchestrator = RAGOrchestrator()
    return _orchestrator


def generate_answer(
    query: str,
    results: Optional[List[Any]] = None
) -> GeneratedAnswer:
    """
    Generate grounded answer for a query given retrieved results.
    Each item in results has .text and .source (duck-typed object or dict).
    """
    t0 = time.perf_counter()
    model_name = "llama-3.1-8b-instant"

    if not query or len(query.strip()) < 2:
        return GeneratedAnswer(
            text="Query cannot be empty.",
            grounded=False,
            generation_ms=0.0,
            model=model_name
        )

    # If no results supplied at all, execute full RAG orchestrator pipeline
    if results is None or len(results) == 0:
        orch = get_orchestrator()
        resp = orch.process_query(query)
        gen_ms = (time.perf_counter() - t0) * 1000.0
        return GeneratedAnswer(
            text=resp.answer,
            grounded=resp.grounded,
            generation_ms=gen_ms,
            model=model_name
        )

    # Normalize candidate chunks
    normalized_contexts: List[Dict[str, Any]] = []
    for idx, r in enumerate(results, 1):
        if hasattr(r, "text"):
            text_val = r.text
            src_val = getattr(r, "source", f"Document {idx}")
        elif isinstance(r, dict):
            text_val = r.get("text") or r.get("content") or r.get("passage") or str(r)
            src_val = r.get("source") or r.get("title") or f"Document {idx}"
        elif isinstance(r, str):
            text_val = r
            src_val = f"Document {idx}"
        else:
            text_val = str(r)
            src_val = f"Document {idx}"

        normalized_contexts.append({
            "chunk_id": f"c{idx}",
            "document_id": f"doc_{idx}",
            "title": str(src_val),
            "text": text_val,
            "parent_text": text_val,
            "hybrid_score": 1.0 - (idx * 0.05),
            "rerank_score": 1.0 - (idx * 0.05)
        })

    # Reliability Guardrail: Check if retrieved candidate contexts cover the query
    if not _check_context_relevance(query, normalized_contexts):
        gen_ms = (time.perf_counter() - t0) * 1000.0
        return GeneratedAnswer(
            text="I couldn't find enough information in the provided knowledge base to answer that.",
            grounded=False,
            generation_ms=gen_ms,
            model=model_name
        )

    gen = get_generator()
    answer_text, sources, gen_duration_ms = gen.generate_answer(query, normalized_contexts)
    gen_ms = (time.perf_counter() - t0) * 1000.0

    # Determine if grounded or refusal
    refusal_cues = [
        "couldn't find enough information",
        "couldn't find relevant information",
        "does not contain information",
        "no relevant information",
        "don't contain information"
    ]
    is_refusal = any(cue in answer_text.lower() for cue in refusal_cues)
    grounded = not is_refusal

    return GeneratedAnswer(
        text=answer_text,
        grounded=grounded,
        generation_ms=gen_ms,
        model=gen.model or model_name
    )


# Alias
def generate(query: str, results: Optional[List[Any]] = None) -> GeneratedAnswer:
    return generate_answer(query, results)
