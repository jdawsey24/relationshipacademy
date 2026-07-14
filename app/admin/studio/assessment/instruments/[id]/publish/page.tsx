"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import StudioNav from "@/components/admin/StudioNav";
import AssessmentNav from "@/components/admin/AssessmentNav";
import InstrumentSubNav from "@/components/admin/InstrumentSubNav";
import { useAdminRole } from "@/components/admin/RoleContext";

interface Check { key: string; label: string; ok: boolean; detail: string }
interface Readiness { ready: boolean; checks: Check[]; slug: string | null; live_enabled: boolean }

export default function InstrumentPublishPage() {
  const { id: raw } = useParams<{ id: string }>();
  const id = decodeURIComponent(raw);
  const isOwner = useAdminRole() === "owner";
  const [r, setR] = useState<Readiness | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/admin/studio/assessment/instruments/${encodeURIComponent(id)}/publish`).then((x) => x.json()).then(setR).catch(() => {});
  }, [id]);
  useEffect(() => { load(); }, [load]);

  async function act(action: "publish" | "unpublish") {
    setBusy(true); setMsg(null);
    const res = await fetch(`/api/admin/studio/assessment/instruments/${encodeURIComponent(id)}/publish`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg(d.error ?? "Failed."); return; }
    setMsg(action === "publish" ? `Published — live at /assess/${d.slug}` : "Unpublished.");
    load();
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-midnight-navy">RLC Studio</h1>
      <p className="mb-4 text-sm text-charcoal/60">Publish — take this assembled instrument live as a second public assessment, alongside the Snapshot. Blocked until it&apos;s ready.</p>
      <StudioNav />
      <AssessmentNav />
      <Link href="/admin/studio/assessment" className="text-sm text-midnight-navy hover:underline">← All instruments</Link>
      <div className="mb-3" />
      <InstrumentSubNav id={id} />

      {!r ? <p className="text-sm text-charcoal/60">Loading…</p> : (
        <>
          {r.live_enabled && r.slug && (
            <div className="mb-4 rounded-md border border-sage-green/40 bg-sage-green/10 px-4 py-3 text-sm">
              <span className="font-semibold text-sage-green">Live.</span> Public at{" "}
              <a href={`/assess/${r.slug}`} target="_blank" rel="noreferrer" className="font-mono text-midnight-navy hover:underline">/assess/{r.slug}</a>
            </div>
          )}

          <h2 className="mb-2 text-sm font-semibold text-midnight-navy">Readiness checklist</h2>
          <ul className="mb-4 divide-y divide-light-gray rounded-md border border-light-gray">
            {r.checks.map((c) => (
              <li key={c.key} className="flex items-start gap-3 px-4 py-2.5">
                <span className={`mt-0.5 text-sm ${c.ok ? "text-sage-green" : "text-coral-rose"}`}>{c.ok ? "✓" : "✕"}</span>
                <div>
                  <div className="text-sm font-medium text-charcoal/90">{c.label}</div>
                  <div className="text-xs text-charcoal/55">{c.detail}</div>
                </div>
              </li>
            ))}
          </ul>

          {!r.ready && (
            <p className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
              Not ready to publish. Real respondents are never scored on missing cut-points or shown raw item wording — author the items above first
              (cut-points in <Link href="/admin/studio/assessment/scoring" className="underline">Scoring → Rules &amp; Bands</Link>; consumer text in the <Link href={`/admin/studio/assessment/items?competency_id=`} className="underline">Item Bank</Link>).
            </p>
          )}

          {msg && <div className="mb-3 rounded-md bg-light-gray px-3 py-2 text-sm text-charcoal/70">{msg}</div>}

          {isOwner ? (
            <div className="flex gap-2">
              {!r.live_enabled && <button disabled={!r.ready || busy} onClick={() => act("publish")} className="rounded-md bg-midnight-navy px-5 py-2 text-sm font-medium text-white disabled:opacity-40">{busy ? "…" : "Publish to live"}</button>}
              {r.live_enabled && <button disabled={busy} onClick={() => act("unpublish")} className="rounded-md border border-coral-rose px-5 py-2 text-sm font-medium text-coral-rose disabled:opacity-40">{busy ? "…" : "Unpublish"}</button>}
            </div>
          ) : <p className="text-xs text-charcoal/50">Only the owner can publish or unpublish.</p>}
        </>
      )}
    </div>
  );
}
