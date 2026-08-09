"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AXES } from "@/lib/contentStudio/directions";

// Building a script.
//
// Paste what you saw. Read three whole scripts. Take one.
//
// An earlier version handed over eight opening lines, then five middles, then
// five endings. That is a good way to explore and a bad way to judge, because a
// hook is only good relative to where it goes. The staged path still exists
// behind the API for building a piece by hand; it is not what the screen leads
// with.

interface Option {
  id: string; stage: string; technique: string | null; format: string | null;
  content: string; why: string | null; selected: boolean; edited_by_owner: boolean;
  seconds_est: number | null;
}
interface Script {
  id: string | null; script: string; hook_format: string | null;
  seconds_est: number | null; cut_notes: string | null;
  review: { concerns?: string[] } & Record<string, unknown>;
}
interface Project {
  conversation: { id: string; source_text: string | null; source_url: string | null; topic: string | null; brief: Record<string, string | undefined> };
  rehearsal: boolean;
  variations: Option[];
  script: Script | null;
  can_tighten: boolean;
  cost: { spent: number; notice: string | null; mayProceed: boolean };
}

const FORMAT_LABEL: Record<string, string> = {
  to_camera: "to camera", stitch: "stitch", cold_open: "cold open",
  flash_forward: "flash forward", anticipation: "anticipation",
};

export default function ScriptBuilder() {
  const { id } = useParams<{ id: string }>();
  const [p, setP] = useState<Project | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [src, setSrc] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [offer, setOffer] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const load = useCallback(async () => {
    const r = await fetch(`/api/admin/content-studio/conversations/${id}/script`);
    if (!r.ok) return;
    const d: Project = await r.json();
    setP(d);
    setSrc(d.conversation.source_text ?? "");
    setUrl(d.conversation.source_url ?? "");
    setNote(d.conversation.topic ?? "");
    setOffer(d.conversation.brief?.offer ?? "");
  }, [id]);
  useEffect(() => { void load(); }, [load]);

  async function post(body: Record<string, unknown>, label: string) {
    setBusy(label); setErr(null);
    try {
      const r = await fetch(`/api/admin/content-studio/conversations/${id}/script`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await r.json();
      if (!r.ok) { setErr(d.error ?? "That didn't work."); return; }
      if (d.blocked) { setErr(d.notice); return; }
      setP(d);
    } finally { setBusy(null); }
  }

  if (!p) return <div className="mx-auto max-w-3xl px-6 py-16 text-sm text-slate-500">Loading…</div>;

  const chosen = p.variations.find((v) => v.selected) ?? null;
  const concerns = p.script?.review?.concerns ?? [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <header className="mb-8 flex items-baseline gap-3 text-sm">
        <a href="/admin/content-studio" className="text-slate-500 hover:text-slate-800">← Content Studio</a>
        <span className="flex-1" />
        <span className="text-slate-400">${p.cost.spent.toFixed(2)}</span>
      </header>

      {p.rehearsal && (
        <div className="mb-6 flex items-center gap-3 rounded border border-sky-300 bg-sky-50 p-3 text-sm text-sky-900">
          <span className="flex-1">
            Rehearsal. Nothing here is being written now, it&apos;s replaying earlier runs, and it costs nothing.
          </span>
          <button className="underline" disabled={busy !== null}
            onClick={() => void post({ action: "rehearsal", on: false }, "rehearsal")}>
            Write for real
          </button>
        </div>
      )}

      {err && <div className="mb-6 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">{err}</div>}
      {p.cost.notice && <div className="mb-6 text-sm text-slate-500">{p.cost.notice}</div>}

      <section>
        <h2 className="text-lg font-medium text-slate-900">What you saw</h2>
        <p className="mb-4 mt-1 text-sm text-slate-500">
          The clip, the comment, the story going around. I can&apos;t see what&apos;s trending on my
          own, so this is where it comes in.
        </p>
        <textarea
          value={src} onChange={(e) => setSrc(e.target.value)} rows={5}
          placeholder="Paste the comment, the quote, the caption, whatever you saw…"
          className="w-full rounded-lg border border-slate-300 p-3 text-[15px] leading-relaxed"
        />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link, if you have one"
          className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="And your thought about it"
          className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm" />
        <input value={offer} onChange={(e) => setOffer(e.target.value)}
          placeholder="Pointing them anywhere? Leave it empty and it just ends."
          className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm" />

        <div className="mt-5 space-y-3">
          {AXES.map((axis) => {
            const current = p!.conversation.brief?.[axis.key] ?? "";
            return (
              <div key={axis.key} className="flex flex-wrap items-baseline gap-2">
                <span className="w-24 shrink-0 text-xs uppercase tracking-wide text-slate-400">{axis.label}</span>
                {axis.options.map((o) => {
                  const on = current === o.value;
                  return (
                    <button key={o.value || "any"} disabled={busy !== null}
                      className={`rounded-full border px-3 py-1 text-sm transition disabled:opacity-40 ${on
                        ? "border-slate-800 bg-slate-800 text-white"
                        : "border-slate-300 text-slate-600 hover:border-slate-500"}`}
                      onClick={() => void post({ action: "source", [axis.key]: o.value }, axis.key)}>
                      {o.label}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:border-slate-500"
            disabled={busy !== null}
            onClick={() => void post({ action: "source", source_text: src, source_url: url, topic: note, offer }, "source")}>
            {busy === "source" ? "Saving…" : "Save"}
          </button>
          <button
            className="rounded bg-slate-900 px-4 py-1.5 text-sm text-white disabled:opacity-40"
            disabled={busy !== null}
            onClick={() => void post({ action: "run", stage: "variations" }, "variations")}>
            {busy === "variations" ? "Writing…" : p.variations.length ? "Three more" : "Write it three ways"}
          </button>
          {!p.rehearsal && (
            <button className="text-sm text-slate-400 underline hover:text-slate-700"
              disabled={busy !== null}
              onClick={() => void post({ action: "rehearsal", on: true }, "rehearsal")}>
              Just testing the buttons
            </button>
          )}
        </div>
      </section>

      {p.variations.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-1 text-lg font-medium text-slate-900">Three ways in</h2>
          <p className="mb-5 text-sm text-slate-500">Same point in all three. Take the one you&apos;d actually say.</p>

          <div className="space-y-4">
            {p.variations.map((v) => {
              const on = v.selected;
              return (
                <div key={v.id}
                  className={`rounded-lg border p-5 transition ${on
                    ? "border-slate-800 bg-slate-50"
                    : "border-slate-200 hover:border-slate-400 cursor-pointer"}`}
                  onClick={() => { if (!on && editing !== v.id) void post({ action: "choose", option_id: v.id }, v.id); }}>

                  <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-400">
                    {v.technique && <span className="text-slate-600">{v.technique}</span>}
                    {v.format && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
                      {FORMAT_LABEL[v.format] ?? v.format}</span>}
                    {v.seconds_est && <span>{v.seconds_est}s</span>}
                    {v.edited_by_owner && <span className="text-slate-500">your wording</span>}
                    <span className="flex-1" />
                    {on && <span className="text-slate-700">chosen</span>}
                  </div>

                  {editing === v.id ? (
                    <div onClick={(e) => e.stopPropagation()}>
                      <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={16}
                        className="w-full rounded border border-slate-300 p-3 text-[15px] leading-relaxed" />
                      <div className="mt-2 flex gap-3 text-sm">
                        <button className="text-slate-800 underline"
                          onClick={async () => { await post({ action: "edit", option_id: v.id, content: draft }, v.id); setEditing(null); }}>
                          Save
                        </button>
                        <button className="text-slate-500" onClick={() => setEditing(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {v.why && <p className="mb-3 text-sm text-slate-500">{v.why}</p>}
                      <p className="whitespace-pre-wrap text-[15px] leading-[1.75] text-slate-900">{v.content}</p>
                      <div className="mt-3 flex gap-4 text-xs text-slate-400">
                        <button className="hover:text-slate-700"
                          onClick={(e) => { e.stopPropagation(); setEditing(v.id); setDraft(v.content); }}>
                          Rewrite it
                        </button>
                        <button className="hover:text-slate-700"
                          onClick={(e) => { e.stopPropagation(); void navigator.clipboard.writeText(v.content); }}>
                          Copy
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {chosen && p.script && (
        <section className="mt-12 border-t border-slate-200 pt-8">
          <div className="mb-4 flex items-baseline gap-3">
            <h2 className="text-lg font-medium text-slate-900">Ready to shoot</h2>
            <span className="flex-1" />
            <button className="text-sm text-slate-500 underline hover:text-slate-800"
              onClick={() => void navigator.clipboard.writeText(p.script!.script)}>Copy</button>
          </div>

          <div className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-5 text-[16px] leading-[1.8] text-slate-900">
            {p.script.script}
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
            {p.script.hook_format && p.script.hook_format !== "to_camera" && (
              <span>Shoot as a {FORMAT_LABEL[p.script.hook_format] ?? p.script.hook_format}</span>
            )}
            {p.script.seconds_est && <span>about {p.script.seconds_est}s</span>}
            <span className="flex-1" />
            {p.can_tighten && (
              <button className="rounded border border-slate-300 px-3 py-1 text-slate-700 hover:border-slate-500 disabled:opacity-40"
                disabled={busy !== null}
                onClick={() => void post({ action: "run", stage: "tighten" }, "tighten")}>
                {busy === "tighten" ? "Cutting…" : "Tighten it"}
              </button>
            )}
          </div>

          {p.script.cut_notes && (
            <p className="mt-3 text-sm text-slate-500">Cut: {p.script.cut_notes}</p>
          )}

          {concerns.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm text-slate-500">
              {concerns.map((c) => <li key={c}>• {c}</li>)}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
