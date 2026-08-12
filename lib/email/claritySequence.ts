import { CLARITY } from "@/lib/datingWithClarity";

// The Dating With Clarity launch emails: six on the waitlist, eight on
// enrollment. Copy is the owner's, from the launch package (Section 8), with the
// resolved facts substituted and nothing invented.
//
// TWO THINGS MAKE THIS DIFFERENT FROM THE OTHER SEQUENCES ON THIS SITE.
//
// 1. IT IS A CALENDAR, NOT A DRIP. Every step after the confirmation goes out on
//    a named date because it refers to a real event on a real day. "Priority
//    enrollment opens tomorrow" is only true on August 16. So a step carries a
//    date, not an offset, and a step that missed its moment is dropped rather
//    than sent late (see STALE_AFTER_HOURS in lib/clarity/sequences.ts).
//
// 2. EIGHT OF THE FOURTEEN QUOTE A DEADLINE THAT IS NOT DECIDED. The launch
//    package says, in its own words, never invent an unresolved business term.
//    So `v.deadline()` THROWS when the date it is asked for is still null. A
//    step that quotes a deadline therefore cannot render until the owner sets
//    one, and cannot be shipped with a bracket in it. Steps declare what they
//    need in `needs`; the sender skips a step whose needs are unmet, and a test
//    renders every step with nothing resolved to prove the two agree.
//
// House rule from the package, and it is not the same as the rest of the site:
// no em dashes in this voice.

const SITE = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";
const NAVY = "#1C3557", CORAL = "#D9777D", IVORY = "#F7F4EF", CHARCOAL = "#333333";

/** The two owner decisions the copy depends on. */
export type Deadline = "priority" | "enrollment";

export class UnresolvedDecision extends Error {
  constructor(readonly deadline: Deadline) {
    super(`The ${deadline} deadline has not been decided, so this email cannot be rendered.`);
    this.name = "UnresolvedDecision";
  }
}

export interface Vars {
  firstName: string | null;
  salesUrl: string;
  waitlistUrl: string;
  guideUrl: string;
  unsubscribeUrl: string;
  /**
   * Whether enrollment is open at the moment this is being SENT.
   *
   * W1 is the only step that needs this, and it needs it because it is the only
   * step with no send date: it goes out whenever she signs up, which may be
   * before enrollment opens or after. Every other step knows what day it is
   * from its own place in the calendar.
   */
  priorityOpen: boolean;
  /** Throws UnresolvedDecision rather than returning a placeholder. */
  deadline: (which: Deadline) => string;
}

export interface Step {
  key: string;
  /** Sent the moment she signs up rather than on a date. */
  onSignup?: true;
  sendOn?: Date;
  needs?: Deadline[];
  subject: string;
  preview: string;
  body: (v: Vars) => { html: string; text: string };
}

// ── layout ────────────────────────────────────────────────────────────────────

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const hi = (v: Vars) => `Hi ${esc(v.firstName ?? "there")},`;
const hiText = (v: Vars) => `Hi ${v.firstName ?? "there"},`;

const p = (t: string) => `<tr><td style="font-size:17px;line-height:1.65;color:${CHARCOAL};padding:6px 0;">${t}</td></tr>`;
const h1 = (t: string) => `<tr><td style="font-size:25px;line-height:1.3;color:${NAVY};font-weight:600;padding:6px 0 10px;">${t}</td></tr>`;
const ul = (items: string[]) =>
  `<tr><td style="padding:6px 0;"><ul style="margin:0;padding-left:22px;">${items
    .map((i) => `<li style="font-size:17px;line-height:1.65;color:${CHARCOAL};padding:3px 0;">${i}</li>`)
    .join("")}</ul></td></tr>`;

function layout(inner: string, v: Vars, cta?: { label: string; url: string }): string {
  const btn = cta
    ? `<tr><td style="padding:14px 0 4px;"><a href="${cta.url}" style="display:inline-block;background:${CORAL};color:#fff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 30px;border-radius:9999px;">${cta.label}</a></td></tr>`
    : "";
  return `<!doctype html><html><body style="margin:0;padding:0;background:${IVORY};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${IVORY};padding:28px 12px;"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;padding:36px 32px;font-family:Georgia,serif;color:${CHARCOAL};">
      <tr><td style="padding-bottom:8px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8a8a8a;">${CLARITY.name}</td></tr>
      ${inner}${btn}
      <tr><td style="font-size:17px;line-height:1.65;color:${CHARCOAL};padding:22px 0 0;">Janelle</td></tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;padding:18px 32px;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#9a9a9a;"><tr><td>
      You're receiving this because you joined the priority list for ${CLARITY.name}.<br/>
      <a href="${v.unsubscribeUrl}" style="color:#9a9a9a;">Unsubscribe</a> &middot; Janelle Dawsey, LMFT &middot; Relationship Life Cycle&trade;<br/>
      ${CLARITY.name} is educational and is not therapy or a substitute for mental-health care.
    </td></tr></table>
  </td></tr></table></body></html>`;
}

const foot = (v: Vars) =>
  // A rule separator rather than an em dash: the plain-text footer has to hold
  // to the same no-em-dash rule the copy does, because the test cannot tell the
  // difference between punctuation and a horizontal rule and should not try.
  `\n\nJanelle\n\n---\nYou're receiving this because you joined the priority list for ${CLARITY.name}.\nUnsubscribe: ${v.unsubscribeUrl}\nJanelle Dawsey, LMFT · Relationship Life Cycle\n${CLARITY.name} is educational and is not therapy or a substitute for mental-health care.`;

/** Local helper: the launch-package dates, in the timezone the class runs in. */
const on = (iso: string) => new Date(iso);

// ── A. The priority waitlist: six emails ──────────────────────────────────────

export const WAITLIST_SEQUENCE: Step[] = [
  {
    // THE ONLY STEP THAT HAS TO ASK WHAT DAY IT IS. Everything else is dated, so
    // its copy can assume where it sits in the launch. This one goes out
    // whenever she signs up.
    //
    // Before August 17 it promises a link that is coming. From the 17th that
    // promise is false, and worse, W4 — the email actually carrying the link —
    // has already gone out, so a woman arriving from the video a day late would
    // be told to wait for something she had already missed. She gets the link.
    key: "w1",
    onSignup: true,
    subject: `You're on the priority list`,
    preview: `${CLARITY.name} begins September 3.`,
    body: (v) => v.priorityOpen ? {
      html: layout(
        h1("You're on the priority list") +
          p(hi(v)) +
          p(`You're officially on the priority list for ${esc(CLARITY.name)}.`) +
          p("This cohort is for women who know the dating language but still want a clearer way to understand what a connection is showing them, and to decide what it has actually earned.") +
          p("The founding cohort begins September 3, and enrollment is open right now. You can see the complete details and take a seat here.") +
          p(`Your copy of <a href="${v.guideUrl}" style="color:${NAVY};">${esc(CLARITY.guide.title)}</a> is here whenever you want it again.`),
        v,
        { label: "View the details and enroll", url: v.salesUrl },
      ),
      text: `${hiText(v)}\n\nYou're officially on the priority list for ${CLARITY.name}.\n\nThis cohort is for women who know the dating language but still want a clearer way to understand what a connection is showing them, and to decide what it has actually earned.\n\nThe founding cohort begins September 3, and enrollment is open right now. You can see the complete details and take a seat here:\n${v.salesUrl}\n\nYour copy of ${CLARITY.guide.title} is here whenever you want it again:\n${v.guideUrl}${foot(v)}`,
    } : {
      html: layout(
        h1("You're on the priority list") +
          p(hi(v)) +
          p(`You're officially on the priority list for ${esc(CLARITY.name)}.`) +
          p("This cohort is for women who know the dating language but still want a clearer way to understand what a connection is showing them, and to decide what it has actually earned.") +
          p("The founding cohort begins September 3, and priority enrollment opens August 17. I'll send you the complete details before registration opens publicly.") +
          p("Until then, hit reply and tell me this: what dating decision do you wish you felt more confident making?") +
          p("I'm reading the replies, because I want this experience grounded in the decisions women are actually trying to make.") +
          p(`Your copy of <a href="${v.guideUrl}" style="color:${NAVY};">${esc(CLARITY.guide.title)}</a> is here whenever you want it again.`),
        v,
      ),
      text: `${hiText(v)}\n\nYou're officially on the priority list for ${CLARITY.name}.\n\nThis cohort is for women who know the dating language but still want a clearer way to understand what a connection is showing them, and to decide what it has actually earned.\n\nThe founding cohort begins September 3, and priority enrollment opens August 17. I'll send you the complete details before registration opens publicly.\n\nUntil then, hit reply and tell me this: what dating decision do you wish you felt more confident making?\n\nI'm reading the replies, because I want this experience grounded in the decisions women are actually trying to make.\n\nYour copy of ${CLARITY.guide.title} is here whenever you want it again:\n${v.guideUrl}${foot(v)}`,
    },
  },
  {
    key: "w2",
    sendOn: on("2026-08-14T13:00:00Z"),
    subject: "You know the terms. Now what?",
    preview: "A label may explain behavior without helping you make a decision.",
    body: (v) => ({
      html: layout(
        h1("You know the terms. Now what?") +
          p(hi(v)) +
          p("A woman can know what breadcrumbing means, understand attachment styles, and recognize emotional unavailability. Then she meets somebody she actually likes and still wonders, &ldquo;Okay, but what am I supposed to do with this?&rdquo;") +
          p(`That is the gap ${esc(CLARITY.name)} was built to address.`) +
          p("A label may offer one possible explanation for someone's behavior. It does not automatically tell you whether the relationship is compatible, whether the behavior is a pattern, or whether deeper investment makes sense.") +
          p("Dating requires more than naming behavior. It requires learning how to weigh what you see.") +
          p("Priority enrollment opens August 17. You'll receive the link first."),
        v,
      ),
      text: `${hiText(v)}\n\nA woman can know what breadcrumbing means, understand attachment styles, and recognize emotional unavailability. Then she meets somebody she actually likes and still wonders, "Okay, but what am I supposed to do with this?"\n\nThat is the gap ${CLARITY.name} was built to address.\n\nA label may offer one possible explanation for someone's behavior. It does not automatically tell you whether the relationship is compatible, whether the behavior is a pattern, or whether deeper investment makes sense.\n\nDating requires more than naming behavior. It requires learning how to weigh what you see.\n\nPriority enrollment opens August 17. You'll receive the link first.${foot(v)}`,
    }),
  },
  {
    key: "w3",
    sendOn: on("2026-08-16T13:00:00Z"),
    needs: ["priority"],
    subject: "Priority enrollment opens tomorrow",
    preview: "This is not another list of signs to memorize.",
    body: (v) => ({
      html: layout(
        h1("Priority enrollment opens tomorrow") +
          p(hi(v)) +
          p(`Tomorrow, priority enrollment opens for ${esc(CLARITY.name)}.`) +
          p("This is not another list of signs to memorize. It is a process for learning how to separate a moment from a pattern, compare words with behavior, ask questions that produce useful information, and decide what a connection has earned from you.") +
          p(`The founding cohort begins September 3 and is limited to ${CLARITY.seats} women. Priority enrollment will remain open through ${esc(v.deadline("priority"))}.`) +
          p("I'll send the complete details and the enrollment link tomorrow."),
        v,
      ),
      text: `${hiText(v)}\n\nTomorrow, priority enrollment opens for ${CLARITY.name}.\n\nThis is not another list of signs to memorize. It is a process for learning how to separate a moment from a pattern, compare words with behavior, ask questions that produce useful information, and decide what a connection has earned from you.\n\nThe founding cohort begins September 3 and is limited to ${CLARITY.seats} women. Priority enrollment will remain open through ${v.deadline("priority")}.\n\nI'll send the complete details and the enrollment link tomorrow.${foot(v)}`,
    }),
  },
  {
    key: "w4",
    sendOn: on("2026-08-17T13:00:00Z"),
    needs: ["priority"],
    subject: "Priority enrollment is open",
    preview: "You have first access to the founding cohort.",
    body: (v) => ({
      html: layout(
        h1("Priority enrollment is open") +
          p(hi(v)) +
          p(`Priority enrollment for ${esc(CLARITY.name)} is officially open.`) +
          p("If you are tired of understanding everybody else while still second-guessing your own dating decisions, this cohort was built for you.") +
          p("We begin September 3. Over four weeks you will learn how to recognize patterns, separate evidence from assumptions, test words against behavior, and decide whether deeper investment is warranted.") +
          p(`The founding-cohort rate is ${CLARITY.priceDisplay}. It goes to ${CLARITY.fullPriceDisplay} for the cohorts that follow, so this is the lowest it will be.`) +
          p(`Your priority access ends ${esc(v.deadline("priority"))}.`),
        v,
        { label: "View the details and enroll", url: v.salesUrl },
      ),
      text: `${hiText(v)}\n\nPriority enrollment for ${CLARITY.name} is officially open.\n\nIf you are tired of understanding everybody else while still second-guessing your own dating decisions, this cohort was built for you.\n\nWe begin September 3. Over four weeks you will learn how to recognize patterns, separate evidence from assumptions, test words against behavior, and decide whether deeper investment is warranted.\n\nThe founding-cohort rate is ${CLARITY.priceDisplay}. It goes to ${CLARITY.fullPriceDisplay} for the cohorts that follow, so this is the lowest it will be.\n\nYour priority access ends ${v.deadline("priority")}.\n\nView the details and enroll: ${v.salesUrl}${foot(v)}`,
    }),
  },
  {
    key: "w5",
    sendOn: on("2026-08-18T13:00:00Z"),
    needs: ["priority"],
    subject: "What makes this different?",
    preview: "Dating does not need another rule. You need a way to reason.",
    body: (v) => ({
      html: layout(
        h1("What makes this different?") +
          p(hi(v)) +
          p("Most dating advice gives you a rule: wait this long, never text first, leave after this sign, or diagnose that behavior.") +
          p("But real relationships rarely arrive that neatly. Context matters. Patterns matter. Consistency matters. Your own hopes and fears matter too.") +
          p(`${esc(CLARITY.name)} teaches a coherent process grounded in the Exploration phase of the Relationship Life Cycle&trade;. I will not tell you who to date or make your decisions for you. I will teach you how to work with the information you have so your decisions make more sense to you.`) +
          p("This is education, not therapy. You do not need to be actively dating to participate.") +
          p(`Priority access ends ${esc(v.deadline("priority"))}.`),
        v,
        { label: "See the cohort details", url: v.salesUrl },
      ),
      text: `${hiText(v)}\n\nMost dating advice gives you a rule: wait this long, never text first, leave after this sign, or diagnose that behavior.\n\nBut real relationships rarely arrive that neatly. Context matters. Patterns matter. Consistency matters. Your own hopes and fears matter too.\n\n${CLARITY.name} teaches a coherent process grounded in the Exploration phase of the Relationship Life Cycle. I will not tell you who to date or make your decisions for you. I will teach you how to work with the information you have so your decisions make more sense to you.\n\nThis is education, not therapy. You do not need to be actively dating to participate.\n\nPriority access ends ${v.deadline("priority")}.\n\nSee the cohort details: ${v.salesUrl}${foot(v)}`,
    }),
  },
  {
    key: "w6",
    sendOn: on("2026-08-19T13:00:00Z"),
    needs: ["priority"],
    subject: "Priority access ends tonight",
    preview: "Public enrollment opens next.",
    body: (v) => ({
      html: layout(
        h1("Priority access ends tonight") +
          p(hi(v)) +
          p(`Your priority access to ${esc(CLARITY.name)} ends ${esc(v.deadline("priority"))}.`) +
          p(`The founding cohort begins September 3 and is limited to ${CLARITY.seats} women. Public enrollment opens tomorrow for any remaining seats.`) +
          p("If you want a clearer way to evaluate patterns, ask better questions, and decide what a connection has actually earned, you can review the details here."),
        v,
        { label: "Enroll in the founding cohort", url: v.salesUrl },
      ),
      text: `${hiText(v)}\n\nYour priority access to ${CLARITY.name} ends ${v.deadline("priority")}.\n\nThe founding cohort begins September 3 and is limited to ${CLARITY.seats} women. Public enrollment opens tomorrow for any remaining seats.\n\nIf you want a clearer way to evaluate patterns, ask better questions, and decide what a connection has actually earned, you can review the details here:\n${v.salesUrl}${foot(v)}`,
    }),
  },
];

// ── B. Public enrollment: eight emails ────────────────────────────────────────

export const ENROLLMENT_SEQUENCE: Step[] = [
  {
    key: "p1",
    sendOn: on("2026-08-20T13:00:00Z"),
    needs: ["enrollment"],
    subject: "Enrollment is now open",
    preview: "The founding cohort begins September 3.",
    body: (v) => ({
      html: layout(
        h1("Enrollment is now open") +
          p(hi(v)) +
          p(`Enrollment is now open for ${esc(CLARITY.name)}.`) +
          p("I created this live cohort for women who have learned the dating terms but still struggle to decide what the relationship in front of them is actually showing.") +
          p("You will learn how to separate observation from interpretation, recognize patterns, ask questions that create clarity, and decide whether a connection has earned deeper investment.") +
          p(`We begin September 3. Enrollment closes ${esc(v.deadline("enrollment"))}, or when the ${CLARITY.seats} seats are filled.`),
        v,
        { label: "View the cohort and enroll", url: v.salesUrl },
      ),
      text: `${hiText(v)}\n\nEnrollment is now open for ${CLARITY.name}.\n\nI created this live cohort for women who have learned the dating terms but still struggle to decide what the relationship in front of them is actually showing.\n\nYou will learn how to separate observation from interpretation, recognize patterns, ask questions that create clarity, and decide whether a connection has earned deeper investment.\n\nWe begin September 3. Enrollment closes ${v.deadline("enrollment")}, or when the ${CLARITY.seats} seats are filled.\n\nView the cohort and enroll: ${v.salesUrl}${foot(v)}`,
    }),
  },
  {
    key: "p2",
    sendOn: on("2026-08-21T13:00:00Z"),
    subject: "A moment is not always a pattern",
    preview: "The weight you give information matters.",
    body: (v) => ({
      html: layout(
        h1("A moment is not always a pattern") +
          p(hi(v)) +
          p("He took longer than usual to text back. That happened.") +
          p("&ldquo;He is losing interest&rdquo; is an interpretation.") +
          p("The interpretation may eventually be correct, but one moment rarely gives you the whole answer. Discernment means noticing what happened, considering the context, and allowing a pattern to become visible before assigning more meaning than the evidence can hold.") +
          p(`${esc(CLARITY.name)} teaches you how to give information the right weight without ignoring it or spiraling around it.`),
        v,
        { label: "Learn more about the cohort", url: v.salesUrl },
      ),
      text: `${hiText(v)}\n\nHe took longer than usual to text back. That happened.\n\n"He is losing interest" is an interpretation.\n\nThe interpretation may eventually be correct, but one moment rarely gives you the whole answer. Discernment means noticing what happened, considering the context, and allowing a pattern to become visible before assigning more meaning than the evidence can hold.\n\n${CLARITY.name} teaches you how to give information the right weight without ignoring it or spiraling around it.\n\nLearn more about the cohort: ${v.salesUrl}${foot(v)}`,
    }),
  },
  {
    key: "p3",
    sendOn: on("2026-08-23T13:00:00Z"),
    subject: "Understanding him is not the same as evaluating the relationship",
    preview: "An explanation can be compassionate and still be insufficient.",
    body: (v) => ({
      html: layout(
        h1("Understanding him is not the same as evaluating the relationship") +
          p(hi(v)) +
          p("You may understand that he is stressed, afraid of intimacy, overwhelmed at work, or carrying pain from his last relationship. That understanding may help you have compassion for him.") +
          p("But it does not answer a different question: what is this relationship consistently able to offer you?") +
          p("Understanding the person and evaluating the relationship are related, but they are not the same task. Sometimes women become so skilled at explaining behavior that they stop measuring its impact.") +
          p(`Inside ${esc(CLARITY.name)}, we practice holding both truths at once.`),
        v,
        { label: "See what you'll learn", url: v.salesUrl },
      ),
      text: `${hiText(v)}\n\nYou may understand that he is stressed, afraid of intimacy, overwhelmed at work, or carrying pain from his last relationship. That understanding may help you have compassion for him.\n\nBut it does not answer a different question: what is this relationship consistently able to offer you?\n\nUnderstanding the person and evaluating the relationship are related, but they are not the same task. Sometimes women become so skilled at explaining behavior that they stop measuring its impact.\n\nInside ${CLARITY.name}, we practice holding both truths at once.\n\nSee what you'll learn: ${v.salesUrl}${foot(v)}`,
    }),
  },
  {
    key: "p4",
    sendOn: on("2026-08-24T13:00:00Z"),
    subject: "Ending early does not mean dating failed",
    preview: "Sometimes clarity is the successful outcome.",
    body: (v) => ({
      html: layout(
        h1("Ending early does not mean dating failed") +
          p(hi(v)) +
          p("We often judge dating by one outcome: did the relationship continue?") +
          p("But the purpose of dating is not to make every connection work. Sometimes dating works because incompatibility becomes clear before you build a life around it.") +
          p("An early ending can be evidence that you paid attention, asked the right questions, and acted on what you learned.") +
          p("The win is not keeping every person. The win is becoming clearer about which connections deserve more of you."),
        v,
        { label: `Enroll in ${CLARITY.name}`, url: v.salesUrl },
      ),
      text: `${hiText(v)}\n\nWe often judge dating by one outcome: did the relationship continue?\n\nBut the purpose of dating is not to make every connection work. Sometimes dating works because incompatibility becomes clear before you build a life around it.\n\nAn early ending can be evidence that you paid attention, asked the right questions, and acted on what you learned.\n\nThe win is not keeping every person. The win is becoming clearer about which connections deserve more of you.\n\nEnroll in ${CLARITY.name}: ${v.salesUrl}${foot(v)}`,
    }),
  },
  {
    key: "p5",
    sendOn: on("2026-08-26T13:00:00Z"),
    needs: ["enrollment"],
    subject: "Is this cohort for you?",
    preview: "A quick way to decide before enrollment closes.",
    body: (v) => ({
      html: layout(
        h1("Is this cohort for you?") +
          p(hi(v)) +
          p(`${esc(CLARITY.name)} may be for you if you:`) +
          ul([
            "know plenty of dating advice but still second-guess yourself",
            "become invested before you have enough information",
            "see potential and start working from who someone could become",
            "understand the person but cannot evaluate the relationship",
          ]) +
          p("It is not therapy, a partner-diagnosis session, or a formula that guarantees the right outcome. I will not make your decisions for you.") +
          p("I will teach you a process for gathering, weighing, and using relationship information so you can make your own decisions with greater clarity.") +
          p(`Enrollment closes ${esc(v.deadline("enrollment"))}.`),
        v,
        { label: "Review the details", url: v.salesUrl },
      ),
      text: `${hiText(v)}\n\n${CLARITY.name} may be for you if you:\n\n- know plenty of dating advice but still second-guess yourself\n- become invested before you have enough information\n- see potential and start working from who someone could become\n- understand the person but cannot evaluate the relationship\n\nIt is not therapy, a partner-diagnosis session, or a formula that guarantees the right outcome. I will not make your decisions for you.\n\nI will teach you a process for gathering, weighing, and using relationship information so you can make your own decisions with greater clarity.\n\nEnrollment closes ${v.deadline("enrollment")}.\n\nReview the details: ${v.salesUrl}${foot(v)}`,
    }),
  },
  {
    key: "p6",
    sendOn: on("2026-08-30T13:00:00Z"),
    needs: ["enrollment"],
    subject: "Enrollment closes tomorrow",
    preview: "You do not need perfect certainty. You need a process you trust.",
    body: (v) => ({
      html: layout(
        h1("Enrollment closes tomorrow") +
          p(hi(v)) +
          p(`Enrollment for ${esc(CLARITY.name)} closes ${esc(v.deadline("enrollment"))}.`) +
          p("Without a process, it is easy to let one moment become the whole story, let chemistry stand in for compatibility, or keep waiting because you hope more time will eventually make the answer obvious.") +
          p("Inside this cohort, you will learn how to recognize patterns, test words against behavior, ask useful questions, and know when you have enough information to make an informed decision.") +
          p("We begin September 3."),
        v,
        { label: "Enroll now", url: v.salesUrl },
      ),
      text: `${hiText(v)}\n\nEnrollment for ${CLARITY.name} closes ${v.deadline("enrollment")}.\n\nWithout a process, it is easy to let one moment become the whole story, let chemistry stand in for compatibility, or keep waiting because you hope more time will eventually make the answer obvious.\n\nInside this cohort, you will learn how to recognize patterns, test words against behavior, ask useful questions, and know when you have enough information to make an informed decision.\n\nWe begin September 3.\n\nEnroll now: ${v.salesUrl}${foot(v)}`,
    }),
  },
  {
    key: "p7",
    sendOn: on("2026-08-31T13:00:00Z"),
    needs: ["enrollment"],
    subject: "Final day to enroll",
    preview: "Registration closes tonight.",
    body: (v) => ({
      html: layout(
        h1("Final day to enroll") +
          p(hi(v)) +
          p(`Today is the final day to enroll in the founding cohort of ${esc(CLARITY.name)}.`) +
          p(`We begin September 3. Enrollment closes ${esc(v.deadline("enrollment"))}.`) +
          p("If you are ready to move beyond guessing, labeling, and overinterpreting, and to learn a clearer way to evaluate the relationship in front of you, I would love to teach you."),
        v,
        { label: "Enroll in the founding cohort", url: v.salesUrl },
      ),
      text: `${hiText(v)}\n\nToday is the final day to enroll in the founding cohort of ${CLARITY.name}.\n\nWe begin September 3. Enrollment closes ${v.deadline("enrollment")}.\n\nIf you are ready to move beyond guessing, labeling, and overinterpreting, and to learn a clearer way to evaluate the relationship in front of you, I would love to teach you.\n\nEnroll in the founding cohort: ${v.salesUrl}${foot(v)}`,
    }),
  },
  {
    key: "p8",
    sendOn: on("2026-08-31T22:00:00Z"),
    needs: ["enrollment"],
    subject: "Enrollment closes tonight",
    preview: "A final reminder before the founding cohort closes.",
    body: (v) => ({
      html: layout(
        h1("Enrollment closes tonight") +
          p(hi(v)) +
          p(`A quick final reminder: enrollment for ${esc(CLARITY.name)} closes ${esc(v.deadline("enrollment"))}.`) +
          p("The founding cohort begins September 3.") +
          p("If this is not your season, no pressure. I'm glad you are here, and I hope the lessons I share continue helping you date with your eyes open."),
        v,
        { label: "Review the details and enroll", url: v.salesUrl },
      ),
      text: `${hiText(v)}\n\nA quick final reminder: enrollment for ${CLARITY.name} closes ${v.deadline("enrollment")}.\n\nThe founding cohort begins September 3.\n\nIf this is not your season, no pressure. I'm glad you are here, and I hope the lessons I share continue helping you date with your eyes open.\n\nReview the details and enroll: ${v.salesUrl}${foot(v)}`,
    }),
  },
];

export const ALL_STEPS: Step[] = [...WAITLIST_SEQUENCE, ...ENROLLMENT_SEQUENCE];

/**
 * Build the render variables.
 *
 * `deadline` is a function and not a string on purpose: an unresolved decision
 * has to be a THROW at the moment the copy reaches for it, not an empty space in
 * a sentence that still renders.
 */
export function varsFor(opts: {
  firstName: string | null;
  unsubscribeUrl: string;
  priority: string | null;
  enrollment: string | null;
  /** Required, not defaulted: guessing it wrong sends the wrong email. */
  priorityOpen: boolean;
}): Vars {
  return {
    firstName: opts.firstName,
    salesUrl: `${SITE}/dating-with-clarity`,
    waitlistUrl: `${SITE}/dating-with-clarity/waitlist`,
    guideUrl: `${SITE}${CLARITY.guide.href}`,
    unsubscribeUrl: opts.unsubscribeUrl,
    priorityOpen: opts.priorityOpen,
    deadline: (which) => {
      const value = which === "priority" ? opts.priority : opts.enrollment;
      if (!value) throw new UnresolvedDecision(which);
      return value;
    },
  };
}

export function renderStep(step: Step, v: Vars): { subject: string; html: string; text: string } {
  const { html, text } = step.body(v);
  return { subject: step.subject, html, text };
}
