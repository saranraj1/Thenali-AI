"use client";

import { useState } from "react";
import { Play, RotateCcw, Monitor } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
    initialCode?: string;
}

export default function CodePractice({
    initialCode = "// Write your code here..."
}: Props) {
    const [code, setCode] = useState(initialCode);

    return (
        <div className="lovable-card bg-black/40 border-white/5 relative overflow-hidden p-0 group">
            {/* IDE HEADER */}
            <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-6">
                    {/* MacOS Style Dots */}
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                    </div>
                    <div className="h-4 w-px bg-white/10" />
                    <div className="flex items-center gap-2">
                        <Monitor size={12} className="text-white/20" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">sandbox_main.js</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-0.5 rounded-full bg-green-bharat/10 border border-green-bharat/20 text-[9px] font-black text-green-bharat uppercase tracking-widest">
                        Neural Active
                    </span>
                    <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest italic">mastery_node_01</span>
                </div>
            </div>

            {/* EDITOR BODY */}
            <div className="flex min-h-[350px] relative">
                {/* Line Numbers */}
                <div className="w-14 bg-black/20 border-r border-white/5 flex flex-col items-center pt-8 select-none font-mono text-[11px] text-white/10 leading-none gap-6">
                    {[...Array(10)].map((_, i) => (
                        <span key={i}>{i + 1}</span>
                    ))}
                </div>

                {/* Textarea */}
                <div className="flex-1 relative">
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-full bg-transparent p-8 font-mono text-sm leading-relaxed text-white/80 focus:outline-none resize-none custom-scrollbar placeholder:text-white/5"
                        spellCheck={false}
                        placeholder="// Initializing architectural script..."
                    />

                    {/* Subtle Grid Texture */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none"
                        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                    />
                </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="px-8 py-5 border-t border-white/5 bg-black/40 flex items-center justify-between">
                <button
                    onClick={() => setCode(initialCode)}
                    className="flex items-center gap-2 text-[10px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-all group"
                >
                    <RotateCcw size={14} className="group-hover:-rotate-90 transition-transform" />
                    Reset Initial Logic
                </button>

                <button className="flex items-center gap-2 px-8 py-2.5 bg-green-bharat/10 border border-green-bharat/30 rounded-2xl text-[10px] font-black text-green-bharat uppercase tracking-widest hover:bg-green-bharat hover:text-white transition-all shadow-lg hover:shadow-green-bharat/20 group">
                    Execute Script
                    <Play size={12} fill="currentColor" className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

            {/* Visual Depth Glow */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-bharat/5 blur-[80px] rounded-full pointer-events-none" />
        </div>
    );
}