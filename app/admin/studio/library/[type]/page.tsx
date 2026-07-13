"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudioNav from "@/components/admin/StudioNav";
import LibraryNav from "@/components/admin/LibraryNav";
import StudioStatusBadge from "@/components/admin/StudioStatusBadge";
import GenericRowEditor from "@/components/admin/GenericRowEditor";
import AiGenerateModal from "@/components/admin/AiGenerateModal";
import { useAdminRole, useCanWrite } from "@/components/admin/RoleContext";
import { LEARNING_TABLES, isLibraryType } from "@/lib/studioLibrary";
import { DOMAIN_SLUGS, PHASE_SLUGS, domainLabel } from "@/lib/studioAssessment";
import { STATUS_LABELS, type StudioStatus } from "@/lib/studio";

type Row = Record<string, unknown>;
const STATUSES = Object.keys(STATUS_LABELS) as StudioStatus[];
const INP = "rounded-md border border-light-gray px-2 py-1.5 text-sm";

export default function LibraryTypePage() {
  const params = useParams<{ type: string }>();
  const type = params.type;
  const role = useAdminRole();
  const canWrite = useCanWrite();
  const isOwner = role === "owner";

  const valid = isLibraryType(type);
  const cfg = valid ? LEARNING_TABLES[type] : null;

  const [rows, setRows] = useState<Row[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [filters, setFilters] = useState({ competency_id: "", domain: "", phase: "", status: "", search: "" });
  const [comps, setComps] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Row | null>(null);
  const [showGen, setShowGen] = useState(false);

  const load = useCallback(() => {
    if (!valid) return;
    const qs = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    for (const [k, v] of Object.entries(filters)) if (v) qs.set(k, v);
    fetch(`/api/admin/studio/library/${type}?${qs}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setRows(d.rows); setTotal(d.total); setSelected(new Set()); })
      .catch(() => setError(true));
  }, [type, valid, page, filters]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetch("/api/admin/studio/assessment/items/meta").then((r) => r.json()).then((d) => setComps(d.competencies ?? [])).catch(() => {}); }, []);

  // Reset paging/filters when switching type.
  useEffect(() => { setPage(1); setFilters({ competency_id: "", domain: "", phase: "", status: "", search: "" }); }, [type]);

  if (!valid || !cfg) {
    return <div><StudioNav /><LibraryNav /><p className="text-sm text-coral-rose">Unknown library type.</p></div>;
  }

  function setFilter(k: string, v: string) { setPage(1); setFilters((f) => ({ ...f, [k]: v })); }
  function toggle(id: string) { setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

  async function bulkStatus(status: string) {
    if (selected.size === 0) return;
    const res = await fetch(`/api/admin/studio/library/${type}/bulk`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: [...selected], status }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    setMsg(`Updated ${d.count} → ${status.replace("_", " ")}.`); load();
  }

  async function del(id: string) {
    if (!window.confirm("Delete this record?")) return;
    const res = await fetch(`/api/admin/studio/library/${type}/${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) { setMsg("Deleted."); load(); } else { const d = await res.json().catch(() => ({})); setMsg(d.error ?? "Failed."); }
  }

  const pages = Math.max(1, Math.ceil(total / pageSize));
  const c = cfg; // narrowed

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Content &amp; Assessment Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">{c.label}. Draft, review, and approve — approving/publishing is owner-only.</p>
      <StudioNav />
      <LibraryNav />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        {c.competencyCol && (
          <select value={filters.competency_id} onChange={(e) => setFilter("competency_id", e.target.value)} className={INP}>
            <option value="">All competencies</option>
            {comps.map((x) => <option key={x.id} value={x.id}>{x.id} · {x.name}</option>)}
          </select>
        )}
        {c.hasDomain && (
          <select value={filters.domain} onChange={(e) => setFilter("domain", e.target.value)} className={INP}>
            <option value="">All domains</option>
            {DOMAIN_SLUGS.map((d) => <option key={d} value={d}>{domainLabel(d)}</option>)}
          </select>
        )}
        {c.hasPhase && (
          <select value={filters.phase} onChange={(e) => setFilter("phase", e.target.value)} className={INP}>
            <option value="">All phases</option>
            {PHASE_SLUGS.map((p) => <option key={p} value={p}>{domainLabel(p)}</option>)}
          </select>
        )}
        <select value={filters.status} onChange={(e) => setFilter("status", e.target.value)} className={INP}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <input value={filters.search} onChange={(e) => setFilter("search", e.target.value)} placeholder="Search…" className={`${INP} min-w-[160px] flex-1`} />
        {canWrite && c.generatable && <button onClick={() => setShowGen(true)} className="rounded-md border border-dusty-plum px-3 py-1.5 text-sm font-medium text-dusty-plum hover:bg-dusty-plum/5">Generate with AI</button>}
      </div>

      {msg && <div className="mb-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}
      {canWrite && selected.size > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md bg-light-gray px-3 py-2 text-sm">
          <span>{selected.size} selected · set status:</span>
          {STATUSES.map((s) => <button key={s} onClick={() => bulkStatus(s)} className="rounded border border-midnight-navy px-2 py-0.5 text-xs text-midnight-navy hover:bg-white">{STATUS_LABELS[s]}</button>)}
        </div>
      )}

      {error && <p className="text-sm text-coral-rose">Failed to load. Run migration 0019 + the importer.</p>}
      {!error && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows && (
        <>
          <div className="mb-2 text-xs text-charcoal/50">{total.toLocaleString()} records</div>
          <div className="overflow-x-auto rounded-md border border-light-gray">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                  {canWrite && <th className="px-2 py-2"></th>}
                  <th className="px-3 py-2 font-semibold">{c.label.replace(/s$/, "")}</th>
                  {c.competencyCol && <th className="px-3 py-2 font-semibold">Competency</th>}
                  <th className="px-3 py-2 font-semibold">Domain / Phase</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const id = String(r[c.pk]);
                  return (
                    <tr key={id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                      {canWrite && <td className="px-2 py-2 align-top"><input type="checkbox" checked={selected.has(id)} onChange={() => toggle(id)} /></td>}
                      <td className="px-3 py-2">
                        <button onClick={() => setEditing(r)} className="text-left font-medium text-midnight-navy hover:underline">{String(r[c.labelCol] ?? "—")}</button>
                        <span className="block text-[11px] text-charcoal/40">{id}{r.provenance === "ai_generated" && <span className="ml-1 rounded bg-dusty-plum/15 px-1 py-0.5 font-semibold uppercase text-dusty-plum">AI</span>}</span>
                      </td>
                      {c.competencyCol && <td className="px-3 py-2 text-charcoal/60">{String(r[c.competencyCol] ?? "—")}</td>}
                      <td className="px-3 py-2 text-charcoal/60 whitespace-nowrap">{domainLabel(String(r.domain ?? ""))}<span className="block text-[11px] text-charcoal/40">{domainLabel(String(r.phase ?? ""))}</span></td>
                      <td className="px-3 py-2"><StudioStatusBadge status={String(r.status ?? "draft")} /></td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <button onClick={() => setEditing(r)} className="font-medium text-midnight-navy hover:underline">{canWrite ? "Edit" : "View"}</button>
                        {isOwner && <button onClick={() => del(id)} className="ml-3 text-coral-rose hover:underline">Delete</button>}
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && <tr><td colSpan={6} className="px-3 py-6 text-center text-charcoal/50">No records match.</td></tr>}
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

      {editing && <GenericRowEditor apiBase={`/api/admin/studio/library/${type}`} pk={c.pk} row={editing} canWrite={canWrite} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
      {showGen && (
        <AiGenerateModal
          title={`Generate ${c.label.replace(/s$/, "").toLowerCase()} with AI`}
          subtitle={`Claude drafts one ${c.label.replace(/s$/, "").toLowerCase()} grounded in the competency.`}
          competencies={comps}
          onClose={() => setShowGen(false)}
          onGenerate={async (competency_id, _count, instructions) => {
            const res = await fetch(`/api/admin/studio/library/${type}/generate`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ competency_id, instructions }),
            });
            const d = await res.json().catch(() => ({}));
            if (!res.ok) return d.error ?? "Failed.";
            setShowGen(false);
            setMsg("Generated a draft — review and approve it below.");
            setFilter("competency_id", competency_id);
            return null;
          }}
        />
      )}
    </div>
  );
}
