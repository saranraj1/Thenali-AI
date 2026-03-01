"""
Learning API routes — roadmaps, modules, progress.

Changes from original:
  - generate_roadmap now returns the roadmap object flat (with roadmap_id
    and phases at top level), not wrapped in { success, roadmap }.
  - generate_module now uses LearningModuleRequest.effective_topic() so it
    accepts both { topic } and the legacy { lesson_id, context } format.
  - generate_module returns the module object flat (not wrapped in { success, module }).
"""
import logging
from fastapi import APIRouter, Depends, HTTPException

from models.schemas import (
    RoadmapRequest, ConceptCompleteRequest,
    LearningModuleRequest, SuccessResponse
)
from utils.auth import get_current_user
from controllers.learning_controller import learning_controller

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/learning", tags=["Learning"])


@router.post("/roadmap")
async def generate_roadmap(
    body: RoadmapRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Generate a personalized learning roadmap.

    Returns roadmap fields at the TOP LEVEL (not wrapped in { success, roadmap })
    so the frontend can read data.roadmap_id and data.phases directly.
    """
    user_id = current_user["sub"]
    try:
        roadmap = learning_controller.generate_roadmap(
            goal=body.goal,
            stack=body.stack,
            timeline=body.timeline,
            current_level=body.current_level or "beginner",
            user_id=user_id,
        )
        # Return flat — frontend reads data.roadmap_id and data.phases
        if isinstance(roadmap, dict):
            return roadmap
        # If service returns a list of phases directly, wrap minimally
        return {"roadmap_id": None, "phases": roadmap}
    except Exception as e:
        logger.error(f"Roadmap generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/roadmap/{roadmap_id}")
async def get_roadmap(
    roadmap_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get a specific roadmap by ID."""
    roadmap = learning_controller.get_roadmap(roadmap_id)
    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return roadmap


@router.post("/concept-complete")
async def complete_concept(
    body: ConceptCompleteRequest,
    current_user: dict = Depends(get_current_user),
):
    """Mark a learning concept as completed. Requires both roadmap_id and concept_id."""
    user_id = current_user["sub"]
    success = learning_controller.complete_concept(
        body.roadmap_id, body.concept_id, user_id
    )
    if not success:
        raise HTTPException(status_code=404, detail="Roadmap or concept not found")
    return {"success": True, "message": "Concept marked as completed"}


@router.get("/progress")
async def get_progress(current_user: dict = Depends(get_current_user)):
    """Get the user's overall learning progress."""
    user_id = current_user["sub"]
    progress = {"total_roadmaps": 0, "completed_concepts": 0} # learning_controller.get_user_progress(user_id) if implemented
    return progress


@router.post("/module")
async def generate_module(
    body: LearningModuleRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Generate a learning module on a specific topic.

    Accepts BOTH formats:
      Backend-native:  { "topic": "React Hooks", "difficulty": "intermediate" }
      Frontend-legacy: { "lesson_id": "react-hooks", "context": "general" }

    Returns module fields at the TOP LEVEL (not wrapped in { success, module })
    so the frontend can read data.title, data.content directly.
    """
    try:
        topic = body.effective_topic()
        module = learning_controller.generate_module(
            topic=topic,
            difficulty=body.difficulty or "intermediate",
            repo_id=body.repo_id,
        )
        # Return flat — frontend reads data.title, data.content, etc. directly
        if isinstance(module, dict):
            return module
        return {"title": topic, "content": str(module)}
    except Exception as e:
        logger.error(f"Module generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
