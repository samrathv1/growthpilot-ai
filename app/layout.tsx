import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GrowthPilot AI — Business AI Toolkit",
  description:
    "Turn any business into a growth machine with AI. Generate business audits, landing page copy, content ideas, sales follow-ups, and weekly growth actions in minutes.",
  keywords: [
    "AI business tools",
    "business growth AI",
    "landing page generator",
    "content generator AI",
    "business audit AI",
    "GrowthPilot AI",
  ],
  openGraph: {
    title: "GrowthPilot AI — Business AI Toolkit",
    description:
      "Turn any business into a growth machine with AI. Your premium AI command center for growth.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#050816] text-slate-100">{children}</body>
    </html>
  );
}
