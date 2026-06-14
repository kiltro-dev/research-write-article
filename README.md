# 🤖 Article Agent Demo

**Three AI agents collaborate to research, write, and polish articles on any topic.**

A portfolio-ready multi-agent application built with **crewAI**, **FastAPI**, and **React + Tailwind**. Watch in real-time as the Planner, Writer, and Editor agents work through a pipeline — from outline to polished article.

![Stack](https://img.shields.io/badge/backend-FastAPI-009688?logo=fastapi)
![Stack](https://img.shields.io/badge/frontend-React-61DAFB?logo=react&logoColor=black)
![Stack](https://img.shields.io/badge/agents-crewAI-8A2BE2)
![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?logo=githubactions&logoColor=white)
![Backend](https://img.shields.io/badge/deploy-Render-46E3B7?logo=render)
![Frontend](https://img.shields.io/badge/deploy-Vercel-000000?logo=vercel)

---

## ✨ What it does

```
You type a topic → Planner researches → Writer drafts → Editor polishes → You get a full article
```

The UI shows each agent's progress live with an animated timeline — not just a spinner.

---

## 🚀 Run locally (2 terminals, 2 minutes)

### Prerequisites
- Python 3.11+
- Node.js 18+
- At least one LLM API key (Groq recommended — free tier, very fast)

### Step 1: Get an API key (pick one)

| Provider | Sign-up | Free tier? | Speed |
|----------|---------|------------|-------|
| **Groq** (recommended) | [console.groq.com/keys](https://console.groq.com/keys) | ✅ 1,000 req/day | ⚡ Very fast |
| **Gemini** | [aistudio.google.com](https://aistudio.google.com) | ✅ 1,500 req/day | 🚀 Fast |
| **OpenRouter** | [openrouter.ai/keys](https://openrouter.ai/keys) | ✅ Limited | 🏃 Good |

### Step 2: Clone & configure

```bash
git clone <your-repo-url>
cd research-write-article

# Copy the env template and add your key
cp .env.example .env
# Edit .env → paste your API key into GROQ_API_KEY (or GEMINI_API_KEY)
```

### Step 3: Install dependencies

```bash
# Backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
cd ..
```

### Step 4: Run

**Terminal 1 — Backend:**
```bash
python backend/main.py
# → http://localhost:8000  |  Swagger: http://localhost:8000/docs
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → http://localhost:5173
```

Open **http://localhost:5173**, type a topic, and watch the agents work.

---

## ⚙️ CI/CD (GitHub Actions)

Pushing to `main` triggers automatic deploys — **only the part that changed**:

| Change in... | Deploys |
|-------------|---------|
| `backend/**` | → Render |
| `frontend/**` | → Vercel |
| Both | → Both (in parallel) |

### Setup

1. **Render deploy hook**:
   - [dashboard.render.com](https://dashboard.render.com) → click your service name
   - **Settings** tab → scroll to "Deploy Hook" section → copy the URL
   - Looks like: `https://api.render.com/deploy/srv-...?key=...`
2. **Vercel deploy hook**:
   - [vercel.com](https://vercel.com) → your project → **Settings** tab
   - Left sidebar: **Git** → "Deploy Hooks" → **Create Hook** → copy URL
   - Looks like: `https://api.vercel.com/v1/integrations/deploy/prj_.../...`
3. Add to **GitHub Secrets** (repo → Settings → Secrets and variables → Actions):
   - `RENDER_DEPLOY_HOOK_URL` — your Render hook
   - `VERCEL_DEPLOY_HOOK_URL` — your Vercel hook
   - `VITE_API_URL` — `https://your-app.onrender.com`

Workflows live in `.github/workflows/`:
- `deploy-backend.yml` — validates Python imports, triggers Render
- `deploy-frontend.yml` — builds Vite app, triggers Vercel

---

## 🌐 Deploy to production (free)

You have two options:

### Option A: Render + Vercel (recommended — more professional)

Two separate services, each doing what they're best at.

#### Backend → Render

1. Push your code to GitHub
2. Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **Web Service**
3. Click **"Build and deploy from a Git repository"** → connect GitHub → select your repo
4. Fill the form:

| Field | Value |
|-------|-------|
| **Name** | `research-write-article` (becomes `research-write-article.onrender.com`) |
| **Region** | `Ohio (US East)` or closest to you |
| **Branch** | `main` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | **Free** |

5. Scroll down to **Advanced** → **Add Environment Variable** and add:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | `gsk_your_key_here` |
| `GEMINI_API_KEY` | *(if you have one)* |
| `PROVIDER_PRIORITY` | `groq,gemini,openrouter,huggingface` |
6. Click **Create Web Service** → Render builds & deploys. Your API is live at `https://research-write-article.onrender.com`. Verify: open `/docs` for the Swagger UI.

#### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project**
2. Import your repo
3. Set **Root Directory** to `frontend`
4. Add environment variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-app.onrender.com` |

5. Click **Deploy** → your frontend is live at `https://your-app.vercel.app`

> ⚠️ **Render free tier**: the backend sleeps after 15 min of inactivity. First request takes ~30s to wake. Use [UptimeRobot](https://uptimerobot.com) (free) to ping it every 10 min and keep it alive.

---

### Option B: HuggingFace Spaces (simpler — single deploy)

Everything in one place, no cold starts, optional GPU access. Deploy once and it stays alive.

1. Create a **Dockerfile** at the project root (see [Docker deployment](#-docker-deployment-huggingface-spaces) below)
2. Go to [huggingface.co/new-space](https://huggingface.co/new-space)
3. Choose **Docker** as the Space SDK
4. Connect your GitHub repo (or upload directly)
5. Add your API keys as **Space Secrets**
6. Your app is live at `https://huggingface.co/spaces/<your-username>/<space-name>`

**Trade-off**: simpler to manage, always online, but serves the frontend from FastAPI rather than a CDN — slightly less optimal for static assets. Better for demo/portfolio; less "production-grade" in architecture.

---

## 🐳 Docker deployment (HuggingFace Spaces)

Create a `Dockerfile` in the project root:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install Node.js for frontend build
RUN apt-get update && apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Frontend build
COPY frontend/package.json frontend/package-lock.json* frontend/
RUN cd frontend && npm install

COPY . .

# Build React app and copy to backend static folder
RUN cd frontend && npm run build
RUN mkdir -p backend/static && cp -r frontend/dist/* backend/static/

EXPOSE 7860

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

Then in HuggingFace Spaces:
1. Create a new Space → choose **Docker**
2. Push this repo (with the Dockerfile) to the Space's repository
3. Add your `GROQ_API_KEY` as a Secret in Space Settings
4. Done!

---

## 📁 Project structure

```
research-write-article/
├── backend/
│   ├── main.py           ← FastAPI app (endpoints: /api/generate, /api/health)
│   ├── config.py         ← Environment configuration (Pydantic)
│   ├── providers.py      ← Multi-provider fallback router (Groq→Gemini→OpenRouter→HF)
│   └── agents.py         ← CrewAI pipeline (Planner → Writer → Editor) + SSE streaming
├── frontend/
│   ├── src/
│   │   ├── App.jsx       ← Main app: SSE client, state management
│   │   └── components/
│   │       ├── Hero.jsx           ← Landing section
│   │       ├── TopicInput.jsx     ← Topic input + generate button
│   │       ├── AgentProgress.jsx  ← Animated 3-step agent timeline
│   │       ├── ArticleResult.jsx  ← Markdown-rendered article + copy/regenerate
│   │       └── HowItWorks.jsx     ← Multi-agent system explanation
│   ├── package.json
│   └── vite.config.js
├── specs/article-agent-demo/      ← Design docs, requirements, tasks, deployment guide
├── CLAUDE.md                      ← AI assistant project guide
├── .env.example                   ← Environment variables template
└── requirements.txt               ← Python dependencies
```

---

## 🔄 Multi-provider fallback

The system tries LLM providers in this order (configurable via `PROVIDER_PRIORITY`):

```
Groq → Gemini → OpenRouter → HuggingFace
```

If one fails (no credits, network error, rate limit), it automatically tries the next. You only need **one** API key configured — the first working provider wins.

To change the order, edit `PROVIDER_PRIORITY` in your `.env` or Render/Vercel environment variables.

---

## 🧪 API reference

### `POST /api/generate`
Stream article generation progress via Server-Sent Events (SSE).

**Request:**
```json
{ "topic": "Artificial Intelligence in Healthcare" }
```

**Response (SSE stream):**
```
data: {"step":"planning","status":"running","message":"Planner is researching..."}
data: {"step":"planning","status":"completed","message":"Outline ready."}
data: {"step":"writing","status":"running","message":"Writer is crafting..."}
data: {"step":"writing","status":"completed","message":"Draft ready."}
data: {"step":"editing","status":"running","message":"Editor is polishing..."}
data: {"step":"editing","status":"completed","message":"Article polished."}
data: {"step":"done","status":"completed","message":"{\"article\":\"...\",\"provider\":\"groq\"}"}
```

### `GET /api/health`
```json
{ "status": "ok", "configured_providers": ["groq", "gemini"] }
```

---

## 🎨 Customization

Change the AI model in `.env`:
```bash
# Fast & powerful (Groq):
DEFAULT_MODEL=groq/llama-3.3-70b-versatile

# Cheapest (Groq):
DEFAULT_MODEL=groq/llama-3.1-8b-instant

# Good balance (Gemini, also free):
DEFAULT_MODEL=gemini/gemini-2.5-flash
```

---

## 🛠️ Tech stack

| Layer | Technology |
|-------|-----------|
| Agent framework | [crewAI](https://crewai.com) |
| Backend | [FastAPI](https://fastapi.tiangolo.com) + [Pydantic](https://docs.pydantic.dev) |
| LLM routing | [LiteLLM](https://litellm.ai) |
| Frontend | [React 18](https://react.dev) + [Vite](https://vitejs.dev) |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Animations | [Framer Motion](https://www.framer.com/motion) |
| Article rendering | [react-markdown](https://github.com/remarkjs/react-markdown) |

---

## 📄 License & Credits

Built as a portfolio demo showcasing multi-agent AI systems.  
Powered by [crewAI](https://crewai.com) and open-source LLM providers.

---

*Last updated: June 2026*
