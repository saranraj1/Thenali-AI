from services.ai_orchestrator import ai_orchestrator
from services.rag.pipeline import rag_pipeline
from database.dynamodb import get_dynamodb_resource
from config import settings
from utils.helpers import utc_now_iso
import logging

logger = logging.getLogger(__name__)

class RepoController:
    @staticmethod
    def _get_intelligence_table():
        return get_dynamodb_resource().Table(settings.DYNAMODB_REPO_INTELLIGENCE_TABLE)

    @staticmethod
    def generate_intelligence(repo_id: str) -> dict:
        """Generates intelligence report, cached in DB."""
        # 1. Check cache first
        table = RepoController._get_intelligence_table()
        try:
            resp = table.get_item(Key={"repo_id": repo_id})
            if "Item" in resp and resp["Item"].get("architecture_summary"):
                logger.info(f"Returning cached intelligence for {repo_id}")
                return resp["Item"]
        except Exception as e:
            logger.warning(f"Cache check failed: {e}")

        # 2. Extract context via RAG
        context = rag_pipeline.get_relevant_context(repo_id, "architecture design patterns", top_k=8)
        
        # 3. Call AI Orchestrator
        intelligence = ai_orchestrator.generate_repo_intelligence(context)

        # 4. Save to DB
        try:
            item = {
                "repo_id": repo_id,
                "overview": intelligence.get("overview", ""),
                "architecture_summary": intelligence.get("architecture_summary", ""),
                "complexity_score": str(intelligence.get("complexity_score", 0)),
                "recommendations": intelligence.get("recommendations", []),
                "contribution_opportunities": intelligence.get("contribution_opportunities", []),
                "tech_stack": intelligence.get("tech_stack", []),
                "design_patterns": intelligence.get("design_patterns", []),
                "mermaid_diagram": intelligence.get("mermaid_diagram", ""),
                "risks": intelligence.get("risks", []),
                "strengths": intelligence.get("strengths", []),
                "generated_at": utc_now_iso(),
            }
            table.put_item(Item=item)
            return item
        except Exception as e:
            logger.warning(f"Could not save intelligence report: {e}")
            return intelligence

    @staticmethod
    def chat(repo_id: str, user_query: str) -> str:
        return ai_orchestrator.rag_chat(repo_id, user_query)

repo_controller = RepoController()
