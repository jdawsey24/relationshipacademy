import type { Metadata } from "next";
import Link from "next/link";
import SectionLabel from "@/components/site/SectionLabel";
import CtaButton from "@/components/site/CtaButton";
import { EYES_OPEN, seatsRemaining, enrolmentState } from "@/lib/eyesOpen";

// Dating With Your Eyes Open — the founding-cohort sales page.
//
// Unlike the Playbook and the Companion, this product has a DEADLINE and a
// SEAT COUNT. Both are live facts, so neither is written into the copy: the
// dates come from lib/eyesOpen and the seat count is read at request time. A
// page that still says "15 seats" after eleven have sold, or "September 3"
// the week after, costs more trust than it saves effort.

export const dynamic = "force-dynamic";   // seats sell while the page is cached

export const metadata: Metadata = {
  title: "Dating With Your Eyes Open | Relationship Life Cycle™",
  description:
    "A four-week live educational series for women who want to enjoy dating without letting chemistry, attention, hope, or potential cloud what the relationship is actually showing them. Taught by Janelle Dawsey, LMFT.",
};

const OUTCOMES = [
  "Separate what is happening from what you hope will happen",
  "Recognize when chemistry and attention are influencing your judgment",
  "Pay attention to patterns instead of relying only on promises",
  "Evaluate compatibility, consistency, reciprocity, trust, and emotional safety",
  "Ask questions that help you learn who someone really is",
  "Pace your emotional investment while a connection is still developing",
  "Make clearer decisions about whether to continue investing",
  "Date without abandoning your standards, instincts, or discernment",
];

const FOR_YOU = [
  "You tend to become emotionally invested before you have enough information",
  "You have overlooked concerns because the chemistry felt strong",
  "You keep finding yourself in similar dating situations with different people",
  "You struggle to tell the difference between someone's potential and their actual capacity",
  "You want to ask better questions without making dating feel like an interview",
  "You are tired of advice focused on getting chosen instead of choosing well",
  "You want to return to dating with greater clarity",
  "You want to enjoy connection without losing sight of yourself",
];

const NOT_THIS = [
  "You will not learn tricks for making someone chase you.",
  "You will not receive a list of rules designed to guarantee commitment.",
  "You will not be told to ignore your feelings or assume everyone has bad intentions.",
  "And you will not be taught that every uncomfortable moment is a red flag.",
];

const INCLUDED = [
  "Four live, two-hour online classes",
  "Eight hours of instruction, guided educational application, and general Q&A",
  "Access to the class replays",
  "Practical concepts you can apply while dating",
  "Teaching grounded in the Relationship Life Cycle™ Framework",
  `A small founding cohort limited to ${EYES_OPEN.seats} women`,
];

const FAQ = [
  {
    q: "Is this therapy or coaching?",
    a: [
      "No. Dating With Your Eyes Open is a live educational series. Participation does not establish a therapist-client or coaching relationship with Janelle Dawsey or Symmetricly.",
      "The series provides relationship education, guided reflection, and general application of the concepts being taught. It does not provide mental-health treatment, clinical assessment, or individualized relationship advice.",
    ],
  },
  {
    q: "Can I ask questions during the classes?",
    a: [
      "Yes. Each class will include time for general educational questions.",
      "Questions should focus on understanding and applying the concepts being taught. Personal situations will not be clinically processed, and Janelle will not review private conversations, interpret someone else's behavior, or tell participants whether to continue or end a relationship.",
    ],
  },
  {
    q: "What if I cannot attend every class live?",
    a: ["Replays are included with your enrollment. You can review a missed class or revisit the material after attending live."],
  },
  {
    q: "Do I need to be actively dating?",
    a: ["No. The series is appropriate for women who are currently dating as well as women who are considering returning to dating and want to approach it with greater clarity."],
  },
  {
    q: "Is this only for single women?",
    a: [
      "The teaching is focused on dating and developing relationships. It is best suited for women who are single, dating, or in the early stages of getting to know someone.",
      "It is not designed to address established relationship or marital concerns.",
    ],
  },
  {
    q: "Will this tell me whether someone is right for me?",
    a: [
      "No class can make that decision for you. What this series will do is teach you how to gather better information, recognize meaningful patterns, and evaluate a connection more clearly.",
      "The goal is not to make your dating decisions for you. It is to strengthen the discernment you bring to those decisions.",
    ],
  },
  {
    q: "Is this a red-flag class?",
    a: [
      "No. Dating with your eyes open does not mean searching for something wrong with everyone you meet.",
      "You will learn how to notice both healthy and concerning patterns so that you can evaluate the whole relationship instead of viewing it through fear, fantasy, or chemistry alone.",
    ],
  },
];

export default async function DatingWithYourEyesOpenPage() {
  const seats = await seatsRemaining();
  const state = enrolmentState(seats);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      {/* Hero */}
      <section className="text-center">
        <p className="font-body text-lg italic text-charcoal/70 sm:text-xl">
          You don&apos;t have to stop being hopeful. You just need to keep paying attention.
        </p>
        <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight text-midnight-navy sm:text-5xl">
          Dating With Your Eyes Open
        </h1>
        <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-charcoal/75">
          A four-week live educational series for women who want to enjoy dating without letting
          chemistry, attention, hope, or potential cloud what the relationship is actually showing them.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <EnrolCta state={state} label="Reserve My Seat" />
          <SeatLine seats={seats} state={state} />
        </div>
      </section>

      {/* The problem, in her words */}
      <section className="mt-20 rounded-3xl bg-white/70 p-8 sm:p-12">
        <p className="font-display text-2xl font-medium leading-relaxed text-midnight-navy sm:text-[28px]">
          Dating is supposed to help you learn who someone is.
        </p>
        <div className="mt-5 space-y-4 font-body text-lg leading-relaxed text-charcoal/75">
          <p>
            But once you like them, it can become harder to separate what you are actually seeing
            from what you hope the connection could become.
          </p>
          <ul className="space-y-2 border-l-2 border-midnight-navy/15 pl-5">
            <li>You notice that their words and actions do not always match, but you give it more time.</li>
            <li>You feel yourself investing more, even though you are still waiting for clarity.</li>
            <li>You know something feels off, but you wonder if you are overthinking it.</li>
            <li>Or maybe everything feels good, but you are not sure whether &ldquo;good chemistry&rdquo; means this is actually a good fit.</li>
          </ul>
          <p>
            Dating With Your Eyes Open will teach you how to stay open to connection while making
            clearer, more informed decisions about who deserves deeper access to you.
          </p>
        </div>
      </section>

      {/* The reframe */}
      <section className="mt-20">
        <SectionLabel>Why this is different</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">
          Dating advice often teaches women how to be chosen.
        </h2>
        <div className="mt-5 space-y-4 font-body text-lg leading-relaxed text-charcoal/75">
          <p className="text-charcoal/60">
            How long to wait before texting. How to keep someone interested. How to avoid looking
            too eager. How to become the kind of woman someone wants to commit to.
          </p>
          <p className="font-display text-xl font-medium text-midnight-navy">
            But being chosen does not automatically mean you have chosen well.
          </p>
          <p>The more important question is not only:</p>
          <p className="pl-5 italic text-charcoal/60">&ldquo;Does this person like me?&rdquo;</p>
          <p>It is also:</p>
          <p className="pl-5 font-display text-xl italic text-midnight-navy">
            &ldquo;What is this relationship showing me, and is what I&apos;m seeing worthy of deeper investment?&rdquo;
          </p>
          <p>
            Dating With Your Eyes Open is not about becoming suspicious, detached, or afraid of
            getting hurt. It is about learning how to remain hopeful without allowing hope to make
            the decision for you.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-midnight-navy/10 bg-white p-8">
          <SectionLabel>Over four weeks, you will learn how to</SectionLabel>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {OUTCOMES.map((o) => (
              <li key={o} className="flex gap-3 font-body text-body text-charcoal/75">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-midnight-navy/40" />
                {o}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-center font-display text-2xl font-medium text-midnight-navy">
          You do not need another list of dating rules.
          <br />
          You need to know what you are looking at.
        </p>
      </section>

      {/* The four weeks */}
      <section className="mt-20">
        <div className="text-center">
          <SectionLabel>What we&apos;ll cover</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">Four Thursday evenings</h2>
        </div>
        <div className="mt-10 space-y-6">
          {EYES_OPEN.weeks.map((w, i) => (
            <article key={w.title} className="rounded-2xl border border-midnight-navy/10 bg-white p-8">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-ui text-eyebrow font-semibold uppercase text-charcoal/50">
                  Week {i + 1}
                </span>
                <span className="font-ui text-sm text-charcoal/50">
                  {w.date} &middot; {EYES_OPEN.time}
                </span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-semibold text-midnight-navy">{w.title}</h3>
              {w.body.map((para) => (
                <p key={para} className="mt-4 font-body text-body leading-relaxed text-charcoal/75">{para}</p>
              ))}
              {w.bullets.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {w.bullets.map((b) => (
                    <li key={b} className="flex gap-3 font-body text-body text-charcoal/75">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-midnight-navy/40" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {w.close && (
                <p className="mt-4 font-body text-body leading-relaxed text-charcoal/75">{w.close}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section className="mt-20 rounded-3xl bg-white/70 p-8 sm:p-12">
        <SectionLabel tone="sage">What&apos;s included</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">Your enrollment includes</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {INCLUDED.map((f) => (
            <li key={f} className="flex gap-3 font-body text-body text-charcoal/75">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-midnight-navy/40" />
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-6 font-body text-body text-charcoal/70">
          This is a live educational experience. You are encouraged to attend in real time, but
          replays will be available if you cannot attend every class.
        </p>
      </section>

      {/* Fit */}
      <section className="mt-20">
        <SectionLabel>Is this for you?</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">
          This series may be for you if&hellip;
        </h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {FOR_YOU.map((f) => (
            <li key={f} className="flex gap-3 font-body text-body text-charcoal/75">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-midnight-navy/40" />
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-6 font-body text-body leading-relaxed text-charcoal/75">
          You do not have to be in the middle of a dating crisis to benefit. This series is also
          appropriate for women preparing to return to dating who want to approach it differently
          this time.
        </p>

        <div className="mt-10 rounded-2xl border border-midnight-navy/10 bg-midnight-navy/[0.03] p-8">
          <h3 className="font-display text-2xl font-semibold text-midnight-navy">
            This is not another &ldquo;how to get the man&rdquo; class.
          </h3>
          <ul className="mt-4 space-y-2">
            {NOT_THIS.map((n) => (
              <li key={n} className="font-body text-body text-charcoal/70">{n}</li>
            ))}
          </ul>
          <p className="mt-5 font-body text-body leading-relaxed text-charcoal/75">
            Instead, you will learn how to remain present, curious, and open while paying attention
            to the information a developing relationship gives you.
          </p>
          <p className="mt-4 font-display text-xl font-medium leading-relaxed text-midnight-navy">
            Because the goal is not simply to avoid the wrong person. The goal is to become more
            confident in your ability to recognize what is healthy, what is mutual, and what is
            actually right for you.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <EnrolCta state={state} label="I’m Ready to Date With My Eyes Open" />
          <SeatLine seats={seats} state={state} />
        </div>
      </section>

      {/* Instructor */}
      <section className="mt-20 rounded-3xl bg-white/70 p-8 sm:p-12">
        <SectionLabel tone="sage">Your instructor</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">Janelle Dawsey, LMFT</h2>
        <div className="mt-5 space-y-4 font-body text-body leading-relaxed text-charcoal/75">
          <p>
            Janelle Dawsey is a licensed marriage and family therapist, relationship educator,
            author, and creator of the Relationship Life Cycle™ Framework.
          </p>
          <p>
            For more than a decade, she has helped individuals and couples understand the patterns,
            decisions, and developmental challenges that shape their relationships — from dating and
            commitment through marriage, separation, heartbreak, and rebuilding.
          </p>
          <p>
            Janelle&apos;s work goes beyond generic dating advice. She teaches women how to
            understand relationships as they develop, recognize what different stages require, and
            make decisions based on more than chemistry, fear, pressure, or potential.
          </p>
          <p>
            Dating With Your Eyes Open is grounded in the{" "}
            <Link href="/exploration" className="underline underline-offset-2 hover:text-midnight-navy">
              Exploration phase
            </Link>{" "}
            of the Relationship Life Cycle™ Framework, where the primary task is discernment:
            gathering information, observing patterns, evaluating compatibility, and deciding
            whether a connection has earned deeper investment.
          </p>
        </div>
      </section>

      {/* Details + enrol */}
      <section className="mt-20">
        <div className="text-center">
          <SectionLabel>Founding cohort</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">The details</h2>
        </div>
        <dl className="mx-auto mt-8 max-w-lg divide-y divide-midnight-navy/10 rounded-2xl border border-midnight-navy/10 bg-white">
          {[
            ["Dates", EYES_OPEN.datesLine],
            ["Time", `${EYES_OPEN.time} ET`],
            ["Format", "Live online educational classes"],
            ["Replays", "Included"],
            ["Founding cohort tuition", EYES_OPEN.priceDisplay],
            ["Availability", `Limited to ${EYES_OPEN.seats} participants`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6 px-6 py-4">
              <dt className="font-ui text-sm font-medium text-charcoal/60">{k}</dt>
              <dd className="text-right font-body text-body text-midnight-navy">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-center font-body text-body text-charcoal/70">
          Your {EYES_OPEN.priceDisplay} payment reserves your place for the complete four-week series.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <EnrolCta state={state} label="Enroll in the Founding Cohort" />
          <SeatLine seats={seats} state={state} />
          <p className="font-body text-xs text-charcoal/45">
            Review the{" "}
            <Link href="/refund" className="underline underline-offset-2 hover:text-midnight-navy">Refund Policy</Link>{" "}
            and{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-midnight-navy">Terms</Link>{" "}
            before enrolling.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-20">
        <div className="text-center">
          <SectionLabel>Questions</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">Frequently asked</h2>
        </div>
        <div className="mt-10 space-y-4">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-midnight-navy/10 bg-white p-6">
              <summary className="cursor-pointer list-none font-display text-xl font-semibold text-midnight-navy marker:content-none">
                {f.q}
              </summary>
              {f.a.map((para) => (
                <p key={para} className="mt-3 font-body text-body leading-relaxed text-charcoal/75">{para}</p>
              ))}
            </details>
          ))}
        </div>
      </section>

      {/* Close */}
      <section className="mt-20 rounded-3xl bg-midnight-navy px-8 py-14 text-center sm:px-12">
        <div className="mx-auto max-w-xl space-y-3 font-display text-2xl font-medium leading-snug text-white">
          <p>You can like someone and still take your time learning who they are.</p>
          <p>You can be excited and still ask important questions.</p>
          <p>You can enjoy the chemistry and still pay attention to compatibility.</p>
          <p>You can remain open to love without handing your discernment over to your feelings.</p>
        </div>
        <p className="mt-6 font-body text-lg text-white/80">
          Dating With Your Eyes Open will teach you how.
        </p>
        <p className="mt-8 font-body text-body text-white/70">
          Four Thursdays. Eight hours of live education. {EYES_OPEN.seats} founding-cohort seats.
          <br />
          Join us {EYES_OPEN.datesLine} from {EYES_OPEN.time} ET.
          <br />
          Founding cohort tuition: {EYES_OPEN.priceDisplay}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <EnrolCta state={state} label="Reserve My Seat" onDark />
          <SeatLine seats={seats} state={state} onDark />
        </div>
      </section>

      <p className="mt-12 font-body text-xs leading-relaxed text-charcoal/50">
        Dating With Your Eyes Open is an educational program and is not therapy, coaching,
        mental-health treatment, or a substitute for professional mental-health care. Participation
        does not create a therapist-client or coaching relationship.
      </p>
    </div>
  );
}

/**
 * The buy button, which is only a buy button while there is something to buy.
 *
 * Three states, because a live cohort has three: seats left, sold out, and the
 * series already started. Selling a seat to a class that began last Thursday is
 * worse than not selling one.
 */
function EnrolCta({ state, label, onDark = false }: {
  state: ReturnType<typeof enrolmentState>; label: string; onDark?: boolean;
}) {
  if (state === "open") {
    return (
      <CtaButton href="/dating-with-your-eyes-open/enroll" variant={onDark ? "accent" : "primary"}>
        {label}
      </CtaButton>
    );
  }
  const text = state === "full" ? "Founding cohort is full" : "Enrollment has closed";
  return (
    <span className={`inline-flex min-h-[52px] items-center justify-center rounded-full px-8 font-ui text-base font-medium ${
      onDark ? "border border-white/25 bg-white/10 text-white/70" : "border border-midnight-navy/20 bg-white/60 text-charcoal/60"
    }`}>
      {text}
    </span>
  );
}

/** The honest line under the button. Never a fake scarcity number. */
function SeatLine({ seats, state, onDark = false }: {
  seats: number; state: ReturnType<typeof enrolmentState>; onDark?: boolean;
}) {
  const muted = onDark ? "text-white/70" : "text-charcoal/50";
  if (state === "closed") {
    return <p className={`font-body text-sm ${muted}`}>This cohort has already begun.</p>;
  }
  if (state === "full") {
    return <p className={`font-body text-sm ${muted}`}>All {EYES_OPEN.seats} seats are taken.</p>;
  }
  return (
    <p className={`font-body text-sm ${muted}`}>
      {EYES_OPEN.priceDisplay} &middot;{" "}
      {seats === 1 ? "1 seat left" : `${seats} of ${EYES_OPEN.seats} seats left`}
    </p>
  );
}
