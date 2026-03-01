"use client";

import { motion } from "framer-motion";
import { Play, Sparkles, Zap, Shield } from "lucide-react";

type Props = {
  onRun?: () => void;
  loading?: boolean;
};

export default function RunButton({ onRun, loading = false }: Props) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onRun}
      disabled={loading}
      className={`px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center gap-4 relative overflow-hidden group shadow-2xl ${loading ? 'opacity-50 cursor-not-allowed bg-white/10' : 'bg-saffron text-white shadow-saffron/30'}`}
    >
      <div className="flex items-center gap-3 relative z-10 transition-all duration-300 group-hover:scale-105">
        {loading ? (
          <Sparkles size={18} className="animate-spin" />
        ) : (
          <Play size={18} fill="white" className="group-hover:translate-x-1 duration-300" />
        )}
        <span>{loading ? "Initializing..." : "Neural Scan"}</span>
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Scanning Laser Effect (Loading) */}
      {loading && (
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '100%' }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 w-1/4 h-full bg-white/40 blur-xl skew-x-12"
        />
      )}
    </motion.button>
  );
}