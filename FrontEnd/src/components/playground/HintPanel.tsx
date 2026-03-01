"use client";

import { motion } from "framer-motion";
import { Lightbulb, Info, Target, Cpu } from "lucide-react";

const hints = [
  { label: "Function Logic", content: "Use parameters for dynamic architectural scaling." },
  { label: "Sync Status", content: "Always return values to complete the neural handshake." },
  { label: "Traceability", content: "Utilize console.log for real-time telemetry scans." },
];

export default function HintPanel() {
  return (
    <div className="lovable-card p-10 bg-white/[0.02] border-white/5 relative overflow-hidden group">

      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-saffron/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-saffron/10 border border-saffron/20 flex items-center justify-center">
          <Lightbulb size={20} className="text-saffron" />
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural Directives</h3>
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1 italic">Tactical Guidelines</p>
        </div>
      </div>

      <div className="space-y-4">
        {hints.map((hint, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-default"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black text-saffron uppercase tracking-[0.2em]">Rule 0{index + 1}</span>
              <Info size={12} className="text-white/20" />
            </div>
            <h4 className="text-[11px] font-extrabold text-white/80 uppercase tracking-wider mb-2">{hint.label}</h4>
            <p className="text-[10px] font-medium text-white/30 leading-relaxed italic">"{hint.content}"</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-3 opacity-20 group-hover:opacity-40 transition-opacity">
        <Cpu size={14} className="text-white" />
        <span className="text-[9px] font-black text-white uppercase tracking-[0.5em]">AI ENGINE STANDBY</span>
      </div>

    </div>
  );
}