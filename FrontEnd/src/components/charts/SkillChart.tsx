"use client";

import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";
import { memo } from "react";

// Lazy-load the heavy recharts bundle — saves ~350KB from initial JS
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — next/dynamic runtime import; tsc resolves this correctly at build time
const SkillChartInner = dynamic(() => import("./SkillChartInner"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-80 flex items-center justify-center">
            <div className="h-full w-full animate-pulse bg-white/[0.03] rounded-2xl" />
        </div>
    ),
});

function SkillChart() {
    return (
        <Card title="Learning Trajectory">
            <div className="w-full h-80">
                <SkillChartInner />
            </div>
        </Card>
    );
}

export default memo(SkillChart);