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
  datesLine: "September 3–24",
  /** First class. After this, enrollment closes — see enrolmentState. */
  startsAt: new Date("2026-09-03T19:00:00-04:00"),

  weeks: [
    {
      date: "Thursday, September 3",
      title: "What Are You Actually Seeing?",
      body: [
        "When you are interested in someone, it is easy to fill in what you do not yet know with what you hope is true.",
        "During this class, you will learn how to distinguish between:",
      ],
      bullets: [
        "What you have directly observed",
        "What someone has told you",
        "What you have assumed",
        "What you are hoping the relationship will become",
      ],
      close:
        "We will explore how expectations, attraction, fear, and previous experiences can affect the meaning you assign to someone's behavior. The goal is not to become cynical. The goal is to see the person and the relationship more clearly.",
    },
    {
      date: "Thursday, September 10",
      title: "When Chemistry Clouds the Picture",
      body: [
        "Chemistry can tell you that you are attracted to someone. It cannot tell you whether that person is consistent, compatible, emotionally available, or prepared for the kind of relationship you want.",
        "During this class, we will examine how:",
      ],
      bullets: [
        "Attention can feel like investment",
        "Intensity can feel like intimacy",
        "Potential can feel like compatibility",
        "Urgency can create premature attachment",
        "Being desired can distract you from evaluating the person doing the desiring",
      ],
      close:
        "You will learn how to enjoy chemistry without asking it to answer questions that only time and observation can answer.",
    },
    {
      date: "Thursday, September 17",
      title: "Is This Really a Good Fit?",
      body: [
        "Someone can be attractive, successful, interesting, and genuinely interested in you without being a healthy fit for your life.",
        "This class will teach you what to consider beyond whether you like each other. We will explore:",
      ],
      bullets: [
        "Consistency between words and behavior",
        "Reciprocity and mutual effort",
        "Compatibility in values, expectations, and lifestyle",
        "Emotional safety and openness",
        "Dependability and follow-through",
        "How someone responds to boundaries, differences, and disappointment",
      ],
      close:
        "You will learn how to assess the relationship that is actually developing instead of grading the person on who they might eventually become.",
    },
    {
      date: "Thursday, September 24",
      title: "Making Clearer Dating Decisions",
      body: [
        "Dating decisions are not limited to choosing whether to stay or walk away. You are constantly deciding:",
      ],
      bullets: [
        "How much access to give",
        "How quickly to invest",
        "What questions need to be asked",
        "What needs more time and observation",
        "What should not be explained away",
        "Whether the connection has earned its next level",
      ],
      close:
        "In our final class, you will learn a clearer approach to pacing, observing, asking questions, and deciding whether a developing relationship deserves more of you. You will leave with a more grounded way to date without letting fear close your heart or allowing feelings to close your eyes.",
    },
  ],
} as const;

export type EnrolmentState = "open" | "full" | "closed";

/**
 * Seats still available.
 *
 * Counted from paid enrollments, never from a number someone remembers to
 * update. Resilient on purpose: if the table is not there yet the page shows a
 * full cohort rather than falling over, because a sales page that 500s is worse
 * than one that is briefly optimistic about a class nobody has bought yet.
 */
export async function seatsRemaining(): Promise<number> {
  try {
    const s = getSupabaseAdminClient();
    const { count, error } = await s
      .from("eyes_open_enrolments")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid");
    if (error) return EYES_OPEN.seats;
    return Math.max(0, EYES_OPEN.seats - (count ?? 0));
  } catch {
    return EYES_OPEN.seats;
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
