"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import CtaButton from "@/components/site/CtaButton";
import { classesFor, resultLevelColor, alignmentColor, type ColorToken } from "@/lib/phases";
import { ACADEMY_URL } from "@/lib/flagship";

// Structured participant results — mirrors the original Snapshot layout:
// developmental alignment + expiration risk (each a short read-out), then a
// per-domain breakdown with score + band (Healthy Development / Growth
// Opportunity / …) + interpretation.

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

          {/* Academy conversion — personalized to growth areas */}
          <AcademyCta domains={data.domains} firstName={data.firstName} attempt={attempt} />
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

function AcademyCta({ domains, firstName, attempt }: { domains: Domain[]; firstName: string | null; attempt: string | null }) {
  // Growth areas = the lower-band domains (sorted desc, so lowest are last).
  const growth = domains.filter((d) => d.level === "Growth Opportunity" || d.level === "Needs Attention").slice(-2).map((d) => d.name);
  const q = new URLSearchParams({ ...(firstName ? { name: firstName } : {}), ...(attempt ? { attempt } : {}) }).toString();
  return (
    <section className="mt-12 rounded-2xl bg-midnight-navy px-6 py-9 text-center text-white">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">Keep building on your snapshot</h2>
      <p className="mx-auto mt-4 max-w-xl font-body text-[17px] leading-relaxed text-white/85">
        {growth.length
          ? `Your growth areas — ${growth.join(" and ")} — are exactly what the Relationship Academy helps you strengthen, with guided lessons and a supportive community organized around this framework.`
          : "The Relationship Academy helps you build on your strengths with guided lessons and a supportive community organized around this framework."}
      </p>
      <div className="mt-7 flex flex-col items-center gap-3">
        <CtaButton href={ACADEMY_URL} variant="accent" external>Join The Relationship Academy</CtaButton>
        <Link href={`/snapshot/thank-you${q ? `?${q}` : ""}`} className="font-ui text-sm text-white/75 underline underline-offset-4 hover:text-white">See what&apos;s next →</Link>
      </div>
    </section>
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
