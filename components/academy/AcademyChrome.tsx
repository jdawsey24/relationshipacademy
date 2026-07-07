"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

// The member portal chrome: a calm, editorial top bar — deliberately NOT the
// marketing site header and NOT a social feed. Auth/splash pages render bare.

const BARE_PATHS = new Set([
  "/academy",
  "/academy/login",
  "/academy/signup",
  "/academy/reset-password",
  "/academy/professional", // standalone landing (works logged-out and logged-in)
]);

const NAV = [
  { label: "Dashboard", href: "/academy/dashboard" },
  { label: "Courses", href: "/academy/courses" },
  { label: "Journal", href: "/academy/journal" },
  { label: "Workbooks", href: "/academy/workbooks" },
  { label: "Certificates", href: "/academy/certificates" },
  { label: "Community", href: "/academy/community" },
];

interface Me {
  name: string | null;
  email: string;
  tierLabel: string;
  isStaff: boolean;
}

export default function AcademyChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);

  const bare = BARE_PATHS.has(pathname);

  useEffect(() => {
    if (bare) return;
    fetch("/api/academy/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.authenticated && setMe(d))
      .catch(() => {});
  }, [bare, pathname]);

  if (bare) {
    return <div className="min-h-screen bg-warm-ivory">{children}</div>;
  }

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    router.push("/academy/login");
    router.refresh();
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <div className="min-h-screen bg-warm-ivory font-body text-charcoal">
      <header className="sticky top-0 z-40 border-b border-midnight-navy/10 bg-warm-ivory/85 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3 md:px-8">
          <Logo variant="mark" href="/academy/dashboard" className="h-8 shrink-0" />
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 font-ui text-sm transition-colors ${
                  isActive(item.href)
                    ? "bg-midnight-navy text-white"
                    : "text-midnight-navy/70 hover:bg-midnight-navy/5 hover:text-midnight-navy"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/academy/account"
              className="flex items-center gap-2 rounded-full px-2 py-1 text-sm hover:bg-midnight-navy/5"
              title="Account"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-plum/15 font-ui text-xs font-semibold text-plum">
                {(me?.name || me?.email || "•").slice(0, 1).toUpperCase()}
              </span>
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="font-ui text-sm text-midnight-navy/60 hover:text-midnight-navy"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12 print:max-w-none print:p-0">{children}</main>
    </div>
  );
}
