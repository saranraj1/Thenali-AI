"use client";

import { motion } from "framer-motion";

type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "saffron" | "green";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
};

export default function Button({ children, onClick, className = "", variant = "primary", size = "md", disabled = false, type = "button" }: Props) {
    const baseStyles = "relative inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-full active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden";

    const variants = {
        primary: "bg-white text-black hover:bg-white/90 shadow-lg shadow-white/5",
        secondary: "bg-white/5 text-white hover:bg-white/10 backdrop-blur-md border border-white/10",
        outline: "bg-transparent border border-white/20 text-white hover:bg-white/5",
        ghost: "bg-transparent text-white/60 hover:text-white hover:bg-white/5",
        saffron: "bg-saffron text-white shadow-lg shadow-saffron/20 hover:shadow-saffron/40",
        green: "bg-green-bharat text-white shadow-lg shadow-green-bharat/20 hover:shadow-green-bharat/40",
    };

    const sizes = {
        sm: "px-5 py-2.5 text-xs",
        md: "px-8 py-4 text-sm",
        lg: "px-10 py-5 text-base",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            disabled={disabled}
            type={type}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>

            {/* Subtle gloss effect */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20"></div>
        </motion.button>
    );
}