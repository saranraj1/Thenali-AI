import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Playground | Thenali AI",
    description: "Interactive coding sandbox with AI assistance in real-time.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
