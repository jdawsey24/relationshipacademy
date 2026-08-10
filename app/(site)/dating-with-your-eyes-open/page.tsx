import type { Metadata } from "next";
import Link from "next/link";
import SectionLabel from "@/components/site/SectionLabel";
import CtaButton from "@/components/site/CtaButton";
import LeadForm from "@/components/site/LeadForm";
import { EYES_OPEN, seatsRemaining, enrolmentState, datesFull } from "@/lib/eyesOpen";

// Dating With Your Eyes Open — the founding-cohort sales page.
//
// The spine of this page is four words: Notice. Interpret. Evaluate. Decide.
// The copy opens on the gap between noticing and understanding, names those
// four steps as the answer, and closes on them again — so they are treated here
// as structure rather than as one more list. Everything else hangs off them.
//
// The other thing this page has that nothing else on the site does is a
// DEADLINE and a SEAT COUNT, both of which change while it is up. Neither is
// written into the copy: the dates come from lib/eyesOpen and the seat count is
// read at request time.

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dating With Your Eyes Open | Relationship Life Cycle™",
  description:
    "A four-week live educational series for women who want to understand what is developing, recognize the patterns that truly matter, and make clearer decisions about where a connection is going. Taught by Janelle Dawsey, LMFT.",
};

/** The through-line. Named once as the method, echoed at the close. */
const STEPS = [
  { verb: "Notice", line: "what is happening without rushing to label it" },
  { verb: "Interpret", line: "behavior within its proper context" },
  { verb: "Evaluate", line: "what developing patterns reveal about the relationship" },
  { verb: "Decide", line: "what level of investment the connection has earned" },
];

const NOT_SUSPICION = [
  "It does not mean searching for something wrong with everyone you meet.",
  "It does not mean ignoring your feelings, preparing for disappointment, or assuming every uncomfortable moment is a red flag.",
];

const PERMISSIONS = [
  "You can be hopeful without allowing hope to fill in what you do not know.",
  "You can enjoy the chemistry without asking chemistry to prove compatibility.",
  "You can like someone without deciding too early who they are or what the relationship will become.",
];

const OUTCOMES = [
  "Separate what happened from the meaning you assigned to it",
  "Tell the difference between an isolated moment and a developing pattern",
  "Understand how attraction, hope, fear, and past experiences can shape interpretation",
  "Recognize the difference between attention, intention, and actual investment",
  "Evaluate compatibility beyond shared interests and good conversation",
  "Look at consistency, reciprocity, trust, emotional safety, and follow-through",
  "Determine what can be learned through conversation and what must be observed over time",
  "Ask meaningful questions without turning a date into an interview",
  "Decide when a connection needs more time, a clearer conversation, a slower pace, or an ending",
  "Make dating decisions based on the relationship that exists, not only the relationship you hope it could become",
];

/** The clearest before/after on the page: the questions she asks now, and instead. */
const QUESTION_SWAP: [string, string][] = [
  ["Does he like me?", "What has this relationship consistently shown me?"],
  ["Was that a red flag?", "What else do I need to learn?"],
  ["Am I overthinking this?", "Is this a single moment or part of a larger pattern?"],
  ["Should I give it more time?", "What does this pattern reveal about our compatibility?"],
  ["What if I walk away too soon?", "Does this person have the capacity to build what they say they want?"],
  ["What if I am ignoring something important?", "What level of investment makes sense based on what I currently know?"],
];

const FOR_YOU = [
  "You consume a lot of dating content but still struggle to apply it to real situations",
  "You notice behaviors but are not always sure how much meaning to give them",
  "You tend to question whether you are overthinking or overlooking something",
  "You have confused strong chemistry with long-term compatibility",
  "You have stayed invested in someone's potential while waiting for the relationship to catch up",
  "You want to understand what healthy relationship development actually looks like",
  "You want to make decisions without becoming hypervigilant, cynical, or emotionally detached",
  "You are actively dating or considering returning to dating",
  "You want to feel more confident in your ability to evaluate a developing relationship",
];

const NOT_THIS = [
  "You will not learn tricks for making someone chase you.",
  "You will not receive a list of rules that supposedly guarantees commitment.",
  "You will not be taught that every uncomfortable interaction is a red flag.",
  "You will not be told to ignore your feelings or distrust everyone you meet.",
  "And you will not spend four weeks learning how to monitor someone more closely.",
];

const INCLUDED = [
  "Four live, two-hour online classes",
  "Eight hours of structured relationship education",
  "Guided educational application during each class",
  "General question-and-answer time",
  "Access to class replays",
  "Teaching grounded in the Relationship Life Cycle™ Framework",
  `A small founding cohort limited to ${EYES_OPEN.seats} women`,
];

const FAQ: { q: string; a: string[] }[] = [
  {
    q: "Is this therapy or coaching?",
    a: [
      "No. Dating With Your Eyes Open is a live educational series. Participation does not create a therapist-client or coaching relationship with Janelle Dawsey or Symmetricly.",
      "The series provides relationship education, guided reflection, and general application of the concepts being taught. It does not include mental-health treatment, clinical assessment, or individualized relationship advice.",
    ],
  },
  {
    q: "Can I ask questions during the classes?",
    a: [
      "Yes. Each class will include time for general educational questions about the material.",
      "Personal situations will not be clinically processed. Janelle will not review private messages, interpret another person's behavior based on limited information, or tell participants whether they should continue or end a specific relationship.",
    ],
  },
  {
    q: "What if I cannot attend every class live?",
    a: ["Replays are included with your enrollment. You can watch a missed class or revisit the material afterward."],
  },
  {
    q: "Do I need to be actively dating?",
    a: ["No. The series is appropriate for women who are currently dating and women who are considering returning to dating and want to approach it differently."],
  },
  {
    q: "Is this for women in established relationships?",
    a: [
      "The teaching focuses on dating and developing relationships. It is best suited for women who are single, actively dating, preparing to date, or in the early stages of getting to know someone.",
      "It is not designed to address concerns within an established partnership or marriage.",
    ],
  },
  {
    q: "Will this tell me whether someone is right for me?",
    a: [
      "No class can make that decision for you, and this series will not attempt to do so.",
      "It will teach you how to gather better information, interpret behavior in context, recognize meaningful patterns, and evaluate a connection more clearly. The purpose is not to make your decisions for you. It is to strengthen the discernment you bring to them.",
    ],
  },
  {
    q: "Is this a red-flag class?",
    a: [
      "No. Red flags may be discussed as part of understanding dating behavior, but this is not a class about searching for danger in every interaction.",
      "You will learn how to recognize both healthy and concerning patterns, understand what those patterns may reveal, and avoid reducing an entire relationship to one moment or one checklist.",
    ],
  },
  {
    q: "Will I be expected to share personal details?",
    a: [
      "No. You may privately reflect on your experiences, but you will not be required to discuss personal dating situations with the group.",
      "The live classes are designed for education, not group processing.",
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
          Dating gives you information. The hard part is knowing what it means.
        </p>
        <h1 className="mt-5 text-balance font-display text-4xl font-semibold leading-tight text-midnight-navy sm:text-5xl">
          Dating With Your Eyes Open
        </h1>
        <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-charcoal/75">
          A four-week live educational series for women who want to understand what is developing,
          recognize the patterns that truly matter, and make clearer decisions about where a
          connection is going.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <EnrolCta state={state} label="Reserve My Seat" />
          <SeatLine seats={seats} state={state} />
        </div>
      </section>

      {/* The problem is not attention */}
      <section className="mt-20 rounded-3xl bg-white/70 p-8 sm:p-12">
        <p className="font-body text-lg leading-relaxed text-charcoal/75">
          There is no shortage of dating advice telling women what to notice. Watch for red flags.
          Look for green flags. Check whether his words match his actions. Pay attention to how
          often he communicates, how quickly he plans a date, and what happens after you set a
          boundary.
        </p>
        <p className="mt-4 font-body text-lg leading-relaxed text-charcoal/75">
          At this point, women have been taught to analyze a text message like it is evidence in a trial.
        </p>
        <p className="mt-8 font-display text-2xl font-medium leading-relaxed text-midnight-navy sm:text-[28px]">
          The problem is not that you are not paying attention. The problem is that behavior does
          not arrive with an explanation attached.
        </p>
        <div className="mt-8 space-y-3 border-l-2 border-midnight-navy/15 pl-5 font-body text-body leading-relaxed text-charcoal/75">
          <p>One delayed response may mean nothing. A pattern of disappearing whenever closeness develops may mean much more.</p>
          <p>A great date can reveal chemistry. It cannot tell you whether the two of you are compatible.</p>
          <p>An apology may sound sincere. What happens afterward tells you whether repair is possible.</p>
          <p>Someone may genuinely like you and still lack the capacity to build the kind of relationship you want.</p>
        </div>
        <p className="mt-8 font-body text-lg leading-relaxed text-charcoal/75">
          Noticing what happens is only the first step. You also need to understand what it means
          within the relationship that is taking shape.
        </p>
        <p className="mt-4 font-display text-xl font-medium text-midnight-navy">
          Dating With Your Eyes Open will teach you how.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <EnrolCta state={state} label="Reserve My Seat" />
          <SeatLine seats={seats} state={state} />
        </div>
      </section>

      {/* Not another list of signs → the four steps */}
      <section className="mt-20">
        <SectionLabel>The approach</SectionLabel>
        <h2 className="mt-3 text-balance font-display text-3xl font-semibold leading-tight text-midnight-navy">
          You do not need another list of signs. You need a way to make sense of what you are
          experiencing.
        </h2>
        <div className="mt-6 space-y-4 font-body text-lg leading-relaxed text-charcoal/75">
          <p>Dating advice often treats every behavior as proof of something.</p>
          <p className="text-charcoal/55">
            If he does this, he is interested. If he says that, he is emotionally unavailable. If he
            does not text within a certain amount of time, move on. If the chemistry is strong, you
            have found something special.
          </p>
          <p className="font-display text-xl font-medium text-midnight-navy">
            But healthy discernment is more thoughtful than that.
          </p>
          <p>
            A single moment does not always tell you who someone is. A promising moment does not
            guarantee a promising relationship. And a disappointing moment does not automatically
            mean the relationship should end.
          </p>
          <p className="font-display text-xl italic text-midnight-navy">
            Meaning becomes clearer through context, consistency, repetition, and time.
          </p>
        </div>

        {/* The spine */}
        <ol className="mt-10 grid gap-4 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <li key={s.verb} className="rounded-2xl border border-midnight-navy/10 bg-white p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-midnight-navy font-ui text-sm font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-midnight-navy">{s.verb}</h3>
              <p className="mt-1 font-body text-body text-charcoal/70">{s.line}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 font-body text-body leading-relaxed text-charcoal/70">
          That is the difference between simply watching someone and truly discerning whether the
          relationship has the capacity to become what you want.
        </p>
      </section>

      {/* What it does and does not mean */}
      <section className="mt-20 rounded-3xl bg-white/70 p-8 sm:p-12">
        <h2 className="font-display text-2xl font-medium leading-relaxed text-midnight-navy sm:text-[28px]">
          Dating with your eyes open does not mean dating suspiciously.
        </h2>
        <ul className="mt-4 space-y-2 font-body text-body text-charcoal/65">
          {NOT_SUSPICION.map((n) => <li key={n}>{n}</li>)}
        </ul>
        <div className="mt-6 space-y-3 font-body text-lg leading-relaxed text-charcoal/75">
          <p>It means learning how healthy relationships develop.</p>
          <p>It means knowing which information matters, what needs more time, and what repeated patterns can reveal.</p>
          <p>It means remaining open enough to experience connection while staying grounded enough to evaluate it clearly.</p>
        </div>
        <div className="mt-8 space-y-3 border-t border-midnight-navy/10 pt-6">
          {PERMISSIONS.map((p) => (
            <p key={p} className="font-display text-lg font-medium leading-snug text-midnight-navy">{p}</p>
          ))}
        </div>
      </section>

      {/* Outcomes */}
      <section className="mt-20">
        <SectionLabel>Over four weeks</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">You will learn how to</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {OUTCOMES.map((o) => (
            <li key={o} className="flex gap-3 font-body text-body text-charcoal/75">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-midnight-navy/40" />
              {o}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center font-display text-2xl font-medium leading-snug text-midnight-navy">
          The goal is not to eliminate uncertainty.
          <br />
          The goal is to make better decisions while uncertainty still exists.
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
                <span className="font-ui text-eyebrow font-semibold uppercase text-charcoal/50">Week {i + 1}</span>
                <span className="font-ui text-sm text-charcoal/50">{w.date} &middot; {EYES_OPEN.time} ET</span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-semibold text-midnight-navy">{w.title}</h3>
              {w.body.map((para) => (
                <p key={para} className="mt-4 font-body text-body leading-relaxed text-charcoal/75">{para}</p>
              ))}
              <ul className="mt-4 space-y-2">
                {w.bullets.map((b) => (
                  <li key={b} className="flex gap-3 font-body text-body text-charcoal/75">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-midnight-navy/40" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-body text-body leading-relaxed text-charcoal/75">{w.close}</p>
            </article>
          ))}
        </div>
      </section>

      {/* The question swap */}
      <section className="mt-20">
        <div className="text-center">
          <SectionLabel>What you&apos;ll walk away with</SectionLabel>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-midnight-navy">
            Better questions than the ones you&apos;re asking now
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-body text-charcoal/70">
            By the end of the series you will have a more reliable way to understand your dating
            experiences. Instead of asking only&hellip;
          </p>
        </div>
        <div className="mt-10 space-y-3">
          {QUESTION_SWAP.map(([before, after]) => (
            <div key={before} className="grid items-center gap-3 rounded-2xl border border-midnight-navy/10 bg-white p-5 sm:grid-cols-[1fr_auto_1fr]">
              <p className="font-body text-body italic text-charcoal/50">&ldquo;{before}&rdquo;</p>
              <span aria-hidden className="hidden font-ui text-charcoal/30 sm:block">&rarr;</span>
              <p className="font-body text-body font-medium text-midnight-navy">&ldquo;{after}&rdquo;</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center font-body text-body leading-relaxed text-charcoal/70">
          You will not leave with a formula that makes every dating decision easy. You will leave
          with something more useful: a framework that helps you make those decisions more clearly.
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
          You do not have to be in a dating crisis to benefit. This series is for women who want to
          approach dating with more understanding, clarity, and intention.
        </p>

        <div className="mt-10 rounded-2xl border border-midnight-navy/10 bg-midnight-navy/[0.03] p-8">
          <h3 className="font-display text-2xl font-semibold text-midnight-navy">
            This is not another &ldquo;how to get chosen&rdquo; class
          </h3>
          <ul className="mt-4 space-y-2">
            {NOT_THIS.map((n) => <li key={n} className="font-body text-body text-charcoal/70">{n}</li>)}
          </ul>
          <p className="mt-5 font-body text-body leading-relaxed text-charcoal/75">
            This series is about learning how relationships develop and how to interpret the
            information that development gives you.
          </p>
          <p className="mt-4 font-display text-xl font-medium leading-relaxed text-midnight-navy">
            Because being chosen does not automatically mean you have chosen well. The purpose of
            dating is not simply to secure a relationship. It is to discover whether this particular
            relationship is worth continuing to build.
          </p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <EnrolCta state={state} label="I’m Ready to Date With My Eyes Open" />
          <SeatLine seats={seats} state={state} />
        </div>
      </section>

      {/* Included */}
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
        <p className="mt-6 font-body text-body leading-relaxed text-charcoal/70">
          You are encouraged to attend live so you can experience the complete series and
          participate in the general Q&amp;A. Replays will also be available if you miss a class or
          want to revisit the teaching.
        </p>
      </section>

      {/* Why this approach is different */}
      <section className="mt-20">
        <SectionLabel>Why this approach is different</SectionLabel>
        <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">
          Grounded in the Exploration phase
        </h2>
        <div className="mt-5 space-y-4 font-body text-lg leading-relaxed text-charcoal/75">
          <p>
            Dating With Your Eyes Open is grounded in the{" "}
            <Link href="/exploration" className="underline underline-offset-2 hover:text-midnight-navy">
              Exploration phase
            </Link>{" "}
            of the Relationship Life Cycle™ Framework.
          </p>
          <p>
            Exploration recognizes that every relationship begins with incomplete information. Its
            purpose is not to force certainty, rush commitment, or create attachment as quickly as
            possible.
          </p>
          <p className="font-display text-2xl font-medium text-midnight-navy">Its purpose is discernment.</p>
          <p>
            Discernment means gathering information, understanding what that information reveals,
            evaluating compatibility, and deciding whether deeper investment is appropriate.
          </p>
          <p>
            In this framework, a dating relationship does not have to become a committed
            relationship to be considered successful. Sometimes successful dating leads to deeper
            investment. Sometimes successful dating reveals that the connection should not continue.
          </p>
          <p className="font-display text-xl italic text-midnight-navy">Both outcomes can represent clarity.</p>
          <p>
            You are not learning how to make every relationship work. You are learning how to better
            understand which relationships can.
          </p>
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
            decisions, and developmental challenges that shape relationships — from dating and
            commitment through marriage, separation, heartbreak, and rebuilding.
          </p>
          <p>
            Janelle&apos;s work moves beyond generic dating advice and one-size-fits-all
            relationship rules. She teaches people how relationships develop, what different stages
            require, and how to make informed decisions based on more than chemistry, fear,
            pressure, or potential.
          </p>
          <p>
            Dating With Your Eyes Open brings that developmental understanding into the dating
            process so women can make sense of what they are experiencing without being taught to
            fear connection or ignore important information.
          </p>
        </div>
      </section>

      {/* Details */}
      <section className="mt-20">
        <div className="text-center">
          <SectionLabel>Founding cohort</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">The details</h2>
        </div>
        <dl className="mx-auto mt-8 max-w-lg divide-y divide-midnight-navy/10 rounded-2xl border border-midnight-navy/10 bg-white">
          {[
            ["Dates", datesFull()],
            ["Time", `${EYES_OPEN.time} ET`],
            ["Format", "Live online educational series"],
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

      {/* October — only once September cannot take her */}
      {state !== "open" && (
        <section id="october" className="mt-20 scroll-mt-24 rounded-3xl border border-midnight-navy/10 bg-white p-8 sm:p-12">
          <SectionLabel>What&apos;s next</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">
            The {EYES_OPEN.nextCohort.label}
          </h2>
          <div className="mt-5 max-w-2xl space-y-4 font-body text-body leading-relaxed text-charcoal/75">
            <p>
              {state === "full"
                ? `All ${EYES_OPEN.seats} founding seats are taken. The series runs again on Thursday evenings in October.`
                : "The founding cohort has already begun. The series runs again on Thursday evenings in October."}
            </p>
            <p>{EYES_OPEN.nextCohort.note}</p>
            <p className="text-charcoal/60">
              Leave your email and you&apos;ll hear the dates first — before the page goes up.
              Nothing is charged now, and there&apos;s nothing to hold you to.
            </p>
          </div>
          <div className="mt-8 max-w-lg">
            <LeadForm
              source={EYES_OPEN.nextCohort.leadSource}
              fields={["name", "email"]}
              submitLabel="Tell me when October opens"
              successMessage="You're on the list. You'll get the October dates before they're announced anywhere else."
            />
          </div>
        </section>
      )}

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

      {/* Close — the spine again */}
      <section className="mt-20 rounded-3xl bg-midnight-navy px-8 py-14 text-center sm:px-12">
        <p className="font-display text-2xl font-medium text-white">You are already paying attention.</p>
        <p className="mt-2 font-display text-2xl font-medium text-white/85">
          Now it is time to understand what the relationship is showing you.
        </p>
        <div className="mx-auto mt-8 max-w-xl space-y-2.5 font-body text-lg leading-relaxed text-white/80">
          <p>You can enjoy someone&apos;s attention without confusing it with investment.</p>
          <p>You can experience chemistry without using it as proof of compatibility.</p>
          <p>You can allow a connection to develop without deciding too early what it will become.</p>
          <p>You can remain hopeful while still making decisions based on what is real.</p>
        </div>
        <p className="mx-auto mt-8 max-w-xl font-body text-body text-white/70">
          Dating With Your Eyes Open will teach you how to move from noticing individual signs to
          understanding the full relationship.
        </p>
        <p className="mt-8 font-display text-3xl font-semibold tracking-tight text-white">
          Notice. Interpret. Evaluate. Decide.
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
        Dating With Your Eyes Open is an educational program. It is not therapy, coaching,
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
 * series already started. A full cohort is not a dead end — it points at October.
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
  return (
    <CtaButton href="#october" variant={onDark ? "accent" : "secondary"}>
      Join the {EYES_OPEN.nextCohort.label} list
    </CtaButton>
  );
}

/** The honest line under the button. Never a fake scarcity number. */
function SeatLine({ seats, state, onDark = false }: {
  seats: number; state: ReturnType<typeof enrolmentState>; onDark?: boolean;
}) {
  const muted = onDark ? "text-white/70" : "text-charcoal/50";
  if (state === "closed") {
    return <p className={`font-body text-sm ${muted}`}>The September cohort has already begun.</p>;
  }
  if (state === "full") {
    return (
      <p className={`font-body text-sm ${muted}`}>
        All {EYES_OPEN.seats} September seats are taken — the next cohort runs in October.
      </p>
    );
  }
  return (
    <p className={`font-body text-sm ${muted}`}>
      {EYES_OPEN.priceDisplay} &middot;{" "}
      {seats === 1 ? "1 seat left" : `${seats} of ${EYES_OPEN.seats} seats left`}
    </p>
  );
}
