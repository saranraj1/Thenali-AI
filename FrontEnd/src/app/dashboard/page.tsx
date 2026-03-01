"use client";

import PageContainer from "@/components/layout/PageContainer";
import DashboardStats from "@/components/dashboard/DashboardStats";
import LearningProgressTracker from "@/components/dashboard/LearningProgressTracker";
import RecentActivity from "@/components/dashboard/RecentActivity";
import SkillMastery from "@/components/dashboard/SkillMastery";
import useDashboard from "@/hooks/useDashboard";
import { motion } from "framer-motion";
import { Cpu, Shield, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardPage() {
    const { stats, learningProgress, recentActivity, skillMastery, loading } = useDashboard();
    const { t, language } = useLanguage();

    if (loading) {
        return (
            <PageContainer>
                <div className="flex h-[600px] items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-t-saffron border-r-transparent border-b-green-bharat border-l-transparent rounded-full animate-spin mb-8" />
                        <span className="text-xs font-black text-white/20 uppercase tracking-[0.5em] animate-pulse">
                            {t("initializing_dashboard")}
                        </span>
                    </div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {/* Header Section */}
            <div className="flex flex-col mb-16 px-4">
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 mb-4"
                >
                    <div className="px-3 py-1 bg-saffron/10 border border-saffron/20 rounded-full flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
                        <span className="text-[10px] font-black text-saffron uppercase tracking-widest">
                            {t("neural_link_synced")}
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">
                        {t("operational_protocol")} / v2.1.0
                    </span>
                </motion.div>

                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter uppercase italic leading-none">
                            {t("system_architect").split(' ')[0]} <span className="text-white/20">/</span> <span className="lovable-text-gradient">{t("system_architect").split(' ')[1]}.</span>
                        </h1>
                        <p className="text-white/20 text-xs font-bold uppercase tracking-[0.4em] mt-6 italic">
                            {t("active_workspace")}
                        </p>
                    </div>
                </div>
            </div>

            {/* TOP ROW: REPO ANALYSED, CONCEPTS LEARNED, SKILLS EVALUATED */}
            <div className="mb-12">
                <DashboardStats stats={stats} />
            </div>

            {/* BOTTOM GRID: LEARNING TRACKER, RECENT ACTIVITY, SKILL MASTERY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Learning Progress Column */}
                <div className="lg:col-span-4">
                    <LearningProgressTracker progressItems={learningProgress} />
                </div>

                {/* Main Activity and Mastery Feed */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-full">
                        <RecentActivity activities={recentActivity} />
                        <SkillMastery skills={skillMastery} />
                    </div>

                    {/* Tactical Status Bar */}
                    <div className="p-8 bg-black/40 border border-white/5 rounded-[40px] flex items-center justify-between backdrop-blur-3xl">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white/40 uppercase tracking-widest leading-none">
                                    {t("security_handshake")}
                                </h4>
                                <p className="text-[9px] font-bold text-white/10 mt-2 uppercase">Verified Architectural Integrity</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-saffron uppercase tracking-widest italic animate-pulse">
                                {t("mastery_protocol_active")}
                            </span>
                            <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-full h-full bg-saffron/40"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}