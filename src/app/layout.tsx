import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ToastProvider from "./components/ToastProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Inter } from "next/font/google";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const SITE_URL = "https://echojournal.life";
const TITLE = "Echo — Understand Your Patterns, Gently";
const DESCRIPTION =
  "A private AI-assisted journal with support modes, Memory Constellation, evidence-linked reports, and gentle personal experiments.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Echo" },
  description: DESCRIPTION,
  applicationName: "Echo",
  manifest: "/manifest.json",
  keywords: [
    "journal",
    "journaling",
    "mood tracking",
    "mental health",
    "AI journaling",
    "emotional support",
    "personal growth",
    "self-reflection",
    "mindfulness",
    "digital journal",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/assets/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Echo",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Echo",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Echo",
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <NavBar />
        <SpeedInsights />
        <Analytics />
        <ToastProvider />
        <main className="flex-1 pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
