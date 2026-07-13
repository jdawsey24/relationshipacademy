"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Dashboard", href: "/admin/ai" },
  { label: "Assessment Builder", href: "/admin/ai/assessment-builder" },
  { label: "Content Builder", href: "/admin/ai/content-builder" },
  { label: "Review Queue", href: "/admin/ai/review" },
  { label: "Review Mode", href: "/admin/ai/review-mode" },
  { label: "Generation History", href: "/admin/ai/history" },
  { label: "Prompt Templates", href: "/admin/ai/templates" },
  { label: "Quality Rules", href: "/admin/ai/quality" },
  { label: "AI Settings", href: "/admin/ai/settings" },
];

export default function AiStudioNav() {
  const pathname = usePathname();
  return (
    <div className="mb-6">
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">AI Authoring Studio</h1>
      <p className="mb-3 text-sm text-charcoal/60">Owner-only drafting + provenance. AI drafts from approved RLC records only, and nothing enters the canonical libraries without your approval.</p>
      <div className="flex flex-wrap gap-1.5 border-b border-light-gray pb-3">
        {TABS.map((t) => {
          const active = t.href === "/admin/ai" ? pathname === t.href : (pathname === t.href || pathname.startsWith(t.href + "/"));
          return (
            <Link key={t.href} href={t.href}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${active ? "bg-midnight-navy text-white" : "border border-light-gray text-charcoal/70 hover:bg-light-gray"}`}>
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
