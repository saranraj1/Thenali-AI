import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Code Lab | Thenali AI",
    description: "AI-powered repository analysis and code intelligence.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
