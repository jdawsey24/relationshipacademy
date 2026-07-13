"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import GenericRowEditor from "@/components/admin/GenericRowEditor";
import StudioStatusBadge from "@/components/admin/StudioStatusBadge";
import { useCanWrite } from "@/components/admin/RoleContext";

type Row = Record<string, unknown>;

// Behavioral Indicators tab — the observable evidence a competency is developing,
// plus the "incomplete" (partial/misapplied) indicators. Both scoped to this
// competency via the existing Library API.
export default function CompetencyIndicatorsPage() {
  const params = useParams<{ code: string }>();
  const code = decodeURIComponent(params.code);
  const canWrite = useCanWrite();

  const [behavioral, setBehavioral] = useState<Row[] | null>(null);
  const [incomplete, setIncomplete] = useState<Row[] | null>(null);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState<{ apiBase: string; pk: string; labelCol: string; row: Row } | null>(null);

  const load = useCallback(() => {
    const qs = `competency_id=${encodeURIComponent(code)}&pageSize=200`;
    Promise.all([
      fetch(`/api/admin/studio/library/behavioral-indicators?${qs}`).then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch(`/api/admin/studio/library/incomplete-indicators?${qs}`).then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
    ])
      .then(([b, i]) => { setBehavioral(b.rows ?? []); setIncomplete(i.rows ?? []); })
      .catch(() => setError(true));
  }, [code]);
  useEffect(() => { load(); }, [load]);

  if (error) return <p className="text-sm text-coral-rose">Failed to load indicators. If the Studio tables aren&apos;t set up yet, run migration 0019.</p>;

  const Section = ({ title, rows, apiBase, pk, labelCol }: { title: string; rows: Row[] | null; apiBase: string; pk: string; labelCol: string }) => (
    <section className="mb-6">
      <h3 className="mb-2 text-sm font-semibold text-midnight-navy">{title}{rows && <span className="ml-1.5 text-xs font-normal text-charcoal/50">({rows.length})</span>}</h3>
      {!rows ? <p className="text-sm text-charcoal/50">Loading…</p> : rows.length === 0 ? (
        <p className="rounded-md border border-light-gray bg-light-gray/40 px-4 py-4 text-sm text-charcoal/60">None yet.</p>
      ) : (
        <ul className="divide-y divide-light-gray rounded-md border border-light-gray">
          {rows.map((r) => (
            <li key={String(r[pk])} className="flex items-start justify-between gap-3 px-3 py-2.5">
              <div>
                <span className="text-sm text-charcoal/90">{String(r[labelCol] ?? "—")}</span>
                <span className="ml-2 align-middle"><StudioStatusBadge status={String(r.status ?? "active")} /></span>
                <span className="block text-[11px] text-charcoal/40">{String(r[pk])}</span>
              </div>
              <button onClick={() => setEditing({ apiBase, pk, labelCol, row: r })} className="shrink-0 text-sm font-medium text-midnight-navy hover:underline">{canWrite ? "Edit" : "View"}</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  return (
    <div>
      <p className="mb-4 max-w-2xl text-sm text-charcoal/70">Observable evidence that this competency is present and developing. Incomplete indicators describe partial or misapplied expressions.</p>
      <Section title="Behavioral Indicators" rows={behavioral} apiBase="/api/admin/studio/library/behavioral-indicators" pk="behavior_id" labelCol="indicator" />
      <Section title="Incomplete Indicators" rows={incomplete} apiBase="/api/admin/studio/library/incomplete-indicators" pk="indicator_id" labelCol="indicator" />
      {editing && (
        <GenericRowEditor apiBase={editing.apiBase} pk={editing.pk} row={editing.row} canWrite={canWrite} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      )}
    </div>
  );
}
