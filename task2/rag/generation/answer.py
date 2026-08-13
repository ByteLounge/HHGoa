import os
import time
import requests
import json
from typing import List, Dict, Any, Tuple

class GroundedAnswerGenerator:
    def __init__(self, provider: str = None, model: str = None, api_key: str = None):
        self.provider = provider or os.getenv("LLM_PROVIDER", "groq").lower()
        self.model = model or os.getenv("LLM_MODEL", "llama-3.1-8b-instant")
        self.api_key = api_key or os.getenv("LLM_API_KEY", "")

    def generate_answer(
        self, query: str, retrieved_contexts: List[Dict[str, Any]]
    ) -> Tuple[str, List[Dict[str, Any]], float]:
        start_time = time.perf_counter()

        if not retrieved_contexts:
            gen_ms = (time.perf_counter() - start_time) * 1000.0
            return (
                "I couldn't find relevant information in the provided knowledge base to answer your question.",
                [],
                gen_ms
            )

        # Build Context Block with Explicit Sources
        context_str = ""
        sources = []
        for idx, chunk in enumerate(retrieved_contexts, 1):
            doc_title = chunk.get("title", f"Document {chunk.get('document_id')}")
            chunk_id = chunk.get("chunk_id", f"c{idx}")
            chunk_text = chunk.get("parent_text", chunk.get("text", ""))
            
            context_str += f"\n--- Source [{idx}]: {doc_title} (Chunk ID: {chunk_id}) ---\n{chunk_text}\n"
            
            sources.append({
                "source_index": idx,
                "document_id": chunk.get("document_id", ""),
                "title": doc_title,
                "chunk_id": chunk_id,
                "strategy": chunk.get("chunk_strategy", "semantic"),
                "relevance_score": round(chunk.get("rerank_score", chunk.get("hybrid_score", 0.0)), 4),
                "snippet": chunk.get("text", "")[:180] + "..."
            })

        system_prompt = (
            "You are the official Hacker House Goa 2026 Voice RAG Assistant. Your job is to answer user questions with extreme factual accuracy.\n"
            "STRICT GROUNDING RULES:\n"
            "1. Answer ONLY using the retrieved context provided below.\n"
            "2. DO NOT use external knowledge or invent facts.\n"
            "3. If the retrieved context does not contain enough information to answer the question, state clearly: "
            "'I couldn't find enough information in the provided knowledge base to answer that.'\n"
            "4. Keep your answer concise, direct, professional, and clear for voice readout.\n"
            "5. Include source bracket citations like [1] or [2] where appropriate."
        )

        user_prompt = f"USER QUESTION: {query}\n\nRETRIEVED CONTEXT:\n{context_str}\n\nFINAL GROUNDED ANSWER:"

        answer_text = ""
        if self.provider == "groq" and self.api_key:
            answer_text = self._call_groq_api(system_prompt, user_prompt)
        elif self.provider == "openai" and self.api_key:
            answer_text = self._call_openai_api(system_prompt, user_prompt)
        elif self.provider == "gemini" and self.api_key:
            answer_text = self._call_gemini_api(system_prompt, user_prompt)
        else:
            # Fallback high-speed local synthesis engine when API keys are not supplied
            answer_text = self._local_grounded_synthesis(query, retrieved_contexts)

        gen_ms = (time.perf_counter() - start_time) * 1000.0
        return answer_text.strip(), sources, gen_ms

    def _call_groq_api(self, system_prompt: str, user_prompt: str) -> str:
        try:
            res = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model or "llama-3.1-8b-instant",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": 0.1,
                    "max_tokens": 400,
                },
                timeout=3.0,
            )
            if res.status_code == 200:
                data = res.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[LLM] Groq API call error: {e}")
        return self._local_grounded_synthesis(user_prompt, [])

    def _call_openai_api(self, system_prompt: str, user_prompt: str) -> str:
        try:
            res = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model or "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": 0.1,
                    "max_tokens": 400,
                },
                timeout=3.0,
            )
            if res.status_code == 200:
                data = res.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[LLM] OpenAI API call error: {e}")
        return self._local_grounded_synthesis(user_prompt, [])

    def _call_gemini_api(self, system_prompt: str, user_prompt: str) -> str:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model or 'gemini-1.5-flash'}:generateContent?key={self.api_key}"
            res = requests.post(
                url,
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [{"parts": [{"text": f"{system_prompt}\n\n{user_prompt}"}]}],
                    "generationConfig": {"temperature": 0.1, "maxOutputTokens": 400}
                },
                timeout=3.0,
            )
            if res.status_code == 200:
                data = res.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            print(f"[LLM] Gemini API call error: {e}")
        return self._local_grounded_synthesis(user_prompt, [])

    def _local_grounded_synthesis(self, query: str, retrieved_contexts: List[Dict[str, Any]]) -> str:
        if not retrieved_contexts:
            return "I couldn't find relevant information in the provided knowledge base."

        top_chunk = retrieved_contexts[0]
        title = top_chunk.get("title", "Retrieved Document")
        text = top_chunk.get("text", "")
        
        # High precision extractive synthesis for ultra-fast response (<1ms)
        sentences = [s.strip() for s in text.split(".") if len(s.strip()) > 10]
        lead_summary = ". ".join(sentences[:2]) if len(sentences) >= 2 else text
        
        return f"Based on knowledge from '{title}' [1]: {lead_summary}."
