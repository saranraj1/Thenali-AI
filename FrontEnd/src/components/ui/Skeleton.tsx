"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "pulse" | "shimmer";
}

export default function Skeleton({ className, variant = "shimmer" }: SkeletonProps) {
  if (variant === "pulse") {
    return (
      <div
        className={cn(
          "animate-pulse rounded-2xl bg-white/[0.03] border border-white/5",
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5",
        className
      )}
    >
      <motion.div
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12"
      />
    </div>
  );
}
