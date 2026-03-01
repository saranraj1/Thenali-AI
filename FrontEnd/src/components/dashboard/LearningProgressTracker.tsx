"use client";

import { memo } from "react";
import Card from "@/components/ui/Card";
import { Book, Cpu, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

type TrackerProps = {
    progressItems: any[];
};

const LearningProgressTracker = ({ progressItems }: TrackerProps) => {
    return (
        <Card title="Neural Learning Progress" className="p-8 h-full">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                <div className="p-3 bg-saffron/10 rounded-xl">
                    <Cpu size={24} className="text-saffron" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Learning Stream</h3>
                    <p className="text-[10px] font-bold text-white/30 tracking-widest mt-2 uppercase italic">Multi-Concept Orchestration</p>
                </div>
            </div>

            <div className="space-y-8">
                {progressItems.map((item, i) => (
                    <div key={item.id} className="group cursor-pointer">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h4 className="text-sm font-black text-white group-hover:text-saffron transition-colors uppercase italic tracking-tight">{item.title}</h4>
                                <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">{item.status}</span>
                            </div>
                            <span className="text-sm font-black text-saffron italic">{item.progress}%</span>
                        </div>

                        <div className="h-2 bg-white/[0.03] rounded-full border border-white/5 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className="h-full bg-gradient-to-r from-saffron to-saffron/40 relative shadow-[0_0_10px_rgba(255,153,51,0.3)]"
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                            </motion.div>
                        </div>

                        <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="flex items-center gap-2 text-[10px] font-black text-saffron uppercase tracking-widest">
                                Resume Intel <ChevronRight size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-bharat/10 flex items-center justify-center">
                        <Zap size={14} className="text-green-bharat" />
                    </div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-loose italic">
                        Accelerated learning mode active. Multiple sectors currently synchronizing.
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default memo(LearningProgressTracker);
