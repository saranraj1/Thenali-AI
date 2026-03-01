"use client";

import { TrendingUp, Trophy, Globe, Rocket, ChevronRight, Activity, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function InsightPanel() {
    return (
        <aside className="w-96 bg-black/20 backdrop-blur-3xl border-l border-white/5 h-screen p-10 space-y-12 overflow-y-auto hidden 2xl:block relative z-30">

            {/* Panel Header */}
            <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                <div className="p-3 bg-saffron/10 rounded-xl border border-saffron/20">
                    <Activity size={20} className="text-saffron" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-white tracking-tight">System Insights</h2>
                    <p className="text-[10px] font-bold text-white/20 tracking-widest mt-1 uppercase">Live Node Analysis</p>
                </div>
            </div>

            {/* Metric Monitor */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Progress Density</span>
                    <span className="text-2xl font-black text-white px-2">74%</span>
                </div>

                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "74%" }}
                        className="absolute inset-y-0 left-0 h-full bg-gradient-to-r from-saffron to-orange-400 rounded-full"
                    />
                </div>

                <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                    <p className="text-xs text-white/40 leading-relaxed font-medium">
                        Architecture scan complete. We've identified 12 neural pathways to optimize your current workflow.
                    </p>
                </div>
            </div>

            {/* Registry Cards */}
            <div className="space-y-8">
                <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest pl-4 border-l-2 border-green-bharat">Activity Flux</h3>

                <div className="space-y-4">
                    <RegistryCard icon={<Rocket size={18} />} label="Daily Streak" val="12 Days" />
                    <RegistryCard icon={<Trophy size={18} />} label="Achievements" val="14" />
                    <RegistryCard icon={<Zap size={18} />} label="System EXP" val="98k" />
                </div>
            </div>

            {/* AI Call to Action Unit */}
            <motion.div
                whileHover={{ y: -5 }}
                className="p-10 bg-gradient-to-br from-white/[0.05] to-transparent rounded-[32px] border border-white/10 shadow-xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Sparkles size={40} className="text-saffron" />
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <Zap size={16} className="text-saffron animate-pulse" />
                    <h3 className="text-[10px] font-bold tracking-widest text-white/40 uppercase">AI Suggestion</h3>
                </div>

                <p className="text-lg font-bold text-white mb-8 tracking-tight leading-tight">
                    Ready to optimize your <span className="text-saffron">Vector Recall</span> performance?
                </p>

                <button className="w-full py-4 bg-white text-black rounded-full text-xs font-bold hover:bg-saffron hover:text-white transition-all duration-300">
                    Quick Start
                </button>
            </motion.div>

        </aside>
    );
}

function RegistryCard({ icon, label, val }: any) {
    return (
        <div className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/[0.02] rounded-2xl transition-all">
            <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/[0.03] text-white/40 group-hover:bg-saffron/10 group-hover:text-saffron transition-all">
                    {icon}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">{label}</span>
                    <span className="text-sm font-bold text-white leading-none">{val}</span>
                </div>
            </div>
            <ChevronRight size={16} className="text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
    );
}