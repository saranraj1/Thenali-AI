"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import LessonPanel from "@/components/learning/LessonPanel";
import FlashcardQuiz from "@/components/learning/FlashcardQuiz";
import VivaQuestion from "@/components/learning/VivaQuestion";
import CodePractice from "@/components/learning/CodePractice";
import NeuralVoiceInterface from "@/components/learning/NeuralVoiceInterface";
import SkillGapReport from "@/components/learning/SkillGapReport";
import ConceptEvaluation from "@/components/learning/ConceptEvaluation";
import ConceptSyncSuccess from "@/components/learning/ConceptSyncSuccess";
import RoadmapMastery from "@/components/learning/RoadmapMastery";
import ChatWindow from "@/components/chat/ChatWindow";
import useLearning from "@/hooks/useLearning";
import useChat from "@/hooks/useChat";
import Loader from "@/components/ui/Loader";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Zap,
    Brain,
    Terminal,
    ShieldCheck,
    BookOpen,
    Mic,
    ListChecks
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function LearningLessonPage() {
    const router = useRouter();
    const { currentLesson, loading, fetchLesson, roadmap } = useLearning();
    const { sendMessage } = useChat();
    const { t } = useLanguage();

    useEffect(() => {
        // Prefetch once on mount — router must NOT be in deps
        // (router is a new object every render → causes infinite loop)
        router.prefetch("/learning/dashboard");
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    const [activeStep, setActiveStep] = useState(1);
    const [isConceptFinished, setIsConceptFinished] = useState(false);
    const [isRoadmapCompleted, setIsRoadmapCompleted] = useState(false);
    const totalSteps = 5;

    useEffect(() => {
        fetchLesson("react-hooks");
    }, []);

    const handleVoiceInput = (text: string) => {
        sendMessage(text);
    };

    const nextStep = () => setActiveStep(prev => Math.min(prev + 1, totalSteps));
    const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

    // Simulation logic for roadmap completion
    const handleConceptComplete = () => {
        if (currentLesson?.id === "ecosystem-persistence") {
            setIsRoadmapCompleted(true);
        } else {
            setIsConceptFinished(true);
        }
    };

    if (loading && !currentLesson) return <PageContainer><Loader /></PageContainer>;

    const steps = [
        { id: 1, label: t("neural_overview"), icon: Brain },
        { id: 2, label: t("interactive_practice"), icon: Terminal },
        { id: 3, label: t("assessment_pulse"), icon: Zap },
        { id: 4, label: t("synthesis_report"), icon: ShieldCheck },
        { id: 5, label: t("concept_evaluation"), icon: ListChecks },
    ];

    return (
        <PageContainer>
            <AnimatePresence mode="wait">
                {isRoadmapCompleted ? (
                    <div className="max-w-4xl mx-auto py-20">
                        <RoadmapMastery
                            onReview={() => {
                                setIsRoadmapCompleted(false);
                                setActiveStep(1);
                            }}
                        />
                    </div>
                ) : isConceptFinished ? (
                    <div className="max-w-4xl mx-auto py-20">
                        <ConceptSyncSuccess
                            conceptName={currentLesson?.title || "Neural Module"}
                            onNext={() => {
                                fetchLesson("ecosystem-persistence");
                                setActiveStep(1);
                                setIsConceptFinished(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            onReview={() => {
                                setIsConceptFinished(false);
                                setActiveStep(1);
                            }}
                        />
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* GUIDED HEADER */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4">
                            <div>
                                <h3 className="text-[10px] font-black text-saffron uppercase tracking-[0.4em] mb-2 italic flex items-center gap-2">
                                    <Sparkles size={12} className="animate-pulse" />
                                    {t("structured_training")}
                                </h3>
                                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                                    {currentLesson?.title || "Neural Module Sync"}
                                </h1>
                            </div>

                            {/* Step Progress Nodes */}
                            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 p-2 rounded-[2.5rem]">
                                {steps.map((step) => (
                                    <div key={step.id} className="flex items-center group">
                                        <button
                                            onClick={() => setActiveStep(step.id)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 relative ${activeStep === step.id
                                                ? "bg-white text-black shadow-xl"
                                                : activeStep > step.id
                                                    ? "bg-green-bharat/20 text-green-bharat border border-green-bharat/40"
                                                    : "text-white/20 hover:text-white/40"
                                                }`}
                                            title={step.label}
                                        >
                                            <step.icon size={16} />
                                            {activeStep === step.id && (
                                                <motion.div
                                                    layoutId="active-step-ring"
                                                    className="absolute -inset-1 rounded-full border border-white/20"
                                                />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32">
                            <div className="lg:col-span-8">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeStep}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                    >
                                        {activeStep === 1 && (
                                            <div className="space-y-8">
                                                <LessonPanel
                                                    title={currentLesson?.title}
                                                    content={currentLesson?.content}
                                                />

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="lovable-card p-10 bg-black/40 border-white/5 flex flex-col items-center justify-center text-center transition-all hover:border-green-bharat/30 group">
                                                        <div className="w-16 h-16 rounded-3xl bg-green-bharat/10 border border-green-bharat/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                                            <Mic className="text-green-bharat" size={28} />
                                                        </div>
                                                        <h4 className="text-xl font-black italic text-white uppercase tracking-tighter mb-2">{t("ask_ai_voice")}</h4>
                                                        <button
                                                            onClick={() => handleVoiceInput("Tell me more about this.")}
                                                            className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white/60 uppercase tracking-widest hover:bg-green-bharat hover:text-white transition-all mt-6"
                                                        >
                                                            {t("initialize_mic")}
                                                        </button>
                                                    </div>

                                                    <div className="lovable-card p-10 bg-white/[0.02] border border-white/5">
                                                        <div className="flex items-center gap-3 mb-8">
                                                            <BookOpen size={18} className="text-saffron" />
                                                            <h3 className="text-xs font-black text-white uppercase tracking-widest">{t("other_learning")}</h3>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {["State Lifecycle v2.0", "Ecosystem Persistence", "Mutation Boundaries"].map((item, i) => (
                                                                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4 group hover:border-saffron/30 transition-all cursor-pointer">
                                                                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-saffron/10 group-hover:text-saffron transition-colors text-white/20">
                                                                        <Terminal size={12} />
                                                                    </div>
                                                                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">{item}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeStep === 2 && (
                                            <div className="space-y-8">
                                                <div className="flex items-center justify-between mb-4 px-4">
                                                    <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">
                                                        Interactive <span className="lovable-text-gradient">Sandbox</span>
                                                    </h3>
                                                    <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">Mastery Practice Active</div>
                                                </div>
                                                <CodePractice initialCode={currentLesson?.practice_code} />
                                            </div>
                                        )}

                                        {activeStep === 3 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <FlashcardQuiz question={currentLesson?.quiz_question} />
                                                <VivaQuestion question={currentLesson?.viva_question} />
                                            </div>
                                        )}

                                        {activeStep === 4 && (
                                            <SkillGapReport onNext={nextStep} />
                                        )}

                                        {activeStep === 5 && (
                                            <ConceptEvaluation
                                                conceptName={currentLesson?.title || "Neural Module"}
                                                onComplete={handleConceptComplete}
                                            />
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation Guards */}
                                <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-center px-4">
                                    <button
                                        onClick={prevStep}
                                        disabled={activeStep === 1}
                                        className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] transition-all ${activeStep === 1 ? "text-white/5 cursor-not-allowed" : "text-white/30 hover:text-white"
                                            }`}
                                    >
                                        <ChevronLeft size={16} />
                                        {t("re_sync_previous")}
                                    </button>

                                    <button
                                        onClick={nextStep}
                                        disabled={activeStep === totalSteps}
                                        className={`px-12 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center gap-4 bg-saffron text-white shadow-2xl shadow-saffron/20 hover:scale-105 active:scale-95 ${activeStep === totalSteps ? "opacity-20 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        {activeStep === totalSteps ? t("initialize_final_sync") : t("initialize_next_sync")}
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-8">
                                <div className="lovable-card p-10 bg-white/[0.02] border border-white/5">
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8">{t("ai_sync")}</h3>
                                    <ChatWindow />
                                </div>

                                {isRoadmapCompleted === false && isConceptFinished === false && (
                                    <div className="p-8 rounded-[2rem] bg-orange-500/10 border border-orange-500/20">
                                        <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-4">{t("journey_alert")}</h4>
                                        <p className="text-xs text-white/40 leading-relaxed italic">
                                            {t("roadmap_incomplete")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageContainer>
    );
}