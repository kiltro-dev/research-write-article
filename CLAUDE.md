# article-agent-demo — AI Assistant Guide

## What this project is
A portfolio-ready multi-agent article generation app. User types a topic →
three AI agents (Planner, Writer, Editor) collaborate → polished article comes out.
Built with FastAPI (backend) + React/Vite/Tailwind (frontend) + crewAI (agents).

## Project structure
```
backend/            FastAPI + crewAI agent pipeline
  config.py         Env vars & typed settings
  providers.py      Multi-provider LLM fallback (Groq→Gemini→OpenRouter→HF)
  agents.py         Planner/Writer/Editor crewAI agents
  main.py           FastAPI app with /api/generate (SSE) and /api/health
frontend/           React + Vite + Tailwind + Framer Motion
  src/
    App.jsx         Main layout, state management, SSE client
    components/     Hero, TopicInput, AgentProgress, ArticleResult, HowItWorks
specs/              Design docs and tasks from the planning phase
utils.py            Legacy helpers (load_env, pretty_print)
```

## How to run locally

### Backend
```bash
# Create .env from .env.example and add your API keys
pip install -r requirements.txt
python backend/main.py
# Swagger UI at http://localhost:8000/docs
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

## Architecture decisions
- **SSE (Server-Sent Events)** for streaming agent progress to the frontend
- **crewAI LLM class** with LiteLLM for multi-provider support
- **Provider fallback**: tries providers in order defined by PROVIDER_PRIORITY env var
- **No local models** — uses external APIs only (Render-compatible)

## Key commands
- `python backend/main.py` — start backend
- `cd frontend && npm run dev` — start frontend dev server
- `cd frontend && npm run build` — build frontend for production
