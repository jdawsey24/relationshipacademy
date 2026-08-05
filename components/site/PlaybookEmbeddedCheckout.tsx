"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Stripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";

// Stripe's embedded Checkout, rendered inside the sales page instead of sending
// people to Stripe's hosted page. The CTA stays a plain button until it's pressed
// — nothing loads Stripe on page view.
//
// No sign-in required (owner decision 2026-08-04): a guest pays first, and the
// webhook creates their account from the email Stripe collected, so the Playbook
// is already waiting when they set a password. Signed-in buyers are unchanged —
// the purchase attaches straight to their account.

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

// Load Stripe.js only when someone actually presses buy, and memoize it. Imported
// lazily (not at module scope) so the script isn't fetched on page view.
let stripeJs: Promise<Stripe | null> | null = null;
function getStripeJs(): Promise<Stripe | null> {
  if (!publishableKey) return Promise.resolve(null);
  if (!stripeJs) {
    stripeJs = import("@stripe/stripe-js")
      .then((m) => m.loadStripe(publishableKey))
      .catch(() => null);
    // A rejected memo would poison every later attempt; reset so a retry can work
    // (this is the offline / blocked-script / ad-blocker case).
    stripeJs.then((s) => { if (!s) stripeJs = null; });
  }
  return stripeJs;
}

interface Access { signedIn: boolean; interactive: boolean; owned: boolean }

export default function PlaybookEmbeddedCheckout({
  clusterId,
  slug,
  sessionId,
  buyLabel,
  playbookName,
}: {
  clusterId: number;
  slug: string;
  sessionId?: string;
  buyLabel: string;
  playbookName: string;
}) {
  const [access, setAccess] = useState<Access | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/playbook/${encodeURIComponent(slug)}/access`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive && d) setAccess(d as Access); })
      .catch(() => { /* leave undefined — falls back to the buy button */ });
    return () => { alive = false; };
  }, [slug]);

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch("/api/playbooks/checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionId ? { cluster_id: clusterId, session_id: sessionId } : { cluster_id: clusterId }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok || !d.client_secret) throw new Error(d.error ?? "Could not start checkout.");
    return d.client_secret as string;
  }, [clusterId, sessionId]);

  // Fall back to Stripe's own hosted page when the embedded script can't load
  // (blocked, offline, ad-blocker). Losing the in-page experience is fine; losing
  // the sale is not.
  const startHosted = useCallback(async () => {
    try {
      const res = await fetch("/api/playbooks/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionId ? { cluster_id: clusterId, session_id: sessionId } : { cluster_id: clusterId }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.url) { window.location.href = d.url as string; return true; }
    } catch { /* fall through to the error message */ }
    return false;
  }, [clusterId, sessionId]);

  async function start() {
    setErr(null);
    setStarting(true);
    const stripe = await getStripeJs();
    if (stripe) { setOpen(true); return; }
    if (await startHosted()) return; // navigating away; leave the button busy
    setStarting(false);
    setErr("We couldn't open the payment form. Please check your connection or disable your ad blocker, then try again.");
  }

  // Already owns it — send them to the Playbook instead of selling it again.
  if (access?.owned && access.interactive) {
    return (
      <div className="text-center">
        <p className="font-body text-charcoal/70">You already have this one.</p>
        <Link href={`/playbook/${slug}`}
          className="mt-4 inline-flex min-h-[52px] items-center justify-center rounded-full bg-coral-rose px-8 font-ui text-base font-medium text-white transition-colors hover:bg-coral-rose/90">
          Open {playbookName} →
        </Link>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="flex flex-col items-center gap-3">
        <button onClick={start} disabled={starting}
          className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60">
          {starting ? "Opening checkout…" : buyLabel}
        </button>
        {err && <p className="max-w-sm text-center font-body text-sm text-coral-rose">{err}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <p className="mb-5 text-center font-body text-base text-charcoal/70">
        <strong className="text-midnight-navy">{playbookName}</strong> —{" "}
        {access?.signedIn
          ? "complete your purchase below and it's added to your library right away."
          : "complete your purchase below, then set a password and it's waiting in your library."}
      </p>
      <div className="overflow-hidden rounded-2xl border border-midnight-navy/10 bg-white p-2">
        <EmbeddedCheckoutProvider stripe={getStripeJs()} options={{ fetchClientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
      <p className="mt-4 text-center font-body text-sm text-charcoal/45">Secure payment by Stripe</p>
    </div>
  );
}
