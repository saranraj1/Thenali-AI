"use client";
import apiClient from "./apiClient";

/**
 * Single source of truth: calls GET /api/dashboard once and returns
 * all fields. The hook calls this once, avoiding 4 separate requests.
 */
export const dashboardService = {
    /**
     * Full dashboard data from GET /api/dashboard.
     * Returns the raw backend shape so the hook can distribute fields.
     */
    getDashboard: async () => {
        try {
            const { data } = await apiClient.get("/dashboard");
            return data;
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 401) throw new Error("Session expired. Please login again.");
            if (!err.response) throw new Error("Cannot connect to server.");
            throw new Error(err.response?.data?.detail || "Failed to load dashboard.");
        }
    },

    getStats: async () => {
        try {
            const { data } = await apiClient.get("/dashboard");
            return {
                reposAnalysed: data.repos_analyzed ?? data.total_repos ?? 0,
                conceptsLearned: data.concepts_learned ?? 0,
                skillsEvaluated: data.skills_evaluated ?? 0,
                avgAssessmentScore: data.avg_assessment_score ?? 0,
                totalRoadmaps: data.total_roadmaps ?? 0,
                username: data.username ?? "",
                rank: data.rank ?? "",
                systemExp: data.system_exp ?? 0,
            };
        } catch {
            return {
                reposAnalysed: 0,
                conceptsLearned: 0,
                skillsEvaluated: 0,
                avgAssessmentScore: 0,
                totalRoadmaps: 0,
                username: "",
                rank: "",
                systemExp: 0,
            };
        }
    },

    getLearningProgress: async () => {
        try {
            const { data } = await apiClient.get("/dashboard");
            // Backend returns learning_progress: [{ id, title, progress, status }]
            const items = data.learning_progress ?? [];
            return items.length > 0 ? items : [];
        } catch {
            return [];
        }
    },

    getRecentActivity: async () => {
        try {
            const { data } = await apiClient.get("/dashboard");
            return data.recent_activity ?? [];
        } catch {
            return [];
        }
    },

    getSkillMastery: async () => {
        try {
            const { data } = await apiClient.get("/dashboard");
            // Backend returns concept_mastery: [{ name, score }]
            const mastery = data.concept_mastery ?? [];
            return mastery;
        } catch {
            return [];
        }
    }
};
