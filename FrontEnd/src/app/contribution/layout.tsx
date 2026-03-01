import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contributions | Thenali AI",
    description: "Discover open source repositories and track your contribution history.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
