"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  value?: string;
  onChange?: (code: string) => void;
  onRun?: () => void;
}

/**
 * Code editor with:
 * - Synchronized line numbers (dynamic, matches actual line count)
 * - Monospace textarea
 * - Tab key inserts 4 spaces (instead of focus jump)
 * - Ctrl+Enter forwarded to onRun prop
 */
export default function CodeEditor({ value = "", onChange, onRun }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineCountRef = useRef<HTMLDivElement>(null);

  // Sync scroll between textarea and line numbers
  const syncScroll = () => {
    if (textareaRef.current && lineCountRef.current) {
      lineCountRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab → 4 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = value.substring(0, start) + "    " + value.substring(end);
      onChange?.(newVal);
      // Restore cursor after the inserted spaces
      requestAnimationFrame(() => {
        ta.selectionStart = start + 4;
        ta.selectionEnd = start + 4;
      });
    }
    // Ctrl+Enter or Cmd+Enter → run
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      onRun?.();
    }
  };

  const lineCount = (value || "").split("\n").length;

  return (
    <div className="lovable-card h-[450px] relative overflow-hidden bg-black/40 border-white/5 shadow-2xl">
      {/* Editor Surface */}
      <div className="absolute inset-0 pt-16 px-8 pb-8 flex group">

        {/* Line Numbers — dynamically rendered */}
        <div
          ref={lineCountRef}
          className="w-10 h-full flex flex-col items-end select-none pt-2 opacity-20 overflow-hidden mr-4 shrink-0"
          style={{ scrollbarWidth: "none" }}
        >
          {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => (
            <div key={i} className="text-[11px] font-mono text-white leading-relaxed">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          className="flex-1 bg-transparent border-none focus:outline-none text-white/80 font-mono text-sm leading-relaxed resize-none custom-scrollbar p-2 placeholder:text-white/5"
          placeholder="# Initializing neural script..."
        />

        {/* Floating Gradient for Depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-saffron/2 to-transparent pointer-events-none opacity-50" />
      </div>

      {/* Grid Background Texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
    </div>
  );
}