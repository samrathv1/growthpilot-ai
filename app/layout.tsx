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
  title: "LearnVolt AI — Business AI Toolkit",
  description:
    "AI-powered business toolkit to generate website copy, content strategies, lead follow-ups, business audits, and growth actions — in seconds.",
  keywords: [
    "AI business tools", "business growth AI", "landing page generator",
    "content generator AI", "business audit AI", "LearnVolt AI",
    "lead follow-up AI", "growth agent AI",
  ],
  openGraph: {
    title: "LearnVolt AI — Business AI Toolkit",
    description: "AI-powered toolkit to grow your business faster. Generate audits, copy, content, and growth plans in seconds.",
    type: "website",
    images: ["/images/growthpilot-banner.png"],
  },
  icons: {
    icon: "/images/growthpilot-logo.png",
    shortcut: "/images/growthpilot-logo.png",
    apple: "/images/growthpilot-logo.png",
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
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full bg-[#06111F] text-slate-100">{children}</body>
    </html>
  );
}
