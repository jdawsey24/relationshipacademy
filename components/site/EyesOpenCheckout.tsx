"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import type { Stripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";

// Enrolling in the founding cohort.
//
// One thing here that the Playbook checkout does not need: an email BEFORE
// Stripe opens. A seat is held the moment checkout starts, and a held seat has
// to belong to somebody — otherwise an abandoned cart is an anonymous hole in a
// cohort of fifteen. So the address is collected first, the seat is held
// against it, and Stripe pre-fills it.
//
// Stripe.js is loaded only when she presses the button, not on page view.

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

let stripeJs: Promise<Stripe | null> | null = null;
function getStripeJs(): Promise<Stripe | null> {
  if (!publishableKey) return Promise.resolve(null);
  if (!stripeJs) {
    stripeJs = import("@stripe/stripe-js").then((m) => m.loadStripe(publishableKey)).catch(() => null);
    // A rejected memo would poison every later attempt — reset so a retry works.
    stripeJs.then((s) => { if (!s) stripeJs = null; });
  }
  return stripeJs;
}

export default function EyesOpenCheckout({ priceDisplay }: { priceDisplay: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/eyes-open/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Could not start checkout."); return; }
      if (!(await getStripeJs())) {
        setError("Couldn't load the payment form. Check any ad blocker and try again.");
        return;
      }
      setClientSecret(data.client_secret);
    } catch {
      setError("Couldn't reach the payment form. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }, [name, email]);

  if (clientSecret) {
    return (
      <div className="mt-8">
        <EmbeddedCheckoutProvider stripe={getStripeJs()} options={{ clientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
        <p className="mt-4 text-center font-body text-xs text-charcoal/50">
          Your seat is held while you complete payment. If you close this without paying, it goes
          back on sale in half an hour.
        </p>
      </div>
    );
  }

  const ready = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  return (
    <div className="mt-8">
      {error && (
        <div className="mb-5 rounded-xl border border-coral-rose/40 bg-coral-rose/5 p-4 font-body text-body text-charcoal/80">
          {error}
          {/All \d+ seats|last seat/.test(error) && (
            <>
              {" "}
              <Link href="/dating-with-your-eyes-open#october" className="underline underline-offset-2">
                Join the October list
              </Link>
              .
            </>
          )}
        </div>
      )}

      <label className="block font-ui text-sm font-medium text-charcoal/70">
        Your name
        <input
          value={name} onChange={(e) => setName(e.target.value)} autoComplete="name"
          className="mt-1.5 w-full rounded-xl border border-midnight-navy/15 p-3 font-body text-body"
        />
      </label>

      <label className="mt-4 block font-ui text-sm font-medium text-charcoal/70">
        Email
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          autoComplete="email" required
          className="mt-1.5 w-full rounded-xl border border-midnight-navy/15 p-3 font-body text-body"
        />
        <span className="mt-1.5 block font-body text-xs text-charcoal/50">
          This is where the class link and the replays go, so use the address you actually read.
        </span>
      </label>

      <button
        onClick={() => void start()}
        disabled={busy || !ready}
        className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-base font-medium text-white transition hover:bg-midnight-navy/90 disabled:opacity-40"
      >
        {busy ? "Holding your seat…" : `Continue to payment — ${priceDisplay}`}
      </button>

      <p className="mt-3 text-center font-body text-xs text-charcoal/50">
        Pressing this holds your seat for 30 minutes while you pay. You&apos;re not charged until
        you complete the form on the next step.
      </p>
    </div>
  );
}
