"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import {
  classesFor,
  phaseColor,
  resultLevelColor,
  riskLevelColor,
  alignmentColor,
} from "@/lib/phases";
import type {
  ResultsResponse,
  DomainResult,
  CompetencyResult,
} from "@/types/assessment";

const COMMUNITY_URL = "https://community.joinsymmetricly.com";

export default function ResultsPage() {
  return (
    <Suspense fallback={<CenteredNote>Loading your results…</CenteredNote>}>
      <ResultsInner />
    </Suspense>
  );
}

function CenteredNote({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6 text-center">
      <p className="font-body text-lg text-charcoal/70">{children}</p>
    </main>
  );
}

function ResultsInner() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [data, setData] = useState<ResultsResponse | null>(null);
  const [error, setError] = useState(false);
  // Additive AI narrative — never blocks the deterministic report; renders only
  // when present. Off unless "result_narrative" is enabled in AI Settings.
  const [narrative, setNarrative] = useState<{ heading: string; body: string }[] | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError(true);
      return;
    }
    let active = true;
    fetch(`/api/results?session_id=${sessionId}`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((d) => active && setData(d))
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, [sessionId]);

  // Separate, resilient fetch for the personalized AI narrative. Any failure is
  // silent — the deterministic report above is never affected.
  useEffect(() => {
    if (!sessionId) return;
    let active = true;
    fetch(`/api/results/narrative?session_id=${sessionId}`)
      .then((r) => (r.ok ? r.json() : { narrative: null }))
      .then((d) => {
        if (active && Array.isArray(d.narrative) && d.narrative.length > 0) setNarrative(d.narrative);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [sessionId]);

  if (error) {
    return (
      <CenteredNote>
        We couldn&apos;t load your results. Please contact support.
      </CenteredNote>
    );
  }
  if (!data) return <CenteredNote>Loading your results…</CenteredNote>;

  const phase = classesFor(phaseColor(data.structural_phase.slug));
  const stageLabel =
    data.structural_phase.consumer_name || data.structural_phase.name;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <header className="flex flex-col items-center text-center">
        <Logo variant="full" href="/" className="h-12" />
        <h1 className="mt-8 font-display text-4xl font-semibold text-midnight-navy sm:text-5xl">
          {data.name ? `${data.name}'s ` : ""}Relationship Snapshot&trade;
        </h1>
        <p className="mt-2 font-body text-charcoal/70">
          Based on the Relationship Life Cycle&trade; Framework
        </p>
      </header>

      {/* Structural Phase Banner */}
      <section
        className={`mt-10 rounded-2xl border ${phase.border} ${phase.tintBg} px-6 py-6 text-center`}
      >
        <p className="font-ui text-xs uppercase tracking-wide text-charcoal/60">
          Your Relationship Stage
        </p>
        <p className={`mt-1 font-display text-3xl font-semibold ${phase.text}`}>
          {stageLabel}
        </p>
        {data.structural_phase.defining_feature && (
          <p className="mx-auto mt-2 max-w-xl font-body text-charcoal">
            {data.structural_phase.defining_feature}
          </p>
        )}
      </section>

      {/* Personalized AI summary — additive; renders only when present. */}
      {narrative && (
        <section className="mt-10 rounded-2xl border border-dusty-plum/25 bg-dusty-plum/5 px-6 py-6">
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

      {/* Expiration risk as PRIMARY result (above domains) when applicable */}
      {data.is_expiration && data.expiration_risk && (
        <ExpirationRiskSection data={data} primary />
      )}

      {/* Alignment (only when not expiration) */}
      {!data.is_expiration && data.alignment && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-midnight-navy">
            Developmental Alignment
          </h2>
          <div className="mt-4 rounded-2xl border border-light-gray bg-white p-6">
            <Badge token={alignmentColor(data.alignment.status)} label={data.alignment.status} />
            {data.alignment.interpretation_text && (
              <p className="mt-4 font-body leading-relaxed text-charcoal">
                {data.alignment.interpretation_text}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Expiration risk (secondary placement) when not expiration */}
      {!data.is_expiration && data.expiration_risk && (
        <ExpirationRiskSection data={data} />
      )}

      {/* Domain Scores */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-midnight-navy">
          Your Six Domains
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.domains.map((d) => (
            <DomainCard key={d.slug} d={d} />
          ))}
        </div>
      </section>

      {/* Competency Phase Scores */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-midnight-navy">
          Developmental Competency Scores
        </h2>
        <p className="mt-2 max-w-2xl font-body text-charcoal/80">
          These scores reflect how well your relationship is functioning within
          each developmental stage — regardless of which stage you&apos;re
          currently in.
        </p>
        <div className="mt-5 space-y-4">
          {data.competency_phases.map((c) => (
            <CompetencyBar key={c.slug} c={c} />
          ))}
        </div>
      </section>

      {/* Next Steps / CTA */}
      <section className="mt-12 rounded-2xl bg-midnight-navy px-6 py-8 text-center text-white">
        <h2 className="font-display text-2xl font-semibold">What&apos;s Next</h2>
        {data.recommendations.length > 0 && (
          <ul className="mx-auto mt-5 max-w-xl space-y-4 text-left">
            {data.recommendations.map((r) => (
              <li key={r.domain} className="rounded-xl bg-white/10 p-4">
                <p className="font-ui text-sm font-medium text-white/80">{r.domain}</p>
                <p className="mt-1 font-body text-white">{r.recommendation_text}</p>
                <p className="mt-1 font-body text-sm text-white/70">
                  Next step: {r.next_step}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-7 flex flex-col items-center gap-3">
          <Link
            href="/profile"
            className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-white px-8 font-ui text-base font-medium text-midnight-navy transition-opacity hover:opacity-90 sm:w-auto"
          >
            Explore the Full Relationship Profile&trade;
          </Link>
          <a
            href={COMMUNITY_URL}
            className="font-ui text-sm text-white/80 underline underline-offset-4 hover:text-white"
          >
            Join the Relational Wellness Society
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 flex flex-col items-center gap-2 border-t border-light-gray pt-8 text-center">
        <Logo variant="monogram" className="h-10" />
        <p className="font-body text-sm text-charcoal/70">
          © Relationship Life Cycle&trade; | A Symmetricly Framework
        </p>
        <p className="font-body text-sm text-charcoal/70">
          Developed by Janelle Dawsey, LMFT
        </p>
      </footer>
    </main>
  );
}

function Badge({ token, label }: { token: Parameters<typeof classesFor>[0]; label: string }) {
  const c = classesFor(token);
  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1.5 font-ui text-sm font-semibold ${c.solidBg} ${c.solidText}`}
    >
      {label}
    </span>
  );
}

function ScoreBar({ score, token }: { score: number; token: Parameters<typeof classesFor>[0] }) {
  const c = classesFor(token);
  const pct = Math.max(0, Math.min(100, (score / 5) * 100));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-light-gray">
      <div className={`h-full rounded-full ${c.barFill}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function DomainCard({ d }: { d: DomainResult }) {
  const token = resultLevelColor(d.level ?? "");
  return (
    <div className="flex flex-col rounded-2xl border border-light-gray bg-white p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-xl font-semibold text-midnight-navy">{d.name}</h3>
        <span className="font-ui text-2xl font-semibold text-midnight-navy">
          {d.average_score.toFixed(1)}
        </span>
      </div>
      <div className="mt-3">
        <ScoreBar score={d.average_score} token={token} />
      </div>
      {d.level && (
        <div className="mt-3">
          <Badge token={token} label={d.level} />
        </div>
      )}
      {d.interpretation && (
        <p className="mt-3 font-body text-sm leading-relaxed text-charcoal">{d.interpretation}</p>
      )}
      {d.cta && <p className="mt-2 font-body text-sm italic text-charcoal/70">{d.cta}</p>}
    </div>
  );
}

function CompetencyBar({ c }: { c: CompetencyResult }) {
  const token = resultLevelColor(c.level ?? "");
  return (
    <div className="rounded-2xl border border-light-gray bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-midnight-navy">
          {c.consumer_name}
        </h3>
        <span className="font-ui text-sm text-charcoal/70">
          {c.level ?? ""} · {c.average_score.toFixed(1)}
        </span>
      </div>
      <div className="mt-3">
        <ScoreBar score={c.average_score} token={token} />
      </div>
    </div>
  );
}

function ExpirationRiskSection({
  data,
  primary = false,
}: {
  data: ResultsResponse;
  primary?: boolean;
}) {
  const risk = data.expiration_risk!;
  const token = riskLevelColor(risk.risk_level ?? "");
  const c = classesFor(token);
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-semibold text-midnight-navy">
        Deterioration Risk
      </h2>
      <div
        className={`mt-4 rounded-2xl border bg-white p-6 ${
          primary ? `${c.border} border-2` : "border-light-gray"
        }`}
      >
        <Badge token={token} label={risk.title ?? risk.risk_level ?? "—"} />
        {risk.interpretation && (
          <p className="mt-4 font-body leading-relaxed text-charcoal">{risk.interpretation}</p>
        )}
      </div>
    </section>
  );
}
