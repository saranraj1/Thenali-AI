"use client";

import { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import useChat from "@/hooks/useChat";

export default function ChatWindow({ repoId }: { repoId?: string }) {
    const { messages, loading, sendMessage } = useChat(repoId);

    return (
        <div className="flex flex-col h-[600px] border border-[#1e2227] rounded-[2rem] bg-[#0d0f11] overflow-hidden shadow-2xl">

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full opacity-20 grayscale">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4">
                            <span className="text-black font-black text-2xl italic">AI</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Intel Exchanged</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <ChatMessage
                        key={index}
                        role={msg.role as "user" | "assistant"}
                        content={msg.content}
                    />
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-[#121417] p-4 rounded-2xl border border-[#1e2227] animate-pulse">
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">AI SCANNING...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Tactical Input */}
            <div className="p-6 bg-[#08090a] border-t border-[#1e2227]">
                <ChatInput onSend={sendMessage} />
            </div>

        </div>
    );
}