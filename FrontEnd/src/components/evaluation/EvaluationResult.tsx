"use client";

import Card from "@/components/ui/Card";
import { Award } from "lucide-react";

type Props = {
    score?: number;
    feedback?: string;
};

export default function EvaluationResult({
    score = 7.5,
    feedback = "MISSION ACCOMPLISHED: Good understanding of React hooks. Optimize dependency array logic for maximum performance.",
}: Props) {
    return (
        <Card title="Combat Assessment">
            <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-4 border-[#ff7a30] flex flex-col items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,122,48,0.3)] bg-[#0d0f11]">
                    <span className="text-3xl font-black text-white italic tracking-tighter">{score}</span>
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">/ 10</span>
                </div>

                <div className="flex items-center gap-2 mb-4 bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20">
                    <Award size={14} className="text-[#ff7a30]" />
                    <span className="text-[10px] font-black text-[#ff7a30] uppercase tracking-[0.2em]">Rank: Elite</span>
                </div>

                <p className="text-xs font-bold text-gray-400 italic leading-relaxed uppercase tracking-tight">
                    {feedback}
                </p>
            </div>
        </Card>
    );
}