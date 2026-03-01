"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { repoService } from "@/services/repoService";

export default function useRepoAnalysis() {
    const [repoData, setRepoData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previousChats, setPreviousChats] = useState<any[]>([]);
    const [assessment, setAssessment] = useState<any[]>([]);

    // isMounted guard
    const isMounted = useRef(true);
    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    // Stable loadPreviousChats — called in useEffect and after analyzeRepo
    const loadPreviousChats = useCallback(async () => {
        try {
            const chats = await repoService.getPreviousChats();
            if (isMounted.current) setPreviousChats(chats);
        } catch {
            // history is non-critical, fail silently
        }
    }, []); // no deps — repoService.getPreviousChats is module-level stable

    // Load history once on mount
    useEffect(() => {
        loadPreviousChats();
    }, [loadPreviousChats]); // ← stable ref, so runs exactly once

    const analyzeRepo = useCallback(async (repoUrl: string) => {
        if (loading) return; // duplicate-call guard
        if (isMounted.current) {
            setLoading(true);
            setError(null);
        }
        try {
            const analysisResults = await repoService.analyzeRepo(repoUrl);
            if (isMounted.current) {
                setRepoData(analysisResults);
            }
            // Refresh history list without blocking the UI
            loadPreviousChats();
        } catch (err: any) {
            if (isMounted.current) {
                setError(err.message || "Failed to analyze repository");
                setRepoData(null);
            }
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, [loading, loadPreviousChats]);

    const loadHistoryItem = useCallback(async (id: string) => {
        if (isMounted.current) { setLoading(true); setError(null); }
        try {
            const analysisResults = await repoService.getRepoAnalysisById(id);
            if (isMounted.current) setRepoData(analysisResults);
        } catch (err: any) {
            if (isMounted.current) setError(err.message || "Failed to load repository");
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, []);

    const uploadRepo = useCallback(async (formData: FormData) => {
        if (isMounted.current) { setLoading(true); setError(null); }
        try {
            await repoService.uploadRepo(formData);
        } catch (err: any) {
            if (isMounted.current) setError(err.message || "Failed to upload repository");
        } finally {
            if (isMounted.current) setLoading(false);
        }
    }, []);

    const resetRepo = useCallback(() => {
        setRepoData(null);
        setAssessment([]);
        setError(null);
    }, []);

    return {
        repoData,
        loading,
        error,
        previousChats,
        assessment,
        analyzeRepo,
        loadHistoryItem,
        uploadRepo,
        resetRepo,
    };
}
