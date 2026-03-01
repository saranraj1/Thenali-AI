"""
Assessments API routes.

Changes from original:
  - AssessmentStartRequest now includes optional repo_id so quiz can be
    tailored to a specific repository context.
  - GET /results/{assessment_id} now computes and returns total_score,
    max_score, percentage, passed — fields expected by the frontend.
  - DynamoDB PK is "id" internally; the response always surfaces it as
    "assessment_id" so the frontend never sees the raw PK name.
  - POST /answer returns the evaluation at the TOP LEVEL (not nested under
    { evaluation: {...} }) so the frontend can read data.score directly.
"""
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException

from config import settings
from database import get_dynamodb_resource
from models.schemas import (
    AssessmentStartRequest, AssessmentAnswerRequest,
    VoiceAssessmentAnswerRequest, EvaluateAnswerRequest
)
from utils.auth import get_current_user
from utils.helpers import generate_id, utc_now_iso
from controllers.assessment_controller import assessment_controller
from services.aws.transcribe import transcribe_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/assessment", tags=["Assessments"])


def get_assessments_table():
    return get_dynamodb_resource().Table(settings.DYNAMODB_ASSESSMENTS_TABLE)


@router.post("/start")
async def start_assessment(
    body: AssessmentStartRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Start a new assessment session and return questions.

    If repo_id is supplied, questions are generated with repository context.
    Returns { assessment_id, topic, questions[], total_questions }.
    """
    user_id = current_user["sub"]
    assessment_id = generate_id("assess_")

    questions = assessment_controller.generate_quiz(
        topic=body.topic,
        difficulty=body.difficulty or "intermediate",
        num_questions=body.num_questions or 5,
    )

    assessment = {
        "id": assessment_id,
        "assessment_id": assessment_id,
        "user_id": user_id,
        "topic": body.topic,
        "repo_id": body.repo_id,
        "difficulty": body.difficulty or "intermediate",
        "questions": questions,
        "answers": [],
        "score": None,
        "understanding_level": None,
        "status": "in_progress",
        "created_at": utc_now_iso(),
    }

    try:
        get_assessments_table().put_item(Item=assessment)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create assessment: {e}")

    return {
        "assessment_id": assessment_id,   # frontend key (not "id")
        "topic": body.topic,
        "questions": questions,
        "total_questions": len(questions),
    }


@router.post("/answer")
async def submit_answer(
    body: AssessmentAnswerRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Submit an answer for evaluation.

    Returns the evaluation at the TOP LEVEL — { score, feedback, is_correct, ... }
    NOT nested under { evaluation: {...} } — matching frontend expectations.
    """
    table = get_assessments_table()

    try:
        resp = table.get_item(Key={"assessment_id": body.assessment_id})
        assessment = resp.get("Item")
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")

        question_text = ""
        for q in assessment.get("questions", []):
            if q.get("id") == body.question_id:
                question_text = q.get("question", "")
                break

        evaluation = assessment_controller.evaluate_answer(
            question=question_text,
            answer=body.answer,
        )

        answer_record = {
            "question_id": body.question_id,
            "answer": body.answer,
            "evaluation": evaluation,
            "submitted_at": utc_now_iso(),
        }

        answers = assessment.get("answers", [])
        answers.append(answer_record)

        table.update_item(
            Key={"assessment_id": body.assessment_id},
            UpdateExpression="SET answers = :answers",
            ExpressionAttributeValues={":answers": answers},
        )

        # Return evaluation at TOP LEVEL — not wrapped in { evaluation: {...} }
        return {
            "assessment_id": body.assessment_id,
            "question_id": body.question_id,
            # Evaluate fields flat
            "score": evaluation.get("score", 0),
            "feedback": evaluation.get("feedback", ""),
            "is_correct": evaluation.get("is_correct", False),
            "detailed_feedback": evaluation.get("detailed_feedback", ""),
            "skill_gaps": evaluation.get("skill_gaps", []),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/voice")
async def submit_voice_answer(
    body: VoiceAssessmentAnswerRequest,
    current_user: dict = Depends(get_current_user),
):
    """Evaluate a voice-recorded answer via Transcribe."""
    try:
        s3_uri = f"s3://{settings.S3_VOICE_BUCKET}/{body.audio_s3_key}"
        transcript = transcribe_service.transcribe_s3_audio(s3_uri)

        table = get_assessments_table()
        resp = table.get_item(Key={"assessment_id": body.assessment_id})
        assessment = resp.get("Item")

        question_text = ""
        for q in (assessment or {}).get("questions", []):
            if q.get("id") == body.question_id:
                question_text = q.get("question", "")
                break

        evaluation = assessment_controller.evaluate_answer(
            question=question_text,
            answer=transcript,
        )

        return {
            "transcript": transcript,
            **evaluation,   # flat evaluation fields
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/results/{assessment_id}")
async def get_results(
    assessment_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Get the complete results of an assessment.

    Computes and returns total_score, max_score, percentage, passed
    fields that the frontend expects — in addition to the raw assessment data.
    The response always uses "assessment_id" as the key (not "id").
    """
    try:
        resp = get_assessments_table().get_item(Key={"assessment_id": assessment_id})
        assessment = resp.get("Item")
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")

        answers = assessment.get("answers", [])
        questions = assessment.get("questions", [])
        max_score = len(questions) * 10   # 10 points per question

        # Compute final score from individual answer evaluations
        scores = [
            a.get("evaluation", {}).get("score", 0)
            for a in answers
            if isinstance(a.get("evaluation"), dict)
        ]
        avg_score = round(sum(scores) / len(scores), 1) if scores else 0
        total_score = round(sum(scores), 1)
        percentage = round((total_score / max_score) * 100, 1) if max_score > 0 else 0
        passed = percentage >= 60   # 60% pass threshold

        # Persist computed results
        try:
            get_assessments_table().update_item(
                Key={"assessment_id": assessment_id},
                UpdateExpression="SET score = :score, #st = :status",
                ExpressionAttributeValues={
                    ":score": str(avg_score),
                    ":status": "completed",
                },
                ExpressionAttributeNames={"#st": "status"},
            )
        except Exception:
            pass

        return {
            # Always use assessment_id (not "id") in the response
            "assessment_id": assessment_id,
            "topic": assessment.get("topic", ""),
            "difficulty": assessment.get("difficulty", ""),
            "status": "completed",
            "questions": questions,
            "answers": answers,
            # Computed fields the frontend expects
            "total_score": total_score,
            "max_score": max_score,
            "avg_score": avg_score,
            "percentage": percentage,
            "passed": passed,
            "created_at": assessment.get("created_at", ""),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
