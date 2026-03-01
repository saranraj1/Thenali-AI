import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Settings | Thenali AI",
    description: "Configure your Thenali AI experience and preferences.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
