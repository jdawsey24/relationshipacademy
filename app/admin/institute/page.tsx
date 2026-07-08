"use client";

import { useEffect, useMemo, useState } from "react";
import ContentEditor from "@/components/admin/ContentEditor";
import { useCanWrite } from "@/components/admin/RoleContext";
import {
  INSTITUTE_SECTIONS,
  INSTITUTE_LANDING_FIELDS,
  OFFERING_STATUSES,
  sectionCopyFields,
  type InstituteOffering,
  type InstituteSectionKey,
} from "@/lib/institute";

interface Row extends InstituteOffering {
  id: string;
}
type Tab = "landing" | InstituteSectionKey;

export default function AdminInstitute() {
  const canWrite = useCanWrite();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("landing");
  const [draft, setDraft] = useState({ title: "", description: "" });
  const [msg, setMsg] = useState<string | null>(null);

  const section = tab === "landing" ? null : tab;

  async function load() {
    const res = await fetch("/api/admin/institute/offerings").then((r) => r.json()).catch(() => null);
    setRows(res?.rows ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  const visible = useMemo(() => (section ? rows.filter((r) => r.section === section) : []), [rows, section]);
  const sectionFields = useMemo(() => (section ? sectionCopyFields(section) : []), [section]);

  function patchLocal(id: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function add() {
    if (!section || !draft.title.trim()) return;
    const res = await fetch("/api/admin/institute/offerings", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, title: draft.title, description: draft.description, status: "in_development", sort_order: visible.length * 10 }),
    });
    if (res.ok) { setDraft({ title: "", description: "" }); load(); }
  }

  async function save(r: Row) {
    setMsg(null);
    const res = await fetch(`/api/admin/institute/offerings/${r.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: r.title, description: r.description, status: r.status,
        cta_label: r.cta_label ?? "", cta_url: r.cta_url ?? "", sort_order: r.sort_order ?? 0,
      }),
    });
    setMsg(res.ok ? "Saved." : "Save failed.");
  }

  async function remove(id: string) {
    if (!confirm("Delete this offering?")) return;
    const res = await fetch(`/api/admin/institute/offerings/${id}`, { method: "DELETE" });
    if (res.ok) setRows((rs) => rs.filter((r) => r.id !== id));
  }

  const inp = "w-full rounded-md border border-light-gray px-3 py-2 text-sm outline-none focus:border-midnight-navy disabled:bg-light-gray/30";

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Professional Institute</h1>
      <p className="mb-6 text-sm text-charcoal/60">
        Edit the landing hero, each section&apos;s copy, and the offerings shown on each section page. Copy edits use Save draft / Publish; offerings save immediately.
      </p>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-1 border-b border-light-gray">
        <button type="button" onClick={() => setTab("landing")}
          className={`-mb-px border-b-2 px-4 py-2 text-sm ${tab === "landing" ? "border-midnight-navy font-semibold text-midnight-navy" : "border-transparent text-charcoal/60 hover:text-charcoal"}`}>
          Landing
        </button>
        {INSTITUTE_SECTIONS.map((s) => (
          <button key={s.key} type="button" onClick={() => setTab(s.key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm ${tab === s.key ? "border-midnight-navy font-semibold text-midnight-navy" : "border-transparent text-charcoal/60 hover:text-charcoal"}`}>
            {s.label}
          </button>
        ))}
      </div>

      {tab === "landing" ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-midnight-navy">Landing hero</h2>
          <ContentEditor key="institute-landing" fields={INSTITUTE_LANDING_FIELDS} />
        </section>
      ) : (
        <div className="space-y-10">
          {/* Section copy */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-midnight-navy">Section copy</h2>
            <ContentEditor key={`institute-${section}`} fields={sectionFields} />
          </section>

          {/* Offerings */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-midnight-navy">Offerings</h2>
            {canWrite && (
              <div className="mb-6 rounded-lg border border-light-gray p-4">
                <p className="mb-2 text-sm font-medium text-charcoal">Add offering</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder="Title" className={inp} />
                  <input value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} placeholder="Short description" className={inp} />
                  <button type="button" onClick={add} disabled={!draft.title.trim()} className="shrink-0 rounded-md bg-midnight-navy px-4 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50">Add</button>
                </div>
              </div>
            )}

            {loading ? (
              <p className="text-sm text-charcoal/60">Loading…</p>
            ) : visible.length === 0 ? (
              <p className="text-sm text-charcoal/60">No offerings for this section yet — the site is showing built-in defaults. Add one above to override them.</p>
            ) : (
              <div className="space-y-4">
                {visible.map((r) => (
                  <div key={r.id} className="rounded-lg border border-light-gray p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="text-sm font-medium text-charcoal">Title
                        <input value={r.title} onChange={(e) => patchLocal(r.id, { title: e.target.value })} disabled={!canWrite} className={`mt-1 ${inp}`} />
                      </label>
                      <label className="text-sm font-medium text-charcoal">Status
                        <select value={r.status} onChange={(e) => patchLocal(r.id, { status: e.target.value as Row["status"] })} disabled={!canWrite} className={`mt-1 ${inp}`}>
                          {OFFERING_STATUSES.map((s) => <option key={s} value={s}>{s === "draft" ? "Draft (hidden)" : s === "available" ? "Available" : "In development"}</option>)}
                        </select>
                      </label>
                      <label className="text-sm font-medium text-charcoal sm:col-span-2">Description
                        <textarea rows={2} value={r.description ?? ""} onChange={(e) => patchLocal(r.id, { description: e.target.value })} disabled={!canWrite} className={`mt-1 ${inp}`} />
                      </label>
                      <label className="text-sm font-medium text-charcoal">CTA label (optional)
                        <input value={r.cta_label ?? ""} onChange={(e) => patchLocal(r.id, { cta_label: e.target.value })} disabled={!canWrite} className={`mt-1 ${inp}`} placeholder="Register" />
                      </label>
                      <label className="text-sm font-medium text-charcoal">CTA URL (optional)
                        <input value={r.cta_url ?? ""} onChange={(e) => patchLocal(r.id, { cta_url: e.target.value })} disabled={!canWrite} className={`mt-1 ${inp}`} placeholder="https://…" />
                      </label>
                      <label className="text-sm font-medium text-charcoal">Sort order
                        <input type="number" value={r.sort_order ?? 0} onChange={(e) => patchLocal(r.id, { sort_order: Number(e.target.value) })} disabled={!canWrite} className={`mt-1 w-28 ${inp}`} />
                      </label>
                    </div>
                    {canWrite && (
                      <div className="mt-3 flex items-center gap-3">
                        <button type="button" onClick={() => save(r)} className="rounded-md bg-midnight-navy px-4 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90">Save</button>
                        <button type="button" onClick={() => remove(r.id)} className="ml-auto text-sm text-coral-rose hover:underline">Delete</button>
                      </div>
                    )}
                  </div>
                ))}
                {msg && <p className="text-sm text-charcoal/60">{msg}</p>}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
