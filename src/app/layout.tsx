import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ToastProvider from "./components/ToastProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Echo || Journal Effortlessly ||  A Space to Write, Reflect, and Grow",
  description: "Echo is your intelligent journaling companion, combining AI-powered insights with mood tracking and emotional support to help you reflect, grow, and achieve better mental well-being. Start journaling with Echo today to unlock your personal growth journey. Duolingo for your mind. ",
  manifest: "/manifest.json",
  keywords: [
    "journal",
    "journaling",
    "mood tracking",
    "mental health",
    "AI",
    "emotional support",
    "personal growth",
    "self-reflection",
    "well-being",
    "mindfulness",
    "echo",
    "digital journal",
    "mood insights",
    "emotional intelligence",
    "mood tracker",
    "self-improvement",
    "mental wellness",
    "journaling app",
    "AI journaling",
    "journaling with AI",
    "journaling for mental health",
    "journaling for self-reflection",
    "journaling for personal growth",
    "best journaling apps",
    "best journaling apps 2025 features",
    "Day One: Daily Journal & Diary",
    "Reddit: Best Journaling Apps",
    "Duolingo for journaling"
  ],
  icons: {
    apple: [
      { url: "/assets/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/logo.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="application-name" content="Echo" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Echo" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#4A90E2" />

        <link rel="apple-touch-icon" href="/assets/logo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        {/* <Script
          src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
          strategy="beforeInteractive"
        /> */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content="/assets/logo.png" />
        <meta property="og:url" content="https://www.my-echo.space/" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content="/assets/logo.png" />

        {/* Icons */}
        <link rel="apple-touch-icon" href="/assets/logo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Preload Assets */}
        <link rel="preload" href="/assets/logo.png" as="image" />
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter&display=swap" as="style" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Echo",
              url: "https://www.my-echo.space/",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.my-echo.space/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

      </head>
      <body className={inter.className}>
        <NavBar />
        <SpeedInsights />
        <Analytics />
        <ToastProvider />
        {children}
        <Footer />
      </body>
    </html>
  );
}
