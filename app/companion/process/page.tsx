"use client";

import { useCallback, useEffect, useState } from "react";
import CompanionChrome from "@/components/companion/CompanionChrome";
import SituationCard from "@/components/companion/SituationCard";
import CategoryGlyph from "@/components/companion/CategoryGlyph";
import { categoryMeta, tint } from "@/lib/companion/categoryMeta";

interface Situation { situation_id: string; title: string; user_need: string | null; category_id: string | null }
interface Group { category_id: string; name: string; situations: Situation[] }

export default function CompanionProcess() {
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [results, setResults] = useState<Situation[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => { fetch("/api/companion/situations?view=process").then((r) => r.ok ? r.json() : null).then((d) => setGroups(d?.groups ?? [])).catch(() => {}); }, []);

  const runSearch = useCallback(async (text: string) => {
    if (!text.trim()) { setResults(null); return; }
    const r = await fetch(`/api/companion/situations?q=${encodeURIComponent(text)}`);
    if (r.ok) setResults((await r.json()).results);
  }, []);
  useEffect(() => { const t = setTimeout(() => runSearch(q), 250); return () => clearTimeout(t); }, [q, runSearch]);

  return (
    <CompanionChrome active="process">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Process</p>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-midnight-navy">Find your moment</h1>
      <p className="mt-1 font-body text-sm text-charcoal/60">What are you working through right now?</p>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-light-gray bg-white px-4 py-2.5 text-charcoal/40 focus-within:border-midnight-navy/40">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search situations"
          className="w-full bg-transparent font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none" />
      </div>

      {results !== null ? (
        <div className="mt-4 space-y-2.5">
          {results.length === 0 ? <p className="rounded-2xl border border-dashed border-light-gray bg-white/60 p-6 text-center font-body text-sm text-charcoal/50">No situations match.</p>
            : results.map((s) => <SituationCard key={s.situation_id} id={s.situation_id} title={s.title} need={s.user_need} categoryId={s.category_id} />)}
        </div>
      ) : groups === null ? (
        <p className="mt-4 font-body text-sm text-charcoal/50">Loading…</p>
      ) : groups.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-light-gray bg-white/60 p-6 text-center font-body text-sm text-charcoal/50">Nothing here yet for where you are right now.</p>
      ) : (
        <div className="mt-6 space-y-7">
          {groups.map((g) => {
            const { accent } = categoryMeta(g.category_id);
            return (
              <section key={g.category_id}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: tint(accent, 0.13), color: accent }}>
                    <CategoryGlyph categoryId={g.category_id} size={16} />
                  </span>
                  <h2 className="font-display text-xl font-semibold text-midnight-navy">{g.name}</h2>
                  <span className="ml-auto font-ui text-[11px] font-medium text-charcoal/40">{g.situations.length}</span>
                </div>
                <div className="mt-2.5 h-px bg-light-gray" />
                <div className="mt-3 space-y-2.5">
                  {g.situations.map((s) => <SituationCard key={s.situation_id} id={s.situation_id} title={s.title} need={s.user_need} categoryId={g.category_id} />)}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </CompanionChrome>
  );
}
