"""
Evaluation service — assesses developer answers, detects skill gaps,
generates viva questions.
"""
import logging
from typing import List, Dict, Any, Optional

from services.aws import invoke_model_structured
from services.rag.pipeline import rag_pipeline

logger = logging.getLogger(__name__)


VIVA_SYSTEM_PROMPT = """You are a senior software engineer conducting a technical code review interview.
Generate insightful technical questions based on the repository code and architecture.
Focus on design decisions, trade-offs, potential improvements, and best practices."""

EVAL_SYSTEM_PROMPT = """You are an expert technical interviewer and educator.
Evaluate the developer's answer objectively. Provide:
1. A score from 0-100
2. Understanding level: beginner/intermediate/advanced/expert
3. Detailed feedback
4. Correct answer or improvements
5. Key concepts the developer should study"""

SKILL_GAP_SYSTEM_PROMPT = """You are a senior engineering mentor.
Analyze the repository technology stack and compare it against the developer's demonstrated knowledge.
Identify specific skill gaps and provide actionable learning recommendations."""


class EvaluationService:

    def generate_viva_questions(
        self,
        repo_id: str,
        topic: Optional[str] = None,
        num_questions: int = 5,
    ) -> List[Dict[str, Any]]:
        """Generate technical interview questions based on the repository."""
        context = rag_pipeline.get_relevant_context(
            repo_id, topic or "architecture overview", top_k=8
        )
        prompt = f"""Based on the following code context from the repository, generate {num_questions} technical interview questions.

CODE CONTEXT:
{context}

{"Focus area: " + topic if topic else ""}

Return a JSON array with this structure:
[
  {{
    "id": "q1",
    "question": "...",
    "difficulty": "easy|medium|hard",
    "topic": "...",
    "expected_concepts": ["concept1", "concept2"]
  }}
]"""

        result = invoke_model_structured(
            prompt=prompt,
            system_prompt=VIVA_SYSTEM_PROMPT,
            schema_description="Array of question objects",
        )

        if isinstance(result, list):
            return result
        if isinstance(result, dict) and "text" in result:
            return [{"id": "q1", "question": result["text"], "difficulty": "medium", "topic": topic or "general", "expected_concepts": []}]
        return []

    def evaluate_answer(
        self,
        question: str,
        answer: str,
        context: Optional[str] = None,
        repo_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Evaluate a developer's answer to a technical question."""
        code_context = ""
        if repo_id:
            code_context = rag_pipeline.get_relevant_context(repo_id, question, top_k=3)
        elif context:
            code_context = context

        prompt = f"""Evaluate this technical answer.

QUESTION: {question}

DEVELOPER'S ANSWER: {answer}

{"RELEVANT CODE CONTEXT:\\n" + code_context if code_context else ""}

Provide evaluation in JSON format:
{{
  "score": <0-100>,
  "understanding_level": "<beginner|intermediate|advanced|expert>",
  "correct": <true|false>,
  "feedback": "...",
  "correct_answer": "...",
  "concepts_to_study": ["..."],
  "strengths": ["..."],
  "improvements": ["..."]
}}"""

        return invoke_model_structured(
            prompt=prompt,
            system_prompt=EVAL_SYSTEM_PROMPT,
            schema_description="Evaluation object with score and feedback",
        )

    def detect_skill_gaps(
        self,
        repo_id: str,
        user_id: str,
        assessment_results: Optional[List[Dict]] = None,
    ) -> Dict[str, Any]:
        """Compare repo requirements vs developer knowledge."""
        context = rag_pipeline.get_relevant_context(
            repo_id, "technology stack architecture patterns", top_k=10
        )

        assessment_summary = ""
        if assessment_results:
            scores = [r.get("score", 0) for r in assessment_results]
            avg_score = sum(scores) / len(scores) if scores else 0
            topics = [r.get("topic", "unknown") for r in assessment_results]
            assessment_summary = f"Recent assessment score: {avg_score:.0f}/100. Topics tested: {', '.join(topics)}."

        prompt = f"""Analyze skill gaps for this developer based on repository requirements.

REPOSITORY CODE CONTEXT:
{context}

DEVELOPER ASSESSMENT SUMMARY:
{assessment_summary or "No assessment data available."}

Return skill gap analysis in JSON:
{{
  "repo_technologies": ["..."],
  "identified_gaps": [
    {{
      "skill": "...",
      "current_level": "none|beginner|intermediate|advanced",
      "required_level": "beginner|intermediate|advanced|expert",
      "priority": "high|medium|low"
    }}
  ],
  "learning_path": ["..."],
  "estimated_time_weeks": <number>,
  "quick_wins": ["..."]
}}"""

        return invoke_model_structured(
            prompt=prompt,
            system_prompt=SKILL_GAP_SYSTEM_PROMPT,
            schema_description="Skill gap analysis object",
        )

    def generate_quiz(
        self,
        topic: str,
        difficulty: str = "intermediate",
        num_questions: int = 5,
        repo_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Generate multiple-choice quiz questions."""
        context = ""
        if repo_id:
            context = rag_pipeline.get_relevant_context(repo_id, topic, top_k=5)

        prompt = f"""Generate a {num_questions}-question multiple choice quiz on: {topic}
Difficulty: {difficulty}

{"CODE CONTEXT:\\n" + context if context else ""}

Return JSON array:
[
  {{
    "id": "q1",
    "question": "...",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "correct_answer": "A",
    "explanation": "...",
    "difficulty": "{difficulty}",
    "topic": "{topic}"
  }}
]"""

        result = invoke_model_structured(
            prompt=prompt,
            system_prompt="You are a technical education expert specializing in software engineering assessments.",
            schema_description="Array of quiz question objects",
        )
        
        if isinstance(result, dict):
            if "questions" in result:
                return result["questions"]
            if "quiz" in result:
                return result["quiz"]
            # Fallback for arbitrary root key wrapper
            for val in result.values():
                if isinstance(val, list):
                    return val
            return []
            
        return result if isinstance(result, list) else []


evaluation_service = EvaluationService()
