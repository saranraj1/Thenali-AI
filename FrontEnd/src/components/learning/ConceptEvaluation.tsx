"use client";

import { motion } from "framer-motion";
import { ListChecks, AlertCircle, ChevronRight, Zap, Target, BookOpen } from "lucide-react";
import Button from "@/components/ui/Button";

interface ConceptEvaluationProps {
    conceptName: string;
    onComplete: (score: number) => void;
}

export default function ConceptEvaluation({
    conceptName = "Structural Integrity",
    onComplete
}: ConceptEvaluationProps) {
    return (
        <div className="lovable-card p-10 md:p-12 bg-black/40 border-white/5 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-saffron/10 border border-saffron/20">
                        <Target size={14} className="text-saffron" />
                        <span className="text-[10px] font-black text-saffron uppercase tracking-[0.3em]">Final Evaluation</span>
                    </div>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest italic">Module Pulse Check</span>
                </div>

                <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4 leading-tight">
                    Concept <span className="text-saffron">Integrity</span> Test
                </h2>
                <p className="text-sm text-white/40 font-medium italic mb-10">
                    Complete this final pulse check to verify your mastery of {conceptName}.
                </p>

                <div className="space-y-4 mb-10">
                    {[
                        "Explain the primary mechanism of state synchronization.",
                        "How does the concept prevent recursive render cycles?",
                        "Construct a sample implementation utilizing the node features."
                    ].map((q, i) => (
                        <div key={i} className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex gap-4 group hover:border-white/20 transition-all">
                            <div className="text-saffron text-xs font-black italic mt-1">{i + 1}.</div>
                            <div className="flex-1">
                                <p className="text-[11px] font-black text-white uppercase tracking-wider mb-4 leading-relaxed">{q}</p>
                                <textarea
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-xs text-white/60 focus:outline-none focus:border-saffron/30 transition-all min-h-[100px] placeholder:text-white/5"
                                    placeholder="COMMENCE NEURAL EXPLANATION..."
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <Button
                    variant="saffron"
                    className="w-full py-8 text-lg italic tracking-tighter shadow-2xl shadow-saffron/20"
                    onClick={() => onComplete(95)}
                >
                    SYNC FINAL RESPONSE
                    <ChevronRight size={20} />
                </Button>
            </div>

            {/* Decorative pulse line */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                <BookOpen size={160} />
            </div>
        </div>
    );
}
