import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile | Thenali AI",
    description: "Your neural identity — rank, achievements and skill progression.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
