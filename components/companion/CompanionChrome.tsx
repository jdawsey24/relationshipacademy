"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GetHelp from "@/components/companion/GetHelp";
import { COMPANION_ENABLED } from "@/lib/companion";

type NavKey = "home" | "process" | "blueprint" | "journey" | "library";
const NAV: { key: NavKey; label: string; href: string; icon: string }[] = [
  { key: "home", label: "Home", href: "/companion", icon: "◇" },
  { key: "process", label: "Process", href: "/companion/process", icon: "❯" },
  { key: "blueprint", label: "Blueprint", href: "/companion/blueprint", icon: "▤" },
  { key: "journey", label: "Journey", href: "/companion/journey", icon: "◵" },
  { key: "library", label: "Library", href: "/companion/library", icon: "▣" },
];

// The Companion app shell: mobile-first, warm-ivory, bottom tab nav, and the
// consumer gate (entitlement -> email verify -> onboarding) enforced before any
// app screen renders. Auth/onboarding/welcome pages render WITHOUT this shell.
export default function CompanionChrome({ active, children, hideNav }: { active: NavKey | "none"; children: React.ReactNode; hideNav?: boolean }) {
  const router = useRouter();
  const [gate, setGate] = useState<"loading" | "ok" | "coming_soon">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/companion/profile")
      .then((r) => { if (r.status === 401) { window.location.href = "/companion/login"; throw new Error("unauth"); } return r.json(); })
      .then((d: { hasEntitlement: boolean; emailVerified: boolean; onboarded: boolean; is_staff?: boolean }) => {
        if (cancelled) return;
        // Launch kill-switch: until enabled, only staff may preview the app.
        if (!COMPANION_ENABLED && !d.is_staff) return setGate("coming_soon");
        if (!d.hasEntitlement) return router.replace("/companion/welcome");
        if (!d.emailVerified) return router.replace("/companion/verify");
        if (!d.onboarded) return router.replace("/companion/onboarding");
        setGate("ok");
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [router]);

  if (gate === "loading") {
    return <div className="flex min-h-screen items-center justify-center bg-warm-ivory"><p className="font-body text-charcoal/50">Opening your Companion…</p></div>;
  }

  if (gate === "coming_soon") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm-ivory px-6 text-center">
        <div className="max-w-sm">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">The Relationship Companion&trade;</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-midnight-navy">Coming soon</h1>
          <p className="mt-3 font-body leading-relaxed text-charcoal/70">We&apos;re putting the finishing touches on your private space to process what you&apos;re navigating. Check back soon.</p>
          <Link href="/" className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-midnight-navy px-6 font-ui text-sm font-semibold text-white">Back to Relationship Life Cycle</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-ivory">
      <main className={`mx-auto w-full max-w-md px-5 pt-6 ${hideNav ? "pb-10" : "pb-28"}`}>{children}</main>
      <GetHelp />
      {!hideNav && (
        <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-light-gray bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-md items-stretch justify-between px-2">
            {NAV.map((n) => (
              <Link key={n.key} href={n.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 font-ui text-[10px] ${active === n.key ? "text-midnight-navy" : "text-charcoal/45"}`}>
                <span className="text-base leading-none" aria-hidden="true">{n.icon}</span>
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
