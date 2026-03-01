"use client";

import Card from "@/components/ui/Card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Cell
} from "recharts";

const data = [
    { topic: "React", p: 90, color: "#ff9933" },
    { topic: "System", p: 75, color: "#ffcc66" },
    { topic: "Next.js", p: 60, color: "#138808" },
    { topic: "API", p: 40, color: "#34d399" },
    { topic: "DevOps", p: 20, color: "#000080" },
];

export default function ProgressChart() {
    return (
        <Card title="Skill Distribution">
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="topic"
                            stroke="rgba(255,255,255,0.2)"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 10 }}
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(255,153,51,0.2)',
                                borderRadius: '16px',
                                fontSize: '12px',
                                backdropFilter: 'blur(10px)',
                                color: '#fff'
                            }}
                        />
                        <Bar
                            dataKey="p"
                            radius={[8, 8, 8, 8]}
                            barSize={40}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}