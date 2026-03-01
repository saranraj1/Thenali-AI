"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitMerge, Plus, Check, Clock, ExternalLink, ChevronDown, ChevronUp, Send } from "lucide-react";

type ContributionEntry = {
    id: string;
    repo: string;
    type: "PR Merged" | "Issue Fixed" | "Documentation" | "Review" | "Feature";
    date: string;
    url?: string;
    status: "merged" | "open" | "closed";
    note?: string;
};

const TYPE_COLORS: Record<string, string> = {
    "PR Merged": "text-green-bharat bg-green-bharat/10 border-green-bharat/20",
    "Issue Fixed": "text-blue-400 bg-blue-400/10 border-blue-400/20",
    "Documentation": "text-white/40 bg-white/5 border-white/10",
    "Review": "text-purple-400 bg-purple-400/10 border-purple-400/20",
    "Feature": "text-saffron bg-saffron/10 border-saffron/20",
};

const STATUS_COLORS: Record<string, string> = {
    merged: "text-green-bharat",
    open: "text-saffron",
    closed: "text-red-400",
};

import type { ContributionHistoryItem } from "@/hooks/useContribution";

const CONTRIBUTION_TYPES = ["PR Merged", "Issue Fixed", "Documentation", "Review", "Feature"] as const;

type Props = {
    history?: ContributionHistoryItem[];
};

export default function ContributionHistory({ history = [] }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [synced, setSynced] = useState(false);

    // Form state
    const [form, setForm] = useState({ repo: "", type: "PR Merged" as ContributionEntry["type"], date: "", url: "", note: "" });

    const handleAdd = () => {
        if (!form.repo || !form.date) return;
        const entry: ContributionEntry = {
            id: `c${Date.now()}`,
            repo: form.repo,
            type: form.type,
            date: form.date,
            url: form.url || undefined,
            status: form.type === "PR Merged" ? "merged" : form.type === "Issue Fixed" ? "closed" : "open",
            note: form.note || undefined,
        };
        // We aren't doing direct local saves in this demo but 
        // normally we would POST here.
        // setHistory(prev => [entry, ...prev]);
        setForm({ repo: "", type: "PR Merged", date: "", url: "", note: "" });
        setShowForm(false);
    };

    const handleSyncToServer = async () => {
        setSyncing(true);
        // Simulate server call — replace with real API when backend is ready
        await new Promise(r => setTimeout(r, 1200));
        setSyncing(false);
        setSynced(true);
        setTimeout(() => setSynced(false), 3000);
    };

    return (
        <div className="lovable-card p-8 bg-gradient-to-br from-white/[0.03] to-transparent border-white/5">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center">
                        <GitMerge size={18} className="text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Contribution History</h3>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-0.5">{history.length} contributions logged</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Sync button */}
                    <button
                        onClick={handleSyncToServer}
                        disabled={syncing}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${synced
                            ? "bg-green-bharat/10 border-green-bharat/30 text-green-bharat"
                            : "bg-white/[0.03] border-white/10 text-white/30 hover:border-saffron/30 hover:text-saffron"
                            }`}
                    >
                        {syncing ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                <Send size={12} />
                            </motion.div>
                        ) : synced ? (
                            <Check size={12} />
                        ) : (
                            <Send size={12} />
                        )}
                        {syncing ? "Syncing..." : synced ? "Synced!" : "Sync to Server"}
                    </button>

                    {/* Add button */}
                    <button
                        onClick={() => setShowForm(v => !v)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-saffron/10 border border-saffron/30 text-saffron text-[9px] font-black uppercase tracking-widest hover:bg-saffron/20 transition-all"
                    >
                        <Plus size={12} />
                        Log
                    </button>
                </div>
            </div>

            {/* Add form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-5"
                    >
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Log New Contribution</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    value={form.repo}
                                    onChange={e => setForm(f => ({ ...f, repo: e.target.value }))}
                                    placeholder="owner/repo-name"
                                    className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-saffron/40 transition-all"
                                />
                                <select
                                    value={form.type}
                                    onChange={e => setForm(f => ({ ...f, type: e.target.value as ContributionEntry["type"] }))}
                                    className="bg-[#0d0f11] border border-white/10 rounded-xl px-4 py-3 text-xs text-white/70 focus:outline-none focus:border-saffron/40 transition-all"
                                >
                                    {CONTRIBUTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                    className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white/70 focus:outline-none focus:border-saffron/40 transition-all"
                                />
                                <input
                                    value={form.url}
                                    onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                                    placeholder="GitHub PR/Issue URL (optional)"
                                    className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-saffron/40 transition-all"
                                />
                                <input
                                    value={form.note}
                                    onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                                    placeholder="Short note (optional)"
                                    className="sm:col-span-2 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/15 focus:outline-none focus:border-saffron/40 transition-all"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleAdd}
                                    disabled={!form.repo || !form.date}
                                    className="flex-1 py-3 rounded-xl bg-saffron text-white text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    Save Entry
                                </button>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/30 text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* History list */}
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                {history.length === 0 && (
                    <div className="text-center py-8 text-white/20 text-xs font-bold uppercase tracking-widest">
                        No contributions logged yet — click "Log" to add one
                    </div>
                )}
                {history.map((entry, i) => (
                    <motion.div
                        key={`${entry.repo}-${i}`}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                    >
                        {/* Type badge */}
                        <span className={`flex-shrink-0 text-[8px] font-black px-2 py-1 rounded-full border uppercase tracking-widest mt-0.5 ${TYPE_COLORS[entry.type]}`}>
                            {entry.type}
                        </span>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-black text-white truncate">{entry.repo}</p>
                                {false && (  // no url from backend right now
                                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-white/15 hover:text-saffron transition-colors flex-shrink-0">
                                        <ExternalLink size={11} />
                                    </a>
                                )}
                            </div>
                            {entry.description && <p className="text-[10px] text-white/30 mt-0.5 italic">{entry.description}</p>}
                        </div>

                        <div className="text-right flex-shrink-0">
                            <p className={`text-[9px] font-black uppercase tracking-widest ${STATUS_COLORS[entry.status]}`}>{entry.status}</p>
                            <p className="text-[9px] text-white/15 mt-0.5">{new Date(entry.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
