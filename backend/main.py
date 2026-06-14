"""
FastAPI application — Article Agent Demo.
Endpoints:
  POST /api/generate  — Kick off agent pipeline, stream progress via SSE.
  GET  /api/health    — Health check.
  GET  /              — Simple welcome page (also serves as root).
"""
import json
import logging
import sys
from pathlib import Path

# Ensure the project root is on sys.path so 'backend' imports work
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from backend.config import settings
from backend.providers import get_available_provider
from backend.agents import run_article_pipeline, ProgressEvent

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("main")

# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Article Agent Demo",
    description="Multi-agent article generation powered by crewAI",
    version="1.0.0",
)

# CORS — allow frontend dev server and any production frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Static file serving (for Docker / HuggingFace Spaces deployment)
# When the React app is built and copied to backend/static/, serve it.
# ---------------------------------------------------------------------------
STATIC_DIR = ROOT_DIR / "backend" / "static"
HAS_STATIC = STATIC_DIR.is_dir() and list(STATIC_DIR.glob("index.html"))

if HAS_STATIC:
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")
    logger.info("Static frontend detected at %s — serving full SPA", STATIC_DIR)
else:
    logger.info("No static frontend found — API-only mode (dev: use 'npm run dev' for frontend)")


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class GenerateRequest(BaseModel):
    topic: str = Field(
        ...,
        min_length=3,
        max_length=300,
        examples=["Artificial Intelligence in Healthcare"],
        description="The topic or question to generate an article about",
    )
    content_language: str = Field(
        default="es",
        min_length=2,
        max_length=5,
        pattern=r"^(es|en|pt|fr|it|de)$",
        examples=["es", "en"],
        description="Language for the generated article (es, en, pt, fr, it, de)",
    )
    tone: str = Field(
        default="casual",
        pattern=r"^(formal|casual|editorial|technical|inspirational)$",
        examples=["casual", "formal"],
        description="Writing tone",
    )
    length: str = Field(
        default="medium",
        pattern=r"^(short|medium|long)$",
        examples=["medium", "short"],
        description="Article length",
    )
    perspective: str = Field(
        default="informative",
        pattern=r"^(informative|persuasive|analytical)$",
        examples=["informative", "persuasive"],
        description="Writing perspective",
    )


class HealthResponse(BaseModel):
    status: str
    configured_providers: list[str]


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/")
async def root():
    """Serve the SPA frontend if built, otherwise API welcome page."""
    if HAS_STATIC:
        index_path = STATIC_DIR / "index.html"
        return HTMLResponse(index_path.read_text())
    return {
        "service": "Article Agent Demo",
        "docs": "/docs",
        "health": "/api/health",
        "generate": "POST /api/generate",
    }


# SPA fallback — serve index.html for any unmatched route when static exists
if HAS_STATIC:
    @app.get("/{full_path:path}")
    async def spa_fallback(full_path: str):
        """Catch-all for SPA client-side routing."""
        # Skip API routes
        if full_path.startswith("api/") or full_path in ("docs", "redoc", "openapi.json"):
            from fastapi.responses import JSONResponse
            return JSONResponse({"detail": "Not Found"}, status_code=404)
        file_path = STATIC_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return HTMLResponse((STATIC_DIR / "index.html").read_text())


@app.get("/api/health", response_model=HealthResponse)
async def health():
    """Health check — also reports which providers have keys configured."""
    configured = [
        name
        for name in ["groq", "gemini", "openrouter", "huggingface"]
        if getattr(settings, f"{name}_api_key", "")
    ]
    return HealthResponse(
        status="ok" if configured else "no_providers_configured",
        configured_providers=configured,
    )


@app.post("/api/generate")
async def generate(req: GenerateRequest, request: Request):
    """Generate an article on the given topic.

    Returns a Server-Sent Events stream with progress updates,
    ending with the final article.
    """
    logger.info("Generate request received for topic: %r", req.topic)

    # Try to get an LLM from the provider chain
    provider_result = get_available_provider()
    if provider_result is None:
        # No provider available — return a plain error (not SSE)
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=503,
            content={
                "error": "No LLM provider available. "
                "Set at least one of: GROQ_API_KEY, GEMINI_API_KEY, "
                "OPENROUTER_API_KEY, HF_API_KEY"
            },
        )

    provider_name, llm = provider_result

    async def event_stream():
        """Async generator yielding SSE-formatted progress events."""
        async for event in run_article_pipeline(
            req.topic,
            provider_name,
            llm,
            content_language=req.content_language,
            tone=req.tone,
            length=req.length,
            perspective=req.perspective,
        ):
            # Allow client disconnect to cancel the pipeline
            if await request.is_disconnected():
                logger.info("Client disconnected — stopping pipeline")
                break
            yield event.to_sse()

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering for SSE
        },
    )


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting Article Agent Demo on %s:%s", settings.host, settings.port)
    uvicorn.run(
        "backend.main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )
