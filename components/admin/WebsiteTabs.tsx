"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Announcement", href: "/admin/website/announcement" },
  { label: "Home", href: "/admin/website/home" },
  { label: "Framework", href: "/admin/website/framework" },
  { label: "Assessment", href: "/admin/website/assessment" },
  { label: "Professionals", href: "/admin/website/professionals" },
  { label: "Speaking", href: "/admin/website/speaking" },
  { label: "About", href: "/admin/website/about" },
  { label: "Contact", href: "/admin/website/contact" },
];

export default function WebsiteTabs() {
  const pathname = usePathname();
  return (
    <div className="mb-6 flex flex-wrap items-center gap-1 border-b border-light-gray">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link key={t.href} href={t.href}
            className={`-mb-px border-b-2 px-4 py-2 text-sm ${active ? "border-midnight-navy font-semibold text-midnight-navy" : "border-transparent text-charcoal/60 hover:text-charcoal"}`}>
            {t.label}
          </Link>
        );
      })}
      <span className="-mb-px cursor-default border-b-2 border-transparent px-4 py-2 text-sm text-charcoal/30" title="Coming soon">SEO</span>
    </div>
  );
}
