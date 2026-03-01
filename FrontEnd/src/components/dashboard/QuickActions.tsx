"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import { Terminal, BookOpen, CheckCircle, Code2 } from "lucide-react";

export default function QuickActions() {
    const actions = [
        { href: "/repo-analysis", label: "INTEL SCAN", icon: Terminal, color: "text-[#ff7a30]", bg: "bg-[#ff7a30]/10" },
        { href: "/learning/dashboard", label: "TRAINING", icon: BookOpen, color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10" },
        { href: "/evaluation", label: "EVALUATION", icon: CheckCircle, color: "text-[#10b981]", bg: "bg-[#10b981]/10" },
        { href: "/playground", label: "SANDBOX", icon: Code2, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10" },
    ];

    return (
        <Card title="Quick Directives">
            <div className="grid grid-cols-2 gap-4">
                {actions.map((action, i) => (
                    <Link key={i} href={action.href} className="group flex flex-col items-center justify-center p-6 bg-[#0d0f11] border border-[#1e2227] rounded-3xl hover:border-[#ff7a30]/30 transition-all">
                        <div className={`w-12 h-12 ${action.bg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <action.icon size={22} className={action.color} />
                        </div>
                        <span className="text-[10px] font-black text-gray-500 group-hover:text-white transition-colors text-center uppercase tracking-[0.2em] leading-tight">
                            {action.label}
                        </span>
                    </Link>
                ))}
            </div>
        </Card>
    );
}