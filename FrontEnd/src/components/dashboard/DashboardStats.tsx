"use client";

import { memo } from "react";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { Database, BookOpen, Target } from "lucide-react";
import { motion } from "framer-motion";

type StatsProps = {
    stats: {
        reposAnalysed: number;
        conceptsLearned: number;
        skillsEvaluated: number;
    } | null;
};

const DashboardStats = ({ stats }: StatsProps) => {
    const items = [
        { label: "Repos Analysed", value: stats?.reposAnalysed, icon: <Database />, color: "saffron" },
        { label: "Concepts Learned", value: stats?.conceptsLearned, icon: <BookOpen />, color: "green-bharat" },
        { label: "Skills Evaluated", value: stats?.skillsEvaluated, icon: <Target />, color: "blue-400" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <Card className="p-8 relative overflow-hidden group min-h-[160px] flex flex-col justify-center">
                        {/* Glow effect */}
                        {item.value !== undefined && (
                            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${item.color}/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`} />
                        )}

                        <div className="flex items-center gap-6">
                            <div className={`p-4 bg-${item.color}/10 rounded-2xl border border-${item.color}/20 text-${item.color}`}>
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                {item.value !== undefined ? (
                                    <>
                                        <h3 className="text-4xl font-black text-white italic tracking-tighter leading-none">{item.value}+</h3>
                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-2 italic">{item.label}</p>
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {item.value !== undefined && (
                            <div className="mt-8 flex items-center gap-2">
                                <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-white/30 uppercase tracking-widest">
                                    Unit Active
                                </div>
                                <div className="w-1 h-1 rounded-full bg-green-bharat animate-pulse" />
                            </div>
                        )}
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};

export default memo(DashboardStats);
