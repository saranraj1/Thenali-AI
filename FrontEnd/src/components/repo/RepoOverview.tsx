"use client";

import Card from "@/components/ui/Card";
import { GitFork, Star, Globe } from "lucide-react";

type Props = {
    repoName?: string;
    language?: string;
    stars?: string;
};

export default function RepoOverview({
    repoName = "react",
    language = "JavaScript",
    stars = "200k",
}: Props) {
    return (
        <Card title="Repository Overview">
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#ff7a30]/10 border border-[#ff7a30]/20 flex items-center justify-center text-[#ff7a30]">
                        <GitFork size={24} />
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">{repoName}</h4>
                        <p className="text-[10px] font-bold text-[#34d399] uppercase tracking-[0.2em]">{language} CORE</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0d0f11] p-4 rounded-2xl border border-[#1e2227] flex flex-col items-center">
                        <Star size={16} className="text-yellow-500 mb-2" />
                        <span className="text-sm font-black text-white">{stars}</span>
                        <span className="text-[8px] font-bold text-gray-700 uppercase tracking-widest mt-1">Stars</span>
                    </div>
                    <div className="bg-[#0d0f11] p-4 rounded-2xl border border-[#1e2227] flex flex-col items-center">
                        <Globe size={16} className="text-blue-500 mb-2" />
                        <span className="text-sm font-black text-white">Public</span>
                        <span className="text-[8px] font-bold text-gray-700 uppercase tracking-widest mt-1">Visiblity</span>
                    </div>
                </div>
            </div>
        </Card>
    );
}