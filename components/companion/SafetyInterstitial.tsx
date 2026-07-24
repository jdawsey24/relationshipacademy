"use client";

import { useRef, useState } from "react";
import { useDialogA11y } from "@/components/companion/useDialogA11y";

// Client rendering for the Safety Layer V2 response. The server (lib/companion/
// safety.ts) classifies and returns a payload; this file decides HOW it shows:
//   • Level 1 → a NON-BLOCKING inline notice (the experience continues).
//   • Level 2/3 → a BLOCKING interstitial that pauses content until acknowledged.
//   • immediate_danger → the emergency addendum is layered onto the interstitial.
//   • digital_safety → a discreet notice + scoped Quick Exit (IPV / sexual coercion).
// No classification detail (action_level, categories) is ever rendered as text.
// Client-safe types only (do NOT import lib/companion/safety.ts — server-only).

export interface SafetyResource { id: string; name: string; description: string | null; contact: string | null; url: string | null; jurisdiction: string; hours: string | null }
export interface SafetyNoticeBlock { heading: string | null; message: string }
export interface SafetyPayload {
  action_level: 1 | 2 | 3;
  level: string;
  immediate_danger: boolean;
  categories: string[];
  digital_safety: boolean;
  heading: string | null;
  message: string;
  resource_intro: string | null;
  immediate_notice: SafetyNoticeBlock | null;
  digital_safety_notice: SafetyNoticeBlock | null;
  resources: SafetyResource[];
}

export function ResourceList({ resources, emphasize = false }: { resources: SafetyResource[]; emphasize?: boolean }) {
  if (!resources.length) return null;
  return (
    <ul className="mt-4 space-y-2.5 text-left">
      {resources.map((r) => (
        <li key={r.id} className={`rounded-2xl border bg-white p-4 ${emphasize ? "border-coral-rose/40 ring-1 ring-coral-rose/10" : "border-light-gray"}`}>
          <p className="font-display text-[17px] font-semibold text-midnight-navy">{r.name}</p>
          {r.description && <p className="mt-0.5 font-body text-[13px] leading-relaxed text-charcoal/65">{r.description}</p>}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-sm">
            {r.contact && <span className="font-semibold text-coral-rose">{r.contact}</span>}
            {/* User-initiated only — never auto-opened. */}
            {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-midnight-navy/70 underline underline-offset-2">Visit</a>}
            {r.hours && <span className="text-charcoal/45">{r.hours}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}

// Quick Exit — scoped to discreet-mode interstitials (IPV / sexual coercion) in V2.
// Leaves immediately to a neutral page with no confirmation. Uses history.replaceState
// + location.replace so the normal Back flow does not return to this screen. It does
// NOT erase or clear browser history and makes no such claim. No emails/texts/
// notifications and no auto-opened resources — user-initiated navigation only.
function quickExit() {
  try { window.history.replaceState(null, "", "/"); } catch { /* non-fatal */ }
  window.location.replace("https://www.google.com");
}

function QuickExit() {
  return (
    <button type="button" onClick={quickExit}
      className="fixed right-4 top-4 z-10 rounded-full bg-white/95 px-4 py-2 font-ui text-sm font-semibold text-midnight-navy shadow-md ring-1 ring-black/5 hover:bg-white">
      Quick Exit
    </button>
  );
}

function HeartMark() {
  return (
    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-rose/12 text-coral-rose" aria-hidden="true">
      <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.6-9.4-8A4.9 4.9 0 0 1 12 6.8a4.9 4.9 0 0 1 9.4 6.2C19 16.4 12 21 12 21z" /></svg>
    </span>
  );
}

// Blocking interstitial — Level 2/3 (+ immediate danger + digital safety).
function BlockingInterstitial({ payload, onClose }: { payload: SafetyPayload; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialogA11y(ref, onClose);
  const acute = payload.action_level >= 3 || payload.immediate_danger;
  return (
    <div ref={ref} tabIndex={-1} className="fixed inset-0 z-50 overflow-y-auto bg-warm-ivory outline-none" role="dialog" aria-modal="true" aria-labelledby="safety-title">
      {payload.digital_safety && <QuickExit />}
      <div className="mx-auto max-w-md px-6 py-12 text-center">
        <HeartMark />
        <h1 id="safety-title" className="mt-5 font-display text-2xl font-semibold leading-tight text-midnight-navy">{payload.heading ?? "Support is available"}</h1>
        <p className="mt-3 whitespace-pre-line font-body text-[16px] leading-relaxed text-charcoal/80">{payload.message}</p>

        {/* Immediate-danger addendum — emphasized, only when the API flag is true. */}
        {payload.immediate_notice && (
          <section className="mt-5 rounded-2xl border border-coral-rose/45 bg-coral-rose/10 p-4 text-left">
            {payload.immediate_notice.heading && <p className="font-display text-[16px] font-semibold text-coral-rose">{payload.immediate_notice.heading}</p>}
            <p className="mt-1 whitespace-pre-line font-body text-sm leading-relaxed text-charcoal/85">{payload.immediate_notice.message}</p>
          </section>
        )}

        {payload.resource_intro && <p className="mt-4 font-body text-sm text-charcoal/60">{payload.resource_intro}</p>}
        {/* Level 3 (or immediate) prioritizes resources with stronger emphasis. */}
        <ResourceList resources={payload.resources} emphasize={acute} />

        {/* Digital-safety notice + device-monitoring reminder (IPV / sexual coercion). */}
        {payload.digital_safety_notice && (
          <section className="mt-5 rounded-2xl border border-midnight-navy/15 bg-white p-4 text-left">
            {payload.digital_safety_notice.heading && <p className="font-display text-[15px] font-semibold text-midnight-navy">{payload.digital_safety_notice.heading}</p>}
            <p className="mt-1 whitespace-pre-line font-body text-[13px] leading-relaxed text-charcoal/75">{payload.digital_safety_notice.message}</p>
          </section>
        )}

        <button onClick={onClose} className="mt-6 w-full rounded-full bg-midnight-navy py-3.5 font-ui text-sm font-semibold text-white">
          I understand
        </button>
        <p className="mt-3 font-body text-xs text-charcoal/45">This is an educational tool, not a crisis or therapy service. It does not monitor you in real time.</p>
      </div>
    </div>
  );
}

// Non-blocking inline notice — Level 1. A dismissible banner; the experience is NOT
// halted and this is not a modal (no focus trap). Resources reveal on request.
function InlineNotice({ payload, onClose }: { payload: SafetyPayload; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <div className="pointer-events-auto mx-auto max-w-md rounded-2xl border border-midnight-navy/15 bg-white p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-coral-rose/12 text-coral-rose" aria-hidden="true">
            <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.6-9.4-8A4.9 4.9 0 0 1 12 6.8a4.9 4.9 0 0 1 9.4 6.2C19 16.4 12 21 12 21z" /></svg>
          </span>
          <div className="min-w-0 flex-1 text-left">
            <p className="font-display text-[15px] font-semibold text-midnight-navy">{payload.heading ?? "Support is available."}</p>
            <p className="mt-0.5 font-body text-[13px] leading-relaxed text-charcoal/70">{payload.message}</p>
            {payload.resources.length > 0 && (
              <button onClick={() => setOpen((o) => !o)} className="mt-2 font-ui text-[13px] font-semibold text-coral-rose">
                {open ? "Hide support options" : "View support options"}
              </button>
            )}
            {open && <ResourceList resources={payload.resources} />}
          </div>
          <button onClick={onClose} aria-label="Dismiss" className="flex-none rounded-full px-2 font-ui text-lg leading-none text-charcoal/40 hover:text-charcoal">×</button>
        </div>
      </div>
    </div>
  );
}

// Gate: routes the payload to blocking vs non-blocking by action level.
export default function SafetyDisplay({ payload, onClose }: { payload: SafetyPayload; onClose: () => void }) {
  if (payload.action_level >= 2) return <BlockingInterstitial payload={payload} onClose={onClose} />;
  if (payload.action_level === 1) return <InlineNotice payload={payload} onClose={onClose} />;
  return null;
}
