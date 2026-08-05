"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";

// Stripe's embedded Checkout, rendered inside the sales page instead of sending
// people to Stripe's hosted page. The CTA stays a plain button until it's pressed
// — nothing loads Stripe on page view.
//
// Access still attaches to an account, so a signed-out visitor is sent to the
// neutral /account doorway and returned here to complete. (Guest checkout — pay
// first, account created from the Stripe email — is approved but not built yet.)

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

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

  function start() {
    setErr(null);
    // Ownership attaches to an account — send a signed-out buyer to sign in first
    // and bring them straight back to this page (with ?s= intact).
    if (access && !access.signedIn) {
      const here = window.location.pathname + window.location.search;
      window.location.href = `/account/login?next=${encodeURIComponent(here)}`;
      return;
    }
    setStarting(true);
    setOpen(true);
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

  if (!open || !stripePromise) {
    return (
      <div className="flex flex-col items-center gap-3">
        <button onClick={start} disabled={starting}
          className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60">
          {starting ? "Opening checkout…" : buyLabel}
        </button>
        {err && <p className="font-body text-sm text-coral-rose">{err}</p>}
        {!stripePromise && open && (
          <p className="font-body text-sm text-coral-rose">Payment isn&apos;t available right now.</p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <p className="mb-5 text-center font-body text-base text-charcoal/70">
        <strong className="text-midnight-navy">{playbookName}</strong> — complete your purchase below and it&apos;s
        added to your library right away.
      </p>
      <div className="overflow-hidden rounded-2xl border border-midnight-navy/10 bg-white p-2">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
      <p className="mt-4 text-center font-body text-sm text-charcoal/45">Secure payment by Stripe</p>
    </div>
  );
}
