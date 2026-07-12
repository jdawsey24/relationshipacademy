"use client";

import { useCallback, useEffect, useState } from "react";
import StudioTabs from "@/components/admin/StudioTabs";
import AssessmentNav from "@/components/admin/AssessmentNav";
import StudioStatusBadge from "@/components/admin/StudioStatusBadge";
import AiGenerateModal from "@/components/admin/AiGenerateModal";
import { useCanWrite } from "@/components/admin/RoleContext";
import { DOMAIN_SLUGS, PHASE_SLUGS, domainLabel, type AssessmentItem } from "@/lib/studioAssessment";
import { STATUS_LABELS, type StudioStatus } from "@/lib/studio";

const ITEM_TYPES = ["Behavioral", "Reverse-Scored"];
const STATUSES = Object.keys(STATUS_LABELS) as StudioStatus[];
const INP = "rounded-md border border-light-gray px-2 py-1.5 text-sm";

export default function ItemBankPage() {
  const canWrite = useCanWrite();
  const [items, setItems] = useState<AssessmentItem[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [filters, setFilters] = useState({ domain: "", phase: "", item_type: "", reverse_scored: "", status: "", competency_id: "", search: "" });
  const [comps, setComps] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<AssessmentItem | null>(null);
  const [showGen, setShowGen] = useState(false);

  const load = useCallback(() => {
    const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    for (const [k, v] of Object.entries(filters)) if (v) qs.set(k, v);
    fetch(`/api/admin/studio/assessment/items?${qs}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setItems(d.rows); setTotal(d.total); setSelected(new Set()); })
      .catch(() => setError(true));
  }, [page, filters]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetch("/api/admin/studio/assessment/items/meta").then((r) => r.json()).then((d) => setComps(d.competencies ?? [])).catch(() => {}); }, []);

  function setFilter(k: string, v: string) { setPage(1); setFilters((f) => ({ ...f, [k]: v })); }
  function toggle(id: string) { setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

  async function bulkStatus(status: string) {
    if (selected.size === 0) return;
    const res = await fetch("/api/admin/studio/assessment/items/bulk", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selected], status }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    setMsg(`Updated ${d.count} item(s) → ${status.replace("_", " ")}.`); load();
  }

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Content &amp; Assessment Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">The candidate item bank. Draft, review, and approve items — approving is owner-only.</p>
      <StudioTabs />
      <AssessmentNav />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select value={filters.domain} onChange={(e) => setFilter("domain", e.target.value)} className={INP}>
          <option value="">All domains</option>
          {DOMAIN_SLUGS.map((d) => <option key={d} value={d}>{domainLabel(d)}</option>)}
        </select>
        <select value={filters.phase} onChange={(e) => setFilter("phase", e.target.value)} className={INP}>
          <option value="">All phases</option>
          {PHASE_SLUGS.map((p) => <option key={p} value={p}>{domainLabel(p)}</option>)}
        </select>
        <select value={filters.competency_id} onChange={(e) => setFilter("competency_id", e.target.value)} className={INP}>
          <option value="">All competencies</option>
          {comps.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.name}</option>)}
        </select>
        <select value={filters.item_type} onChange={(e) => setFilter("item_type", e.target.value)} className={INP}>
          <option value="">All types</option>
          {ITEM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filters.reverse_scored} onChange={(e) => setFilter("reverse_scored", e.target.value)} className={INP}>
          <option value="">Any scoring</option>
          <option value="false">Forward</option>
          <option value="true">Reverse</option>
        </select>
        <select value={filters.status} onChange={(e) => setFilter("status", e.target.value)} className={INP}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <input value={filters.search} onChange={(e) => setFilter("search", e.target.value)} placeholder="Search item text…" className={`${INP} min-w-[180px] flex-1`} />
        {canWrite && <button onClick={() => setShowGen(true)} className="rounded-md border border-dusty-plum px-3 py-1.5 text-sm font-medium text-dusty-plum hover:bg-dusty-plum/5">Generate items with AI</button>}
      </div>

      {msg && <div className="mb-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}
      {canWrite && selected.size > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-md bg-light-gray px-3 py-2 text-sm">
          <span>{selected.size} selected</span>
          <span className="text-charcoal/50">Set status:</span>
          {STATUSES.map((s) => <button key={s} onClick={() => bulkStatus(s)} className="rounded border border-midnight-navy px-2 py-0.5 text-xs text-midnight-navy hover:bg-white">{STATUS_LABELS[s]}</button>)}
        </div>
      )}

      {error && <p className="text-sm text-coral-rose">Failed to load. Run migration 0018 + the importer.</p>}
      {!error && !items && <p className="text-sm text-charcoal/60">Loading…</p>}
      {items && (
        <>
          <div className="mb-2 text-xs text-charcoal/50">{total.toLocaleString()} items</div>
          <div className="overflow-x-auto rounded-md border border-light-gray">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                  {canWrite && <th className="px-2 py-2"></th>}
                  <th className="px-3 py-2 font-semibold">Item</th>
                  <th className="px-3 py-2 font-semibold">Competency</th>
                  <th className="px-3 py-2 font-semibold">Domain / Phase</th>
                  <th className="px-3 py-2 font-semibold">Rev</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={it.item_id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                    {canWrite && <td className="px-2 py-2 align-top"><input type="checkbox" checked={selected.has(it.item_id)} onChange={() => toggle(it.item_id)} /></td>}
                    <td className="px-3 py-2">
                      <button onClick={() => setEditing(it)} className="text-left font-medium text-midnight-navy hover:underline">{it.item_text}</button>
                      <span className="block text-[11px] text-charcoal/40">{it.item_id}{it.provenance === "ai_generated" && <span className="ml-1 rounded bg-dusty-plum/15 px-1 py-0.5 font-semibold uppercase text-dusty-plum">AI</span>}</span>
                    </td>
                    <td className="px-3 py-2 text-charcoal/70">{it.competency ?? "—"}<span className="block text-[11px] text-charcoal/40">{it.competency_id}</span></td>
                    <td className="px-3 py-2 text-charcoal/60 whitespace-nowrap">{domainLabel(it.domain ?? "")}<span className="block text-[11px] text-charcoal/40">{domainLabel(it.phase ?? "")}</span></td>
                    <td className="px-3 py-2">{it.reverse_scored ? "↺" : ""}</td>
                    <td className="px-3 py-2"><StudioStatusBadge status={it.status} /></td>
                  </tr>
                ))}
                {items.length === 0 && <tr><td colSpan={6} className="px-3 py-6 text-center text-charcoal/50">No items match.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center gap-3 text-sm">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-md border border-light-gray px-3 py-1 disabled:opacity-40">Prev</button>
            <span className="text-charcoal/60">Page {page} of {pages}</span>
            <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="rounded-md border border-light-gray px-3 py-1 disabled:opacity-40">Next</button>
          </div>
        </>
      )}

      {editing && <ItemEditor item={editing} canWrite={canWrite} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
      {showGen && (
        <AiGenerateModal
          title="Generate assessment items"
          subtitle="Claude drafts candidate questions grounded in the competency's behavioral indicators and item-writing considerations."
          competencies={comps}
          showCount
          onClose={() => setShowGen(false)}
          onGenerate={async (competency_id, count, instructions) => {
            const res = await fetch("/api/admin/studio/assessment/items/generate", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ competency_id, count, instructions }),
            });
            const d = await res.json().catch(() => ({}));
            if (!res.ok) return d.error ?? "Failed.";
            setShowGen(false);
            setMsg(`Generated ${d.count} draft item(s) — review and approve them below.`);
            setFilter("competency_id", competency_id);
            return null;
          }}
        />
      )}
    </div>
  );
}

function ItemEditor({ item, canWrite, onClose, onSaved }: { item: AssessmentItem; canWrite: boolean; onClose: () => void; onSaved: () => void }) {
  const [d, setD] = useState<AssessmentItem>(item);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const set = (k: keyof AssessmentItem, v: unknown) => setD((p) => ({ ...p, [k]: v }));

  async function save() {
    setBusy(true); setErr(null);
    const res = await fetch(`/api/admin/studio/assessment/items/${item.item_id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        item_text: d.item_text, consumer_item_text: d.consumer_item_text, professional_item_text: d.professional_item_text,
        competency_id: d.competency_id, domain: d.domain, phase: d.phase, item_type: d.item_type,
        response_model: d.response_model, reverse_scored: d.reverse_scored, evidence_strength: d.evidence_strength,
        reading_level: d.reading_level, scoring_direction: d.scoring_direction, audience: d.audience, status: d.status,
      }),
    });
    const r = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(r.error ?? "Failed."); return; }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4" onClick={onClose}>
      <div className="my-8 w-full max-w-2xl rounded-lg bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-lg font-semibold text-midnight-navy">{item.item_id}</h3>
          <StudioStatusBadge status={d.status} />
        </div>
        <label className="block text-sm font-medium text-charcoal">Item text<textarea disabled={!canWrite} value={d.item_text ?? ""} onChange={(e) => set("item_text", e.target.value)} rows={2} className={`${INP} mt-1 w-full`} /></label>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-charcoal">Consumer text<textarea disabled={!canWrite} value={d.consumer_item_text ?? ""} onChange={(e) => set("consumer_item_text", e.target.value)} rows={2} className={`${INP} mt-1 w-full`} /></label>
          <label className="block text-sm font-medium text-charcoal">Professional text<textarea disabled={!canWrite} value={d.professional_item_text ?? ""} onChange={(e) => set("professional_item_text", e.target.value)} rows={2} className={`${INP} mt-1 w-full`} /></label>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="block text-sm font-medium text-charcoal">Competency ID<input disabled={!canWrite} value={d.competency_id ?? ""} onChange={(e) => set("competency_id", e.target.value)} className={`${INP} mt-1 w-full`} /></label>
          <label className="block text-sm font-medium text-charcoal">Domain<select disabled={!canWrite} value={d.domain ?? ""} onChange={(e) => set("domain", e.target.value)} className={`${INP} mt-1 w-full`}><option value=""></option>{DOMAIN_SLUGS.map((x) => <option key={x} value={x}>{domainLabel(x)}</option>)}</select></label>
          <label className="block text-sm font-medium text-charcoal">Phase<select disabled={!canWrite} value={d.phase ?? ""} onChange={(e) => set("phase", e.target.value)} className={`${INP} mt-1 w-full`}><option value=""></option>{PHASE_SLUGS.map((x) => <option key={x} value={x}>{domainLabel(x)}</option>)}</select></label>
          <label className="block text-sm font-medium text-charcoal">Item type<input disabled={!canWrite} value={d.item_type ?? ""} onChange={(e) => set("item_type", e.target.value)} className={`${INP} mt-1 w-full`} /></label>
          <label className="block text-sm font-medium text-charcoal">Response model<input disabled={!canWrite} value={d.response_model ?? ""} onChange={(e) => set("response_model", e.target.value)} className={`${INP} mt-1 w-full`} /></label>
          <label className="flex items-center gap-2 pt-6 text-sm font-medium text-charcoal"><input type="checkbox" disabled={!canWrite} checked={!!d.reverse_scored} onChange={(e) => set("reverse_scored", e.target.checked)} /> Reverse scored</label>
        </div>
        <label className="mt-3 block text-sm font-medium text-charcoal">Status
          <select disabled={!canWrite} value={d.status} onChange={(e) => set("status", e.target.value as StudioStatus)} className={`${INP} mt-1 w-full`}>
            {(Object.keys(STATUS_LABELS) as StudioStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </label>
        {err && <p className="mt-2 text-sm text-coral-rose">{err}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-light-gray px-3 py-1.5 text-sm">Close</button>
          {canWrite && <button onClick={save} disabled={busy} className="rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>}
        </div>
      </div>
    </div>
  );
}
