import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soumaïla Niampa — Consultant Data & Transformation Digitale",
  description:
    "Ingénieur spécialisé en data, automatisation et transformation digitale. Structuration des données, KPI, reporting.",
  openGraph: {
    title: "Soumaïla Niampa — Consultant Data & Transformation Digitale",
    description:
      "Ingénieur spécialisé en data, automatisation et transformation digitale.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geist.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#F1F2F4] text-[#14161A]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
