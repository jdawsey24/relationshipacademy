"use client";

import { useRef } from "react";
import { useDialogA11y } from "@/components/companion/useDialogA11y";

// Full-screen supportive interstitial shown when the safety layer interrupts the
// educational flow. Renders clinician-authored language + verified resources.
// Client-safe types (do NOT import lib/companion/safety.ts — it is server-only).

export interface SafetyResource { id: string; name: string; description: string | null; contact: string | null; url: string | null; jurisdiction: string; hours: string | null }
export interface SafetyPayload { level: string; heading: string | null; message: string; resource_intro: string | null; resources: SafetyResource[] }

export function ResourceList({ resources }: { resources: SafetyResource[] }) {
  if (!resources.length) return null;
  return (
    <ul className="mt-4 space-y-2.5 text-left">
      {resources.map((r) => (
        <li key={r.id} className="rounded-2xl border border-light-gray bg-white p-4">
          <p className="font-display text-[17px] font-semibold text-midnight-navy">{r.name}</p>
          {r.description && <p className="mt-0.5 font-body text-[13px] leading-relaxed text-charcoal/65">{r.description}</p>}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-sm">
            {r.contact && <span className="font-semibold text-coral-rose">{r.contact}</span>}
            {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-midnight-navy/70 underline underline-offset-2">Visit</a>}
            {r.hours && <span className="text-charcoal/45">{r.hours}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function SafetyInterstitial({ payload, onClose }: { payload: SafetyPayload; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialogA11y(ref, onClose);
  return (
    <div ref={ref} tabIndex={-1} className="fixed inset-0 z-50 overflow-y-auto bg-warm-ivory outline-none" role="dialog" aria-modal="true" aria-labelledby="safety-title">
      <div className="mx-auto max-w-md px-6 py-12 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-rose/12 text-coral-rose" aria-hidden="true">
          <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.6-9.4-8A4.9 4.9 0 0 1 12 6.8a4.9 4.9 0 0 1 9.4 6.2C19 16.4 12 21 12 21z" /></svg>
        </span>
        <h1 id="safety-title" className="mt-5 font-display text-2xl font-semibold leading-tight text-midnight-navy">{payload.heading ?? "You deserve support right now"}</h1>
        <p className="mt-3 whitespace-pre-line font-body text-[16px] leading-relaxed text-charcoal/80">{payload.message}</p>
        {payload.resource_intro && <p className="mt-4 font-body text-sm text-charcoal/60">{payload.resource_intro}</p>}
        <ResourceList resources={payload.resources} />
        <button onClick={onClose} className="mt-6 w-full rounded-full bg-midnight-navy py-3.5 font-ui text-sm font-semibold text-white">
          I understand
        </button>
        <p className="mt-3 font-body text-xs text-charcoal/45">This is an educational tool, not a crisis or therapy service.</p>
      </div>
    </div>
  );
}
