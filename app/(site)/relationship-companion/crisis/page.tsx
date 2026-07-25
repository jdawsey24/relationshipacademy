import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { LEGAL_DOCS } from "@/lib/legal/documents";

const doc = LEGAL_DOCS["crisis"];

export const metadata: Metadata = {
  title: "Relationship Companion Crisis & Safety Disclaimer | Symmetricly",
  description: "What the Relationship Companion's automated safety features can and cannot do, and where to get help now.",
};

export default function CompanionCrisisDisclaimerPage() {
  return (
    <LegalPage
      title={doc.title}
      effectiveDate={doc.effectiveDate}
      markdown={doc.markdown}
      related={[
        { label: "Informed Use & Safety Disclosure", href: "/relationship-companion/informed-use" },
        { label: "Companion Privacy Disclosure", href: "/relationship-companion/privacy" },
        { label: "Symmetricly Privacy Policy", href: "/privacy" },
        { label: "Terms of Use", href: "/terms" },
      ]}
    />
  );
}
