"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, Square, Play, Pause, Sparkles, MessageSquare, Brain } from "lucide-react";

interface NeuralVoiceInterfaceProps {
    conceptTopic?: string;
    onUserVoiceInput?: (text: string) => void;
}

export default function NeuralVoiceInterface({
    conceptTopic = "Structural Integrity",
    onUserVoiceInput
}: NeuralVoiceInterfaceProps) {
    const [isListening, setIsListening] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [voiceStatus, setVoiceStatus] = useState<"idle" | "capturing" | "processing" | "synthesizing">("idle");

    // Simulate AI Voice Toggle
    const toggleAIVoice = () => {
        if (isPlaying) {
            setIsPlaying(false);
            setVoiceStatus("idle");
        } else {
            setIsPlaying(true);
            setVoiceStatus("synthesizing");
            // Auto stop after 5 seconds for simulation
            setTimeout(() => {
                setIsPlaying(false);
                setVoiceStatus("idle");
            }, 8000);
        }
    };

    // Simulate User Voice Input
    const startListening = () => {
        setIsListening(true);
        setVoiceStatus("capturing");

        setTimeout(() => {
            setIsListening(false);
            setVoiceStatus("processing");

            setTimeout(() => {
                setVoiceStatus("idle");
                onUserVoiceInput?.("How does this relate to state mutation?");
            }, 1500);
        }, 3000);
    };

    return (
        <div className="lovable-card p-8 bg-black/40 border-white/5 relative overflow-hidden group">
            {/* Background Animation */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ x: [-10, 10, -10], y: [-10, 10, -10] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full bg-gradient-to-tr from-saffron via-transparent to-green-bharat opacity-20 blur-3xl"
                />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center">
                            <Volume2 size={20} className="text-saffron" />
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Neural Voice Bridge</h3>
                            <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Bi-Directional Intel Exchange</p>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={voiceStatus}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 flex items-center gap-2"
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${voiceStatus === 'idle' ? 'bg-white/20' : 'bg-saffron animate-pulse'}`} />
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{voiceStatus}</span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="space-y-6">
                    {/* Visualizer Area */}
                    <div className="h-24 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center gap-1.5 px-10 relative overflow-hidden">
                        {isPlaying ? (
                            <Waveform color="#FF9933" count={24} />
                        ) : isListening ? (
                            <Waveform color="#34d399" count={24} />
                        ) : (
                            <div className="flex items-center gap-4 text-white/10 italic">
                                <Sparkles size={16} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Initialize Connection</span>
                            </div>
                        )}

                        {/* Audio Legend */}
                        {isPlaying && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[8px] font-black text-saffron uppercase tracking-[0.4em] italic"
                            >
                                AI Mentor Explaining...
                            </motion.div>
                        )}
                    </div>

                    {/* Unified Voice Controls */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Action 1: Listen to AI */}
                        <button
                            onClick={toggleAIVoice}
                            className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden ${isPlaying
                                    ? "bg-saffron text-white border-saffron shadow-2xl shadow-saffron/20"
                                    : "bg-white/[0.03] border-white/5 text-white/40 hover:border-saffron/30 hover:bg-white/[0.05]"
                                }`}
                        >
                            <div className={`mb-3 transition-transform duration-500 ${isPlaying ? 'scale-110' : 'group-hover:scale-110'}`}>
                                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Listen to AI</span>
                        </button>

                        {/* Action 2: Speak to AI */}
                        <button
                            onClick={startListening}
                            disabled={isPlaying}
                            className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all duration-500 group relative overflow-hidden ${isListening
                                    ? "bg-green-bharat text-white border-green-bharat shadow-2xl shadow-green-bharat/20"
                                    : isPlaying
                                        ? "bg-white/5 border-white/5 text-white/10 cursor-not-allowed opacity-50"
                                        : "bg-white/[0.03] border-white/5 text-white/40 hover:border-green-bharat/30 hover:bg-white/[0.05]"
                                }`}
                        >
                            <div className={`mb-3 transition-transform duration-500 ${isListening ? 'scale-110' : 'group-hover:scale-110'}`}>
                                <Mic size={24} fill={isListening ? "currentColor" : "none"} />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Speak to AI</span>
                        </button>
                    </div>

                    <div className="pt-6 border-t border-white/5 text-center">
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] italic">
                            Synthesized via Bharat Neural Engine v4.0.2
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Waveform({ color, count }: { color: string, count: number }) {
    return (
        <div className="flex items-center gap-1 h-full">
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        height: [10, Math.random() * 40 + 10, 10],
                        opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.05,
                        ease: "easeInOut"
                    }}
                    style={{ backgroundColor: color }}
                    className="w-1 rounded-full"
                />
            ))}
        </div>
    );
}
