
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import ToastProvider from "./components/ToastProvider";
export const metadata = {
  title: "Echo",
  description: "AI enabled journal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <ToastProvider />
        {children}
        <Footer />
      </body>
    </html>
  );
}
