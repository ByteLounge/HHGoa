from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class LatencyBreakdown(BaseModel):
    stt_ms: float = Field(0.0, description="Speech-to-text transcription latency in ms")
    embedding_ms: float = Field(0.0, description="Query embedding latency in ms")
    retrieval_ms: float = Field(0.0, description="Dense + Sparse hybrid vector retrieval latency in ms")
    rerank_ms: float = Field(0.0, description="Cross-scorer reranking latency in ms")
    generation_ms: float = Field(0.0, description="Grounded LLM answer generation latency in ms")
    guardrail_ms: float = Field(0.0, description="Safety and grounding validation latency in ms")
    total_ms: float = Field(0.0, description="Total end-to-end RAG pipeline latency in ms")

class RAGResponse(BaseModel):
    query: str
    transcript: Optional[str] = None
    answer: str
    sources: List[Dict[str, Any]] = Field(default_factory=list)
    confidence: float = 1.0
    grounded: bool = True
    guardrail_triggered: Optional[str] = None
    latency: LatencyBreakdown

class TextQueryRequest(BaseModel):
    query: str
    source: Optional[str] = "text"
    provider: Optional[str] = "browser"
    chunking_strategy: Optional[str] = "semantic"
    top_k: Optional[int] = 20
    final_k: Optional[int] = 4

class STTResponse(BaseModel):
    success: bool
    provider: str
    transcript: str = ""
    stt_ms: float = 0.0
    error_code: Optional[str] = None
    message: Optional[str] = None
    retryable: bool = False

class ErrorDetail(BaseModel):
    code: str
    message: str
    provider: Optional[str] = None
    retryable: bool = False

class APIErrorResponse(BaseModel):
    success: bool = False
    error: ErrorDetail

class HealthCheckResponse(BaseModel):
    status: str
    service: str
    version: str
    rag_ready: bool
    sarvam_configured: bool
    elevenlabs_configured: bool
    embedding_model: str
    vector_index: str
