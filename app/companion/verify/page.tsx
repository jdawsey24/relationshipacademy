// Email-verification gate. Shown to an entitled user whose email isn't confirmed
// yet. Resend + verification flow copy is placeholder; wired in Phase 4 alongside
// the post-purchase account-access step.
export default function CompanionVerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-ivory px-6 text-center">
      <div className="max-w-sm">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-midnight-navy/[0.07] text-midnight-navy">
          <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 6h16v12H4z" />
            <path d="M4 7l8 6 8-6" />
          </svg>
        </span>
        <p className="mt-5 font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Relationship Companion</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-midnight-navy">Verify your email</h1>
        <p className="mt-3 font-body leading-relaxed text-charcoal/70">[VERIFICATION COPY TO BE PROVIDED] — check your inbox for a confirmation link, then reopen the Companion.</p>
      </div>
    </main>
  );
}
