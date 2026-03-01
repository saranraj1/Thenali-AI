"use client";

import { Bell, User, Search, Globe, ChevronDown, Layout, Terminal, BookOpen, CheckCircle, Sparkles, Settings, UserCircle, X, Menu } from "lucide-react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/notifications/NotificationBell";

const FEATURES = [
    { label: "Dashboard", desc: "Your main command center", href: "/dashboard", icon: Layout, tag: "core" },
    { label: "Code Lab", desc: "AI-powered repo analysis", href: "/repo-analysis", icon: Terminal, tag: "tool" },
    { label: "Learning Hub", desc: "Concept mastery & roadmaps", href: "/learning/dashboard", icon: BookOpen, tag: "learn" },
    { label: "Assessments", desc: "Skill evaluation & quizzes", href: "/evaluation", icon: CheckCircle, tag: "eval" },
    { label: "Playground", desc: "Interactive coding sandbox", href: "/playground", icon: Sparkles, tag: "tool" },
    { label: "Profile", desc: "Your neural identity", href: "/profile", icon: UserCircle, tag: "account" },
    { label: "Settings", desc: "System configuration", href: "/settings", icon: Settings, tag: "account" },
];

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
    const { user } = useAuth();
    const router = useRouter();
    const userName = user?.name || "Dev Recruit";

    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const filtered = query.trim()
        ? FEATURES.filter(f =>
            f.label.toLowerCase().includes(query.toLowerCase()) ||
            f.desc.toLowerCase().includes(query.toLowerCase()) ||
            f.tag.toLowerCase().includes(query.toLowerCase())
        )
        : FEATURES;

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelect = (href: string) => {
        setIsOpen(false);
        setQuery("");
        router.push(href);
    };

    const TAG_COLORS: Record<string, string> = {
        core: "text-saffron bg-saffron/10 border-saffron/20",
        tool: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        learn: "text-green-bharat bg-green-bharat/10 border-green-bharat/20",
        eval: "text-purple-400 bg-purple-400/10 border-purple-400/20",
        account: "text-white/40 bg-white/5 border-white/10",
    };

    return (
        <header className="w-full h-20 md:h-24 bg-[#02040a]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-12 sticky top-0 z-50 flex-shrink-0" role="banner">

            {/* Hamburger — mobile only */}
            <button
                onClick={onMenuClick}
                aria-label="Open navigation menu"
                className="md:hidden p-2.5 rounded-xl bg-white/[0.04] border border-white/5 text-white/60 hover:text-white hover:bg-white/[0.08] transition-all mr-3 focus:outline-none focus:ring-2 focus:ring-saffron/50"
            >
                <Menu size={20} />
            </button>

            {/* HOME LANDING LINK — hidden on small mobile to save space */}
            <Link href="/" className="hidden sm:block mr-4 md:mr-8 group" aria-label="Go to home landing page">
                <div className="flex items-center gap-3 px-4 md:px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full text-xs font-bold text-white/40 group-hover:text-white group-hover:bg-white/[0.08] transition-all">
                    <Globe size={16} className="text-saffron group-hover:scale-110 transition-transform" />
                    <span className="hidden md:inline">Home Landing Page</span>
                    <span className="md:hidden">Home</span>
                </div>
            </Link>

            {/* SEARCH COMMAND with dropdown */}
            <div ref={searchRef} className="flex-1 max-w-xl relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 z-10 pointer-events-none transition-colors" size={18} style={{ color: isOpen ? "rgba(255,153,51,0.7)" : undefined }} />
                <input
                    type="text"
                    value={query}
                    placeholder="Search features, pages, tools..."
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-10 text-sm font-medium text-white focus:outline-none focus:bg-white/[0.06] focus:border-saffron/30 transition-all placeholder:text-white/20"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(""); setIsOpen(false); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute top-full mt-3 left-0 right-0 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden z-[200]">
                        {/* Header */}
                        <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
                                {query ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}` : "All Features"}
                            </span>
                            <span className="text-[9px] font-bold text-white/10 uppercase tracking-widest">↑↓ Navigate · Enter to open</span>
                        </div>

                        {/* Results */}
                        <div className="max-h-80 overflow-y-auto py-2 custom-scrollbar">
                            {filtered.length === 0 ? (
                                <div className="px-5 py-8 text-center text-white/20 text-xs font-bold uppercase tracking-widest">
                                    No features found for "{query}"
                                </div>
                            ) : (
                                filtered.map((item) => (
                                    <button
                                        key={item.href}
                                        onClick={() => handleSelect(item.href)}
                                        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.05] transition-colors group text-left"
                                    >
                                        <div className="w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0 group-hover:bg-saffron/10 transition-colors">
                                            <item.icon size={16} className="text-white/30 group-hover:text-saffron transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-white group-hover:text-saffron transition-colors truncate">{item.label}</span>
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest flex-shrink-0 ${TAG_COLORS[item.tag]}`}>
                                                    {item.tag}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-white/30 mt-0.5 truncate">{item.desc}</p>
                                        </div>
                                        <span className="text-[9px] font-black text-white/10 group-hover:text-saffron/60 uppercase tracking-widest transition-colors flex-shrink-0">→</span>
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Footer hint */}
                        <div className="px-5 py-2.5 border-t border-white/5 flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center">
                                <Search size={10} className="text-white/20" />
                            </div>
                            <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Thenali AI Global Search</span>
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT PANEL */}
            <div className="flex items-center gap-8">

                {/* Global Node ID */}
                <div className="hidden lg:flex items-center gap-3 px-6 py-2.5 bg-white/[0.03] border border-white/5 rounded-full text-xs font-semibold text-white/40 hover:text-white transition-all cursor-pointer group">
                    <Globe size={16} className="text-blue-400 opacity-60 group-hover:opacity-100" />
                    <span>India</span>
                    <ChevronDown size={14} className="opacity-30" />
                </div>

                {/* Notifications */}
                <NotificationBell />

                {/* Profile Link */}
                <Link
                    href="/profile"
                    className="flex items-center gap-4 md:gap-5 pl-4 md:pl-8 border-l border-white/10 group transition-all cursor-pointer hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-saffron/50 rounded-xl"
                    aria-label={`View profile for ${userName}`}
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white group-hover:text-saffron transition-colors leading-none">{userName}</p>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1.5">Master Rank</p>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-white/[0.05] to-white/[0.1] border border-white/10 flex items-center justify-center group-hover:border-saffron/40 group-hover:shadow-[0_0_12px_rgba(255,153,51,0.2)] transition-all">
                        <User size={20} className="text-white/60 group-hover:text-saffron transition-colors" />
                    </div>
                </Link>

            </div>

        </header>
    );
}