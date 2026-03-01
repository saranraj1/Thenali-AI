"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { Check, X } from "lucide-react";

type Props = {
    question?: string;
    options?: string[];
    correctAnswer?: string;
}

export default function FlashcardQuiz({
    question = "Which hook is used for side effects in functional components?",
    options = ["useState", "useEffect", "useContext"],
    correctAnswer = "useEffect",
}: Props) {
    const [selected, setSelected] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const handleSelect = (option: string) => {
        if (submitted) return;
        setSelected(option);
    };

    const handleSubmit = () => {
        if (!selected) return;
        setSubmitted(true);
    };

    const handleReset = () => {
        setSelected(null);
        setSubmitted(false);
    };

    return (
        <Card title="Quick Intelligence Quiz">
            <p className="mb-8 text-white text-lg font-black italic tracking-tight leading-relaxed">
                {question}
            </p>

            <div className="space-y-3 mb-6">
                {options.map((option, i) => {
                    const isSelected = selected === option;
                    const isCorrect = option === correctAnswer;

                    let stateClass = "border-white/10 bg-white/[0.03] text-white/50 hover:border-saffron/50 hover:text-white";
                    if (submitted) {
                        if (isCorrect) stateClass = "border-green-500/60 bg-green-500/10 text-green-400";
                        else if (isSelected && !isCorrect) stateClass = "border-red-500/60 bg-red-500/10 text-red-400";
                        else stateClass = "border-white/5 bg-white/[0.02] text-white/20";
                    } else if (isSelected) {
                        stateClass = "border-saffron/60 bg-saffron/10 text-white";
                    }

                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(option)}
                            disabled={submitted}
                            className={`w-full border p-4 rounded-2xl text-left text-xs font-bold uppercase tracking-widest transition-all flex justify-between items-center cursor-pointer disabled:cursor-default ${stateClass}`}
                        >
                            <span>{option}</span>
                            {submitted && isCorrect && <Check size={16} className="text-green-400 flex-shrink-0" />}
                            {submitted && isSelected && !isCorrect && <X size={16} className="text-red-400 flex-shrink-0" />}
                            {!submitted && isSelected && (
                                <span className="text-saffron text-[9px] tracking-widest font-black">SELECTED</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Action button */}
            {!submitted ? (
                <button
                    onClick={handleSubmit}
                    disabled={!selected}
                    className="w-full py-3 rounded-2xl bg-saffron text-white text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    Submit Answer
                </button>
            ) : (
                <div className="space-y-3">
                    <div className={`text-center text-xs font-black uppercase tracking-widest py-2 ${selected === correctAnswer ? "text-green-400" : "text-red-400"}`}>
                        {selected === correctAnswer ? "✓ Correct! Well done." : `✗ Incorrect. Correct: ${correctAnswer}`}
                    </div>
                    <button
                        onClick={handleReset}
                        className="w-full py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </Card>
    );
}