from services.ai_orchestrator import ai_orchestrator
from database.dynamodb import get_dynamodb_resource
from config import settings
from utils.helpers import generate_id, utc_now_iso
from typing import List, Dict, Any

class LearningController:
    @staticmethod
    def _get_roadmaps_table():
        return get_dynamodb_resource().Table(settings.DYNAMODB_ROADMAPS_TABLE)

    @staticmethod
    def generate_roadmap(goal: str, stack: List[str], timeline: str, current_level: str, user_id: str) -> Dict[str, Any]:
        roadmap = ai_orchestrator.generate_learning_plan(goal, stack, timeline)

        if user_id and isinstance(roadmap, dict):
            roadmap_id = generate_id("rm_")
            roadmap["id"] = roadmap_id
            roadmap["roadmap_id"] = roadmap_id
            roadmap["user_id"] = user_id
            roadmap["created_at"] = utc_now_iso()
            try:
                LearningController._get_roadmaps_table().put_item(Item=roadmap)
            except Exception as e:
                pass
        return roadmap

    @staticmethod
    def get_roadmap(roadmap_id: str) -> Dict[str, Any]:
        try:
            resp = LearningController._get_roadmaps_table().get_item(Key={"id": roadmap_id})
            return resp.get("Item")
        except Exception:
            return None

    @staticmethod
    def generate_module(topic: str, difficulty: str, repo_id: str = None) -> Dict[str, Any]:
        # If repo_id provided, maybe use rag in ai_orchestrator? We'll just pass topic for now
        return ai_orchestrator.generate_learning_module(topic)

    @staticmethod
    def complete_concept(roadmap_id: str, concept_id: str, user_id: str) -> bool:
        roadmap = LearningController.get_roadmap(roadmap_id)
        if not roadmap or roadmap.get("user_id") != user_id:
            return False

        updated = False
        for phase in roadmap.get("phases", []):
            for concept in phase.get("concepts", []):
                if concept.get("id") == concept_id:
                    concept["completed"] = True
                    updated = True

        if updated:
            try:
                LearningController._get_roadmaps_table().put_item(Item=roadmap)
            except Exception:
                return False
        return updated

learning_controller = LearningController()
