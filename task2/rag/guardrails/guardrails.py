import re
import time
from typing import List, Dict, Any, Tuple

class SafetyGuardrails:
    def __init__(self, min_similarity: float = 0.35, min_context_score: float = 0.35):
        self.min_similarity = min_similarity
        self.min_context_score = min_context_score

        # Prompt injection patterns
        self.injection_patterns = [
            r"ignore\s+previous\s+instructions",
            r"reveal\s+(system\s+)?prompt",
            r"bypass\s+restrictions",
            r"act\s+as\s+a",
            r"you\s+are\s+now\s+a",
            r"jailbreak",
            r"forget\s+all\s+rules",
            r"system:\s*",
            r"override\s+system"
        ]

        # Unsafe content patterns
        self.unsafe_patterns = [
            r"how\s+to\s+make\s+a\s+bomb",
            r"illegal\s+drugs",
            r"malware\s+code",
            r"hack\s+into",
            r"expletive_stub"
        ]

    def validate_input(self, query: str) -> Tuple[bool, str, str]:
        """
        Guardrail 4 (Prompt Injection) & Guardrail 5 (Unsafe Content).
        Returns (is_safe, error_message, guardrail_triggered).
        """
        if not query or len(query.strip()) < 2:
            return False, "Query cannot be empty or blank.", "empty_query"

        query_lower = query.lower().strip()

        # Check prompt injection
        for pattern in self.injection_patterns:
            if re.search(pattern, query_lower):
                return (
                    False,
                    "Security Notice: Prompt injection attempt detected. Input rejected.",
                    "prompt_injection"
                )

        # Check unsafe content
        for pattern in self.unsafe_patterns:
            if re.search(pattern, query_lower):
                return (
                    False,
                    "Content Warning: Query contains inappropriate or harmful content.",
                    "unsafe_content"
                )

        return True, "", "none"

    def check_retrieval_confidence(
        self, retrieved_chunks: List[Dict[str, Any]]
    ) -> Tuple[bool, str]:
        """
        Guardrail 1 (Off-topic) & Guardrail 2 (Retrieval Confidence).
        Checks if top retrieved similarity meets confidence threshold.
        """
        if not retrieved_chunks:
            return False, "I couldn't find relevant information in the provided knowledge base."

        top_chunk = retrieved_chunks[0]
        top_score = top_chunk.get("rerank_score", top_chunk.get("hybrid_score", 0.0))

        if top_score < self.min_similarity:
            return (
                False,
                f"I couldn't find sufficiently relevant information in the knowledge base (confidence score {round(top_score, 2)} < threshold {self.min_similarity})."
            )

        return True, ""

    def validate_grounding(
        self, answer: str, retrieved_chunks: List[Dict[str, Any]]
    ) -> Tuple[bool, str]:
        """
        Guardrail 3 (Context Grounding Validation).
        Verifies answer contains factual terms from retrieved context passages.
        """
        if not retrieved_chunks or not answer:
            return False, "Answer could not be grounded in retrieved context."

        answer_words = set(w.lower().strip(".,!?:;\"'()[]{}") for w in answer.split() if len(w) > 3)
        context_words = set()

        for chunk in retrieved_chunks:
            text = chunk.get("parent_text", chunk.get("text", "")).lower()
            for w in text.split():
                clean_w = w.strip(".,!?:;\"'()[]{}")
                if len(clean_w) > 3:
                    context_words.add(clean_w)

        if not answer_words:
            return True, ""

        # Calculate word grounding ratio
        grounded_count = sum(1 for w in answer_words if w in context_words)
        grounding_ratio = grounded_count / len(answer_words)

        if grounding_ratio < 0.25 and "couldn't find" not in answer.lower():
            return False, "Generated answer failed factual grounding verification."

        return True, ""
