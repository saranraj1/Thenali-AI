export default function ContributionLoading() {
    return (
        <div className="space-y-10 animate-pulse">
            <div className="h-32 rounded-[32px] bg-white/[0.03] border border-white/5" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-72 rounded-[32px] bg-white/[0.03] border border-white/5" />
                ))}
            </div>
        </div>
    );
}
