// Email-verification gate. Shown to an entitled user whose email isn't confirmed
// yet. Resend + verification flow copy is placeholder; wired in Phase 4 alongside
// the post-purchase account-access step.
export default function CompanionVerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-ivory px-6 text-center">
      <div className="max-w-sm">
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Relationship Companion</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-midnight-navy">Verify your email</h1>
        <p className="mt-3 font-body text-charcoal/70">[VERIFICATION COPY TO BE PROVIDED] — check your inbox for a confirmation link, then reopen the Companion.</p>
      </div>
    </main>
  );
}
