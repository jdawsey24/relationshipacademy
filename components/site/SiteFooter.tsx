import Link from "next/link";
import Logo from "@/components/Logo";
import { getSiteContentMap, get } from "@/lib/siteContent";

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

function Icon({ kind }: { kind: string }) {
  if (kind === "instagram") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>);
  if (kind === "tiktok") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.5 3c.3 2.1 1.6 3.6 3.5 3.9v2.4c-1.3.1-2.5-.3-3.6-.9v5.9c0 3-2.2 5.2-5 5.2-2.7 0-4.9-2-4.9-4.7 0-2.8 2.4-4.9 5.4-4.5v2.5c-.4-.1-.8-.2-1.2-.1-1.1.1-1.9 1-1.8 2.2.1 1.1 1 1.9 2.1 1.8 1.2 0 2-1 2-2.3V3h3.5z" /></svg>);
  if (kind === "facebook") return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V6h-3c-2 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.5l.5-3H14v-1.5c0-.6.3-1 1-1z" /></svg>);
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 8.5H4V20h2.94V8.5zM5.47 4a1.7 1.7 0 100 3.4 1.7 1.7 0 000-3.4zM20 20h-2.94v-5.6c0-1.5-.55-2.3-1.7-2.3-.9 0-1.4.6-1.65 1.2-.09.2-.11.5-.11.8V20H10.7s.04-9.9 0-11.5h2.94v1.6c.4-.6 1.1-1.5 2.65-1.5 1.9 0 3.36 1.25 3.36 3.95V20z" /></svg>);
}

export default async function SiteFooter() {
  const map = await getSiteContentMap();
  const socials = [
    { kind: "instagram", href: get(map, "settings.social.instagram", "https://instagram.com/theejanellexoxo") },
    { kind: "tiktok", href: get(map, "settings.social.tiktok", "https://tiktok.com/@theejanellexoxo") },
    { kind: "facebook", href: get(map, "settings.social.facebook", "") },
    { kind: "linkedin", href: get(map, "settings.social.linkedin", "") },
  ].filter((s) => s.href);

  return (
    <footer className="bg-warm-ivory px-6 py-14">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <Logo variant="full" href="/" className="h-11" />

        <nav className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="font-ui text-sm text-charcoal/70 transition-colors hover:text-midnight-navy">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex gap-4">
          {socials.map((s) => (
            <a key={s.kind} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.kind}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-midnight-navy/30 text-midnight-navy/70 transition-colors hover:border-midnight-navy hover:text-midnight-navy">
              <Icon kind={s.kind} />
            </a>
          ))}
        </div>

        <div className="mt-8 h-px w-full max-w-xs bg-light-gray" />

        <p className="mt-6 font-body text-xs text-charcoal/50">
          {get(map, "settings.footer_note", "© 2026 Relationship Life Cycle™ | A Symmetricly Framework")}
        </p>
        <p className="mt-1 font-body text-xs text-charcoal/50">Developed by Janelle Dawsey, LMFT</p>
      </div>
    </footer>
  );
}
