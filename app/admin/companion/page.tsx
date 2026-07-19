"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { STATUS_LABELS, type ContentStatus } from "@/lib/companion";

interface Row { id: string; title: string; consumer_title: string | null; status: ContentStatus; mode: string; published_version: number | null; updated_at: string }

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-light-gray text-charcoal/70", internal_review: "bg-amber-50 text-amber-800", theory_review: "bg-amber-50 text-amber-800",
  safety_review: "bg-amber-50 text-amber-800", approved: "bg-sage-green/20 text-midnight-navy", published: "bg-midnight-navy text-white", archived: "bg-light-gray text-charcoal/40",
};

export default function CompanionAdminPage() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    const r = await fetch("/api/admin/companion/experiences");
    if (!r.ok) { setErr("Failed to load."); return; }
    setRows((await r.json()).experiences);
  }
  useEffect(() => { load(); }, []);

  async function create() {
    if (!title.trim()) return;
    setBusy(true); setErr(null);
    const r = await fetch("/api/admin/companion/experiences", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setErr(d.error ?? "Failed."); return; }
    setTitle(""); load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-midnight-navy">Relationship Companion</h1>
          <p className="mt-1 text-sm text-charcoal/60">Author guided processing experiences from reusable blocks. Content is placeholder until the approved library is supplied.</p>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New experience title (internal)"
          className="admin-input max-w-md flex-1" onKeyDown={(e) => { if (e.key === "Enter") create(); }} />
        <button onClick={create} disabled={busy || !title.trim()} className="rounded-md bg-midnight-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? "Creating…" : "New experience"}
        </button>
      </div>
      {err && <p className="mt-2 text-sm text-coral-rose">{err}</p>}

      <div className="mt-6 overflow-hidden rounded-xl border border-light-gray bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-light-gray text-left text-xs uppercase tracking-wide text-charcoal/50">
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Mode</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Published v</th>
              <th className="px-4 py-3 font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows === null ? (
              <tr><td colSpan={5} className="px-4 py-6 text-charcoal/50">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-charcoal/50">No experiences yet. Create one above.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="border-b border-light-gray/60 last:border-0 hover:bg-warm-ivory/50">
                <td className="px-4 py-3"><Link href={`/admin/companion/${r.id}`} className="font-medium text-midnight-navy hover:underline">{r.title}</Link>{r.consumer_title && <span className="ml-2 text-xs text-charcoal/45">“{r.consumer_title}”</span>}</td>
                <td className="px-4 py-3 text-charcoal/70">{r.mode}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[r.status] ?? "bg-light-gray"}`}>{STATUS_LABELS[r.status] ?? r.status}</span></td>
                <td className="px-4 py-3 text-charcoal/70">{r.published_version ?? "—"}</td>
                <td className="px-4 py-3 text-charcoal/55">{new Date(r.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
