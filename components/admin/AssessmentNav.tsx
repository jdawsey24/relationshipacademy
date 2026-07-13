"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Instruments", href: "/admin/studio/assessment" },
  { label: "Item Bank", href: "/admin/studio/assessment/items" },
  { label: "Scoring", href: "/admin/studio/assessment/scoring" },
  { label: "Response Models", href: "/admin/studio/assessment/response-models" },
  { label: "Scoring Rules", href: "/admin/studio/assessment/scoring-rules" },
  { label: "Interpretation", href: "/admin/studio/assessment/interpretation-rules" },
  { label: "Results Templates", href: "/admin/studio/assessment/results-templates" },
  { label: "Rec Mappings (KB)", href: "/admin/studio/assessment/recommendation-mappings" },
  { label: "Result Recs (live)", href: "/admin/studio/assessment/recommendations" },
];

export default function AssessmentNav() {
  const pathname = usePathname();
  return (
    <div className="mb-5 flex flex-wrap gap-1.5">
      {LINKS.map((l) => {
        const active = l.href === "/admin/studio/assessment" ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              active ? "bg-midnight-navy text-white" : "border border-light-gray text-charcoal/70 hover:bg-light-gray"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
