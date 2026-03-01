"use client";

import { motion } from "framer-motion";

type Props = {
    children: React.ReactNode;
    className?: string;
    title?: string;
    variant?: "default" | "saffron" | "green";
};

export default function Card({ children, className = "", title, variant = "default" }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`lovable-card p-8 ${className}`}
        >
            {title && (
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className={`w-1 h-6 rounded-full ${variant === 'saffron' ? 'bg-saffron' : variant === 'green' ? 'bg-green-bharat' : 'bg-white/40'}`}></div>
                        <h3 className="text-sm font-bold tracking-tight text-white/90">
                            {title}
                        </h3>
                    </div>
                </div>
            )}

            <div className="relative z-10">
                {children}
            </div>

            {/* Subtle light reflection */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </motion.div>
    );
}