"use client";

import { useState } from "react";
import { SendHorizontal } from "lucide-react";

type ChatInputProps = {
    onSend: (message: string) => void;
};

export default function ChatInput({ onSend }: ChatInputProps) {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        onSend(input);
        setInput("");
    };

    return (
        <div className="flex gap-3 relative">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="TRANSMIT MESSAGE..."
                className="flex-1 bg-[#0d0f11] border border-[#1e2227] rounded-2xl py-4 px-6 text-xs font-black tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-[#ff7a30]/30 transition-all placeholder:text-gray-800 uppercase"
            />

            <button
                onClick={handleSend}
                className="bg-[#ff7a30] text-white p-4 rounded-2xl hover:bg-[#ff8c4d] transition-all shadow-[0_5px_15px_rgba(255,122,48,0.3)] active:scale-95 flex items-center justify-center shrink-0"
            >
                <SendHorizontal size={20} />
            </button>
        </div>
    );
}