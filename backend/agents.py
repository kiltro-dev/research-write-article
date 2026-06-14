"""
CrewAI agent pipeline: Planner → Writer → Editor.
Extracted from the original Jupyter notebook.
Customization layer (language, tone, length, perspective) added on top.
"""
import asyncio
import json
import logging
from typing import AsyncGenerator

from crewai import Agent, Task, Crew, LLM

from backend.prompt_adapter import (
    build_customization_instructions,
    build_editor_customization_instructions,
    validate_options,
    get_language_name,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Progress event (for SSE streaming to frontend)
# ---------------------------------------------------------------------------

class ProgressEvent:
    def __init__(self, step: str, status: str, message: str):
        self.step = step
        self.status = status
        self.message = message

    def to_sse(self) -> str:
        return f"data: {json.dumps(self.__dict__)}\n\n"


# ---------------------------------------------------------------------------
# Pipeline
# ---------------------------------------------------------------------------

async def run_article_pipeline(
    topic: str,
    provider_name: str,
    llm: LLM,
    content_language: str = "es",
    tone: str = "casual",
    length: str = "medium",
    perspective: str = "informative",
) -> AsyncGenerator[ProgressEvent, None]:
    """Run Planner → Writer → Editor in a single Crew, yielding progress events."""

    opts = validate_options(content_language, tone, length, perspective)
    content_language = opts["content_language"]
    tone = opts["tone"]
    length = opts["length"]
    perspective = opts["perspective"]
    lang_name = get_language_name(content_language)

    logger.info("Pipeline: topic=%r provider=%s lang=%s tone=%s", topic, provider_name, content_language, tone)

    # Build customization blocks (appended to task descriptions)
    custom = build_customization_instructions(content_language, tone, length, perspective)
    editor_custom = build_editor_customization_instructions(content_language, tone)

    # --- Agents (same structure as original notebook) ---
    planner = Agent(
        role="Content Planner",
        goal="Plan engaging and factually accurate content on {topic}",
        backstory=(
            "You're working on planning a blog article about the topic: {topic}. "
            "You collect information that helps the audience learn something "
            "and make informed decisions. Your work is the basis for "
            "the Content Writer to write an article on this topic."
        ),
        allow_delegation=False,
        verbose=True,
        llm=llm,
    )

    writer = Agent(
        role="Content Writer",
        goal="Write insightful and factually accurate opinion piece about the topic: {topic}",
        backstory=(
            "You're working on writing a new opinion piece about the topic: {topic}. "
            "You base your writing on the work of the Content Planner, who provides "
            "an outline and relevant context about the topic. You follow the main "
            "objectives and direction of the outline, as provided by the Content Planner. "
            "You also provide objective and impartial insights and back them up with "
            "information provided by the Content Planner. You acknowledge in your "
            "opinion piece when your statements are opinions as opposed to objective statements."
        ),
        allow_delegation=False,
        verbose=True,
        llm=llm,
    )

    editor = Agent(
        role="Editor",
        goal="Edit a given blog post to align with the writing style of the organization.",
        backstory=(
            "You are an editor who receives a blog post from the Content Writer. "
            "Your goal is to review the blog post to ensure that it follows journalistic "
            "best practices, provides balanced viewpoints when providing opinions or "
            "assertions, and also avoids major controversial topics or opinions when possible."
        ),
        allow_delegation=False,
        verbose=True,
        llm=llm,
    )

    # --- Tasks (original structure + customization block appended) ---
    plan_task = Task(
        description=(
            "1. Prioritize the latest trends, key players, "
            "and noteworthy news on {topic}.\n"
            "2. Identify the target audience, considering "
            "their interests and pain points.\n"
            "3. Develop a detailed content outline including "
            "an introduction, key points, and a call to action.\n"
            "4. Include SEO keywords and relevant data or sources.\n"
            + custom
        ),
        expected_output=(
            "A comprehensive content plan document "
            "with an outline, audience analysis, "
            "SEO keywords, and resources."
        ),
        agent=planner,
    )

    write_task = Task(
        description=(
            "1. Use the content plan to craft a compelling "
            "blog post on {topic}.\n"
            "2. Incorporate SEO keywords naturally.\n"
            "3. Sections/Subtitles are properly named "
            "in an engaging manner.\n"
            "4. Ensure the post is structured with an "
            "engaging introduction, insightful body, "
            "and a summarizing conclusion.\n"
            "5. Proofread for grammatical errors and "
            "alignment with the brand's voice.\n"
            + custom
        ),
        expected_output=(
            "A well-written blog post in markdown format, ready for publication, "
            "each section should have 2 or 3 paragraphs."
        ),
        agent=writer,
    )

    edit_task = Task(
        description=(
            "Proofread the given blog post for grammatical errors and "
            "alignment with the brand's voice.\n"
            + editor_custom
        ),
        expected_output=(
            "A well-written blog post in markdown format, "
            "ready for publication, "
            "each section should have 2 or 3 paragraphs."
        ),
        agent=editor,
    )

    # --- Run all in one Crew (like the notebook) ---
    # crewAI handles context flow between tasks internally.
    try:
        crew = Crew(
            agents=[planner, writer, editor],
            tasks=[plan_task, write_task, edit_task],
            verbose=True,
        )
        result = await asyncio.to_thread(crew.kickoff, inputs={"topic": topic})
        final_article = str(result)
        logger.info("Pipeline done: %d chars", len(final_article))

    except Exception as exc:
        logger.exception("Pipeline failed")
        yield ProgressEvent("error", "error", f"Generation failed: {exc}")
        return

    yield ProgressEvent(
        "done", "completed",
        message=json.dumps({
            "article": final_article,
            "provider": provider_name,
            "topic": topic,
            "content_language": content_language,
            "language_name": lang_name,
            "tone": tone,
            "length": length,
            "perspective": perspective,
        }),
    )
