"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { Link2, Search } from "lucide-react";

type Props = {
    onAnalyze?: (repoUrl: string) => void;
};

export default function RepoInput({ onAnalyze }: Props) {
    const [repoUrl, setRepoUrl] = useState("");
    const [error, setError] = useState("");

    const isValidGitHubUrl = (url: string) => {
        return /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(\.git)?\/?$/.test(url.trim());
    };

    const handleAnalyze = () => {
        if (!repoUrl.trim()) return;
        if (!isValidGitHubUrl(repoUrl)) {
            setError("Please enter a valid GitHub repository URL");
            return;
        }
        setError("");
        onAnalyze?.(repoUrl);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setRepoUrl(val);
        if (val.trim() && !isValidGitHubUrl(val)) {
            setError("Please enter a valid GitHub repository URL");
        } else {
            setError("");
        }
    };

    const isValid = isValidGitHubUrl(repoUrl);

    return (
        <Card title="Repository Pulse Scan">
            <div className="flex flex-col gap-6">
                <div className="relative group">
                    <Link2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-[#ff7a30] transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="PASTE GITHUB REPO LINK..."
                        value={repoUrl}
                        onChange={handleChange}
                        className={`w-full bg-[#0d0f11] py-5 pl-14 pr-6 rounded-3xl text-sm text-white focus:outline-none focus:ring-2 transition-all placeholder:text-gray-800 font-bold uppercase tracking-widest ${error ? "border-2 border-red-500/50 focus:ring-red-500/30" : "border border-[#1e2227] focus:ring-[#ff7a30]/30"
                            }`}
                    />
                    {error && (
                        <p className="absolute -bottom-6 left-4 text-xs font-bold text-red-500 tracking-wider">
                            {error}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={!isValid || !repoUrl.trim()}
                    className={`w-full py-5 rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-3 mt-2 ${isValid && repoUrl.trim()
                            ? "bg-[#ff7a30] text-white shadow-[0_10px_25px_rgba(255,122,48,0.3)] hover:scale-[1.02] active:scale-95"
                            : "bg-[#2a2e33] text-gray-500 cursor-not-allowed"
                        }`}
                >
                    <Search size={18} />
                    START AI BRAIN SCAN
                </button>
            </div>
        </Card>
    );
}