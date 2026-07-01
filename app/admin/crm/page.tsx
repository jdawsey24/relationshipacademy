"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type TabKind = "assessment" | "site";
interface Tab {
  key: string;
  label: string;
  kind: TabKind;
  source?: string;
  inquiryFilter?: string;
}

const TABS: Tab[] = [
  { key: "assessment", label: "Assessment Leads", kind: "assessment" },
  { key: "speaking", label: "Speaking", kind: "site", source: "speaking_inquiry" },
  { key: "professional", label: "Professional Interest", kind: "site", source: "professional_interest" },
  { key: "media", label: "Media Requests", kind: "site", source: "contact_form", inquiryFilter: "Media Request" },
  { key: "contact", label: "Contact Forms", kind: "site", source: "contact_form" },
  { key: "newsletter", label: "Newsletter", kind: "site", source: "newsletter" },
];

const STATUSES = ["new", "contacted", "converted", "archived"];

interface SiteLead {
  id: string; name: string; email: string; organization: string | null;
  inquiry_type: string | null; message: string | null; status: string | null;
  notes: string | null; created_at: string | null;
}
interface AssessmentLead {
  session_id: string; name: string; email: string; structural_phase: string;
  alignment_status: string; expiration_risk: string; completed_at: string | null;
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function csvEscape(v: string) { return `"${(v ?? "").replace(/"/g, '""')}"`; }
function download(name: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export default function CrmPage() {
  const [active, setActive] = useState<Tab>(TABS[0]);
  const [assessment, setAssessment] = useState<AssessmentLead[] | null>(null);
  const [siteLeads, setSiteLeads] = useState<SiteLead[] | null>(null);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback((tab: Tab) => {
    setError(false);
    if (tab.kind === "assessment") {
      setAssessment(null);
      fetch("/api/admin/leads").then((r) => { if (!r.ok) throw new Error(); return r.json(); })
        .then((d) => setAssessment(d.rows)).catch(() => setError(true));
    } else {
      setSiteLeads(null);
      fetch(`/api/admin/site-leads?source=${tab.source}`).then((r) => { if (!r.ok) throw new Error(); return r.json(); })
        .then((d) => setSiteLeads(d.rows)).catch(() => setError(true));
    }
  }, []);

  useEffect(() => { load(active); setSearch(""); setStatusFilter(""); }, [active, load]);

  async function updateLead(id: string, patch: { status?: string; notes?: string }) {
    setSiteLeads((prev) => prev && prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
    await fetch("/api/admin/site-leads", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
  }

  const siteFiltered = useMemo(() => {
    let rows = siteLeads ?? [];
    if (active.inquiryFilter) rows = rows.filter((r) => r.inquiry_type === active.inquiryFilter);
    const q = search.trim().toLowerCase();
    if (q) rows = rows.filter((r) => (r.name ?? "").toLowerCase().includes(q) || (r.email ?? "").toLowerCase().includes(q));
    if (statusFilter) rows = rows.filter((r) => (r.status ?? "new") === statusFilter);
    return rows;
  }, [siteLeads, active, search, statusFilter]);

  const assessmentFiltered = useMemo(() => {
    let rows = assessment ?? [];
    const q = search.trim().toLowerCase();
    if (q) rows = rows.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
    return rows;
  }, [assessment, search]);

  function exportCsv() {
    if (active.kind === "assessment") {
      const header = ["Name", "Email", "Phase", "Alignment", "Risk", "Completed"].map(csvEscape).join(",");
      const lines = assessmentFiltered.map((r) => [r.name, r.email, r.structural_phase, r.alignment_status, r.expiration_risk, fmt(r.completed_at)].map((v) => csvEscape(String(v))).join(","));
      download(`rlc-${active.key}-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...lines].join("\n"));
    } else {
      const header = ["Name", "Email", "Organization", "Inquiry Type", "Status", "Notes", "Date"].map(csvEscape).join(",");
      const lines = siteFiltered.map((r) => [r.name, r.email, r.organization ?? "", r.inquiry_type ?? "", r.status ?? "new", r.notes ?? "", fmt(r.created_at)].map((v) => csvEscape(String(v))).join(","));
      download(`rlc-${active.key}-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...lines].join("\n"));
    }
  }

  const count = active.kind === "assessment" ? assessmentFiltered.length : siteFiltered.length;
  const loading = active.kind === "assessment" ? assessment === null : siteLeads === null;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-midnight-navy">CRM</h1>
        <button type="button" onClick={exportCsv} disabled={loading || count === 0}
          className="rounded-md bg-midnight-navy px-4 py-2 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-40">
          Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-1 border-b border-light-gray">
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setActive(t)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm ${active.key === t.key ? "border-midnight-navy font-semibold text-midnight-navy" : "border-transparent text-charcoal/60 hover:text-charcoal"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-3">
        <input type="text" placeholder="Search name or email…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="h-10 min-w-[200px] flex-1 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy" />
        {active.kind === "site" && (
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-light-gray px-3 text-sm outline-none focus:border-midnight-navy">
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>

      {error && <p className="text-sm text-coral-rose">Failed to load. Please refresh.</p>}
      {!error && loading && <p className="text-sm text-charcoal/60">Loading…</p>}

      {/* Assessment leads (read-only + detail link) */}
      {!error && !loading && active.kind === "assessment" && (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
              <th className="px-3 py-2 font-semibold">Name</th><th className="px-3 py-2 font-semibold">Email</th>
              <th className="px-3 py-2 font-semibold">Phase</th><th className="px-3 py-2 font-semibold">Alignment</th>
              <th className="px-3 py-2 font-semibold">Risk</th><th className="px-3 py-2 font-semibold">Completed</th>
              <th className="px-3 py-2 font-semibold">Actions</th>
            </tr></thead>
            <tbody>
              {assessmentFiltered.map((r, i) => (
                <tr key={r.session_id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2">{r.name || "—"}</td><td className="px-3 py-2">{r.email || "—"}</td>
                  <td className="px-3 py-2">{r.structural_phase}</td><td className="px-3 py-2">{r.alignment_status}</td>
                  <td className="px-3 py-2">{r.expiration_risk}</td><td className="px-3 py-2 whitespace-nowrap">{fmt(r.completed_at)}</td>
                  <td className="px-3 py-2"><Link href={`/admin/leads/${r.session_id}`} className="font-medium text-midnight-navy hover:underline">View</Link></td>
                </tr>
              ))}
              {assessmentFiltered.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-charcoal/60">No leads.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* Site leads (status + notes editable) */}
      {!error && !loading && active.kind === "site" && (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
              <th className="px-3 py-2 font-semibold">Name</th><th className="px-3 py-2 font-semibold">Email</th>
              <th className="px-3 py-2 font-semibold">Org</th>
              {!active.inquiryFilter && active.source === "contact_form" && <th className="px-3 py-2 font-semibold">Type</th>}
              <th className="px-3 py-2 font-semibold">Date</th><th className="px-3 py-2 font-semibold">Status</th>
              <th className="px-3 py-2 font-semibold">Notes</th>
            </tr></thead>
            <tbody>
              {siteFiltered.map((r, i) => (
                <tr key={r.id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2">{r.name || "—"}</td>
                  <td className="px-3 py-2">{r.email || "—"}</td>
                  <td className="px-3 py-2">{r.organization || "—"}</td>
                  {!active.inquiryFilter && active.source === "contact_form" && <td className="px-3 py-2">{r.inquiry_type || "—"}</td>}
                  <td className="px-3 py-2 whitespace-nowrap">{fmt(r.created_at)}</td>
                  <td className="px-3 py-2">
                    <select value={r.status ?? "new"} onChange={(e) => updateLead(r.id, { status: e.target.value })}
                      className="rounded border border-light-gray px-2 py-1 text-xs outline-none focus:border-midnight-navy">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input type="text" defaultValue={r.notes ?? ""} placeholder="Add note…"
                      onBlur={(e) => { if (e.target.value !== (r.notes ?? "")) updateLead(r.id, { notes: e.target.value }); }}
                      className="w-40 rounded border border-light-gray px-2 py-1 text-xs outline-none focus:border-midnight-navy" />
                  </td>
                </tr>
              ))}
              {siteFiltered.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-charcoal/60">No leads.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-sm text-charcoal/60">{count} record{count === 1 ? "" : "s"}</p>
    </div>
  );
}
