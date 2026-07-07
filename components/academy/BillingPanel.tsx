"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PLANS, formatPrice, type Interval } from "@/lib/stripePlans";
import { tierRank } from "@/lib/academy";

export default function BillingPanel({
  currentTier,
  hasBilling,
  status,
}: {
  currentTier: string;
  hasBilling: boolean;
  status: string | null;
}) {
  const params = useSearchParams();
  const [interval, setInterval] = useState<Interval>("year");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkoutFlag = params.get("checkout");

  async function checkout(lookupKey: string) {
    setBusy(lookupKey);
    setError(null);
    const res = await fetch("/api/academy/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lookupKey }),
    }).catch(() => null);
    if (!res || !res.ok) {
      const d = res ? await res.json().catch(() => ({})) : {};
      setError(d.error || "Could not start checkout.");
      setBusy(null);
      return;
    }
    const { url } = await res.json();
    window.location.href = url;
  }

  async function manageBilling() {
    setBusy("portal");
    setError(null);
    const res = await fetch("/api/academy/billing-portal", { method: "POST" }).catch(() => null);
    if (!res || !res.ok) {
      const d = res ? await res.json().catch(() => ({})) : {};
      setError(d.error || "Could not open billing.");
      setBusy(null);
      return;
    }
    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <div className="rounded-2xl border border-midnight-navy/10 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-plum">Plans</h2>
        {/* Interval toggle */}
        <div className="inline-flex rounded-full border border-midnight-navy/15 p-0.5 font-ui text-sm">
          <button
            type="button"
            onClick={() => setInterval("month")}
            className={`rounded-full px-4 py-1 ${interval === "month" ? "bg-midnight-navy text-white" : "text-midnight-navy/70"}`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setInterval("year")}
            className={`rounded-full px-4 py-1 ${interval === "year" ? "bg-midnight-navy text-white" : "text-midnight-navy/70"}`}
          >
            Annual
          </button>
        </div>
      </div>

      {checkoutFlag === "success" && (
        <p className="mt-4 rounded-lg bg-sage-green/15 px-3 py-2 font-body text-sm text-midnight-navy">
          Payment received — your membership updates within a few seconds. Refresh if it doesn&apos;t show yet.
        </p>
      )}
      {checkoutFlag === "cancelled" && (
        <p className="mt-4 rounded-lg bg-warm-ivory px-3 py-2 font-body text-sm text-charcoal/70">
          Checkout cancelled — no charge was made.
        </p>
      )}
      {error && <p className="mt-4 rounded-lg bg-coral-rose/10 px-3 py-2 font-body text-sm text-coral-rose">{error}</p>}

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => {
          const price = plan[interval];
          const isCurrent = plan.tier === currentTier;
          const isDowngrade = tierRank(plan.tier) < tierRank(currentTier);
          return (
            <div
              key={plan.tier}
              className={`flex flex-col rounded-xl border p-5 ${isCurrent ? "border-plum bg-plum/5" : "border-midnight-navy/10"}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-midnight-navy">{plan.name}</h3>
                {isCurrent && <span className="rounded-full bg-plum/15 px-2 py-0.5 font-ui text-xs text-plum">Current</span>}
              </div>
              <p className="mt-0.5 font-body text-sm text-charcoal/60">{plan.tagline}</p>
              <p className="mt-3">
                <span className="font-display text-3xl font-semibold text-midnight-navy">{formatPrice(price.amount)}</span>
                <span className="font-ui text-sm text-charcoal/50">/{interval === "month" ? "mo" : "yr"}</span>
              </p>
              <ul className="mt-3 flex-1 space-y-1.5 font-body text-sm text-charcoal/75">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-sage-green">✓</span>{f}</li>
                ))}
              </ul>
              <div className="mt-5">
                {isCurrent ? (
                  hasBilling ? (
                    <button
                      type="button"
                      onClick={manageBilling}
                      disabled={busy !== null}
                      className="w-full rounded-full border border-midnight-navy/20 px-4 py-2 font-ui text-sm font-medium text-midnight-navy hover:bg-midnight-navy/5 disabled:opacity-50"
                    >
                      {busy === "portal" ? "Opening…" : "Manage billing"}
                    </button>
                  ) : (
                    <span className="block text-center font-ui text-sm text-charcoal/50">Your plan</span>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => checkout(price.lookupKey)}
                    disabled={busy !== null}
                    className="w-full rounded-full bg-midnight-navy px-4 py-2 font-ui text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50"
                  >
                    {busy === price.lookupKey ? "Starting…" : isDowngrade ? `Switch to ${plan.name}` : `Choose ${plan.name}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasBilling && (
        <div className="mt-5">
          <button
            type="button"
            onClick={manageBilling}
            disabled={busy !== null}
            className="font-ui text-sm text-midnight-navy underline underline-offset-4 hover:text-midnight-navy/70 disabled:opacity-50"
          >
            Manage billing &amp; payment method →
          </button>
          {status && status !== "active" && (
            <span className="ml-3 font-ui text-xs text-coral-rose">Subscription status: {status}</span>
          )}
        </div>
      )}
    </div>
  );
}
