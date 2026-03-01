"use client";

import Card from "@/components/ui/Card";
import { AlertCircle } from "lucide-react";

type Props = {
    issues?: string[];
};

export default function RepoIssues({
    issues = ["Missing unit tests", "Large component files", "Unused dependencies"],
}: Props) {
    return (
        <Card title="Detected Anomalies">
            <ul className="space-y-4">
                {issues.map((issue, index) => (
                    <li key={index} className="flex items-center gap-4 bg-[#0d0f11] p-4 rounded-2xl border border-[#1e2227] hover:border-[#ff4d4d]/30 transition-all group">
                        <AlertCircle size={18} className="text-[#ff4d4d] group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide group-hover:text-white transition-colors">{issue}</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}