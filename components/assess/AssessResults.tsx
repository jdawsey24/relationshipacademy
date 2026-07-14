"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";

// Shared consumer results view for a published Studio instrument. Reads the
// attempt id from ?attempt= and renders the authored participant report. If the
// AI result narrative is enabled, it loads additively and, once ready, replaces
// the deterministic sections with the richer personalized version (same shape).
// Fully resilient: if the narrative is disabled/slow/failed, the deterministic
// report always renders.

type Section = { heading: string; body: string };

function ResultsInner() {
  const attempt = useSearchParams().get("attempt");
  const [sections, setSections] = useState<Section[] | null>(null);
  const [narrative, setNarrative] = useState<Section[] | null>(null);
  const [narrativePending, setNarrativePending] = useState(true);
  const [error, setError] = useState(false);

  // Deterministic report (fast).
  useEffect(() => {
    if (!attempt) { setError(true); return; }
    let active = true;
    fetch(`/api/assess/results?attempt=${attempt}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { if (active) setSections(d.consumerReport ?? []); })
      .catch(() => active && setError(true));
    return () => { active = false; };
  }, [attempt]);

  // AI narrative (additive; may take a few seconds on first view, cached after).
  useEffect(() => {
    if (!attempt) return;
    let active = true;
    fetch(`/api/assess/narrative?attempt=${attempt}`)
      .then((r) => r.json())
      .then((d) => { if (active) setNarrative(Array.isArray(d.narrative) && d.narrative.length ? d.narrative : null); })
      .catch(() => {})
      .finally(() => { if (active) setNarrativePending(false); });
    return () => { active = false; };
  }, [attempt]);

  if (error) return <Centered><p className="text-charcoal/70">We couldn&apos;t load your results.</p></Centered>;
  if (!sections) return <Centered><p className="text-charcoal/60">Preparing your results…</p></Centered>;

  const shown = narrative ?? sections;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <header className="mb-8 text-center"><Logo variant="full" href="/" className="mx-auto h-10" /></header>
      {shown.length === 0 ? (
        <p className="text-center text-charcoal/60">Your results are being prepared.</p>
      ) : (
        <>
          {!narrative && narrativePending && (
            <p className="mb-4 text-center text-xs text-charcoal/40">Personalizing your summary…</p>
          )}
          <div className="space-y-6 rounded-2xl border border-light-gray bg-white p-8">
            {shown.map((s, i) => (
              <div key={i}>
                {s.heading && <h2 className="font-display text-2xl font-semibold text-midnight-navy">{s.heading}</h2>}
                {s.body && <p className="mt-2 font-body leading-relaxed text-charcoal/90">{s.body}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default function AssessResults() {
  return <Suspense fallback={<Centered><p className="text-charcoal/60">Loading…</p></Centered>}><ResultsInner /></Suspense>;
}

function Centered({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center px-6"><div className="text-center">{children}</div></main>;
}
