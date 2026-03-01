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
    { week: "Week 1", skill: 20 },
    { week: "Week 2", skill: 38 },
    { week: "Week 3", skill: 45 },
    { week: "Week 4", skill: 68 },
    { week: "Week 5", skill: 85 },
];

export default function SkillChartInner() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorSkill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff9933" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ff9933" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                    dataKey="week"
                    stroke="rgba(255,255,255,0.2)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                />
                <YAxis hide />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(255,153,51,0.2)',
                        borderRadius: '16px',
                        fontSize: '12px',
                        backdropFilter: 'blur(10px)',
                        color: '#fff'
                    }}
                />
                <Area
                    type="monotone"
                    dataKey="skill"
                    stroke="#ff9933"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorSkill)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
