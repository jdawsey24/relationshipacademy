import type { Metadata, Viewport } from "next";

// The Companion is a private authenticated area — never indexed. PWA manifest +
// installable Home-Screen metadata land in Phase 4; standalone-friendly basics here.
export const metadata: Metadata = {
  title: "Relationship Companion",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Companion" },
};
export const viewport: Viewport = { themeColor: "#F7F4EF", width: "device-width", initialScale: 1, maximumScale: 1 };

export default function CompanionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
