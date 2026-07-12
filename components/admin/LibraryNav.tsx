"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LEARNING_TABLES, LIBRARY_ORDER } from "@/lib/studioLibrary";

export default function LibraryNav() {
  const pathname = usePathname();
  const links = [
    { label: "Overview", href: "/admin/studio/library" },
    ...LIBRARY_ORDER.map((t) => ({ label: LEARNING_TABLES[t].label, href: `/admin/studio/library/${t}` })),
  ];
  return (
    <div className="mb-5 flex flex-wrap gap-1.5">
      {links.map((l) => {
        const active = l.href === "/admin/studio/library" ? pathname === l.href : pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
              active ? "bg-midnight-navy text-white" : "border border-light-gray text-charcoal/70 hover:bg-light-gray"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
