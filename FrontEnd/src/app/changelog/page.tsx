"use client";

import PageContainer from "@/components/layout/PageContainer";
import { Twitter, Mail, Globe, MessageSquare, Zap, Radio } from "lucide-react";

export default function GlobalCommsPage() {
    return (
        <PageContainer>
            <div className="max-w-5xl mx-auto py-20 px-6">
                <div className="mb-20 text-center">
                    <h3 className="text-[10px] font-black text-saffron uppercase tracking-[0.8em] mb-4 italic flex items-center justify-center gap-2">
                        <Radio size={14} className="animate-pulse" />
                        Live Neural Signal
                    </h3>
                    <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase italic leading-none mb-10">
                        Global <span className="lovable-text-gradient">Comms</span>
                    </h1>
                    <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                        Synchronize with the Thenali AI frequency. Connect with architects, maintainers, and the global Z-Fighters community.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <SignalCard
                        icon={<Twitter size={24} className="text-[#1DA1F2]" />}
                        title="Pulse Twitter"
                        desc="@ai_for_bharat"
                        link="https://twitter.com/ai_for_bharat"
                        label="Latest Signal"
                    />
                    <SignalCard
                        icon={<MessageSquare size={24} className="text-green-bharat" />}
                        title="Neural Discord"
                        desc="Z-Fighters Cluster"
                        link="#"
                        label="Community Uplink"
                    />
                    <SignalCard
                        icon={<Mail size={24} className="text-saffron" />}
                        title="Arch Direct"
                        desc="hq@ai-bharat.io"
                        link="mailto:hq@ai-bharat.io"
                        label="Priority Channel"
                    />
                </div>

                <div className="mt-32 border-t border-white/5 pt-20">
                    <div className="lovable-card p-12 relative overflow-hidden bg-gradient-to-tr from-saffron/5 to-transparent">
                        <Zap size={40} className="text-saffron mb-8" />
                        <h3 className="text-4xl font-black italic text-white uppercase tracking-tighter mb-6">Broadcast Your Progress</h3>
                        <p className="text-white/40 text-sm max-w-xl leading-relaxed mb-10 font-medium">
                            Are you ready to show the world what an Indian architect can build? Use the #ZfightersBHARAT tag to share your mastery roadmaps and repository intel. The world is watching.
                        </p>
                        <button className="px-12 py-5 bg-saffron text-white rounded-3xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl shadow-saffron/20 hover:scale-105 transition-all">
                            Initialize Signal
                        </button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}

function SignalCard({ icon, title, desc, link, label }: any) {
    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="block">
            <div
                className="lovable-card p-10 bg-black/40 border-white/5 hover:border-white/20 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center group"
            >
                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors">
                    {icon}
                </div>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">{label}</span>
                <h4 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-2">{title}</h4>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{desc}</p>
            </div>
        </a>
    );
}
