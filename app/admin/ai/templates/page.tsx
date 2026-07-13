"use client";

import { useCallback, useEffect, useState } from "react";
import AiStudioNav from "@/components/admin/AiStudioNav";
import type { PromptTemplate } from "@/lib/ai/types";

export default function AiTemplatesPage() {
  const [rows, setRows] = useState<PromptTemplate[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin/ai/templates").then((r) => r.json().then((j) => ({ ok: r.ok, j }))).then(({ ok, j }) => { if (!ok) setErr(j.error ?? "Failed."); else setRows(j.rows); }).catch(() => setErr("Failed."));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: string) {
    const res = await fetch("/api/admin/ai/templates", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (res.ok) { setMsg(`Template ${status}.`); load(); } else { const d = await res.json().catch(() => ({})); setMsg(d.error ?? "Failed."); }
  }

  return (
    <div>
      <AiStudioNav />
      <p className="mb-4 text-sm text-charcoal/60">Approved templates are <strong>immutable</strong> — edits create a new version. The active template per generation type is the highest-version approved one.</p>
      {msg && <div className="mb-3 rounded-md bg-sage-green/10 px-3 py-2 text-sm text-sage-green">{msg}</div>}
      {err && <p className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">{err}</p>}
      {!err && !rows && <p className="text-sm text-charcoal/60">Loading…</p>}
      {rows && rows.map((t) => (
        <div key={t.id} className="mb-2 rounded-md border border-light-gray p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-midnight-navy">{t.name}</span>
            <span className="rounded bg-light-gray px-2 py-0.5 text-[11px] text-charcoal/60">v{t.version} · {t.generation_type}</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${t.status === "approved" ? "bg-sage-green/20 text-sage-green" : t.status === "retired" ? "bg-light-gray text-charcoal/40" : "bg-amber-100 text-amber-800"}`}>{t.status}</span>
            <button onClick={() => setOpenId(openId === t.id ? null : t.id)} className="ml-auto text-sm text-midnight-navy hover:underline">{openId === t.id ? "Hide" : "View"}</button>
            {t.status === "draft" && <button onClick={() => setStatus(t.id, "approved")} className="rounded border border-sage-green px-2 py-0.5 text-xs text-sage-green">Approve</button>}
            {t.status === "approved" && <button onClick={() => setStatus(t.id, "retired")} className="rounded border border-coral-rose px-2 py-0.5 text-xs text-coral-rose">Retire</button>}
          </div>
          {openId === t.id && (
            <div className="mt-2 space-y-2 text-xs">
              <div><span className="font-semibold text-charcoal/70">System instruction</span><pre className="mt-1 whitespace-pre-wrap rounded bg-light-gray/50 p-2 font-mono text-[11px]">{t.system_instruction}</pre></div>
              <div><span className="font-semibold text-charcoal/70">User template</span><pre className="mt-1 whitespace-pre-wrap rounded bg-light-gray/50 p-2 font-mono text-[11px]">{t.user_template}</pre></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
