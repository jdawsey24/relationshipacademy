import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3, Inter } from "next/font/google";
import "./globals.css";

// Display / Headings
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

// Body
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-source-sans",
  display: "swap",
});

// UI / Data
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Relationship Snapshot™ | Relationship Life Cycle™",
  description:
    "A free developmental assessment based on the Relationship Life Cycle™ Framework. Understand where your relationship really is.",
  icons: { icon: "/RLC_favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${sourceSans.variable} ${inter.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
