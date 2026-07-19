// Placeholder access screen shown to a signed-in user WITHOUT a Companion
// entitlement. In Phase 4 this becomes the post-purchase confirmation + access
// flow (purchase confirmation -> account access -> onboarding -> launch ->
// Add-to-Home-Screen). Copy is placeholder.
export default function CompanionWelcomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-ivory px-6 text-center">
      <div className="max-w-sm">
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Relationship Companion</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-midnight-navy">[APPROVED ACCESS COPY TO BE PROVIDED]</h1>
        <p className="mt-3 font-body text-charcoal/70">Your account doesn&apos;t have Companion access yet. Purchase and post-purchase access flow arrive in a later phase.</p>
        <p className="mt-6 font-body text-xs text-charcoal/45">Get instant access to your Relationship Companion.</p>
      </div>
    </main>
  );
}
