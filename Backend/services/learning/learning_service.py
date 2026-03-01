"""
Learning service — generates roadmaps, learning modules, and
tracks concept completion via DynamoDB.
"""
import logging
from typing import List, Dict, Any, Optional

from config import settings
from services.aws import invoke_model_structured
from database import get_dynamodb_resource
from utils.helpers import generate_id, utc_now_iso

logger = logging.getLogger(__name__)


ROADMAP_SYSTEM_PROMPT = """You are an expert software engineering mentor and curriculum designer.
Create personalized, comprehensive learning roadmaps with actionable milestones.
Include resources, time estimates, and practical projects for each phase."""

MODULE_SYSTEM_PROMPT = """You are a world-class software engineering educator.
Create comprehensive, engaging learning modules with clear explanations,
code examples, best practices, and practical exercises."""


class LearningService:

    def generate_roadmap(
        self,
        goal: str,
        stack: List[str],
        timeline: str,
        current_level: str = "beginner",
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Generate a personalized learning roadmap."""
        prompt = f"""Create a detailed learning roadmap for:
Goal: {goal}
Technology Stack: {', '.join(stack)}
Timeline: {timeline}
Current Level: {current_level}

Return a JSON object:
{{
  "title": "...",
  "goal": "{goal}",
  "stack": {stack},
  "timeline": "{timeline}",
  "total_weeks": <number>,
  "phases": [
    {{
      "phase": 1,
      "title": "...",
      "duration_weeks": <number>,
      "objectives": ["..."],
      "concepts": [
        {{
          "id": "c1",
          "name": "...",
          "description": "...",
          "resources": ["..."],
          "estimated_hours": <number>,
          "completed": false
        }}
      ],
      "projects": ["..."],
      "milestones": ["..."]
    }}
  ],
  "tips": ["..."],
  "success_metrics": ["..."]
}}"""

        roadmap = invoke_model_structured(
            prompt=prompt,
            system_prompt=ROADMAP_SYSTEM_PROMPT,
            schema_description="Roadmap object with phases and concepts",
        )

        # Persist to DynamoDB
        if user_id and isinstance(roadmap, dict) and not roadmap.get("raw"):
            roadmap_id = generate_id("rm_")
            roadmap["id"] = roadmap_id
            roadmap["roadmap_id"] = roadmap_id
            roadmap["user_id"] = user_id
            roadmap["created_at"] = utc_now_iso()
            try:
                db = get_dynamodb_resource()
                table = db.Table(settings.DYNAMODB_ROADMAPS_TABLE)
                table.put_item(Item=roadmap)
            except Exception as e:
                logger.warning(f"Could not save roadmap to DynamoDB: {e}")

        return roadmap

    def get_roadmap(self, roadmap_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a roadmap from DynamoDB."""
        try:
            db = get_dynamodb_resource()
            table = db.Table(settings.DYNAMODB_ROADMAPS_TABLE)
            response = table.get_item(Key={"id": roadmap_id})
            return response.get("Item")
        except Exception as e:
            logger.error(f"Could not retrieve roadmap {roadmap_id}: {e}")
            return None

    def complete_concept(
        self, roadmap_id: str, concept_id: str, user_id: str
    ) -> bool:
        """Mark a concept as completed in a roadmap."""
        try:
            roadmap = self.get_roadmap(roadmap_id)
            if not roadmap:
                return False

            updated = False
            for phase in roadmap.get("phases", []):
                for concept in phase.get("concepts", []):
                    if concept.get("id") == concept_id:
                        concept["completed"] = True
                        concept["completed_at"] = utc_now_iso()
                        updated = True
                        break

            if updated:
                db = get_dynamodb_resource()
                table = db.Table(settings.DYNAMODB_ROADMAPS_TABLE)
                table.put_item(Item=roadmap)
            return updated
        except Exception as e:
            logger.error(f"Could not complete concept {concept_id}: {e}")
            return False

    def generate_learning_module(
        self,
        topic: str,
        difficulty: str = "intermediate",
        repo_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Generate a comprehensive learning module."""
        code_context = ""
        if repo_id:
            from services.rag.pipeline import rag_pipeline
            code_context = rag_pipeline.get_relevant_context(repo_id, topic, top_k=5)

        prompt = f"""Create a comprehensive learning module on: {topic}
Difficulty: {difficulty}
{"Repository-specific context:\\n" + code_context if code_context else ""}

Return JSON:
{{
  "title": "...",
  "topic": "{topic}",
  "difficulty": "{difficulty}",
  "estimated_time_minutes": <number>,
  "learning_objectives": ["..."],
  "sections": [
    {{
      "title": "...",
      "content": "...",
      "code_examples": ["..."],
      "key_points": ["..."]
    }}
  ],
  "summary": "...",
  "exercises": ["..."],
  "quiz_topics": ["..."],
  "further_reading": ["..."]
}}"""

        return invoke_model_structured(
            prompt=prompt,
            system_prompt=MODULE_SYSTEM_PROMPT,
            schema_description="Learning module object",
        )

    def get_user_progress(self, user_id: str) -> Dict[str, Any]:
        """Aggregate learning progress across all user roadmaps."""
        try:
            db = get_dynamodb_resource()
            table = db.Table(settings.DYNAMODB_ROADMAPS_TABLE)
            response = table.scan(
                FilterExpression="user_id = :uid",
                ExpressionAttributeValues={":uid": user_id},
            )
            roadmaps = response.get("Items", [])

            total_concepts = 0
            completed_concepts = 0
            for roadmap in roadmaps:
                for phase in roadmap.get("phases", []):
                    for concept in phase.get("concepts", []):
                        total_concepts += 1
                        if concept.get("completed"):
                            completed_concepts += 1

            return {
                "user_id": user_id,
                "total_roadmaps": len(roadmaps),
                "total_concepts": total_concepts,
                "completed_concepts": completed_concepts,
                "completion_rate": (
                    round(completed_concepts / total_concepts * 100, 1)
                    if total_concepts > 0 else 0
                ),
                "roadmaps": [
                    {
                        "id": r.get("id"),
                        "title": r.get("title"),
                        "goal": r.get("goal"),
                        "created_at": r.get("created_at"),
                    }
                    for r in roadmaps
                ],
            }
        except Exception as e:
            logger.error(f"Could not get user progress for {user_id}: {e}")
            return {"user_id": user_id, "error": str(e)}

    def generate_contribution_recommendations(
        self, repo_id: str, user_id: str
    ) -> List[Dict[str, Any]]:
        """Generate contribution opportunities for a developer."""
        from services.rag.pipeline import rag_pipeline
        context = rag_pipeline.get_relevant_context(
            repo_id, "bugs issues todos improvements", top_k=10
        )

        prompt = f"""Analyze this repository code and identify contribution opportunities.

REPOSITORY CODE CONTEXT:
{context}

Return JSON array of contribution opportunities:
[
  {{
    "type": "bug_fix|feature|documentation|testing|refactoring|performance",
    "title": "...",
    "description": "...",
    "difficulty": "easy|medium|hard",
    "estimated_time": "...",
    "relevant_files": ["..."],
    "skills_needed": ["..."],
    "impact": "low|medium|high"
  }}
]"""

        result = invoke_model_structured(
            prompt=prompt,
            system_prompt="You are an open source contribution mentor with deep expertise in code analysis.",
            schema_description="Array of contribution opportunity objects",
        )
        return result if isinstance(result, list) else []


learning_service = LearningService()
