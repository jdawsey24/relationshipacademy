// Graceful offline screen (precached by the service worker). No private content
// is ever cached — this is a static shell shown when the network is unavailable.
export const dynamic = "force-static";

export default function CompanionOffline() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-ivory px-6 text-center">
      <div className="max-w-sm">
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Relationship Companion</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-midnight-navy">You&apos;re offline</h1>
        <p className="mt-3 font-body text-charcoal/70">Your reflections are safe and private. Reconnect to the internet to pick up where you left off.</p>
      </div>
    </main>
  );
}
