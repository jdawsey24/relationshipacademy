"use client";

import { useCallback, useEffect, useState } from "react";

// Public-use approvals.
//
// This is the only screen that can make a source publishable. Everything else in
// the engine can refuse; only a recorded approval here permits — per source, per
// use, per audience, against the version of the content that was actually read.
//
// The reviewer is taken from the signed-in session, never from this form. An
// approval that cannot say who approved it is not an approval.

interface Approval {
  id: string; source_type: string; source_id: string;
  permitted_use: string[]; audience: string[]; restrictions: string | null;
  reviewer: string; reviewed_at: string; expires_at: string | null;
  status: string; approved_source_hash: string | null;
}
interface Competency {
  competency_id: string; name: string; phase: string; domain: string;
  framework_status: string; record_status: string;
}
interface Payload {
  approvals: Approval[]; competencies: Competency[]; phases: string[];
  permittedUses: string[]; audiences: string[];
}

export default function ApprovalsPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [phase, setPhase] = useState("");
  const [selected, setSelected] = useState<Competency | null>(null);
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [uses, setUses] = useState<string[]>(["public_script", "public_caption"]);
  const [auds, setAuds] = useState<string[]>(["consumer"]);
  const [restrictions, setRestrictions] = useState("");
  const [expires, setExpires] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async (p: string) => {
    const r = await fetch(`/api/admin/content-engine/approvals${p ? `?phase=${encodeURIComponent(p)}` : ""}`);
    if (r.ok) setData(await r.json());
    else setErr((await r.json()).error ?? "Could not load approvals.");
  }, []);

  useEffect(() => { void load(phase); }, [phase, load]);

  const approvedFor = new Map(
    (data?.approvals ?? []).filter((a) => a.status === "approved").map((a) => [`${a.source_type}:${a.source_id}`, a]),
  );

  async function openPreview(c: Competency) {
    setSelected(c); setPreview(null); setErr(null); setMsg(null);
    const r = await fetch("/api/admin/content-engine/approvals", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source_type: "competency", source_id: c.competency_id }),
    });
    const j = await r.json();
    if (r.ok) setPreview(j); else setErr(j.error);
  }

  async function approve() {
    if (!selected) return;
    setBusy(true); setErr(null); setMsg(null);
    try {
      const r = await fetch("/api/admin/content-engine/approvals", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_type: "competency", source_id: selected.competency_id,
          permitted_use: uses, audience: auds,
          restrictions: restrictions || null, expires_at: expires || null,
        }),
      });
      const j = await r.json();
      if (!r.ok) { setErr(j.error); return; }
      setMsg(`${selected.competency_id} approved for ${uses.join(", ")} · ${auds.join(", ")}.`);
      setSelected(null); setPreview(null); setRestrictions(""); setExpires("");
      await load(phase);
    } finally { setBusy(false); }
  }

  async function revoke(a: Approval) {
    if (!window.confirm(`Revoke the approval for ${a.source_id}? It becomes unpublishable immediately.`)) return;
    setBusy(true); setErr(null);
    try {
      const r = await fetch(
        `/api/admin/content-engine/approvals?source_type=${a.source_type}&source_id=${a.source_id}`,
        { method: "DELETE" },
      );
      if (!r.ok) setErr((await r.json()).error);
      else { setMsg(`${a.source_id} revoked.`); await load(phase); }
    } finally { setBusy(false); }
  }

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Public-use approvals</h1>
        <p className="mt-1 text-sm text-slate-600">
          The only thing that makes a source publishable. Recorded per source, per use, per audience,
          against the version of the content you actually read — if the source changes afterwards, the
          approval stops applying and has to be recorded again.
        </p>
      </header>

      {err && <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">{err}</div>}
      {msg && <div className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">{msg}</div>}

      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-medium text-slate-700">Phase</label>
        <select value={phase} onChange={(e) => setPhase(e.target.value)}
          className="rounded border border-slate-300 px-2 py-1 text-sm">
          <option value="">All phases</option>
          {(data?.phases ?? []).map((p) => <option key={p}>{p}</option>)}
        </select>
        <span className="text-xs text-slate-500">
          {approvedFor.size} approved · {(data?.competencies ?? []).length} shown
        </span>
      </div>

      {/* Approval form */}
      {selected && (
        <section className="mb-6 rounded-lg border border-slate-900 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Approving {selected.competency_id} — {selected.name}
          </h2>
          <p className="mt-1 text-xs text-slate-600">{selected.phase} · {selected.domain}</p>

          {preview ? (
            <details className="mt-3 rounded border border-slate-200 bg-white p-3" open>
              <summary className="cursor-pointer text-xs font-medium text-slate-700">
                What you are approving (consumer-safe fields only)
              </summary>
              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-slate-700">
                {JSON.stringify((preview as { snapshot: unknown }).snapshot, null, 2)}
              </pre>
              <p className="mt-2 font-mono text-[11px] text-slate-500">
                version hash {(preview as { hash: string }).hash}
              </p>
            </details>
          ) : (
            <p className="mt-3 text-xs text-slate-500">Loading the content…</p>
          )}

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-700">Permitted use</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {(data?.permittedUses ?? []).map((u) => (
                  <button key={u} onClick={() => toggle(uses, setUses, u)}
                    className={`rounded px-2 py-1 text-xs ${uses.includes(u)
                      ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-600"}`}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-700">Audience</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {(data?.audiences ?? []).map((a) => (
                  <button key={a} onClick={() => toggle(auds, setAuds, a)}
                    className={`rounded px-2 py-1 text-xs ${auds.includes(a)
                      ? "bg-slate-900 text-white" : "border border-slate-300 text-slate-600"}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-slate-600">
              Restrictions — what may NOT be done with it
              <input value={restrictions} onChange={(e) => setRestrictions(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" />
            </label>
            <label className="text-xs text-slate-600">
              Re-review date (optional)
              <input type="date" value={expires} onChange={(e) => setExpires(e.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm text-slate-900" />
            </label>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button onClick={approve} disabled={busy || !uses.length || !auds.length || !preview}
              className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40">
              {busy ? "Recording…" : "Record approval"}
            </button>
            <button onClick={() => { setSelected(null); setPreview(null); }}
              className="rounded border border-slate-300 px-3 py-2 text-sm text-slate-600">Cancel</button>
            <span className="text-xs text-slate-500">Signed in as reviewer; your email is recorded.</span>
          </div>
        </section>
      )}

      {/* Competency list */}
      <section>
        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
          {(data?.competencies ?? []).map((c) => {
            const a = approvedFor.get(`competency:${c.competency_id}`);
            return (
              <li key={c.competency_id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm text-slate-800">
                    <span className="font-mono text-xs text-slate-500">{c.competency_id}</span>{" "}
                    {c.name}
                  </p>
                  <p className="text-xs text-slate-500">{c.phase} · {c.domain}</p>
                </div>
                <div className="flex items-center gap-2">
                  {a ? (
                    <>
                      <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">
                        {a.permitted_use.join(", ")} · {a.audience.join(", ")}
                      </span>
                      <button onClick={() => revoke(a)} disabled={busy}
                        className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 disabled:opacity-40">
                        Revoke
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-slate-400">not approved</span>
                      <button onClick={() => openPreview(c)} disabled={busy}
                        className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 disabled:opacity-40">
                        Review &amp; approve
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
