"use client";

import Card from "@/components/ui/Card";
import { MoveUpRight } from "lucide-react";

type Props = {
    gaps?: string[];
}

export default function SkillGapReport({
    gaps = ["Optimize Server Actions", "Master useMemo/useCallback", "Deep dive into Suspense patterns"]
}: Props) {
    return (
        <Card title="Training Gaps Identified">
            <ul className="space-y-4">
                {gaps.map((item, index) => (
                    <li
                        key={index}
                        className="group flex items-center justify-between bg-[#0d0f11] p-5 rounded-3xl border border-[#1e2227] hover:border-[#ff7a30]/30 transition-all cursor-pointer"
                    >
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">{item}</span>
                        <MoveUpRight size={16} className="text-gray-800 group-hover:text-[#ff7a30] transition-colors" />
                    </li>
                ))}
            </ul>
        </Card>
    );
}