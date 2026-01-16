import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "LeetPeers | Master LeetCode Together",
  description: "Join study groups, track your progress, and stay motivated with daily coding challenges alongside your peers.",
  keywords: ["leetcode", "coding", "practice", "study group", "competitive programming"],
  authors: [{ name: "LeetPeers" }],
  openGraph: {
    title: "LeetPeers | Master LeetCode Together",
    description: "Join study groups, track your progress, and stay motivated with daily coding challenges alongside your peers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
