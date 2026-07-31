import type { Metadata } from "next";
import Link from "next/link";
import { getMember } from "@/lib/academyAuth";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { getOwnedPlaybookClusterIds } from "@/lib/snapshot/playbookGrants";
import { getPlaybookMarketing, PLAYBOOK_PRICE_DISPLAY } from "@/lib/playbookMarketing";
import { keyForClusterId } from "@/lib/playbook/keys";
import SectionLabel from "@/components/site/SectionLabel";
import CtaButton from "@/components/site/CtaButton";
import { PlaybookMark, playbookHue } from "@/components/site/PlaybookMark";
import { IconTile, CARD_HOVER } from "@/components/site/IconTile";
import type { CSSProperties } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Relationship Playbook™ | Relationship Life Cycle™",
  description:
    "Focused, therapist-developed interactive experiences for the exact pattern you're navigating in dating and relationships. Each Relationship Playbook™ meets you where you are and walks you through it.",
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
const WHATS_INSIDE = [
  { title: "The pattern, made clear", body: "What’s actually happening beneath the frustration — named plainly, without jargon or blame." },
  { title: "Why it keeps happening", body: "The roots of the pattern and how it quietly shapes the way you show up in dating and relationships." },
  { title: "What to do about it", body: "Concrete, therapist-developed shifts and reflections you can use right away — not vague encouragement." },
];

async function Landing() {
  const playbooks = await getPlaybookMarketing();
  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-14">
      {/* Hero */}
      <section className="text-center">
        <SectionLabel>The Relationship Playbook&trade;</SectionLabel>
        <h1 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight text-midnight-navy sm:text-5xl">
          Go deep on the one pattern you keep running into
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance font-body text-lg leading-relaxed text-charcoal/75">
          Each Relationship Playbook&trade; is a focused, therapist-developed experience that walks you through a single real pattern in dating and relationships — feeling unchosen, guarding your heart, needing constant reassurance, knowing whether to stay. Not generic dating tips, and not a PDF to skim: an interactive, compassionate way to see what&apos;s happening and practice what to do next.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <CtaButton href="#playbooks">Browse the Playbooks</CtaButton>
          <p className="font-body text-sm text-charcoal/50">{PLAYBOOK_PRICE_DISPLAY} each · One-time · Yours to keep · By Janelle Dawsey, LMFT</p>
        </div>
      </section>

      {/* What a Playbook is */}
      <section className="mt-20 rounded-3xl bg-white/70 p-8 sm:p-12">
        <SectionLabel tone="sage">What it is</SectionLabel>
        <p className="mt-4 text-balance font-display text-2xl font-medium leading-relaxed text-midnight-navy sm:text-[28px]">
          A Playbook meets you exactly where you&apos;re stuck — and walks you through it.
        </p>
        <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-charcoal/75">
          Where generic advice stays on the surface, each Playbook goes deep on one pattern: why it happens, how it&apos;s shaping your relationships, and the specific shifts that actually help. Written by Janelle Dawsey, LMFT, and grounded in the Relationship Life Cycle&trade; framework. A guided experience you work through at your own pace — and come back to whenever you need it.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {WHATS_INSIDE.map((f) => (
            <div key={f.title} className="rounded-2xl border border-midnight-navy/10 bg-white p-5">
              <h3 className="font-display text-lg font-semibold text-midnight-navy">{f.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-charcoal/70">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Playbooks — the centerpiece */}
      <section id="playbooks" className="mt-20 scroll-mt-24">
        <div className="text-center">
          <SectionLabel>The Playbooks</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">Find the one that fits what you&apos;re navigating</h2>
          <p className="mx-auto mt-3 max-w-lg font-body text-charcoal/65">Each goes deep on a single pattern. Open the one that sounds like you.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {playbooks.map((p) => {
            const hue = playbookHue(p.clusterId);
            return (
              <Link key={p.slug} href={`/playbooks/${p.slug}`}
                style={{ "--hue": hue } as CSSProperties}
                className={`group flex flex-col rounded-2xl border border-midnight-navy/10 bg-white p-6 ${CARD_HOVER}`}>
                <IconTile hue={hue}>
                  <PlaybookMark clusterId={p.clusterId} className="h-[26px] w-[26px]" />
                </IconTile>
                <h3 className="mt-4 font-display text-xl font-semibold leading-tight text-midnight-navy">{p.subtitle}</h3>
                {p.corePattern && <p className="mt-2 font-body text-body text-charcoal/70">{p.corePattern}</p>}
                {p.keyTakeaway && (
                  <p className="mt-3 flex-1 border-l-2 pl-3 font-body text-sm italic leading-relaxed text-charcoal/60" style={{ borderColor: `${hue}66` }}>
                    &ldquo;{p.keyTakeaway}&rdquo;
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1.5 font-ui text-sm font-semibold text-midnight-navy">
                  Open this Playbook <span aria-hidden="true" style={{ color: hue }} className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            );
          })}
        </div>
        <p className="mt-6 text-center font-body text-sm text-charcoal/50">{PLAYBOOK_PRICE_DISPLAY} each · one-time purchase · instant access, yours in your library</p>
      </section>

      {/* Not sure which? — the Snapshot, now a helper, not the pitch */}
      <section className="mt-20 rounded-3xl bg-midnight-navy px-8 py-12 text-center text-white sm:px-12">
        <SectionLabel tone="white">Not sure which one?</SectionLabel>
        <p className="mx-auto mt-4 max-w-2xl text-balance font-display text-2xl font-medium leading-relaxed">
          Take the free Relationship Snapshot&trade; and we&apos;ll point you to the Playbook for your pattern.
        </p>
        <p className="mx-auto mt-4 max-w-xl font-body text-body text-white/75">
          About 10 minutes, free. It identifies the pattern shaping your relationships right now and matches you to the Playbook written for it.
        </p>
        <div className="mt-6 flex justify-center"><CtaButton href="/snapshot" variant="secondary">Take the free Snapshot</CtaButton></div>
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
      <p className="font-ui text-eyebrow font-semibold uppercase text-charcoal/45">The Relationship Playbook&trade;</p>
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
          {clusterIds.map((id) => {
            const key = keyForClusterId(id);
            return (
              <div key={id} className="flex items-center gap-3.5 rounded-2xl border border-light-gray bg-white p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-coral-rose/10 text-coral-rose" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M10 9l5 3-5 3z" /></svg>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-semibold leading-tight text-midnight-navy">{names.get(id) ?? "Your Playbook"}</span>
                  <span className="mt-0.5 block font-body text-micro text-charcoal/55">Interactive Playbook</span>
                </span>
                {key ? (
                  <Link href={`/playbook/${key}`}
                    className="shrink-0 rounded-full bg-midnight-navy px-5 py-2.5 font-ui text-sm font-semibold text-white transition-opacity hover:opacity-95">
                    Open
                  </Link>
                ) : (
                  <span className="shrink-0 rounded-full border border-light-gray px-5 py-2.5 font-ui text-sm font-semibold text-charcoal/45">
                    Coming soon
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
