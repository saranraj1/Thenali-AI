"use client";

import { memo } from "react";
import Card from "@/components/ui/Card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Sparkles } from "lucide-react";

type MasteryProps = {
    skills: any[];
};

const SkillMastery = ({ skills }: MasteryProps) => {
    return (
        <Card title="Concept Mastery Profile" className="p-8 h-full">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-saffron/10 rounded-xl">
                    <Sparkles size={24} className="text-saffron" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Intelligence Metrics</h3>
                    <p className="text-[10px] font-bold text-white/30 tracking-widest mt-2 uppercase italic">Recursive Concept Mapping</p>
                </div>
            </div>

            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skills}>
                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                        <PolarAngleAxis
                            dataKey="name"
                            stroke="rgba(255,255,255,0.6)"
                            fontSize={10}
                            tick={{ fill: 'white', fillOpacity: 0.4, fontWeight: 'bold' }}
                        />
                        <Radar
                            name="Mastery"
                            dataKey="score"
                            stroke="#ff9933"
                            strokeWidth={2}
                            fill="#ff9933"
                            fillOpacity={0.3}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
                {skills.slice(0, 4).map((skill, i) => (
                    <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{skill.name}</span>
                            <span className="text-xs font-black text-saffron">{skill.score}%</span>
                        </div>
                        <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                            <div className="h-full bg-saffron/40" style={{ width: `${skill.score}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default memo(SkillMastery);
