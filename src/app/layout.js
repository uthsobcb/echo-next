
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ToastProvider from "./components/ToastProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"

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
        <ToastProvider />
        {children}
        <Footer />
      </body>
    </html>
  );
}
