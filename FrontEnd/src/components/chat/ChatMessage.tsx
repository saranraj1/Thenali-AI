"use client";

import { User, Zap } from "lucide-react";

type ChatMessageProps = {
    role: "user" | "assistant";
    content: string;
};

export default function ChatMessage({ role, content }: ChatMessageProps) {
    const isUser = role === "user";

    return (
        <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isUser ? "bg-[#ff7a30] border-[#ff7a30] text-white" : "bg-[#121417] border-[#1e2227] text-[#ff7a30]"
                }`}>
                {isUser ? <User size={20} /> : <Zap size={20} fill="currentColor" />}
            </div>
            <div
                className={`max-w-[75%] p-5 rounded-3xl text-sm leading-relaxed border ${isUser
                        ? "bg-[#ff7a30] border-[#ff7a30] text-white shadow-[0_5px_15px_rgba(255,122,48,0.2)] rounded-tr-sm"
                        : "bg-[#121417] border-[#1e2227] text-gray-300 rounded-tl-sm"
                    }`}
            >
                <p className="font-medium">{content}</p>
            </div>
        </div>
    );
}