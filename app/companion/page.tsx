"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CompanionChrome from "@/components/companion/CompanionChrome";
import InstallGuide from "@/components/companion/InstallGuide";

interface Situation { situation_id: string; title: string; user_need: string | null }
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
        <Link href="/companion/journey" className="mt-6 block rounded-2xl border border-midnight-navy/30 bg-white p-4">
          <p className="font-ui text-[11px] font-semibold uppercase tracking-wide text-coral-rose">Continue where you left off</p>
          <p className="mt-1 font-display text-lg font-semibold text-midnight-navy">{draft.title ?? "Your reflection"}</p>
        </Link>
      )}

      <Link href="/companion/planner" className="mt-6 flex items-center justify-between rounded-2xl border border-light-gray bg-white p-4 transition-colors hover:border-midnight-navy/40">
        <span>
          <span className="block font-display text-lg font-semibold text-midnight-navy">Plan a conversation</span>
          <span className="mt-0.5 block font-body text-sm text-charcoal/60">Prepare for something you need to say.</span>
        </span>
        <span className="text-xl text-midnight-navy/40" aria-hidden="true">→</span>
      </Link>

      <div className="mt-6 space-y-2.5">
        {situations === null ? (
          <p className="font-body text-sm text-charcoal/50">Loading…</p>
        ) : situations.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-light-gray bg-white/60 p-6 text-center font-body text-sm text-charcoal/50">Nothing here yet for where you are right now. New situations appear as they&apos;re published.</p>
        ) : situations.map((sit) => <SituationCard key={sit.situation_id} sit={sit} />)}
      </div>
    </CompanionChrome>
  );
}

function SituationCard({ sit }: { sit: Situation }) {
  return (
    <Link href={`/companion/situations/${sit.situation_id}`} className="block rounded-2xl border border-light-gray bg-white p-4 transition-colors hover:border-midnight-navy/40">
      <p className="font-display text-lg font-semibold text-midnight-navy">{sit.title}</p>
      {sit.user_need && <p className="mt-0.5 font-body text-sm leading-relaxed text-charcoal/65">{sit.user_need}</p>}
    </Link>
  );
}
