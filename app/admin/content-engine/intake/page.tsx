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
interface Keyword {
  id: string; platform: string; rank: number; primary_phrase: string;
  phrase_kind: string; signal_role: string | null; audience_doorway: string | null;
  rlc_interpretation: string | null; opening_use: string | null;
  supporting_terms: string[] | null; best_format: string | null; cta_fit: string | null;
  phase_raw: string | null; domain_raw: string | null;
  opportunity_score: number; priority_tier: string;
}
interface Community {
  id: string; platform: string; community_keyword: string;
  verified: boolean; usage_guidance: string | null;
}
interface KeywordPayload {
  keywords: Keyword[]; platforms: Record<string, number>;
  tiers: Record<string, number>; communities: Community[]; total: number;
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
  const [kw, setKw] = useState<KeywordPayload | null>(null);
  const [kwPlatform, setKwPlatform] = useState("tiktok");
  const [kwTier, setKwTier] = useState("");
  const [kwQuery, setKwQuery] = useState("");

  const loadTrends = useCallback(async () => {
    const r = await fetch("/api/admin/content-engine/trends");
    if (r.ok) setTrends((await r.json()).trends ?? []);
  }, []);

  const loadDetail = useCallback(async (id: string) => {
    const r = await fetch(`/api/admin/content-engine/trends/${id}`);
    if (r.ok) setDetail(await r.json());
    else setErr((await r.json()).error ?? "Could not load that topic.");
  }, []);

  const loadKeywords = useCallback(async (platform: string, tier: string, q: string) => {
    const p = new URLSearchParams();
    if (platform) p.set("platform", platform);
    if (tier) p.set("tier", tier);
    if (q) p.set("q", q);
    const r = await fetch(`/api/admin/content-engine/keywords?${p}`);
    if (r.ok) setKw(await r.json());
  }, []);

  useEffect(() => { void loadTrends(); }, [loadTrends]);
  useEffect(() => { void loadKeywords(kwPlatform, kwTier, kwQuery); }, [kwPlatform, kwTier, kwQuery, loadKeywords]);
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
        <nav className="mb-3 flex gap-3 text-sm">
          <span className="font-semibold text-slate-900">Topic intake</span>
          <a href="/admin/content-engine/script-builder" className="text-slate-500 hover:text-slate-800">Script Builder</a>
          <a href="/admin/content-engine/approvals" className="text-slate-500 hover:text-slate-800">Approvals</a>
        </nav>
        <h1 className="text-2xl font-semibold text-slate-900">Topic intake</h1>
        <p className="mt-1 text-sm text-slate-600">
          Stages 1–5: what you saw, who it affects, and whether it genuinely belongs to the framework.
          This ends at your decision. Nothing is written until a bridge is approved.
        </p>
      </header>

      {err && <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">{err}</div>}
      {notice && <div className="mb-4 rounded-lg border border-sky-300 bg-sky-50 px-4 py-3 text-sm text-sky-900">{notice}</div>}

      {/* What is worth making something about */}
      <KeywordBrowser
        kw={kw} platform={kwPlatform} tier={kwTier} query={kwQuery}
        onPlatform={setKwPlatform} onTier={setKwTier} onQuery={setKwQuery}
        onUse={(k, community) => {
          // Seed the intake box with the phrase and the context the corpus
          // already holds, so the topic arrives with its reasoning attached.
          setRaw([
            k.primary_phrase,
            k.audience_doorway ? `\n\nWhat the audience is actually saying: ${k.audience_doorway}` : "",
            k.rlc_interpretation ? `\n\nRLC reading: ${k.rlc_interpretation}` : "",
            k.opening_use ? `\n\nSuggested opening: ${k.opening_use}` : "",
          ].filter(Boolean).join(""));
          setCommunity(community || k.platform);
          setNotice(`Loaded “${k.primary_phrase}” (${k.platform}, ${k.priority_tier}, score ${k.opportunity_score}). Edit it before adding.`);
          window.scrollTo({ top: document.body.scrollHeight / 3, behavior: "smooth" });
        }}
      />

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

const TIER_STYLE: Record<string, string> = {
  "Tier 1": "bg-emerald-100 text-emerald-900",
  "Tier 2": "bg-sky-100 text-sky-900",
  "Tier 3": "bg-slate-100 text-slate-700",
};

/**
 * The keyword corpus, on the screen where a topic is chosen.
 *
 * 270 scored phrases across seven platforms were imported and then had nowhere
 * to appear, so choosing a topic meant guessing — which is the exact thing the
 * corpus exists to prevent. Sorted by opportunity score, because that is what
 * the scoring was for.
 *
 * Selecting a phrase carries its context into the intake box rather than just
 * the words: the audience doorway (how people actually say it), the RLC reading,
 * and the suggested opening. A phrase without its reasoning is a prompt to
 * invent one.
 */
function KeywordBrowser({ kw, platform, tier, query, onPlatform, onTier, onQuery, onUse }: {
  kw: KeywordPayload | null;
  platform: string; tier: string; query: string;
  onPlatform: (v: string) => void; onTier: (v: string) => void; onQuery: (v: string) => void;
  onUse: (k: Keyword, community: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const communities = (kw?.communities ?? []).filter((c) => c.platform === platform && c.community_keyword);

  return (
    <section className="mb-8 rounded-lg border border-slate-200 bg-white">
      <button onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">What&rsquo;s worth making something about</h2>
          <p className="text-xs text-slate-500">
            {kw ? `${kw.total} scored phrases across ${Object.keys(kw.platforms).length} platforms` : "Loading…"}
          </p>
        </div>
        <span className="text-xs text-slate-500">{open ? "Hide" : "Show"}</span>
      </button>

      {open && kw && (
        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {Object.entries(kw.platforms).sort((a, b) => b[1] - a[1]).map(([p, n]) => (
              <button key={p} onClick={() => onPlatform(p)}
                className={`rounded px-2 py-1 text-xs ${platform === p
                  ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-600"}`}>
                {p} <span className="opacity-60">{n}</span>
              </button>
            ))}
            <select value={tier} onChange={(e) => onTier(e.target.value)}
              className="rounded border border-slate-300 px-2 py-1 text-xs">
              <option value="">All tiers</option>
              {Object.keys(kw.tiers).sort().map((t) => (
                <option key={t} value={t}>{t} ({kw.tiers[t]})</option>
              ))}
            </select>
            <input value={query} onChange={(e) => onQuery(e.target.value)}
              placeholder="Search phrases…"
              className="min-w-[160px] flex-1 rounded border border-slate-300 px-2 py-1 text-xs" />
          </div>

          {communities.length > 0 && (
            <p className="mb-3 text-xs text-slate-500">
              Communities on {platform}: {communities.map((c) => c.community_keyword).join(" · ")}
            </p>
          )}

          {!kw.keywords.length ? (
            <p className="py-6 text-center text-sm text-slate-500">No phrases match.</p>
          ) : (
            <ul className="max-h-[26rem] divide-y divide-slate-100 overflow-y-auto rounded border border-slate-200">
              {kw.keywords.map((k) => (
                <li key={k.id} className="px-3 py-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <button onClick={() => setExpanded(expanded === k.id ? null : k.id)}
                      className="min-w-0 flex-1 text-left">
                      <p className="text-sm text-slate-800">{k.primary_phrase}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                        <span className={`rounded px-1.5 py-0.5 ${TIER_STYLE[k.priority_tier] ?? "bg-slate-100 text-slate-700"}`}>
                          {k.priority_tier}
                        </span>
                        <span>score {k.opportunity_score}</span>
                        <span>· #{k.rank}</span>
                        <span>· {k.phrase_kind.replace(/_/g, " ")}</span>
                        {k.phase_raw && <span>· {k.phase_raw}</span>}
                      </p>
                    </button>
                    <button onClick={() => onUse(k, communities[0]?.community_keyword ?? "")}
                      className="shrink-0 rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">
                      Use this
                    </button>
                  </div>

                  {expanded === k.id && (
                    <dl className="mt-2 space-y-1 rounded bg-slate-50 p-2 text-xs text-slate-700">
                      {k.audience_doorway && <p><span className="text-slate-500">They say:</span> &ldquo;{k.audience_doorway}&rdquo;</p>}
                      {k.rlc_interpretation && <p><span className="text-slate-500">RLC reading:</span> {k.rlc_interpretation}</p>}
                      {k.opening_use && <p><span className="text-slate-500">Opening:</span> {k.opening_use}</p>}
                      {k.domain_raw && <p><span className="text-slate-500">Domain:</span> {k.domain_raw}</p>}
                      {k.best_format && <p><span className="text-slate-500">Format:</span> {k.best_format}</p>}
                      {k.cta_fit && <p><span className="text-slate-500">CTA fit:</span> {k.cta_fit}</p>}
                      {k.supporting_terms?.length ? (
                        <p><span className="text-slate-500">Supporting:</span> {k.supporting_terms.join(", ")}</p>
                      ) : null}
                      {k.signal_role && <p><span className="text-slate-500">Signal:</span> {k.signal_role}</p>}
                    </dl>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-slate-500">
            Sorted by opportunity score. Selecting a phrase carries its audience doorway, RLC reading and
            suggested opening into the box below — edit before adding, since the score says a phrase is
            worth attention, not that this framing is right.
          </p>
        </div>
      )}
    </section>
  );
}
