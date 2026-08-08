"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Building a script.
//
// Paste what you saw. Pick a hook. Pick a body. Pick how it lands. That's it.
// Each stage appears when the one before it has a choice in it, so the screen
// is never showing work that isn't hers to do yet.

interface Option {
  id: string; stage: string; technique: string | null; format: string | null;
  content: string; why: string | null; selected: boolean; edited_by_owner: boolean;
}
interface Project {
  conversation: { id: string; source_text: string | null; source_url: string | null; topic: string | null; brief: Record<string, unknown> };
  hooks: Option[]; bodies: Option[]; resolutions: Option[]; ctas: Option[];
  script: { script: string; seconds_est: number | null; hook_format: string | null; review: Record<string, unknown> } | null;
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

  const chosen = (o: Option[]) => o.find((x) => x.selected) ?? null;
  const hook = chosen(p.hooks), body = chosen(p.bodies);
  const resolution = chosen(p.resolutions), cta = chosen(p.ctas);

  function Card({ o, children }: { o: Option; children?: React.ReactNode }) {
    const on = o.selected;
    return (
      <div
        className={`rounded-lg border p-4 transition ${on
          ? "border-slate-800 bg-slate-50"
          : "border-slate-200 hover:border-slate-400 cursor-pointer"}`}
        onClick={() => { if (!on && editing !== o.id) void post({ action: "choose", option_id: o.id }, o.id); }}
      >
        <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-400">
          {o.format && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">{FORMAT_LABEL[o.format] ?? o.format}</span>}
          {o.technique && <span>{o.technique}</span>}
          {o.edited_by_owner && <span className="text-slate-500">your wording</span>}
          <span className="flex-1" />
          {on && <span className="text-slate-700">chosen</span>}
        </div>

        {editing === o.id ? (
          <div onClick={(e) => e.stopPropagation()}>
            <textarea
              value={draft} onChange={(e) => setDraft(e.target.value)} rows={Math.max(3, draft.split("\n").length)}
              className="w-full rounded border border-slate-300 p-2 text-[15px] leading-relaxed"
            />
            <div className="mt-2 flex gap-3 text-sm">
              <button className="text-slate-800 underline"
                onClick={async () => { await post({ action: "edit", option_id: o.id, content: draft }, o.id); setEditing(null); }}>
                Save
              </button>
              <button className="text-slate-500" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-900">{o.content}</p>
            {o.why && <p className="mt-2 text-sm text-slate-500">{o.why}</p>}
            <button
              className="mt-2 text-xs text-slate-400 hover:text-slate-700"
              onClick={(e) => { e.stopPropagation(); setEditing(o.id); setDraft(o.content); }}>
              Rewrite it
            </button>
          </>
        )}
        {children}
      </div>
    );
  }

  function Stage({ title, hint, options, run, label }: {
    title: string; hint?: string; options: Option[]; run: string; label: string;
  }) {
    return (
      <section className="mt-12">
        <div className="mb-4 flex items-baseline gap-3">
          <h2 className="text-lg font-medium text-slate-900">{title}</h2>
          <span className="flex-1" />
          {options.length > 0 && (
            <button className="text-sm text-slate-500 underline hover:text-slate-800"
              disabled={busy !== null}
              onClick={() => void post({ action: "run", stage: run }, run)}>
              {busy === run ? "Working…" : "Try again"}
            </button>
          )}
        </div>
        {hint && <p className="mb-4 text-sm text-slate-500">{hint}</p>}
        {options.length === 0 ? (
          <button
            className="rounded bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-40"
            disabled={busy !== null}
            onClick={() => void post({ action: "run", stage: run }, run)}>
            {busy === run ? "Working…" : label}
          </button>
        ) : (
          <div className="space-y-3">{options.map((o) => <Card key={o.id} o={o} />)}</div>
        )}
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <header className="mb-8 flex items-baseline gap-3 text-sm">
        <a href="/admin/content-studio" className="text-slate-500 hover:text-slate-800">← Content Studio</a>
        <span className="flex-1" />
        <span className="text-slate-400">${p.cost.spent.toFixed(2)}</span>
      </header>

      {err && <div className="mb-6 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">{err}</div>}
      {p.cost.notice && <div className="mb-6 text-sm text-slate-500">{p.cost.notice}</div>}

      <section>
        <h2 className="text-lg font-medium text-slate-900">What you saw</h2>
        <p className="mb-4 mt-1 text-sm text-slate-500">
          The clip, the comment, the story going around. Paste it here. I can&apos;t see what&apos;s
          trending on my own, so this is where it comes in.
        </p>
        <textarea
          value={src} onChange={(e) => setSrc(e.target.value)} rows={5}
          placeholder="Paste the comment, the quote, the caption, whatever you saw…"
          className="w-full rounded-lg border border-slate-300 p-3 text-[15px] leading-relaxed"
        />
        <input
          value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link, if you have one"
          className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm"
        />
        <input
          value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="And your thought about it"
          className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm"
        />
        <button
          className="mt-3 rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:border-slate-500"
          disabled={busy !== null}
          onClick={() => void post({ action: "source", source_text: src, source_url: url, topic: note }, "source")}>
          {busy === "source" ? "Saving…" : "Save"}
        </button>
      </section>

      <Stage title="Hooks" run="hooks" label="Give me hooks" options={p.hooks}
        hint="Pick the one you'd actually say. Rewrite it if it's close but not right." />

      {hook && (
        <Stage title="The body" run="bodies" label="Build the body" options={p.bodies}
          hint="Same lesson, different ways in. Take one whole, or take one and rewrite it." />
      )}

      {hook && body && (
        <>
          <Stage title="How it lands" run="close" label="Give me closes" options={p.resolutions} />
          {p.ctas.length > 0 && (
            <section className="mt-8">
              <h3 className="mb-4 text-sm uppercase tracking-wide text-slate-400">And the CTA</h3>
              <div className="space-y-3">{p.ctas.map((o) => <Card key={o.id} o={o} />)}</div>
            </section>
          )}
        </>
      )}

      {hook && body && resolution && cta && (
        <section className="mt-12 border-t border-slate-200 pt-8">
          <div className="mb-4 flex items-baseline gap-3">
            <h2 className="text-lg font-medium text-slate-900">The script</h2>
            <span className="flex-1" />
            {p.script && (
              <button className="text-sm text-slate-500 underline hover:text-slate-800"
                onClick={() => void navigator.clipboard.writeText(p.script!.script)}>
                Copy
              </button>
            )}
          </div>

          {!p.script ? (
            <button className="rounded bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-40"
              disabled={busy !== null}
              onClick={() => void post({ action: "run", stage: "assemble" }, "assemble")}>
              {busy === "assemble" ? "Working…" : "Put it together"}
            </button>
          ) : (
            <>
              <div className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-5 text-[16px] leading-[1.8] text-slate-900">
                {p.script.script}
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                {p.script.hook_format && p.script.hook_format !== "to_camera" && (
                  <span>Shoot as a {FORMAT_LABEL[p.script.hook_format] ?? p.script.hook_format}</span>
                )}
                {p.script.seconds_est && <span>about {p.script.seconds_est}s</span>}
                <span className="flex-1" />
                <button className="underline hover:text-slate-800" disabled={busy !== null}
                  onClick={() => void post({ action: "run", stage: "assemble" }, "assemble")}>
                  {busy === "assemble" ? "Working…" : "Put it together again"}
                </button>
              </div>
              {Array.isArray(p.script.review?.concerns) && (p.script.review.concerns as string[]).length > 0 && (
                <ul className="mt-4 space-y-1 text-sm text-slate-500">
                  {(p.script.review.concerns as string[]).map((c) => <li key={c}>• {c}</li>)}
                </ul>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}
