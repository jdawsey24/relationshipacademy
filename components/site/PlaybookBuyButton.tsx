"use client";

import { useState } from "react";

// Public buy button for a Playbook. Starts the paid checkout; ownership must
// attach to an account, so an unauthenticated buyer is routed to sign in and
// returned. Mirrors the Snapshot results buy flow.
export default function PlaybookBuyButton({ clusterId, label, className = "" }: { clusterId: number; label: string; className?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function buy() {
    setBusy(true); setErr(null);
    try {
      const res = await fetch("/api/playbooks/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cluster_id: clusterId }),
      });
      if (res.status === 401) { window.location.href = `/academy/login?next=${encodeURIComponent(window.location.pathname)}`; return; }
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.url) { setErr(d.error ?? "Purchasing isn't available yet."); setBusy(false); return; }
      const w = window as unknown as { fbq?: (...a: unknown[]) => void };
      try { w.fbq?.("track", "InitiateCheckout", { content_name: "Relationship Playbook" }); } catch { /* noop */ }
      window.location.href = d.url;
    } catch {
      setErr("Something went wrong."); setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button onClick={buy} disabled={busy}
        className={`inline-flex min-h-[52px] items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-base font-medium text-white transition-colors hover:bg-midnight-navy/90 disabled:opacity-60 ${className}`}>
        {busy ? "Starting checkout…" : label}
      </button>
      {err && <p className="font-body text-sm text-coral-rose">{err}</p>}
    </div>
  );
}
