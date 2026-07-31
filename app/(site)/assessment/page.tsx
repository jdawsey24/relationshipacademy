import Link from "next/link";
import type { CSSProperties } from "react";
import SectionLabel from "@/components/site/SectionLabel";
import CtaButton from "@/components/site/CtaButton";
import { IconTile } from "@/components/site/IconTile";
import { getSiteContentMap, get, buildPageMetadata } from "@/lib/siteContent";
import { listLiveInstruments } from "@/lib/instrumentPublish";
import { FLAGSHIP_SLUG } from "@/lib/flagship";
import JsonLd from "@/components/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 60;

export async function generateMetadata() {
  return buildPageMetadata(await getSiteContentMap(), "assessment");
}

const STEPS = [
  { n: "1", title: "Tell us where you are right now", body: "Pick the moment that fits — dating, together, married, or starting over." },
  { n: "2", title: "Answer a few honest questions", body: "A short set of questions about how things actually feel right now." },
  { n: "3", title: "See the pattern you're in", body: "The pattern shaping your relationship life, your strengths and blind spots, and a clear next step." },
];

const OUTCOMES = [
  "The specific pattern shaping your relationship life right now",
  "Your strengths — what's already working for you",
  "Your blind spots — what's quietly getting in the way",
  "A clear next step, matched to the pattern you're in",
];

const TRUST = [
  "Created by Janelle Dawsey, LMFT",
  "Therapist-developed framework",
  "Free and confidential",
  "Educational, not diagnostic",
];

const FAQ = [
  { q: "Who is this assessment for?", a: "Anyone in a relationship who wants a clearer picture of where things stand and what they might need next." },
  { q: "Can I take it if I'm single?", a: "Yes. The Relationship Snapshot™ meets you wherever you are — whether you're actively dating, thinking about dating again, in a relationship, married, or coming out of a breakup. You pick the moment that fits you at the start, and the questions follow from there." },
  { q: "Should my partner take it too?", a: "You take it individually, reflecting on your experience of the relationship. Your partner is welcome to take it separately — comparing results can be a useful conversation starter." },
  { q: "How long does it take?", a: "Most people complete it in about 10 minutes." },
  { q: "Can my results change over time?", a: "Yes. Relationships develop, and your results may reflect that if you take it again at a different point." },
  { q: "How is this different from other relationship assessments?", a: "Most assessments hand you a score or a satisfaction rating. The Relationship Snapshot™ names the developmental pattern you're actually in — what's driving it, where it shows up, and the specific next step to work on it." },
  { q: "Is my information private?", a: "Yes. Your responses are never sold or shared with third parties." },
  { q: "What's the difference between the Snapshot and the Profile?", a: "The Relationship Snapshot™ is a free overview. The Relationship Profile™ is a deeper paid assessment with expanded results. (Coming soon.)" },
];

// Illustrative example of a Snapshot result (a named pattern + strengths, blind
// spots, key takeaway, and a matched Playbook) — mirrors the real results page.
// Placeholder copy, clearly marked "example"; not tied to a specific cluster.
const SAMPLE = {
  hue: "#7B5878", // plum
  pattern: "Bracing for the Letdown",
  corePattern: "Things can be going well and part of you is still waiting for the other shoe to drop — so you hold a little back.",
  strengths: [
    "You're honest with yourself about what you feel",
    "You show up steady and dependable for the people you love",
  ],
  blindSpots: [
    "You brace for disappointment before there's any sign of it",
    "You keep a little distance so you're never caught off guard",
  ],
  keyTakeaway: "The guard that once kept you safe is now the thing holding connection at arm's length.",
  playbookTitle: "Learning to Trust What's Going Well",
  playbookWhy: "A guided walk-through for loosening the guard and letting closeness in — at your own pace.",
};

export default async function AssessmentPage() {
  const content = await getSiteContentMap();
  // Exclude the flagship instrument — it's served as the main assessment at
  // /snapshot (hero CTA), not as a secondary "more assessments" card.
  const liveInstruments = (await listLiveInstruments()).filter((i) => i.public_slug !== FLAGSHIP_SLUG);
  return (
    <main className="bg-warm-ivory">
      <JsonLd data={[
        breadcrumbSchema([{ name: "Home", path: "/" }, { name: "The Assessment", path: "/assessment" }]),
        faqSchema(FAQ),
      ]} />
      {/* Hero */}
      <section className="px-6 pt-36 pb-16 text-center">
        <div className="mx-auto max-w-3xl">
          <SectionLabel className="mb-4">{get(content, "assessment.hero.eyebrow", "The Relationship Snapshot™")}</SectionLabel>
          <h1 className="font-display text-hero font-semibold text-midnight-navy sm:text-5xl">
            {get(content, "assessment.hero.headline", "Understand where you are — and what to focus on next.")}
          </h1>
          <p className="mx-auto mt-6 max-w-[600px] font-body text-lg leading-relaxed text-charcoal">
            {get(content, "assessment.hero.subhead", "The Relationship Snapshot™ is a free assessment that helps you see the pattern you're in, what's already working, and what to focus on next — whether you're single, dating, or years in.")}
          </p>
          <div className="mt-8"><CtaButton href="/snapshot">Take the Free Assessment</CtaButton></div>
        </div>
      </section>

      {/* Additional live assessments (shown only when an instrument is published live) */}
      {liveInstruments.length > 0 && (
        <section className="px-6 pb-4">
          <div className="mx-auto max-w-3xl">
            <SectionLabel className="mb-4 text-center">{get(content, "assessment.more.eyebrow", "More assessments")}</SectionLabel>
            <div className="grid gap-4 sm:grid-cols-2">
              {liveInstruments.map((inst) => (
                <div key={inst.assessment_id} className="flex flex-col rounded-2xl border border-light-gray bg-white p-6 text-left">
                  <h2 className="font-display text-xl font-semibold text-midnight-navy">{inst.name}</h2>
                  {inst.purpose && <p className="mt-2 flex-1 font-body text-sm leading-relaxed text-charcoal/80">{inst.purpose}</p>}
                  {inst.estimated_time && <p className="mt-3 text-xs text-charcoal/50">About {inst.estimated_time}</p>}
                  <div className="mt-5"><CtaButton href={`/assess/${inst.public_slug}`} variant="secondary">Take this assessment</CtaButton></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-3xl font-semibold text-midnight-navy">{get(content, "assessment.how.heading", "How it works")}</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-xl border border-light-gray bg-white p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-midnight-navy font-ui text-sm font-semibold text-white">{s.n}</span>
                <h3 className="mt-4 font-display text-lg font-semibold text-midnight-navy">{s.title}</h3>
                <p className="mt-2 font-body text-body text-charcoal">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="bg-[#FBF9F5] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-3xl font-semibold text-midnight-navy">{get(content, "assessment.learn.heading", "What you'll walk away with")}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {OUTCOMES.map((o) => (
              <div key={o} className="flex items-start gap-3 rounded-xl border border-light-gray bg-white p-5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-green/20 text-sm text-sage-green">✓</span>
                <span className="font-body text-charcoal">{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Framework Credibility */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">{get(content, "assessment.cred.heading", "Built on something real.")}</h2>
          <p className="mx-auto mt-4 max-w-[600px] font-body text-base leading-relaxed text-charcoal">
            {get(content, "assessment.cred.body", "The Relationship Snapshot™ is built on the Relationship Life Cycle™ Framework — a developmental model that views relationships as growing and changing over time rather than simply being healthy or unhealthy. It was developed by Janelle Dawsey, LMFT, and is designed to provide developmental insight, not a diagnosis or a score.")}
          </p>
          <Link href="/framework" className="mt-6 inline-flex items-center gap-1 font-ui text-sm font-medium text-midnight-navy transition-all hover:gap-2">
            Learn more about the framework <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-[#F2F5F2] px-6 py-14">
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t} className="rounded-xl bg-white p-5 text-center font-body text-sm text-charcoal">{t}</div>
          ))}
        </div>
      </section>

      {/* Sample Results */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold text-midnight-navy">{get(content, "assessment.sample.heading", "Here's what your results look like.")}</h2>
            <p className="mt-2 font-ui text-xs uppercase tracking-wide text-charcoal/50">Example — for illustration only. Your results will reflect your actual responses.</p>
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl border border-light-gray bg-white shadow-sm" style={{ "--hue": SAMPLE.hue } as CSSProperties}>
            {/* The pattern, named */}
            <div className="border-b border-light-gray px-6 py-7 text-center">
              <p className="font-ui text-eyebrow font-semibold uppercase" style={{ color: SAMPLE.hue }}>The pattern we found</p>
              <p className="mt-2 font-display text-2xl font-semibold text-midnight-navy">{SAMPLE.pattern}</p>
              <p className="mx-auto mt-2 max-w-md font-body text-body text-charcoal/70">{SAMPLE.corePattern}</p>
            </div>
            {/* Strengths / blind spots — the two-sided read */}
            <div className="grid gap-px bg-light-gray sm:grid-cols-2">
              <div className="bg-white p-5">
                <p className="font-ui text-eyebrow font-semibold uppercase text-sage-green">Strengths</p>
                <ul className="mt-3 space-y-2">
                  {SAMPLE.strengths.map((s) => (
                    <li key={s} className="flex gap-2.5 font-body text-body text-charcoal/85">
                      <span className="mt-px shrink-0 text-sage-green" aria-hidden="true">✓</span><span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-5">
                <p className="font-ui text-eyebrow font-semibold uppercase" style={{ color: SAMPLE.hue }}>Blind spots</p>
                <ul className="mt-3 space-y-2">
                  {SAMPLE.blindSpots.map((s) => (
                    <li key={s} className="flex gap-2.5 font-body text-body text-charcoal/85">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45" style={{ backgroundColor: SAMPLE.hue }} aria-hidden="true" /><span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* The heart of it — key takeaway */}
            <div className="px-6 py-6 text-center" style={{ backgroundColor: `${SAMPLE.hue}12` }}>
              <p className="font-ui text-eyebrow font-semibold uppercase" style={{ color: SAMPLE.hue }}>The heart of it</p>
              <p className="mx-auto mt-2 max-w-md text-balance font-display text-xl font-medium italic leading-snug text-midnight-navy">{SAMPLE.keyTakeaway}</p>
            </div>
            {/* Matched Playbook — the next step */}
            <div className="flex items-center gap-3.5 border-t border-light-gray px-6 py-5">
              <IconTile hue={SAMPLE.hue}>
                <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h11l4 4v12H5z" /><path d="M9 10h6" /><path d="M9 14h4" /></svg>
              </IconTile>
              <span className="min-w-0 flex-1">
                <span className="block font-ui text-micro font-semibold uppercase tracking-wide text-charcoal/45">Your next step</span>
                <span className="mt-0.5 block font-display text-lg font-semibold leading-tight text-midnight-navy">{SAMPLE.playbookTitle}</span>
                <span className="mt-0.5 block font-body text-micro text-charcoal/65">{SAMPLE.playbookWhy}</span>
              </span>
            </div>
          </div>
          <p className="mt-4 text-center font-body text-[15px] text-charcoal/80">
            Your results are personalized based on your responses. No two Relationship Snapshots™ look exactly alike.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#FBF9F5] px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">{get(content, "assessment.faq.heading", "Common questions")}</h2>
          <div className="mt-6 divide-y divide-light-gray">
            {FAQ.map((f) => (
              <div key={f.q} className="py-5">
                <h3 className="font-display text-lg font-semibold text-midnight-navy">{f.q}</h3>
                <p className="mt-2 font-body text-body text-charcoal">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Begin CTA */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">{get(content, "assessment.cta.heading", "Ready to get started?")}</h2>
          <div className="mt-6"><CtaButton href="/snapshot" variant="primary">Take the Free Snapshot</CtaButton></div>
          <p className="mt-3 font-body text-sm text-charcoal/60">{get(content, "assessment.cta.note", "Free. Confidential. Takes about 10 minutes.")}</p>
        </div>
      </section>
    </main>
  );
}
