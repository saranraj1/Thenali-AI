"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Zap, RefreshCcw } from "lucide-react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

interface ConceptSyncProps {
    conceptName: string;
    onNext: () => void;
    onReview: () => void;
}

export default function ConceptSyncSuccess({
    conceptName,
    onNext,
    onReview
}: ConceptSyncProps) {
    const { t } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lovable-card p-12 bg-black/40 border-saffron/20 relative overflow-hidden"
        >
            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-green-bharat/10 border border-green-bharat/20 flex items-center justify-center mb-8">
                    <Zap size={32} className="text-green-bharat" />
                </div>

                <h3 className="text-[10px] font-black text-green-bharat uppercase tracking-[0.4em] mb-2 italic">{t("neural_node_synced")}</h3>
                <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6">
                    {conceptName} <span className="text-white/20">{t("mastered")}</span>
                </h2>

                <p className="text-sm text-white/40 italic mb-10 max-w-md">
                    {t("integrity_verified")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                    <Button
                        variant="saffron"
                        className="flex-1 py-6 italic tracking-tighter"
                        onClick={onNext}
                    >
                        {t("continue_journey")}
                        <ArrowRight size={18} />
                    </Button>
                    <button
                        onClick={onReview}
                        className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCcw size={12} />
                        {t("review_concept")}
                    </button>
                </div>
            </div>

            {/* Background Decorative Line */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <CheckCircle2 size={120} />
            </div>
        </motion.div>
    );
}
