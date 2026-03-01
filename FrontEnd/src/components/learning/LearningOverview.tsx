"use client";

import { motion } from "framer-motion";
import Skeleton from "@/components/ui/Skeleton";
import { BookOpen, Sparkles, CheckCircle2, Zap, Layout, Cpu, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
    progress?: number;
    courseName?: string;
    loading?: boolean;
};

export default function LearningOverview({
    progress = 30,
    courseName = "React Development",
    loading = false,
}: Props) {
    const { t } = useLanguage();

    if (loading) {
        return (
            <div className="lovable-card p-10 bg-black/40 border-white/5 relative overflow-hidden">
                <div className="space-y-8 relative z-10">
                    <div className="flex justify-between items-center">
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-64" />
                        </div>
                        <Skeleton className="h-16 w-32 rounded-3xl" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/5">
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-40" />
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="lovable-card p-10 bg-black/40 border-white/5 relative overflow-hidden">
            {/* Ambient Background Element */}
            <div className="absolute top-0 right-0 p-12 pr-16 opacity-[0.03] pointer-events-none">
                <BookOpen size={200} />
            </div>

            <div className="relative z-10 flex flex-col">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
                            <h3 className="text-xs font-black text-white/40 uppercase tracking-widest">{t("learning_overview")}</h3>
                        </div>
                        <p className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">
                            Current Track: <span className="lovable-text-gradient">{courseName}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-3xl border border-white/10 shadow-2xl">
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-black text-saffron leading-none">{progress}%</span>
                            <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Done</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <CheckCircle2 size={24} className="text-green-bharat animate-pulse" />
                    </div>
                </div>

                {/* Progress Bar Section */}
                <div className="mb-16">
                    <div className="flex justify-between items-end mb-4 px-2">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Neural Pulse Sync</span>
                        <span className="text-[10px] font-black text-saffron uppercase italic">{progress}% SYNCED</span>
                    </div>
                    <div className="h-4 bg-white/[0.03] rounded-full border border-white/10 overflow-hidden relative shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-saffron to-green-bharat relative"
                        >
                            {/* Animated Scanner Effect on progress */}
                            <motion.div
                                animate={{ left: ["-10%", "110%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 bottom-0 w-20 bg-white/20 blur-md -skew-x-12"
                            />
                        </motion.div>
                    </div>
                    <div className="flex justify-between mt-4 px-2">
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Started</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.2em] italic">Calibration active</span>
                        </div>
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Mastery</span>
                    </div>
                </div>

                {/* INFORMATION GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/5">
                    {/* Concept Overview */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center">
                                <Sparkles size={16} className="text-saffron" />
                            </div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest italic">{t("concept_overview")}</h4>
                        </div>
                        <p className="text-xs text-white/40 leading-relaxed italic font-medium">
                            A deep-dive into the <span className="text-white">{courseName}</span> ecosystem. This roadmap is architected to prioritize repository-level implementation skills, performance optimization, and industrial-grade contribution patterns.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-white/30 uppercase tracking-widest">Architectural Focus</div>
                            <div className="px-3 py-1 rounded-full bg-green-bharat/10 border border-green-bharat/20 text-[8px] font-black text-green-bharat uppercase tracking-widest italic flex items-center gap-1">
                                <Zap size={8} /> High Fidelity
                            </div>
                        </div>
                    </div>

                    {/* Roadmap Coverage */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <Layout size={16} className="text-blue-400" />
                            </div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Roadmap Scope</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                "Core Syntax and Neural Logic",
                                "State Persistence and Lifecycles",
                                "Ecosystem Integration Patterns",
                                "Performance Auditing Protocol"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 group hover:border-blue-400/30 transition-all">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-20 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-[10px] font-black text-white/30 group-hover:text-white/60 uppercase tracking-widest transition-colors">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-12 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                            <Cpu size={20} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none">Intelligence Engine</p>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">Bharat-AI/v2.1</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all group">
                        Full Intel Manifest <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}