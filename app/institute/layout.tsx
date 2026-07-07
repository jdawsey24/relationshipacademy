import type { Metadata } from "next";
import InstituteChrome from "@/components/institute/InstituteChrome";

export const metadata: Metadata = {
  title: "Professional Institute | Relationship Life Cycle™",
  description:
    "The Relationship Life Cycle™ Professional Institute — professional training and implementation resources for therapists, coaches, educators, clergy, and other helping professionals.",
  robots: { index: true, follow: true },
};

// The Professional Institute is a separate offering from the consumer Academy —
// its own top-level area, chrome, and branding. Public (no member auth).
export default function InstituteLayout({ children }: { children: React.ReactNode }) {
  return <InstituteChrome>{children}</InstituteChrome>;
}
