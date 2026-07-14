"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { classesFor, resultLevelColor, alignmentColor, type ColorToken } from "@/lib/phases";

// Structured participant results — mirrors the original Snapshot layout:
// developmental alignment + expiration risk (each a short read-out), then a
// per-domain breakdown with score + band (Healthy Development / Growth
// Opportunity / …) + interpretation. The AI narrative, when enabled, renders
// additively as a personalized summary above the structured report. Fully
// resilient: the deterministic breakdown always renders.

type Section = { heading: string; body: string };
type Domain = { slug: string; name: string; score: number; level: string | null; interpretation: string | null; cta: string | null };
interface Results {
  consumerReport: Section[];
  structuralContext: string | null;
  firstName: string | null;
  domains: Domain[];
  alignment: { status: string; interpretation: string } | null;
  expirationRisk: { level: string; interpretation: string } | null;
}

function ResultsInner() {
  const attempt = useSearchParams().get("attempt");
  const [data, setData] = useState<Results | null>(null);
  const [narrative, setNarrative] = useState<Section[] | null>(null);
  const [narrativePending, setNarrativePending] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!attempt) { setError(true); return; }
    let active = true;
    fetch(`/api/assess/results?attempt=${attempt}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { if (active) setData(d); })
      .catch(() => active && setError(true));
    return () => { active = false; };
  }, [attempt]);

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
  if (!data) return <Centered><p className="text-charcoal/60">Preparing your results…</p></Centered>;

  const hasStructured = data.domains.length > 0;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="flex flex-col items-center text-center">
        <Logo variant="full" href="/" className="h-11" />
        <h1 className="mt-8 font-display text-4xl font-semibold text-midnight-navy sm:text-5xl">
          {data.firstName ? `${data.firstName}'s ` : ""}Relationship Snapshot&trade;
        </h1>
        <p className="mt-2 font-body text-charcoal/70">Based on the Relationship Life Cycle&trade; Framework</p>
      </header>

      {data.structuralContext && (
        <section className="mt-8 rounded-2xl border border-light-gray bg-warm-ivory px-6 py-5 text-center">
          <p className="font-ui text-xs uppercase tracking-wide text-charcoal/60">Your Relationship Stage</p>
          <p className="mt-1 font-display text-2xl font-semibold text-midnight-navy">{data.structuralContext}</p>
        </section>
      )}

      {/* Personalized AI summary — additive; renders only when present. */}
      {narrative && (
        <section className="mt-8 rounded-2xl border border-dusty-plum/25 bg-dusty-plum/5 px-6 py-6">
          <h2 className="font-display text-2xl font-semibold text-midnight-navy">Your Personalized Summary</h2>
          <div className="mt-4 space-y-4">
            {narrative.map((s, i) => (
              <div key={i}>
                {s.heading && <h3 className="font-ui text-lg font-semibold text-midnight-navy">{s.heading}</h3>}
                {s.body && <p className="mt-1 font-body leading-relaxed text-charcoal">{s.body}</p>}
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-dusty-plum/20 pt-3 font-body text-xs text-charcoal/50">
            This summary is generated from your responses to give you a personalized reflection — your scores are calculated the same way for everyone.
          </p>
        </section>
      )}
      {!narrative && narrativePending && hasStructured && (
        <p className="mt-6 text-center text-xs text-charcoal/40">Personalizing your summary…</p>
      )}

      {hasStructured ? (
        <>
          {/* Developmental Alignment */}
          {data.alignment && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-midnight-navy">Developmental Alignment</h2>
              <div className="mt-4 rounded-2xl border border-light-gray bg-white p-6">
                <Badge token={alignmentColor(data.alignment.status)} label={data.alignment.status} />
                {data.alignment.interpretation && <p className="mt-4 font-body leading-relaxed text-charcoal">{data.alignment.interpretation}</p>}
              </div>
            </section>
          )}

          {/* Expiration Risk */}
          {data.expirationRisk && (
            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold text-midnight-navy">Expiration Risk</h2>
              <div className="mt-4 rounded-2xl border border-light-gray bg-white p-6">
                <span className="inline-flex items-center rounded-full bg-light-gray px-4 py-1.5 font-ui text-sm font-semibold text-charcoal">{data.expirationRisk.level}</span>
                {data.expirationRisk.interpretation && <p className="mt-4 font-body leading-relaxed text-charcoal">{data.expirationRisk.interpretation}</p>}
              </div>
            </section>
          )}

          {/* Domain breakdown */}
          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-midnight-navy">Your Six Domains</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.domains.map((d) => <DomainCard key={d.slug} d={d} />)}
            </div>
          </section>
        </>
      ) : (
        // Fallback: authored narrative report when structured data isn't available.
        <div className="mt-8 space-y-6 rounded-2xl border border-light-gray bg-white p-8">
          {data.consumerReport.map((s, i) => (
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

function Badge({ token, label }: { token: ColorToken; label: string }) {
  const c = classesFor(token);
  return <span className={`inline-flex items-center rounded-full px-4 py-1.5 font-ui text-sm font-semibold ${c.solidBg} ${c.solidText}`}>{label}</span>;
}

function ScoreBar({ score, token }: { score: number; token: ColorToken }) {
  const c = classesFor(token);
  const pct = Math.max(0, Math.min(100, (score / 5) * 100));
  return <div className="h-2 w-full overflow-hidden rounded-full bg-light-gray"><div className={`h-full rounded-full ${c.barFill}`} style={{ width: `${pct}%` }} /></div>;
}

function DomainCard({ d }: { d: Domain }) {
  const token = resultLevelColor(d.level ?? "");
  return (
    <div className="flex flex-col rounded-2xl border border-light-gray bg-white p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-xl font-semibold text-midnight-navy">{d.name}</h3>
        <span className="font-ui text-2xl font-semibold text-midnight-navy">{d.score.toFixed(1)}</span>
      </div>
      <div className="mt-3"><ScoreBar score={d.score} token={token} /></div>
      {d.level && <div className="mt-3"><Badge token={token} label={d.level} /></div>}
      {d.interpretation && <p className="mt-3 font-body text-sm leading-relaxed text-charcoal">{d.interpretation}</p>}
      {d.cta && <p className="mt-2 font-body text-sm italic text-charcoal/70">{d.cta}</p>}
    </div>
  );
}

export default function AssessResults() {
  return <Suspense fallback={<Centered><p className="text-charcoal/60">Loading…</p></Centered>}><ResultsInner /></Suspense>;
}

function Centered({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center px-6"><div className="text-center">{children}</div></main>;
}
