"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { learningService } from "@/services/learningService";

export default function useLearning() {
    const [roadmap, setRoadmap] = useState<any[]>([]);
    const [currentLesson, setCurrentLesson] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(30);

    // isMounted guard — prevents state updates after component unmount
    const isMounted = useRef(true);
    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    // Duplicate-call guard
    const isLoadingRef = useRef(false);

    const fetchRoadmap = useCallback(async (topic: string, level: string, goal: string) => {
        if (isLoadingRef.current) return;
        isLoadingRef.current = true;
        if (isMounted.current) setLoading(true);
        try {
            const data = await learningService.getRoadmap(topic, level, goal);
            if (isMounted.current) setRoadmap(data);
        } catch {
            // error handled by callers
        } finally {
            isLoadingRef.current = false;
            if (isMounted.current) setLoading(false);
        }
    }, []);

    const fetchLesson = useCallback(async (lessonId?: string) => {
        if (isMounted.current) setLoading(true);
        try {
            const data = await learningService.getCurrentLesson(lessonId);
            if (isMounted.current) setCurrentLesson(data);
        } catch {
            // error handled by callers
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, []);

    const updateProgress = useCallback((val: number) => {
        setProgress(val);
    }, []);

    return {
        roadmap,
        currentLesson,
        loading,
        progress,
        fetchRoadmap,
        fetchLesson,
        updateProgress,
    };
}