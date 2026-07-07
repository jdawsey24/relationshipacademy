"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// The Professional Institute has its own chrome — deliberately more formal and
// institutional than the warm consumer Academy: a navy masthead, structured nav.
const NAV = [
  { label: "CE Courses", href: "/institute/ce-courses" },
  { label: "Workshops", href: "/institute/workshops" },
  { label: "Certifications", href: "/institute/certifications" },
  { label: "Professional Resources", href: "/institute/professional-resources" },
  { label: "Research", href: "/institute/research" },
  { label: "Events", href: "/institute/events" },
];

export default function InstituteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

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
            <Link
              href="/"
              className="hidden shrink-0 font-ui text-sm text-white/70 transition-colors hover:text-white sm:block"
            >
              relationshiplc.com →
            </Link>
          </div>

          <nav className="-mx-1 flex items-center gap-1 overflow-x-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 font-ui text-sm transition-colors ${
                  isActive(item.href)
                    ? "bg-white text-midnight-navy"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
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
