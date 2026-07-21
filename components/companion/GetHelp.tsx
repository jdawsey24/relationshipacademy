"use client";

import { useEffect, useState } from "react";
import { ResourceList, type SafetyResource } from "@/components/companion/SafetyInterstitial";

// Persistent "Get help now" affordance — always reachable inside the Companion.
// Renders nothing until at least one verified resource is authored, so it never
// shows an empty help screen pre-launch.
export default function GetHelp() {
  const [resources, setResources] = useState<SafetyResource[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/companion/safety/resources").then((r) => r.ok ? r.json() : null)
      .then((d) => setResources(d?.resources ?? [])).catch(() => {});
  }, []);

  if (!resources.length) return null;

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-30 flex items-center gap-1.5 rounded-full border border-coral-rose/40 bg-white/95 px-3.5 py-2 font-ui text-xs font-semibold text-coral-rose shadow-[0_2px_10px_rgba(28,53,87,0.12)] backdrop-blur">
        <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-4.6-9.4-8A4.9 4.9 0 0 1 12 6.8a4.9 4.9 0 0 1 9.4 6.2C19 16.4 12 21 12 21z" /></svg>
        Get help
      </button>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-warm-ivory" role="dialog" aria-modal="true">
          <div className="mx-auto max-w-md px-6 py-12 text-center">
            <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Support</p>
            <h1 className="mt-2 font-display text-2xl font-semibold text-midnight-navy">If you need help now</h1>
            <p className="mt-3 font-body text-[15px] leading-relaxed text-charcoal/70">The Relationship Companion is an educational tool — not a crisis or therapy service. If you&apos;re in distress, please reach out to one of these.</p>
            <ResourceList resources={resources} />
            <button onClick={() => setOpen(false)} className="mt-6 w-full rounded-full bg-midnight-navy py-3.5 font-ui text-sm font-semibold text-white">Close</button>
          </div>
        </div>
      )}
    </>
  );
}
