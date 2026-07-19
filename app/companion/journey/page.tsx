"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import CompanionChrome from "@/components/companion/CompanionChrome";

interface Entry { id: string; title: string | null; status: string; entry_type: string; updated_at: string; favorite: boolean; tags: string[] }
type Filter = "all" | "draft" | "complete" | "favorite";

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
      <h1 className="font-display text-2xl font-semibold text-midnight-navy">Journey</h1>
      <p className="mt-1 font-body text-sm text-charcoal/60">Everything you&apos;ve saved, in one private place.</p>

      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search"
        className="mt-4 w-full rounded-xl border border-light-gray bg-white px-4 py-2.5 font-body text-sm focus:border-midnight-navy/40 focus:outline-none" />
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 font-ui text-xs ${filter === f.key ? "bg-midnight-navy text-white" : "border border-light-gray bg-white text-charcoal/65"}`}>{f.label}</button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {entries === null ? <p className="font-body text-sm text-charcoal/50">Loading…</p> :
          entries.length === 0 ? <p className="rounded-2xl border border-dashed border-light-gray bg-white/60 p-6 text-center font-body text-sm text-charcoal/50">Nothing here yet.</p> :
          entries.map((e) => (
            <div key={e.id} className="rounded-2xl border border-light-gray bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/companion/journey/${e.id}`} className="flex-1">
                  <p className="font-display font-semibold text-midnight-navy">{e.title ?? "Reflection"}</p>
                  <p className="mt-0.5 font-ui text-xs text-charcoal/45">{e.status} · {new Date(e.updated_at).toLocaleString()}</p>
                  {e.tags.length > 0 && <div className="mt-1.5 flex flex-wrap gap-1">{e.tags.map((t) => <span key={t} className="rounded-full bg-warm-ivory px-2 py-0.5 font-ui text-[10px] text-charcoal/50">{t}</span>)}</div>}
                </Link>
                <button onClick={() => toggleFav(e)} aria-label="Favorite" className={`text-lg ${e.favorite ? "text-coral-rose" : "text-charcoal/25"}`}>♥</button>
              </div>
            </div>
          ))}
      </div>
    </CompanionChrome>
  );
}
