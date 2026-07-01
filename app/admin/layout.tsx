"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

// Admin is a plain working tool: white background, Inter throughout, navy nav.
// Sidebar is organized as an "operating system" for the RLC ecosystem. Sections
// not yet built are shown as "Soon" so the structure is visible.

type NavItem = { label: string; href?: string; soon?: boolean; match?: string[] };
const NAV_GROUPS: NavItem[][] = [
  [{ label: "Dashboard", href: "/admin" }],
  [
    { label: "Website", soon: true },
    { label: "Framework", soon: true },
    { label: "Assessment", href: "/admin/assessment", match: ["/admin/questions", "/admin/copy", "/admin/assessment"] },
    { label: "Knowledge Center", soon: true },
  ],
  [
    { label: "CRM", href: "/admin/crm" },
    { label: "Analytics", href: "/admin/analytics" },
    { label: "Media Library", soon: true },
  ],
  [
    { label: "Users & Permissions", soon: true },
    { label: "Settings", href: "/admin/settings" },
  ],
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-white font-ui text-charcoal">{children}</div>;
  }

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function isActive(item: NavItem) {
    const href = item.href!;
    if (href === "/admin") return pathname === "/admin";
    const prefixes = item.match ?? [href];
    return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
  }

  return (
    <div className="min-h-screen bg-white font-ui text-charcoal md:flex">
      <nav className="bg-midnight-navy text-white md:flex md:min-h-screen md:w-56 md:shrink-0 md:flex-col">
        <div className="border-b border-white/10 px-5 py-4">
          <span className="font-ui text-sm font-semibold uppercase tracking-wide">RLC Admin</span>
        </div>
        <div className="flex gap-4 overflow-x-auto px-3 py-2 md:flex-1 md:flex-col md:gap-0 md:overflow-visible md:px-3 md:py-4">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className="flex gap-1 md:flex-col md:gap-0.5">
              {gi > 0 && <div className="hidden md:my-2 md:block md:h-px md:bg-white/10" />}
              {group.map((item) =>
                item.soon ? (
                  <span
                    key={item.label}
                    className="flex items-center justify-between whitespace-nowrap rounded-md px-3 py-2 text-sm text-white/40"
                    title="Coming soon"
                  >
                    {item.label}
                    <span className="ml-2 hidden rounded bg-white/10 px-1.5 py-0.5 text-[9px] uppercase md:inline">Soon</span>
                  </span>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href!}
                    className={`block whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive(item)
                        ? "bg-white/15 font-semibold text-white md:border-l-2 md:border-white"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={signOut}
            className="whitespace-nowrap rounded-md px-3 py-2 text-left text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white md:mt-4"
          >
            Sign out
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-x-auto px-5 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
