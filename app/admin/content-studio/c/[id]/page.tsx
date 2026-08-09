"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AXES } from "@/lib/contentStudio/directions";
import { PLATFORMS } from "@/lib/contentStudio/platforms";

// Building a piece.
//
// Three steps, and each appears only once the one before it has an answer.
//
//   1. What you're thinking about.
//   2. Here's what I think you're saying, and three ways it could go.
//   3. Once a direction is chosen: where it's going, how you want it, write it.
//
// Every control used to be on screen from the start, which asked her to specify
// a piece before anything had established what the piece was about. Shape and
// tone modify an argument. With no argument yet, they modify nothing.

interface Option {
  id: string; stage: string; technique: string | null; format: string | null;
  content: string; why: string | null; selected: boolean; edited_by_owner: boolean;
  seconds_est: number | null;
}
interface Keyword {
  primary_phrase: string; audience_doorway: string | null;
  best_format: string | null; cta_fit: string | null;
}
interface Script {
  id: string | null; script: string; hook_format: string | null;
  seconds_est: number | null; cut_notes: string | null;
  review: { concerns?: string[] } & Record<string, unknown>;
}
interface Project {
  conversation: {
    id: string; source_text: string | null; source_url: string | null;
    topic: string | null; brief: Record<string, string | undefined>;
  };
  rehearsal: boolean;
  readback: string | null;
  directions: Option[];
  controls_open: boolean;
  variations: Option[];
  keywords: Keyword[];
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
  const [readback, setReadback] = useState("");
  const [editingRead, setEditingRead] = useState(false);
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
    setReadback(d.readback ?? "");
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

  const platform = p.conversation.brief?.platform ?? "";
  const keyword = p.conversation.brief?.keyword ?? "";
  const concerns = p.script?.review?.concerns ?? [];
  const spoken = PLATFORMS.find((x) => x.value === platform)?.delivery !== "written";

  const chip = (on: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition disabled:opacity-40 ${on
      ? "border-slate-800 bg-slate-800 text-white"
      : "border-slate-300 text-slate-600 hover:border-slate-500"}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <header className="mb-8 flex items-baseline gap-3 text-sm">
        <a href="/admin/content-studio" className="text-slate-500 hover:text-slate-800">← Content Studio</a>
        <span className="flex-1" />
        <span className="text-slate-400">${p.cost.spent.toFixed(2)}</span>
      </header>

      {p.rehearsal && (
        <div className="mb-6 flex items-center gap-3 rounded border border-sky-300 bg-sky-50 p-3 text-sm text-sky-900">
          <span className="flex-1">Rehearsal. Nothing is being written now, it&apos;s replaying earlier runs, and it costs nothing.</span>
          <button className="underline" disabled={busy !== null}
            onClick={() => void post({ action: "rehearsal", on: false }, "rehearsal")}>Write for real</button>
        </div>
      )}

      {err && <div className="mb-6 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">{err}</div>}
      {p.cost.notice && <div className="mb-6 text-sm text-slate-500">{p.cost.notice}</div>}

      {/* 1 — the idea */}
      <section>
        <h2 className="text-lg font-medium text-slate-900">What you&apos;re thinking about</h2>
        <p className="mb-4 mt-1 text-sm text-slate-500">
          Your thought, and the clip or comment if there is one. I can&apos;t see what&apos;s trending
          on my own, so that part has to come from you.
        </p>
        <input value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full rounded-lg border border-slate-300 p-3 text-[15px]" />
        <textarea value={src} onChange={(e) => setSrc(e.target.value)} rows={4}
          placeholder="Paste the comment, the quote, the caption, whatever you saw…"
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-[15px] leading-relaxed" />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link, if you have one"
          className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm" />

        <div className="mt-3 flex items-center gap-3">
          <button className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:border-slate-500"
            disabled={busy !== null}
            onClick={() => void post({ action: "source", source_text: src, source_url: url, topic: note }, "source")}>
            {busy === "source" ? "Saving…" : "Save"}
          </button>
          <button className="rounded bg-slate-900 px-4 py-1.5 text-sm text-white disabled:opacity-40"
            disabled={busy !== null}
            onClick={() => void post({ action: "run", stage: "read" }, "read")}>
            {busy === "read" ? "Reading…" : p.readback ? "Read it again" : "What am I saying?"}
          </button>
          {!p.rehearsal && !p.readback && (
            <button className="text-sm text-slate-400 underline hover:text-slate-700" disabled={busy !== null}
              onClick={() => void post({ action: "rehearsal", on: true }, "rehearsal")}>
              Just testing the buttons
            </button>
          )}
        </div>
      </section>

      {/* 2 — the readback, then three directions */}
      {p.readback && (
        <section className="mt-12">
          <h2 className="text-lg font-medium text-slate-900">Here&apos;s what I think you&apos;re saying</h2>

          {editingRead ? (
            <div className="mt-3">
              <textarea value={readback} onChange={(e) => setReadback(e.target.value)} rows={4}
                className="w-full rounded-lg border border-slate-300 p-3 text-[15px] leading-relaxed" />
              <div className="mt-2 flex gap-3 text-sm">
                <button className="text-slate-800 underline"
                  onClick={async () => { await post({ action: "source", readback }, "readback"); setEditingRead(false); }}>
                  That&apos;s it
                </button>
                <button className="text-slate-500"
                  onClick={() => { setReadback(p.readback ?? ""); setEditingRead(false); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-3 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-[15px] leading-relaxed text-slate-900">
                {p.readback}
              </p>
              <button className="mt-2 text-xs text-slate-400 hover:text-slate-700"
                onClick={() => setEditingRead(true)}>Not quite — let me fix it</button>
            </>
          )}

          {p.directions.length > 0 && (
            <>
              <h3 className="mb-1 mt-8 text-sm uppercase tracking-wide text-slate-400">Three ways this could go</h3>
              <p className="mb-4 text-sm text-slate-500">Pick one and I&apos;ll show you the rest.</p>
              <div className="space-y-3">
                {p.directions.map((d) => {
                  const on = d.selected;
                  return (
                    <div key={d.id}
                      className={`rounded-lg border p-4 transition ${on
                        ? "border-slate-800 bg-slate-50"
                        : "border-slate-200 hover:border-slate-400 cursor-pointer"}`}
                      onClick={() => { if (!on) void post({ action: "choose", option_id: d.id }, d.id); }}>
                      <div className="mb-2 flex items-baseline gap-2">
                        <span className="text-sm font-medium text-slate-900">{d.technique}</span>
                        <span className="flex-1" />
                        {on && <span className="text-[11px] uppercase tracking-wide text-slate-600">chosen</span>}
                      </div>
                      <p className="text-[15px] leading-relaxed text-slate-800">{d.content}</p>
                      {d.why && <p className="mt-2 text-sm text-slate-500">{d.why}</p>}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      )}

      {/* 3 — only once there is something for these to modify */}
      {p.controls_open && (
        <section className="mt-12 border-t border-slate-200 pt-8">
          <h2 className="text-lg font-medium text-slate-900">Where it&apos;s going</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {PLATFORMS.map((x) => {
              const on = platform === x.value;
              return (
                <button key={x.value} disabled={busy !== null} title={x.note} className={chip(on)}
                  onClick={() => void post({ action: "source", platform: on ? "" : x.value }, x.value)}>
                  {x.label}
                </button>
              );
            })}
          </div>
          {platform && (
            <p className="mt-2 text-sm text-slate-500">
              {PLATFORMS.find((x) => x.value === platform)?.note}
              {!spoken && ". Written, so no shoot instructions."}
            </p>
          )}

          {p.keywords.length > 0 && (
            <>
              <h3 className="mb-2 mt-6 text-sm uppercase tracking-wide text-slate-400">Phrases that work there</h3>
              <div className="space-y-2">
                {p.keywords.map((k) => {
                  const on = keyword === k.primary_phrase;
                  return (
                    <button key={k.primary_phrase} disabled={busy !== null}
                      className={`block w-full rounded-lg border p-3 text-left transition disabled:opacity-40 ${on
                        ? "border-slate-800 bg-slate-50"
                        : "border-slate-200 hover:border-slate-400"}`}
                      onClick={() => void post({ action: "source", keyword: on ? "" : k.primary_phrase }, k.primary_phrase)}>
                      <span className="text-[15px] text-slate-900">{k.primary_phrase}</span>
                      {k.audience_doorway && <span className="block text-sm text-slate-500">{k.audience_doorway}</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <h2 className="mt-10 text-lg font-medium text-slate-900">How you want it</h2>
          <div className="mt-3 space-y-3">
            {AXES.map((axis) => {
              const current = p.conversation.brief?.[axis.key] ?? "";
              return (
                <div key={axis.key} className="flex flex-wrap items-baseline gap-2">
                  <span className="w-24 shrink-0 text-xs uppercase tracking-wide text-slate-400">{axis.label}</span>
                  {axis.options.map((o) => (
                    <button key={o.value || "any"} disabled={busy !== null} className={chip(current === o.value)}
                      onClick={() => void post({ action: "source", [axis.key]: o.value }, axis.key)}>
                      {o.label}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>

          <input value={offer} onChange={(e) => setOffer(e.target.value)}
            placeholder="Pointing them anywhere? Leave it empty and it just ends."
            className="mt-5 w-full rounded-lg border border-slate-300 p-2 text-sm"
            onBlur={() => void post({ action: "source", offer }, "offer")} />

          <button className="mt-5 rounded bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-40"
            disabled={busy !== null}
            onClick={() => void post({ action: "run", stage: "variations" }, "variations")}>
            {busy === "variations" ? "Writing…" : p.variations.length ? "Three more" : "Write it three ways"}
          </button>
        </section>
      )}

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
                    {spoken && v.format && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
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
                          onClick={(e) => { e.stopPropagation(); setEditing(v.id); setDraft(v.content); }}>Rewrite it</button>
                        <button className="hover:text-slate-700"
                          onClick={(e) => { e.stopPropagation(); void navigator.clipboard.writeText(v.content); }}>Copy</button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {p.script && p.variations.some((v) => v.selected) && (
        <section className="mt-12 border-t border-slate-200 pt-8">
          <div className="mb-4 flex items-baseline gap-3">
            <h2 className="text-lg font-medium text-slate-900">{spoken ? "Ready to shoot" : "Ready to post"}</h2>
            <span className="flex-1" />
            <button className="text-sm text-slate-500 underline hover:text-slate-800"
              onClick={() => void navigator.clipboard.writeText(p.script!.script)}>Copy</button>
          </div>
          <div className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-5 text-[16px] leading-[1.8] text-slate-900">
            {p.script.script}
          </div>
          <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
            {spoken && p.script.hook_format && p.script.hook_format !== "to_camera" && (
              <span>Shoot as a {FORMAT_LABEL[p.script.hook_format] ?? p.script.hook_format}</span>
            )}
            {spoken && p.script.seconds_est && <span>about {p.script.seconds_est}s</span>}
            <span className="flex-1" />
            {p.can_tighten && (
              <button className="rounded border border-slate-300 px-3 py-1 text-slate-700 hover:border-slate-500 disabled:opacity-40"
                disabled={busy !== null}
                onClick={() => void post({ action: "run", stage: "tighten" }, "tighten")}>
                {busy === "tighten" ? "Cutting…" : "Tighten it"}
              </button>
            )}
          </div>
          {p.script.cut_notes && <p className="mt-3 text-sm text-slate-500">Cut: {p.script.cut_notes}</p>}
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
