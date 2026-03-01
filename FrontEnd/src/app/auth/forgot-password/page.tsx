"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { Zap, Mail, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, RefreshCcw } from "lucide-react";

type Stage = "email" | "sent" | "reset" | "success";

export default function ForgotPasswordPage() {
    const [stage, setStage] = useState<Stage>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStage("sent");
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 6) return;
        setStage("reset");
    };

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }
        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters.");
            return;
        }
        setPasswordError("");
        setStage("success");
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

            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-[35vw] h-[35vw] bg-saffron/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-1/4 w-[28vw] h-[28vw] bg-green-bharat/10 blur-[100px] rounded-full"
                />
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
                        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                            {stage === "success" ? "Access Restored" : "Recover Access"}
                        </h1>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                            {stage === "email" && "NEURAL CREDENTIAL RESET PROTOCOL"}
                            {stage === "sent" && "OTP VERIFICATION SEQUENCE"}
                            {stage === "reset" && "NEW SECRET KEY INITIALIZATION"}
                            {stage === "success" && "COMMAND PROTOCOL RESTORED"}
                        </p>
                    </div>

                    {/* Progress Nodes */}
                    {stage !== "success" && (
                        <div className="flex items-center gap-2 mb-10 justify-center">
                            {[
                                { key: "email", label: "Identify" },
                                { key: "sent", label: "Verify" },
                                { key: "reset", label: "Reset" },
                            ].map((s, i) => {
                                const stages: Stage[] = ["email", "sent", "reset"];
                                const currentIdx = stages.indexOf(stage);
                                const nodeIdx = stages.indexOf(s.key as Stage);
                                const isDone = nodeIdx < currentIdx;
                                const isActive = nodeIdx === currentIdx;

                                return (
                                    <div key={s.key} className="flex items-center gap-2">
                                        <div className={`flex flex-col items-center gap-1`}>
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 ${isDone
                                                ? "bg-green-bharat text-white"
                                                : isActive
                                                    ? "bg-saffron text-white shadow-[0_0_12px_rgba(255,153,51,0.5)]"
                                                    : "bg-white/5 border border-white/10 text-white/20"
                                                }`}>
                                                {isDone ? <CheckCircle2 size={14} /> : i + 1}
                                            </div>
                                            <span className={`text-[8px] uppercase tracking-widest font-black ${isActive ? "text-saffron" : isDone ? "text-green-bharat" : "text-white/20"}`}>
                                                {s.label}
                                            </span>
                                        </div>
                                        {i < 2 && (
                                            <div className={`w-12 h-px mb-5 transition-all duration-500 ${nodeIdx < currentIdx ? "bg-green-bharat" : "bg-white/10"}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Stage Content */}
                    <AnimatePresence mode="wait">

                        {/* Stage 1: Email Input */}
                        {stage === "email" && (
                            <motion.form
                                key="email"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-6"
                                onSubmit={handleSendEmail}
                            >
                                <div className="p-6 rounded-2xl bg-saffron/5 border border-saffron/20 text-sm text-white/60 leading-relaxed">
                                    Enter your registered email address. We will send a one-time verification code to restore your access.
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4">
                                        Registered Email
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 pl-16 pr-8 text-sm font-medium text-white focus:outline-none focus:bg-white/[0.08] focus:border-saffron/30 transition-all placeholder:text-white/10"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button type="submit" variant="saffron" size="lg" className="w-full">
                                    Send Recovery Code
                                    <ArrowRight size={18} />
                                </Button>

                                <div className="text-center">
                                    <Link href="/auth/login" className="flex items-center justify-center gap-2 text-[10px] font-bold text-white/30 hover:text-white uppercase tracking-widest transition-colors">
                                        <ArrowLeft size={12} />
                                        Back to Login
                                    </Link>
                                </div>
                            </motion.form>
                        )}

                        {/* Stage 2: OTP */}
                        {stage === "sent" && (
                            <motion.form
                                key="sent"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-6"
                                onSubmit={handleVerifyOtp}
                            >
                                <div className="flex items-center gap-4 p-6 rounded-2xl bg-green-bharat/5 border border-green-bharat/20">
                                    <ShieldCheck className="text-green-bharat flex-shrink-0" size={22} />
                                    <p className="text-sm text-white/60 leading-relaxed">
                                        A 6-digit neural key was sent to <span className="text-white font-bold">{email}</span>. Enter it below.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4">
                                        6-Digit OTP Key
                                    </label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/, "").slice(0, 6))}
                                        placeholder="_ _ _ _ _ _"
                                        maxLength={6}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 px-8 text-2xl font-black text-white text-center tracking-[0.5em] focus:outline-none focus:bg-white/[0.08] focus:border-saffron/30 transition-all placeholder:text-white/10 placeholder:tracking-widest"
                                        required
                                    />
                                </div>

                                <Button type="submit" variant="saffron" size="lg" className="w-full" disabled={otp.length < 6}>
                                    Verify Key
                                    <ArrowRight size={18} />
                                </Button>

                                <button type="button" onClick={() => setStage("email")} className="flex items-center justify-center gap-2 text-[10px] font-bold text-saffron/60 hover:text-saffron uppercase tracking-widest transition-colors">
                                    <RefreshCcw size={12} />
                                    Resend OTP
                                </button>
                            </motion.form>
                        )}

                        {/* Stage 3: Reset Password */}
                        {stage === "reset" && (
                            <motion.form
                                key="reset"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col gap-6"
                                onSubmit={handleResetPassword}
                            >
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4">New Secret Key</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="New Password (min. 8 chars)"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 px-8 text-sm font-medium text-white focus:outline-none focus:bg-white/[0.08] focus:border-saffron/30 transition-all placeholder:text-white/10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-4">Confirm Secret Key</label>
                                    <div className="relative group">
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Re-enter Password"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-3xl py-5 px-8 text-sm font-medium text-white focus:outline-none focus:bg-white/[0.08] focus:border-saffron/30 transition-all placeholder:text-white/10"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password strength hints */}
                                <div className="px-2 space-y-1.5">
                                    {[
                                        { label: "At least 8 characters", met: newPassword.length >= 8 },
                                        { label: "Passwords match", met: newPassword === confirmPassword && newPassword.length > 0 },
                                    ].map((hint) => (
                                        <div key={hint.label} className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${hint.met ? "text-green-bharat" : "text-white/20"}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${hint.met ? "bg-green-bharat" : "bg-white/10"}`} />
                                            {hint.label}
                                        </div>
                                    ))}
                                </div>

                                {passwordError && (
                                    <p className="text-red-400 text-xs font-bold text-center px-2">{passwordError}</p>
                                )}

                                <Button type="submit" variant="saffron" size="lg" className="w-full">
                                    Initialize New Key
                                    <ShieldCheck size={18} />
                                </Button>
                            </motion.form>
                        )}

                        {/* Stage 4: Success */}
                        {stage === "success" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="flex flex-col items-center text-center gap-8"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                    className="w-24 h-24 rounded-3xl bg-green-bharat/10 border border-green-bharat/30 flex items-center justify-center shadow-[0_0_30px_rgba(19,136,8,0.2)]"
                                >
                                    <CheckCircle2 className="text-green-bharat" size={48} />
                                </motion.div>

                                <div>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-3">
                                        Access Restored!
                                    </h3>
                                    <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">
                                        Your new secret key has been successfully initialized. You can now log in with your new credentials.
                                    </p>
                                </div>

                                <div className="w-full space-y-4">
                                    <div className="p-4 rounded-2xl bg-green-bharat/5 border border-green-bharat/20 flex items-center gap-3">
                                        <ShieldCheck className="text-green-bharat flex-shrink-0" size={16} />
                                        <span className="text-[10px] font-black text-green-bharat uppercase tracking-widest">Neural Credential Sync Complete</span>
                                    </div>

                                    <Link href="/auth/login" className="block">
                                        <Button variant="saffron" size="lg" className="w-full">
                                            Return to Command Login
                                            <ArrowRight size={18} />
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </motion.div>

        </main>
    );
}
