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
  metadataBase: new URL("https://relationshiplc.com"),
  title: "Relationship Snapshot™ | Relationship Life Cycle™",
  description:
    "A free developmental assessment based on the Relationship Life Cycle™ Framework. Understand where your relationship really is.",
  applicationName: "Relationship Life Cycle™",
  icons: { icon: "/favicon.png" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    siteName: "Relationship Life Cycle™",
    type: "website",
    locale: "en_US",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "The Relationship Life Cycle™ — every relationship has a season." }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
  },
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
