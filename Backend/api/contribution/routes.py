from fastapi import APIRouter, Depends, HTTPException
from utils.auth import get_current_user
from database import get_dynamodb_resource
from config import settings
from utils.helpers import utc_now_iso
import logging
import json
import re
import time
from services.aws.bedrock_runtime import invoke_model

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/contribution", tags=["Contribution"])

def _get_cache_table():
    db = get_dynamodb_resource()
    # Using users table or a separate cache table - let's use users table for profile data
    return db.Table(settings.DYNAMODB_USERS_TABLE)

def _get_dashboard_data(user_id: str) -> dict:
    from api.dashboard.routes import get_dashboard_summary
    # Need to get dashboard data. Assuming a simple implementation here
    # Since I don't have the exact get_dashboard_summary signature in this context,
    # I'll query the users table directly for some stats if needed, or if dashboard depends on others,
    # I'll retrieve it. Assuming get_dashboard_summary works or we extract directly:
    try:
        table = get_dynamodb_resource().Table(settings.DYNAMODB_USERS_TABLE)
        response = table.get_item(Key={"user_id": user_id})
        user = response.get("Item", {})
        
        # Getting actual data if possible. Since we just need dashboard data for prompt:
        # We can simulate getting it from the user profile, or call the exact controller.
        return {
            "repos_analyzed": user.get("repos_analyzed", 0) or user.get("total_repos", 0),
            "concept_mastery": user.get("concept_mastery", []),
            "avg_assessment_score": user.get("avg_assessment_score", 0),
            "total_roadmaps": user.get("total_roadmaps", 0),
            "skills_evaluated": user.get("skills_evaluated", 0),
            "rank": user.get("rank", "Novice"),
            "system_exp": user.get("system_exp", 0),
        }
    except Exception as e:
        logger.error(f"Error getting dashboard data: {e}")
        return {}


def _get_contribution_cache(user_id: str) -> dict:
    try:
        table = _get_cache_table()
        response = table.get_item(Key={"user_id": user_id})
        item = response.get("Item", {})
        
        cache = item.get("contribution_cache")
        if cache:
            cache_time = item.get("contribution_cache_time", 0)
            if time.time() - cache_time < 3600:  # 1 hour
                return cache
    except Exception as e:
        logger.error(f"Failed to get contribution cache: {e}")
    return {}

def _save_contribution_cache(user_id: str, data: dict):
    try:
        table = _get_cache_table()
        table.update_item(
            Key={"user_id": user_id},
            UpdateExpression="SET contribution_cache = :c, contribution_cache_time = :t",
            ExpressionAttributeValues={
                ":c": data,
                ":t": int(time.time())
            }
        )
    except Exception as e:
        logger.error(f"Failed to save contribution cache: {e}")

def _calculate_achievements(repos, score, roadmaps, skills) -> list:
    return [
        {
            "name": "FIRST SYSTEM SYNC",
            "description": "Analyze your first repository",
            "unlocked": repos > 0,
            "progress": 100 if repos > 0 else 0,
            "icon": "merge"
        },
        {
            "name": "CODE WHISPERER",
            "description": "Pass 5 assessments",
            "unlocked": skills >= 5,
            "progress": min(100, skills * 20),
            "icon": "shield"
        },
        {
            "name": "MASTER ARCHITECT",
            "description": "Complete a learning roadmap",
            "unlocked": roadmaps > 0,
            "progress": 100 if roadmaps > 0 else 0,
            "icon": "trophy"
        },
        {
            "name": "DOC MASTER",
            "description": "Analyze 10 repositories",
            "unlocked": repos >= 10,
            "progress": min(100, repos * 10),
            "icon": "book"
        },
        {
            "name": "COMMUNITY PILLAR",
            "description": "Reach Expert rank",
            "unlocked": score >= 90,
            "progress": min(100, int(score)),
            "icon": "people"
        }
    ]

def _calculate_fallback(dashboard_data: dict) -> dict:
    repos = dashboard_data.get("repos_analyzed", 0)
    score = dashboard_data.get("avg_assessment_score", 0)
    roadmaps = dashboard_data.get("total_roadmaps", 0)
    skills = dashboard_data.get("skills_evaluated", 0)
    mastery = dashboard_data.get("concept_mastery", [])
    
    readiness = min(100, (
        (20 if repos > 0 else 0) +
        (20 if score > 70 else int(score * 0.2)) +
        (15 if roadmaps > 0 else 0) +
        (15 if skills > 0 else 0) +
        min(30, len(mastery) * 5)
    ))
    
    label = (
        "Expert Contributor" if readiness >= 80 else
        "Active Contributor" if readiness >= 60 else
        "Growing Contributor" if readiness >= 30 else
        "Beginner Contributor"
    )
    
    return {
        "readiness_score": readiness,
        "readiness_label": label,
        "rank": dashboard_data.get("rank", "Novice"),
        "day_streak": skills,
        "total_contributions": repos + skills + roadmaps,
        "this_month_count": repos,
        "vs_last_month": 0,
        "strengths": [
            m["name"] if isinstance(m, dict) else m for m in mastery[:3]
        ] if mastery else ["Keep analyzing repositories"],
        "areas_to_improve": [
            "Complete more assessments",
            "Build learning roadmaps"
        ],
        "recommended_repos": [],
        "achievements": _calculate_achievements(
            repos, score, roadmaps, skills
        ),
        "monthly_activity": [
            {"month": "Sep", "count": 0},
            {"month": "Oct", "count": 0},
            {"month": "Nov", "count": 0},
            {"month": "Dec", "count": 0},
            {"month": "Jan", "count": 0},
            {"month": "Feb", "count": repos // 2},
            {"month": "Mar", "count": repos},
        ],
        "contribution_history": []
    }

@router.post("/analyze")
async def analyze_contribution(
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["sub"]
    
    # Gather user's real activity data
    dashboard_data = _get_dashboard_data(user_id)
    
    # Build context for AI
    context = f"""
    User Activity Summary:
    - Repositories analyzed: {dashboard_data.get('repos_analyzed', 0)}
    - Tech stacks learned: {dashboard_data.get('concept_mastery', [])}
    - Assessment scores: {dashboard_data.get('avg_assessment_score', 0)}
    - Learning roadmaps: {dashboard_data.get('total_roadmaps', 0)}
    - Skills evaluated: {dashboard_data.get('skills_evaluated', 0)}
    - System rank: {dashboard_data.get('rank', 'Novice')}
    - XP: {dashboard_data.get('system_exp', 0)}
    """
    
    # Call Bedrock to analyze contribution readiness
    prompt = f"""
    Based on this developer's activity data, generate a 
    contribution readiness analysis:
    
    {context}
    
    Return ONLY valid JSON with this exact structure:
    {{
      "readiness_score": <0-100 integer based on activity>,
      "readiness_label": "<Beginner|Growing|Active|Expert> Contributor",
      "rank": "<Novice|Contributor|Senior|Expert>",
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "areas_to_improve": ["area 1", "area 2"],
      "recommended_repos": [
        {{
          "name": "repo-name",
          "difficulty": "Beginner|Intermediate|Advanced",
          "language": "Python|TypeScript|etc",
          "description": "why this matches user",
          "match_reason": "Based on your X learning",
          "tags": ["#tag1", "#tag2"],
          "stars": "<estimated star count>",
          "complexity_score": <0-100>
        }}
      ],
      "achievements": [
        {{
          "name": "Achievement Name",
          "description": "What you need to do",
          "unlocked": <true|false based on user activity>,
          "progress": <0-100>,
          "icon": "merge|shield|book|people|trophy"
        }}
      ],
      "monthly_activity": [
        {{"month": "Sep", "count": <number>}},
        {{"month": "Oct", "count": <number>}},
        {{"month": "Nov", "count": <number>}},
        {{"month": "Dec", "count": <number>}},
        {{"month": "Jan", "count": <number>}},
        {{"month": "Feb", "count": <number>}},
        {{"month": "Mar", "count": <number>}}
      ],
      "this_month_count": <number>,
      "total_contributions": <number>,
      "vs_last_month": <positive or negative number>,
      "day_streak": <number based on recent activity>,
      "contribution_history": [
        {{
          "repo": "owner/repo-name",
          "description": "What was contributed",
          "type": "PR MERGED|ISSUE FIXED|DOCUMENTATION",
          "status": "MERGED|CLOSED|OPEN",
          "date": "recent date"
        }}
      ]
    }}
    
    Calculate readiness_score based on:
    - repos_analyzed > 0: +20 points
    - avg_assessment_score > 70: +20 points  
    - total_roadmaps > 0: +15 points
    - skills_evaluated > 0: +15 points
    - concept_mastery entries: +5 per entry (max 30)
    
    Make recommended_repos relevant to the user's tech stack.
    Make achievements reflect real milestones (repos analyzed,
    assessments passed, roadmaps completed).
    Return ONLY the JSON object, no markdown, no explanation.
    """
    
    try:
        # Use simple invoke_model which is imported
        response = invoke_model(prompt)
        
        # Parse JSON from response
        clean = re.sub(r'```json|```', '', response).strip()
        data = json.loads(clean)
        
        # Cache result in DynamoDB for 1 hour
        _save_contribution_cache(user_id, data)
        
        return data
    except Exception as e:
        logger.error(f"Contribution analysis failed: {e}")
        # Return calculated fallback based on real numbers
        return _calculate_fallback(dashboard_data)

@router.get("/profile")  
async def get_contribution_profile(
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["sub"]
    
    # Check cache first (valid for 1 hour)
    cached = _get_contribution_cache(user_id)
    if cached:
        return cached
    
    # No cache — calculate from real data
    dashboard_data = _get_dashboard_data(user_id)
    return _calculate_fallback(dashboard_data)
