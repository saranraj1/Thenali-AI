"use client";

import Card from "@/components/ui/Card";
import { CheckCircle2, Circle } from "lucide-react";

const milestones = [
    { title: "First Repo Analysis", done: true },
    { title: "Complete React Basics", done: true },
    { title: "Finish Hooks Lesson", done: false },
    { title: "First Open Source PR", done: false },
];

export default function MilestoneTracker() {
    return (
        <Card title="Mission Progression">
            <ul className="space-y-4">
                {milestones.map((item, index) => (
                    <li key={index} className={`flex items-center gap-4 p-5 rounded-2xl border ${item.done ? 'bg-[#34d399]/5 border-[#34d399]/20 shadow-inner' : 'bg-[#121417] border-[#1e2227]'} group transition-all`}>
                        {item.done ? (
                            <CheckCircle2 size={20} className="text-[#34d399]" />
                        ) : (
                            <Circle size={20} className="text-gray-700 group-hover:text-[#ff7a30] transition-colors" />
                        )}
                        <span className={`text-[11px] font-black uppercase tracking-widest ${item.done ? 'text-gray-500' : 'text-white'}`}>
                            {item.title}
                        </span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}