"""
CrewAI agent pipeline: Planner → Writer → Editor.
Extracted from the original Jupyter notebook and adapted for production.
Supports async streaming of progress updates via Server-Sent Events.
"""
import asyncio
import logging
from typing import AsyncGenerator

from crewai import Agent, Task, Crew
from crewai import LLM

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Agent definitions (from the original notebook, translated to crewAI v0.108+)
# ---------------------------------------------------------------------------

def _create_agents(llm: LLM) -> tuple[Agent, Agent, Agent]:
    """Create the three agents with a shared LLM."""

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

    return planner, writer, editor


def _create_tasks(
    planner: Agent, writer: Agent, editor: Agent, topic: str
) -> tuple[Task, Task, Task]:
    """Create the three sequential tasks for the pipeline."""

    plan_task = Task(
        description=(
            "1. Prioritize the latest trends, key players, "
            "and noteworthy news on {topic}.\n"
            "2. Identify the target audience, considering "
            "their interests and pain points.\n"
            "3. Develop a detailed content outline including "
            "an introduction, key points, and a call to action.\n"
            "4. Include SEO keywords and relevant data or sources."
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
            "alignment with the brand's voice."
        ),
        expected_output=(
            "A well-written blog post in markdown format, "
            "ready for publication, "
            "each section should have 2 or 3 paragraphs."
        ),
        agent=editor,
    )

    return plan_task, write_task, edit_task


# ---------------------------------------------------------------------------
# Progress event model (yielded to the SSE stream)
# ---------------------------------------------------------------------------

class ProgressEvent:
    """Lightweight progress update sent to the frontend via SSE."""

    def __init__(self, step: str, status: str, message: str):
        self.step = step       # "planning", "writing", "editing", "done", "error"
        self.status = status    # "running", "completed", "error"
        self.message = message  # Human-readable description

    def to_sse(self) -> str:
        """Format as SSE data line."""
        import json
        return f"data: {json.dumps(self.__dict__)}\n\n"


# ---------------------------------------------------------------------------
# Pipeline runner with progress streaming
# ---------------------------------------------------------------------------

async def run_article_pipeline(
    topic: str, provider_name: str, llm: LLM
) -> AsyncGenerator[ProgressEvent, None]:
    """Run the Planner → Writer → Editor pipeline, yielding progress events.

    Args:
        topic: The article topic/question from the user.
        provider_name: Name of the LLM provider being used (for logging).
        llm: A crewAI LLM instance.

    Yields:
        ProgressEvent objects at each stage of the pipeline.
    """
    logger.info("Starting pipeline for topic=%r with provider=%s", topic, provider_name)

    # --- Create agents and tasks ---
    planner, writer, editor = _create_agents(llm)
    plan_task, write_task, edit_task = _create_tasks(planner, writer, editor, topic)

    # --- Stage 1: Planning ---
    yield ProgressEvent(
        step="planning",
        status="running",
        message="Planner is researching the topic and building an outline...",
    )

    try:
        # Run plan in a thread to avoid blocking the event loop
        plan_crew = Crew(
            agents=[planner],
            tasks=[plan_task],
            verbose=True,
        )
        plan_result = await asyncio.to_thread(
            plan_crew.kickoff, inputs={"topic": topic}
        )
        logger.info("Plan completed: %d chars", len(str(plan_result)))

        yield ProgressEvent(
            step="planning",
            status="completed",
            message="Outline and research plan ready.",
        )

    except Exception as exc:
        logger.exception("Planning stage failed")
        yield ProgressEvent(
            step="planning",
            status="error",
            message=f"Planning failed: {exc}",
        )
        return

    # --- Stage 2: Writing ---
    yield ProgressEvent(
        step="writing",
        status="running",
        message="Writer is crafting the article from the plan...",
    )

    try:
        write_crew = Crew(
            agents=[writer],
            tasks=[write_task],
            verbose=True,
        )
        draft = await asyncio.to_thread(
            write_crew.kickoff, inputs={"topic": topic}
        )
        logger.info("Draft completed: %d chars", len(str(draft)))

        yield ProgressEvent(
            step="writing",
            status="completed",
            message="First draft of the article is ready.",
        )

    except Exception as exc:
        logger.exception("Writing stage failed")
        yield ProgressEvent(
            step="writing",
            status="error",
            message=f"Writing failed: {exc}",
        )
        return

    # --- Stage 3: Editing ---
    yield ProgressEvent(
        step="editing",
        status="running",
        message="Editor is polishing the article for quality and clarity...",
    )

    try:
        edit_crew = Crew(
            agents=[editor],
            tasks=[edit_task],
            verbose=True,
        )
        final_article = await asyncio.to_thread(
            edit_crew.kickoff, inputs={"topic": topic}
        )
        logger.info("Final article: %d chars", len(str(final_article)))

        yield ProgressEvent(
            step="editing",
            status="completed",
            message="Article has been reviewed and polished.",
        )

    except Exception as exc:
        logger.exception("Editing stage failed")
        yield ProgressEvent(
            step="editing",
            status="error",
            message=f"Editing failed: {exc}",
        )
        return

    # --- Done: send final article as a special event ---
    import json
    yield ProgressEvent(
        step="done",
        status="completed",
        message=json.dumps({
            "article": str(final_article),
            "provider": provider_name,
            "topic": topic,
        }),
    )
