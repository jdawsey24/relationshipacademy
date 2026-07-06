import type { Metadata } from "next";
import AcademyChrome from "@/components/academy/AcademyChrome";

export const metadata: Metadata = {
  title: "Academy | Relationship Life Cycle™",
  description:
    "Your private learning home for the Relationship Life Cycle™ — structured courses, reflection, and workbooks.",
  robots: { index: false, follow: false }, // the portal is private; keep it out of search
};

// The Academy lives OUTSIDE the (site) marketing group and the /admin tool, so
// it has its own chrome. Root layout still provides the brand font variables.
export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <AcademyChrome>{children}</AcademyChrome>;
}
