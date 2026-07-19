"use client";

import { useEffect, useState } from "react";
import CompanionChrome from "@/components/companion/CompanionChrome";

interface Recent { id: string; title: string | null; status: string; entry_type: string; updated_at: string }

// Phase 2 shows a basic list of saved/started entries; the full Journey (timeline,
// filters, tags, favorites, detail/edit) is Phase 3.
export default function CompanionJourney() {
  const [recent, setRecent] = useState<Recent[] | null>(null);
  useEffect(() => { fetch("/api/companion/experiences?view=home").then((r) => r.ok ? r.json() : null).then((d) => setRecent(d?.recent ?? [])).catch(() => {}); }, []);
  return (
    <CompanionChrome active="journey">
      <h1 className="font-display text-2xl font-semibold text-midnight-navy">Journey</h1>
      <p className="mt-1 font-body text-sm text-charcoal/60">Your saved reflections over time.</p>
      <div className="mt-5 space-y-2.5">
        {recent === null ? <p className="font-body text-sm text-charcoal/50">Loading…</p> :
          recent.length === 0 ? <p className="rounded-2xl border border-dashed border-light-gray bg-white/60 p-6 text-center font-body text-sm text-charcoal/50">Nothing saved yet. Start something from Home or Process.</p> :
          recent.map((r) => (
            <div key={r.id} className="rounded-2xl border border-light-gray bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-display font-semibold text-midnight-navy">{r.title ?? "Reflection"}</p>
                <span className="font-ui text-[10px] uppercase tracking-wide text-charcoal/40">{r.status}</span>
              </div>
              <p className="mt-0.5 font-ui text-xs text-charcoal/45">{new Date(r.updated_at).toLocaleString()}</p>
            </div>
          ))}
      </div>
    </CompanionChrome>
  );
}
