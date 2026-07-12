"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Sub-nav for the Content & Assessment Studio. Hardcoded link list (like the
// other admin Tabs components) so no server-only lib leaks into the client bundle.
const TABS = [
  { label: "Registry", href: "/admin/studio", match: ["/admin/studio"] },
  { label: "Knowledge Base", href: "/admin/studio/kb", match: ["/admin/studio/kb"] },
  { label: "Assessments", href: "/admin/studio/assessment", match: ["/admin/studio/assessment"] },
  { label: "Library", href: "/admin/studio/library", match: ["/admin/studio/library"] },
  { label: "Assets", href: "/admin/studio/assets", match: ["/admin/studio/assets"] },
];

export default function StudioTabs() {
  const pathname = usePathname();
  function active(t: (typeof TABS)[number]) {
    // KB + Assessments own their own subtrees; Registry covers the root plus the
    // object/preview workspaces.
    if (t.href === "/admin/studio/assets") return pathname.startsWith("/admin/studio/assets");
    if (t.href === "/admin/studio/library") return pathname.startsWith("/admin/studio/library");
    if (t.href === "/admin/studio/assessment") return pathname.startsWith("/admin/studio/assessment");
    if (t.href === "/admin/studio/kb") return pathname.startsWith("/admin/studio/kb");
    return pathname === "/admin/studio" || pathname.startsWith("/admin/studio/objects") || pathname.startsWith("/admin/studio/preview");
  }
  return (
    <div className="mb-6 flex gap-1 border-b border-light-gray">
      {TABS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
            active(t)
              ? "border-midnight-navy text-midnight-navy"
              : "border-transparent text-charcoal/60 hover:text-midnight-navy"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
