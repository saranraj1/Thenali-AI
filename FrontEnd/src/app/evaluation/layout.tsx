import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Assessments | Thenali AI",
    description: "Evaluate your skills with AI-powered technical assessments.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
