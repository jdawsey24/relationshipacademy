import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { LEGAL_DOCS } from "@/lib/legal/documents";

const doc = LEGAL_DOCS["companion-privacy"];

export const metadata: Metadata = {
  title: "Relationship Companion Privacy Disclosure | Symmetricly",
  description: "How information is handled when you use the Relationship Companion. Supplements the Symmetricly Privacy Policy.",
};

export default function CompanionPrivacyDisclosurePage() {
  return (
    <LegalPage
      title={doc.title}
      effectiveDate={doc.effectiveDate}
      lastUpdated={doc.lastUpdated}
      markdown={doc.markdown}
      related={[
        { label: "Informed Use & Safety Disclosure", href: "/relationship-companion/informed-use" },
        { label: "Crisis & Safety Disclaimer", href: "/relationship-companion/crisis" },
        { label: "Symmetricly Privacy Policy", href: "/privacy" },
        { label: "Terms of Use", href: "/terms" },
      ]}
    />
  );
}
