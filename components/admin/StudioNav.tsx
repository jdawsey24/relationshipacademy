"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminRole } from "@/components/admin/RoleContext";

// Primary navigation for RLC Studio — the authoring environment. Replaces the old
// flat StudioTabs. The Framework is the canonical source of truth; the Competency
// Workspace is the operational hub. AI is embedded (contextual) and "AI Services"
// links to the preserved AI Authoring Studio (owner-only). Hardcoded link list so
// no server-only lib leaks into the client bundle.
const TABS: { label: string; href: string; ownerOnly?: boolean; match: (p: string) => boolean }[] = [
  { label: "Overview", href: "/admin/studio", match: (p) => p === "/admin/studio" || p.startsWith("/admin/studio/objects") || p.startsWith("/admin/studio/preview") },
  { label: "Framework", href: "/admin/studio/framework", match: (p) => p.startsWith("/admin/studio/framework") || p.startsWith("/admin/studio/competency") || p.startsWith("/admin/studio/kb") },
  { label: "Assessments", href: "/admin/studio/assessment", match: (p) => p.startsWith("/admin/studio/assessment") },
  { label: "Content Library", href: "/admin/studio/library", match: (p) => p.startsWith("/admin/studio/library") },
  { label: "Assets", href: "/admin/studio/assets", match: (p) => p.startsWith("/admin/studio/assets") },
  { label: "Publishing", href: "/admin/studio/publishing", match: (p) => p.startsWith("/admin/studio/publishing") },
  { label: "Review Queue", href: "/admin/studio/review", match: (p) => p.startsWith("/admin/studio/review") },
  { label: "AI Services", href: "/admin/ai", ownerOnly: true, match: (p) => p.startsWith("/admin/ai") },
];

export default function StudioNav() {
  const pathname = usePathname();
  const role = useAdminRole();
  const isOwner = role === "owner";
  const tabs = TABS.filter((t) => !t.ownerOnly || isOwner);
  return (
    <div className="mb-6 flex flex-wrap gap-1 border-b border-light-gray">
      {tabs.map((t) => {
        const active = t.match(pathname);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "border-midnight-navy text-midnight-navy"
                : "border-transparent text-charcoal/60 hover:text-midnight-navy"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
