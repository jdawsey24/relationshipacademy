"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Sub-nav for one assessment instrument: Specification → Measurement Model →
// Assembly (the canonical measurement pipeline). Preserves the existing
// instrument detail page as the Specification tab.
export default function InstrumentSubNav({ id }: { id: string }) {
  const pathname = usePathname();
  const base = `/admin/studio/assessment/instruments/${encodeURIComponent(id)}`;
  const tabs = [
    { label: "Specification", href: base },
    { label: "Measurement Model", href: `${base}/measurement-model` },
    { label: "Assembly", href: `${base}/assembly` },
    { label: "Sandbox", href: `${base}/sandbox` },
    { label: "Publish", href: `${base}/publish` },
  ];
  return (
    <div className="mb-5 flex flex-wrap gap-1.5">
      {tabs.map((t) => {
        const active = t.href === base ? pathname === base : pathname.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${active ? "bg-midnight-navy text-white" : "border border-light-gray text-charcoal/70 hover:bg-light-gray"}`}>
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
