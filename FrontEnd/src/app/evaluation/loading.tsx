export default function EvaluationLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-40 rounded-[32px] bg-white/[0.03] border border-white/5" />
            <div className="h-80 rounded-[32px] bg-white/[0.03] border border-white/5" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-32 rounded-[32px] bg-white/[0.03] border border-white/5" />
                ))}
            </div>
        </div>
    );
}
