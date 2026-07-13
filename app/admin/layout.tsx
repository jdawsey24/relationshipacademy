"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";
import { RoleProvider, type AdminRole } from "@/components/admin/RoleContext";
import StudioAssistant from "@/components/admin/StudioAssistant";

// Admin is a plain working tool: white background, Inter throughout, navy nav.
// Sidebar is organized as an "operating system" for the RLC ecosystem. Sections
// not yet built are shown as "Soon" so the structure is visible.

type NavItem = { label: string; href?: string; soon?: boolean; match?: string[]; ownerOnly?: boolean };
const NAV_GROUPS: NavItem[][] = [
  [{ label: "Dashboard", href: "/admin" }],
  [
    // RLC Studio is the primary authoring environment. AI is embedded inside it
    // (contextual), so there is no separate top-level "AI Studio" destination —
    // the preserved AI Authoring Studio is reached via RLC Studio → AI Services.
    { label: "RLC Studio", href: "/admin/studio", match: ["/admin/studio", "/admin/ai"] },
    { label: "Website", href: "/admin/website" },
    // The old "/admin/framework" edits public-site phase/domain CARD copy — it is
    // website content, NOT the canonical RLC Framework (which lives in RLC Studio).
    { label: "Website Content", href: "/admin/framework" },
    { label: "Assessment", href: "/admin/assessment", match: ["/admin/questions", "/admin/copy", "/admin/assessment"] },
    { label: "Knowledge Center", href: "/admin/knowledge-center" },
    { label: "Academy", href: "/admin/academy" },
    { label: "Institute", href: "/admin/institute" },
    { label: "Live Sessions", href: "/admin/live" },
  ],
  [
    { label: "CRM", href: "/admin/crm" },
    { label: "Analytics", href: "/admin/analytics" },
    { label: "Media Library", href: "/admin/media" },
  ],
  [
    { label: "Finance", href: "/admin/finance", ownerOnly: true },
    { label: "Security", href: "/admin/security" },
    { label: "Users & Permissions", href: "/admin/users", ownerOnly: true },
    { label: "Audit Log", href: "/admin/audit", ownerOnly: true },
    { label: "Settings", href: "/admin/settings", ownerOnly: true },
  ],
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<AdminRole>(null);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    fetch("/api/admin/me").then((r) => r.json()).then((d) => setRole(d.role)).catch(() => {});
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-white font-ui text-charcoal">{children}</div>;
  }

  const isOwner = role === "owner";
  const isViewer = role === "viewer";
  const groups = NAV_GROUPS
    .map((g) => g.filter((it) => !it.ownerOnly || isOwner))
    .filter((g) => g.length > 0);

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
          {groups.map((group, gi) => (
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

      <RoleProvider value={role}>
        <StudioAssistant>
          <main className="flex-1 overflow-x-auto px-5 py-6 md:px-8 md:py-8">
            {isViewer && (
              <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
                <span className="font-semibold">Read-only access.</span> You can view everything here, but saving, uploading, and deleting are disabled for your role.
              </div>
            )}
            {children}
          </main>
        </StudioAssistant>
      </RoleProvider>
    </div>
  );
}
