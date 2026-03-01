"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, Terminal, Info, Zap, Volume2, Play, Pause, Mic, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
    title?: string;
    content?: string;
    conceptId?: string;
}

export default function LessonPanel({
    title = "Structural Integrity Protocol",
    content = "Welcome to the Neural Synchronization unit. Today we explore the foundational logic of architectural integrity in React systems. Structural integrity is the metric by which we measure a component's resilience to state mutation and render cycle complexity.",
    conceptId = "CONCEPT_01"
}: Props) {
    const [isPlaying, setIsPlaying] = useState(false);
    const { t } = useLanguage();

    return (
        <div className="lovable-card p-10 md:p-12 bg-black/40 border-white/5 relative overflow-hidden group">

            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none"
                style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-saffron/10 border border-saffron/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
                        <span className="text-[10px] font-black text-saffron uppercase tracking-[0.3em]">{conceptId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/20 italic">
                        <MessageSquare size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t("ai_concept_synthesis")}</span>
                    </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-8 leading-tight">
                    {title}
                </h2>

                <div className="space-y-8">
                    {/* Chatbot Style Response Bubble */}
                    <div className="relative pl-6 border-l-2 border-saffron/20 group/msg">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-saffron shadow-[0_0_10px_rgba(255,153,51,0.5)]" />
                        <div className="text-lg text-white/70 font-medium leading-relaxed italic mb-8">
                            {content}
                        </div>

                        {/* Integrated Voice Trigger - Chatbot Style */}
                        <div className="flex items-center gap-6 mt-10">
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all duration-300 border ${isPlaying
                                    ? "bg-saffron text-white border-saffron shadow-lg shadow-saffron/20"
                                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {isPlaying ? t("stop_audio") : t("hear_ai")}
                                </span>
                            </button>

                            {isPlaying && (
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [4, 12, 4] }}
                                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                                            className="w-0.5 bg-saffron rounded-full"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-16 flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="flex items-center gap-4 text-white/10 group-hover:text-white/30 transition-colors">
                        <Sparkles size={16} />
                        <span className="text-[9px] font-black uppercase tracking-[0.5em]">{t("neural_sync_active")}</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Tactical Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-saffron/5 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
}