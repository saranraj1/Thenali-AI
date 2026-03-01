"use client";

import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { TrendingUp, Target } from "lucide-react";

type Props = {
    progress?: number;
};

export default function SkillProgressCard({ progress = 65 }: Props) {
    return (
        <Card title="Skill Mastery">
            <div className="flex justify-between items-end mb-8 px-1">
                <div>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1 block">Current Score</span>
                    <p className="text-4xl font-extrabold text-white tracking-tight">{progress}%</p>
                </div>
                <div className="bg-saffron/10 p-4 rounded-2xl">
                    <TrendingUp size={24} className="text-saffron" />
                </div>
            </div>

            <ProgressBar value={progress} color="saffron" showLabel />

            <div className="mt-8 pt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 px-1">
                    <Target size={16} className="text-white/20" />
                    <span className="text-xs font-medium text-white/40">Next Milestone: Senior Architect</span>
                </div>
                <span className="text-xs font-bold text-green-bharat">+5% This Week</span>
            </div>
        </Card>
    );
}