"use client";

import { motion } from "framer-motion";
import { Trophy, CheckCircle2, Star, ArrowRight, RefreshCcw, Sparkles, PartyPopper } from "lucide-react";
import Button from "@/components/ui/Button";

interface ConceptCompletionProps {
    conceptName: string;
    onContinue: () => void;
    onReview: () => void;
}

export default function ConceptCompletion({
    conceptName = "Structural Integrity",
    onContinue,
    onReview
}: ConceptCompletionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lovable-card p-12 md:p-20 bg-black/60 border-saffron/30 shadow-[0_0_100px_rgba(255,153,51,0.15)] relative overflow-hidden text-center"
        >
            {/* Decorative Fireworks/Sparkles */}
            <div className="absolute inset-0 pointer-events-none">
                <Sparkles className="absolute top-10 left-10 text-saffron/20 animate-pulse" size={40} />
                <Sparkles className="absolute bottom-10 right-10 text-green-bharat/20 animate-pulse" size={60} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-saffron/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Progress Trophy */}
                <motion.div
                    initial={{ rotate: -10, y: 20 }}
                    animate={{ rotate: 0, y: 0 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                    className="w-32 h-32 rounded-[3rem] bg-gradient-to-tr from-saffron to-orange-400 flex items-center justify-center mb-10 shadow-[0_20px_60px_rgba(255,153,51,0.4)]"
                >
                    <Trophy size={60} className="text-white" />
                </motion.div>

                <h3 className="text-[10px] font-black text-saffron uppercase tracking-[0.5em] mb-4 italic">Neural Node Synchronized</h3>
                <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none mb-6">
                    CONGRATULATIONS!
                </h2>
                <p className="text-white/50 text-xl font-medium italic mb-12 max-w-xl mx-auto">
                    You have successfully mastered the <span className="text-white font-bold">{conceptName}</span> protocol. Your neural resonance has reached optimal efficiency.
                </p>

                {/* Action Grid */}
                <div className="flex flex-col md:flex-row gap-6 w-full max-w-lg">
                    <Button
                        variant="saffron"
                        size="lg"
                        className="flex-1 py-8 italic tracking-tighter"
                        onClick={onContinue}
                    >
                        NEXT NEURAL NODE
                        <ArrowRight size={20} />
                    </Button>

                    <button
                        onClick={onReview}
                        className="flex-1 py-6 rounded-[2rem] bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3"
                    >
                        <RefreshCcw size={14} />
                        RECALL PROTOCOL
                    </button>
                </div>

                <div className="mt-16 flex items-center gap-3 text-green-bharat/40">
                    <CheckCircle2 size={16} />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Operational Status: EXCELLENT</span>
                </div>
            </div>
        </motion.div>
    );
}
