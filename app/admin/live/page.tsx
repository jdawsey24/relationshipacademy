"use client";

import { useEffect, useState } from "react";
import { useCanWrite } from "@/components/admin/RoleContext";
import { LIVE_STATUSES, type LiveSession } from "@/lib/live";
import { TIERS } from "@/lib/academy";

type Row = LiveSession & { id: string };

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(v: string): string | null {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export default function AdminLive() {
  const canWrite = useCanWrite();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({ area: "academy", title: "" });
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/live-sessions").then((r) => r.json()).catch(() => null);
    setRows(res?.rows ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function patch(id: string, p: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...p } : r)));
  }

  async function add() {
    if (!draft.title.trim()) return;
    const res = await fetch("/api/admin/live-sessions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ area: draft.area, title: draft.title, status: "scheduled" }),
    });
    if (res.ok) { setDraft({ area: draft.area, title: "" }); load(); }
  }

  async function save(r: Row) {
    setMsg(null);
    const res = await fetch(`/api/admin/live-sessions/${r.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        area: r.area, title: r.title, description: r.description ?? "", status: r.status,
        scheduled_at: r.scheduled_at, embed_url: r.embed_url ?? "", join_url: r.join_url ?? "",
        replay_url: r.replay_url ?? "", min_tier: r.min_tier, sort_order: r.sort_order ?? 0,
      }),
    });
    setMsg(res.ok ? "Saved." : "Save failed.");
  }

  async function remove(id: string) {
    if (!confirm("Delete this live session?")) return;
    const res = await fetch(`/api/admin/live-sessions/${id}`, { method: "DELETE" });
    if (res.ok) setRows((rs) => rs.filter((r) => r.id !== id));
  }

  const inp = "w-full rounded-md border border-light-gray px-3 py-2 text-sm outline-none focus:border-midnight-navy disabled:bg-light-gray/30";

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">Live Sessions</h1>
      <p className="mb-6 max-w-2xl text-sm text-charcoal/60">
        Schedule live sessions for the Academy (gated by tier) or Institute (gated to professionals). Set an <strong>embed URL</strong> (YouTube/Vimeo — a normal watch/live link works) to play in-page, or a <strong>join link</strong> (e.g. Zoom). Flip status to <strong>Live</strong> when you go on air; set a <strong>replay URL</strong> after.
      </p>

      {canWrite && (
        <div className="mb-6 flex flex-col gap-2 rounded-lg border border-light-gray p-4 sm:flex-row sm:items-end">
          <label className="text-sm font-medium text-charcoal">Area
            <select value={draft.area} onChange={(e) => setDraft((d) => ({ ...d, area: e.target.value }))} className={`mt-1 ${inp}`}>
              <option value="academy">Academy</option>
              <option value="institute">Institute</option>
            </select>
          </label>
          <label className="flex-1 text-sm font-medium text-charcoal">New session title
            <input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} className={`mt-1 ${inp}`} />
          </label>
          <button type="button" onClick={add} disabled={!draft.title.trim()} className="h-10 shrink-0 rounded-md bg-midnight-navy px-4 text-sm font-medium text-white hover:bg-midnight-navy/90 disabled:opacity-50">Add</button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-charcoal/60">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-charcoal/60">No live sessions yet.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <div key={r.id} className="rounded-lg border border-light-gray p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-medium text-charcoal">Title
                  <input value={r.title} onChange={(e) => patch(r.id, { title: e.target.value })} disabled={!canWrite} className={`mt-1 ${inp}`} />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-sm font-medium text-charcoal">Area
                    <select value={r.area} onChange={(e) => patch(r.id, { area: e.target.value as Row["area"] })} disabled={!canWrite} className={`mt-1 ${inp}`}>
                      <option value="academy">Academy</option>
                      <option value="institute">Institute</option>
                    </select>
                  </label>
                  <label className="text-sm font-medium text-charcoal">Status
                    <select value={r.status} onChange={(e) => patch(r.id, { status: e.target.value as Row["status"] })} disabled={!canWrite} className={`mt-1 ${inp}`}>
                      {LIVE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                </div>
                <label className="text-sm font-medium text-charcoal">Scheduled time
                  <input type="datetime-local" value={toLocalInput(r.scheduled_at)} onChange={(e) => patch(r.id, { scheduled_at: fromLocalInput(e.target.value) })} disabled={!canWrite} className={`mt-1 ${inp}`} />
                </label>
                {r.area === "academy" && (
                  <label className="text-sm font-medium text-charcoal">Minimum tier (Academy)
                    <select value={r.min_tier} onChange={(e) => patch(r.id, { min_tier: e.target.value })} disabled={!canWrite} className={`mt-1 ${inp}`}>
                      {TIERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </label>
                )}
                <label className="text-sm font-medium text-charcoal sm:col-span-2">Description
                  <textarea rows={2} value={r.description ?? ""} onChange={(e) => patch(r.id, { description: e.target.value })} disabled={!canWrite} className={`mt-1 ${inp}`} />
                </label>
                <label className="text-sm font-medium text-charcoal">Embed URL (YouTube/Vimeo)
                  <input value={r.embed_url ?? ""} onChange={(e) => patch(r.id, { embed_url: e.target.value })} disabled={!canWrite} className={`mt-1 ${inp}`} placeholder="https://youtube.com/watch?v=…" />
                </label>
                <label className="text-sm font-medium text-charcoal">Join link (e.g. Zoom)
                  <input value={r.join_url ?? ""} onChange={(e) => patch(r.id, { join_url: e.target.value })} disabled={!canWrite} className={`mt-1 ${inp}`} placeholder="https://zoom.us/j/…" />
                </label>
                <label className="text-sm font-medium text-charcoal">Replay URL (after)
                  <input value={r.replay_url ?? ""} onChange={(e) => patch(r.id, { replay_url: e.target.value })} disabled={!canWrite} className={`mt-1 ${inp}`} placeholder="https://youtube.com/watch?v=…" />
                </label>
                <label className="text-sm font-medium text-charcoal">Sort order
                  <input type="number" value={r.sort_order ?? 0} onChange={(e) => patch(r.id, { sort_order: Number(e.target.value) })} disabled={!canWrite} className={`mt-1 w-28 ${inp}`} />
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
    </div>
  );
}
