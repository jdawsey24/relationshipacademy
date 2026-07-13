"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AiGenerateModal from "@/components/admin/AiGenerateModal";
import { useAdminRole, useCanWrite } from "@/components/admin/RoleContext";
import { WORKSPACE_CONTENT_TYPES, domainLabel, phaseLabel } from "@/lib/studioFramework";
import { LEARNING_TABLES } from "@/lib/studioLibrary";
import { readabilityStats, READABILITY_MIN_WORDS } from "@/lib/readability";

// Content of the RLC Studio Assistant drawer. Competency-route-aware: it detects
// the active competency from the URL and pre-scopes the EXISTING generation
// endpoints. No new AI infrastructure, no chat.

export interface Competency { id: string; name: string; domain: string | null; phase: string | null; status: string }

// Fire-and-forget product-event log via the existing audit trail. Never sends
// free text (e.g. the reading-level sample) — only counts + the competency code.
export function logAssistantEvent(event: string, metadata: Record<string, unknown> = {}) {
  try {
    fetch("/api/admin/studio/assistant/event", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, metadata }), keepalive: true,
    }).catch(() => {});
  } catch { /* ignore */ }
}

const CONTENT_GEN_TYPES = WORKSPACE_CONTENT_TYPES.map((slug) => ({
  slug,
  label: LEARNING_TABLES[slug].label.replace(/s$/, ""),
}));

export default function AssistantPanel() {
  const pathname = usePathname();
  const router = useRouter();
  const role = useAdminRole();
  const canWrite = useCanWrite();
  const isOwner = role === "owner";

  const [comps, setComps] = useState<Competency[] | null>(null);
  useEffect(() => {
    fetch("/api/admin/studio/framework/competencies")
      .then((r) => (r.ok ? r.json() : { competencies: [] }))
      .then((d) => setComps(d.competencies ?? []))
      .catch(() => setComps([]));
  }, []);

  // Competency-route-aware context (V1 resolves ONLY from the workspace route).
  const contextCode = useMemo(() => {
    const m = pathname.match(/^\/admin\/studio\/competency\/([^/]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }, [pathname]);
  const context = useMemo(() => (contextCode && comps ? comps.find((c) => c.id === contextCode) ?? { id: contextCode, name: contextCode, domain: null, phase: null, status: "" } : null), [contextCode, comps]);

  return (
    <div className="space-y-5 px-4 py-4 text-sm">
      {/* Context */}
      <section>
        <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-charcoal/45">Current competency context</h3>
        {context ? (
          <div className="rounded-md border border-light-gray bg-light-gray/40 px-3 py-2">
            <div className="font-semibold text-midnight-navy">{context.name}</div>
            <div className="text-xs text-charcoal/60">{[context.domain && domainLabel(context.domain), context.phase && phaseLabel(context.phase)].filter(Boolean).join(" · ") || "—"}</div>
            <div className="text-[11px] text-charcoal/45">{context.id}{context.status ? ` · ${context.status}` : ""}</div>
          </div>
        ) : (
          <p className="rounded-md border border-dashed border-light-gray px-3 py-2 text-xs text-charcoal/55">No competency is selected on this page. Pick one below to start.</p>
        )}
      </section>

      {context ? <ContextActions competency={context} canWrite={canWrite} /> : <NoContextActions comps={comps} isOwner={isOwner} onPick={(id) => { logAssistantEvent("competency_selected", { competency: id, route: pathname }); router.push(`/admin/studio/competency/${encodeURIComponent(id)}`); }} />}

      {/* Reading-level helper — always available, deterministic, no AI */}
      <ReadingLevel route={pathname} />
    </div>
  );
}

function ContextActions({ competency, canWrite }: { competency: Competency; canWrite: boolean }) {
  const base = `/admin/studio/competency/${encodeURIComponent(competency.id)}`;
  const [gen, setGen] = useState<null | { kind: "items" } | { kind: "content"; slug: string; label: string }>(null);
  const [contentType, setContentType] = useState(CONTENT_GEN_TYPES[0]);
  const [done, setDone] = useState<{ where: string; href: string } | null>(null);

  return (
    <section className="space-y-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-charcoal/45">Create for this competency</h3>

      {!canWrite && <p className="rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">Generation requires editor or owner access.</p>}

      <button
        disabled={!canWrite}
        onClick={() => setGen({ kind: "items" })}
        className="w-full rounded-md border border-dusty-plum px-3 py-2 text-left text-sm font-medium text-dusty-plum hover:bg-dusty-plum/5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        ✨ Generate assessment items
      </button>

      <div className="flex gap-2">
        <select
          value={contentType.slug}
          onChange={(e) => setContentType(CONTENT_GEN_TYPES.find((t) => t.slug === e.target.value) ?? CONTENT_GEN_TYPES[0])}
          className="min-w-0 flex-1 rounded-md border border-light-gray px-2 py-2 text-sm"
        >
          {CONTENT_GEN_TYPES.map((t) => <option key={t.slug} value={t.slug}>{t.label}</option>)}
        </select>
        <button
          disabled={!canWrite}
          onClick={() => setGen({ kind: "content", slug: contentType.slug, label: contentType.label })}
          className="shrink-0 rounded-md border border-dusty-plum px-3 py-2 text-sm font-medium text-dusty-plum hover:bg-dusty-plum/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Generate {contentType.label.toLowerCase()}
        </button>
      </div>

      {done && (
        <p className="rounded-md bg-sage-green/10 px-3 py-2 text-xs text-sage-green">
          Draft created. <Link href={done.href} className="font-semibold underline">View in {done.where}</Link> — approve it there.
        </p>
      )}

      <div className="flex flex-wrap gap-1.5 pt-1">
        {[["Assessment", `${base}/assessment`], ["Content", `${base}/content`], ["Health", `${base}/health`]].map(([label, href]) => (
          <Link key={href} href={href} className="rounded-md border border-light-gray px-2.5 py-1 text-xs text-charcoal/70 hover:bg-light-gray">{label}</Link>
        ))}
      </div>

      {gen?.kind === "items" && (
        <AiGenerateModal
          title={`Generate assessment items for ${competency.id}`}
          subtitle="Claude drafts candidate items grounded in this competency and its behavioral indicators."
          competencies={[{ id: competency.id, name: competency.name }]}
          defaultCompetencyId={competency.id}
          lockCompetency
          showCount
          onClose={() => setGen(null)}
          onGenerate={async (competency_id, count, instructions) => {
            const res = await fetch("/api/admin/studio/assessment/items/generate", {
              method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ competency_id, count, instructions }),
            });
            const d = await res.json().catch(() => ({}));
            if (!res.ok) return d.error ?? "Failed.";
            setGen(null); setDone({ where: "Assessment", href: `${base}/assessment` });
            return null;
          }}
        />
      )}
      {gen?.kind === "content" && (
        <AiGenerateModal
          title={`Generate ${gen.label.toLowerCase()} for ${competency.id}`}
          subtitle="Claude drafts one asset grounded in this competency."
          competencies={[{ id: competency.id, name: competency.name }]}
          defaultCompetencyId={competency.id}
          lockCompetency
          onClose={() => setGen(null)}
          onGenerate={async (competency_id, _count, instructions) => {
            const res = await fetch(`/api/admin/studio/library/${gen.slug}/generate`, {
              method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ competency_id, instructions }),
            });
            const d = await res.json().catch(() => ({}));
            if (!res.ok) return d.error ?? "Failed.";
            setGen(null); setDone({ where: "Content", href: `${base}/content` });
            return null;
          }}
        />
      )}
    </section>
  );
}

function NoContextActions({ comps, isOwner, onPick }: { comps: Competency[] | null; isOwner: boolean; onPick: (id: string) => void }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    if (!comps) return [];
    const s = q.trim().toLowerCase();
    const list = s ? comps.filter((c) => c.name.toLowerCase().includes(s) || c.id.toLowerCase().includes(s)) : comps;
    return list.slice(0, 40);
  }, [comps, q]);

  const links: [string, string][] = [
    ["Framework", "/admin/studio/framework"],
    ["Content Builder", "/admin/ai/content-builder"],
    ["Review Mode", "/admin/ai/review-mode"],
    ["Item Bank", "/admin/studio/assessment/items"],
  ];

  return (
    <section className="space-y-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-charcoal/45">Open a competency</h3>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search competencies…" className="w-full rounded-md border border-light-gray px-2 py-2 text-sm" />
      <div className="max-h-56 overflow-y-auto rounded-md border border-light-gray">
        {!comps ? <p className="px-3 py-2 text-xs text-charcoal/50">Loading…</p> : results.length === 0 ? (
          <p className="px-3 py-2 text-xs text-charcoal/50">No competencies match.</p>
        ) : results.map((c) => (
          <button key={c.id} onClick={() => onPick(c.id)} className="flex w-full items-start justify-between gap-2 border-b border-light-gray px-3 py-1.5 text-left last:border-0 hover:bg-light-gray/60">
            <span className="text-sm text-midnight-navy">{c.name}</span>
            <span className="shrink-0 text-[10px] text-charcoal/45">{[c.domain && domainLabel(c.domain), c.phase && phaseLabel(c.phase)].filter(Boolean).join(" · ")}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {links.filter(([label]) => isOwner || (label !== "Content Builder" && label !== "Review Mode")).map(([label, href]) => (
          <Link key={href} href={href} className="rounded-md border border-light-gray px-2.5 py-1 text-xs text-charcoal/70 hover:bg-light-gray">{label}</Link>
        ))}
      </div>
    </section>
  );
}

function ReadingLevel({ route }: { route: string }) {
  const [text, setText] = useState("");
  const [stats, setStats] = useState<ReturnType<typeof readabilityStats> | null>(null);

  function check() {
    const r = readabilityStats(text);
    setStats(r);
    logAssistantEvent("reading_level_check", { route, words: r.words, sentences: r.sentences, grade: r.fkGrade });
  }

  return (
    <section className="space-y-2 border-t border-light-gray pt-4">
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-charcoal/45">Reading-level check</h3>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Paste consumer-facing copy to estimate its reading level…" className="w-full rounded-md border border-light-gray px-2 py-1.5 text-sm" />
      <button onClick={check} disabled={!text.trim()} className="rounded-md border border-midnight-navy px-3 py-1.5 text-sm font-medium text-midnight-navy hover:bg-light-gray disabled:opacity-50">Check reading level</button>
      {stats && (
        <div className="rounded-md border border-light-gray px-3 py-2 text-xs">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold text-midnight-navy">Grade {stats.fkGrade}</span>
            <span className="text-charcoal/70">{stats.easeLabel}</span>
          </div>
          <div className="mt-1 text-charcoal/60">Words: {stats.words} · Sentences: {stats.sentences}</div>
          <div className="mt-1 text-charcoal/50">Target for consumer content: Grade 5</div>
          {!stats.reliable && <div className="mt-1 rounded bg-amber-50 px-2 py-1 text-amber-800">Sample is short ({stats.words} words) — the estimate may be unreliable. Aim for {READABILITY_MIN_WORDS}+ words.</div>}
          <div className="mt-1 text-[10px] italic text-charcoal/40">Estimate only, not a quality judgment.</div>
        </div>
      )}
    </section>
  );
}
