import apiClient from "./apiClient";

export const learningService = {
    getRoadmap: async (topic: string, level: string, goal: string) => {
        const { data } = await apiClient.post("/learning/roadmap", {
            goal: goal || topic,
            stack: [topic],
            timeline: "2 weeks",
            current_level: level
        });

        // Map backend's roadmap phase concepts to the local step format
        const steps: any[] = [];
        if (data && data.phases) {
            data.phases.forEach((phase: any) => {
                if (phase.concepts) {
                    phase.concepts.forEach((concept: any) => {
                        steps.push({
                            id: concept.id,
                            step: concept.name,
                            done: concept.completed || false
                        });
                    });
                }
            });
        }
        return steps;
    },

    getCurrentLesson: async (lessonId?: string) => {
        // Backend module generation takes `topic`. If lessonId provided we use it.
        const { data } = await apiClient.post("/learning/module", { topic: lessonId || "general" });
        return {
            title: data.title,
            content: data.summary + "\n\n" + data.sections?.map((s: any) => s.content + "\n" + (s.code_examples?.[0] || "")).join("\n\n"),
            audio_url: "", // Can be filled by voiceService later
            quiz_question: data.quiz_topics?.[0] || "No quiz available.",
            viva_question: data.quiz_topics?.[1] || "Explain what you learned.",
            practice_code: data.sections?.[0]?.code_examples?.[0] || "// Write code here"
        };
    }
};
