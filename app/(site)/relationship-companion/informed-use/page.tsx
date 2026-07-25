import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import {
  DISCLOSURE_INTRO, DISCLOSURE_SECTIONS, DISCLOSURE_VERSION, type Block,
} from "@/lib/companion/disclosures";

// Public, canonical copy of the Informed Use & Safety Disclosure. Renders from the
// SAME source (lib/companion/disclosures.ts, version-tracked) that the in-app
// acceptance gate presents and records — so this page and the gate never diverge.

export const metadata: Metadata = {
  title: "Relationship Companion Informed Use & Safety Disclosure | Symmetricly",
  description: "What the Relationship Companion is and is not, how automated safety detection works and its limits, before you begin.",
};

function blockToMarkdown(b: Block): string {
  if (Array.isArray(b)) return b.map((li) => `- ${li}`).join("\n");
  return b;
}

function buildMarkdown(): string {
  const parts: string[] = [DISCLOSURE_INTRO];
  for (const s of DISCLOSURE_SECTIONS) {
    parts.push(`## ${s.heading}`);
    for (const b of s.blocks) parts.push(blockToMarkdown(b));
  }
  return parts.join("\n\n");
}

export default function CompanionInformedUsePage() {
  return (
    <LegalPage
      title="Relationship Companion — Informed Use & Safety Disclosure"
      effectiveDate="July 25, 2026"
      lastUpdated={`Version ${DISCLOSURE_VERSION}`}
      markdown={buildMarkdown()}
      related={[
        { label: "Companion Privacy Disclosure", href: "/relationship-companion/privacy" },
        { label: "Crisis & Safety Disclaimer", href: "/relationship-companion/crisis" },
        { label: "Symmetricly Privacy Policy", href: "/privacy" },
        { label: "Terms of Use", href: "/terms" },
      ]}
    />
  );
}
