"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function KcTabs() {
  const pathname = usePathname();
  const active = pathname.startsWith("/admin/knowledge-center/articles");
  return (
    <div className="mb-6 flex flex-wrap items-center gap-1 border-b border-light-gray">
      <Link href="/admin/knowledge-center/articles"
        className={`-mb-px border-b-2 px-4 py-2 text-sm ${active ? "border-midnight-navy font-semibold text-midnight-navy" : "border-transparent text-charcoal/60 hover:text-charcoal"}`}>
        Articles
      </Link>
      {["Categories", "Resources"].map((s) => (
        <span key={s} className="-mb-px cursor-default border-b-2 border-transparent px-4 py-2 text-sm text-charcoal/30" title="Coming soon">{s}</span>
      ))}
    </div>
  );
}
