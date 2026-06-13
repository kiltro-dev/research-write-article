"""
Centralized configuration via environment variables.
Load .env from project root and expose typed settings.
"""
import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic import BaseModel

# Load .env from project root (one level above backend/)
ROOT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(ROOT_DIR / ".env")


class Settings(BaseModel):
    """Typed application settings loaded from environment."""

    # --- API Keys ---
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    openrouter_api_key: str = os.getenv("OPENROUTER_API_KEY", "")
    huggingface_api_key: str = os.getenv("HF_API_KEY", "")
    serper_api_key: str = os.getenv("SERPER_API_KEY", "")

    # --- Provider priority (comma-separated, tried in order) ---
    provider_priority: str = os.getenv(
        "PROVIDER_PRIORITY", "groq,gemini,openrouter,huggingface"
    )

    # --- Default model ---
    default_model: str = os.getenv(
        "DEFAULT_MODEL", "groq/llama-3.3-70b-versatile"
    )

    # --- Server ---
    port: int = int(os.getenv("PORT", "8000"))
    host: str = os.getenv("HOST", "0.0.0.0")

    def get_provider_list(self) -> list[str]:
        """Return ordered list of providers to try."""
        return [p.strip() for p in self.provider_priority.split(",") if p.strip()]

    def has_any_key(self) -> bool:
        """Check if at least one provider key is configured."""
        return bool(
            self.groq_api_key
            or self.gemini_api_key
            or self.openrouter_api_key
            or self.huggingface_api_key
        )


settings = Settings()
