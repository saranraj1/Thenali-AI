import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Thenali AI — AI Developer Intelligence Platform",
    template: "%s | Thenali AI",
  },
  description: "AI-powered platform for Indian developers — master concepts, analyze repos, evaluate skills, and contribute to open source.",
  keywords: ["AI", "developer tools", "India", "open source", "learning", "code analysis", "Bharat", "Z-Fighters"],
  authors: [{ name: "Z-Fighters Team" }],
  openGraph: {
    title: "Thenali AI — AI Developer Intelligence Platform",
    description: "AI-powered platform for Indian developers — master concepts, analyze repos, and contribute to open source.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#08090a] text-white antialiased`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}