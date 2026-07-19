"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CompanionChrome from "@/components/companion/CompanionChrome";

interface Card { id: string; slug: string; title: string; short_description: string | null; est_minutes: number | null; mode: string; universal: boolean }
type Mode = "all" | "guided" | "free" | "short";

export default function CompanionProcess() {
  const [cards, setCards] = useState<Card[] | null>(null);
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<Mode>("all");

  useEffect(() => { fetch("/api/companion/experiences?view=process").then((r) => r.ok ? r.json() : null).then((d) => setCards(d?.cards ?? [])).catch(() => {}); }, []);

  const filtered = useMemo(() => {
    if (!cards) return [];
    const t = q.trim().toLowerCase();
    return cards.filter((c) => {
      if (t && !(c.title.toLowerCase().includes(t) || (c.short_description ?? "").toLowerCase().includes(t))) return false;
      if (mode === "guided" && c.mode !== "guided") return false;
      if (mode === "free" && c.mode !== "free") return false;
      if (mode === "short" && !(c.est_minutes != null && c.est_minutes <= 10)) return false;
      return true;
    });
  }, [cards, q, mode]);

  const FILTERS: { key: Mode; label: string }[] = [
    { key: "all", label: "All" }, { key: "guided", label: "Guided" }, { key: "free", label: "Free reflection" }, { key: "short", label: "Under 10 min" },
  ];

  return (
    <CompanionChrome active="process">
      <h1 className="font-display text-2xl font-semibold text-midnight-navy">Process</h1>
      <p className="mt-1 font-body text-sm text-charcoal/60">Guided experiences for what you&apos;re working through.</p>

      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search"
        className="mt-4 w-full rounded-xl border border-light-gray bg-white px-4 py-2.5 font-body text-sm focus:border-midnight-navy/40 focus:outline-none" />
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setMode(f.key)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 font-ui text-xs ${mode === f.key ? "bg-midnight-navy text-white" : "border border-light-gray bg-white text-charcoal/65"}`}>{f.label}</button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {cards === null ? <p className="font-body text-sm text-charcoal/50">Loading…</p> :
          filtered.length === 0 ? <p className="rounded-2xl border border-dashed border-light-gray bg-white/60 p-6 text-center font-body text-sm text-charcoal/50">No experiences match.</p> :
          filtered.map((c) => (
            <Link key={c.id} href={`/companion/process/${c.slug}`} className="block rounded-2xl border border-light-gray bg-white p-4 transition-colors hover:border-midnight-navy/40">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-lg font-semibold text-midnight-navy">{c.title}</p>
                {c.universal && <span className="shrink-0 rounded-full bg-warm-ivory px-2 py-0.5 font-ui text-[10px] uppercase tracking-wide text-charcoal/45">All</span>}
              </div>
              {c.short_description && <p className="mt-0.5 font-body text-sm leading-relaxed text-charcoal/65">{c.short_description}</p>}
            </Link>
          ))}
      </div>
    </CompanionChrome>
  );
}
