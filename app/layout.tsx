import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FlashBanner } from "@/components/layout/FlashBanner";

export const metadata: Metadata = {
  title: "IEEE Student Chapter | LNMIIT",
  description: "IEEE Student Chapter at The LNM Institute of Information Technology, Jaipur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <FlashBanner />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
