"use client";

import PageContainer from "@/components/layout/PageContainer";
import { Shield, Lock, Eye, Server, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
    return (
        <PageContainer>
            <div className="max-w-4xl mx-auto py-20 px-6">
                <div className="mb-16">
                    <h3 className="text-[10px] font-black text-saffron uppercase tracking-[0.4em] mb-4 italic flex items-center gap-2">
                        <Shield size={12} className="animate-pulse" />
                        Operational Protocol 01
                    </h3>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none mb-8">
                        Data Privacy <span className="lovable-text-gradient">Node</span>
                    </h1>
                    <p className="text-white/40 text-lg leading-relaxed font-medium italic">
                        "Your architectural intelligence is yours alone. We merely provide the lens to sharpen it."
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <PrivacyCard
                        icon={<Lock size={24} className="text-saffron" />}
                        title="Neural Isolation"
                        content="All repository analysis performed by Thenali AI is executed within ephemeral neural nodes. We do not store your source code or architectural blueprints beyond the duration of the active intelligence session."
                    />
                    <PrivacyCard
                        icon={<Eye size={24} className="text-green-bharat" />}
                        title="Contribution Anonymity"
                        content="Your open-source readiness metrics are kept private until you choose to broadcast them to the Z-Fighters roster or external maintainers."
                    />
                    <PrivacyCard
                        icon={<Server size={24} className="text-blue-400" />}
                        title="Encryption at Rest"
                        content="Any metadata associated with your learning progress or dashboard stats is encrypted with AES-256 protocols, ensuring that your growth path remains confidential."
                    />
                    <PrivacyCard
                        icon={<RefreshCcw size={24} className="text-orange-400" />}
                        title="Data Portability"
                        content="You maintain full authority over your data. At any point, you can export your Neural Intel Manifest or purge your progress from the Thenali AI ecosystem."
                    />
                </div>
            </div>
        </PageContainer>
    );
}

function PrivacyCard({ icon, title, content }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lovable-card p-10 bg-black/40 border-white/5 group hover:border-saffron/30 transition-all"
        >
            <div className="flex items-start gap-8">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-black italic text-white uppercase tracking-tighter mb-4">{title}</h3>
                    <p className="text-white/40 leading-relaxed text-sm font-medium">{content}</p>
                </div>
            </div>
        </motion.div>
    );
}
