"use client";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
            <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8">
                <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">
                System Error Detected
            </h2>
            <p className="text-white/40 text-sm max-w-md mb-8 leading-relaxed">
                The dashboard encountered an unexpected error. Your data is safe.
            </p>
            <button
                onClick={reset}
                className="px-8 py-4 bg-saffron text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:ring-offset-2 focus:ring-offset-black"
            >
                Retry
            </button>
        </div>
    );
}
