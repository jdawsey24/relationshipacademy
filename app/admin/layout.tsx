"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

// Admin is a plain working tool: white background, Inter throughout, navy nav.
// Deliberately none of the quiz's editorial styling.

const NAV = [
  { label: "Leads", href: "/admin/leads" },
  { label: "Result Copy", href: "/admin/copy" },
  { label: "Questions", href: "/admin/questions" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Login page renders bare (no nav chrome).
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-white font-ui text-charcoal">{children}</div>;
  }

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-white font-ui text-charcoal md:flex">
      {/* Sidebar (desktop) / top bar (mobile) */}
      <nav className="bg-midnight-navy text-white md:flex md:min-h-screen md:w-56 md:flex-col md:shrink-0">
        <div className="border-b border-white/10 px-5 py-4 md:border-b-0">
          <span className="font-ui text-sm font-semibold uppercase tracking-wide">
            RLC Admin
          </span>
        </div>
        <ul className="flex gap-1 overflow-x-auto px-3 py-2 md:flex-1 md:flex-col md:gap-0.5 md:px-3 md:py-4">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-white/15 font-semibold text-white md:border-l-2 md:border-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="md:mt-auto">
            <button
              type="button"
              onClick={signOut}
              className="block w-full whitespace-nowrap rounded-md px-3 py-2 text-left text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              Sign out
            </button>
          </li>
        </ul>
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-x-auto px-5 py-6 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}
