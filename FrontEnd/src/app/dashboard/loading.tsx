export default function DashboardLoading() {
    return (
        <div className="space-y-10 animate-pulse">
            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-40 rounded-[32px] bg-white/[0.03] border border-white/5" />
                ))}
            </div>
            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-64 rounded-[32px] bg-white/[0.03] border border-white/5" />
                ))}
            </div>
        </div>
    );
}
