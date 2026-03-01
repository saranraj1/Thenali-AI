"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobilePreviewToggle from "./MobilePreviewToggle";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { LanguageProvider } from "@/context/LanguageContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isAuthPage = pathname?.startsWith("/auth");
    const isLandingPage = pathname === "/";
    const hideLayout = isAuthPage || isLandingPage;

    // Close mobile sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Scroll reset
    useEffect(() => {
        const mainEl = document.getElementById("main-scroll");
        if (mainEl) mainEl.scrollTop = 0;
    }, [pathname]);

    // Escape key closes sidebar
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSidebarOpen(false);
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [sidebarOpen]);

    const openSidebar = useCallback(() => setSidebarOpen(true), []);
    const closeSidebar = useCallback(() => setSidebarOpen(false), []);

    return (
        <LanguageProvider>
            <LazyMotion features={domAnimation}>

                {/* Skip to main content — accessibility */}
                <a
                    href="#main-scroll"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:px-6 focus:py-3 focus:bg-saffron focus:text-white focus:rounded-2xl focus:font-black focus:text-sm focus:uppercase focus:tracking-widest"
                >
                    Skip to content
                </a>

                {hideLayout ? (
                    <div key="no-layout" className="bg-[#02040a] min-h-screen text-white relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                ) : (
                    <div key="app-layout" className="flex h-screen bg-[#02040a] text-white selection:bg-saffron/30 relative">

                        {/* Soft Ambient Background */}
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-saffron/5 blur-[120px] rounded-full will-change-transform" />
                            <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-green-bharat/5 blur-[100px] rounded-full will-change-transform" />
                        </div>

                        <Sidebar mobileOpen={sidebarOpen} onClose={closeSidebar} />

                        {/* Right column */}
                        <div className="flex flex-1 flex-col min-h-0 relative z-10 min-w-0">
                            <div className="flex-shrink-0 z-50 relative">
                                <Navbar onMenuClick={openSidebar} />
                            </div>
                            <main
                                id="main-scroll"
                                className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar overscroll-contain"
                                tabIndex={-1}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={pathname}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="max-w-7xl mx-auto w-full"
                                    >
                                        {children}
                                    </motion.div>
                                </AnimatePresence>
                            </main>
                        </div>

                        {/* Mobile Preview Dev Tool — floating button */}
                        <MobilePreviewToggle />
                    </div>
                )}
            </LazyMotion>
        </LanguageProvider>
    );
}
