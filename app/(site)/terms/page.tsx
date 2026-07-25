import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { LEGAL_DOCS } from "@/lib/legal/documents";

const doc = LEGAL_DOCS["terms"];

export const metadata: Metadata = {
  title: "Terms of Use | Symmetricly",
  description: "The terms governing your access to and use of Symmetricly's consumer relationship-education and wellness services.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title={doc.title}
      effectiveDate={doc.effectiveDate}
      lastUpdated={doc.lastUpdated}
      markdown={doc.markdown}
      related={[
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Refund & Cancellation Policy", href: "/refund" },
        { label: "Relationship Companion Informed Use & Safety Disclosure", href: "/relationship-companion/informed-use" },
      ]}
    />
  );
}
