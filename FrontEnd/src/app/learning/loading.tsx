export default function LearningLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="h-48 rounded-[32px] bg-white/[0.03] border border-white/5" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-56 rounded-[32px] bg-white/[0.03] border border-white/5" />
                ))}
            </div>
        </div>
    );
}
