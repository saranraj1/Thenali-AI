"use client";

import PageContainer from "@/components/layout/PageContainer";
import { Database, FileCode, Search, Terminal, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function SecurityPage() {
    return (
        <PageContainer>
            <div className="max-w-6xl mx-auto py-20 px-6">
                <div className="mb-20 text-center">
                    <h3 className="text-[10px] font-black text-saffron uppercase tracking-[0.6em] mb-4 italic">Registry Status: ACTIVE</h3>
                    <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none mb-10">
                        Security <span className="lovable-text-gradient">Registry</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="lovable-card p-12 bg-black/40 border-white/5 border-l-4 border-l-green-bharat">
                        <Activity className="text-green-bharat mb-8" size={32} />
                        <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-4">Neural Health Check</h3>
                        <p className="text-white/40 font-medium leading-relaxed">
                            Our system performs real-time health checks on the Thenali AI engine to ensure that the repository scanning logic remains unbiased and secure from external injections.
                        </p>
                    </div>

                    <div className="lovable-card p-12 bg-black/40 border-white/5 border-l-4 border-l-saffron">
                        <Terminal className="text-saffron mb-8" size={32} />
                        <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-4">Sandbox Isolation</h3>
                        <p className="text-white/40 font-medium leading-relaxed">
                            The Interactive Sandbox uses Docker-based containerization to execute your test scripts, preventing any cross-tenant data leakage or system-level vulnerabilities.
                        </p>
                    </div>

                    <div className="lovable-card p-12 bg-black/40 border-white/5 border-l-4 border-l-blue-400">
                        <Search className="text-blue-400 mb-8" size={32} />
                        <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-4">Audit Logs</h3>
                        <p className="text-white/40 font-medium leading-relaxed">
                            Every intelligence transmission and manifest generation is logged in our cryptographic internal ledger for transparency and security auditing.
                        </p>
                    </div>

                    <div className="lovable-card p-12 bg-black/40 border-white/5 border-l-4 border-l-purple-400">
                        <Database className="text-purple-400 mb-8" size={32} />
                        <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter mb-4">Vault Storage</h3>
                        <p className="text-white/40 font-medium leading-relaxed">
                            Your personal "Journey Vault" is stored in a multi-region VPC with strictly controlled access nodes and hardware-level encryption.
                        </p>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
