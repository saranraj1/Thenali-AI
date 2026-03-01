"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Target, BookOpen, CheckCircle2, XCircle, ChevronRight, Loader2,
    AlertTriangle, RotateCcw, LayoutDashboard, Sparkles, ArrowRight,
    Trophy, TrendingUp, Brain,
} from "lucide-react";
import useAssessment from "@/hooks/useAssessment";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
    /** repo_id from the analyzed repository */
    repoId?: string | null;
    /** Display name of the repo */
    repoName?: string;
    /** Tech-stack array from intelligence data */
    techStack?: string[];
    /** Switches the parent page back to the Overview tab */
    onBackToOverview?: () => void;
    // Legacy props — ignored but kept so existing callers don't break
    questions?: any[];
    skipTopic?: boolean;
    initialTopic?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NUM_OPTIONS = [3, 5, 10] as const;

function scoreColor(pct: number) {
    if (pct >= 80) return "text-green-400";
    if (pct >= 60) return "text-yellow-400";
    return "text-red-400";
}

function scoreBg(pct: number) {
    if (pct >= 80) return "bg-green-400/10 border-green-400/30";
    if (pct >= 60) return "bg-yellow-400/10 border-yellow-400/30";
    return "bg-red-400/10 border-red-400/30";
}

// Letter prefix from backend options like "A) text" → "A"
function optionLetter(opt: string) {
    return opt.charAt(0);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function RepoAssessment({
    repoId,
    repoName,
    techStack = [],
    onBackToOverview,
}: Props) {
    const ass = useAssessment();

    // Topic dropdown local state (pre-filled from tech stack)
    const defaultTopic = techStack[0] || "";
    const [selectedTopic, setSelectedTopic] = useState(defaultTopic || ass.topic || "");
    const [numQuestions, setNumQuestions] = useState<3 | 5 | 10>(5);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    // ── No repo loaded ────────────────────────────────────────────────────────
    if (!repoId) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[500px] w-full flex flex-col items-center justify-center p-20 bg-white/[0.03] border border-white/10 rounded-[40px] border-dashed text-center"
            >
                <div className="w-24 h-24 rounded-[32px] bg-white/5 text-white/10 flex items-center justify-center mb-10">
                    <Target size={36} />
                </div>
                <h2 className="text-4xl font-extrabold italic text-white/20 mb-6 uppercase tracking-tighter">
                    Target Identification Required
                </h2>
                <p className="text-white/10 text-lg max-w-lg mb-10 font-medium leading-relaxed">
                    Please synchronize a repository in the Overview tab to begin your assessment.
                </p>
                {onBackToOverview && (
                    <button
                        onClick={onBackToOverview}
                        className="flex items-center gap-3 px-8 py-3 rounded-full bg-saffron/10 border border-saffron/30 text-[11px] font-black text-saffron uppercase tracking-widest hover:bg-saffron hover:text-white transition-all"
                    >
                        <LayoutDashboard size={14} /> Go to Overview
                    </button>
                )}
            </motion.div>
        );
    }

    // ── SCREEN 1 — READY CHECK ────────────────────────────────────────────────
    if (ass.screen === "setup") {
        const topicOptions = [
            ...(techStack.length > 0 ? techStack : []),
            "General Programming",
        ].filter((v, i, a) => a.indexOf(v) === i); // dedupe

        return (
            <motion.div
                key="screen-ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto"
            >
                <div className="lovable-card p-10 md:p-16 bg-black/40 border-white/5 rounded-[48px] relative overflow-hidden">
                    {/* BG watermark */}
                    <div className="absolute top-0 right-0 p-12 pr-16 opacity-[0.025] pointer-events-none">
                        <BookOpen size={200} />
                    </div>

                    {/* Header */}
                    <div className="flex items-center gap-5 mb-10 relative z-10">
                        <div className="w-14 h-14 rounded-[18px] bg-saffron/10 border border-saffron/20 flex items-center justify-center shrink-0">
                            <Target className="text-saffron" size={26} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-widest leading-none">
                                Repository Assessment
                            </h2>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mt-2">
                                AI-generated questions from repo intelligence
                            </p>
                        </div>
                    </div>

                    {/* Repo + tech-stack */}
                    <div className="mb-10 p-6 bg-white/[0.03] border border-white/5 rounded-3xl relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                            <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">
                                Active Repository Synchronized
                            </span>
                        </div>
                        <p className="text-lg font-black text-white uppercase tracking-tight mb-4">
                            {repoName || "Repository"}
                        </p>
                        {techStack.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {techStack.map((tech, i) => (
                                    <span
                                        key={i}
                                        className="px-4 py-1.5 rounded-full bg-saffron/10 border border-saffron/20 text-[10px] font-bold text-saffron uppercase tracking-widest"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Topic select */}
                    <div className="mb-8 relative z-10">
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">
                            Topic to Assess
                        </label>
                        {topicOptions.length > 0 ? (
                            <select
                                value={selectedTopic}
                                onChange={e => setSelectedTopic(e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-bold focus:outline-none focus:border-saffron/50 transition-all appearance-none cursor-pointer"
                            >
                                {topicOptions.map((t, i) => (
                                    <option key={i} value={t} className="bg-[#0d0f11]">
                                        {t}
                                    </option>
                                ))}
                                <option value="__custom__" className="bg-[#0d0f11]">
                                    ✏️ Enter custom topic...
                                </option>
                            </select>
                        ) : (
                            <input
                                type="text"
                                placeholder="e.g. Java, Python, React..."
                                value={selectedTopic}
                                onChange={e => setSelectedTopic(e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-bold placeholder:text-white/20 focus:outline-none focus:border-saffron/50 transition-all"
                            />
                        )}
                        {selectedTopic === "__custom__" && (
                            <input
                                type="text"
                                placeholder="Enter topic..."
                                className="w-full mt-3 bg-white/[0.04] border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-bold placeholder:text-white/20 focus:outline-none focus:border-saffron/50 transition-all"
                                onChange={e => setSelectedTopic(e.target.value || "__custom__")}
                            />
                        )}
                    </div>

                    {/* Num questions */}
                    <div className="mb-10 relative z-10">
                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">
                            Number of Questions
                        </label>
                        <div className="flex gap-3">
                            {NUM_OPTIONS.map(n => (
                                <button
                                    key={n}
                                    onClick={() => setNumQuestions(n)}
                                    className={`flex-1 py-3 rounded-2xl text-sm font-black uppercase tracking-widest border transition-all ${numQuestions === n
                                        ? "bg-saffron text-white border-saffron shadow-lg shadow-saffron/30"
                                        : "bg-white/[0.03] text-white/40 border-white/10 hover:border-white/30 hover:text-white"
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error */}
                    {ass.error && (
                        <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl relative z-10">
                            <AlertTriangle size={16} className="text-red-400 shrink-0" />
                            <p className="text-sm text-red-300">{ass.error}</p>
                        </div>
                    )}

                    {/* Divider + prompt */}
                    <div className="border-t border-white/5 pt-8 relative z-10">
                        <p className="text-center text-[11px] font-bold text-white/30 uppercase tracking-[0.3em] mb-8">
                            Are you ready to begin your repository assessment?
                        </p>

                        <div className="flex gap-4">
                            {onBackToOverview && (
                                <button
                                    onClick={onBackToOverview}
                                    className="flex-1 py-4 rounded-2xl border border-white/10 text-[11px] font-black text-white/30 uppercase tracking-widest hover:text-white hover:border-white/30 transition-all"
                                >
                                    Not Now
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    const topic = selectedTopic === "__custom__" ? "" : selectedTopic;
                                    ass.startAssessment(topic || "General Programming", numQuestions);
                                }}
                                disabled={ass.isLoading || !selectedTopic || selectedTopic === "__custom__"}
                                className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-saffron text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-saffron/30 hover:shadow-saffron/50 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                            >
                                {ass.isLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Generating AI Questions...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={16} />
                                        I&apos;m Ready — Begin
                                        <ChevronRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // ── SCREEN 2 — ACTIVE QUIZ ────────────────────────────────────────────────
    if (ass.screen === "active" && ass.questions.length > 0) {
        const q = ass.questions[ass.currentQuestionIndex];
        const isLast = ass.currentQuestionIndex >= ass.questions.length - 1;
        const progress = Math.round(((ass.currentQuestionIndex) / ass.questions.length) * 100);
        const hasFeedback = !!ass.currentFeedback;

        return (
            <motion.div
                key="screen-active"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="max-w-3xl mx-auto"
            >
                <div className="lovable-card p-10 md:p-14 bg-black/40 border-white/5 rounded-[48px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 pr-16 opacity-[0.025] pointer-events-none">
                        <Brain size={200} />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">
                                Assessment In Progress
                            </p>
                            <p className="text-sm font-black text-white mt-1 uppercase tracking-widest">
                                Question {ass.currentQuestionIndex + 1} of {ass.questions.length}
                                {q.topic && (
                                    <span className="text-saffron"> · {q.topic}</span>
                                )}
                            </p>
                        </div>
                        {q.difficulty && (
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${q.difficulty === "easy"
                                ? "bg-green-400/10 border-green-400/30 text-green-400"
                                : q.difficulty === "hard"
                                    ? "bg-red-400/10 border-red-400/30 text-red-400"
                                    : "bg-saffron/10 border-saffron/30 text-saffron"
                                }`}>
                                {q.difficulty}
                            </span>
                        )}
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-white/10 rounded-full mb-10 relative z-10 overflow-hidden">
                        <motion.div
                            className="h-full bg-saffron rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    {/* Question */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="relative z-10"
                        >
                            <div className="mb-8 p-7 bg-white/[0.03] border-l-4 border-saffron rounded-r-3xl">
                                <p className="text-xl font-extrabold text-white italic leading-relaxed tracking-tight">
                                    &quot;{q.question}&quot;
                                </p>
                            </div>

                            {/* Options */}
                            <div className="space-y-3 mb-8">
                                {(q.options || []).map((opt: string, i: number) => {
                                    const letter = optionLetter(opt);
                                    const isSelected = selectedOption === opt;
                                    const feedbackCorrect = ass.currentFeedback?.is_correct;
                                    const correctLetter = ass.currentFeedback
                                        ? (q.correct_answer || "")
                                        : null;
                                    const isCorrectOpt = correctLetter && letter === correctLetter;

                                    let optStyle =
                                        "bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.07] hover:border-white/30 hover:text-white cursor-pointer";

                                    if (!hasFeedback && isSelected) {
                                        optStyle = "bg-saffron/20 border-saffron text-white cursor-pointer";
                                    } else if (hasFeedback) {
                                        if (isCorrectOpt) {
                                            optStyle = "bg-green-400/20 border-green-400 text-green-300 cursor-default";
                                        } else if (isSelected && !feedbackCorrect) {
                                            optStyle = "bg-red-400/20 border-red-400 text-red-300 cursor-default";
                                        } else {
                                            optStyle = "bg-white/[0.02] border-white/5 text-white/30 cursor-default";
                                        }
                                    }

                                    return (
                                        <button
                                            key={i}
                                            disabled={hasFeedback || ass.isSubmittingAnswer}
                                            onClick={() => setSelectedOption(opt)}
                                            className={`w-full text-left px-6 py-4 rounded-2xl border transition-all duration-200 text-sm font-bold flex items-center gap-4 ${optStyle}`}
                                        >
                                            <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-black shrink-0">
                                                {letter}
                                            </span>
                                            <span>{opt.slice(2).trim()}</span>
                                            {hasFeedback && isCorrectOpt && (
                                                <CheckCircle2 size={16} className="ml-auto text-green-400 shrink-0" />
                                            )}
                                            {hasFeedback && isSelected && !feedbackCorrect && (
                                                <XCircle size={16} className="ml-auto text-red-400 shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Feedback panel */}
                            <AnimatePresence>
                                {hasFeedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        className={`mb-6 p-5 rounded-2xl border ${ass.currentFeedback!.is_correct
                                            ? "bg-green-400/10 border-green-400/30"
                                            : "bg-red-400/10 border-red-400/30"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            {ass.currentFeedback!.is_correct
                                                ? <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                                                : <XCircle size={16} className="text-red-400 shrink-0" />
                                            }
                                            <span className={`text-xs font-black uppercase tracking-widest ${ass.currentFeedback!.is_correct ? "text-green-400" : "text-red-400"}`}>
                                                {ass.currentFeedback!.is_correct ? "Correct!" : "Incorrect"}
                                                {" "}· {ass.currentFeedback!.score ?? 0} pts
                                            </span>
                                        </div>
                                        <p className="text-sm text-white/70 leading-relaxed">
                                            {ass.currentFeedback!.detailed_feedback || ass.currentFeedback!.feedback}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Error */}
                            {ass.error && !hasFeedback && (
                                <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl">
                                    <AlertTriangle size={16} className="text-red-400 shrink-0" />
                                    <p className="text-sm text-red-300">{ass.error}</p>
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex items-center justify-between gap-4">
                                <button
                                    onClick={() => ass.skipQuestion()}
                                    className="px-6 py-3 rounded-2xl border border-white/10 text-[10px] font-black text-white/30 uppercase tracking-widest hover:text-white hover:border-white/30 transition-all"
                                >
                                    Skip
                                </button>

                                {!hasFeedback ? (
                                    <button
                                        disabled={!selectedOption || ass.isSubmittingAnswer}
                                        onClick={() => {
                                            if (selectedOption) {
                                                ass.submitAnswer(q.id, selectedOption);
                                            }
                                        }}
                                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-saffron text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-saffron/30 hover:shadow-saffron/50 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                                    >
                                        {ass.isSubmittingAnswer ? (
                                            <>
                                                <Loader2 size={15} className="animate-spin" />
                                                AI Evaluating...
                                            </>
                                        ) : (
                                            <>
                                                Submit Answer
                                                <ArrowRight size={15} />
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setSelectedOption(null);
                                            if (isLast) {
                                                if (ass.assessmentId) ass.fetchResults(ass.assessmentId);
                                            } else {
                                                // useAssessment auto-advances on feedback, but allow manual
                                            }
                                        }}
                                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-saffron text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-saffron/30 transition-all"
                                    >
                                        {isLast ? (
                                            <>
                                                <Trophy size={15} />
                                                Finish Assessment
                                            </>
                                        ) : (
                                            <>
                                                Next Question
                                                <ChevronRight size={15} />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        );
    }

    // ── SCREEN 3 — LOADING RESULTS ────────────────────────────────────────────
    if (ass.screen === "results" && ass.isLoading) {
        return (
            <motion.div
                key="screen-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[500px] w-full flex flex-col items-center justify-center"
            >
                <div className="w-20 h-20 border-4 border-t-saffron border-r-transparent border-b-green-400 border-l-transparent rounded-full animate-spin mb-8 shadow-[0_0_40px_rgba(255,153,51,0.2)]" />
                <p className="text-sm font-black text-white/40 tracking-[0.4em] uppercase animate-pulse">
                    Analyzing Your Performance...
                </p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-4">
                    Calculating scores and skill gaps
                </p>
            </motion.div>
        );
    }

    // ── SCREEN 4 — RESULTS ────────────────────────────────────────────────────
    if (ass.screen === "results" && !ass.isLoading) {
        const r = ass.results;
        const pct = r?.percentage ?? 0;
        const passed = r?.passed ?? false;

        // Collect skill gaps and strengths from all answer evaluations
        const allGaps: string[] = [];
        const allStrengths: string[] = [];
        const allConcepts: string[] = [];
        r?.answers?.forEach(a => {
            const ev = a.evaluation;
            if (ev?.skill_gaps) allGaps.push(...ev.skill_gaps);
            if (ev?.strengths) allStrengths.push(...ev.strengths);
            if (ev?.concepts_to_study) allConcepts.push(...ev.concepts_to_study);
        });
        const uniqueGaps = [...new Set(allGaps)].slice(0, 6);
        const uniqueStrengths = [...new Set(allStrengths)].slice(0, 6);
        const uniqueConcepts = [...new Set(allConcepts)].slice(0, 6);

        return (
            <motion.div
                key="screen-results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="max-w-3xl mx-auto space-y-6"
            >
                {/* Score card */}
                <div className={`lovable-card p-10 md:p-14 rounded-[40px] border text-center relative overflow-hidden ${scoreBg(pct)}`}>
                    <div className="absolute top-0 right-0 p-12 pr-16 opacity-[0.05] pointer-events-none">
                        <Trophy size={200} />
                    </div>

                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-6">
                        Assessment Complete
                    </p>

                    <div className={`text-8xl font-black leading-none mb-4 ${scoreColor(pct)}`}>
                        {Math.round(pct)}%
                    </div>

                    <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border mb-8 ${passed
                        ? "bg-green-400/10 border-green-400/30 text-green-400"
                        : "bg-yellow-400/10 border-yellow-400/30 text-yellow-400"
                        }`}>
                        {passed ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                        {passed ? "Passed" : "Needs Improvement"}
                    </div>

                    <div className="flex justify-center gap-8 text-center mb-8">
                        <div>
                            <p className="text-2xl font-black text-white">{r?.total_score ?? 0}</p>
                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Total Points</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div>
                            <p className="text-2xl font-black text-white">{r?.max_score ?? 0}</p>
                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Max Points</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div>
                            <p className="text-2xl font-black text-white">{r?.questions?.length ?? ass.questions.length}</p>
                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Questions</p>
                        </div>
                    </div>

                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest">
                        Topic: <span className="text-white">{r?.topic || ass.topic}</span>
                    </p>
                </div>

                {/* Question review */}
                {r?.answers && r.answers.length > 0 && (
                    <div className="lovable-card p-8 md:p-10 rounded-[32px] bg-black/30 border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-saffron rounded-full" />
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">
                                Question Review
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {r.answers.map((a, i) => {
                                const ev = a.evaluation;
                                const correct = ev?.is_correct ?? false;
                                const qText = r.questions?.[i]?.question || `Question ${i + 1}`;
                                return (
                                    <div
                                        key={a.question_id}
                                        className={`p-5 rounded-2xl border ${correct
                                            ? "bg-green-400/5 border-green-400/20"
                                            : "bg-red-400/5 border-red-400/20"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            {correct
                                                ? <CheckCircle2 size={15} className="text-green-400 shrink-0 mt-0.5" />
                                                : <XCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                                            }
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-black text-white/60 uppercase tracking-widest mb-1">
                                                    Q{i + 1} · {correct ? "Correct" : "Incorrect"} · {ev?.score ?? 0} pts
                                                </p>
                                                <p className="text-sm text-white font-medium leading-snug">{qText}</p>
                                            </div>
                                        </div>
                                        <div className="ml-6 space-y-1">
                                            <p className="text-[10px] text-white/40">
                                                <span className="font-black text-white/30">Your answer: </span>
                                                {a.answer}
                                            </p>
                                            {!correct && ev?.correct_answer && (
                                                <p className="text-[10px] text-green-400/80">
                                                    <span className="font-black">Correct: </span>
                                                    {ev.correct_answer}
                                                </p>
                                            )}
                                            {ev?.feedback && (
                                                <p className="text-[10px] text-white/30 italic mt-2 leading-relaxed">
                                                    {ev.feedback}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Skill analysis */}
                {(uniqueStrengths.length > 0 || uniqueGaps.length > 0 || uniqueConcepts.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {uniqueStrengths.length > 0 && (
                            <div className="lovable-card p-6 rounded-[24px] bg-green-400/5 border-green-400/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <CheckCircle2 size={14} className="text-green-400" />
                                    <h4 className="text-[10px] font-black text-green-400 uppercase tracking-widest">Strengths</h4>
                                </div>
                                <ul className="space-y-2">
                                    {uniqueStrengths.map((s, i) => (
                                        <li key={i} className="text-[11px] font-bold text-white/60 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 shrink-0" />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {uniqueGaps.length > 0 && (
                            <div className="lovable-card p-6 rounded-[24px] bg-yellow-400/5 border-yellow-400/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <AlertTriangle size={14} className="text-yellow-400" />
                                    <h4 className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Skill Gaps</h4>
                                </div>
                                <ul className="space-y-2">
                                    {uniqueGaps.map((g, i) => (
                                        <li key={i} className="text-[11px] font-bold text-white/60 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/60 shrink-0" />
                                            {g}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {uniqueConcepts.length > 0 && (
                            <div className="lovable-card p-6 rounded-[24px] bg-saffron/5 border-saffron/10">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp size={14} className="text-saffron" />
                                    <h4 className="text-[10px] font-black text-saffron uppercase tracking-widest">Study These</h4>
                                </div>
                                <ul className="space-y-2">
                                    {uniqueConcepts.map((c, i) => (
                                        <li key={i} className="text-[11px] font-bold text-white/60 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-saffron/60 shrink-0" />
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Error fallback */}
                {ass.error && (
                    <div className="flex items-center gap-3 p-5 bg-red-500/10 border border-red-500/30 rounded-2xl">
                        <AlertTriangle size={16} className="text-red-400 shrink-0" />
                        <p className="text-sm text-red-300">{ass.error}</p>
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-4 pt-2">
                    <button
                        onClick={() => {
                            ass.resetWithTopic(r?.topic || ass.topic || selectedTopic);
                            setSelectedOption(null);
                        }}
                        className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border border-white/10 text-[11px] font-black text-white/40 uppercase tracking-widest hover:text-white hover:border-white/30 transition-all"
                    >
                        <RotateCcw size={14} />
                        Try Again
                    </button>
                    <button
                        onClick={() => {
                            ass.resetAssessment();
                            setSelectedOption(null);
                            onBackToOverview?.();
                        }}
                        className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-saffron text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-saffron/20 hover:shadow-saffron/40 hover:-translate-y-0.5 transition-all"
                    >
                        <LayoutDashboard size={14} />
                        Back to Overview
                    </button>
                </div>
            </motion.div>
        );
    }

    // Fallback (shouldn't reach here)
    return null;
}
