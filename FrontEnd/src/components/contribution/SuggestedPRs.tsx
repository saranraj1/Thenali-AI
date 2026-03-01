"use client";

import { useState, useMemo, memo } from "react";
import { m } from "framer-motion";
import { Star, GitFork, ExternalLink, Zap } from "lucide-react";

import type { RecommendedRepo } from "@/hooks/useContribution";

// ─── Style maps ───────────────────────────────────────────────────────────────
const DIFF_COLORS: Record<string, string> = {
  Beginner: "text-green-bharat bg-green-bharat/10 border-green-bharat/20",
  Intermediate: "text-saffron bg-saffron/10 border-saffron/20",
  Advanced: "text-red-400 bg-red-400/10 border-red-400/20",
};

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-400/10 text-blue-400",
  JavaScript: "bg-yellow-400/10 text-yellow-400",
  Python: "bg-green-bharat/10 text-green-bharat",
  Markdown: "bg-white/5 text-white/40",
};

// ─── Complexity score color ───────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score <= 30) return { stroke: "#138808", text: "text-green-bharat" };  // easy
  if (score <= 60) return { stroke: "#FF9933", text: "text-saffron" };       // medium
  return { stroke: "#f87171", text: "text-red-400" };                        // hard
}

// ─── Small SVG circle ─────────────────────────────────────────────────────────
const ComplexityCircle = memo(function ComplexityCircle({ score }: { score: number }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const { stroke, text } = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-0.5 flex-shrink-0" title={`Complexity: ${score}/100`}>
      <div className="relative w-9 h-9">
        <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
          {/* Track */}
          <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5" />
          {/* Progress */}
          <m.circle
            cx="18" cy="18" r={r}
            fill="none"
            stroke={stroke}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={`${circ}`}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ * (1 - score / 100) }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        {/* Label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-[9px] font-black leading-none ${text}`}>{score}</span>
        </div>
      </div>
      <span className="text-[7px] font-black text-white/20 uppercase tracking-widest leading-none">cmplx</span>
    </div>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────
type Props = {
  isNewUser?: boolean;
  data?: RecommendedRepo[];
};

export default memo(function SuggestedPRs({ isNewUser = false, data = [] }: Props) {
  const [filter, setFilter] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");
  const filtered = useMemo(
    () => filter === "All" ? data : data.filter(r => r.difficulty === filter),
    [filter, data]
  );

  return (
    <div className="lovable-card p-8 bg-gradient-to-br from-white/[0.03] to-transparent border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center">
            <GitFork size={18} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest">
              {isNewUser ? "Starter Repos" : "Recommended For You"}
            </h3>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-0.5">
              {isNewUser ? "Perfect for first contributions" : "Based on your learning history"}
            </p>
          </div>
        </div>
        {!isNewUser && (
          <span className="text-[8px] font-black px-2.5 py-1 rounded-full bg-saffron/10 border border-saffron/20 text-saffron uppercase tracking-widest">
            AI Matched
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["All", "Beginner", "Intermediate", "Advanced"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${filter === f
              ? "bg-saffron/10 border-saffron/30 text-saffron"
              : "bg-white/[0.02] border-white/5 text-white/20 hover:border-white/15 hover:text-white/40"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Repo cards */}
      <div className="space-y-3">
        {filtered.map((repo, i) => (
          <m.div
            key={repo.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="group p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all"
          >
            <div className="flex items-center gap-4">

              {/* Complexity circle — left side */}
              <ComplexityCircle score={repo.complexity_score} />

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-black text-white group-hover:text-saffron transition-colors truncate">
                    {repo.name}
                  </span>
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest flex-shrink-0 ${DIFF_COLORS[repo.difficulty]}`}>
                    {repo.difficulty}
                  </span>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest flex-shrink-0 ${LANG_COLORS[repo.language] ?? "bg-white/5 text-white/30"}`}>
                    {repo.language}
                  </span>
                </div>

                <p className="text-[10px] text-white/40 leading-snug line-clamp-1 mb-1">{repo.description}</p>

                {/* Reason */}
                <div className="flex items-center gap-1.5">
                  <Zap size={9} className="text-saffron/50 flex-shrink-0" />
                  <span className="text-[9px] text-white/25 italic line-clamp-1">{repo.match_reason}</span>
                </div>
              </div>

              {/* Right: stars + link */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <a
                  href={`https://github.com/${repo.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-white/20 hover:text-saffron hover:border-saffron/30 transition-all"
                >
                  <ExternalLink size={13} />
                </a>
                <span className="flex items-center gap-1 text-[9px] text-white/20 font-bold">
                  <Star size={9} /> {repo.stars}
                </span>
              </div>
            </div>

            {/* Tags row */}
            <div className="flex items-center gap-2 mt-2 ml-[52px] flex-wrap">
              {repo.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[8px] font-bold text-white/15 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/5 uppercase tracking-widest">
                  #{tag}
                </span>
              ))}
            </div>
          </m.div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-white/20 text-xs font-bold uppercase tracking-widest">
          Analyze more repositories to get personalized recommendations
        </div>
      )}

      {/* Legend */}
      <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-5 flex-wrap">
        <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">Complexity:</span>
        {[{ label: "Easy", color: "text-green-bharat", range: "0–30" }, { label: "Medium", color: "text-saffron", range: "31–60" }, { label: "Hard", color: "text-red-400", range: "61–100" }].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${l.color.replace("text-", "bg-")}`} />
            <span className={`text-[9px] font-black uppercase tracking-widest ${l.color}`}>{l.label}</span>
            <span className="text-[8px] text-white/15">{l.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
