"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { dashboardService } from "@/services/dashboardService";

export default function useDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [learningProgress, setLearningProgress] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [skillMastery, setSkillMastery] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // isMounted guard prevents setState after unmount
    const isMounted = useRef(true);
    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        let cancelled = false;

        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const [s, lp, ra, sm] = await Promise.all([
                    dashboardService.getStats(),
                    dashboardService.getLearningProgress(),
                    dashboardService.getRecentActivity(),
                    dashboardService.getSkillMastery(),
                ]);
                if (!cancelled && isMounted.current) {
                    setStats(s);
                    setLearningProgress(lp);
                    setRecentActivity(ra);
                    setSkillMastery(sm);
                }
            } catch {
                // Errors handled by dashboardService
            } finally {
                if (!cancelled && isMounted.current) {
                    setLoading(false);
                }
            }
        };

        loadDashboardData();

        // Cleanup: mark request as stale if component unmounts before it resolves
        return () => { cancelled = true; };
    }, []); // ← runs exactly once on mount

    return {
        stats,
        learningProgress,
        recentActivity,
        skillMastery,
        loading,
    };
}
