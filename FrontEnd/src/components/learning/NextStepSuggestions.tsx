"use client";

import Card from "@/components/ui/Card";
import { MoveRight } from "lucide-react";

const steps = [
    "Execute React Hooks Drill",
    "Initialize Deployment Node",
    "Sync State Management",
];

export default function NextStepSuggestions() {
    return (
        <Card title="Tactical Recommendations">
            <ul className="space-y-4">
                {steps.map((step, index) => (
                    <li key={index} className="flex items-center justify-between bg-[#0d0f11] p-4 rounded-2xl border border-[#1e2227] hover:border-[#ff7a30]/30 transition-all cursor-pointer group">
                        <span className="text-[10px] font-black text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest">{step}</span>
                        <MoveRight size={14} className="text-gray-800 group-hover:text-[#ff7a30] transition-transform group-hover:translate-x-1" />
                    </li>
                ))}
            </ul>
        </Card>
    );
}