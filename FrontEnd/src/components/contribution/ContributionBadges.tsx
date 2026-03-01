"use client";

import { motion } from "framer-motion";
import { Award, Star, Zap, Shield, Target, Trophy, GitMerge, Book, Users as UsersIcon } from "lucide-react";
import type { Achievement } from "@/hooks/useContribution";

type Props = {
    data?: Achievement[];
};

export default function ContributionBadges({ data = [] }: Props) {
    return (
        <div className="lovable-card p-8 bg-gradient-to-br from-white/[0.03] to-transparent border-white/5 h-full">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-9 h-9 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
                    <Award className="text-yellow-400" size={18} />
                </div>
                <div>
                    <h2 className="text-sm font-black italic uppercase tracking-tight text-white">Neural Achievements</h2>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-0.5">Unlock levels via contribution</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {data.map((badge, i) => {
                    let IconComponent = Zap;
                    let colorClass = "text-saffron bg-saffron/10 border-saffron/20";
                    switch (badge.icon) {
                        case "merge":
                            IconComponent = GitMerge;
                            colorClass = "text-green-bharat bg-green-bharat/10 border-green-bharat/20";
                            break;
                        case "shield":
                            IconComponent = Shield;
                            colorClass = "text-blue-400 bg-blue-400/10 border-blue-400/20";
                            break;
                        case "book":
                            IconComponent = Book;
                            colorClass = "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
                            break;
                        case "people":
                            IconComponent = UsersIcon;
                            colorClass = "text-purple-400 bg-purple-400/10 border-purple-400/20";
                            break;
                        case "trophy":
                            IconComponent = Trophy;
                            colorClass = "text-saffron bg-saffron/10 border-saffron/20";
                            break;
                    }

                    return (
                        <motion.div
                            key={badge.name}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${badge.unlocked
                                ? "bg-white/[0.03] border-white/10"
                                : "bg-black/20 border-white/5 opacity-40 grayscale"
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${colorClass}`}>
                                <IconComponent size={24} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-xs font-black text-white uppercase tracking-tight">{badge.name}</h4>
                                    {badge.unlocked ? (
                                        <span className="text-[8px] font-black text-green-bharat bg-green-bharat/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Unlocked</span>
                                    ) : (
                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">{badge.progress}%</span>
                                    )}
                                </div>
                                <p className="text-[10px] text-white/40 leading-snug">{badge.description}</p>

                                {!badge.unlocked && badge.progress !== undefined && (
                                    <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${badge.progress}%` }}
                                            className="h-full bg-white/20"
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center">
                <button className="text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-saffron transition-colors">
                    View All Achievements →
                </button>
            </div>
        </div>
    );
}
