"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Assessment", href: "/assessment" },
  { label: "Playbooks", href: "/playbooks" },
  { label: "The Framework", href: "/framework" },
  { label: "Learn", href: "/learn" },
  { label: "For Professionals", href: "/professionals" },
  { label: "Speaking", href: "/speaking" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  // Transparent only at the very top of the home page.
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change.
  useEffect(() => setMenuOpen(false), [pathname]);

  const textColor = transparent ? "text-midnight-navy" : "text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        transparent ? "bg-transparent" : "bg-midnight-navy shadow-sm"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2" aria-label="Relationship Life Cycle home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" className="h-8 w-auto" />
          <span className={`hidden font-display text-lg font-semibold ${textColor} sm:inline`}>
            Relationship Life Cycle
            <sup className="ml-0.5 text-[0.5em]">™</sup>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.filter((n) => n.href !== "/").map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative font-ui text-sm transition-colors ${textColor} ${
                  active ? "" : "opacity-80 hover:opacity-100"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-coral-rose" />
                )}
              </Link>
            );
          })}
          <Link
            href="/academy"
            className={`rounded-full border px-4 py-1.5 font-ui text-sm transition-colors ${
              transparent
                ? "border-midnight-navy/30 text-midnight-navy hover:bg-midnight-navy/5"
                : "border-white/40 text-white hover:bg-white/10"
            }`}
          >
            Academy
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className={`lg:hidden ${textColor}`}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-midnight-navy px-6 py-5 lg:hidden">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="text-white"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>
          </div>
          <nav className="mt-8 flex flex-col gap-5">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-display text-2xl ${active ? "text-coral-rose" : "text-white"}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/academy" className="mt-2 inline-block rounded-full border border-coral-rose px-5 py-2 font-display text-2xl text-coral-rose">
              Academy
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
