import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Learning Hub | Thenali AI",
    description: "Master AI and engineering concepts through personalized roadmaps.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
