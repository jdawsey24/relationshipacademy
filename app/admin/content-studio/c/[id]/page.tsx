"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

// The conversational workspace.
//
// The framework does a great deal of work behind this screen — retrieval,
// phase and domain validation, grading, source-approval state — and none of it
// appears. What appears is a conversation, and a collapsed summary of what has
// been decided, in plain language.

interface Message { id: string; role: string; content: string; kind: string }
interface Decided { label: string; value: string; field: string }
interface Lens { id: string; summary: string; status: string; notice: string | null }
interface Payload {
  conversation: { id: string; title: string | null };
  messages: Message[];
  decided: Decided[];
  provenance: string;
  suggestions: { field: string; suggested_value: string; rationale: string | null }[];
  lenses: Lens[];
  provisional_notice: string | null;
  cost_notice: string | null;
  may_proceed: boolean;
}

export default function Workspace() {
  const { id } = useParams<{ id: string }>();
  const [d, setD] = useState<Payload | null>(null);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const r = await fetch(`/api/admin/content-studio/conversations/${id}`);
    if (r.ok) setD(await r.json());
  }, [id]);
  useEffect(() => { void load(); }, [load]);

  async function send() {
    if (!text.trim()) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/content-studio/conversations/${id}/messages`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      setText("");
      await load();
    } finally { setBusy(false); }
  }

  if (!d) return <div className="mx-auto max-w-3xl px-6 py-16 text-sm text-slate-500">Loading…</div>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <header className="mb-8 flex items-baseline gap-3 text-sm">
        <a href="/admin/content-studio" className="text-slate-500 hover:text-slate-800">← Content Studio</a>
        <span className="flex-1" />
        <span className="text-slate-500">{d.conversation.title ?? "Untitled"}</span>
      </header>

      <div className="space-y-6">
        {d.messages.map((m) => (
          <div key={m.id}
               className={m.role === "owner"
                 ? "border-l-2 border-slate-300 pl-4 text-slate-800"
                 : "text-slate-800"}>
            <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
          </div>
        ))}

        {/* One notice, only when the direction rests on working material. */}
        {d.provisional_notice && (
          <p className="border-l-2 border-amber-400 pl-4 text-sm text-slate-600">
            {d.provisional_notice}{" "}
            <a href={`/admin/content-studio/c/${id}/advanced`} className="underline underline-offset-2">details</a>
          </p>
        )}

        {d.cost_notice && (
          <p className="border-l-2 border-slate-300 pl-4 text-sm text-slate-500">{d.cost_notice}</p>
        )}
      </div>

      <div className="mt-8">
        <textarea
          value={text} onChange={(e) => setText(e.target.value)} rows={3}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void send(); }}
          placeholder={d.may_proceed ? "Type…" : "Say the word and I'll carry on."}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
        />
        <div className="mt-2 flex justify-end">
          <button onClick={send} disabled={!text.trim() || busy}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40">
            {busy ? "…" : "Send"}
          </button>
        </div>
      </div>

      {/* What we've decided — collapsed by default */}
      <section className="mt-10 border-t border-slate-200 pt-4">
        <button onClick={() => setOpen(!open)}
          className="flex w-full items-baseline gap-2 text-left text-sm text-slate-600 hover:text-slate-900">
          <span>{open ? "▾" : "▸"} What we&rsquo;ve decided</span>
          <span className="flex-1" />
          <span className="text-slate-400">{d.decided.length} {d.decided.length === 1 ? "thing" : "things"}</span>
        </button>

        {open && (
          <div className="mt-4 space-y-4">
            {d.decided.length === 0 ? (
              <p className="text-sm text-slate-500">Nothing settled yet.</p>
            ) : d.decided.map((x) => (
              <div key={x.field}>
                <p className="text-xs uppercase tracking-wide text-slate-500">{x.label}</p>
                <p className="mt-0.5 text-slate-800">{x.value}</p>
              </div>
            ))}

            {d.suggestions.map((s) => (
              <div key={s.field} className="rounded border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-sm text-slate-700">Want to change it to: &ldquo;{s.suggested_value}&rdquo;?</p>
                <div className="mt-2 flex gap-2">
                  <button className="rounded border border-slate-300 px-2.5 py-1 text-xs">Use it</button>
                  <button className="rounded border border-slate-300 px-2.5 py-1 text-xs text-slate-500">Leave mine</button>
                </div>
              </div>
            ))}

            {d.provenance && <p className="text-xs text-slate-500">{d.provenance}</p>}
            <p className="text-xs text-slate-500">
              No approved voice rules yet — I&rsquo;m writing plainly until you set them.
            </p>
            <a href={`/admin/content-studio/c/${id}/advanced`}
               className="inline-block text-xs text-slate-500 underline underline-offset-2">
              Full brief and sources
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
