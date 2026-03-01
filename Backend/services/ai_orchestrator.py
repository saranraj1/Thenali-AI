import json
from typing import Dict, Any, List, Optional
from services.aws.bedrock_runtime import invoke_model, invoke_model_structured
from prompts.system_prompt import SYSTEM_PROMPT
from services.rag.pipeline import rag_pipeline

class AIOrchestrator:

    @staticmethod
    def generate_repo_intelligence(repo_context: str) -> Dict[str, Any]:
        prompt = f"""Analyze this repository based on the provided code context.
Return a final comprehensive intelligence report in strict JSON format.

CODE CONTEXT:
{repo_context}

Output format:
{{
    "overview": "Brief description of the repository",
    "architecture_summary": "Architecture explanation",
    "complexity_score": <1-100 float>,
    "tech_stack": ["React", "Python", ...],
    "design_patterns": ["Singleton", "Factory", ...],
    "recommendations": ["Improvement 1", "Improvement 2"],
    "contribution_opportunities": ["Opportunity 1", "Opportunity 2"],
    "risks": ["Risk 1"],
    "strengths": ["Strength 1"],
    "mermaid_diagram": "mermaid diagram code or empty string"
}}"""
        return invoke_model_structured(
            prompt=prompt,
            system_prompt=SYSTEM_PROMPT,
            schema_description="Repository Intelligence Object"
        )

    @staticmethod
    def generate_learning_plan(goal: str, stack: List[str], timeline: str) -> Dict[str, Any]:
        prompt = f"""Generate a detailed developer learning roadmap.
Goal: {goal}
Stack: {', '.join(stack)}
Timeline: {timeline}

Return a valid JSON object matching exactly this schema:
{{
  "title": "Roadmap title",
  "goal": "{goal}",
  "stack": {json.dumps(stack)},
  "timeline": "{timeline}",
  "total_weeks": <number>,
  "phases": [
    {{
      "phase": <number>,
      "title": "Phase title",
      "duration_weeks": <number>,
      "objectives": ["obj1", "obj2"],
      "concepts": [
        {{
          "id": "c1",
          "name": "Concept name",
          "description": "...",
          "resources": ["url1"],
          "estimated_hours": <number>,
          "completed": false
        }}
      ],
      "projects": ["proj1"],
      "milestones": ["ms1"]
    }}
  ],
  "tips": ["tip1", "tip2"],
  "success_metrics": ["metric1"]
}}"""
        return invoke_model_structured(
            prompt=prompt,
            system_prompt=SYSTEM_PROMPT,
            schema_description="Learning Roadmap Object"
        )

    @staticmethod
    def generate_learning_module(topic: str) -> Dict[str, Any]:
        prompt = f"""Generate an in-depth learning module for a developer on the topic: {topic}.

Return a detailed JSON object:
{{
  "title": "...",
  "topic": "{topic}",
  "difficulty": "intermediate",
  "estimated_time_minutes": 60,
  "learning_objectives": ["..."],
  "sections": [
    {{
      "title": "...",
      "content": "Detailed text content...",
      "code_examples": ["code string..."],
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
            system_prompt=SYSTEM_PROMPT,
            schema_description="Learning Module Object"
        )

    @staticmethod
    def generate_quiz(topic: str, difficulty: str) -> List[Dict[str, Any]]:
        prompt = f"""Generate a 5-question multiple choice quiz on: {topic}
Difficulty: {difficulty}

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
        res = invoke_model_structured(
            prompt=prompt,
            system_prompt=SYSTEM_PROMPT,
            schema_description="Array of quiz question objects"
        )
        return res if isinstance(res, list) else []

    @staticmethod
    def evaluate_answer(question: str, answer: str) -> Dict[str, Any]:
        prompt = f"""Evaluate this technical answer.

QUESTION: {question}

DEVELOPER'S ANSWER: {answer}

Provide evaluation in JSON format:
{{
  "score": <0-100 float>,
  "understanding_level": "<beginner|intermediate|advanced|expert>",
  "is_correct": <true|false>,
  "feedback": "...",
  "detailed_feedback": "...",
  "correct_answer": "...",
  "concepts_to_study": ["..."],
  "strengths": ["..."],
  "improvements": ["..."],
  "skill_gaps": ["..."]
}}"""     
        return invoke_model_structured(
            prompt=prompt,
            system_prompt=SYSTEM_PROMPT,
            schema_description="Evaluation object"
        )

    @staticmethod
    def rag_chat(repo_id: str, user_query: str) -> str:
        context = rag_pipeline.get_relevant_context(repo_id, user_query, top_k=3)
        prompt = f"""Answer the user's question about the repository using the provided context.
If the answer is not in the context, state that clearly.

REPOSITORY CONTEXT:
{context}

USER QUESTION:
{user_query}
"""
        return invoke_model(prompt=prompt, system_prompt=SYSTEM_PROMPT)

    @staticmethod
    def explain_code(code: str) -> str:
        prompt = f"""Explain the following code snippet logically and clearly. Identify potential issues if any.

CODE:
{code}
"""
        return invoke_model(prompt=prompt, system_prompt=SYSTEM_PROMPT)

    @staticmethod
    def generate_recommendations(repo_context: str) -> List[str]:
        prompt = f"""Based on the repository context below, suggest actionable recommendations for improvements or next steps. Return ONLY a JSON list of strings.

CONTEXT:
{repo_context}

Schema: ["Rec 1", "Rec 2"]
"""
        res = invoke_model_structured(prompt=prompt, system_prompt=SYSTEM_PROMPT, schema_description="List of strings")
        return res if isinstance(res, list) else []

ai_orchestrator = AIOrchestrator()
