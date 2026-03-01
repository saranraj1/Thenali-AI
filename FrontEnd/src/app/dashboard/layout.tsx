import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | Thenali AI",
    description: "Your AI developer command center — track repositories, learning progress, skill mastery, and recent activity.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
