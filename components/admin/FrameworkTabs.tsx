"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Phases", href: "/admin/framework/phases" },
  { label: "Domains", href: "/admin/framework/domains" },
];

export default function FrameworkTabs() {
  const pathname = usePathname();
  return (
    <div className="mb-6 flex flex-wrap items-center gap-1 border-b border-light-gray">
      {TABS.map((t) => {
        const active = pathname === t.href || pathname.startsWith(t.href + "/");
        return (
          <Link key={t.href} href={t.href}
            className={`-mb-px border-b-2 px-4 py-2 text-sm ${active ? "border-midnight-navy font-semibold text-midnight-navy" : "border-transparent text-charcoal/60 hover:text-charcoal"}`}>
            {t.label}
          </Link>
        );
      })}
      {["Quotes", "Glossary", "Definitions"].map((s) => (
        <span key={s} className="-mb-px cursor-default border-b-2 border-transparent px-4 py-2 text-sm text-charcoal/30" title="Coming soon">{s}</span>
      ))}
    </div>
  );
}
