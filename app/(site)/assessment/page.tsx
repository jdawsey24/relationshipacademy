import Link from "next/link";
import SectionLabel from "@/components/site/SectionLabel";
import CtaButton from "@/components/site/CtaButton";
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
  { n: "1", title: "Tell us where your relationship is today", body: "A simple question about your current relationship situation." },
  { n: "2", title: "Answer questions about your relationship", body: "A series of questions about how your relationship is going right now." },
  { n: "3", title: "Receive your personalized results", body: "Insights, strengths, growth areas, and a clear next step." },
];

const OUTCOMES = [
  "A clear picture of where your relationship stands today",
  "Your relationship's strengths — the areas that are already working",
  "Growth opportunities — the areas that may need more attention",
  "A personalized next step based on your results",
];

const TRUST = [
  "Created by Janelle Dawsey, LMFT",
  "Therapist-developed framework",
  "Free and confidential",
  "Educational, not diagnostic",
];

const FAQ = [
  { q: "Who is this assessment for?", a: "Anyone in a relationship who wants a clearer picture of where things stand and what they might need next." },
  { q: "Can I take it if I'm single?", a: "The Relationship Snapshot™ is designed for people currently in a relationship. If you're between relationships, the Framework page has resources that may be helpful." },
  { q: "Should my partner take it too?", a: "You take it individually, reflecting on your experience of the relationship. Your partner is welcome to take it separately — comparing results can be a useful conversation starter." },
  { q: "How long does it take?", a: "Most people complete it in about 10 minutes." },
  { q: "Can my results change over time?", a: "Yes. Relationships develop, and your results may reflect that if you take it again at a different point." },
  { q: "How is this different from other relationship assessments?", a: "Most assessments measure relationship satisfaction. The Relationship Snapshot™ measures developmental functioning — how well your relationship is building the skills and patterns each phase requires." },
  { q: "Is my information private?", a: "Yes. Your responses are never sold or shared with third parties." },
  { q: "What's the difference between the Snapshot and the Profile?", a: "The Relationship Snapshot™ is a free overview. The Relationship Profile™ is a deeper paid assessment with expanded results. (Coming soon.)" },
];

const SAMPLE_DOMAINS = [
  { name: "Communication", score: 4.2, level: "Strength", color: "bg-sage-green" },
  { name: "Trust", score: 3.6, level: "Healthy Development", color: "bg-slate-blue" },
  { name: "Emotional Connection", score: 2.9, level: "Growth Opportunity", color: "bg-soft-coral" },
  { name: "Conflict", score: 2.3, level: "Needs Attention", color: "bg-coral-rose" },
];

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
          <h1 className="font-display text-[40px] font-semibold leading-[1.05] text-midnight-navy sm:text-5xl">
            {get(content, "assessment.hero.headline", "Understand where your relationship is — and what it needs next.")}
          </h1>
          <p className="mx-auto mt-6 max-w-[600px] font-body text-lg leading-relaxed text-charcoal">
            {get(content, "assessment.hero.subhead", "The Relationship Snapshot™ is a free assessment designed to help you better understand your relationship, recognize what's going well, and identify opportunities for growth.")}
          </p>
          <div className="mt-8"><CtaButton href="/snapshot/intro">Take the Free Assessment</CtaButton></div>
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
                <p className="mt-2 font-body text-[15px] leading-relaxed text-charcoal">{s.body}</p>
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
          <p className="mx-auto mt-4 max-w-[600px] font-body text-[16px] leading-relaxed text-charcoal">
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
          <div className="mt-8 rounded-2xl border border-light-gray bg-white p-6 shadow-sm">
            <div className="rounded-xl bg-plum/10 p-4 text-center">
              <p className="font-ui text-[11px] uppercase tracking-wide text-charcoal/60">Your Relationship Stage</p>
              <p className="font-display text-2xl font-semibold text-plum">Choosing Each Other Intentionally</p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="rounded-full bg-sage-green px-4 py-1.5 font-ui text-sm font-semibold text-white">Congruent</span>
              <span className="font-body text-sm text-charcoal/70">Developmental Alignment</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {SAMPLE_DOMAINS.map((d) => (
                <div key={d.name} className="rounded-xl border border-light-gray p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-base font-semibold text-midnight-navy">{d.name}</span>
                    <span className="font-ui text-xl font-semibold text-midnight-navy">{d.score.toFixed(1)}</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-light-gray">
                    <div className={`h-full rounded-full ${d.color}`} style={{ width: `${(d.score / 5) * 100}%` }} />
                  </div>
                  <span className="mt-2 inline-block font-ui text-[11px] text-charcoal/60">{d.level}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-midnight-navy/5 p-4">
              <p className="font-ui text-[11px] uppercase tracking-wide text-charcoal/60">Your Next Step</p>
              <p className="mt-1 font-body text-sm text-charcoal">A personalized recommendation based on your lowest-scoring areas and your current phase.</p>
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
                <p className="mt-2 font-body text-[15px] leading-relaxed text-charcoal">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Begin CTA */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">{get(content, "assessment.cta.heading", "Ready to get started?")}</h2>
          <div className="mt-6"><CtaButton href="/snapshot/intro" variant="primary">Take the Free Snapshot</CtaButton></div>
          <p className="mt-3 font-body text-sm text-charcoal/60">{get(content, "assessment.cta.note", "Free. Confidential. Takes about 10 minutes.")}</p>
        </div>
      </section>
    </main>
  );
}
