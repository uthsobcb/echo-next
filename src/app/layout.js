
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ToastProvider from "./components/ToastProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
export const metadata = {
  title: "Echo",
  description: "AI enabled journal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
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
