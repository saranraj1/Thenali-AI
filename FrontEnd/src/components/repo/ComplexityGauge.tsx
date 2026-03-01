"use client";

import Card from "@/components/ui/Card";
import { Activity } from "lucide-react";

type Props = {
    complexity?: number;
};

export default function ComplexityGauge({
    complexity = 70,
}: Props) {
    return (
        <Card title="Structural Complexity">
            <div className="flex flex-col items-center py-4">
                <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            className="text-[#1e2227]"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={364.4}
                            strokeDashoffset={364.4 - (364.4 * complexity) / 100}
                            className={complexity > 80 ? "text-[#ff4d4d]" : "text-[#ff7a30] transition-all duration-1000"}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white italic tracking-tighter">{complexity}%</span>
                        <Activity size={14} className="text-gray-700 animate-pulse" />
                    </div>
                </div>

                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-center">
                    Complexity Rank: <span className={complexity > 80 ? "text-[#ff4d4d]" : "text-[#ff7a30]"}>{complexity > 80 ? 'CRITICAL' : 'OPTIMAL'}</span>
                </p>
            </div>
        </Card>
    );
}