"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Result Levels", href: "/admin/copy/result-levels" },
  { label: "Risk Levels", href: "/admin/copy/risk-levels" },
];

export default function CopyTabs() {
  const pathname = usePathname();
  return (
    <div className="mb-6 flex gap-1 border-b border-light-gray">
      {TABS.map((t) => {
        const active = pathname === t.href;
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
