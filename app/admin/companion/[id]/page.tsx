"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BLOCK_TYPES, STATUS_LABELS, TRANSITIONS, isEditable,
  type ContentStatus, type ContentAction,
} from "@/lib/companion";

type Block = { id: string; block_type: string; block_order: number; payload: unknown; conditional_on: unknown };
type Detail = {
  experience: Record<string, unknown>;
  blocks: Block[];
  versions: { version_no: number; created_at: string }[];
  reviews: { action: string; actor: string | null; from_status: string | null; to_status: string | null; created_at: string; note: string | null }[];
};

const ACTION_LABEL: Record<ContentAction, string> = {
  submit_for_review: "Submit for review", advance: "Advance", request_changes: "Request changes",
  approve: "Approve", publish: "Publish", unpublish: "Unpublish", revise: "Revise", archive: "Archive", restore: "Restore",
};

export default function CompanionExperienceEditor() {
  const { id } = useParams<{ id: string }>();
  const [d, setD] = useState<Detail | null>(null);
  const [role, setRole] = useState<string>("viewer");
  const [err, setErr] = useState<string | null>(null);
  const [newType, setNewType] = useState<string>(BLOCK_TYPES[0].type);

  const load = useCallback(async () => {
    const [dr, mr] = await Promise.all([fetch(`/api/admin/companion/experiences/${id}`), fetch("/api/admin/me")]);
    if (!dr.ok) { setErr("Failed to load."); return; }
    setD(await dr.json());
    if (mr.ok) setRole((await mr.json()).role ?? "viewer");
  }, [id]);
  useEffect(() => { load(); }, [load]);

  if (err) return <p className="text-sm text-coral-rose">{err}</p>;
  if (!d) return <p className="text-sm text-charcoal/60">Loading…</p>;

  const exp = d.experience;
  const status = exp.status as ContentStatus;
  const editable = isEditable(status);
  const isOwner = role === "owner";
  const actions = Object.entries(TRANSITIONS[status] ?? {})
    .filter(([, t]) => !t.ownerOnly || isOwner)
    .map(([a]) => a as ContentAction);

  async function api(url: string, method: string, body?: unknown) {
    setErr(null);
    const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { setErr(j.error ?? "Failed."); return false; }
    await load(); return true;
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/companion" className="text-sm text-charcoal/55 hover:text-charcoal">← All experiences</Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-midnight-navy">{String(exp.title)}</h1>
          <p className="mt-1 text-sm text-charcoal/55">/{String(exp.slug)} · <span className="font-medium">{STATUS_LABELS[status]}</span> · published v{(exp.published_version as number) ?? "—"}</p>
        </div>
      </div>

      {/* Workflow actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {actions.length === 0 ? <span className="text-xs text-charcoal/45">No actions available in this state.</span> :
          actions.map((a) => (
            <button key={a} onClick={() => api(`/api/admin/companion/experiences/${id}/transition`, "POST", { action: a })}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${a === "publish" ? "bg-midnight-navy text-white" : "border border-light-gray text-midnight-navy hover:bg-warm-ivory"}`}>
              {ACTION_LABEL[a]}
            </button>
          ))}
      </div>
      {err && <p className="mt-2 text-sm text-coral-rose">{err}</p>}

      {/* Metadata */}
      <section className="mt-6 rounded-xl border border-light-gray bg-white p-5">
        <p className="text-sm font-semibold text-midnight-navy">Details {!editable && <span className="ml-2 text-xs font-normal text-charcoal/45">(read-only — revise to edit)</span>}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <MetaField label="Consumer title" value={exp.consumer_title as string} disabled={!editable} onSave={(v) => api(`/api/admin/companion/experiences/${id}`, "PATCH", { consumer_title: v })} />
          <MetaField label="Estimated minutes" value={String(exp.est_minutes ?? "")} disabled={!editable} onSave={(v) => api(`/api/admin/companion/experiences/${id}`, "PATCH", { est_minutes: v ? Number(v) : null })} />
          <MetaField label="Short description" value={exp.short_description as string} disabled={!editable} full onSave={(v) => api(`/api/admin/companion/experiences/${id}`, "PATCH", { short_description: v })} />
        </div>
      </section>

      {/* Blocks */}
      <section className="mt-6 rounded-xl border border-light-gray bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-midnight-navy">Blocks ({d.blocks.length})</p>
          {editable && (
            <div className="flex gap-2">
              <select value={newType} onChange={(e) => setNewType(e.target.value)} className="admin-input text-sm">
                {BLOCK_TYPES.map((b) => <option key={b.type} value={b.type}>{b.label}</option>)}
              </select>
              <button onClick={() => api(`/api/admin/companion/experiences/${id}/blocks`, "POST", { blockType: newType })} className="rounded-md bg-midnight-navy px-3 py-1.5 text-sm font-semibold text-white">Add block</button>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {d.blocks.length === 0 && <p className="text-sm text-charcoal/50">No blocks yet.</p>}
          {d.blocks.map((b, i) => {
            const label = BLOCK_TYPES.find((t) => t.type === b.block_type)?.label ?? b.block_type;
            return (
              <div key={b.id} className="rounded-lg border border-light-gray p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-charcoal/50">{i + 1}. {label}</span>
                  {editable && (
                    <div className="flex gap-1.5 text-xs">
                      <button disabled={i === 0} onClick={() => api(`/api/admin/companion/experiences/${id}/blocks`, "PATCH", { orderedIds: move(d.blocks.map((x) => x.id), i, i - 1) })} className="px-1.5 text-charcoal/50 hover:text-charcoal disabled:opacity-30">↑</button>
                      <button disabled={i === d.blocks.length - 1} onClick={() => api(`/api/admin/companion/experiences/${id}/blocks`, "PATCH", { orderedIds: move(d.blocks.map((x) => x.id), i, i + 1) })} className="px-1.5 text-charcoal/50 hover:text-charcoal disabled:opacity-30">↓</button>
                      <button onClick={() => api(`/api/admin/companion/blocks/${b.id}`, "POST")} className="px-1.5 text-charcoal/50 hover:text-charcoal">Duplicate</button>
                      <button onClick={() => api(`/api/admin/companion/blocks/${b.id}`, "DELETE")} className="px-1.5 text-coral-rose hover:underline">Delete</button>
                    </div>
                  )}
                </div>
                <PayloadEditor payload={b.payload} disabled={!editable} onSave={(p) => api(`/api/admin/companion/blocks/${b.id}`, "PATCH", { payload: p })} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Review log */}
      <section className="mt-6 rounded-xl border border-light-gray bg-white p-5">
        <p className="text-sm font-semibold text-midnight-navy">Review history</p>
        <div className="mt-3 space-y-1.5 text-sm">
          {d.reviews.length === 0 ? <p className="text-charcoal/50">No history yet.</p> : d.reviews.map((r, i) => (
            <div key={i} className="flex justify-between border-b border-light-gray/50 py-1 last:border-0">
              <span className="text-charcoal/80">{r.action.replace(/_/g, " ")}{r.from_status && r.to_status ? ` · ${r.from_status} → ${r.to_status}` : ""}</span>
              <span className="text-xs text-charcoal/45">{r.actor ?? "—"} · {new Date(r.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function move(arr: string[], from: number, to: number): string[] {
  const a = [...arr]; const [x] = a.splice(from, 1); a.splice(to, 0, x); return a;
}

function MetaField({ label, value, disabled, full, onSave }: { label: string; value: string | null; disabled: boolean; full?: boolean; onSave: (v: string) => void }) {
  const [v, setV] = useState(value ?? "");
  useEffect(() => { setV(value ?? ""); }, [value]);
  return (
    <label className={`block text-sm ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium text-charcoal/60">{label}</span>
      <input value={v} disabled={disabled} onChange={(e) => setV(e.target.value)} onBlur={() => v !== (value ?? "") && onSave(v)}
        className="admin-input mt-1 w-full disabled:opacity-60" />
    </label>
  );
}

function PayloadEditor({ payload, disabled, onSave }: { payload: unknown; disabled: boolean; onSave: (p: unknown) => void }) {
  const [text, setText] = useState(() => JSON.stringify(payload ?? {}, null, 2));
  const [dirty, setDirty] = useState(false);
  const [bad, setBad] = useState(false);
  useEffect(() => { setText(JSON.stringify(payload ?? {}, null, 2)); setDirty(false); }, [payload]);
  return (
    <div className="mt-2">
      <textarea value={text} disabled={disabled} onChange={(e) => { setText(e.target.value); setDirty(true); }}
        className="admin-input w-full font-ui text-xs disabled:opacity-60" rows={3} spellCheck={false} />
      {!disabled && dirty && (
        <div className="mt-1 flex items-center gap-2">
          <button onClick={() => { try { const p = JSON.parse(text); setBad(false); onSave(p); } catch { setBad(true); } }} className="rounded bg-midnight-navy px-2 py-1 text-xs font-semibold text-white">Save block</button>
          {bad && <span className="text-xs text-coral-rose">Invalid JSON</span>}
          <span className="text-xs text-charcoal/40">Placeholder payload — final content supplied later.</span>
        </div>
      )}
    </div>
  );
}
