"use client";

import { useCallback, useEffect, useState } from "react";
import AiStudioNav from "@/components/admin/AiStudioNav";
import { DESTINATIONS, PUBLISH_SOURCE_TYPES, type PublishableRecord } from "@/lib/publishing";

export default function AiPublishingPage() {
  const [sourceType, setSourceType] = useState<string>("worksheet");
  const [rows, setRows] = useState<PublishableRecord[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch(`/api/admin/ai/publishing?source_type=${sourceType}`).then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => { if (!ok) setErr(j.error ?? "Failed."); else { setRows(j.rows); setErr(null); } })
      .catch(() => setErr("Failed to load."));
  }, [sourceType]);
  useEffect(() => { setRows(null); load(); }, [load]);

  async function toggle(rec: PublishableRecord, destination: string, on: boolean) {
    const key = `${rec.id}:${destination}`;
    setPending(key); setMsg(null);
    const res = await fetch("/api/admin/ai/publishing/toggle", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_type: rec.source_type, source_id: rec.id, destination, action: on ? "publish" : "unpublish" }),
    });
    const d = await res.json().catch(() => ({}));
    setPending(null);
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    // optimistic update
    setRows((rs) => rs?.map((r) => r.id === rec.id ? { ...r, destinations: on ? [...r.destinations, destination] : r.destinations.filter((x) => x !== destination) } : r) ?? rs);
  }

  return (
    <div>
      <AiStudioNav />
      <p className="mb-4 max-w-2xl text-sm text-charcoal/60">Route <strong>approved</strong> Content Library records to destinations. Publishing creates a <strong>mapping</strong> — the source is never duplicated; each destination surface reads it through the mapping. Owner-only.</p>

      <div className="mb-4">
        <label className="text-sm font-medium text-charcoal">Content type
          <select value={sourceType} onChange={(e) => setSourceType(e.target.value)} className="ml-2 rounded-md border border-light-gray px-2 py-1.5 text-sm">
            {PUBLISH_SOURCE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
      </div>

      {msg && <div className="mb-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}
      {err && <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">{err}</p>}
      {!err && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows && rows.length === 0 && <p className="text-sm text-charcoal/60">No approved records of this type yet. Approve content in the Review Queue (or Studio → Library) first.</p>}

      {rows && rows.length > 0 && (
        <div className="space-y-3">
          {rows.map((rec) => (
            <div key={rec.id} className="rounded-md border border-light-gray p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="font-medium text-midnight-navy">{rec.label}</span>
                <span className="font-mono text-[11px] text-charcoal/40">{rec.id}</span>
                {rec.destinations.length > 0 && <span className="rounded-full bg-sage-green/15 px-2 py-0.5 text-[11px] text-sage-green">{rec.destinations.length} published</span>}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DESTINATIONS.map((d) => {
                  const on = rec.destinations.includes(d.value);
                  const busy = pending === `${rec.id}:${d.value}`;
                  return (
                    <button key={d.value} disabled={busy} onClick={() => toggle(rec, d.value, !on)}
                      className={`rounded-full px-2.5 py-1 text-xs transition-colors disabled:opacity-50 ${on ? "bg-midnight-navy text-white" : "border border-light-gray text-charcoal/60 hover:bg-light-gray"}`}>
                      {on ? "✓ " : "+ "}{d.label}{d.public && !on ? " ·public" : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
