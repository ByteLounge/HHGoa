// Central API Service Client for Render Backend Communication

const getApiBaseUrl = (): string => {
  const url =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.VITE_API_BASE_URL ||
    'http://localhost:8000';
  return url.replace(/\/+$/, '');
};

export interface STTResponseData {
  success: boolean;
  provider: string;
  transcript: string;
  stt_ms: number;
  error_code?: string;
  message?: string;
  retryable?: boolean;
}

export interface LatencyBreakdownData {
  stt_ms: number;
  embedding_ms: number;
  retrieval_ms: number;
  rerank_ms: number;
  generation_ms: number;
  guardrail_ms: number;
  total_ms: number;
}

export interface SourceChunkData {
  source_index: number;
  document_id: string;
  title: string;
  chunk_id: string;
  strategy: string;
  relevance_score: number;
  snippet: string;
}

export interface RAGQueryResponseData {
  query: string;
  transcript?: string;
  answer: string;
  sources: SourceChunkData[];
  confidence: number;
  grounded: boolean;
  guardrail_triggered?: string;
  latency: LatencyBreakdownData;
}

export interface HealthResponseData {
  status: string;
  service: string;
  version: string;
  rag_ready: boolean;
  sarvam_configured: boolean;
  elevenlabs_configured: boolean;
  embedding_model: string;
  vector_index: string;
}

export async function checkBackendHealth(): Promise<HealthResponseData | null> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.warn('[API Client] Health check failed:', err);
    return null;
  }
}

export async function transcribeAudioApi(
  audioBlob: Blob,
  provider: 'sarvam' | 'elevenlabs',
  languageCode: string = 'hi-IN'
): Promise<STTResponseData> {
  const baseUrl = getApiBaseUrl();
  const formData = new FormData();
  formData.append('file', audioBlob, `voice_recording.${audioBlob.type.includes('wav') ? 'wav' : 'webm'}`);
  formData.append('provider', provider);
  formData.append('language_code', languageCode);

  const res = await fetch(`${baseUrl}/api/stt`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    let errorJson: any = {};
    try {
      errorJson = await res.json();
    } catch (e) {
      // Ignored
    }

    const status = res.status;
    let errCode = 'STT_ERROR';
    let errMsg = errorJson.detail || errorJson.message || `STT request failed with status ${status}`;

    if (status === 429) {
      errCode = 'RATE_LIMITED';
      errMsg = `${provider.toUpperCase()} rate limit or quota exceeded.`;
    } else if (status === 401 || status === 403) {
      errCode = 'AUTHENTICATION_FAILED';
      errMsg = `${provider.toUpperCase()} API key missing or invalid on server.`;
    }

    return {
      success: false,
      provider,
      transcript: '',
      stt_ms: 0.0,
      error_code: errCode,
      message: errMsg,
      retryable: status >= 500,
    };
  }

  return await res.json();
}

export async function queryRAGApi(
  query: string,
  source: 'voice' | 'text' = 'text',
  provider: string = 'browser'
): Promise<RAGQueryResponseData> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      source,
      provider,
      top_k: 20,
      final_k: 4,
    }),
  });

  if (!res.ok) {
    let errDetail = 'RAG query execution failed.';
    try {
      const errJson = await res.json();
      errDetail = errJson.detail || errJson.message || errDetail;
    } catch (e) {
      // Ignored
    }
    throw new Error(errDetail);
  }

  return await res.json();
}
