import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SectionLabel from "@/components/site/SectionLabel";
import ClarityWaitlistForm from "@/components/site/ClarityWaitlistForm";
import { CLARITY, launchPhase } from "@/lib/datingWithClarity";

// The priority waitlist. The other half of the launch, and deliberately a
// different page rather than a different section of the sales page.
//
// ONE PRIMARY ACTION, AND IT IS NOT A PURCHASE. There is no price on this page,
// no seat counter and no checkout button anywhere on it. A waitlist that also
// sells is a sales page with a worse conversion rate, and the launch package is
// explicit about keeping the two apart.
//
// NO PRICE, ON PURPOSE. The founding tuition is set, but whether there is a
// separate public price it sits below is not, and "founding rate" printed next
// to a single price implies a discount that may not exist. The page promises
// first access, which is true today, instead of a saving that might not be.
//
// It hands over by itself. Once public enrollment opens this page stops being
// the right place to land, so it forwards to the sales page rather than sitting
// there collecting emails for a class anyone can now buy.

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Join the priority waitlist | Dating With Clarity",
  description:
    "A therapist-led dating cohort for women who want to stop guessing, recognize patterns more clearly, and make dating decisions they can trust. Founding cohort begins September 3, 2026.",
};

const CONFUSION = [
  "Am I noticing a real pattern, or overthinking one moment?",
  "Do I need more information, or have I already seen enough?",
  "Am I responding to who he is, or who I hope he could become?",
  "Does this connection deserve more of my time and energy?",
  "How do I stay open without ignoring what I see?",
];

const LEARN = [
  "Separate what happened from what you assume it means",
  "Recognize the difference between a moment and a pattern",
  "Compare someone's words with their behavior over time",
  "Ask questions that produce useful information",
  "Notice when attraction, fear, or hope is shaping interpretation",
  "Decide what a connection has actually earned",
];

const BENEFITS = [
  "First access when enrollment opens on August 17",
  "The complete class dates and program details",
  "Advance notice before enrollment opens publicly",
  `The best chance at one of the ${CLARITY.seats} founding-cohort seats`,
];

export default async function ClarityWaitlistPage() {
  // Once anyone can buy, a waitlist is just a slower way to get to the same
  // page. Send her to the thing she was looking for.
  if (launchPhase() === "public") redirect("/dating-with-clarity");

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      {/* Hero */}
      <section className="text-center">
        <SectionLabel>Founding cohort · September 2026</SectionLabel>
        <h1 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight text-midnight-navy sm:text-5xl">
          {CLARITY.name}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl font-display text-xl font-medium leading-relaxed text-midnight-navy/85 sm:text-2xl">
          You know the dating terms. But do you know what the relationship is actually showing you?
        </p>
        <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-charcoal/75">
          A therapist-led dating cohort for women who want to stop guessing, recognize patterns more
          clearly, and make dating decisions they can trust.
        </p>
        <p className="mt-4 font-body text-body text-charcoal/60">
          The founding cohort begins {CLARITY.weeks[0].date.replace(/^\w+, /, "")}.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href="#join"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-base font-medium text-white transition-colors hover:bg-midnight-navy/90"
          >
            Join the priority waitlist
          </a>
          <p className="font-body text-sm text-charcoal/55">
            Get first access before registration opens publicly. No payment is required to join.
          </p>
        </div>
      </section>

      {/* The problem */}
      <section className="mt-20 rounded-3xl bg-white/70 p-8 sm:p-12">
        <h2 className="font-display text-2xl font-medium leading-relaxed text-midnight-navy sm:text-[28px]">
          Dating advice may help you explain his behavior. But does it help you decide what to do
          next?
        </h2>
        <p className="mt-6 font-body text-lg leading-relaxed text-charcoal/75">
          Maybe you know what breadcrumbing, love bombing, attachment styles, and emotional
          unavailability mean. But when you actually like someone, the decision can still feel
          complicated.
        </p>
        <ul className="mt-6 space-y-3 border-l-2 border-midnight-navy/15 pl-5 font-body text-body leading-relaxed text-charcoal/75">
          {CONFUSION.map((c) => <li key={c}>{c}</li>)}
        </ul>
        <p className="mt-8 font-body text-lg leading-relaxed text-charcoal/75">
          You may not need another list of signs to memorize. You may need a better way to
          understand and weigh the information already in front of you.
        </p>
      </section>

      {/* What the cohort teaches */}
      <section className="mt-20">
        <SectionLabel>The cohort</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">
          A process, not a longer list of rules
        </h2>
        <p className="mt-5 font-body text-lg leading-relaxed text-charcoal/75">
          Created by licensed relationship therapist Janelle Dawsey and based on the Exploration
          phase of the Relationship Life Cycle&trade;, this live cohort will help women learn how
          to:
        </p>
        <ul className="mt-6 space-y-2.5">
          {LEARN.map((l) => (
            <li key={l} className="flex gap-3 font-body text-body leading-relaxed text-charcoal/75">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-rose" />
              {l}
            </li>
          ))}
        </ul>
        <p className="mt-8 font-body text-lg leading-relaxed text-charcoal/75">
          The goal is not to predict the future or remove all uncertainty. The goal is to gather and
          weigh enough information to make a more informed decision about deeper investment.
        </p>
      </section>

      {/* What the waitlist gets her */}
      <section className="mt-20 rounded-3xl border border-midnight-navy/10 bg-white p-8 sm:p-12">
        <SectionLabel>Why join the list</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">
          What the priority list gives you
        </h2>
        <ul className="mt-6 space-y-2.5">
          {BENEFITS.map((b) => (
            <li key={b} className="flex gap-3 font-body text-body leading-relaxed text-charcoal/75">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-rose" />
              {b}
            </li>
          ))}
        </ul>
      </section>

      {/* About Janelle */}
      <section className="mt-20">
        <SectionLabel>Who teaches it</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">
          Janelle Dawsey, LMFT
        </h2>
        <div className="mt-5 space-y-4 font-body text-lg leading-relaxed text-charcoal/75">
          <p>
            Janelle Dawsey is a Licensed Marriage and Family Therapist, author, speaker, and creator
            of the Relationship Life Cycle&trade; Framework. For more than a decade, she has helped
            individuals and couples understand relationship patterns, work through difficult
            decisions, and build healthier ways of relating.
          </p>
          <p>
            She created {CLARITY.name} to help women do more than identify dating behaviors. The
            cohort teaches women how to evaluate the relationship itself.
          </p>
        </div>
      </section>

      {/* Close + form */}
      <section id="join" className="mt-20 scroll-mt-24">
        <div className="rounded-3xl bg-midnight-navy px-8 py-12 text-center sm:px-12">
          <p className="font-display text-2xl font-medium leading-relaxed text-white">
            You do not need perfect certainty to make a clear decision. But you do need a process you
            can trust.
          </p>
          <p className="mx-auto mt-5 max-w-xl font-body text-body leading-relaxed text-white/75">
            The founding cohort begins {CLARITY.weeks[0].date.replace(/^\w+, /, "")}. Join the
            priority waitlist to be notified first when enrollment opens.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-midnight-navy/10 bg-white p-8 sm:p-10">
          <ClarityWaitlistForm classTime={CLARITY.time} />
        </div>
      </section>

      <p className="mt-12 font-body text-xs leading-relaxed text-charcoal/50">
        {CLARITY.name} is an educational program. It is not therapy, coaching, mental-health
        treatment, or a substitute for professional mental-health care. Participation does not create
        a therapist-client or coaching relationship.
      </p>
    </div>
  );
}
