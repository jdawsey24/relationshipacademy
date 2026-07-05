"use client";

import { useEffect, useMemo, useState } from "react";
import { useCanWrite } from "@/components/admin/RoleContext";

export interface CopyRow {
  id: string;
  title: string | null;
  interpretation: string | null;
  recommendation: string | null;
  cta: string | null;
  score_min: number | null;
  score_max: number | null;
  domain_name?: string;
  [key: string]: unknown;
}

interface CopyEditorProps {
  apiPath: string;
  /** field holding the read-only identity label, e.g. "level" or "risk_level" */
  identityField: string;
  identityLabel: string;
  /** group rows by domain_name (result levels only) */
  groupByDomain?: boolean;
}

type Toast = { kind: "success" | "error"; msg: string } | null;

export default function CopyEditor({ apiPath, identityField, identityLabel, groupByDomain }: CopyEditorProps) {
  const [rows, setRows] = useState<CopyRow[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast>(null);
  const canWrite = useCanWrite();

  useEffect(() => {
    fetch(apiPath)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((d) => setRows(d.rows))
      .catch(() => setLoadError(true));
  }, [apiPath]);

  function showToast(t: Toast) {
    setToast(t);
    if (t) setTimeout(() => setToast(null), 3000);
  }

  function edit(id: string, field: keyof CopyRow, value: string | number) {
    setRows((prev) => prev && prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  async function save(row: CopyRow) {
    setSavingId(row.id);
    try {
      const res = await fetch(apiPath, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          title: row.title,
          interpretation: row.interpretation,
          recommendation: row.recommendation,
          cta: row.cta,
          score_min: row.score_min === null ? null : Number(row.score_min),
          score_max: row.score_max === null ? null : Number(row.score_max),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      showToast({ kind: "success", msg: "Saved." });
    } catch {
      showToast({ kind: "error", msg: "Save failed." });
    } finally {
      setSavingId(null);
    }
  }

  const groups = useMemo(() => {
    if (!rows) return [];
    if (!groupByDomain) return [{ name: "", rows }];
    const byGroup = new Map<string, CopyRow[]>();
    for (const r of rows) {
      const g = r.domain_name ?? "Generic";
      byGroup.set(g, [...(byGroup.get(g) ?? []), r]);
    }
    // Generic first, then alphabetical
    return Array.from(byGroup.entries())
      .sort(([a], [b]) => (a === "Generic" ? -1 : b === "Generic" ? 1 : a.localeCompare(b)))
      .map(([name, rows]) => ({ name, rows }));
  }, [rows, groupByDomain]);

  if (loadError) return <p className="text-sm text-coral-rose">Failed to load. Please refresh.</p>;
  if (!rows) return <p className="text-sm text-charcoal/60">Loading…</p>;

  return (
    <div className="relative">
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 rounded-md px-4 py-2 text-sm text-white shadow-lg ${
            toast.kind === "success" ? "bg-sage-green" : "bg-coral-rose"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.name || "all"}>
            {group.name && (
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-charcoal/70">
                {group.name}
              </h2>
            )}
            <div className="space-y-4">
              {group.rows.map((row) => (
                <div key={row.id} className="rounded-md border border-light-gray p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                    <span>
                      <span className="text-xs uppercase text-charcoal/50">{identityLabel}: </span>
                      <span className="font-semibold text-midnight-navy">{String(row[identityField] ?? "—")}</span>
                    </span>
                    {groupByDomain && (
                      <span>
                        <span className="text-xs uppercase text-charcoal/50">Domain: </span>
                        <span>{row.domain_name}</span>
                      </span>
                    )}
                  </div>

                  <div className="grid gap-3">
                    <Field label="Title">
                      <input
                        type="text"
                        value={row.title ?? ""}
                        onChange={(e) => edit(row.id, "title", e.target.value)}
                        className="admin-input"
                      />
                    </Field>
                    <Field label="Interpretation">
                      <textarea
                        rows={2}
                        value={row.interpretation ?? ""}
                        onChange={(e) => edit(row.id, "interpretation", e.target.value)}
                        className="admin-input"
                      />
                    </Field>
                    <Field label="Recommendation">
                      <textarea
                        rows={2}
                        value={row.recommendation ?? ""}
                        onChange={(e) => edit(row.id, "recommendation", e.target.value)}
                        className="admin-input"
                      />
                    </Field>
                    <Field label="CTA">
                      <input
                        type="text"
                        value={row.cta ?? ""}
                        onChange={(e) => edit(row.id, "cta", e.target.value)}
                        className="admin-input"
                      />
                    </Field>
                    <div className="flex gap-3">
                      <Field label="Score min">
                        <input
                          type="number"
                          step="0.01"
                          value={row.score_min ?? ""}
                          onChange={(e) => edit(row.id, "score_min", e.target.value === "" ? "" : Number(e.target.value))}
                          className="admin-input"
                        />
                      </Field>
                      <Field label="Score max">
                        <input
                          type="number"
                          step="0.01"
                          value={row.score_max ?? ""}
                          onChange={(e) => edit(row.id, "score_max", e.target.value === "" ? "" : Number(e.target.value))}
                          className="admin-input"
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => save(row)}
                      disabled={savingId === row.id || !canWrite}
                      title={!canWrite ? "Read-only access" : undefined}
                      className="rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50"
                    >
                      {savingId === row.id ? "Saving…" : "Save"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block flex-1">
      <span className="mb-1 block text-xs uppercase text-charcoal/50">{label}</span>
      {children}
    </label>
  );
}
