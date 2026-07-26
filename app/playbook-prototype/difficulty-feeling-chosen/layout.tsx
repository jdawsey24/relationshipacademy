import Logo from "@/components/Logo";

// Minimal standalone shell for the Difficulty Feeling Chosen Playbook PROTOTYPE
// (its own chrome, no global site nav) — mirrors the Snapshot quiz shell.
// This is a review prototype at /playbook-prototype/difficulty-feeling-chosen and is
// NOT the production paid Playbook; production wiring (entitlement gate + Supabase
// persistence) is a follow-up.
export const metadata = { title: "Playbook Prototype — Moving Beyond Rejection" };

export default function PlaybookPrototypeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-ivory font-body text-charcoal">
      <header className="flex items-center justify-between px-6 pt-6">
        <Logo variant="full" href="/" className="h-8" />
        <span className="rounded-full bg-midnight-navy/5 px-3 py-1 font-ui text-[11px] uppercase tracking-wide text-charcoal/50">
          Prototype
        </span>
      </header>
      {children}
    </div>
  );
}
