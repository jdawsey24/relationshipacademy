"use client";

import { useState } from "react";

// Starts Stripe Checkout for the one-time Companion purchase. Shown on the
// un-entitled welcome screen. Calls POST /api/companion/checkout (which picks the
// right price — base or returning-discount — server-side) and redirects to the
// returned Stripe Checkout URL.
export default function BuyCompanionButton() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function buy() {
    if (busy) return;
    setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/companion/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const d = await r.json().catch(() => ({}));
      if (r.status === 401) { window.location.href = "/companion/login"; return; }
      if (!r.ok || !d.url) { setErr(d.error || "We couldn't start checkout. Please try again."); setBusy(false); return; }
      window.location.href = d.url as string;
    } catch {
      setErr("We couldn't start checkout. Please try again.");
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={buy}
        disabled={busy}
        className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60"
      >
        {busy ? "Starting checkout…" : "Get the Companion — $19.99"}
      </button>
      <p className="mt-3 font-body text-xs text-charcoal/50">
        One-time purchase · $9.99 if you own a Relationship Playbook&trade; or an active Academy membership · secure checkout via Stripe
      </p>
      {err && <p className="mt-3 font-body text-sm text-coral-rose">{err}</p>}
    </>
  );
}
