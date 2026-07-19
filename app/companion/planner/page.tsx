"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CompanionChrome from "@/components/companion/CompanionChrome";

interface Plan { id: string; title: string; status: string; updated_at: string }

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
      <Link href="/companion" className="font-ui text-sm text-charcoal/55">← Home</Link>
      <h1 className="mt-3 font-display text-2xl font-semibold text-midnight-navy">Conversation Planner</h1>
      <p className="mt-1 font-body text-sm text-charcoal/60">Prepare for a conversation that matters — privately, at your own pace.</p>
      <button onClick={create} className="mt-4 w-full rounded-full bg-midnight-navy py-3 font-ui text-sm font-semibold text-white">Plan a new conversation</button>

      <div className="mt-5 space-y-2.5">
        {plans === null ? <p className="font-body text-sm text-charcoal/50">Loading…</p> :
          plans.length === 0 ? <p className="rounded-2xl border border-dashed border-light-gray bg-white/60 p-6 text-center font-body text-sm text-charcoal/50">No conversations planned yet.</p> :
          plans.map((p) => (
            <Link key={p.id} href={`/companion/planner/${p.id}`} className="block rounded-2xl border border-light-gray bg-white p-4">
              <p className="font-display font-semibold text-midnight-navy">{p.title}</p>
              <p className="mt-0.5 font-ui text-xs text-charcoal/45">{p.status} · {new Date(p.updated_at).toLocaleString()}</p>
            </Link>
          ))}
      </div>
    </CompanionChrome>
  );
}
