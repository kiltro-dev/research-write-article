"""
Centralized prompt adaptation layer.
Adapts agent instructions based on user-selected language, tone, length, and perspective.
"""
from typing import Optional


# ---------------------------------------------------------------------------
# Supported values
# ---------------------------------------------------------------------------

SUPPORTED_LANGUAGES = {
    "es": {"name": "Español", "instruction": "Escribe todo el contenido en español."},
    "en": {"name": "English", "instruction": "Write all content in English."},
    "pt": {"name": "Português", "instruction": "Escreva todo o conteúdo em português."},
    "fr": {"name": "Français", "instruction": "Rédigez tout le contenu en français."},
    "it": {"name": "Italiano", "instruction": "Scrivi tutto il contenuto in italiano."},
    "de": {"name": "Deutsch", "instruction": "Schreiben Sie den gesamten Inhalt auf Deutsch."},
}

SUPPORTED_TONES = {
    "formal": "Use a formal, professional tone. Avoid slang and colloquialisms. "
              "Write as if for a respected publication or academic journal.",
    "casual": "Use a casual, conversational tone. Write as if talking to a friend. "
              "Feel free to use everyday language, contractions, and a relaxed style.",
    "editorial": "Use an editorial, opinionated tone. Take a clear stance. "
                 "Write with conviction and personality, as if for an op-ed section.",
    "technical": "Use a technical, precise tone. Include specific terminology. "
                 "Write for an audience that expects depth and accuracy.",
    "inspirational": "Use an inspirational, motivational tone. Be uplifting and encouraging. "
                     "Write to move people emotionally and spark action.",
}

SUPPORTED_LENGTHS = {
    "short": "Keep the article concise — aim for 300-500 words. "
             "Focus on the most essential points only. "
             "Use short paragraphs and get straight to the point.",
    "medium": "Write a medium-length article — aim for 600-1000 words. "
              "Cover the topic with adequate depth while staying readable. "
              "Include 2-3 paragraphs per section.",
    "long": "Write a comprehensive, long-form article — aim for 1200-2000 words. "
            "Explore the topic in depth with multiple angles, examples, and analysis. "
            "Include detailed sections with 3-4 paragraphs each.",
}

SUPPORTED_PERSPECTIVES = {
    "informative": "Focus on informing the reader with facts, data, and balanced explanations. "
                   "Be objective and neutral. Present multiple viewpoints fairly.",
    "persuasive": "Focus on persuading the reader. Build a compelling argument. "
                  "Use rhetorical techniques, evidence, and a clear call to action.",
    "analytical": "Focus on deep analysis. Break down complex ideas, "
                  "compare and contrast perspectives, and provide thoughtful insights. "
                  "Go beyond surface-level explanations.",
}

# Default values
DEFAULT_LANGUAGE = "es"
DEFAULT_TONE = "casual"
DEFAULT_LENGTH = "medium"
DEFAULT_PERSPECTIVE = "informative"


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------

def validate_options(
    content_language: Optional[str],
    tone: Optional[str],
    length: Optional[str],
    perspective: Optional[str],
) -> dict:
    """Validate and normalize customization options. Returns dict with defaults applied."""
    return {
        "content_language": content_language if content_language in SUPPORTED_LANGUAGES else DEFAULT_LANGUAGE,
        "tone": tone if tone in SUPPORTED_TONES else DEFAULT_TONE,
        "length": length if length in SUPPORTED_LENGTHS else DEFAULT_LENGTH,
        "perspective": perspective if perspective in SUPPORTED_PERSPECTIVES else DEFAULT_PERSPECTIVE,
    }


def get_language_name(code: str) -> str:
    """Return the native name for a language code."""
    return SUPPORTED_LANGUAGES.get(code, SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE])["name"]


# ---------------------------------------------------------------------------
# Prompt builder — constructs the customization layer injected into agent prompts
# ---------------------------------------------------------------------------

def build_customization_instructions(
    content_language: str,
    tone: str,
    length: str,
    perspective: str,
) -> str:
    """Build a block of instructions that adapts all agent behavior.

    This block is appended to the task descriptions of Planner, Writer, and Editor.
    """
    lang = SUPPORTED_LANGUAGES.get(content_language, SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE])
    tone_instr = SUPPORTED_TONES.get(tone, SUPPORTED_TONES[DEFAULT_TONE])
    length_instr = SUPPORTED_LENGTHS.get(length, SUPPORTED_LENGTHS[DEFAULT_LENGTH])
    persp_instr = SUPPORTED_PERSPECTIVES.get(perspective, SUPPORTED_PERSPECTIVES[DEFAULT_PERSPECTIVE])

    return f"""
---
🎯 **CONTENT CONFIGURATION (apply these to ALL your work):**

1. **LANGUAGE**: {lang['instruction']}
2. **TONE**: {tone_instr}
3. **LENGTH**: {length_instr}
4. **PERSPECTIVE**: {persp_instr}
---
"""


def build_editor_customization_instructions(
    content_language: str,
    tone: str,
) -> str:
    """Editor-specific customization — focused on language and tone consistency."""
    lang = SUPPORTED_LANGUAGES.get(content_language, SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE])
    tone_instr = SUPPORTED_TONES.get(tone, SUPPORTED_TONES[DEFAULT_TONE])

    return f"""
---
🔍 **EDITING STANDARDS (apply these during your review):**

1. **LANGUAGE**: Ensure the entire text is in {lang['name']}. Fix any words or phrases in other languages.
2. **TONE CONSISTENCY**: {tone_instr} Verify the tone is consistent throughout.
3. **GRAMMAR**: Check grammar, spelling, and punctuation for {lang['name']}.
4. **CLARITY**: Ensure the article is clear, well-structured, and ready for publication.
---
"""
