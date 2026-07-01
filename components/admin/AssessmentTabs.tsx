"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Sub-navigation for the Assessment section of the admin. Links span existing
// routes (questions, result/risk copy) plus versions and analytics.
const TABS = [
  { label: "Questions", href: "/admin/questions" },
  { label: "Result Levels", href: "/admin/copy/result-levels" },
  { label: "Risk Levels", href: "/admin/copy/risk-levels" },
  { label: "Versions", href: "/admin/assessment/versions" },
  { label: "Analytics", href: "/admin/assessment/analytics" },
];

export default function AssessmentTabs() {
  const pathname = usePathname();
  return (
    <div className="mb-6 flex flex-wrap gap-1 border-b border-light-gray">
      {TABS.map((t) => {
        const active = pathname === t.href || pathname.startsWith(t.href + "/");
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`-mb-px border-b-2 px-4 py-2 text-sm ${
              active
                ? "border-midnight-navy font-semibold text-midnight-navy"
                : "border-transparent text-charcoal/60 hover:text-charcoal"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
