"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import GenericRowEditor from "@/components/admin/GenericRowEditor";
import AiGenerateModal from "@/components/admin/AiGenerateModal";
import StudioStatusBadge from "@/components/admin/StudioStatusBadge";
import { useCanWrite } from "@/components/admin/RoleContext";
import { WORKSPACE_CONTENT_TYPES } from "@/lib/studioFramework";
import { LEARNING_TABLES } from "@/lib/studioLibrary";

type Row = Record<string, unknown>;

// Content tab — every content asset that belongs to this competency, grouped by
// type, each with in-place AI generation. Reuses the existing Library list/edit/
// generate endpoints; drafts still flow through the normal Review Queue.
export default function CompetencyContentPage() {
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(params.code);
  const canWrite = useCanWrite();

  const [rowsByType, setRowsByType] = useState<Record<string, Row[]>>({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ apiBase: string; pk: string; row: Row } | null>(null);
  const [genType, setGenType] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const qs = `competency_id=${encodeURIComponent(code)}&pageSize=200`;
    Promise.all(
      WORKSPACE_CONTENT_TYPES.map((t) =>
        fetch(`/api/admin/studio/library/${t}?${qs}`)
          .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
          .then((d) => [t, (d.rows ?? []) as Row[]] as const)
      )
    )
      .then((pairs) => { setRowsByType(Object.fromEntries(pairs)); setError(false); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [code]);
  useEffect(() => { load(); }, [load]);

  if (error) return <p className="text-sm text-coral-rose">Failed to load content. If the Studio tables aren&apos;t set up yet, run migration 0019.</p>;

  return (
    <div>
      <p className="mb-4 max-w-2xl text-sm text-charcoal/70">Every content asset built for this competency. Generate new drafts with AI in place — they arrive as Drafts for review, never published automatically.</p>
      {msg && <div className="mb-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}
      {loading && <p className="mb-3 text-sm text-charcoal/50">Loading…</p>}

      <div className="space-y-5">
        {WORKSPACE_CONTENT_TYPES.map((t) => {
          const cfg = LEARNING_TABLES[t];
          const rows = rowsByType[t] ?? [];
          const generatable = cfg.generatable;
          return (
            <section key={t} className="rounded-lg border border-light-gray">
              <header className="flex items-center justify-between rounded-t-lg bg-midnight-navy/5 px-4 py-2.5">
                <h3 className="text-sm font-semibold text-midnight-navy">{cfg.label} <span className="font-normal text-charcoal/50">({rows.length})</span></h3>
                {canWrite && generatable && (
                  <button onClick={() => setGenType(t)} className="rounded-md border border-dusty-plum px-3 py-1 text-xs font-medium text-dusty-plum hover:bg-dusty-plum/5">Generate with AI</button>
                )}
              </header>
              {rows.length === 0 ? (
                <p className="px-4 py-4 text-sm text-charcoal/50">None yet.{generatable && canWrite ? " Generate a first draft above." : ""}</p>
              ) : (
                <ul className="divide-y divide-light-gray">
                  {rows.map((r) => (
                    <li key={String(r[cfg.pk])} className="flex items-start justify-between gap-3 px-4 py-2.5">
                      <div>
                        <span className="text-sm text-charcoal/90">{String(r[cfg.labelCol] ?? "—")}</span>
                        {r.provenance === "ai_generated" && <span className="ml-1.5 rounded bg-dusty-plum/15 px-1 py-0.5 text-[10px] font-semibold uppercase text-dusty-plum">AI</span>}
                        <span className="ml-2 align-middle"><StudioStatusBadge status={String(r.status ?? "draft")} /></span>
                        <span className="block text-[11px] text-charcoal/40">{String(r[cfg.pk])}</span>
                      </div>
                      <button onClick={() => setEditing({ apiBase: `/api/admin/studio/library/${t}`, pk: cfg.pk, row: r })} className="shrink-0 text-sm font-medium text-midnight-navy hover:underline">{canWrite ? "Edit" : "View"}</button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-charcoal/50">
        Lessons are keyed to multiple competencies — manage them in the{" "}
        <Link href="/admin/studio/library/lessons" className="text-midnight-navy hover:underline">Content Library</Link>.
      </p>

      {editing && (
        <GenericRowEditor apiBase={editing.apiBase} pk={editing.pk} row={editing.row} canWrite={canWrite} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      )}
      {genType && (
        <AiGenerateModal
          title={`Generate ${LEARNING_TABLES[genType as keyof typeof LEARNING_TABLES].label.replace(/s$/, "").toLowerCase()} for ${code}`}
          subtitle="Claude drafts one asset grounded in this competency."
          competencies={[{ id: code, name: code }]}
          defaultCompetencyId={code}
          lockCompetency
          onClose={() => setGenType(null)}
          onGenerate={async (competency_id, _count, instructions) => {
            const res = await fetch(`/api/admin/studio/library/${genType}/generate`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ competency_id, instructions }),
            });
            const d = await res.json().catch(() => ({}));
            if (!res.ok) return d.error ?? "Failed.";
            setGenType(null);
            setMsg("Generated a draft — it appears below. Edit its status to approve and add it to the library.");
            load();
            return null;
          }}
        />
      )}
    </div>
  );
}
