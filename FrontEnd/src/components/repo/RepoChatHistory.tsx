"use client";

import Card from "@/components/ui/Card";
import { History, MessageSquare, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

type SidebarProps = {
    history: any[];
    onSelect: (id: string) => void;
};

export default function RepoChatHistory({ history, onSelect }: SidebarProps) {
    return (
        <Card className="h-full flex flex-col p-6">
            <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                <div className="p-3 bg-saffron/10 rounded-xl">
                    <History size={20} className="text-saffron" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white">Previous Analysed</h3>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Chat Memory Unit</p>
                </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                {history.length === 0 && (
                    <div className="text-center py-10">
                        <MessageSquare className="mx-auto mb-4 text-white/10" size={32} />
                        <p className="text-xs text-white/30 uppercase tracking-widest font-black">No repositories analyzed yet</p>
                    </div>
                )}

                {history.map((chat) => (
                    <motion.div
                        whileHover={{ x: 4 }}
                        key={chat.id}
                        onClick={() => onSelect(chat.id)}
                        className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl cursor-pointer group hover:bg-white/[0.08] hover:border-saffron/30 transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xs font-bold text-white group-hover:text-saffron transition-colors truncate max-w-[150px]">
                                {chat.repo_name}
                            </h4>
                            <div className="flex items-center gap-2">
                                <Clock size={10} className="text-white/20" />
                                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{chat.last_scanned}</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-white/40 leading-relaxed italic truncate">{chat.summary}</p>

                        <div className="mt-4 flex justify-end">
                            <div className="p-1 px-3 border border-white/10 rounded-full text-[9px] font-bold text-white/30 group-hover:text-white group-hover:border-saffron/50 transition-all flex items-center gap-2">
                                RECOVER INTEL <ChevronRight size={10} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </Card>
    );
}
