"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";

// Shared consumer results view for a published Studio instrument. Reads the
// attempt id from ?attempt= and renders the authored participant report.

type Section = { heading: string; body: string };

function ResultsInner() {
  const attempt = useSearchParams().get("attempt");
  const [sections, setSections] = useState<Section[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!attempt) { setError(true); return; }
    let active = true;
    fetch(`/api/assess/results?attempt=${attempt}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { if (active) setSections(d.consumerReport ?? []); })
      .catch(() => active && setError(true));
    return () => { active = false; };
  }, [attempt]);

  if (error) return <Centered><p className="text-charcoal/70">We couldn&apos;t load your results.</p></Centered>;
  if (!sections) return <Centered><p className="text-charcoal/60">Preparing your results…</p></Centered>;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <header className="mb-8 text-center"><Logo variant="full" href="/" className="mx-auto h-10" /></header>
      {sections.length === 0 ? (
        <p className="text-center text-charcoal/60">Your results are being prepared.</p>
      ) : (
        <div className="space-y-6 rounded-2xl border border-light-gray bg-white p-8">
          {sections.map((s, i) => (
            <div key={i}>
              {s.heading && <h2 className="font-display text-2xl font-semibold text-midnight-navy">{s.heading}</h2>}
              {s.body && <p className="mt-2 font-body leading-relaxed text-charcoal/90">{s.body}</p>}
            </div>
          ))}
        </div>
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
