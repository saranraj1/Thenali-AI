from services.ai_orchestrator import ai_orchestrator
from typing import List, Dict, Any

class AssessmentController:
    @staticmethod
    def generate_quiz(topic: str, difficulty: str = "intermediate", num_questions: int = 5) -> List[Dict[str, Any]]:
        return ai_orchestrator.generate_quiz(topic, difficulty)

    @staticmethod
    def evaluate_answer(question: str, answer: str) -> Dict[str, Any]:
        evaluation = ai_orchestrator.evaluate_answer(question, answer)
        if "score" in evaluation and isinstance(evaluation["score"], float):
            evaluation["score"] = int(evaluation["score"])
        return evaluation

assessment_controller = AssessmentController()
