"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/Logo";

// Simplified landing header: transparent over the hero, becomes a solid ivory bar
// on scroll. Nav anchors to on-page sections; the CTA always starts the Snapshot.
// On mobile the nav collapses — the sticky bottom CTA carries conversion.
const LINKS = [
  { label: "About the Snapshot", href: "#about" },
  { label: "How It Works", href: "#how" },
  { label: "FAQ", href: "#faq" },
];

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled ? "border-b border-light-gray/70 bg-warm-ivory/90 backdrop-blur" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Logo variant="full" href="/" className="h-8" />
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="font-ui text-sm text-charcoal/75 transition-colors hover:text-midnight-navy">{l.label}</a>
          ))}
          <a href="/snapshot/intro" className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-midnight-navy px-6 font-ui text-sm font-medium text-white transition-colors hover:bg-midnight-navy/90">
            Take the Snapshot
          </a>
        </nav>
      </div>
    </header>
  );
}
