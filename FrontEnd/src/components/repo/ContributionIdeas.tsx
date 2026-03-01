"use client";

import Card from "@/components/ui/Card";
import { Lightbulb } from "lucide-react";

type Props = {
    ideas?: string[];
}

export default function ContributionIdeas({
    ideas = ["Add TypeScript support", "Improve documentation", "Refactor state management"],
}: Props) {
    return (
        <Card title="Mission Ideas">
            <ul className="space-y-4">
                {ideas.map((idea, index) => (
                    <li key={index} className="flex items-center gap-4 bg-[#0d0f11] p-4 rounded-2xl border border-[#1e2227] hover:border-[#34d399]/30 transition-all group">
                        <Lightbulb size={18} className="text-[#34d399] group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide group-hover:text-white transition-colors">{idea}</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}