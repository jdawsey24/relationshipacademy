"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import CompanionChrome from "@/components/companion/CompanionChrome";

interface Entry { id: string; title: string | null; status: string; entry_type: string; updated_at: string; favorite: boolean; tags: string[] }
type Filter = "all" | "draft" | "complete" | "favorite";

function Glyph({ paths, size = 20 }: { paths: string[]; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

const typeIcon = (t: string): string[] =>
  /plan|convers/i.test(t) ? ["M4 5h16v10H9l-4 4V5z"] : ["M5 4h11l4 4v12H5z", "M9 10h6", "M9 14h4"];

function StatusPill({ status }: { status: string }) {
  const done = /complete|published/i.test(status);
  const c = done ? "#5F9E7C" : "#C09A52";
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 font-ui text-[10px] font-semibold uppercase tracking-wide"
      style={{ backgroundColor: `${c}22`, color: c }}>{done ? "Complete" : "In progress"}</span>
  );
}

export default function CompanionJourney() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const load = useCallback(async () => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (filter === "draft") p.set("status", "draft");
    if (filter === "complete") p.set("status", "complete");
    if (filter === "favorite") p.set("favorite", "1");
    const r = await fetch(`/api/companion/journey?${p}`);
    if (r.ok) setEntries((await r.json()).entries);
  }, [q, filter]);
  useEffect(() => { const t = setTimeout(load, 200); return () => clearTimeout(t); }, [load]);

  async function toggleFav(e: Entry) {
    await fetch(`/api/companion/journey/${e.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ favorite: !e.favorite }) });
    load();
  }

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "all", label: "All" }, { key: "draft", label: "Unfinished" }, { key: "complete", label: "Complete" }, { key: "favorite", label: "Favorites" },
  ];

  return (
    <CompanionChrome active="journey">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Journey</p>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-midnight-navy">Your journey</h1>
      <p className="mt-1 font-body text-sm text-charcoal/60">Everything you&apos;ve saved, in one private place.</p>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-light-gray bg-white px-4 py-2.5 text-charcoal/40 focus-within:border-midnight-navy/40">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your reflections"
          className="w-full bg-transparent font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none" />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 font-ui text-xs transition-colors ${filter === f.key ? "bg-midnight-navy text-white" : "border border-light-gray bg-white text-charcoal/65 hover:border-midnight-navy/30"}`}>{f.label}</button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {entries === null ? <p className="font-body text-sm text-charcoal/50">Loading…</p> :
          entries.length === 0 ? <p className="rounded-2xl border border-dashed border-light-gray bg-white/60 p-6 text-center font-body text-sm text-charcoal/50">Nothing here yet.</p> :
          entries.map((e) => (
            <div key={e.id} className="group flex items-start gap-3.5 rounded-2xl border border-light-gray/70 bg-white p-3.5 transition-all hover:border-midnight-navy/25 hover:shadow-[0_3px_18px_rgba(28,53,87,0.07)]">
              <Link href={`/companion/journey/${e.id}`} className="flex min-w-0 flex-1 items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-midnight-navy/[0.06] text-midnight-navy/65"><Glyph paths={typeIcon(e.entry_type)} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-lg font-semibold leading-tight text-midnight-navy">{e.title ?? "Reflection"}</span>
                  <span className="mt-1 flex items-center gap-2">
                    <StatusPill status={e.status} />
                    <span className="font-ui text-xs text-charcoal/40">{new Date(e.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                  </span>
                  {e.tags.length > 0 && <span className="mt-1.5 flex flex-wrap gap-1">{e.tags.map((t) => <span key={t} className="rounded-full bg-warm-ivory px-2 py-0.5 font-ui text-[10px] text-charcoal/50">{t}</span>)}</span>}
                </span>
              </Link>
              <button onClick={() => toggleFav(e)} aria-label={e.favorite ? "Remove from favorites" : "Add to favorites"}
                className={`shrink-0 p-1 transition-colors ${e.favorite ? "text-coral-rose" : "text-charcoal/25 hover:text-coral-rose/60"}`}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill={e.favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.6-9.4-8A4.9 4.9 0 0 1 12 6.8a4.9 4.9 0 0 1 9.4 6.2C19 16.4 12 21 12 21z" /></svg>
              </button>
            </div>
          ))}
      </div>
    </CompanionChrome>
  );
}
