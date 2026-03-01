"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const data = [
    { week: "W1", conf: 30 },
    { week: "W2", conf: 40 },
    { week: "W3", conf: 55 },
    { week: "W4", conf: 70 },
    { week: "W5", conf: 85 },
];

export default function ConfidenceChart() {
    return (
        <div className="w-full h-80" style={{ minHeight: "200px" }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e2227" vertical={false} />
                    <XAxis
                        dataKey="week"
                        stroke="#4b5563"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontWeight: 'bold' }}
                    />
                    <YAxis
                        stroke="#4b5563"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontWeight: 'bold' }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#121417', borderColor: '#1e2227', borderRadius: '12px', fontSize: '10px' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="conf"
                        stroke="#34d399"
                        fillOpacity={1}
                        fill="url(#colorConf)"
                        strokeWidth={4}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}