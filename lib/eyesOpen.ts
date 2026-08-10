import { getSupabaseAdminClient } from "@/lib/supabase";

// Dating With Your Eyes Open — the founding cohort.
//
// A live cohort is different from every other product on this site: it has a
// fixed number of seats and a date it starts. Both are facts that change while
// the page is up, so neither is written into the copy. The page reads them from
// here, and the seat count from the database at request time.

export const EYES_OPEN = {
  /** Stripe lookup_key. The Price is the owner's to create; checkout is inert until it exists. */
  priceLookupKey: "eyes_open_founding",
  productKey: "eyes_open",
  priceUsd: 297,
  priceDisplay: "$297",
  seats: 15,
  time: "7:00–9:00 p.m.",
  datesLine: "September 3–24, 2026",
  /** First class. After this, enrollment closes — see enrolmentState. */
  startsAt: new Date("2026-09-03T19:00:00-04:00"),
  cohort: "founding-2026-09",

  /**
   * What happens when the fifteen are gone.
   *
   * Not a dead end and not a second product to buy: October's dates, size and
   * number of cohorts are not settled, and taking money for a class with no
   * date is the one thing a page like this must not do. So a full cohort
   * collects an email and says plainly that details are coming.
   */
  nextCohort: {
    leadSource: "eyes_open_october",
    label: "October cohort",
    note: "October dates and details are still being set — there may be more than one cohort running.",
  },

  /**
   * The four classes. Read by the sales page, the enrolment confirmation and
   * the welcome email, so a date or a title moves in exactly one place.
   */
  weeks: [
    {
      date: "Thursday, September 3, 2026",
      title: "How Relationships Reveal Themselves",
      body: [
        "Every new relationship begins with incomplete information.",
        "You may know how someone presents themselves, what they have told you, and how you feel around them. But character, compatibility, emotional maturity, and relational capacity are revealed through time and experience.",
        "In this class, you will learn:",
      ],
      bullets: [
        "What dating can tell you early and what requires more time",
        "The difference between an observation, an interpretation, an assumption, and a conclusion",
        "Why isolated moments can be misleading",
        "How context and repetition turn behavior into a meaningful pattern",
        "How to remain curious without ignoring important information",
        "Why clarity, not commitment, is the first goal of dating",
      ],
      close: "You will begin developing a more grounded way to understand what the relationship is actually revealing.",
    },
    {
      date: "Thursday, September 10, 2026",
      title: "What Chemistry Makes Us Believe",
      body: [
        "Chemistry is real, but it is not the same thing as compatibility.",
        "When attraction is strong, ordinary interest can feel like investment. Familiarity can feel like safety. Intensity can feel like intimacy. Potential can begin to feel like a promise.",
        "That does not mean your feelings are wrong. It means feelings can influence how you interpret the information in front of you. In this class, we will explore:",
      ],
      bullets: [
        "What chemistry can tell you and what it cannot",
        "How attention, attraction, familiarity, and urgency affect judgment",
        "Why potential can become more powerful than present reality",
        "How past relationships can shape the meaning you assign to new experiences",
        "The difference between feeling connected and building a healthy connection",
        "How to enjoy what you feel without making it responsible for the decision",
      ],
      close: "You will learn how to honor your feelings without asking them to answer questions that only time, behavior, and experience can answer.",
    },
    {
      date: "Thursday, September 17, 2026",
      title: "Can This Connection Become What You Want?",
      body: [
        "Two people can genuinely like each other and still be unable to build a healthy relationship together.",
        "A good fit requires more than attraction, shared interests, or someone checking the right boxes on paper. In this class, you will learn how to evaluate:",
      ],
      bullets: [
        "Compatibility in values, expectations, lifestyle, and long-term direction",
        "Consistency between words, choices, and behavior",
        "Reciprocity and whether investment is mutual",
        "Dependability and follow-through",
        "Emotional safety and openness",
        "Responses to boundaries, differences, disappointment, and accountability",
        "Whether someone\u2019s current capacity aligns with the relationship they say they want",
      ],
      close: "The question is not only, \u201cIs this a good person?\u201d The deeper question is, \u201cDo we have what is needed to build the kind of relationship we both say we want?\u201d",
    },
    {
      date: "Thursday, September 24, 2026",
      title: "Making the Next Clear Decision",
      body: [
        "Dating decisions are not limited to choosing whether to stay or leave. Throughout a developing relationship you are deciding whether to continue learning, ask a more direct question, slow the pace, deepen your investment, or stop dismissing a concern.",
        "In this final class, you will learn how to bring the information together. We will explore:",
      ],
      bullets: [
        "How to evaluate the full pattern rather than one high or low moment",
        "How to make decisions without demanding complete certainty",
        "What it means to pace your investment",
        "How to respond when the information is mixed",
        "Why choosing not to continue can be a successful dating outcome",
        "How to move forward without allowing fear or fantasy to make the decision for you",
      ],
      close: "You will leave with a clearer process for deciding what comes next.",
    },
  ],
} as const;

export type EnrolmentState = "open" | "full" | "closed";

/**
 * "September 3, 10, 17, and 24, 2026" — built from the weeks rather than typed.
 *
 * The details table wants the full list and the hero wants the range. Typing
 * either one is how a page ends up advertising a date the class is not on.
 */
export function datesFull(): string {
  const days = EYES_OPEN.weeks.map((w) => w.date.replace(/^\w+, /, ""));   // "September 3, 2026"
  const nums = days.map((d) => d.replace(/^\w+ /, "").replace(/, \d{4}$/, ""));
  const month = days[0].split(" ")[0];
  const year = days[0].slice(-4);
  return `${month} ${nums.slice(0, -1).join(", ")}, and ${nums[nums.length - 1]}, ${year}`;
}

/**
 * Seats still available.
 *
 * Counted from paid enrollments, never from a number someone remembers to
 * update. Resilient on purpose: if the table is not there yet the page shows a
 * full cohort rather than falling over, because a sales page that 500s is worse
 * than one that is briefly optimistic about a class nobody has bought yet.
 */
export async function seatsRemaining(): Promise<number> {
  return Math.max(0, EYES_OPEN.seats - (await seatsTaken()));
}

/**
 * Seats that are gone: paid, plus holds that have not expired.
 *
 * The expiry is applied in the query rather than by a cleanup job, so an
 * abandoned checkout frees its seat the moment its hold lapses whether or not
 * anything has run. A job that has to fire for the page to be correct is a job
 * that will one day not fire.
 */
export async function seatsTaken(): Promise<number> {
  try {
    const s = getSupabaseAdminClient();
    const [{ count: paid }, { count: held }] = await Promise.all([
      s.from("eyes_open_enrolments").select("id", { count: "exact", head: true })
        .eq("cohort", EYES_OPEN.cohort).eq("status", "paid"),
      s.from("eyes_open_enrolments").select("id", { count: "exact", head: true })
        .eq("cohort", EYES_OPEN.cohort).eq("status", "pending")
        .gt("held_until", new Date().toISOString()),
    ]);
    return (paid ?? 0) + (held ?? 0);
  } catch {
    // A sales page that 500s is worse than one briefly optimistic about a
    // class nobody has bought. The cap still holds at checkout.
    return 0;
  }
}

/**
 * Three states, because a live cohort has three.
 *
 * Selling a seat to a class that started last Thursday is worse than not
 * selling one, so the date closes enrollment even when seats remain.
 */
export function enrolmentState(seats: number, now: Date = new Date()): EnrolmentState {
  if (now >= EYES_OPEN.startsAt) return "closed";
  if (seats <= 0) return "full";
  return "open";
}
