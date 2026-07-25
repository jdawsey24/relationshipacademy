import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { LEGAL_DOCS } from "@/lib/legal/documents";

const doc = LEGAL_DOCS["refund"];

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Symmetricly",
  description: "The general rules governing refunds, cancellations, duplicate payments, subscriptions, and access to Symmetricly's paid products.",
};

export default function RefundPage() {
  return (
    <LegalPage
      title={doc.title}
      effectiveDate={doc.effectiveDate}
      lastUpdated={doc.lastUpdated}
      markdown={doc.markdown}
      related={[
        { label: "Terms of Use", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ]}
    />
  );
}
