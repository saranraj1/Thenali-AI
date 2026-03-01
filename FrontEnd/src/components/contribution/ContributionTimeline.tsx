"use client";

import { m } from "framer-motion";
import { memo, useMemo } from "react";
import { BarChart3, TrendingUp } from "lucide-react";

type DataPoint = { month: string; count: number };

type Props = {
    data?: DataPoint[];
};

const DEFAULT_DATA: DataPoint[] = [
    { month: "Sep", count: 0 },
    { month: "Oct", count: 1 },
    { month: "Nov", count: 2 },
    { month: "Dec", count: 1 },
    { month: "Jan", count: 4 },
    { month: "Feb", count: 3 },
    { month: "Mar", count: 6 },
];

function ContributionTimeline({ data = DEFAULT_DATA }: Props) {
    const maxCount = useMemo(() => Math.max(...data.map(d => d.count), 1), [data]);
    const total = useMemo(() => data.reduce((a, d) => a + d.count, 0), [data]);
    const lastMonth = data[data.length - 1];
    const prevMonth = data[data.length - 2];
    const trend = lastMonth.count >= (prevMonth?.count ?? 0) ? "up" : "down";

    return (
        <div className="lovable-card p-8 bg-gradient-to-br from-white/[0.03] to-transparent border-white/5">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center">
                        <BarChart3 size={18} className="text-saffron" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Contribution Timeline</h3>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-0.5">Last 7 months</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xl font-black text-saffron">{total}</p>
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Total</p>
                </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-2 h-32 mb-3">
                {data.map((d, i) => {
                    const heightPct = maxCount === 0 ? 0 : (d.count / maxCount) * 100;
                    const isLast = i === data.length - 1;
                    return (
                        <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                            {/* Count tooltip */}
                            <span className="text-[9px] font-black text-white/0 group-hover:text-white/60 transition-colors">
                                {d.count}
                            </span>
                            {/* Bar */}
                            <div className="w-full relative flex items-end" style={{ height: "100px" }}>
                                <m.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max(heightPct, d.count > 0 ? 6 : 0)}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }}
                                    className={`w-full rounded-t-lg transition-all ${isLast
                                        ? "bg-gradient-to-t from-saffron to-orange-300 shadow-[0_0_12px_rgba(255,153,51,0.4)]"
                                        : "bg-white/10 group-hover:bg-white/20"
                                        }`}
                                    style={{ position: "absolute", bottom: 0 }}
                                />
                                {/* Zero state bar */}
                                {d.count === 0 && (
                                    <div className="w-full h-1 bg-white/[0.04] rounded absolute bottom-0" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* X axis labels */}
            <div className="flex gap-2">
                {data.map((d, i) => (
                    <div key={i} className="flex-1 text-center">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${i === data.length - 1 ? "text-saffron" : "text-white/20"}`}>
                            {d.month}
                        </span>
                    </div>
                ))}
            </div>

            {/* Trend indicator */}
            <div className="flex items-center gap-2 mt-5 pt-5 border-t border-white/5">
                <TrendingUp
                    size={14}
                    className={trend === "up" ? "text-green-bharat" : "text-red-400 rotate-180"}
                />
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    {trend === "up"
                        ? `+${lastMonth.count - (prevMonth?.count ?? 0)} vs last month`
                        : `${lastMonth.count - (prevMonth?.count ?? 0)} vs last month`}
                </span>
                <span className="ml-auto text-[9px] font-black text-saffron uppercase tracking-widest">
                    This Month: {lastMonth.count}
                </span>
            </div>
        </div>
    );
}

export default memo(ContributionTimeline);
