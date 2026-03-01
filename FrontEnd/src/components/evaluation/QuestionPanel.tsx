"use client";

type Props = {
    question?: string;
};

export default function QuestionPanel({
    question = "Explain how React useEffect works.",
}: Props) {
    return (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
            <h3 className="font-black mb-4 text-saffron uppercase tracking-widest text-[10px]">
                Interview Question
            </h3>
            <p className="text-white/80 text-base leading-relaxed font-medium">
                {question}
            </p>
        </div>
    );
}