# Hacker House Goa 2026 — Submission Repository 🚀

[![Hacker House Goa](https://img.shields.io/badge/Hacker_House_Goa-2026-FFD400?style=flat-square&logo=goa)](https://hhgoa.com)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Sarvam AI](https://img.shields.io/badge/Sarvam_AI-Speech--to--Text-FF007A?style=flat-square)](https://sarvam.ai)
[![ElevenLabs](https://img.shields.io/badge/ElevenLabs-Speech--to--Text-0A4C2B?style=flat-square)](https://elevenlabs.io)
[![Netlify](https://img.shields.io/badge/Netlify-Frontend-00C7B7?style=flat-square&logo=netlify)](https://netlify.com)
[![Render](https://img.shields.io/badge/Render-Backend_Free-46E3B7?style=flat-square&logo=render)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

Official repository for **Hacker House Goa 2026** (28 – 31 Oct 2026, Goa, India) containing production-ready implementations for both shortlisting tasks:

- **Task 1: Identity Frame & Builder Pass Studio** *(Deployed on Netlify)*
- **Task 2: Voice-Enabled Low-Latency RAG System** *(Frontend on Netlify, Backend on Render)*

---

## 📂 Repository Organization & Independent Deployment

```text
/
├── task1/                    # Task 1: Identity Frame & Builder Pass Studio
│   ├── src/                  # Next.js App Router, Generator, Components, Resvg Engine
│   ├── public/               # Self-hosted Cormorant, IBM Plex Mono, Oswald TTF fonts
│   ├── netlify.toml          # Netlify deployment configuration for Task 1
│   ├── package.json
│   └── README.md
│
├── task2/                    # Task 2: Voice-Enabled Low-Latency RAG System
│   ├── frontend/             # Next.js 15 UI (3-Provider Voice Architecture, Netlify deployed)
│   │   ├── src/
│   │   ├── netlify.toml
│   │   ├── package.json
│   │   └── .env.example
│   │
│   ├── backend/              # Production FastAPI server (Render deployed)
│   │   ├── app/
│   │   ├── services/         # Sarvam, ElevenLabs, and Browser STT Service Managers
│   │   ├── rag/              # Hybrid retrieval, FAISS + BM25, Grounded Generation
│   │   ├── models/           # Pydantic Schemas
│   │   ├── render.yaml       # Render Web Service Blueprint
│   │   ├── requirements.txt
│   │   └── .env.example
│   │
│   ├── evaluation/           # Latency & Retrieval benchmark evaluation suite
│   ├── scripts/              # Data ingestion scripts
│   └── README.md
│
├── .gitignore
├── package.json
└── README.md
```

> **Task Isolation Policy:** Task 1 and Task 2 reside in the same GitHub repository, but build and deploy completely independently.

---

## 🎙️ Task 2: 3-Provider Voice Architecture

Task 2 features a robust 3-provider voice input model with an automatic fallback chain:

1. **Browser Speech Recognition (*DEFAULT*)**: Zero-API-cost browser native SpeechRecognition API. Operates client-side with zero server latency and 100% privacy.
2. **Sarvam AI**: Cloud STT API (`saarika:v1`) proxied through Render backend (`POST /api/stt`). Optimized for Indic languages.
3. **ElevenLabs**: Cloud STT API (`scribe_v1`) proxied through Render backend (`POST /api/stt`). High precision cloud STT alternative.
4. **AUTO Mode**: Smart fallback chain (Browser → Sarvam → ElevenLabs → Text Query).

### Key Security Guarantee
All private credentials (`SARVAM_API_KEY`, `ELEVENLABS_API_KEY`, `LLM_API_KEY`) live **ONLY** in Render backend environment variables and are **NEVER** exposed to client-side bundles or public environment variables.

---

## 🌐 Deployment Instructions

### 1. Task 1 Frontend (Netlify)
- **Base directory:** `task1`
- **Build command:** `npm run build`
- **Publish directory:** `task1/.next`

### 2. Task 2 Frontend (Netlify)
- **Base directory:** `task2/frontend`
- **Build command:** `npm run build`
- **Publish directory:** `task2/frontend/.next`
- **Environment Variable:** `NEXT_PUBLIC_API_BASE_URL` = `https://<YOUR-RENDER-BACKEND>.onrender.com`

### 3. Task 2 Backend (Render Free Tier)
- **Root Directory:** `task2/backend`
- **Environment:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path:** `/health`
- **Environment Variables:** `FRONTEND_URL`, `SARVAM_API_KEY`, `ELEVENLABS_API_KEY`, `LLM_API_KEY`

---

## ⚡ Quick Start Guide (Local Development)

### Running Task 1
```bash
cd task1
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Running Task 2 Backend
```bash
cd task2/backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API running at [http://localhost:8000](http://localhost:8000) (Health check: `/health`).

### Running Task 2 Frontend
```bash
cd task2/frontend
npm install
npm run dev
```
Open [http://localhost:3001](http://localhost:3001)

---

## 🛡️ License

MIT License. Developed for **Hacker House Goa 2026**.
