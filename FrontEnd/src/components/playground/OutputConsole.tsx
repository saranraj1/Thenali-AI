"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, XCircle, Clock, CheckCircle2, AlertTriangle, Link } from "lucide-react";
import NextLink from "next/link";

type Props = {
  output?: string | null;
  error?: string | null;
  loading?: boolean;
  executionTime?: number | null;
  onClear?: () => void;
};

export default function OutputConsole({
  output = null,
  error = null,
  loading = false,
  executionTime = null,
  onClear,
}: Props) {
  const hasContent = !!(output || error);
  const isAuthError = error?.includes("Please login");

  return (
    <div className="lovable-card h-[280px] flex flex-col bg-black/80 border-white/5 shadow-3xl overflow-hidden relative">

      {/* Console Header */}
      <div className="px-8 py-3 bg-white/[0.03] border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Terminal size={14} className="text-white/20" />
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] italic">Output Console</span>

          {/* Status icon */}
          {!loading && error && <XCircle size={12} className="text-red-400" />}
          {!loading && output && !error && <CheckCircle2 size={12} className="text-green-bharat" />}
        </div>

        <div className="flex items-center gap-4">
          {/* Execution time badge */}
          {executionTime !== null && !loading && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <Clock size={9} className="text-saffron" />
              <span className="text-[9px] font-black text-white/50 tracking-widest uppercase">
                {executionTime.toFixed(2)}ms
              </span>
            </div>
          )}

          {/* Loading dots */}
          {loading && (
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-saffron rounded-full animate-bounce delay-75" />
              <div className="w-1 h-1 bg-saffron rounded-full animate-bounce delay-150" />
              <div className="w-1 h-1 bg-saffron rounded-full animate-bounce delay-225" />
            </div>
          )}

          {/* Clear button */}
          {hasContent && !loading && onClear && (
            <button
              onClick={onClear}
              className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-white/30 tracking-widest uppercase hover:bg-white/10 hover:text-white transition-all"
            >
              Clear
            </button>
          )}

          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-white/30 tracking-widest uppercase">Buffer: 1024 KB</div>
        </div>
      </div>

      {/* Console Feed */}
      <div className="flex-1 overflow-y-auto p-8 font-mono text-sm custom-scrollbar relative">
        <AnimatePresence mode="popLayout">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 text-saffron/60 text-[11px] uppercase tracking-widest font-black"
            >
              <div className="w-2 h-2 bg-saffron rounded-full animate-pulse" />
              Executing neural script...
            </motion.div>
          )}

          {/* Error output */}
          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-red-400 shrink-0" />
                <span className="text-[9px] font-black text-red-400 uppercase tracking-[0.3em]">
                  {error.startsWith("Runtime Error") ? "Runtime Error" : "Error"}
                </span>
              </div>
              <pre className="whitespace-pre-wrap text-red-300/90 text-[12px] leading-relaxed font-mono bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                {error.replace(/^Runtime Error:\n/, "")}
              </pre>
              {isAuthError && (
                <NextLink
                  href="/auth/login"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-saffron/10 border border-saffron/30 rounded-full text-[10px] font-black text-saffron uppercase tracking-widest hover:bg-saffron hover:text-white transition-all"
                >
                  <Link size={10} />
                  Login to Execute Code
                </NextLink>
              )}
            </motion.div>
          )}

          {/* Successful output */}
          {!loading && output && !error && (
            <motion.pre
              key={output}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/80 leading-loose whitespace-pre-wrap flex flex-col gap-1"
            >
              {output.split("\n").map((line, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-white/10 select-none text-[11px] w-6 text-right shrink-0">{i + 1}</span>
                  <span className={`text-[12px] ${line.includes("[SUCCESS]") ? "text-green-bharat" : "text-white/80"}`}>
                    {line || " "}
                  </span>
                </div>
              ))}
            </motion.pre>
          )}
        </AnimatePresence>

        {/* Empty state watermark */}
        {!hasContent && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-10">
            <Cpu size={40} className="mb-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Execution</span>
          </div>
        )}
      </div>

      {/* Animated bottom bar */}
      <div className="h-1 w-full bg-saffron/20 relative shrink-0">
        <motion.div
          initial={{ left: "-100%" }}
          animate={loading ? { left: "100%" } : { left: "-100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 w-1/4 h-full bg-saffron shadow-[0_0_10px_rgba(255,153,51,0.5)]"
        />
      </div>

    </div>
  );
}