import Link from "next/link";
import Logo from "@/components/Logo";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Assessment", href: "/assessment" },
  { label: "The Framework", href: "/framework" },
  { label: "Learn", href: "/learn" },
  { label: "For Professionals", href: "/professionals" },
  { label: "Speaking", href: "/speaking" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/theejanellexoxo",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@theejanellexoxo",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.5 3c.3 2.1 1.6 3.6 3.5 3.9v2.4c-1.3.1-2.5-.3-3.6-.9v5.9c0 3-2.2 5.2-5 5.2-2.7 0-4.9-2-4.9-4.7 0-2.8 2.4-4.9 5.4-4.5v2.5c-.4-.1-.8-.2-1.2-.1-1.1.1-1.9 1-1.8 2.2.1 1.1 1 1.9 2.1 1.8 1.2 0 2-1 2-2.3V3h3.5z" />
      </svg>
    ),
  },
];

export default function SiteFooter() {
  const year = 2026;
  return (
    <footer className="bg-warm-ivory px-6 py-14">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <Logo variant="full" href="/" className="h-11" />

        <nav className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-ui text-sm text-charcoal/70 transition-colors hover:text-midnight-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex gap-4">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-midnight-navy/30 text-midnight-navy/70 transition-colors hover:border-midnight-navy hover:text-midnight-navy"
            >
              {s.icon}
            </a>
          ))}
        </div>

        <div className="mt-8 h-px w-full max-w-xs bg-light-gray" />

        <p className="mt-6 font-body text-xs text-charcoal/50">
          © {year} Relationship Life Cycle™ | A Symmetricly Framework
        </p>
        <p className="mt-1 font-body text-xs text-charcoal/50">
          Developed by Janelle Dawsey, LMFT
        </p>
      </div>
    </footer>
  );
}
