"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Mail,
    Github,
    Award,
    TrendingUp,
    History,
    LogOut,
    Shield,
    Zap,
    Star,
    Terminal,
    Target,
    Activity,
    X,
    Check,
    Pencil,
    Camera,
    Loader
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import useAuth from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";
import apiClient from "@/services/apiClient";
import { profileService } from "@/services/profileService";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const { t } = useLanguage();

    // Profile data from backend
    const [profile, setProfile] = useState<any>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    // Repo history from backend
    const [repoHistory, setRepoHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    // Avatar state
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    // Username modal state
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [savedUsername, setSavedUsername] = useState(user?.name || "Neural Operator");

    useEffect(() => {
        // Load profile from GET /api/profile
        const loadProfile = async () => {
            setLoadingProfile(true);
            try {
                const { data } = await apiClient.get("/profile");
                setProfile(data);
                setSavedUsername(data.username || user?.name || "Neural Operator");
                setNewUsername(data.username || user?.name || "");
                if (data.avatar_url) setAvatarUrl(data.avatar_url);
            } catch {
                // Fall back to local auth user
                setSavedUsername(user?.name || "Neural Operator");
                setNewUsername(user?.name || "");
            } finally {
                setLoadingProfile(false);
            }
        };

        // Load repo history from GET /api/repos/history
        const loadHistory = async () => {
            setLoadingHistory(true);
            try {
                const { data } = await apiClient.get("/repos/history");
                setRepoHistory(Array.isArray(data) ? data : []);
            } catch {
                setRepoHistory([]);
            } finally {
                setLoadingHistory(false);
            }
        };

        loadProfile();
        loadHistory();
    }, []);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show local preview immediately
        const reader = new FileReader();
        reader.onload = () => setAvatarUrl(reader.result as string);
        reader.readAsDataURL(file);

        // Upload to backend POST /api/profile/avatar
        setUploadingAvatar(true);
        try {
            const result = await profileService.uploadAvatar(file);
            if (result.avatar_url) setAvatarUrl(result.avatar_url);
        } catch (err) {
            console.warn("Avatar upload failed:", err);
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const handleSaveUsername = () => {
        if (!newUsername.trim()) return;
        setSavedUsername(newUsername.trim());
        setShowUsernameModal(false);
    };

    // Build stats from real profile + dashboard data
    const stats = [
        {
            label: t("neural_sync"),
            value: profile?.system_exp ? `${Math.min(Math.round((profile.system_exp / 1000) * 100), 100)}%` : "—",
            color: "text-saffron",
            icon: Zap
        },
        {
            label: t("repo_pulse"),
            value: String(repoHistory.length || "0"),
            color: "text-green-bharat",
            icon: Activity
        },
        {
            label: t("architect_level"),
            value: profile?.rank || user?.rank || "—",
            color: "text-blue-400",
            icon: Award
        },
    ];

    return (
        <PageContainer>
            <div className="max-w-6xl mx-auto py-10 space-y-12">

                {/* TACTICAL PROFILE HEADER */}
                <div className="flex flex-col md:flex-row items-center gap-12 mb-20 px-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group/avatar cursor-pointer"
                        onClick={() => avatarInputRef.current?.click()}
                    >
                        {/* Hidden file input */}
                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />

                        {/* Avatar ring */}
                        <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-tr from-saffron to-orange-400 p-1 flex items-center justify-center shadow-[0_20px_60px_rgba(255,153,51,0.3)] group-hover/avatar:shadow-[0_20px_60px_rgba(255,153,51,0.5)] transition-all duration-300">
                            <div className="w-full h-full rounded-[2.8rem] bg-black flex items-center justify-center overflow-hidden">
                                {uploadingAvatar ? (
                                    <Loader size={40} className="text-saffron animate-spin" />
                                ) : avatarUrl ? (
                                    <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={80} className="text-white/20" />
                                )}
                            </div>
                        </div>

                        {/* Camera overlay on hover */}
                        <div className="absolute inset-0 rounded-[3rem] bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                            <Camera size={28} className="text-white" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Change Photo</span>
                        </div>

                        {/* Shield badge */}
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-saffron shadow-xl z-10">
                            <Shield size={20} />
                        </div>
                    </motion.div>

                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
                                {savedUsername}
                            </h1>
                            <div className="px-4 py-1.5 rounded-full bg-saffron/10 border border-saffron/20 text-[10px] font-black text-saffron uppercase tracking-[0.3em] w-fit mx-auto md:mx-0">
                                {profile?.rank || user?.rank || t("rank_architect")}
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="flex items-center gap-2"><Mail size={14} className="text-saffron" /> {profile?.email || user?.email || "—"}</span>
                            <span className="flex items-center gap-2"><Target size={14} className="text-green-bharat" /> {repoHistory.length} {t("projects_synced")}</span>
                        </div>
                    </div>
                </div>

                {/* TELEMETRY STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="lovable-card p-10 bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 rounded-2xl bg-white/5 text-white/40 group-hover:text-white transition-colors">
                                    <stat.icon size={20} />
                                </div>
                                <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{stat.label}</h4>
                            </div>
                            <div className={`text-5xl font-black italic tracking-tighter ${stat.color}`}>
                                {loadingProfile ? <span className="text-white/10 animate-pulse text-2xl">Loading...</span> : stat.value}
                            </div>
                            <div className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                <stat.icon size={120} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LEFT COLUMN: REPO HISTORY */}
                    <div className="lg:col-span-8 space-y-8">
                        <section className="lovable-card p-12 bg-black/40 border-white/5">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                                    <History size={18} className="text-saffron" />
                                    {t("repo_history")}
                                </h3>
                                <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                                    {loadingHistory ? "Loading..." : `${repoHistory.length} History Nodes`}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {loadingHistory && (
                                    <div className="py-8 flex justify-center">
                                        <div className="w-8 h-8 border-2 border-t-saffron border-r-transparent border-b-green-bharat border-l-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                                {!loadingHistory && repoHistory.length === 0 && (
                                    <p className="text-center text-white/20 text-[11px] font-bold uppercase tracking-widest py-8">
                                        No repositories scanned yet. Go to Code Lab to start a scan.
                                    </p>
                                )}
                                {!loadingHistory && repoHistory.map((repo: any, i: number) => (
                                    <div key={repo.id || i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all cursor-pointer">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-saffron transition-colors">
                                                <Terminal size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-white italic uppercase tracking-tight">{repo.repo_name || "Repository"}</h4>
                                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                                                    {repo.last_scanned ? new Date(repo.last_scanned).toLocaleString() : "—"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">STATUS</div>
                                                <div className={`text-xs font-black uppercase ${repo.status === "analyzed" ? "text-green-bharat" : repo.status === "error" ? "text-red-400" : "text-saffron"}`}>
                                                    {repo.status || "—"}
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/10 group-hover:text-white transition-colors">
                                                <TrendingUp size={16} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: ACHIEVEMENTS & ACTIONS */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="lovable-card p-10 bg-white/[0.02] border border-white/5">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-10 flex items-center gap-3">
                                <Star size={16} className="text-saffron" />
                                {t("neural_merit")}
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { title: "First System Sync", desc: "Successfully analyzed a macro repository.", icon: "🏆" },
                                    { title: "Code Whisperer", desc: "Resolved 5 neural bridge errors.", icon: "💎" },
                                    { title: "Master Architect", desc: "Completed 1 training roadmap.", icon: "🚀" }
                                ].map((badge, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">{badge.icon}</div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{badge.title}</h4>
                                            <p className="text-[10px] text-white/40 italic leading-snug mt-1">{badge.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="space-y-4">
                            <Button
                                variant="saffron"
                                className="w-full py-6 italic tracking-tighter"
                                onClick={() => { setNewUsername(savedUsername); setShowUsernameModal(true); }}
                            >
                                <Pencil size={16} />
                                {t("update_protocol_info")}
                            </Button>

                            <button
                                onClick={handleLogout}
                                className="w-full py-6 rounded-3xl bg-red-500/10 border border-red-500/30 text-[10px] font-black text-red-500 uppercase tracking-[0.4em] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
                            >
                                <LogOut size={16} />
                                {t("terminate_session")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* USERNAME CHANGE MODAL */}
            <AnimatePresence>
                {showUsernameModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUsernameModal(false)}
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="relative w-full max-w-md lovable-card p-10 bg-black/90 border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)] z-10"
                        >
                            <button
                                onClick={() => setShowUsernameModal(false)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors text-white/20 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-saffron/10 border border-saffron/20 flex items-center justify-center">
                                    <Pencil className="text-saffron" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black italic uppercase tracking-tight text-white leading-none">Update Username</h2>
                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mt-1">Neural Identity Reconfiguration</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-8">
                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-2">
                                    New Username
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-saffron transition-colors" size={16} />
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSaveUsername()}
                                        placeholder="Enter new username..."
                                        autoFocus
                                        className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-4 pl-12 pr-5 text-sm font-semibold text-white focus:outline-none focus:bg-white/[0.08] focus:border-saffron/40 transition-all placeholder:text-white/10"
                                    />
                                </div>
                                <p className="text-[9px] text-white/20 ml-2 italic">3–24 characters. No special characters.</p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowUsernameModal(false)}
                                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveUsername}
                                    disabled={!newUsername.trim() || newUsername.trim() === savedUsername}
                                    className="flex-1 py-4 rounded-2xl bg-saffron text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-saffron/20"
                                >
                                    <Check size={14} />
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </PageContainer>
    );
}