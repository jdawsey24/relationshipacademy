import type { Metadata } from "next";
import Link from "next/link";
import { getMember } from "@/lib/academyAuth";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { getOwnedPlaybookClusterIds } from "@/lib/snapshot/playbookGrants";
import { getPlaybookMarketing, PLAYBOOK_PRICE_DISPLAY } from "@/lib/playbookMarketing";
import SectionLabel from "@/components/site/SectionLabel";
import CtaButton from "@/components/site/CtaButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Relationship Playbook™ | Relationship Life Cycle™",
  description:
    "Focused, therapist-developed guides for the exact pattern you're navigating in dating and relationships. Each Relationship Playbook™ meets you where you are.",
};

// Dual-state: a signed-in member sees their library; everyone else sees the
// public sales/landing page.
export default async function PlaybooksPage({ searchParams }: { searchParams: Promise<{ purchase?: string }> }) {
  const member = await getMember();
  const { purchase } = await searchParams;
  if (member) return <Library userId={member.user.id} purchaseSuccess={purchase === "success"} />;
  return <Landing />;
}

// ---------------------------------------------------------------------------
// Public landing
// ---------------------------------------------------------------------------
async function Landing() {
  const playbooks = await getPlaybookMarketing();
  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-14">
      <section className="text-center">
        <SectionLabel>The Relationship Playbook&trade;</SectionLabel>
        <h1 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight text-midnight-navy sm:text-5xl">
          A focused guide for exactly what you&apos;re navigating
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance font-body text-lg leading-relaxed text-charcoal/75">
          Each Relationship Playbook&trade; goes deep on one real pattern — rejection, trust, second-guessing, needing reassurance — with therapist-developed guidance you can actually use. Not generic dating tips. A clear next step for where you actually are.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <CtaButton href="/snapshot">Find your Playbook</CtaButton>
          <p className="font-body text-sm text-charcoal/50">{PLAYBOOK_PRICE_DISPLAY} each · One-time · Developed by Janelle Dawsey, LMFT</p>
        </div>
      </section>

      {/* How you get one */}
      <section className="mt-20 rounded-3xl bg-white/70 p-8 sm:p-12">
        <SectionLabel tone="sage">How it works</SectionLabel>
        <p className="mt-4 text-balance font-display text-2xl font-medium leading-relaxed text-midnight-navy sm:text-[28px]">
          Take the free Relationship Snapshot&trade; and we&apos;ll point you to the Playbook that fits your pattern.
        </p>
        <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-charcoal/75">
          The Snapshot takes about 10 minutes and is free. It identifies the pattern that&apos;s shaping your relationships right now — and matches you to the Playbook written for it. You can also browse the Playbooks below and choose the one that speaks to you.
        </p>
        <div className="mt-6"><CtaButton href="/snapshot" variant="secondary">Take the free Snapshot</CtaButton></div>
      </section>

      {/* The playbooks */}
      <section className="mt-20">
        <div className="text-center">
          <SectionLabel>The Playbooks</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">Find the one that fits</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {playbooks.map((p) => (
            <Link key={p.slug} href={`/playbooks/${p.slug}`}
              className="group flex flex-col rounded-2xl border border-midnight-navy/10 bg-white p-6 transition-colors hover:border-midnight-navy/30">
              <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/45">Relationship Playbook&trade;</p>
              <h3 className="mt-2 font-display text-xl font-semibold leading-tight text-midnight-navy">{p.subtitle}</h3>
              {p.corePattern && <p className="mt-2 flex-1 font-body text-[15px] leading-relaxed text-charcoal/70">{p.corePattern}</p>}
              <span className="mt-4 inline-flex items-center gap-1 font-ui text-sm font-semibold text-midnight-navy">
                Learn more <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-20 text-center">
        <h2 className="text-balance font-display text-3xl font-semibold text-midnight-navy">Not sure which one?</h2>
        <p className="mx-auto mt-3 max-w-lg font-body text-lg text-charcoal/70">Take the free Snapshot and we&apos;ll match you to the Playbook for your pattern.</p>
        <div className="mt-8"><CtaButton href="/snapshot">Find your Playbook</CtaButton></div>
      </section>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Signed-in library (unchanged behavior)
// ---------------------------------------------------------------------------
async function Library({ userId, purchaseSuccess }: { userId: string; purchaseSuccess: boolean }) {
  const clusterIds = await getOwnedPlaybookClusterIds(userId);
  let names = new Map<number, string>();
  if (clusterIds.length) {
    const { data } = await getSupabaseAdminClient().from("snapshot_clusters").select("id, name").in("id", clusterIds);
    names = new Map(((data ?? []) as { id: number; name: string }[]).map((c) => [c.id, c.name]));
  }
  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-10">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">The Relationship Playbook&trade;</p>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-midnight-navy sm:text-4xl">Your playbooks</h1>
      <p className="mt-2 font-body text-charcoal/70">Everything you&apos;ve unlocked, ready whenever you need it.</p>

      {purchaseSuccess && (
        <div className="mt-5 rounded-2xl border border-[#5F9E7C]/30 bg-[#5F9E7C]/[0.08] p-4 font-body text-sm text-charcoal/80">
          Thank you — your purchase is complete. Your playbook is below. If it isn&apos;t showing yet, give it a moment and refresh.
        </div>
      )}

      {clusterIds.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-light-gray bg-white/60 p-8 text-center">
          <p className="font-body text-charcoal/60">You haven&apos;t unlocked any playbooks yet.</p>
          <Link href="/snapshot" className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-midnight-navy px-6 font-ui text-sm font-semibold text-white transition-opacity hover:opacity-95">
            Take the Snapshot
          </Link>
        </div>
      ) : (
        <div className="mt-7 space-y-2.5">
          {clusterIds.map((id) => (
            <div key={id} className="flex items-center gap-3.5 rounded-2xl border border-light-gray bg-white p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-coral-rose/10 text-coral-rose" aria-hidden="true">
                <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h9l4 4v12H6z" /><path d="M14 4v5h5" /></svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-semibold leading-tight text-midnight-navy">{names.get(id) ?? "Your Playbook"}</span>
                <span className="mt-0.5 block font-body text-[13px] text-charcoal/55">Relationship Playbook (PDF)</span>
              </span>
              <a href={`/api/playbooks/${id}/download`} target="_blank" rel="noopener noreferrer"
                className="shrink-0 rounded-full bg-midnight-navy px-5 py-2.5 font-ui text-sm font-semibold text-white transition-opacity hover:opacity-95">
                Open
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
