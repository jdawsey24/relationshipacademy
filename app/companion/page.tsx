"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CompanionChrome from "@/components/companion/CompanionChrome";

interface Card { id: string; slug: string; title: string; short_description: string | null; est_minutes: number | null }
interface Recent { id: string; title: string | null; status: string; updated_at: string }

export default function CompanionHome() {
  const [data, setData] = useState<{ featured: Card[]; cards: Card[]; recent: Recent[] } | null>(null);

  useEffect(() => { fetch("/api/companion/experiences?view=home").then((r) => r.ok ? r.json() : null).then(setData).catch(() => {}); }, []);

  const draft = data?.recent.find((r) => r.status === "draft");

  return (
    <CompanionChrome active="home">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Relationship Companion</p>
      <h1 className="mt-2 text-balance font-display text-3xl font-semibold leading-tight text-midnight-navy">What are you navigating right now?</h1>

      {!data ? (
        <p className="mt-8 font-body text-sm text-charcoal/50">Loading…</p>
      ) : (
        <>
          {draft && (
            <Link href={`/companion/journey`} className="mt-6 block rounded-2xl border border-midnight-navy/30 bg-white p-4">
              <p className="font-ui text-[11px] font-semibold uppercase tracking-wide text-coral-rose">Continue where you left off</p>
              <p className="mt-1 font-display text-lg font-semibold text-midnight-navy">{draft.title ?? "Your reflection"}</p>
            </Link>
          )}

          {data.featured.length > 0 && (
            <div className="mt-6">
              <p className="font-ui text-[11px] font-semibold uppercase tracking-wide text-charcoal/45">Featured</p>
              <div className="mt-2 space-y-2.5">{data.featured.map((c) => <SituationCard key={c.id} c={c} />)}</div>
            </div>
          )}

          <div className="mt-6 space-y-2.5">
            {data.cards.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-light-gray bg-white/60 p-6 text-center font-body text-sm text-charcoal/50">Nothing here yet. New guided experiences appear as they&apos;re published.</p>
            ) : data.cards.map((c) => <SituationCard key={c.id} c={c} />)}
          </div>
        </>
      )}
    </CompanionChrome>
  );
}

function SituationCard({ c }: { c: Card }) {
  return (
    <Link href={`/companion/process/${c.slug}`} className="block rounded-2xl border border-light-gray bg-white p-4 transition-colors hover:border-midnight-navy/40">
      <p className="font-display text-lg font-semibold text-midnight-navy">{c.title}</p>
      {c.short_description && <p className="mt-0.5 font-body text-sm leading-relaxed text-charcoal/65">{c.short_description}</p>}
      {c.est_minutes ? <p className="mt-1.5 font-ui text-xs text-charcoal/40">About {c.est_minutes} min</p> : null}
    </Link>
  );
}
