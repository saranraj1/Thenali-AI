export interface AssessmentQuestion {
    id: string;
    question: string;
    options: string[];           // empty array = open text mode
    correct_answer: string;
    explanation: string;
    difficulty: string;
    topic: string;
}

export interface AnswerFeedback {
    assessment_id: string;
    question_id: string;
    score: number;
    feedback: string;
    is_correct: boolean;
    detailed_feedback: string;
    skill_gaps: string[];
}

export interface AnswerRecord {
    question_id: string;
    answer: string;
    submitted_at: string;
    evaluation: {
        score: number;
        feedback: string;
        is_correct: boolean;
        detailed_feedback: string;
        skill_gaps: string[];
        strengths: string[];
        concepts_to_study: string[];
        correct_answer: string;
        understanding_level: string;
        improvements: string[];
    };
}

export interface AssessmentResults {
    assessment_id: string;
    topic: string;
    difficulty: string;
    status: string;
    questions: AssessmentQuestion[];
    answers: AnswerRecord[];
    total_score: number;
    max_score: number;
    avg_score: number;
    percentage: number;
    passed: boolean;
    created_at: string;
}

export interface AssessmentState {
    screen: "setup" | "active" | "results";
    assessmentId: string | null;
    topic: string;
    numQuestions: number;
    questions: AssessmentQuestion[];
    currentQuestionIndex: number;
    localAnswers: Record<string, string>;   // questionId → raw answer text
    results: AssessmentResults | null;
    isLoading: boolean;
    error: string | null;
    currentFeedback: AnswerFeedback | null;
    isSubmittingAnswer: boolean;
}
