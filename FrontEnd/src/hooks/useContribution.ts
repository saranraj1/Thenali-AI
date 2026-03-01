import { useState, useEffect } from "react";
import apiClient from "@/services/apiClient";

export interface RecommendedRepo {
    name: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    language: string;
    description: string;
    match_reason: string;
    tags: string[];
    stars: string;
    complexity_score: number;
}

export interface Achievement {
    name: string;
    description: string;
    unlocked: boolean;
    progress: number;
    icon: "merge" | "shield" | "book" | "people" | "trophy";
}

export interface MonthlyActivity {
    month: string;
    count: number;
}

export interface ContributionHistoryItem {
    repo: string;
    description: string;
    type: string;
    status: "MERGED" | "CLOSED" | "OPEN";
    date: string;
}

export interface ContributionProfile {
    readiness_score: number;
    readiness_label: string;
    rank: string;
    strengths: string[];
    areas_to_improve: string[];
    recommended_repos: RecommendedRepo[];
    achievements: Achievement[];
    monthly_activity: MonthlyActivity[];
    this_month_count: number;
    total_contributions: number;
    vs_last_month: number;
    day_streak: number;
    contribution_history: ContributionHistoryItem[];
}

interface ContributionState {
    data: ContributionProfile | null;
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
}

export function useContribution() {
    const [state, setState] = useState<ContributionState>({
        data: null,
        isLoading: true,
        isRefreshing: false,
        error: null,
    });

    // Load on mount
    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const { data } = await apiClient.get("/contribution/profile");
                if (mounted) {
                    setState((prev) => ({
                        ...prev,
                        data,
                        isLoading: false,
                    }));
                }
            } catch (err) {
                if (mounted) {
                    setState((prev) => ({
                        ...prev,
                        error: "Failed to load contribution data",
                        isLoading: false,
                    }));
                }
            }
        };

        load();
        return () => {
            mounted = false;
        };
    }, []);

    const refresh = async () => {
        setState((prev) => ({ ...prev, isRefreshing: true }));
        try {
            const { data } = await apiClient.post("/contribution/analyze");
            setState((prev) => ({
                ...prev,
                data,
                isRefreshing: false,
            }));
        } catch (err) {
            setState((prev) => ({
                ...prev,
                isRefreshing: false,
                error: "Refresh failed. Try again.",
            }));
        }
    };

    return { ...state, refresh };
}
