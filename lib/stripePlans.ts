// Client-safe plan catalog for the Academy. NO server imports — the account page
// (client) imports this to render plan cards. Prices/lookup_keys mirror what was
// created in Stripe (setup script); tier names mirror lib/academy TIERS.

export type PaidTier = "academy" | "academy_plus" | "professional";
export type Interval = "month" | "year";

export interface PlanPrice {
  lookupKey: string; // stable Stripe price lookup_key
  amount: number; // in cents (USD)
}

export interface Plan {
  tier: PaidTier;
  name: string;
  tagline: string;
  features: string[];
  month: PlanPrice;
  year: PlanPrice;
}

export const PLANS: Plan[] = [
  {
    tier: "academy",
    name: "Academy",
    tagline: "The full course library",
    features: ["All Academy courses", "Journal & workbooks", "Course certificates"],
    month: { lookupKey: "academy_month", amount: 9700 },
    year: { lookupKey: "academy_year", amount: 99700 },
  },
  {
    tier: "academy_plus",
    name: "Academy Plus",
    tagline: "Everything in Relationship Academy, plus:",
    features: [
      "Interactive relationship skill practice",
      "Guided exercises that reinforce each lesson",
      "Real-life conversation and communication simulations",
      "Personalized practice recommendations",
      "Progress tracking for skill development",
      "Hands-on application of Relationship Life Cycle™ concepts",
      "Practical exercises for communication, conflict resolution, emotional intelligence, and connection",
      "On-demand practice sessions you can complete at your own pace",
      "Guided reflection and feedback after each practice session",
      "Ongoing skill reinforcement between Academy lessons",
    ],
    month: { lookupKey: "academy_plus_month", amount: 19700 },
    year: { lookupKey: "academy_plus_year", amount: 199700 },
  },
  // NOTE: Professional is NOT a consumer plan. Practitioner training lives in the
  // separate Relationship Life Cycle™ Professional Institute (/institute), which
  // has its own à-la-carte commerce (a later phase) — no membership tier here.
];

// Consumer plans shown on the member account page. (Professional practitioner
// training is a separate offering — the Professional Institute at /institute.)
export const CONSUMER_PLANS: Plan[] = PLANS;

// All valid checkout lookup keys — the checkout API validates against this.
export const VALID_LOOKUP_KEYS = new Set(
  PLANS.flatMap((p) => [p.month.lookupKey, p.year.lookupKey])
);

export function planByLookupKey(lookupKey: string): { plan: Plan; interval: Interval } | null {
  for (const plan of PLANS) {
    if (plan.month.lookupKey === lookupKey) return { plan, interval: "month" };
    if (plan.year.lookupKey === lookupKey) return { plan, interval: "year" };
  }
  return null;
}

/** Format cents as a whole-dollar USD string (prices are whole dollars). */
export function formatPrice(cents: number): string {
  return `$${Math.round(cents / 100).toLocaleString("en-US")}`;
}
