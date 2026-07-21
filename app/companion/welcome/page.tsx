import Link from "next/link";

// Post-purchase access flow + un-entitled landing. After a successful purchase the
// checkout redirects here with ?purchase=success: confirm access, then "Open My
// Relationship Companion" (which passes the gate once the grant has processed).
// Copy is placeholder. Never implies a downloadable file.

function Medallion({ paths, tone = "navy" }: { paths: string[]; tone?: "navy" | "success" }) {
  const cls = tone === "success" ? "bg-[#5F9E7C]/12 text-[#5F9E7C]" : "bg-midnight-navy/[0.07] text-midnight-navy";
  return (
    <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${cls}`}>
      <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {paths.map((d, i) => <path key={i} d={d} />)}
      </svg>
    </span>
  );
}

export default async function CompanionWelcomePage({ searchParams }: { searchParams: Promise<{ purchase?: string }> }) {
  const { purchase } = await searchParams;
  const success = purchase === "success";

  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-ivory px-6 text-center">
      <div className="max-w-sm">
        {success ? (
          <>
            <Medallion tone="success" paths={["M9 12l2 2 4-4", "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"]} />
            <p className="mt-5 font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Relationship Companion</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-midnight-navy">You&apos;re all set</h1>
            <p className="mt-3 font-body leading-relaxed text-charcoal/70">Your access is active and everything&rsquo;s ready. The Companion opens right here in your browser — add it to your Home Screen and it works just like an app, always a tap away.</p>
            <Link href="/companion" className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-sm font-semibold text-white transition-opacity hover:opacity-95">Open My Relationship Companion</Link>
            <p className="mt-4 font-body text-xs text-charcoal/45">Get instant access to your Relationship Companion.</p>
          </>
        ) : (
          <>
            <Medallion paths={["M8 11V8a4 4 0 0 1 8 0", "M6 11h12v9H6z", "M12 15v2"]} />
            <p className="mt-5 font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Relationship Companion</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-midnight-navy">Companion access isn&apos;t active yet</h1>
            <p className="mt-3 font-body leading-relaxed text-charcoal/70">This account doesn&apos;t include the Relationship Companion yet. Once it&apos;s part of your membership, it&apos;ll open right here — no download needed.</p>
          </>
        )}
      </div>
    </main>
  );
}
