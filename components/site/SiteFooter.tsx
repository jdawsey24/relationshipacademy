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

// Social placeholders — admin will fill real URLs later.
const SOCIALS = ["Instagram", "Facebook", "LinkedIn"];

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
            <span
              key={s}
              aria-label={s}
              title={`${s} (coming soon)`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-midnight-navy/30 text-midnight-navy/60"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
              </svg>
            </span>
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
