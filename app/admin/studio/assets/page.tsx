"use client";

import { useCallback, useEffect, useState } from "react";
import StudioTabs from "@/components/admin/StudioTabs";
import StudioStatusBadge from "@/components/admin/StudioStatusBadge";
import { useAdminRole, useCanWrite } from "@/components/admin/RoleContext";
import { ASSET_TYPES, type Asset } from "@/lib/studioAssets";
import { DOMAIN_SLUGS, PHASE_SLUGS, domainLabel } from "@/lib/studioAssessment";
import { AUDIENCES, STATUS_LABELS, type StudioStatus } from "@/lib/studio";

const INP = "rounded-md border border-light-gray px-2 py-1.5 text-sm";

export default function AssetLibraryPage() {
  const role = useAdminRole();
  const canWrite = useCanWrite();
  const isOwner = role === "owner";
  const [rows, setRows] = useState<Asset[] | null>(null);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [filters, setFilters] = useState({ asset_type: "", audience: "", status: "", search: "" });
  const [editing, setEditing] = useState<Asset | null>(null);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(() => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) if (v) qs.set(k, v);
    fetch(`/api/admin/studio/assets?${qs}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => setRows(d.rows))
      .catch(() => setError(true));
  }, [filters]);
  useEffect(() => { load(); }, [load]);

  async function sync() {
    setSyncing(true); setMsg(null);
    const res = await fetch("/api/admin/studio/assets/sync", { method: "POST" });
    const d = await res.json().catch(() => ({}));
    setSyncing(false);
    if (!res.ok) { setMsg(d.error ?? "Sync failed."); return; }
    setMsg(`Synced: ${d.added} new file(s) indexed (${d.total} in bucket).`); load();
  }

  async function del(a: Asset) {
    const purge = window.confirm("Delete this asset from the catalogue?\n\nOK = remove catalogue entry only.\nCancel = keep it.\n\n(To also delete the file from storage, use the checkbox in the editor.)");
    if (!purge) return;
    const res = await fetch(`/api/admin/studio/assets/${a.id}`, { method: "DELETE" });
    if (res.ok) { setMsg("Removed from catalogue."); load(); } else { const d = await res.json().catch(() => ({})); setMsg(d.error ?? "Failed."); }
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Content &amp; Assessment Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">Asset Library — a governed, taggable catalogue over the media bucket.</p>
      <StudioTabs />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select value={filters.asset_type} onChange={(e) => setFilters((f) => ({ ...f, asset_type: e.target.value }))} className={INP}>
          <option value="">All types</option>
          {ASSET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filters.audience} onChange={(e) => setFilters((f) => ({ ...f, audience: e.target.value }))} className={INP}>
          <option value="">All audiences</option>
          {AUDIENCES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
        <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className={INP}>
          <option value="">All statuses</option>
          {(Object.keys(STATUS_LABELS) as StudioStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <input value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} placeholder="Search title…" className={`${INP} min-w-[160px] flex-1`} />
        {canWrite && <button onClick={sync} disabled={syncing} className="rounded-md bg-midnight-navy px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50">{syncing ? "Syncing…" : "Sync from bucket"}</button>}
      </div>

      {msg && <div className="mb-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}
      {error && <p className="text-sm text-coral-rose">Failed to load. If the asset table isn&apos;t set up yet, run migration 0020_studio_assets.sql.</p>}
      {!error && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-sm text-charcoal/60">No assets catalogued yet. Click “Sync from bucket” to index existing media files.</p>}

      {rows && rows.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((a) => (
            <div key={a.id} className="rounded-md border border-light-gray p-3">
              <div className="mb-2 flex h-28 items-center justify-center overflow-hidden rounded bg-light-gray">
                {a.asset_type === "image" && a.file_url
                  ? <img src={a.file_url} alt={a.title ?? ""} className="max-h-28 max-w-full object-contain" />
                  : <span className="text-3xl uppercase text-charcoal/40">{a.asset_type ?? "file"}</span>}
              </div>
              <div className="flex items-start justify-between gap-2">
                <button onClick={() => setEditing(a)} className="text-left text-sm font-medium text-midnight-navy hover:underline">{a.title || a.file_name}</button>
                <StudioStatusBadge status={a.status} />
              </div>
              <div className="mt-1 flex flex-wrap gap-1 text-[11px] text-charcoal/50">
                {a.audience && <span className="rounded bg-light-gray px-1.5 py-0.5">{a.audience}</span>}
                {a.domain && <span className="rounded bg-light-gray px-1.5 py-0.5">{domainLabel(a.domain)}</span>}
                {(a.tags ?? []).slice(0, 3).map((t) => <span key={t} className="rounded bg-light-gray px-1.5 py-0.5">{t}</span>)}
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs">
                {a.file_url && <a href={a.file_url} target="_blank" rel="noreferrer" className="text-midnight-navy hover:underline">Open</a>}
                {canWrite && <button onClick={() => setEditing(a)} className="text-midnight-navy hover:underline">Edit</button>}
                {isOwner && <button onClick={() => del(a)} className="text-coral-rose hover:underline">Delete</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && <AssetEditor asset={editing} canWrite={canWrite} isOwner={isOwner} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} onDeleted={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function AssetEditor({ asset, canWrite, isOwner, onClose, onSaved, onDeleted }: { asset: Asset; canWrite: boolean; isOwner: boolean; onClose: () => void; onSaved: () => void; onDeleted: () => void }) {
  const [d, setD] = useState<Asset>(asset);
  const [tags, setTags] = useState((asset.tags ?? []).join(", "));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const set = (k: keyof Asset, v: unknown) => setD((p) => ({ ...p, [k]: v }));

  async function save() {
    setBusy(true); setErr(null);
    const res = await fetch(`/api/admin/studio/assets/${asset.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: d.title, asset_type: d.asset_type, description: d.description, audience: d.audience,
        competency_id: d.competency_id, phase: d.phase, domain: d.domain,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean), status: d.status,
      }),
    });
    const r = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(r.error ?? "Failed."); return; }
    onSaved();
  }

  async function purge() {
    if (!window.confirm("Delete the catalogue entry AND the underlying file from storage? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/studio/assets/${asset.id}?purge=1`, { method: "DELETE" });
    if (res.ok) onDeleted(); else { const r = await res.json().catch(() => ({})); setErr(r.error ?? "Failed."); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4" onClick={onClose}>
      <div className="my-8 w-full max-w-lg rounded-lg bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-1 text-lg font-semibold text-midnight-navy">Edit asset</h3>
        <p className="mb-3 break-all text-xs text-charcoal/40">{asset.file_name}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-charcoal">Title<input disabled={!canWrite} value={d.title ?? ""} onChange={(e) => set("title", e.target.value)} className={`${INP} mt-1 w-full`} /></label>
          <label className="block text-sm font-medium text-charcoal">Type
            <select disabled={!canWrite} value={d.asset_type ?? ""} onChange={(e) => set("asset_type", e.target.value)} className={`${INP} mt-1 w-full`}>{ASSET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select>
          </label>
          <label className="block text-sm font-medium text-charcoal">Audience
            <select disabled={!canWrite} value={d.audience ?? ""} onChange={(e) => set("audience", e.target.value)} className={`${INP} mt-1 w-full`}><option value=""></option>{AUDIENCES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}</select>
          </label>
          <label className="block text-sm font-medium text-charcoal">Status
            <select disabled={!canWrite} value={d.status} onChange={(e) => set("status", e.target.value as StudioStatus)} className={`${INP} mt-1 w-full`}>{(Object.keys(STATUS_LABELS) as StudioStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}</select>
          </label>
          <label className="block text-sm font-medium text-charcoal">Domain
            <select disabled={!canWrite} value={d.domain ?? ""} onChange={(e) => set("domain", e.target.value)} className={`${INP} mt-1 w-full`}><option value=""></option>{DOMAIN_SLUGS.map((x) => <option key={x} value={x}>{domainLabel(x)}</option>)}</select>
          </label>
          <label className="block text-sm font-medium text-charcoal">Phase
            <select disabled={!canWrite} value={d.phase ?? ""} onChange={(e) => set("phase", e.target.value)} className={`${INP} mt-1 w-full`}><option value=""></option>{PHASE_SLUGS.map((x) => <option key={x} value={x}>{domainLabel(x)}</option>)}</select>
          </label>
        </div>
        <label className="mt-3 block text-sm font-medium text-charcoal">Competency ID<input disabled={!canWrite} value={d.competency_id ?? ""} onChange={(e) => set("competency_id", e.target.value)} className={`${INP} mt-1 w-full`} /></label>
        <label className="mt-3 block text-sm font-medium text-charcoal">Tags <span className="font-normal text-charcoal/50">(comma-separated)</span><input disabled={!canWrite} value={tags} onChange={(e) => setTags(e.target.value)} className={`${INP} mt-1 w-full`} /></label>
        <label className="mt-3 block text-sm font-medium text-charcoal">Description<textarea disabled={!canWrite} value={d.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={2} className={`${INP} mt-1 w-full`} /></label>
        {err && <p className="mt-2 text-sm text-coral-rose">{err}</p>}
        <div className="mt-4 flex items-center justify-between">
          {isOwner ? <button onClick={purge} className="text-xs font-medium text-coral-rose hover:underline">Delete file + entry</button> : <span />}
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-md border border-light-gray px-3 py-1.5 text-sm">Close</button>
            {canWrite && <button onClick={save} disabled={busy} className="rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
