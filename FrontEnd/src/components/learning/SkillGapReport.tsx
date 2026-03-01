"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertCircle, CheckCircle2, Layout, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";

type Props = {
    scores?: { category: string; score: number; status: "mastered" | "developing" | "critical" }[];
    recommendations?: string[];
    onNext?: () => void;
};

export default function SkillGapReport({
    scores = [
        { category: "State Sync", score: 85, status: "mastered" },
        { category: "Neural Hooks", score: 42, status: "critical" },
        { category: "Structural Clarity", score: 68, status: "developing" },
    ],
    recommendations = [
        "Initialize 'Neural Hooks' deep-dive protocol.",
        "Practice 'Structural Clarity' in Playground Node Gamma.",
        "Prepare for Repository Contribution Pulse."
    ],
    onNext
}: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lovable-card p-12 bg-black/60 border-saffron/20 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none">
                <TrendingUp size={160} />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-12">
                {/* Left: Stat breakdown */}
                <div className="flex-1 space-y-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center">
                                <ShieldCheck className="text-saffron" size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural Resonance Report</h3>
                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1 italic">Unit Analysis Alpha</p>
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Skill Gap <span className="text-saffron">Telemetry</span></h2>
                    </div>

                    <div className="space-y-6">
                        {scores.map((stat, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-white/40">{stat.category}</span>
                                    <span className={stat.status === 'mastered' ? 'text-green-bharat' : stat.status === 'critical' ? 'text-red-500' : 'text-saffron'}>
                                        {stat.score}% / {stat.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stat.score}%` }}
                                        transition={{ duration: 1, delay: i * 0.2 }}
                                        className={`h-full shadow-lg ${stat.status === 'mastered' ? 'bg-green-bharat' : stat.status === 'critical' ? 'bg-red-500' : 'bg-saffron'
                                            }`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Recommendations */}
                <div className="flex-1 p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] mb-8 italic">Strategic Directives</h4>
                    <div className="space-y-6">
                        {recommendations.map((rec, i) => (
                            <div key={i} className="flex gap-4 group cursor-default">
                                <div className="mt-1 w-4 h-4 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-saffron transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-saffron/20 group-hover:bg-saffron transition-colors" />
                                </div>
                                <p className="text-xs font-bold text-white/40 group-hover:text-white/80 transition-colors italic leading-relaxed">
                                    {rec}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5">
                        <Button variant="saffron" className="w-full" onClick={onNext}>
                            INITIALIZE NEXT TOPIC
                            <ArrowRight size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
