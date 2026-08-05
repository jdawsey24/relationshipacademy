import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlaybookBySlug, PLAYBOOK_PRICE_DISPLAY } from "@/lib/playbookMarketing";
import { getResults } from "@/lib/snapshot/data";
import { resultLabel } from "@/lib/snapshot/resultTitle";
import SectionLabel from "@/components/site/SectionLabel";
import PlaybookEmbeddedCheckout from "@/components/site/PlaybookEmbeddedCheckout";
import { PlaybookMark, playbookHue } from "@/components/site/PlaybookMark";
import { IconTile } from "@/components/site/IconTile";
import type { CSSProperties } from "react";

// Render per-request (like the /playbooks index) rather than statically pre-building
// every slug at deploy. Pre-building ~26 pages fired concurrent Supabase queries at
// build; failures baked notFound()→404 that only healed on the first request. Dynamic
// rendering runs one query at request time (reliable) — no post-deploy 404 window.
export const dynamic = "force-dynamic";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPlaybookBySlug((await params).slug);
  if (!p) return { title: "Playbook not found" };
  return {
    title: `${p.subtitle} — The Relationship Playbook™`,
    description: p.why ?? p.corePattern ?? "A therapist-developed Relationship Playbook™.",
  };
}

/**
 * The Playbook sales page — the next step after the Snapshot.
 *
 * DELIBERATELY SPARE (owner direction 2026-08-04): the results page is the long,
 * substantive read; this page must not repeat it or feel like results-part-two.
 * It answers three questions quickly — what this is, what you'll do with it, what
 * it costs — with generous white space and short lines. Resist adding paragraphs.
 *
 * Personalized only when someone arrives from their results (?s=<session>) AND
 * that session's cluster matches this Playbook: one line of continuity, no more.
 * Voice: warm, direct, educational — never therapy, fear, urgency, or promises;
 * no internal framework vocabulary.
 */
export default async function PlaybookDetailPage(
  { params, searchParams }: { params: Promise<{ slug: string }>; searchParams?: Promise<{ s?: string }> },
) {
  const { slug } = await params;
  const rawSession = (await searchParams)?.s;
  const sessionId = typeof rawSession === "string" && UUID_RE.test(rawSession) ? rawSession : undefined;

  const p = await getPlaybookBySlug(slug);
  if (!p) notFound();
  const hue = playbookHue(p.clusterId);

  const results = sessionId ? await getResults(sessionId) : null;
  const mine = results?.primary && results.primary.id === p.clusterId ? results.primary : null;
  const buyLabel = `Get My Playbook — ${PLAYBOOK_PRICE_DISPLAY}`;

  return (
    <main className="mx-auto max-w-2xl px-6 pb-32 pt-10" style={{ "--hue": hue } as CSSProperties}>
      <Link href="/playbooks" className="font-ui text-sm text-charcoal/45 hover:text-charcoal">← All Playbooks</Link>

      {/* Hero — name it, place it, price it. Nothing else. */}
      <section className="mt-10">
        <IconTile hue={hue} size="lg" className="mb-7">
          <PlaybookMark clusterId={p.clusterId} className="h-9 w-9" />
        </IconTile>
        <SectionLabel>{mine ? "Your next step" : "The Relationship Playbook™"}</SectionLabel>
        <h1 className="mt-4 text-balance font-display text-4xl font-semibold leading-[1.1] text-midnight-navy sm:text-5xl">
          {p.subtitle}
        </h1>
        <p className="mt-6 font-body text-lg leading-relaxed text-charcoal/75">
          {mine
            ? <>Matched to your Snapshot result, <strong className="text-midnight-navy">{resultLabel(mine.result_title) || mine.name}</strong>. Your results named the pattern — this is where you work with it.</>
            : <>{p.corePattern}</>}
        </p>

        <div className="mt-10">
          <div className="flex justify-start"><PlaybookEmbeddedCheckout clusterId={p.clusterId} slug={slug} sessionId={sessionId} buyLabel={buyLabel} playbookName={p.subtitle} /></div>
          <p className="mt-4 font-body text-sm text-charcoal/45">
            {PLAYBOOK_PRICE_DISPLAY} once · yours to keep · by Janelle Dawsey, LMFT
          </p>
        </div>
      </section>

      {/* What you'll work through — the substance, as a scannable list */}
      {p.pillars.length > 0 && (
        <section className="mt-24">
          <SectionLabel tone="sage">Inside</SectionLabel>
          <h2 className="mt-4 font-display text-2xl font-semibold text-midnight-navy">What you&apos;ll work through</h2>
          <ol className="mt-8 space-y-5">
            {p.pillars.map((pillar, i) => (
              <li key={pillar} className="flex items-start gap-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-ui text-sm font-semibold" style={{ backgroundColor: `${hue}1f`, color: hue }}>{i + 1}</span>
                <span className="pt-1 font-body text-lg leading-relaxed text-charcoal/80">{pillar}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* What's included — four short lines */}
      <section className="mt-24">
        <SectionLabel>What you get</SectionLabel>
        <h2 className="mt-4 font-display text-2xl font-semibold text-midnight-navy">An interactive walk-through, not a PDF</h2>
        <ul className="mt-8 space-y-4">
          {[
            "Guided reflections that use your situation, not a hypothetical one",
            "Short exercises for trying a different response",
            "Language for the conversations that need clarity",
            "Yours to keep — come back whenever you need it",
          ].map((item) => (
            <li key={item} className="flex gap-4 font-body text-lg leading-relaxed text-charcoal/80">
              <span className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: hue }} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Honest outcomes — three lines, no promises */}
      <section className="mt-24">
        <SectionLabel tone="sage">What changes</SectionLabel>
        <h2 className="mt-4 font-display text-2xl font-semibold text-midnight-navy">Clearer, sooner — not perfect</h2>
        <ul className="mt-8 space-y-4">
          {[
            "You catch the pattern earlier than you used to",
            "You ask instead of filling in the blanks",
            "You decide with more evidence and less guessing",
          ].map((item) => (
            <li key={item} className="flex gap-4 font-body text-lg leading-relaxed text-charcoal/80">
              <span className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: hue }} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* The heart of it */}
      {p.keyTakeaway && (
        <section className="mt-24 rounded-3xl bg-midnight-navy px-8 py-14 text-center text-white sm:px-12">
          <p className="mx-auto max-w-xl text-balance font-display text-2xl font-medium leading-relaxed">
            {p.keyTakeaway}
          </p>
        </section>
      )}

      {/* Price + CTA */}
      <section className="mt-24 text-center">
        <h2 className="font-display text-3xl font-semibold text-midnight-navy">{PLAYBOOK_PRICE_DISPLAY}</h2>
        <p className="mt-3 font-body text-charcoal/65">One-time. Instant access. Yours to keep.</p>
        <div id="checkout" className="mt-8 scroll-mt-24">
          <PlaybookEmbeddedCheckout clusterId={p.clusterId} slug={slug} sessionId={sessionId} buyLabel={buyLabel} playbookName={p.subtitle} />
        </div>
      </section>

      {/* FAQ — collapsed by default, so it costs no visual weight */}
      <section className="mt-24">
        <SectionLabel>Questions</SectionLabel>
        <div className="mt-6 divide-y divide-light-gray border-y border-light-gray">
          {[
            { q: "Is this therapy?", a: "No. It's an educational resource for reflection and skill-building, written by a licensed therapist but not a substitute for working with one." },
            { q: "How was this Playbook chosen?", a: mine ? "Your Snapshot answers pointed to one pattern more consistently than the others. This is the Playbook written for it." : "Each Playbook is written for one pattern. The free Snapshot matches you to yours — or choose directly if you already know what you're working on." },
            { q: "Is it personalized?", a: "It's matched to your result. Everything inside is built around that specific pattern rather than relationships in general." },
            { q: "Can I use it if I'm single?", a: "Yes. It works on the pattern, not on a relationship status." },
            { q: "Is it for couples?", a: "It's written for you as an individual. Nothing requires your partner's participation." },
            { q: "What happens after I buy?", a: "You go straight to your Playbook, and it stays in your library." },
          ].map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="cursor-pointer list-none font-body text-lg text-midnight-navy marker:hidden">{f.q}</summary>
              <p className="mt-3 font-body text-base leading-relaxed text-charcoal/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Disclaimer — quiet, at the bottom where it belongs */}
      <p className="mt-16 font-body text-sm leading-relaxed text-charcoal/45">
        The Relationship Playbook™ is educational and is not therapy, diagnosis, or crisis care. If you&apos;re
        in distress or your safety is at risk, please contact a licensed professional or local emergency services.
      </p>

      {!mine && (
        <p className="mt-8 text-center font-body text-sm text-charcoal/55">
          Not sure this is the one?{" "}
          <Link href="/snapshot" className="text-midnight-navy underline underline-offset-4">Take the free Snapshot</Link>
        </p>
      )}
    </main>
  );
}
