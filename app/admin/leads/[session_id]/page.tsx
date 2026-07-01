"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

interface Detail {
  respondent: {
    name: string;
    email: string;
    relationship_length: string;
    relationship_status_detail: string;
    quiz_type: string;
    completed_at: string | null;
  };
  structural_phase: string;
  is_expiration: boolean;
  alignment: { status: string; interpretation_text: string | null } | null;
  expiration_risk: { average_score: number; risk_level: string | null } | null;
  domain_scores: { domain: string; average_score: number; level: string | null }[];
  competency_scores: { phase: string; average_score: number; level: string | null }[];
  responses: { question_id: string; question_text: string; raw_response: number; scored_value: number }[];
}

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase text-charcoal/50">{label}</dt>
      <dd className="mt-0.5 text-sm text-charcoal">{value || "—"}</dd>
    </div>
  );
}

function ScoreTable({ head, rows }: { head: [string, string, string]; rows: { a: string; b: number; c: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-light-gray">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
            <th className="px-3 py-2 font-semibold">{head[0]}</th>
            <th className="px-3 py-2 font-semibold">{head[1]}</th>
            <th className="px-3 py-2 font-semibold">{head[2]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.a} className={i % 2 === 1 ? "bg-[#F9F9F9]" : "bg-white"}>
              <td className="px-3 py-2">{r.a}</td>
              <td className="px-3 py-2">{r.b.toFixed(2)}</td>
              <td className="px-3 py-2">{r.c || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LeadDetailPage({ params }: { params: Promise<{ session_id: string }> }) {
  const { session_id } = use(params);
  const [data, setData] = useState<Detail | null>(null);
  const [error, setError] = useState(false);
  const [showResponses, setShowResponses] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/leads/${session_id}`)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(setData)
      .catch(() => setError(true));
  }, [session_id]);

  return (
    <div className="max-w-3xl">
      <Link href="/admin/leads" className="text-sm text-midnight-navy hover:underline">← Back to leads</Link>

      {error && <p className="mt-6 text-sm text-coral-rose">Failed to load result.</p>}
      {!error && !data && <p className="mt-6 text-sm text-charcoal/60">Loading…</p>}

      {data && (
        <div className="mt-4 space-y-8">
          <div>
            <h1 className="text-2xl font-semibold text-midnight-navy">{data.respondent.name || "Respondent"}</h1>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Info label="Email" value={data.respondent.email} />
              <Info label="Quiz Type" value={data.respondent.quiz_type} />
              <Info label="Completed" value={fmtDate(data.respondent.completed_at)} />
              <Info label="Relationship Length" value={data.respondent.relationship_length} />
              <Info label="Status Detail" value={data.respondent.relationship_status_detail} />
              <Info label="Structural Phase" value={data.structural_phase} />
            </dl>
          </div>

          {data.alignment && (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase text-charcoal/70">Alignment</h2>
              <p className="text-sm"><span className="font-medium">{data.alignment.status}</span></p>
              {data.alignment.interpretation_text && (
                <p className="mt-1 text-sm text-charcoal/80">{data.alignment.interpretation_text}</p>
              )}
            </section>
          )}

          {data.expiration_risk && (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase text-charcoal/70">Expiration Risk</h2>
              <p className="text-sm">
                <span className="font-medium">{data.expiration_risk.risk_level ?? "—"}</span>
                {" · "}score {data.expiration_risk.average_score.toFixed(2)}
              </p>
            </section>
          )}

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase text-charcoal/70">Domain Scores</h2>
            <ScoreTable head={["Domain", "Score", "Result Level"]} rows={data.domain_scores.map((d) => ({ a: d.domain, b: d.average_score, c: d.level ?? "" }))} />
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase text-charcoal/70">Competency Phase Scores</h2>
            <ScoreTable head={["Phase", "Score", "Result Level"]} rows={data.competency_scores.map((c) => ({ a: c.phase, b: c.average_score, c: c.level ?? "" }))} />
          </section>

          <section>
            <button
              type="button"
              onClick={() => setShowResponses((v) => !v)}
              className="text-sm font-semibold uppercase text-charcoal/70 hover:text-midnight-navy"
            >
              {showResponses ? "▾" : "▸"} Raw Responses ({data.responses.length})
            </button>
            {showResponses && (
              <div className="mt-2 overflow-x-auto rounded-md border border-light-gray">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                      <th className="px-3 py-2 font-semibold">ID</th>
                      <th className="px-3 py-2 font-semibold">Question</th>
                      <th className="px-3 py-2 font-semibold">Raw</th>
                      <th className="px-3 py-2 font-semibold">Scored</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.responses.map((r, i) => (
                      <tr key={r.question_id} className={i % 2 === 1 ? "bg-[#F9F9F9]" : "bg-white"}>
                        <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">{r.question_id}</td>
                        <td className="px-3 py-2">{r.question_text}</td>
                        <td className="px-3 py-2">{r.raw_response}</td>
                        <td className="px-3 py-2">{r.scored_value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
