"use client";

import Card from "@/components/ui/Card";
import { Network, Zap, Cpu, Server, Database, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function RepoArchitecture() {
    return (
        <Card title="System Architecture Pulse">
            <div className="relative h-[480px] bg-black/40 rounded-[32px] overflow-hidden border border-white/5 flex items-center justify-center">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #ff9933 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                {/* Central AI Node */}
                <div className="relative z-10 flex flex-col items-center">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="w-32 h-32 rounded-[40px] bg-white text-saffron flex items-center justify-center shadow-[0_0_80px_rgba(255,153,51,0.2)] mb-8"
                    >
                        <Zap size={44} fill="#ff9933" />
                    </motion.div>
                    <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-10">CORE LOGIC ENGINE</p>

                    {/* Peripheral Nodes (Mock) */}
                    <div className="flex gap-16">
                        <NodeItem icon={<Globe size={18} />} title="API Gateway" />
                        <NodeItem icon={<Server size={18} />} title="Auth Service" />
                        <NodeItem icon={<Database size={18} />} title="Vector DB" />
                    </div>
                </div>

                {/* Animated Connection Lines (Mock) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <motion.line
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity }}
                        x1="50%" y1="50%" x2="20%" y2="80%" stroke="#ff9933" strokeWidth="1" strokeDasharray="4 4"
                    />
                    <motion.line
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                        x1="50%" y1="50%" x2="80%" y2="80%" stroke="#ff9933" strokeWidth="1" strokeDasharray="4 4"
                    />
                </svg>
            </div>
        </Card>
    );
}

function NodeItem({ icon, title }: any) {
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group hover:border-saffron/50 transition-all cursor-pointer">
                {icon}
            </div>
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">{title}</span>
        </div>
    );
}
