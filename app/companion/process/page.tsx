"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import CompanionChrome from "@/components/companion/CompanionChrome";

interface Situation { situation_id: string; title: string; user_need: string | null }
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
      <h1 className="font-display text-2xl font-semibold text-midnight-navy">Process</h1>
      <p className="mt-1 font-body text-sm text-charcoal/60">Find the moment that fits what you&apos;re working through.</p>

      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search situations"
        className="mt-4 w-full rounded-xl border border-light-gray bg-white px-4 py-2.5 font-body text-sm focus:border-midnight-navy/40 focus:outline-none" />

      {results !== null ? (
        <div className="mt-4 space-y-2.5">
          {results.length === 0 ? <p className="rounded-2xl border border-dashed border-light-gray bg-white/60 p-6 text-center font-body text-sm text-charcoal/50">No situations match.</p>
            : results.map((s) => <SituationCard key={s.situation_id} s={s} />)}
        </div>
      ) : groups === null ? (
        <p className="mt-4 font-body text-sm text-charcoal/50">Loading…</p>
      ) : groups.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-light-gray bg-white/60 p-6 text-center font-body text-sm text-charcoal/50">No situations published yet.</p>
      ) : (
        <div className="mt-5 space-y-6">
          {groups.map((g) => (
            <section key={g.category_id}>
              <p className="font-ui text-[11px] font-semibold uppercase tracking-wide text-charcoal/45">{g.name}</p>
              <div className="mt-2 space-y-2.5">{g.situations.map((s) => <SituationCard key={s.situation_id} s={s} />)}</div>
            </section>
          ))}
        </div>
      )}
    </CompanionChrome>
  );
}

function SituationCard({ s }: { s: Situation }) {
  return (
    <Link href={`/companion/situations/${s.situation_id}`} className="block rounded-2xl border border-light-gray bg-white p-4 transition-colors hover:border-midnight-navy/40">
      <p className="font-display text-lg font-semibold text-midnight-navy">{s.title}</p>
      {s.user_need && <p className="mt-0.5 font-body text-sm leading-relaxed text-charcoal/65">{s.user_need}</p>}
    </Link>
  );
}
