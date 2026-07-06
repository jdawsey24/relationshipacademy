"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Courses", href: "/admin/academy", match: ["/admin/academy", "/admin/academy/courses"] },
  { label: "Members", href: "/admin/academy/members" },
];

export default function AcademyTabs() {
  const pathname = usePathname();
  return (
    <div className="mb-6 flex flex-wrap items-center gap-1 border-b border-light-gray">
      {TABS.map((t) => {
        const prefixes = t.match ?? [t.href];
        const active =
          t.href === "/admin/academy"
            ? pathname === "/admin/academy" || pathname.startsWith("/admin/academy/courses")
            : prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
        return (
          <Link key={t.href} href={t.href}
            className={`-mb-px border-b-2 px-4 py-2 text-sm ${active ? "border-midnight-navy font-semibold text-midnight-navy" : "border-transparent text-charcoal/60 hover:text-charcoal"}`}>
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
