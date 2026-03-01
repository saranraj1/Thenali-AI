"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { Zap, Mail, Lock, ArrowRight, X, ShieldCheck, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        if (!agreedToTerms) return;
        try {
            await login(email, password);
            router.push("/dashboard");
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 401 || status === 403) {
                setErrorMsg("Email or password is incorrect.");
            } else if (status === 422) {
                setErrorMsg("Invalid request. Please check your input.");
            } else if (status === 500) {
                setErrorMsg("Server error. Please try again.");
            } else if (!err.response) {
                setErrorMsg("Cannot connect to server.");
            } else {
                setErrorMsg(err.response?.data?.detail || err.message || "Login failed. Please try again.");
            }
        }
    };

    return (
        <main className="min-h-screen lovable-mesh flex items-center justify-center p-6 text-white relative">

            {/* Minimal Brand Header */}
            <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-saffron to-orange-400 flex items-center justify-center shadow-lg shadow-saffron/20">
                    <Zap size={14} className="text-white fill-white" />
                </div>
                <span className="text-sm font-black text-white tracking-tight">Thenali AI</span>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <Link href="/" className="text-[10px] font-bold text-white/30 hover:text-saffron uppercase tracking-widest transition-colors">
                    Home
                </Link>
            </header>

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[30vw] h-[30vw] bg-saffron/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-[25vw] h-[25vw] bg-green-bharat/10 blur-[100px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="lovable-card p-10 md:p-16 border-white/10">

                    {/* Brand Logo */}
                    <div className="flex flex-col items-center mb-12">
                        <div className="w-16 h-16 rounded-2xl bg-saffron flex items-center justify-center shadow-2xl shadow-saffron/20 mb-6">
                            <Zap size={32} className="text-white fill-white" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">{t("welcome_back")}</h1>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">{t("initialize_command_protocol")}</p>
                    </div>

                    {/* Login Form */}
                    <form className="flex flex-col gap-6" onSubmit={handleLogin}>

                        {errorMsg && (
                            <div className="bg-red-500/20 text-red-500 text-xs p-3 rounded-lg border border-red-500/50">
                                {errorMsg}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4">{t("authorized_identifier")}</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email or Username"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 pl-16 pr-8 text-sm font-medium text-white focus:outline-none focus:bg-white/[0.08] focus:border-saffron/30 transition-all placeholder:text-white/10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-4">
                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t("secret_key")}</label>
                                <Link href="/auth/forgot-password" className="text-[10px] font-bold text-saffron/60 hover:text-saffron uppercase tracking-widest transition-colors">{t("recover")}</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 pl-16 pr-8 text-sm font-medium text-white focus:outline-none focus:bg-white/[0.08] focus:border-saffron/30 transition-all placeholder:text-white/10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Terms & Conditions Checkbox */}
                        <div className="flex items-start gap-4 px-2">
                            <button
                                type="button"
                                onClick={() => setAgreedToTerms(!agreedToTerms)}
                                className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${agreedToTerms ? "bg-saffron border-saffron shadow-[0_0_10px_rgba(255,153,51,0.3)]" : "bg-white/5 border-white/10"}`}
                            >
                                {agreedToTerms && <Check size={12} className="text-white" strokeWidth={4} />}
                            </button>
                            <p className="text-[11px] font-medium text-white/40 leading-relaxed">
                                {t("confirm_adherence")}{" "}
                                <button type="button" onClick={() => setShowTerms(true)} className="text-saffron font-bold hover:underline transition-all">{t("bharat_ai_protocol")}</button>
                                {" "}{t("and_guidelines")}
                            </p>
                        </div>

                        {/* Login Button */}
                        <Button
                            type="submit"
                            variant="saffron"
                            size="lg"
                            className="w-full mt-2"
                            disabled={!agreedToTerms}
                        >
                            {t("access_grid")}
                            <ArrowRight size={18} />
                        </Button>

                    </form>

                    {/* Signup Redirect */}
                    <div className="mt-12 pt-8 border-t border-white/5 text-center">
                        <p className="text-sm text-white/30 font-medium">
                            {t("first_mission")}{" "}
                            <Link
                                href="/auth/signup"
                                className="text-saffron font-bold hover:underline transition-all"
                            >
                                {t("join_the_elite")}
                            </Link>
                        </p>
                    </div>

                </div>
            </motion.div>

            {/* TERMS MODAL */}
            <AnimatePresence>
                {showTerms && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowTerms(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-2xl lovable-card p-10 md:p-16 bg-black/90 border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setShowTerms(false)} className="p-2 rounded-full hover:bg-white/5 transition-colors text-white/20 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-saffron/10 border border-saffron/20 flex items-center justify-center">
                                    <ShieldCheck className="text-saffron" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">{t("bharat_ai_protocol")}</h2>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mt-2">{t("architectural_ethics")}</p>
                                </div>
                            </div>

                            <div className="space-y-8 max-h-[400px] overflow-y-auto pr-6 custom-scrollbar text-white/60 text-sm leading-relaxed">
                                <section className="space-y-3">
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-saffron" />
                                        01. Neural Respect
                                    </h3>
                                    <p>Users shall utilize the Thenali AI engine for constructive architectural exploration, skill advancement, and valid repository diagnostics. Malicious exploitation of the neural pathways is strictly prohibited.</p>
                                </section>

                                <section className="space-y-3">
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-saffron" />
                                        02. Data Privacy & IP
                                    </h3>
                                    <p>Repository data uploaded for analysis is processed solely for generating real-time insights. We claim no ownership over your intellectual property; your code remains your sovereign asset.</p>
                                </section>

                                <section className="space-y-3">
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-saffron" />
                                        03. Ecosystem Growth
                                    </h3>
                                    <p>By establishing a link, you become a node in the Bharat developer grid. Your progress contributes to a collective regional intelligence aimed at achieving global software excellence.</p>
                                </section>

                                <section className="space-y-3">
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-saffron" />
                                        04. Code Autonomy
                                    </h3>
                                    <p>AI-generated insights are provided as advanced technical guidance. The human operator retains final authority and responsibility over all deployments and architectural decisions.</p>
                                </section>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5">
                                <Button variant="saffron" className="w-full" onClick={() => { setAgreedToTerms(true); setShowTerms(false); }}>
                                    {t("accept_protocol")}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </main>
    );
}