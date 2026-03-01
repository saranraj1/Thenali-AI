"use client";

import { memo } from "react";
import Card from "@/components/ui/Card";
import { Clock, History, FileText, CheckCircle, Rocket } from "lucide-react";
import { motion } from "framer-motion";

type ActivityProps = {
    activities: any[];
};

const RecentActivity = ({ activities }: ActivityProps) => {
    const getIcon = (type: string) => {
        switch (type) {
            case "repo": return <Rocket size={14} />;
            case "assessment": return <CheckCircle size={14} />;
            case "learning": return <FileText size={14} />;
            default: return <Rocket size={14} />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case "repo": return "saffron";
            case "assessment": return "green-bharat";
            case "learning": return "blue-400";
            default: return "white";
        }
    };

    return (
        <Card title="Operational Log" className="p-8 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 pr-16 opacity-[0.02] pointer-events-none">
                <History size={160} />
            </div>

            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                <div className="p-3 bg-white/5 rounded-xl">
                    <Clock size={24} className="text-white/40" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest leading-none">Recent Activity</h3>
                    <p className="text-[10px] font-bold text-white/30 tracking-widest mt-2 uppercase italic">Sequential Action Log</p>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                {activities.map((activity, i) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-6 p-4 rounded-2xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all group"
                    >
                        <div className={`mt-1 p-2 bg-${getColor(activity.type)}/10 rounded-lg text-${getColor(activity.type)} border border-${getColor(activity.type)}/20`}>
                            {getIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-sm font-bold text-white group-hover:text-white/90 transition-colors uppercase tracking-tight">{activity.title}</h4>
                                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{activity.timestamp}</span>
                            </div>
                            {activity.score && (
                                <div className="mt-2 px-3 py-1 bg-green-bharat/10 border border-green-bharat/20 rounded-full inline-flex items-center gap-2">
                                    <span className="text-[9px] font-black text-green-bharat uppercase tracking-widest">Score: {activity.score}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-10 py-4 border border-white/5 bg-white/[0.02] rounded-2xl text-[10px] font-black text-white/20 uppercase tracking-[0.4em] hover:bg-white/5 hover:text-white/40 transition-all">
                Access Full Logs
            </button>
        </Card>
    );
};

export default memo(RecentActivity);
