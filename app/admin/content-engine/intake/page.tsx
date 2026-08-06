"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Topic intake — stages 1 through 5, ending at the owner gate.
//
// This is the half of the pipeline that decides FRAMEWORK, before any words are
// written. It ends by handing an approved bridge to the Script Builder, which is
// where wording begins. The separation is deliberate: once you are looking at
// draft copy it is very hard to keep judging the mapping honestly.
//
// Pasted topic text is untrusted. It is sanitised before storage and shown here
// as data — never as something the page or the model should act on.

interface Trend {
  id: string; canonical_name: string; status: string; entry_mode: string;
  community_seen: string | null; exact_phrase: string | null; last_validated_at: string | null;
}
interface Bridge {
  id: string; bridge_type: string; competency_id: string | null;
  phase_id: string | null; domain_id: string | null;
  affected_population: string | null; relational_consequence: string | null;
  angle: string | null; rationale: string | null;
  status: string; is_forced: boolean;
  mapping_valid: boolean; mapping_errors: string[];
  eligible_for_generation: boolean; decision: string; reject_reason: string | null;
}
interface Detail {
  candidate: Trend & { raw_input: string | null };
  observations: unknown[];
  bridges: Bridge[];
}

const GRADE: Record<string, { label: string; cls: string }> = {
  strong:   { label: "Strong",   cls: "bg-emerald-100 text-emerald-900" },
  moderate: { label: "Moderate", cls: "bg-sky-100 text-sky-900" },
  weak:     { label: "Weak",     cls: "bg-amber-100 text-amber-900" },
  forced:   { label: "Forced",   cls: "bg-orange-100 text-orange-900" },
  rejected: { label: "Rejected", cls: "bg-red-100 text-red-900" },
};

export default function IntakePage() {
  const router = useRouter();
  const [trends, setTrends] = useState<Trend[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [raw, setRaw] = useState("");
  const [community, setCommunity] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadTrends = useCallback(async () => {
    const r = await fetch("/api/admin/content-engine/trends");
    if (r.ok) setTrends((await r.json()).trends ?? []);
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    const r = await fetch(`/api/admin/content-engine/trends/${id}`);
    if (r.ok) setDetail(await r.json());
    else setErr((await r.json()).error ?? "Could not load that topic.");
  }, []);

  useEffect(() => { void loadTrends(); }, [loadTrends]);
  useEffect(() => { if (selected) void loadDetail(selected); }, [selected, loadDetail]);

  async function addTopic() {
    if (!raw.trim()) return;
    setBusy("add"); setErr(null); setNotice(null);
    try {
      const r = await fetch("/api/admin/content-engine/trends", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw, community_seen: community || null }),
      });
      const j = await r.json();
      if (!r.ok) { setErr(j.error ?? "Could not save that."); return; }
      if (j.strippedInjection) {
        setNotice(
          "That text contained something shaped like an instruction to the AI. It was stripped before " +
          "storage — the topic is kept as data, not as a command.",
        );
      }
      if (j.merged) setNotice((n) => (n ? n + " " : "") + "Merged into an existing topic with the same meaning.");
      setRaw(""); setCommunity("");
      await loadTrends();
      setSelected(j.id);
    } finally { setBusy(null); }
  }

  async function proposeBridges() {
    if (!selected) return;
    setBusy("bridges"); setErr(null); setNotice(null);
    try {
      const r = await fetch(`/api/admin/content-engine/trends/${selected}/bridges`, { method: "POST" });
      const j = await r.json();
      if (!r.ok) { setErr(j.error ?? "Bridge generation failed."); return; }
      if (j.rejected?.length) {
        setNotice(`${j.rejected.length} proposed bridge(s) were discarded for naming a competency outside the canonical set.`);
      }
      await loadDetail(selected);
    } finally { setBusy(null); }
  }

  async function decide(bridgeId: string, decision: "accepted" | "rejected", reason?: string) {
    setBusy(bridgeId); setErr(null);
    try {
      const r = await fetch(`/api/admin/content-engine/bridges/${bridgeId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, reject_reason: reason }),
      });
      if (!r.ok) { setErr((await r.json()).error ?? "Could not record that."); return; }
      if (selected) await loadDetail(selected);
    } finally { setBusy(null); }
  }

  async function startBrief(bridge: Bridge) {
    setBusy(bridge.id); setErr(null);
    try {
      const r = await fetch("/api/admin/content-engine/script-builder/briefs", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bridge_id: bridge.id,
          topic: detail?.candidate.canonical_name ?? "Untitled topic",
        }),
      });
      const j = await r.json();
      if (!r.ok) { setErr(j.error ?? "Could not create the brief."); return; }
      router.push("/admin/content-engine/script-builder");
    } finally { setBusy(null); }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Topic intake</h1>
        <p className="mt-1 text-sm text-slate-600">
          Stages 1–5: what you saw, who it affects, and whether it genuinely belongs to the framework.
          This ends at your decision. Nothing is written until a bridge is approved.
        </p>
      </header>

      {err && <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">{err}</div>}
      {notice && <div className="mb-4 rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 text-sm text-sky-900">{notice}</div>}

      {/* Stage 1 — intake */}
      <section className="mb-8 rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Add a topic</h2>
        <textarea
          value={raw} onChange={(e) => setRaw(e.target.value)} rows={4}
          placeholder="Paste the phrase, the post text, or a link — whatever you actually saw."
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            value={community} onChange={(e) => setCommunity(e.target.value)}
            placeholder="Community where you saw it (optional)"
            className="flex-1 rounded border border-slate-300 px-3 py-1.5 text-sm"
          />
          <button
            onClick={addTopic} disabled={!raw.trim() || busy !== null}
            className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {busy === "add" ? "Saving…" : "Add topic"}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Pasted text is treated as data, never as instructions. Anything shaped like a prompt is stripped
          before it is stored.
        </p>
      </section>

      {/* Topic list */}
      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Topics</h2>
        {!trends.length ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            No topics yet.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
            {trends.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setSelected(t.id)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-slate-50 ${
                    selected === t.id ? "bg-slate-50 font-medium" : ""
                  }`}
                >
                  <span className="text-slate-800">{t.canonical_name}</span>
                  <span className="text-xs text-slate-500">
                    {t.status}{t.community_seen ? ` · ${t.community_seen}` : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Stages 4-5 — bridges and the mapping gate */}
      {detail && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Relational bridges</h2>
            <button
              onClick={proposeBridges} disabled={busy !== null}
              className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              {busy === "bridges" ? "Proposing…" : detail.bridges.length ? "Propose again" : "Propose bridges"}
            </button>
          </div>

          {detail.candidate.raw_input && (
            <details className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <summary className="cursor-pointer text-xs font-medium text-slate-600">
                What you pasted (stored as data)
              </summary>
              <p className="mt-2 whitespace-pre-wrap text-xs text-slate-600">{detail.candidate.raw_input}</p>
            </details>
          )}

          {!detail.bridges.length ? (
            <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No bridges yet. Each proposal is graded — only strong and moderate bridges with a validated
              mapping can become content.
            </p>
          ) : (
            <ul className="space-y-3">
              {detail.bridges.map((b) => {
                const g = GRADE[b.status] ?? GRADE.weak;
                return (
                  <li key={b.id} className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded px-2 py-0.5 text-xs font-semibold ${g.cls}`}>{g.label}</span>
                      <span className="text-xs text-slate-500">{b.bridge_type}</span>
                      <span className="font-mono text-xs text-slate-700">{b.competency_id}</span>
                      {b.eligible_for_generation ? (
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">
                          eligible for generation
                        </span>
                      ) : (
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                          visible for review only
                        </span>
                      )}
                      {b.decision !== "proposed" && (
                        <span className="text-xs text-slate-500">· {b.decision}</span>
                      )}
                    </div>

                    {b.angle && <p className="text-sm font-medium text-slate-900">{b.angle}</p>}
                    <dl className="mt-2 space-y-1 text-sm text-slate-700">
                      {b.affected_population && <p><span className="text-slate-500">Affects:</span> {b.affected_population}</p>}
                      {b.relational_consequence && <p><span className="text-slate-500">Consequence:</span> {b.relational_consequence}</p>}
                      {b.rationale && <p><span className="text-slate-500">Why this competency:</span> {b.rationale}</p>}
                    </dl>

                    {!b.mapping_valid && (
                      <p className="mt-2 rounded bg-red-50 px-3 py-2 text-xs text-red-900">
                        <strong>Mapping does not validate.</strong>{" "}
                        {b.mapping_errors?.length ? b.mapping_errors.join(" ") : "The framework relationship is inconsistent."}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => decide(b.id, "accepted")}
                        disabled={busy !== null || b.decision === "accepted"}
                        className="rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:opacity-40"
                      >
                        {b.decision === "accepted" ? "Accepted" : "Accept mapping"}
                      </button>
                      <button
                        onClick={() => {
                          const reason = window.prompt("Why is this bridge wrong? (kept as evidence)");
                          if (reason?.trim()) void decide(b.id, "rejected", reason.trim());
                        }}
                        disabled={busy !== null}
                        className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-600 disabled:opacity-40"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => startBrief(b)}
                        disabled={busy !== null || !b.eligible_for_generation}
                        title={b.eligible_for_generation
                          ? "Create a content brief and open the Script Builder"
                          : "Only a strong or moderate bridge with a validated mapping can become content"}
                        className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
                      >
                        {busy === b.id ? "Working…" : "Start a brief →"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
