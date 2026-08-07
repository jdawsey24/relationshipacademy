"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Content Studio home.
//
// One question, one input. There is deliberately no choice of workflow before
// you have started thinking — whether a thought is rough or already formed is
// something the conversation works out, not something you declare.

interface Conversation {
  id: string; title: string | null; status: string; entry_path: string; updated_at: string;
}

const ago = (iso: string) => {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  return d <= 0 ? "today" : d === 1 ? "yesterday" : `${d} days ago`;
};

export default function ContentStudioHome() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [recent, setRecent] = useState<Conversation[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/content-studio/conversations");
    if (r.ok) setRecent((await r.json()).conversations ?? []);
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function start() {
    if (!text.trim()) return;
    setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/admin/content-studio/conversations", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const j = await r.json();
      if (!r.ok) { setErr(j.error ?? "Could not start."); return; }
      router.push(`/admin/content-studio/c/${j.conversation_id}`);
    } finally { setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-center text-3xl font-semibold text-slate-900">
        What are we thinking about?
      </h1>

      {err && (
        <p className="mt-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">{err}</p>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void start(); }}
        rows={5}
        placeholder="A thought, something you saw, a post that annoyed you, a question a client asked…"
        className="mt-8 w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
      />

      <div className="mt-3 flex items-center gap-3">
        <span className="text-sm text-slate-400">attach · link · dictate</span>
        <span className="flex-1" />
        <button
          onClick={start}
          disabled={!text.trim() || busy}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        >
          {busy ? "Starting…" : "Start"}
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        or{" "}
        <a href="/admin/content-studio/opportunities" className="underline underline-offset-2 hover:text-slate-800">
          see what people are talking about
        </a>
      </p>

      {recent.length > 0 && (
        <section className="mt-14 border-t border-slate-200 pt-6">
          <h2 className="text-xs uppercase tracking-wide text-slate-500">Recent</h2>
          <ul className="mt-3 space-y-2">
            {recent.slice(0, 6).map((c) => (
              <li key={c.id}>
                <a href={`/admin/content-studio/c/${c.id}`}
                   className="flex items-baseline gap-3 text-sm text-slate-700 hover:text-slate-900">
                  <span className="truncate">{c.title ?? "Untitled"}</span>
                  <span className="flex-1 border-b border-dotted border-slate-200" />
                  <span className="shrink-0 text-slate-400">{ago(c.updated_at)}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
