"use client";

import { motion } from "framer-motion";
import { GitMerge, TrendingUp, Star, Zap } from "lucide-react";

type Props = {
  score?: number;
  totalPRs?: number;
  streak?: number;
  rank?: string;
};

export default function ContributionScore({
  score = 65,
  totalPRs = 4,
  streak = 3,
  rank = "Contributor",
}: Props) {
  const getRankColor = () => {
    if (score >= 85) return "text-saffron";
    if (score >= 60) return "text-green-bharat";
    return "text-blue-400";
  };

  const getLabel = () => {
    if (score >= 85) return "Ready to Merge";
    if (score >= 60) return "Growing Contributor";
    return "Getting Started";
  };

  return (
    <div className="lovable-card p-8 bg-gradient-to-br from-white/[0.04] to-transparent border-white/5">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center">
          <GitMerge size={18} className="text-saffron" />
        </div>
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest">Contribution Readiness</h3>
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-0.5">Open Source Impact Score</p>
        </div>
      </div>

      {/* Score ring */}
      <div className="flex items-center gap-8 mb-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <motion.circle
              cx="44" cy="44" r="36"
              fill="none"
              stroke="url(#scoreGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 36}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 36 * (1 - score / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF9933" />
                <stop offset="100%" stopColor="#138808" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-xl font-black ${getRankColor()}`}>{score}%</span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <p className={`text-sm font-black uppercase tracking-tight ${getRankColor()}`}>{getLabel()}</p>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-0.5">Rank: {rank}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">PRs Merged</p>
              <p className="text-base font-black text-white mt-0.5">{totalPRs}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Day Streak</p>
              <p className="text-base font-black text-saffron mt-0.5">{streak} 🔥</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-[9px] font-black text-white/20 uppercase tracking-widest">
          <span>Beginner</span>
          <span>Expert Contributor</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-saffron to-green-bharat"
          />
        </div>
      </div>
    </div>
  );
}