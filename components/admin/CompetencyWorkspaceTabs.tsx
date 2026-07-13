"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WORKSPACE_TABS } from "@/lib/studioFramework";

// Sub-nav for a Competency Workspace. The workspace is the operational hub — every
// tab manages resources that belong to this one competency. Optional badge counts
// give an at-a-glance sense of what exists.
export default function CompetencyWorkspaceTabs({ code, badges }: { code: string; badges?: Record<string, number> }) {
  const pathname = usePathname();
  const base = `/admin/studio/competency/${encodeURIComponent(code)}`;
  return (
    <div className="mb-6 flex flex-wrap gap-1.5">
      {WORKSPACE_TABS.map((t) => {
        const href = t.seg ? `${base}/${t.seg}` : base;
        const active = t.seg ? pathname === href || pathname.startsWith(href + "/") : pathname === base;
        const badge = badges?.[t.key];
        return (
          <Link
            key={t.key}
            href={href}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              active ? "bg-midnight-navy text-white" : "border border-light-gray text-charcoal/70 hover:bg-light-gray"
            }`}
          >
            {t.label}
            {typeof badge === "number" && badge > 0 && (
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${active ? "bg-white/25 text-white" : "bg-light-gray text-charcoal/60"}`}>{badge}</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
