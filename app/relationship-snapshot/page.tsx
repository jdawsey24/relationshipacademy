import CtaButton from "@/components/site/CtaButton";
import SectionLabel from "@/components/site/SectionLabel";
import HeroMoments from "@/components/landing/HeroMoments";
import ResultsPreviewMock from "@/components/landing/ResultsPreviewMock";
import QuestionMock from "@/components/landing/QuestionMock";
import MomentTile from "@/components/landing/MomentTile";
import FaqAccordion, { type Faq } from "@/components/landing/FaqAccordion";
import { MOMENTS } from "@/components/landing/moments";

export const metadata = {
  title: "The Relationship Snapshot™ — How's your relationship, really?",
  description:
    "It's easy to know your relationship status. It's harder to know how your relationship is actually doing. Take the free Relationship Snapshot™ — a 5-minute assessment that shows what's working, where to grow, and what to focus on next.",
};

const START = "/snapshot/intro";

const OUTCOMES = [
  { title: "What's working", body: "Recognize the habits and strengths that are helping your relationship move forward." },
  { title: "Where you may be stuck", body: "Notice patterns or areas that may need more attention." },
  { title: "Whether you're moving together", body: "See whether the relationship you have matches what your current level of commitment requires." },
  { title: "What to focus on next", body: "Receive a practical next step based on your responses." },
];

const STEPS = [
  { n: "1", title: "Answer honestly", body: "Respond to a short set of questions about your relationship and how it currently functions." },
  { n: "2", title: "See your results", body: "Receive a personalized overview of your relationship's strengths, growth opportunities, and overall direction." },
  { n: "3", title: "Take your next step", body: "Use your results to decide what deserves more attention, conversation, or intentional effort." },
];

const COMPARE = [
  ["Focuses on personality or compatibility", "Focuses on how the relationship is functioning"],
  ["Gives a general type or label", "Identifies strengths and growth opportunities"],
  ["Offers one broad result", "Provides a clearer next step"],
  ["Treats relationships as static", "Recognizes that relationships change over time"],
];

const FOR = [
  "Dating and wondering where things are headed",
  "In a committed relationship",
  "Engaged and preparing for marriage",
  "Married and wanting to stay connected",
  "Experiencing distance or uncertainty",
  "Trying to understand what your relationship needs next",
];

const FAQS: Faq[] = [
  { q: "Is the Relationship Snapshot™ free?", a: "Yes. The Relationship Snapshot™ is free to complete." },
  { q: "How long does it take?", a: "Most people finish in about five minutes." },
  { q: "Do we have to take it together?", a: "No. One person can complete the Snapshot and receive personalized results based on their experience." },
  { q: "Is this only for married couples?", a: "No. It is designed for people who are dating, committed, engaged, or married." },
  { q: "Will it tell me whether I should stay or leave?", a: "No. The Snapshot does not make decisions for you. It helps you understand what may be happening so you can make more informed choices." },
  { q: "Is this therapy?", a: "No. The Relationship Snapshot™ is an educational assessment and does not replace therapy, clinical evaluation, or professional advice." },
  { q: "Will I receive a score?", a: "Your results will focus on understandable insights, strengths, growth opportunities, and next steps rather than presenting a confusing page of numbers." },
  { q: "Are my results private?", a: "Yes. Your responses are handled according to our Privacy Policy and are never sold or shared with third parties." },
];

export default function RelationshipSnapshotLanding() {
  return (
    <main>
      {/* 1 · HERO */}
      <section className="px-6 pt-28 pb-16 sm:pt-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <SectionLabel className="mb-4">The Relationship Snapshot&trade;</SectionLabel>
            <h1 className="text-balance font-display text-[42px] font-semibold leading-[1.05] text-midnight-navy sm:text-6xl">
              How&apos;s your relationship, really?
            </h1>
            <div className="mx-auto mt-6 max-w-[520px] space-y-3 font-body text-lg leading-relaxed text-charcoal/80 lg:mx-0">
              <p>It&apos;s easy to know your relationship status.</p>
              <p>It&apos;s harder to know how your relationship is actually doing.</p>
              <p>The Relationship Snapshot&trade; helps you see what&apos;s going well, where you may need more attention, and what to focus on next.</p>
            </div>
            <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
              <CtaButton href={START}>Take My Relationship Snapshot</CtaButton>
              <p className="font-ui text-sm text-charcoal/55">Free • Takes about 5 minutes • Personalized results</p>
            </div>
          </div>
          <div className="order-first lg:order-last"><HeroMoments /></div>
        </div>
      </section>

      {/* 2 · RECOGNITION */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="mx-auto max-w-[620px]">
            <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-midnight-navy sm:text-4xl">
              Most of us were never taught how relationships grow.
            </h2>
            <div className="mt-6 space-y-4 font-body text-lg leading-relaxed text-charcoal/80">
              <p>We learn math, science, history, and how to prepare for a career.</p>
              <p>But when it comes to relationships, most of us are left to figure things out through experience, advice from other people, social media, and a whole lot of trial and error.</p>
              <p>So even when a relationship looks fine from the outside, it can still be difficult to answer simple questions like:</p>
            </div>
            <ul className="mt-5 space-y-2.5">
              {["Are we growing together?", "Are the same problems keeping us stuck?", "Are we building something strong?", "What should we be paying more attention to?"].map((q) => (
                <li key={q} className="flex gap-3 font-body text-lg text-charcoal/85">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-rose" aria-hidden="true" />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-body text-lg font-medium leading-relaxed text-midnight-navy">
              You should not have to wait for a crisis to understand your relationship.
            </p>
          </div>
          <div className="hidden grid-cols-2 gap-4 lg:grid">
            <MomentTile moment={MOMENTS.conversation} className="mt-8 aspect-[3/4]" />
            <MomentTile moment={MOMENTS.planning} className="aspect-[3/4]" />
          </div>
        </div>
      </section>

      {/* 3 · REFRAME (editorial, dark) */}
      <section className="relative overflow-hidden bg-midnight-navy px-6 py-24 text-white">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]" preserveAspectRatio="none" viewBox="0 0 1200 400" aria-hidden="true">
          <path d="M-50 320 C 300 120, 600 380, 1250 90" fill="none" stroke="#E7A2A4" strokeWidth="2" />
          <path d="M-50 360 C 350 200, 700 420, 1250 160" fill="none" stroke="#8A9D8F" strokeWidth="1.5" />
        </svg>
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-balance font-display text-3xl font-semibold leading-tight sm:text-4xl">Relationships don&apos;t just happen.</h2>
          <div className="mx-auto mt-6 max-w-2xl space-y-4 font-body text-lg leading-relaxed text-white/85">
            <p>Every relationship is moving in a direction.</p>
            <p>Some relationships become stronger through communication, trust, shared effort, and the ability to adjust when life changes.</p>
            <p>Others slowly lose connection because important needs, conversations, or challenges remain unaddressed.</p>
            <p>That does not mean a relationship is doomed.</p>
            <p>It means knowing what is happening gives you the chance to be more intentional about what happens next.</p>
          </div>
          <blockquote className="mx-auto mt-10 max-w-2xl border-t border-white/15 pt-8 font-display text-2xl font-medium leading-snug text-white sm:text-[28px]">
            You may know what your relationship is called. The Snapshot helps you understand how it is going.
          </blockquote>
        </div>
      </section>

      {/* 4 · MEET THE SNAPSHOT */}
      <section id="about" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionLabel className="mb-4">A clearer picture in about five minutes</SectionLabel>
            <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-midnight-navy sm:text-4xl">Meet the Relationship Snapshot&trade;</h2>
            <div className="mt-6 space-y-4 font-body text-lg leading-relaxed text-charcoal/80">
              <p>The Relationship Snapshot&trade; is a brief, guided assessment designed to help you better understand your current relationship.</p>
              <p>Your responses are used to create a personalized overview of what appears to be supporting your relationship, where there may be room to grow, and what may deserve your attention next.</p>
              <p>This is not a pass-or-fail test. It is a starting point for greater clarity.</p>
            </div>
            <div className="mt-8"><CtaButton href={START}>Start My Snapshot</CtaButton></div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <QuestionMock className="relative z-10 rotate-[-2deg]" />
            <ResultsPreviewMock className="relative z-20 -mt-8 ml-auto w-[78%] rotate-[2deg]" />
          </div>
        </div>
      </section>

      {/* 5 · WHAT YOU'LL LEARN */}
      <section className="bg-[#FBF9F5] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-midnight-navy sm:text-4xl">Walk away knowing what matters most.</h2>
            <p className="mt-5 font-body text-lg leading-relaxed text-charcoal/80">Your results are designed to help you understand your relationship without overwhelming you with scores, jargon, or labels.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {OUTCOMES.map((o) => (
              <div key={o.title} className="flex flex-col rounded-2xl border border-light-gray bg-white p-6">
                <h3 className="font-display text-xl font-semibold text-midnight-navy">{o.title}</h3>
                <p className="mt-3 font-body text-[15px] leading-relaxed text-charcoal/80">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 · HOW IT WORKS */}
      <section id="how" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-midnight-navy sm:text-4xl">Five minutes. Three simple steps.</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-light-gray bg-white p-7">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-midnight-navy font-ui text-sm font-semibold text-white">{s.n}</span>
                <h3 className="mt-4 font-display text-xl font-semibold text-midnight-navy">{s.title}</h3>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-charcoal/80">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-2">
            <CtaButton href={START}>Take the Relationship Snapshot</CtaButton>
            <p className="font-ui text-sm text-charcoal/55">No credit card required.</p>
          </div>
        </div>
      </section>

      {/* 7 · WHAT MAKES IT DIFFERENT */}
      <section className="bg-[#F2F5F2] px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-midnight-navy sm:text-4xl">More than a compatibility quiz.</h2>
            <div className="mt-6 space-y-4 font-body text-lg leading-relaxed text-charcoal/80">
              <p>Many relationship quizzes focus on personality, preferences, or whether two people are a good match.</p>
              <p className="font-medium text-midnight-navy">The Relationship Snapshot&trade; looks at something different: how your relationship is functioning and whether it is keeping pace with the relationship you are building.</p>
              <p>It is informed by the Relationship Life Cycle&trade; Framework, which examines how relationships develop, change, face challenges, and require different skills over time.</p>
              <p>The goal is not to tell you whether to stay or leave. The goal is to help you see more clearly.</p>
            </div>
          </div>
          <div className="mt-12 overflow-hidden rounded-2xl border border-light-gray bg-white">
            <div className="grid grid-cols-2 border-b border-light-gray bg-warm-ivory font-ui text-sm font-semibold text-charcoal/60">
              <div className="px-5 py-4">Typical relationship quiz</div>
              <div className="border-l border-light-gray px-5 py-4 text-midnight-navy">Relationship Snapshot&trade;</div>
            </div>
            {COMPARE.map(([a, b], i) => (
              <div key={a} className={`grid grid-cols-2 ${i < COMPARE.length - 1 ? "border-b border-light-gray" : ""}`}>
                <div className="px-5 py-4 font-body text-[15px] text-charcoal/70">{a}</div>
                <div className="border-l border-light-gray px-5 py-4 font-body text-[15px] font-medium text-midnight-navy">{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 · WHO IT'S FOR */}
      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="mx-auto max-w-[560px]">
            <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-midnight-navy sm:text-4xl">Built for where you are now.</h2>
            <p className="mt-6 font-body text-lg leading-relaxed text-charcoal/80">You can take the Relationship Snapshot&trade; whether you are:</p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {FOR.map((f) => (
                <li key={f} className="flex gap-3 font-body text-[15px] text-charcoal/85">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage-green" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl bg-warm-ivory p-4 font-body text-[15px] leading-relaxed text-charcoal/75">
              The Snapshot can be completed by one person. Your partner does not need to participate for you to receive meaningful insight.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3.5">
            <MomentTile moment={MOMENTS.coffee} className="aspect-[3/4]" />
            <MomentTile moment={MOMENTS.walking} className="mt-8 aspect-[3/4]" />
            <MomentTile moment={MOMENTS.journal} className="aspect-[3/4]" />
            <MomentTile moment={MOMENTS.planning} className="mt-8 aspect-[3/4]" />
            <MomentTile moment={MOMENTS.conversation} className="aspect-[3/4]" />
            <MomentTile moment={MOMENTS.walking} className="mt-8 aspect-[3/4]" />
          </div>
        </div>
      </section>

      {/* 9 · TRUST */}
      <section className="bg-[#FBF9F5] px-6 py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[0.8fr_1.2fr]">
          <div className="mx-auto w-full max-w-xs">
            <MomentTile moment={MOMENTS.portrait} className="aspect-[4/5] w-full" />
          </div>
          <div>
            <h2 className="text-balance font-display text-3xl font-semibold leading-tight text-midnight-navy sm:text-4xl">Created by a relationship therapist. Built for real life.</h2>
            <div className="mt-6 space-y-4 font-body text-lg leading-relaxed text-charcoal/80">
              <p>The Relationship Snapshot&trade; was created by Janelle Dawsey, a Licensed Marriage and Family Therapist, relationship educator, author, and founder of the Relationship Life Cycle&trade;.</p>
              <p>After years of helping individuals and couples navigate dating, commitment, marriage, conflict, heartbreak, and new beginnings, one pattern became clear: most people do not lack the desire for healthier relationships. They lack a clear way to understand what their relationship needs.</p>
              <p>The Relationship Life Cycle&trade; was developed to make that understanding more accessible, practical, and useful.</p>
            </div>
            <p className="mt-6 font-ui text-sm font-semibold uppercase tracking-[0.12em] text-charcoal/50">Licensed Marriage and Family Therapist • Author • Relationship Educator</p>
          </div>
        </div>
      </section>

      {/* 10 · CLARIFICATION */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-light-gray bg-white p-8 text-center sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-midnight-navy">Insight, not a diagnosis.</h2>
          <div className="mx-auto mt-4 max-w-2xl space-y-3 font-body leading-relaxed text-charcoal/75">
            <p>The Relationship Snapshot&trade; is an educational tool. It does not provide a mental health diagnosis, determine whether a relationship should continue, or replace therapy or professional support.</p>
            <p>Your results are intended to help you reflect, recognize patterns, and make more informed decisions about your next step.</p>
          </div>
        </div>
      </section>

      {/* 11 · FAQ */}
      <section id="faq" className="scroll-mt-24 px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">Frequently asked questions</h2>
          <div className="mt-10"><FaqAccordion items={FAQS} /></div>
        </div>
      </section>

      {/* 12 · FINAL CTA */}
      <section className="relative overflow-hidden px-6 py-28 text-center">
        <div className="pointer-events-none absolute right-[8%] top-10 hidden w-52 rotate-6 opacity-70 md:block">
          <ResultsPreviewMock />
        </div>
        <div className="relative mx-auto max-w-3xl">
          <h2 className="text-balance font-display text-4xl font-semibold leading-[1.08] text-midnight-navy sm:text-5xl">
            You know your relationship status. Now understand how your relationship is doing.
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-body text-lg leading-relaxed text-charcoal/80">
            Take five minutes to see what is working, what may need more attention, and what to focus on next.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3">
            <CtaButton href={START}>Take My Relationship Snapshot</CtaButton>
            <p className="font-ui text-sm text-charcoal/55">Free • Personalized • About 5 minutes</p>
          </div>
        </div>
      </section>
    </main>
  );
}
