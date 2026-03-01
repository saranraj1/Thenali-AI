"""
Dashboard API routes.

Changes from original:
  - concept_mastery now returned as an ARRAY of { name, score } objects
    instead of a float, matching the frontend skill radar chart expectations.
  - The per-skill breakdown is derived from the assessments table.
  - learning_progress now included as an array matching frontend expectations.
"""
import logging
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any

from config import settings
from database import get_dynamodb_resource
from utils.auth import get_current_user
from utils.helpers import utc_now_iso

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("")
async def get_dashboard(current_user: dict = Depends(get_current_user)) -> Dict[str, Any]:
    """
    Returns aggregated dashboard metrics for the authenticated user.

    concept_mastery is returned as an ARRAY of { name, score } objects
    (previously was a float) matching the frontend skill radar chart.
    """
    user_id = current_user["sub"]
    db = get_dynamodb_resource()

    try:
        # ── Repos ──────────────────────────────────────────────────────────
        repos_table = db.Table(settings.DYNAMODB_REPOS_TABLE)
        repos_resp = repos_table.scan(
            FilterExpression="user_id = :uid",
            ExpressionAttributeValues={":uid": user_id},
        )
        repos = repos_resp.get("Items", [])
        repos_analyzed = len([r for r in repos if r.get("status") == "analyzed"])

        # ── Assessments ────────────────────────────────────────────────────
        assessments_table = db.Table(settings.DYNAMODB_ASSESSMENTS_TABLE)
        assess_resp = assessments_table.scan(
            FilterExpression="user_id = :uid",
            ExpressionAttributeValues={":uid": user_id},
        )
        assessments = assess_resp.get("Items", [])
        skills_evaluated = len(assessments)

        # Per-topic skill mastery breakdown — frontend expects array of { name, score }
        topic_scores: Dict[str, list] = {}
        for a in assessments:
            topic = a.get("topic", "General")
            answers = a.get("answers", [])
            scores = [
                ans.get("evaluation", {}).get("score", 0)
                for ans in answers
                if isinstance(ans.get("evaluation"), dict)
            ]
            if scores:
                avg = round(sum(scores) / len(scores) * 10, 1)  # normalise to 0-100
                topic_scores.setdefault(topic, []).append(avg)

        concept_mastery = [
            {
                "name": topic,
                "score": round(sum(scores) / len(scores), 1),
            }
            for topic, scores in topic_scores.items()
        ]
        # If no assessments yet, return sensible placeholder values
        if not concept_mastery:
            concept_mastery = []

        avg_assessment_score = (
            round(
                sum(
                    float(a.get("score", 0) or 0)
                    for a in assessments
                ) / skills_evaluated,
                1,
            )
            if skills_evaluated > 0
            else 0
        )

        # ── Roadmaps / Learning progress ───────────────────────────────────
        roadmaps_table = db.Table(settings.DYNAMODB_ROADMAPS_TABLE)
        rm_resp = roadmaps_table.scan(
            FilterExpression="user_id = :uid",
            ExpressionAttributeValues={":uid": user_id},
        )
        roadmaps = rm_resp.get("Items", [])
        concepts_learned = sum(
            1 for rm in roadmaps
            for phase in rm.get("phases", [])
            for concept in phase.get("concepts", [])
            if concept.get("completed")
        )

        # Learning progress for the progress tracker component
        learning_progress = []
        for rm in roadmaps:
            phases = rm.get("phases", [])
            total_concepts = sum(len(p.get("concepts", [])) for p in phases)
            done_concepts = sum(
                1 for p in phases for c in p.get("concepts", []) if c.get("completed")
            )
            pct = round(done_concepts / total_concepts * 100) if total_concepts > 0 else 0
            status = "Completed" if pct == 100 else "Active" if pct > 0 else "Initialized"
            learning_progress.append({
                "id": rm.get("roadmap_id", ""),
                "title": rm.get("goal", rm.get("title", "Learning Roadmap")),
                "progress": pct,
                "status": status,
            })

        # ── Recent Activity ────────────────────────────────────────────────
        activity_table = db.Table(settings.DYNAMODB_ACTIVITY_LOGS_TABLE)
        try:
            activity_resp = activity_table.query(
                KeyConditionExpression="user_id = :uid",
                ExpressionAttributeValues={":uid": user_id},
                ScanIndexForward=False,
                Limit=10,
            )
            recent_activity = activity_resp.get("Items", [])
        except Exception:
            recent_activity = []

        # ── User info ──────────────────────────────────────────────────────
        users_table = db.Table(settings.DYNAMODB_USERS_TABLE)
        user_resp = users_table.get_item(Key={"user_id": user_id})
        user = user_resp.get("Item", {})

        return {
            "user_id": user_id,
            "username": user.get("username", current_user.get("username")),
            "rank": user.get("rank", "Novice"),
            "system_exp": user.get("system_exp", 0),
            "repos_analyzed": repos_analyzed,
            "total_repos": len(repos),
            "concepts_learned": concepts_learned,
            "skills_evaluated": skills_evaluated,
            "avg_assessment_score": avg_assessment_score,
            "total_roadmaps": len(roadmaps),
            "recent_activity": recent_activity,
            # CHANGED: array of { name, score } not a float
            "concept_mastery": concept_mastery,
            # ADDED: learning_progress array for the tracker component
            "learning_progress": learning_progress,
        }

    except Exception as e:
        logger.error(f"Dashboard error for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to load dashboard data")


async def log_activity(
    user_id: str,
    activity_type: str,
    description: str,
    status: str = "success",
):
    """Helper to log user activity to DynamoDB."""
    try:
        db = get_dynamodb_resource()
        table = db.Table(settings.DYNAMODB_ACTIVITY_LOGS_TABLE)
        table.put_item(Item={
            "user_id": user_id,
            "timestamp": utc_now_iso(),
            "activity_type": activity_type,
            "description": description,
            "status": status,
        })
    except Exception as e:
        logger.warning(f"Activity log failed: {e}")
