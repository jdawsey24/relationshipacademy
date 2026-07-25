import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { LEGAL_DOCS } from "@/lib/legal/documents";

const doc = LEGAL_DOCS["privacy"];

export const metadata: Metadata = {
  title: "Privacy Policy | Symmetricly",
  description: "How Symmetricly collects, uses, stores, shares, and protects information across our relationship-wellness services.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title={doc.title}
      effectiveDate={doc.effectiveDate}
      lastUpdated={doc.lastUpdated}
      markdown={doc.markdown}
      related={[
        { label: "Terms of Use", href: "/terms" },
        { label: "Refund & Cancellation Policy", href: "/refund" },
        { label: "Relationship Companion Privacy Disclosure", href: "/relationship-companion/privacy" },
      ]}
    />
  );
}
