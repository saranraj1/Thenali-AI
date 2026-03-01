"use client";

import PageContainer from "@/components/layout/PageContainer";
import { FileText, Cpu, Zap, Star, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
    return (
        <PageContainer>
            <div className="max-w-4xl mx-auto py-20 px-6">
                <div className="mb-16">
                    <h3 className="text-[10px] font-black text-saffron uppercase tracking-[0.4em] mb-4 italic flex items-center gap-2">
                        <FileText size={12} className="animate-pulse" />
                        Operational Protocol 02
                    </h3>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none mb-8">
                        Neural <span className="lovable-text-gradient">Agreement</span>
                    </h1>
                    <p className="text-white/40 text-lg leading-relaxed font-medium italic">
                        "By synchronizing with Thenali AI, you enter a pact of architectural excellence."
                    </p>
                </div>

                <div className="space-y-12">
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <Zap className="text-saffron" size={20} />
                            <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">1. Computational Integrity</h2>
                        </div>
                        <p className="text-white/40 leading-relaxed font-medium ml-10">
                            Users agree to utilize the Thenali AI engine for constructive architectural growth. Any attempt to reverse-engineer the neural pulse or exploit the repository scanning pipeline will result in immediate de-synchronization.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <Star className="text-green-bharat" size={20} />
                            <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">2. Z-Fighter Code of Conduct</h2>
                        </div>
                        <p className="text-white/40 leading-relaxed font-medium ml-10">
                            Membership in the elite Z-Fighters roster requires active contribution and maintainer readiness. You are expected to uphold the reputation of the Indian developer community on the global stage.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <Cpu className="text-blue-400" size={20} />
                            <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">3. Intellectual Property</h2>
                        </div>
                        <p className="text-white/40 leading-relaxed font-medium ml-10">
                            The code you write during Interactive Sandbox sessions belongs to you. The intelligence provided by the Thenali AI model is under a collaborative license, intended for educational and professional enhancement.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <ShieldCheck className="text-white/60" size={20} />
                            <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter">4. Protocol Evolution</h2>
                        </div>
                        <p className="text-white/40 leading-relaxed font-medium ml-10">
                            As the Thenali AI engine matures (currently v2.1.0-Alpha), these terms will undergo neural updates. Continued access to the platform confirms your acceptance of newer architectural protocols.
                        </p>
                    </section>
                </div>
            </div>
        </PageContainer>
    );
}
