"""
Multi-provider LLM fallback router.
Tries providers in priority order (configurable via PROVIDER_PRIORITY env var).
Returns a crewAI-compatible LLM object from the first provider that responds.
"""
import logging
from crewai import LLM
from backend.config import settings

logger = logging.getLogger(__name__)

# Map provider names to their (env_var_for_key, model_prefix_format)
PROVIDER_CONFIG = {
    "groq": {
        "key": settings.groq_api_key,
        "env_var": "GROQ_API_KEY",
        # model format: "groq/<model-id>" e.g. "groq/llama-3.3-70b-versatile"
    },
    "gemini": {
        "key": settings.gemini_api_key,
        "env_var": "GEMINI_API_KEY",
        # model format: "gemini/<model-id>" e.g. "gemini/gemini-2.5-flash"
    },
    "openrouter": {
        "key": settings.openrouter_api_key,
        "env_var": "OPENROUTER_API_KEY",
        # model format: "openrouter/<model-id>" e.g. "openrouter/meta-llama/llama-3.3-70b-instruct"
    },
    "huggingface": {
        "key": settings.huggingface_api_key,
        "env_var": "HF_API_KEY",
        # model format: "huggingface/<model-id>" e.g. "huggingface/mistralai/Mistral-7B-Instruct-v0.3"
    },
}

# Fallback model per provider when no custom model is specified
FALLBACK_MODELS = {
    "groq": "groq/llama-3.3-70b-versatile",
    "gemini": "gemini/gemini-2.5-flash",
    "openrouter": "openrouter/meta-llama/llama-3.3-70b-instruct",
    "huggingface": "huggingface/mistralai/Mistral-7B-Instruct-v0.3",
}


def get_model_for_provider(provider: str) -> str:
    """Return the model string for a given provider.

    Uses DEFAULT_MODEL if it matches this provider, otherwise falls back
    to a sensible default for that provider.
    """
    default = settings.default_model
    if default.startswith(f"{provider}/"):
        model_id = default.split("/", 1)[1]
        return f"{provider}/{model_id}"
    return FALLBACK_MODELS.get(provider, default)


def create_llm(provider: str, model: str, api_key: str) -> LLM:
    """Create a crewAI LLM instance for the given provider and model."""
    logger.info("Creating LLM: provider=%s model=%s", provider, model)
    return LLM(
        model=model,
        api_key=api_key,
        temperature=0.7,
        drop_params=True,
    )


def get_available_provider() -> tuple[str, LLM] | None:
    """Try providers in priority order. Return (provider_name, LLM) or None if all fail.

    Returns:
        Tuple of (provider_name_used, LLM_instance) or None if no provider works.
    """
    priority = settings.get_provider_list()

    if not settings.has_any_key():
        logger.error(
            "No API keys configured! Set at least one of: "
            "GROQ_API_KEY, GEMINI_API_KEY, OPENROUTER_API_KEY, HF_API_KEY"
        )
        return None

    for provider in priority:
        config = PROVIDER_CONFIG.get(provider)
        if not config:
            logger.warning("Unknown provider: %s — skipping", provider)
            continue

        api_key = config["key"]
        if not api_key:
            logger.info("Provider %s: no API key configured — skipping", provider)
            continue

        model = get_model_for_provider(provider)

        try:
            llm = create_llm(provider, model, api_key)
            logger.info("✓ Using provider: %s | model: %s", provider, model)
            return (provider, llm)
        except Exception as exc:
            logger.warning(
                "Provider %s failed to initialize: %s — trying next", provider, exc
            )
            continue

    logger.error("All providers failed. Check your API keys and network.")
    return None
