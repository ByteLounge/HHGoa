# HH Goa 2026 — Task 2: Voice-Enabled Low-Latency RAG System

A production-grade, low-latency Voice-Enabled Retrieval-Augmented Generation (RAG) system built for **Hacker House Goa 2026**.

The system combines a **3-Provider Voice Architecture** (Browser Native STT as default, Sarvam AI STT, ElevenLabs STT, and Auto Fallback Chain) with a **FAISS + BM25 Hybrid Retrieval Pipeline** and grounded LLM generation.

---

## 🏗 System Architecture & Deployment Topology

```
GitHub Repository (Shared Workspace)
│
├── task1/  ──► Netlify (Identity Frame / Builder Pass Studio)
│
└── task2/
    ├── frontend/ ──► Netlify Site (Independent Deployment)
    │                  │
    │                  ▼ API Requests
    │
    └── backend/  ──► Render Web Service (Free Tier)
                       │
                       ├── 1. Browser Speech Recognition (DEFAULT • 0-API Cost)
                       ├── 2. Sarvam AI STT (saarika:v1 • Indic STT)
                       ├── 3. ElevenLabs STT (scribe_v1)
                       ├── 4. Hybrid Retrieval (FAISS Dense + BM25 Sparse + RRF)
                       ├── 5. Reranking & Safety Guardrails
                       └── 6. Grounded LLM Generation
```

> **Note:** Task 1 and Task 2 share the same GitHub repository but are completely isolated and independently deployable.

---

## 🎙 3-Provider Voice Architecture

| Provider | Type | API Key Required? | Description |
| :--- | :--- | :--- | :--- |
| **Browser Speech** *(DEFAULT)* | Native Client-Side | **No** | Uses `SpeechRecognition` / `webkitSpeechRecognition`. 0ms server overhead, 0 API cost. |
| **Sarvam AI** | Cloud STT | Yes (Backend Render) | `saarika:v1` model via backend proxy (`POST /api/stt`). Optimized for Indic languages. |
| **ElevenLabs** | Cloud STT | Yes (Backend Render) | `scribe_v1` model via backend proxy (`POST /api/stt`). High precision cloud transcription. |
| **AUTO Mode** | Smart Fallback Chain | Dynamic | Tries Browser STT first → Sarvam AI → ElevenLabs → Text Query fallback. |

### Security & Secret Protection
- **ALL API KEYS (`SARVAM_API_KEY`, `ELEVENLABS_API_KEY`, `LLM_API_KEY`) remain strictly on the Render backend.**
- No secret credentials are ever exposed in frontend JavaScript bundles or public environment variables.

---

## 🚀 Local Development Setup

### 1. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd task2/backend

# Create & activate virtual environment (optional)
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Create local environment file
cp .env.example .env

# Run FastAPI dev server
uvicorn app.main:app --reload --port 8000
```
Backend API will be running at `http://localhost:8000`. Health check endpoint: `http://localhost:8000/health`.

### 2. Frontend Setup (Next.js)

```bash
# Navigate to frontend directory
cd task2/frontend

# Install dependencies
npm install

# Create local environment file
cp .env.example .env.local

# Run frontend dev server
npm run dev
```
Frontend will be running at `http://localhost:3001`.

---

## 🌐 Netlify Frontend Deployment Guide

1. Log into your **Netlify Dashboard**.
2. Click **Add new site** → **Import an existing project**.
3. Connect your GitHub repository (`HHGoa`).
4. Configure site settings:
   - **Base directory:** `task2/frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `task2/frontend/.next` (or leave default for Netlify Next.js plugin)
5. Under **Environment variables**, add:
   - `NEXT_PUBLIC_API_BASE_URL` = `https://<YOUR-RENDER-BACKEND-SERVICE>.onrender.com`
   - `VITE_API_BASE_URL` = `https://<YOUR-RENDER-BACKEND-SERVICE>.onrender.com`
6. Click **Deploy Site**.

---

## ⚡ Render Backend Deployment Guide

1. Log into your **Render Dashboard** (`render.com`).
2. Click **New +** → **Web Service**.
3. Connect the same GitHub repository (`HHGoa`).
4. Configure service settings:
   - **Name:** `hh-goa-task2-backend`
   - **Root Directory:** `task2/backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type:** `Free`
5. Under **Environment Variables**, add:
   - `FRONTEND_URL` = `https://<YOUR-TASK2-FRONTEND>.netlify.app`
   - `SARVAM_API_KEY` = `<your_sarvam_api_key>`
   - `ELEVENLABS_API_KEY` = `<your_elevenlabs_api_key>`
   - `LLM_API_KEY` = `<your_llm_api_key>`
   - `LLM_PROVIDER` = `groq`
   - `LLM_MODEL` = `llama-3.1-8b-instant`
6. Click **Deploy Web Service**.
7. Once deployed, verify health at `https://<YOUR-RENDER-BACKEND-SERVICE>.onrender.com/health`.
8. Copy the Render Web Service URL into your Netlify frontend environment variables.

---

## 📊 API Contracts

### Health Check: `GET /health`
```json
{
  "status": "ok",
  "service": "hh-goa-voice-rag-api",
  "version": "1.0.0",
  "rag_ready": true,
  "sarvam_configured": true,
  "elevenlabs_configured": true,
  "embedding_model": "BAAI/bge-small-en-v1.5",
  "vector_index": "FAISS / NumPy Dot Product Hybrid (BM25 + RRF)"
}
```

### Speech-to-Text: `POST /api/stt`
```json
{
  "success": true,
  "provider": "sarvam",
  "transcript": "What is Hacker House Goa 2026?",
  "stt_ms": 142.5
}
```

### Unified RAG Query: `POST /api/query`
```json
{
  "query": "What is Hacker House Goa 2026?",
  "answer": "Hacker House Goa 2026 is an elite developer hackathon taking place October 28–31, 2026 in Goa, India [1].",
  "sources": [
    {
      "source_index": 1,
      "document_id": "msmarco_doc_001",
      "title": "Hacker House Goa 2026 Overview",
      "snippet": "Hacker House Goa 2026 is an elite developer hackathon..."
    }
  ],
  "confidence": 0.9412,
  "grounded": true,
  "latency": {
    "stt_ms": 0.0,
    "embedding_ms": 0.09,
    "retrieval_ms": 0.18,
    "rerank_ms": 0.05,
    "generation_ms": 0.02,
    "guardrail_ms": 0.61,
    "total_ms": 1.05
  }
}
```

---

## 💤 Cold Start & Performance Benchmarks

- **Warm RAG Query Latency:** ~1ms to 140ms end-to-end.
- **Render Free Cold Start:** Render spins down free instances after 15 minutes of inactivity. First request upon cold start takes ~15–30 seconds while Render boots the container. Subsequent requests execute in warm performance mode (~1–140ms).
