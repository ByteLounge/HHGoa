# HH Goa 2026 — Deployment Guide

This document outlines the deployment architecture for both **Task 1 (Profile Frame & Builder Pass Studio)** and **Task 2 (Voice-Enabled RAG System)**.

---

## Task 1 Deployment (Netlify / Vercel)

Task 1 is a Next.js 15 App Router application with `@resvg/resvg-js` vector SVG rendering and Supabase Storage integration.

### Deploying Task 1 to Netlify
1. Set **Base Directory** in Netlify to: `task1`
2. Set **Build Command**: `npm run build`
3. Set **Publish Directory**: `.next`
4. Configure Environment Variables in Netlify Dashboard:
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://your-task1.netlify.app`)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Deploying Task 1 to Vercel
1. Import repository into Vercel.
2. Select **Root Directory**: `task1`
3. Add Environment Variables in Project Settings.
4. Deploy!

---

## Task 2 Deployment (FastAPI + Next.js Frontend)

Task 2 consists of a Python FastAPI backend (serving RAG retrieval, FAISS index, and Sarvam STT) and a Next.js frontend.

### 1. Backend Deployment (Render / Fly.io / AWS App Runner / Modal)
- Deployment Platform: Render Web Service or Fly.io Docker container.
- Command: `uvicorn task2.backend.main:app --host 0.0.0.0 --port 8000`
- Environment Variables:
  - `SARVAM_API_KEY`
  - `LLM_PROVIDER` (groq / openai / gemini)
  - `LLM_API_KEY`
  - `LLM_MODEL` (llama-3.1-8b-instant)
- Build Command: `pip install -r task2/requirements.txt && python task2/scripts/run_ingestion.py`

### 2. Frontend Deployment (Vercel / Netlify)
- Base Directory: `task2/frontend`
- Build Command: `npm run build`
- Environment Variables:
  - `NEXT_PUBLIC_BACKEND_URL` (URL of deployed FastAPI backend e.g. `https://api-task2.onrender.com`)
