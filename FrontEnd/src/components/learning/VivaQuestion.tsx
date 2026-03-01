"use client";

import { useState, useRef, useEffect } from "react";
import Card from "@/components/ui/Card";
import { Mic, MicOff, Check, X, RotateCcw, Send } from "lucide-react";

type Props = {
    question?: string;
    keywords?: string[]; // words that must appear in a correct answer
}

export default function VivaQuestion({
    question = "Explain the difference between useEffect and useMemo.",
    keywords = ["useeffect", "side effects", "memo", "usememo", "render", "cache", "dependency", "recompute"],
}: Props) {
    const [answer, setAnswer] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceSupported, setVoiceSupported] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Check browser support on mount
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        setVoiceSupported(!!SpeechRecognition);
    }, []);

    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognitionRef.current = recognition;

        recognition.onresult = (e: any) => {
            const transcript = Array.from(e.results)
                .map((r: any) => r[0].transcript)
                .join(" ");
            setAnswer(transcript);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
        setIsListening(true);
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setIsListening(false);
    };

    const toggleVoice = () => {
        if (isListening) stopListening();
        else startListening();
    };

    const evaluateAnswer = (text: string) => {
        const lc = text.toLowerCase();
        const matched = keywords.filter(kw => lc.includes(kw));
        // Correct if at least 2 keywords mentioned and answer is at least 20 chars
        return matched.length >= 2 && text.trim().length >= 20;
    };

    const handleSubmit = () => {
        if (!answer.trim()) return;
        stopListening();
        setIsCorrect(evaluateAnswer(answer));
        setSubmitted(true);
    };

    const handleReset = () => {
        setAnswer("");
        setSubmitted(false);
        setIsCorrect(false);
    };

    return (
        <Card title="AI Viva Session">
            {/* Question */}
            <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-bharat/10 flex items-center justify-center text-green-bharat shrink-0 border border-green-bharat/20 shadow-inner">
                    <Mic size={20} />
                </div>
                <p className="text-sm font-black text-white italic tracking-tight leading-relaxed">
                    {question}
                </p>
            </div>

            {/* Voice not supported notice */}
            {!voiceSupported && (
                <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest px-1 mb-2 italic">
                    🎤 Voice input not supported in this browser — type your answer below
                </p>
            )}

            {/* Textarea */}
            <div className="relative mb-4">
                <textarea
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    disabled={submitted}
                    className={`w-full bg-white/[0.03] border rounded-3xl h-36 p-5 pr-16 text-sm text-white/80 focus:outline-none transition-all placeholder:text-white/10 resize-none disabled:opacity-60 ${submitted
                        ? isCorrect
                            ? "border-green-bharat/50 bg-green-bharat/5"
                            : "border-red-500/50 bg-red-500/5"
                        : isListening
                            ? "border-saffron/50 bg-saffron/5 focus:border-saffron/60"
                            : "border-white/10 focus:border-saffron/40 focus:bg-white/[0.05]"
                        }`}
                    placeholder={isListening ? "🎤 Listening... speak your answer" : "Type or speak your explanation..."}
                />

                {/* Voice mic button inside textarea corner */}
                {voiceSupported && !submitted && (
                    <button
                        type="button"
                        onClick={toggleVoice}
                        title={isListening ? "Stop recording" : "Speak your answer"}
                        className={`absolute bottom-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isListening
                            ? "bg-saffron text-white shadow-[0_0_12px_rgba(255,153,51,0.5)] animate-pulse"
                            : "bg-white/5 border border-white/10 text-white/30 hover:bg-saffron/10 hover:text-saffron hover:border-saffron/30"
                            }`}
                    >
                        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                    </button>
                )}
            </div>

            {/* Voice status indicator */}
            {isListening && (
                <div className="flex items-center gap-2 mb-4 px-2">
                    <span className="w-2 h-2 rounded-full bg-saffron animate-ping" />
                    <span className="text-[10px] font-bold text-saffron uppercase tracking-widest">Recording — speak now</span>
                    <button onClick={stopListening} className="ml-auto text-[9px] font-black text-white/20 hover:text-white uppercase tracking-widest transition-colors">
                        Stop
                    </button>
                </div>
            )}

            {/* Result feedback */}
            {submitted && (
                <div className={`flex items-start gap-3 p-4 rounded-2xl mb-4 ${isCorrect ? "bg-green-bharat/5 border border-green-bharat/20" : "bg-red-500/5 border border-red-500/20"}`}>
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${isCorrect ? "bg-green-bharat/20" : "bg-red-500/20"}`}>
                        {isCorrect ? <Check size={14} className="text-green-bharat" /> : <X size={14} className="text-red-400" />}
                    </div>
                    <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isCorrect ? "text-green-bharat" : "text-red-400"}`}>
                            {isCorrect ? "Good Explanation!" : "Needs More Detail"}
                        </p>
                        <p className="text-[10px] text-white/40 leading-relaxed italic">
                            {isCorrect
                                ? "Your answer covers the key concepts. Well done!"
                                : `Hint: Mention key terms like — ${keywords.slice(0, 4).join(", ")}...`}
                        </p>
                    </div>
                </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
                {!submitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!answer.trim()}
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-saffron text-white text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <Send size={14} />
                        Submit Response
                    </button>
                ) : (
                    <button
                        onClick={handleReset}
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                    >
                        <RotateCcw size={14} />
                        Try Again
                    </button>
                )}
            </div>
        </Card>
    );
}