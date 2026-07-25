"use client";

import { useState } from "react";
import {
  DISCLOSURE_TITLE, DISCLOSURE_SUMMARY, DISCLOSURE_INTRO, DISCLOSURE_SECTIONS,
  ACCEPT_LABEL, DISCLOSURE_VERSION, type Block,
} from "@/lib/companion/disclosures";

// One-screen informed-use gate: a prominent "Before you begin" summary, the full
// disclosure, ONE affirmative checkbox, and "I Understand & Continue". On accept it
// records the version + timestamp + user id server-side, then continues.

function BlockView({ block }: { block: Block }) {
  if (Array.isArray(block)) {
    return (
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {block.map((li, i) => <li key={i} className="font-body text-[14px] leading-relaxed text-charcoal/80">{li}</li>)}
      </ul>
    );
  }
  return <p className="mt-2 font-body text-[14px] leading-relaxed text-charcoal/80">{block}</p>;
}

export default function DisclosureScreen({ onAccepted }: { onAccepted: () => void }) {
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function accept() {
    if (!checked || busy) return;
    setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/companion/disclosure/accept", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: DISCLOSURE_VERSION }),
      });
      if (!r.ok) { setErr("We couldn't record your acknowledgment. Please try again."); setBusy(false); return; }
      onAccepted();
    } catch { setErr("We couldn't record your acknowledgment. Please try again."); setBusy(false); }
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-warm-ivory">
      <div className="mx-auto max-w-md px-5 pb-40 pt-8">
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">The Relationship Companion&trade;</p>
        <h1 className="mt-1 font-display text-2xl font-semibold leading-tight text-midnight-navy">Before you begin</h1>

        {/* Prominent summary of the material points. */}
        <section className="mt-4 rounded-2xl border border-coral-rose/35 bg-coral-rose/8 p-4">
          <p className="font-body text-[15px] leading-relaxed text-charcoal/85">{DISCLOSURE_SUMMARY}</p>
        </section>

        {/* Full disclosure. */}
        <h2 className="mt-7 font-display text-lg font-semibold text-midnight-navy">{DISCLOSURE_TITLE}</h2>
        <p className="mt-2 font-body text-[14px] leading-relaxed text-charcoal/75">{DISCLOSURE_INTRO}</p>

        <div className="mt-4 space-y-5">
          {DISCLOSURE_SECTIONS.map((s) => (
            <section key={s.heading}>
              <h3 className="font-display text-[15px] font-semibold text-midnight-navy">{s.heading}</h3>
              {s.blocks.map((b, i) => <BlockView key={i} block={b} />)}
            </section>
          ))}
        </div>

        <p className="mt-6 font-body text-[11px] text-charcoal/40">Version {DISCLOSURE_VERSION}. This is an educational tool, not a crisis or therapy service, and it does not monitor you in real time.</p>
      </div>

      {/* Sticky acceptance bar. */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-light-gray bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-md px-5 py-3">
          {err && <p className="mb-2 font-body text-[13px] text-coral-rose">{err}</p>}
          <label className="flex items-start gap-2.5">
            <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="mt-0.5 h-4 w-4 flex-none" aria-describedby="disclosure-title" />
            <span className="font-body text-[13px] leading-relaxed text-charcoal/80">{ACCEPT_LABEL}</span>
          </label>
          <button onClick={accept} disabled={!checked || busy}
            className="mt-3 w-full rounded-full bg-midnight-navy py-3.5 font-ui text-sm font-semibold text-white disabled:opacity-40">
            {busy ? "One moment…" : "I Understand & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
