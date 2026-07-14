"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StudioNav from "@/components/admin/StudioNav";
import AssessmentNav from "@/components/admin/AssessmentNav";
import InstrumentSubNav from "@/components/admin/InstrumentSubNav";
import { useAdminRole } from "@/components/admin/RoleContext";

interface Row {
  item_id: string;
  item_text: string;
  consumer_item_text: string | null;
  reverse_scored: boolean;
  domain: string | null;
  proposed?: string;
  flags?: string[];
  edited?: string;   // current textarea value
  saved?: boolean;   // just applied
}

export default function ConsumerTextPage() {
  const { id: raw } = useParams<{ id: string }>();
  const id = decodeURIComponent(raw);
  const isOwner = useAdminRole() === "owner";
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafting, setDrafting] = useState(false);
  const [applyingAll, setApplyingAll] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/studio/assessment/instruments/${encodeURIComponent(id)}/consumer-text`);
      const d = await r.json();
      if (!r.ok) { setMsg(d.error ?? "Failed to load."); setRows([]); }
      else setRows(((d.items ?? []) as Row[]).map((x) => ({ ...x, edited: x.consumer_item_text ?? "" })));
    } catch { setMsg("Failed to load."); }
    setLoading(false);
  }, [id]);
  useEffect(() => { load(); }, [load]);

  const total = rows.length;
  const done = useMemo(() => rows.filter((r) => (r.edited ?? "").trim() && (r.edited ?? "").trim() === (r.consumer_item_text ?? "").trim()).length, [rows]);

  async function draft(includeExisting: boolean) {
    setDrafting(true); setMsg(null);
    try {
      const r = await fetch(`/api/admin/studio/assessment/instruments/${encodeURIComponent(id)}/consumer-text`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ include_existing: includeExisting }),
      });
      const d = await r.json();
      if (!r.ok) { setMsg(d.error ?? "Generation failed."); }
      else {
        const byId = new Map((d.drafts as Row[]).map((x) => [x.item_id, x]));
        setRows((prev) => prev.map((row) => {
          const dr = byId.get(row.item_id);
          if (!dr) return row;
          return { ...row, proposed: dr.proposed, flags: dr.flags, edited: dr.proposed || row.edited, saved: false };
        }));
        setMsg(`Drafted ${(d.drafts as Row[]).length} item(s). Review and Apply.`);
      }
    } catch { setMsg("Generation failed."); }
    setDrafting(false);
  }

  async function apply(items: Row[]) {
    const updates = items
      .filter((r) => (r.edited ?? "").trim() && (r.edited ?? "").trim() !== (r.consumer_item_text ?? "").trim())
      .map((r) => ({ item_id: r.item_id, consumer_item_text: (r.edited ?? "").trim() }));
    if (!updates.length) { setMsg("Nothing to apply."); return; }
    const r = await fetch(`/api/admin/studio/assessment/instruments/${encodeURIComponent(id)}/consumer-text`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ updates }),
    });
    const d = await r.json();
    if (!r.ok) { setMsg(d.error ?? "Apply failed."); return; }
    const appliedIds = new Set(updates.map((u) => u.item_id));
    setRows((prev) => prev.map((row) => appliedIds.has(row.item_id) ? { ...row, consumer_item_text: (row.edited ?? "").trim(), saved: true } : row));
    setMsg(`Applied ${d.applied} item(s)${d.failed?.length ? `, ${d.failed.length} failed` : ""}.`);
  }

  const INP = "rounded-md border border-light-gray bg-white px-2 py-1.5 text-sm";

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">RLC Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">Consumer item text — draft plain-language wording respondents read, then apply it to the bank. AI proposes; nothing saves until you Apply. Scoring is unaffected.</p>
      <StudioNav />
      <AssessmentNav />
      <Link href="/admin/studio/assessment" className="text-sm text-midnight-navy hover:underline">← All instruments</Link>
      <div className="mb-3" />
      <InstrumentSubNav id={id} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-charcoal/80">{done} of {total} have consumer text</span>
        <div className="h-1.5 w-40 rounded-full bg-light-gray"><div className="h-1.5 rounded-full bg-sage-green transition-all" style={{ width: `${total ? Math.round((done / total) * 100) : 0}%` }} /></div>
        {isOwner && (
          <>
            <button disabled={drafting || !total} onClick={() => draft(false)} className="ml-auto rounded-md bg-midnight-navy px-4 py-1.5 text-sm font-medium text-white disabled:opacity-40">{drafting ? "Drafting…" : "Draft missing with AI"}</button>
            <button disabled={drafting || !total} onClick={() => draft(true)} className="rounded-md border border-midnight-navy px-4 py-1.5 text-sm font-medium text-midnight-navy disabled:opacity-40">Regenerate all</button>
            <button disabled={applyingAll} onClick={async () => { setApplyingAll(true); await apply(rows); setApplyingAll(false); }} className="rounded-md border border-sage-green px-4 py-1.5 text-sm font-medium text-sage-green disabled:opacity-40">Apply all edits</button>
          </>
        )}
      </div>

      {msg && <div className="mb-3 rounded-md bg-light-gray px-3 py-2 text-sm text-charcoal/70">{msg}</div>}
      {!isOwner && <p className="mb-3 text-xs text-charcoal/50">Only the owner can draft or apply consumer text.</p>}

      {loading ? <p className="text-sm text-charcoal/60">Loading…</p> : total === 0 ? (
        <p className="text-sm text-charcoal/60">No approved assembled items for this instrument yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => {
            const dirty = (row.edited ?? "").trim() && (row.edited ?? "").trim() !== (row.consumer_item_text ?? "").trim();
            return (
              <li key={row.item_id} className="rounded-lg border border-light-gray p-3">
                <div className="mb-1 flex items-center gap-2 text-xs text-charcoal/50">
                  <span className="font-mono">{row.item_id}</span>
                  {row.domain && <span className="rounded bg-light-gray px-1.5 py-0.5">{row.domain}</span>}
                  {row.reverse_scored && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">reverse-scored</span>}
                  {(row.consumer_item_text ?? "").trim() && <span className="rounded bg-sage-green/15 px-1.5 py-0.5 text-sage-green">has consumer text</span>}
                </div>
                <p className="mb-2 text-sm text-charcoal/70"><span className="text-charcoal/40">Professional:</span> {row.item_text}</p>
                <textarea
                  disabled={!isOwner}
                  value={row.edited ?? ""}
                  onChange={(e) => setRows((prev) => prev.map((r) => r.item_id === row.item_id ? { ...r, edited: e.target.value, saved: false } : r))}
                  rows={2}
                  placeholder="Consumer wording…"
                  className={`${INP} w-full`}
                />
                {row.flags && row.flags.length > 0 && (
                  <p className="mt-1 text-xs text-coral-rose">⚠ {row.flags.join(" · ")}</p>
                )}
                <div className="mt-1.5 flex items-center gap-2">
                  {isOwner && <button disabled={!dirty} onClick={() => apply([row])} className="rounded border border-midnight-navy px-3 py-1 text-xs font-medium text-midnight-navy disabled:opacity-30">Apply</button>}
                  {row.saved && !dirty && <span className="text-xs text-sage-green">✓ saved</span>}
                  {row.proposed && row.proposed !== (row.edited ?? "") && <button onClick={() => setRows((prev) => prev.map((r) => r.item_id === row.item_id ? { ...r, edited: r.proposed } : r))} className="text-xs text-charcoal/50 hover:underline">reset to AI draft</button>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
