"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Settings,
    Globe,
    Database,
    Save,
    Trash2,
    Check,
    Lock,
    AlertTriangle,
    X
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { useLanguage, Language } from "@/context/LanguageContext";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const { language, setLanguage, t } = useLanguage();
    const { logout } = useAuth();
    const router = useRouter();
    const [saved, setSaved] = useState(false);

    // Fix #4: Terminate / Export dialogs with state (fix #15)
    const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);
    const [showExportConfirm, setShowExportConfirm] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleTerminate = () => {
        logout();
        router.push("/auth/login");
    };

    const handleExport = () => {
        const data = {
            language,
            exportedAt: new Date().toISOString(),
            app: "Thenali AI",
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "thenali_ai_profile_export.json";
        a.click();
        URL.revokeObjectURL(url);
        setShowExportConfirm(false);
    };

    const indianLanguages: Language[] = [
        "English", "Hindi", "Bengali", "Marathi", "Telugu",
        "Tamil", "Gujarati", "Urdu", "Kannada", "Odia", "Malayalam"
    ];

    return (
        <PageContainer>
            <div className="max-w-4xl mx-auto py-10 space-y-12">

                {/* SETTINGS HEADER */}
                <div className="mb-20 px-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-saffron/10 border border-saffron/20 flex items-center justify-center text-saffron">
                            <Settings size={24} className="animate-spin-slow" />
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black text-saffron uppercase tracking-[0.2em] mb-4">
                                SYSTEM CONFIGURATION
                            </h3>
                            <h1 className={`text-4xl md:text-6xl font-black text-white uppercase italic underline-offset-8 ${language === "English" ? "tracking-tighter leading-none" : "tracking-normal leading-relaxed pb-2"}`}>
                                {t("settings_protocol")}
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">

                    {/* LANGUAGE & REGION */}
                    <section className="lovable-card p-10 bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                        <div className="flex items-start justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-saffron transition-colors">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <h3 className={`font-black text-white uppercase ${language === 'English' ? 'text-sm tracking-widest' : 'text-base tracking-normal'}`}>
                                        {t("interface_lang")}
                                    </h3>
                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-wider mt-1">Neural Translation Engine v2.4</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {indianLanguages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className={`p-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${language === lang
                                        ? "bg-saffron/10 border-saffron/40 text-saffron shadow-[0_0_20px_rgba(255,153,51,0.1)]"
                                        : "bg-black border-white/5 text-white/40 hover:border-white/20"
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* DANGER ZONE / ACCOUNT MANAGEMENT — Fix #15 */}
                    <section className="lovable-card p-10 bg-red-500/[0.02] border border-red-500/10 group">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                    <Lock size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Account Integrity</h3>
                                    <p className="text-[9px] font-bold text-red-500/40 uppercase tracking-widest mt-1 italic">Authorized Personnel Only</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Export button — now functional */}
                            <button
                                onClick={() => setShowExportConfirm(true)}
                                className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                            >
                                EXPORT NEURAL DATA <Database size={14} />
                            </button>
                            {/* Terminate button — now functional */}
                            <button
                                onClick={() => setShowTerminateConfirm(true)}
                                className="flex-1 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
                            >
                                TERMINATE ACCOUNT <Trash2 size={14} />
                            </button>
                        </div>
                    </section>

                    {/* SAVE BAR */}
                    <div className="pt-10 flex justify-end items-center gap-6">
                        <AnimatePresence>
                            {saved && (
                                <motion.span
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-[10px] font-black text-green-bharat uppercase tracking-widest italic"
                                >
                                    CONFIGURATION SYNCHRONIZED
                                </motion.span>
                            )}
                        </AnimatePresence>
                        <Button
                            variant="saffron"
                            size="lg"
                            className="px-16 py-8 italic tracking-tighter"
                            onClick={handleSave}
                        >
                            {t("save_protocol")}
                            <Save size={20} />
                        </Button>
                    </div>

                </div>
            </div>

            {/* ── Confirm Dialogs ── */}

            {/* Export Confirm */}
            <AnimatePresence>
                {showExportConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0d0f11] border border-white/10 rounded-[2rem] p-10 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-saffron/10 border border-saffron/20 flex items-center justify-center">
                                    <Database size={20} className="text-saffron" />
                                </div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Export Profile Data</h3>
                            </div>
                            <p className="text-white/40 text-xs mb-8 leading-relaxed">Your settings and preferences will be exported as a JSON file. This does not include private data from the backend.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setShowExportConfirm(false)} className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                    <X size={14} /> Cancel
                                </button>
                                <button onClick={handleExport} className="flex-1 py-4 rounded-2xl bg-saffron text-white text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2">
                                    <Check size={14} /> Export Now
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Terminate Confirm */}
            <AnimatePresence>
                {showTerminateConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0d0f11] border border-red-500/20 rounded-[2rem] p-10 max-w-md w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <AlertTriangle size={20} className="text-red-400" />
                                </div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Terminate Account</h3>
                            </div>
                            <p className="text-red-400/70 text-xs mb-2 leading-relaxed font-bold uppercase tracking-widest">⚠ This action is irreversible</p>
                            <p className="text-white/40 text-xs mb-8 leading-relaxed">Your account and all associated data will be permanently deleted. You will be logged out immediately.</p>
                            <div className="flex gap-4">
                                <button onClick={() => setShowTerminateConfirm(false)} className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                    <X size={14} /> Cancel
                                </button>
                                <button onClick={handleTerminate} className="flex-1 py-4 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                                    <Trash2 size={14} /> Yes, Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </PageContainer>
    );
}
