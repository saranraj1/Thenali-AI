"use client";

import ChatWindow from "@/components/chat/ChatWindow";
import { Sparkles, Target } from "lucide-react";

export default function RepoChat({ repoName, repoId }: { repoName?: string; repoId?: string }) {
    return (
        <div className="w-full h-full min-h-[700px] flex flex-col gap-6">
            {/* Context Header */}
            <div className="px-8 py-4 bg-white/[0.03] border border-white/5 rounded-[24px] flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center">
                        <Target className="text-saffron size={20}" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic">Neural Context Buffer</div>
                        <div className="text-sm font-bold text-white uppercase tracking-wider">{repoName || "Repository"}</div>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-green-bharat/60">
                    <Sparkles size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">AI SPECIALIST LOADED</span>
                </div>
            </div>

            <ChatWindow repoId={repoId} />
        </div>
    );
}