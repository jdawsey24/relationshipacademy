"use client";

import { useEffect, useState } from "react";
import AiStudioNav from "@/components/admin/AiStudioNav";
import type { GenerationRequest } from "@/lib/ai/types";

export default function AiHistoryPage() {
  const [rows, setRows] = useState<GenerationRequest[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/admin/ai/history").then((r) => r.json().then((j) => ({ ok: r.ok, j }))).then(({ ok, j }) => { if (!ok) setErr(j.error ?? "Failed."); else setRows(j.rows); }).catch(() => setErr("Failed."));
  }, []);
  return (
    <div>
      <AiStudioNav />
      {err && <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">{err}</p>}
      {!err && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-sm text-charcoal/60">No generations yet.</p>}
      {rows && rows.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-light-gray">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-light-gray text-left text-[13px] uppercase text-charcoal">
                <th className="px-3 py-2 font-semibold">When</th>
                <th className="px-3 py-2 font-semibold">Type</th>
                <th className="px-3 py-2 font-semibold">Model</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Tokens</th>
                <th className="px-3 py-2 font-semibold">Cost</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className={i % 2 ? "bg-[#F9F9F9]" : "bg-white"}>
                  <td className="px-3 py-2 whitespace-nowrap text-charcoal/60">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2">{r.generation_type}</td>
                  <td className="px-3 py-2 text-charcoal/60">{r.provider}/{r.model}</td>
                  <td className="px-3 py-2">{r.status}{r.error_message ? <span className="block text-[11px] text-coral-rose">{r.error_message}</span> : null}</td>
                  <td className="px-3 py-2 text-charcoal/60">{((r.input_tokens ?? 0) + (r.output_tokens ?? 0)).toLocaleString()}</td>
                  <td className="px-3 py-2 text-charcoal/60">{r.cost_usd != null ? `$${Number(r.cost_usd).toFixed(3)}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
