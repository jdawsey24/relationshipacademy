import Link from "next/link";

// Post-purchase access flow + un-entitled landing. After a successful purchase the
// checkout redirects here with ?purchase=success: confirm access, then "Open My
// Relationship Companion" (which passes the gate once the grant has processed).
// Copy is placeholder. Never implies a downloadable file.
export default async function CompanionWelcomePage({ searchParams }: { searchParams: Promise<{ purchase?: string }> }) {
  const { purchase } = await searchParams;
  const success = purchase === "success";

  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-ivory px-6 text-center">
      <div className="max-w-sm">
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Relationship Companion</p>
        {success ? (
          <>
            <h1 className="mt-2 font-display text-3xl font-semibold text-midnight-navy">You&apos;re all set</h1>
            <p className="mt-3 font-body text-charcoal/70">[APPROVED CONFIRMATION COPY TO BE PROVIDED] — Your access is activated. It opens in your phone&rsquo;s browser, and you can add it to your Home Screen so it works like an app.</p>
            <Link href="/companion" className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-sm font-semibold text-white">Open My Relationship Companion</Link>
            <p className="mt-4 font-body text-xs text-charcoal/45">Get instant access to your Relationship Companion.</p>
          </>
        ) : (
          <>
            <h1 className="mt-2 font-display text-3xl font-semibold text-midnight-navy">[APPROVED ACCESS COPY TO BE PROVIDED]</h1>
            <p className="mt-3 font-body text-charcoal/70">Your account doesn&apos;t have Companion access yet. The purchase flow arrives with commerce setup.</p>
          </>
        )}
      </div>
    </main>
  );
}
