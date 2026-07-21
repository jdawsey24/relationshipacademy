import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlaybookBySlug, PLAYBOOK_SLUGS, PLAYBOOK_PRICE_DISPLAY } from "@/lib/playbookMarketing";
import SectionLabel from "@/components/site/SectionLabel";
import CtaButton from "@/components/site/CtaButton";
import PlaybookBuyButton from "@/components/site/PlaybookBuyButton";

export const revalidate = 300;

export function generateStaticParams() {
  return Object.keys(PLAYBOOK_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPlaybookBySlug((await params).slug);
  if (!p) return { title: "Playbook not found" };
  return {
    title: `${p.subtitle} — The Relationship Playbook™`,
    description: p.why ?? p.corePattern ?? "A therapist-developed Relationship Playbook™.",
  };
}

export default async function PlaybookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getPlaybookBySlug((await params).slug);
  if (!p) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-12">
      <Link href="/playbooks" className="font-ui text-sm text-charcoal/55 hover:text-charcoal">← All Playbooks</Link>

      {/* Hero */}
      <section className="mt-6">
        <SectionLabel>The Relationship Playbook&trade;</SectionLabel>
        <h1 className="mt-3 text-balance font-display text-4xl font-semibold leading-tight text-midnight-navy sm:text-[44px]">{p.subtitle}</h1>
        {p.corePattern && <p className="mt-5 text-balance font-body text-lg leading-relaxed text-charcoal/75">{p.corePattern}</p>}
        <div className="mt-8"><PlaybookBuyButton clusterId={p.clusterId} label={`Get this Playbook — ${PLAYBOOK_PRICE_DISPLAY}`} className="!justify-start" /></div>
        <p className="mt-3 font-body text-sm text-charcoal/50">One-time purchase · Instant access · Developed by Janelle Dawsey, LMFT</p>
      </section>

      {/* What it helps with */}
      {p.why && (
        <section className="mt-14 rounded-3xl bg-white/70 p-8 sm:p-10">
          <SectionLabel tone="sage">What this Playbook helps with</SectionLabel>
          <p className="mt-4 font-body text-lg leading-relaxed text-charcoal/80">{p.why}</p>
        </section>
      )}

      {/* Pillars (if authored) */}
      {p.pillars.length > 0 && (
        <section className="mt-14">
          <SectionLabel>Inside</SectionLabel>
          <h2 className="mt-3 font-display text-2xl font-semibold text-midnight-navy">What you&apos;ll work through</h2>
          <ul className="mt-6 space-y-3">
            {p.pillars.map((pillar) => (
              <li key={pillar} className="flex items-start gap-3 font-body text-[17px] leading-relaxed text-charcoal/80">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-coral-rose/70" aria-hidden="true" />
                <span>{pillar}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Key takeaway */}
      {p.keyTakeaway && (
        <section className="mt-14 rounded-3xl bg-midnight-navy px-8 py-12 text-center text-white sm:px-12">
          <SectionLabel tone="white">The heart of it</SectionLabel>
          <p className="mx-auto mt-4 max-w-2xl text-balance font-display text-2xl font-medium leading-relaxed">{p.keyTakeaway}</p>
        </section>
      )}

      {/* CTA */}
      <section className="mt-14 text-center">
        <h2 className="font-display text-2xl font-semibold text-midnight-navy">Ready to dig in?</h2>
        <div className="mt-6 flex flex-col items-center gap-3">
          <PlaybookBuyButton clusterId={p.clusterId} label={`Get this Playbook — ${PLAYBOOK_PRICE_DISPLAY}`} />
          <Link href="/snapshot" className="font-ui text-sm text-midnight-navy/70 underline underline-offset-4 hover:text-midnight-navy">Not sure this is the one? Take the free Snapshot</Link>
        </div>
      </section>
    </main>
  );
}
