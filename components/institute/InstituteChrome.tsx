"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseBrowser";

// The Professional Institute has its own chrome — deliberately more formal and
// institutional than the warm consumer Academy: a navy masthead, structured nav,
// and an auth-aware control (Professional login vs. account).
const NAV = [
  { label: "CE Courses", href: "/institute/ce-courses" },
  { label: "Workshops", href: "/institute/workshops" },
  { label: "Certifications", href: "/institute/certifications" },
  { label: "Professional Resources", href: "/institute/professional-resources" },
  { label: "Research", href: "/institute/research" },
  { label: "Events", href: "/institute/events" },
];

// Auth pages render bare (no masthead) like the Academy's.
const BARE_PATHS = new Set(["/institute/login", "/institute/signup", "/institute/reset-password"]);

interface Me { authenticated: boolean; name: string | null; email: string; isProfessional: boolean }

export default function InstituteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const bare = BARE_PATHS.has(pathname);

  useEffect(() => {
    if (bare) return;
    fetch("/api/institute/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.authenticated && setMe(d))
      .catch(() => {});
  }, [bare, pathname]);

  if (bare) return <div className="min-h-screen bg-warm-ivory">{children}</div>;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    router.push("/institute");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-white font-body text-charcoal">
      <header className="bg-midnight-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="/institute" className="flex items-center gap-3" aria-label="Professional Institute home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mark.png" alt="" className="h-9 w-auto" />
              <span className="font-display text-lg font-semibold leading-tight">
                Relationship Life Cycle<sup className="text-[0.5em]">™</sup>
                <span className="block font-ui text-[11px] font-normal uppercase tracking-[0.22em] text-white/70">
                  Professional Institute
                </span>
              </span>
            </Link>

            {/* Auth control */}
            {me?.authenticated && me.isProfessional ? (
              <div className="flex shrink-0 items-center gap-4 font-ui text-sm">
                <Link href="/institute/dashboard" className="text-white/80 hover:text-white">Dashboard</Link>
                <Link href="/institute/live" className="text-white/80 hover:text-white">Live</Link>
                <Link href="/institute/account" className="text-white/80 hover:text-white">Account</Link>
                <button type="button" onClick={signOut} className="text-white/60 hover:text-white">Sign out</button>
              </div>
            ) : (
              <Link href="/institute/login" className="shrink-0 rounded-full border border-white/40 px-4 py-1.5 font-ui text-sm text-white transition-colors hover:bg-white/10">
                Professional Login
              </Link>
            )}
          </div>

          <nav className="-mx-1 flex items-center gap-1 overflow-x-auto">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 font-ui text-sm transition-colors ${
                  isActive(item.href) ? "bg-white text-midnight-navy" : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-20 border-t border-midnight-navy/10 bg-warm-ivory/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-center md:flex-row md:px-8 md:text-left">
          <p className="font-ui text-sm text-charcoal/60">
            Relationship Life Cycle™ Professional Institute — professional education for helping professionals.
          </p>
          <div className="flex gap-5 font-ui text-sm">
            <Link href="/institute" className="text-midnight-navy hover:underline">Institute home</Link>
            <Link href="/academy" className="text-midnight-navy hover:underline">Consumer Academy</Link>
            <Link href="/" className="text-midnight-navy hover:underline">Main site</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
