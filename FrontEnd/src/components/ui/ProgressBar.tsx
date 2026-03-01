"use client";

type Props = {
    value: number;
    showLabel?: boolean;
    color?: "saffron" | "green" | "tricolor";
};

export default function ProgressBar({ value, showLabel = false, color = "saffron" }: Props) {
    const barGradients = {
        saffron: "from-[#ff9933] to-[#ffcc66]",
        green: "from-[#138808] to-[#34d399]",
        tricolor: "from-[#ff9933] via-white to-[#138808]",
    };

    return (
        <div className="w-full space-y-4">
            {showLabel && (
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black tracking-[0.4em] text-gray-500 uppercase italic">Mastery Completion</span>
                    <span className="text-xl font-black text-white italic tracking-tighter">{value}%</span>
                </div>
            )}

            <div className="w-[100.5%] -ml-[0.25%] h-8 bg-[#0a0c10] rounded-full border border-white/5 p-1 relative shadow-inner overflow-hidden">
                {/* Background Track with Tricolor Hint */}
                <div className="absolute inset-0 opacity-5 bg-gradient-to-r from-saffron via-white to-green-bharat"></div>

                {/* The Progress Bar */}
                <div
                    className={`bg-gradient-to-r ${barGradients[color]} h-full rounded-full transition-all duration-[2s] cubic-bezier(0.34, 1.56, 0.64, 1) shadow-[0_0_20px_currentColor] relative overflow-hidden`}
                    style={{
                        width: `${value}%`,
                        color: color === 'saffron' ? '#ff9933' : color === 'green' ? '#138808' : '#ffffff'
                    }}
                >
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>

                    {/* Animated Shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[scan_3s_linear_infinite]"></div>
                </div>
            </div>
        </div>
    );
}