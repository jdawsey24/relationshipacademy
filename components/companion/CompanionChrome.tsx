"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import GetHelp from "@/components/companion/GetHelp";

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
  const [gate, setGate] = useState<"loading" | "ok">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/companion/profile")
      .then((r) => { if (r.status === 401) { window.location.href = "/companion/login"; throw new Error("unauth"); } return r.json(); })
      .then((d: { hasEntitlement: boolean; emailVerified: boolean; onboarded: boolean }) => {
        if (cancelled) return;
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
