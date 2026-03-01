"use client";

import { useState, useEffect, useCallback } from "react";
import { Smartphone, X, Monitor, Tablet, RotateCcw, ExternalLink, ChevronDown } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const DEVICES = [
    { id: "iphone-se", label: "iPhone SE", width: 375, height: 667, icon: "📱" },
    { id: "iphone-14", label: "iPhone 14", width: 390, height: 844, icon: "📱" },
    { id: "iphone-14-pro-max", label: "iPhone 14 Max", width: 430, height: 932, icon: "📱" },
    { id: "android", label: "Android", width: 412, height: 915, icon: "📱" },
    { id: "ipad", label: "iPad", width: 768, height: 1024, icon: "📟" },
];

export default function MobilePreviewToggle() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(DEVICES[1]); // iPhone 14 default
    const [isLandscape, setIsLandscape] = useState(false);
    const [showDeviceMenu, setShowDeviceMenu] = useState(false);
    const [iframeKey, setIframeKey] = useState(0); // force iframe reload

    // Close on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Escape to close
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
                setShowDeviceMenu(false);
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    const reloadIframe = useCallback(() => setIframeKey(k => k + 1), []);

    const frameWidth = isLandscape ? selectedDevice.height : selectedDevice.width;
    const frameHeight = isLandscape ? selectedDevice.width : selectedDevice.height;

    // Scale the phone frame to fit the available space
    const maxH = typeof window !== "undefined" ? window.innerHeight * 0.78 : 700;
    const maxW = typeof window !== "undefined" ? window.innerWidth * 0.6 : 800;
    const scaleH = maxH / (frameHeight + 100);
    const scaleW = maxW / (frameWidth + 60);
    const scale = Math.min(scaleH, scaleW, 1);

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const previewUrl = `${origin}${pathname}`;

    return (
        <>
            {/* Floating toggle button */}
            <button
                onClick={() => setIsOpen(true)}
                aria-label="Open mobile preview"
                title="Mobile Preview"
                className="fixed bottom-6 right-6 z-[100] group flex items-center gap-2.5 px-4 py-3 bg-[#0f1117]/90 backdrop-blur-xl border border-white/10 rounded-2xl text-white/60 hover:text-white hover:border-saffron/40 hover:bg-black/80 transition-all duration-300 shadow-2xl hover:shadow-saffron/10 focus:outline-none focus:ring-2 focus:ring-saffron/50"
            >
                <Smartphone size={18} className="text-saffron group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest hidden sm:block">Preview</span>
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-saffron animate-pulse" />
            </button>

            {/* Preview overlay */}
            <AnimatePresence>
                {isOpen && (
                    <m.div
                        key="preview-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex flex-col"
                    >
                        {/* Top toolbar */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0c0e14]/90 flex-shrink-0">
                            {/* Left — device picker */}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <button
                                        onClick={() => setShowDeviceMenu(d => !d)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-white/70 hover:text-white hover:border-saffron/30 transition-all text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-saffron/50"
                                    >
                                        <Smartphone size={14} className="text-saffron" />
                                        {selectedDevice.label}
                                        <span className="text-white/30">{selectedDevice.width}×{selectedDevice.height}</span>
                                        <ChevronDown size={12} className={`transition-transform ${showDeviceMenu ? "rotate-180" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showDeviceMenu && (
                                            <m.div
                                                initial={{ opacity: 0, y: -8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                className="absolute top-full mt-2 left-0 bg-[#0c0e14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-10 min-w-[200px]"
                                            >
                                                {DEVICES.map(d => (
                                                    <button
                                                        key={d.id}
                                                        onClick={() => { setSelectedDevice(d); setShowDeviceMenu(false); reloadIframe(); }}
                                                        className={`w-full flex items-center justify-between px-4 py-3 text-xs font-bold transition-colors text-left ${selectedDevice.id === d.id ? "bg-saffron/10 text-saffron" : "text-white/50 hover:bg-white/[0.04] hover:text-white"}`}
                                                    >
                                                        <span>{d.icon} {d.label}</span>
                                                        <span className="text-white/25">{d.width}×{d.height}</span>
                                                    </button>
                                                ))}
                                            </m.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Orientation toggle */}
                                <button
                                    onClick={() => setIsLandscape(l => !l)}
                                    aria-label="Toggle orientation"
                                    title={isLandscape ? "Switch to portrait" : "Switch to landscape"}
                                    className={`p-2 rounded-xl border transition-all text-xs font-black focus:outline-none focus:ring-2 focus:ring-saffron/50 ${isLandscape ? "bg-saffron/10 border-saffron/30 text-saffron" : "bg-white/[0.04] border-white/10 text-white/40 hover:text-white hover:border-white/20"}`}
                                >
                                    <RotateCcw size={14} />
                                </button>

                                {/* Reload */}
                                <button
                                    onClick={reloadIframe}
                                    aria-label="Reload preview"
                                    className="p-2 rounded-xl border border-white/10 bg-white/[0.04] text-white/40 hover:text-white hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-saffron/50"
                                >
                                    <RotateCcw size={14} />
                                </button>

                                {/* Open in new tab */}
                                <a
                                    href={previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Open in new tab"
                                    className="p-2 rounded-xl border border-white/10 bg-white/[0.04] text-white/40 hover:text-white hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-saffron/50"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            </div>

                            {/* Center — URL bar */}
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl max-w-sm w-full">
                                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                <span className="text-[11px] text-white/30 font-mono truncate">{previewUrl}</span>
                            </div>

                            {/* Right — size info + close */}
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
                                    <Monitor size={12} />
                                    {isLandscape ? `${frameWidth}×${frameHeight}` : `${frameWidth}×${frameHeight}`}px
                                    <span className="text-white/10">({Math.round(scale * 100)}% scale)</span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Close mobile preview"
                                    className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white/40 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-saffron/50"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Phone frame area */}
                        <div className="flex-1 flex items-center justify-center overflow-hidden p-6">
                            <m.div
                                key={`${selectedDevice.id}-${isLandscape}`}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
                            >
                                {/* Phone bezel */}
                                <div
                                    className="relative bg-[#1a1a1a] rounded-[40px] shadow-[0_0_0_2px_rgba(255,255,255,0.08),0_40px_80px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                                    style={{
                                        width: frameWidth + 24,
                                        height: frameHeight + 80,
                                        padding: "40px 12px 40px 12px",
                                    }}
                                >
                                    {/* Status bar notch */}
                                    {!isLandscape && (
                                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-10 flex items-center justify-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#1a1a1a] border border-white/10" />
                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                        </div>
                                    )}

                                    {/* Side buttons */}
                                    <div className="absolute -left-1.5 top-24 w-1.5 h-8 bg-[#333] rounded-l-full" />
                                    <div className="absolute -left-1.5 top-36 w-1.5 h-12 bg-[#333] rounded-l-full" />
                                    <div className="absolute -left-1.5 top-52 w-1.5 h-12 bg-[#333] rounded-l-full" />
                                    <div className="absolute -right-1.5 top-36 w-1.5 h-16 bg-[#333] rounded-r-full" />

                                    {/* Screen */}
                                    <div
                                        className="relative overflow-hidden rounded-[28px] bg-[#02040a]"
                                        style={{ width: frameWidth, height: frameHeight }}
                                    >
                                        <iframe
                                            key={iframeKey}
                                            src={previewUrl}
                                            width={frameWidth}
                                            height={frameHeight}
                                            className="border-0 block"
                                            title={`Mobile preview — ${selectedDevice.label}`}
                                            style={{
                                                width: frameWidth,
                                                height: frameHeight,
                                                pointerEvents: "auto",
                                            }}
                                        />
                                    </div>

                                    {/* Home indicator */}
                                    {!isLandscape && (
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-white/20 rounded-full" />
                                    )}
                                </div>
                            </m.div>
                        </div>

                        {/* Bottom hint bar */}
                        <div className="flex items-center justify-center gap-6 py-3 border-t border-white/5 bg-[#0c0e14]/50 flex-shrink-0">
                            <span className="text-[10px] font-bold text-white/15 uppercase tracking-widest">Esc to close</span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-[10px] font-bold text-white/15 uppercase tracking-widest">Click inside to interact</span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-[10px] font-bold text-white/15 uppercase tracking-widest">Scroll + tap work normally</span>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
}
