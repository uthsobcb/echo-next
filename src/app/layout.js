import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ToastProvider from "./components/ToastProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
// import Script from 'next/script'
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Echo || Journal Effortlessly ||  A Space to Write, Reflect, and Grow",
  description: "Echo is your intelligent journaling companion, combining AI-powered insights with mood tracking and emotional support to help you reflect, grow, and achieve better mental well-being. Start journaling with Echo today to unlock your personal growth journey. Duolingo for your mind. ",
  manifest: "/manifest.json",
  icons: {
    apple: [
      { url: "/assets/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/logo.png", sizes: "512x512", type: "image/png" },
    ],
  },
  themeColor: "#4A90E2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
