"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StudioTabs from "@/components/admin/StudioTabs";
import { useAdminRole, useCanWrite } from "@/components/admin/RoleContext";
import {
  AUDIENCES,
  OBJECT_TYPES,
  PROVENANCE_LABELS,
  PUBLISHABLE_TYPES,
  STATUS_LABELS,
  type Audience,
  type KbCompetency,
  type ObjectType,
  type StudioObject,
  type StudioStatus,
} from "@/lib/studio";

const STATUS_CLASS: Record<StudioStatus, string> = {
  draft: "bg-light-gray text-charcoal/60",
  in_review: "bg-amber-100 text-amber-800",
  changes_requested: "bg-coral-rose/20 text-coral-rose",
  approved: "bg-blue-100 text-blue-700",
  published: "bg-sage-green/20 text-sage-green",
  retired: "bg-light-gray text-charcoal/40",
};

function typeLabel(t: string) {
  return OBJECT_TYPES.find((o) => o.value === t)?.label ?? t;
}
function fmt(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function StatusBadge({ status }: { status: StudioStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${STATUS_CLASS[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
function ProvenanceBadge({ p }: { p: string }) {
  if (p === "human") return null;
  return (
    <span className="ml-2 rounded-full bg-dusty-plum/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-dusty-plum" title={PROVENANCE_LABELS[p as keyof typeof PROVENANCE_LABELS]}>
      {p === "ai_generated" ? "AI" : "AI-assisted"}
    </span>
  );
}

export default function StudioRegistryPage() {
  const router = useRouter();
  const role = useAdminRole();
  const canWrite = useCanWrite();
  const isOwner = role === "owner";

  const [rows, setRows] = useState<StudioObject[] | null>(null);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState({ type: "", audience: "", status: "" });
  const [showNew, setShowNew] = useState(false);
  const [showGen, setShowGen] = useState(false);

  const load = useCallback(() => {
    const qs = new URLSearchParams();
    if (filters.type) qs.set("type", filters.type);
    if (filters.audience) qs.set("audience", filters.audience);
    if (filters.status) qs.set("status", filters.status);
    fetch(`/api/admin/studio/objects?${qs.toString()}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setRows(d.rows))
      .catch(() => setError(true));
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const queue = (rows ?? []).filter((r) => r.status === "in_review");
  const audiences = AUDIENCES.filter((a) => !a.ownerOnly || isOwner);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Content &amp; Assessment Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">Author, version, review, approve, and publish RLC content — grounded in the Knowledge Base.</p>
      <StudioTabs />

      {isOwner && queue.length > 0 && (
        <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 p-4">
          <h2 className="mb-2 text-sm font-semibold text-amber-900">Needs your review ({queue.length})</h2>
          <ul className="space-y-1">
            {queue.map((r) => (
              <li key={r.id} className="text-sm">
                <Link href={`/admin/studio/objects/${r.id}`} className="font-medium text-midnight-navy hover:underline">{r.title}</Link>
                <span className="text-charcoal/50"> — {typeLabel(r.object_type)} · {r.audience}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))} className="rounded-md border border-light-gray px-2 py-1.5 text-sm">
          <option value="">All types</option>
          {OBJECT_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={filters.audience} onChange={(e) => setFilters((f) => ({ ...f, audience: e.target.value }))} className="rounded-md border border-light-gray px-2 py-1.5 text-sm">
          <option value="">All audiences</option>
          {audiences.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
        <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className="rounded-md border border-light-gray px-2 py-1.5 text-sm">
          <option value="">All statuses</option>
          {(Object.keys(STATUS_LABELS) as StudioStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <div className="ml-auto flex gap-2">
          {canWrite && <button onClick={() => setShowGen(true)} className="rounded-md border border-dusty-plum px-3 py-1.5 text-sm font-medium text-dusty-plum hover:bg-dusty-plum/5">Generate with AI</button>}
          {canWrite && <button onClick={() => setShowNew(true)} className="rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white hover:bg-midnight-navy/90">New draft</button>}
        </div>
      </div>

      {error && <p className="text-sm text-coral-rose">Failed to load. If the Studio tables aren&apos;t set up yet, run migration 0017_studio.sql.</p>}
      {!error && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-sm text-charcoal/60">No items yet. Create your first draft or generate one with AI.</p>}

      {rows && rows.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                <th className="px-3 py-2 font-semibold">Title</th>
                <th className="px-3 py-2 font-semibold">Type</th>
                <th className="px-3 py-2 font-semibold">Audience</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Ver</th>
                <th className="px-3 py-2 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2">
                    <Link href={`/admin/studio/objects/${r.id}`} className="font-medium text-midnight-navy hover:underline">{r.title}</Link>
                    <ProvenanceBadge p={r.provenance} />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{typeLabel(r.object_type)}</td>
                  <td className="px-3 py-2 capitalize">{r.audience}</td>
                  <td className="px-3 py-2"><StatusBadge status={r.status} /></td>
                  <td className="px-3 py-2 text-charcoal/60">v{r.current_version}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-charcoal/60">{fmt(r.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showNew && <NewDraftModal isOwner={isOwner} onClose={() => setShowNew(false)} onCreated={(id) => router.push(`/admin/studio/objects/${id}`)} />}
      {showGen && <GenerateModal isOwner={isOwner} onClose={() => setShowGen(false)} onCreated={(id) => router.push(`/admin/studio/objects/${id}`)} />}
    </div>
  );
}

function NewDraftModal({ isOwner, onClose, onCreated }: { isOwner: boolean; onClose: () => void; onCreated: (id: string) => void }) {
  const [type, setType] = useState<ObjectType>("article");
  const [audience, setAudience] = useState<Audience>("consumer");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const audiences = AUDIENCES.filter((a) => !a.ownerOnly || isOwner);

  async function submit() {
    if (!title.trim()) { setErr("Title is required."); return; }
    setBusy(true); setErr(null);
    const res = await fetch("/api/admin/studio/objects", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ object_type: type, audience, title, summary }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setErr(d.error ?? "Failed."); setBusy(false); return; }
    onCreated(d.id);
  }

  return (
    <Modal title="New draft" onClose={onClose}>
      <label className="block text-sm font-medium text-charcoal">Type
        <select value={type} onChange={(e) => setType(e.target.value as ObjectType)} className="mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm">
          {OBJECT_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}{PUBLISHABLE_TYPES.includes(o.value) ? "" : " (draft/review only for now)"}</option>)}
        </select>
      </label>
      <label className="mt-3 block text-sm font-medium text-charcoal">Audience
        <select value={audience} onChange={(e) => setAudience(e.target.value as Audience)} className="mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm">
          {audiences.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
      </label>
      <label className="mt-3 block text-sm font-medium text-charcoal">Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm" />
      </label>
      <label className="mt-3 block text-sm font-medium text-charcoal">Summary <span className="font-normal text-charcoal/50">(optional)</span>
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className="mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm" />
      </label>
      {err && <p className="mt-2 text-sm text-coral-rose">{err}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-md border border-light-gray px-3 py-1.5 text-sm">Cancel</button>
        <button onClick={submit} disabled={busy} className="rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">{busy ? "Creating…" : "Create draft"}</button>
      </div>
    </Modal>
  );
}

function GenerateModal({ isOwner, onClose, onCreated }: { isOwner: boolean; onClose: () => void; onCreated: (id: string) => void }) {
  const [type, setType] = useState<ObjectType>("article");
  const [audience, setAudience] = useState<Audience>("consumer");
  const [prompt, setPrompt] = useState("");
  const [kb, setKb] = useState<KbCompetency[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const audiences = AUDIENCES.filter((a) => !a.ownerOnly || isOwner);

  useEffect(() => {
    fetch("/api/admin/studio/generate").then((r) => r.json()).then((d) => setConfigured(!!d.configured)).catch(() => setConfigured(false));
    fetch("/api/admin/studio/kb?status=active").then((r) => r.json()).then((d) => setKb(d.rows ?? [])).catch(() => setKb([]));
  }, []);

  function toggle(id: string) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function submit() {
    if (selected.length === 0) { setErr("Select at least one competency."); return; }
    setBusy(true); setErr(null);
    const res = await fetch("/api/admin/studio/generate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ object_type: type, audience, kb_ids: selected, prompt }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setErr(d.error ?? "Failed."); setBusy(false); return; }
    onCreated(d.id);
  }

  return (
    <Modal title="Generate a draft with AI" onClose={onClose}>
      <p className="mb-3 rounded-md bg-dusty-plum/10 px-3 py-2 text-xs text-dusty-plum">
        AI drafts only from the approved Knowledge Base records you select, and always lands as a <strong>Draft</strong> for your review — it can never publish on its own.
      </p>
      {configured === false && (
        <p className="mb-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">AI generation isn&apos;t configured. Set <code>ANTHROPIC_API_KEY</code> to enable it.</p>
      )}
      <div className="flex gap-2">
        <label className="block flex-1 text-sm font-medium text-charcoal">Type
          <select value={type} onChange={(e) => setType(e.target.value as ObjectType)} className="mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm">
            {OBJECT_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
        <label className="block flex-1 text-sm font-medium text-charcoal">Audience
          <select value={audience} onChange={(e) => setAudience(e.target.value as Audience)} className="mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm">
            {audiences.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-3 text-sm font-medium text-charcoal">Source competencies (approved only)</div>
      <div className="mt-1 max-h-44 overflow-y-auto rounded-md border border-light-gray p-2">
        {!kb && <p className="text-sm text-charcoal/50">Loading…</p>}
        {kb && kb.length === 0 && <p className="text-sm text-charcoal/50">No active competencies. Add some in the Knowledge Base.</p>}
        {kb?.map((k) => (
          <label key={k.id} className="flex items-start gap-2 py-1 text-sm">
            <input type="checkbox" checked={selected.includes(k.id)} onChange={() => toggle(k.id)} className="mt-1" />
            <span><span className="font-medium">{k.name}</span> <span className="text-charcoal/50">· {k.kind}</span></span>
          </label>
        ))}
      </div>
      <label className="mt-3 block text-sm font-medium text-charcoal">Instructions <span className="font-normal text-charcoal/50">(optional)</span>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={2} placeholder="e.g. Write a warm intro article for people new to the Exploration phase." className="mt-1 w-full rounded-md border border-light-gray px-2 py-1.5 text-sm" />
      </label>
      {err && <p className="mt-2 text-sm text-coral-rose">{err}</p>}
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-md border border-light-gray px-3 py-1.5 text-sm">Cancel</button>
        <button onClick={submit} disabled={busy || configured === false} className="rounded-md bg-dusty-plum px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">{busy ? "Generating…" : "Generate draft"}</button>
      </div>
    </Modal>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-3 text-lg font-semibold text-midnight-navy">{title}</h3>
        {children}
      </div>
    </div>
  );
}
