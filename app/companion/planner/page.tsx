"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CompanionChrome from "@/components/companion/CompanionChrome";

interface Plan { id: string; title: string; status: string; updated_at: string }

function Glyph({ paths, size = 20 }: { paths: string[]; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

export default function CompanionPlannerList() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[] | null>(null);
  useEffect(() => { fetch("/api/companion/planner").then((r) => r.ok ? r.json() : null).then((d) => setPlans(d?.plans ?? [])).catch(() => {}); }, []);

  async function create() {
    const r = await fetch("/api/companion/planner", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    if (r.ok) { const { id } = await r.json(); router.push(`/companion/planner/${id}`); }
  }

  return (
    <CompanionChrome active="none">
      <Link href="/companion" className="flex items-center gap-1 font-ui text-sm text-charcoal/55 hover:text-charcoal"><span aria-hidden="true">←</span> Home</Link>

      <p className="mt-4 font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">Conversation Planner</p>
      <h1 className="mt-1.5 font-display text-3xl font-semibold leading-tight text-midnight-navy">Plan a conversation</h1>
      <p className="mt-1 font-body text-sm leading-relaxed text-charcoal/60">Prepare for a conversation that matters — privately, at your own pace.</p>

      <button onClick={create}
        className="mt-5 flex w-full items-center gap-3.5 rounded-2xl bg-midnight-navy p-4 text-left text-white transition-colors hover:bg-midnight-navy/95">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15"><Glyph paths={["M12 5v14", "M5 12h14"]} size={21} /></span>
        <span className="flex-1">
          <span className="block font-display text-lg font-semibold">Plan a new conversation</span>
          <span className="mt-0.5 block font-body text-[13px] text-white/70">Start a private, guided plan.</span>
        </span>
        <span className="text-white/50" aria-hidden="true">→</span>
      </button>

      <div className="mt-6 space-y-2.5">
        {plans === null ? <p className="font-body text-sm text-charcoal/50">Loading…</p> :
          plans.length === 0 ? <p className="rounded-2xl border border-dashed border-light-gray bg-white/60 p-6 text-center font-body text-sm text-charcoal/50">No conversations planned yet.</p> :
          plans.map((p) => (
            <Link key={p.id} href={`/companion/planner/${p.id}`}
              className="group flex items-center gap-3.5 rounded-2xl border border-light-gray/70 bg-white p-3.5 transition-all hover:-translate-y-px hover:border-midnight-navy/25 hover:shadow-[0_3px_18px_rgba(28,53,87,0.07)]">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-midnight-navy/[0.06] text-midnight-navy/70"><Glyph paths={["M4 5h16v10H9l-4 4V5z"]} /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-lg font-semibold leading-tight text-midnight-navy">{p.title}</span>
                <span className="mt-0.5 block font-ui text-xs text-charcoal/45">{p.status} · {new Date(p.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
              </span>
              <span className="shrink-0 text-lg text-charcoal/25 transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
            </Link>
          ))}
      </div>
    </CompanionChrome>
  );
}
