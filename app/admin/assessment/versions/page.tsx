"use client";

import { useEffect, useState } from "react";
import AssessmentTabs from "@/components/admin/AssessmentTabs";

interface Version {
  id: string;
  version_label: string | null;
  description: string | null;
  active_from: string | null;
  active_to: string | null;
}

function fmt(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function VersionsPage() {
  const [rows, setRows] = useState<Version[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/assessment-versions")
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((d) => setRows(d.rows))
      .catch(() => setError(true));
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="mb-4 text-2xl font-semibold text-midnight-navy">Assessment</h1>
      <AssessmentTabs />
      <h2 className="text-lg font-semibold text-midnight-navy">Versions</h2>
      <p className="mt-1 text-sm text-charcoal/60">
        Assessment versions are structural and read-only. Contact your developer to publish a new version.
      </p>

      {error && <p className="mt-6 text-sm text-coral-rose">Failed to load versions.</p>}
      {!error && !rows && <p className="mt-6 text-sm text-charcoal/60">Loading…</p>}

      {rows && (
        <div className="mt-5 overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                <th className="px-3 py-2 font-semibold">Version</th>
                <th className="px-3 py-2 font-semibold">Description</th>
                <th className="px-3 py-2 font-semibold">Active from</th>
                <th className="px-3 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v, i) => (
                <tr key={v.id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2 font-medium">{v.version_label ?? "—"}</td>
                  <td className="px-3 py-2 text-charcoal/80">{v.description ?? "—"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{fmt(v.active_from)}</td>
                  <td className="px-3 py-2">
                    {v.active_to === null ? (
                      <span className="rounded-full bg-sage-green/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-sage-green">Active</span>
                    ) : (
                      <span className="rounded-full bg-light-gray px-2.5 py-0.5 text-[11px] uppercase text-charcoal/60">Retired</span>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={4} className="px-3 py-8 text-center text-charcoal/60">No versions.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
