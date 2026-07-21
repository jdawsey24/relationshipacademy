"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CompanionChrome from "@/components/companion/CompanionChrome";
import InstallGuide from "@/components/companion/InstallGuide";
import SituationCard from "@/components/companion/SituationCard";

interface Situation { situation_id: string; title: string; user_need: string | null; category_id: string | null }
interface Recent { id: string; title: string | null; status: string; updated_at: string }

export default function CompanionHome() {
  const [situations, setSituations] = useState<Situation[] | null>(null);
  const [preview, setPreview] = useState(false);
  const [recent, setRecent] = useState<Recent[]>([]);

  useEffect(() => {
    fetch("/api/companion/situations?view=home").then((r) => r.ok ? r.json() : null).then((d) => { if (d) { setSituations(d.situations); setPreview(!!d.preview); } }).catch(() => {});
    fetch("/api/companion/experiences?view=home").then((r) => r.ok ? r.json() : null).then((d) => setRecent(d?.recent ?? [])).catch(() => {});
  }, []);

  const draft = recent.find((r) => r.status === "draft");

  return (
    <CompanionChrome active="home">
      <InstallGuide />
      <div className="flex items-center justify-between">
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Relationship Companion</p>
        <Link href="/companion/settings" aria-label="Settings" className="text-lg text-charcoal/40 hover:text-charcoal">⚙</Link>
      </div>
      <h1 className="mt-2 text-balance font-display text-3xl font-semibold leading-tight text-midnight-navy">What are you navigating right now?</h1>
      {preview && <p className="mt-1 font-ui text-[11px] uppercase tracking-wide text-coral-rose">Staff preview · showing draft situations</p>}

      {draft && (
        <Link href="/companion/journey" className="mt-6 block rounded-2xl border border-midnight-navy/25 bg-white p-4 transition-colors hover:border-midnight-navy/40">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-wide text-coral-rose">Continue where you left off</p>
          <p className="mt-1 font-display text-lg font-semibold text-midnight-navy">{draft.title ?? "Your reflection"}</p>
        </Link>
      )}

      <Link href="/companion/planner"
        className="mt-6 flex items-center gap-3.5 rounded-2xl bg-midnight-navy p-4 text-white transition-colors hover:bg-midnight-navy/95">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5h16v10H9l-4 4V5z" /></svg>
        </span>
        <span className="flex-1">
          <span className="block font-display text-lg font-semibold">Plan a conversation</span>
          <span className="mt-0.5 block font-body text-[13px] text-white/70">Prepare for something you need to say.</span>
        </span>
        <span className="text-white/50" aria-hidden="true">→</span>
      </Link>

      <p className="mt-7 font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/40">For where you are now</p>
      <div className="mt-2.5 space-y-2.5">
        {situations === null ? (
          <p className="font-body text-sm text-charcoal/50">Loading…</p>
        ) : situations.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-light-gray bg-white/60 p-6 text-center font-body text-sm text-charcoal/50">Nothing here yet for where you are right now. New situations appear as they&apos;re published.</p>
        ) : situations.map((sit) => <SituationCard key={sit.situation_id} id={sit.situation_id} title={sit.title} need={sit.user_need} categoryId={sit.category_id} />)}
      </div>
    </CompanionChrome>
  );
}
