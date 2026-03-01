"use client";

import Card from "@/components/ui/Card";
import ConfidenceChart from "@/components/charts/ConfidenceChart";

export default function ConfidenceGraph() {
    return (
        <Card title="Confidence Vector Mapping">
            <ConfidenceChart />
        </Card>
    );
}