import { getSupabaseAdminClient } from "@/lib/supabase";
import { emailConfigured, sendEmail } from "@/lib/email/client";
import { playbookUrl, PLAYBOOK_CLUSTERS } from "@/lib/snapshot/playbooks";
import { PLAYBOOK_PRICE_DISPLAY } from "@/lib/playbookMarketing";

// 10-day post-Snapshot nurture (owner-approved copy, 2026-08-02) — FIVE emails
// across the 10 days (owner decision 2026-08-02: days 1/4/6/9/10 of the original
// ten, sent on days 0/2/5/7/10; the other five approved emails are archived in
// git at commit d029a81 for future variants). One master
// sequence, personalized by the person's Primary cluster via the SAME approved
// consumer fields the results page renders (snapshot_clusters). The consumer
// identity of a result is its `result_title` — the internal cluster `name`
// (clinical taxonomy) is never shown to consumers here.
//
// Rules (owner spec): no Academy or Companion mentions; no phase/shadow/scoring/
// domain/competency/DI language; no fake urgency; result stays available whether
// or not they buy. Purchasers exit immediately (see exitNurtureOnPurchase — the
// Stripe webhook calls it; sendStep also re-checks status before every send).
// Fallbacks: no first name is captured → "Hi there,"; missing playbook_subtitle →
// "Your Personalized Relationship Playbook"; no secondary cluster → the secondary
// paragraph is omitted entirely; clusters with no purchasable Playbook (e.g. C19)
// degrade: Days 6 + 10 keep the education and point to the results page, Day 9
// (pure product email) is skipped.
//
// Tracking lives on snapshot_quiz_sessions (nurture_status: active | completed |
// unsubscribed | purchased). Fully resilient: never blocks conversion, no-ops if
// email isn't configured.

const SITE = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";
const NAVY = "#1C3557", CORAL = "#D9777D", IVORY = "#F7F4EF", CHARCOAL = "#333333";

const PLAYBOOK_FALLBACK_NAME = "Your Personalized Relationship Playbook";

export interface Vars {
  firstName: string | null;              // first word of contact_name; null → "there"
  resultTitle: string;                 // consumer identity of the result (quoted inline)
  secondaryResultTitle: string | null; // omit the paragraph when null
  corePattern: string;
  whyThisHappens: string;
  howItMayShowUp: string[];
  unmetNeed: string;                   // "developmental need" (e.g. "To Be Chosen")
  strengths: string[];
  blindSpotFirst: string | null;       // used by the archived Day 5 (kept for easy re-add)
  costOfStayingHere: string;
  growthLooksLike: string;
  developmentalFocus: string;
  keyTakeaway: string;
  playbookSubtitle: string;            // fallback already applied
  playbookAvailable: boolean;
  price: string;                       // "$29.99"
  resultsUrl: string;
  unsubscribeUrl: string;
}

// ── layout helpers ────────────────────────────────────────────────────────────

function layout(inner: string, v: Vars, cta?: { label: string; url: string }): string {
  const btn = cta
    ? `<tr><td style="padding:10px 0 4px;"><a href="${cta.url}" style="display:inline-block;background:${CORAL};color:#fff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 30px;border-radius:9999px;">${cta.label}</a></td></tr>`
    : "";
  return `<!doctype html><html><body style="margin:0;padding:0;background:${IVORY};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${IVORY};padding:28px 12px;"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;padding:36px 32px;font-family:Georgia,serif;color:${CHARCOAL};">
      <tr><td style="padding-bottom:8px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8a8a8a;">Relationship Life Cycle&trade;</td></tr>
      ${inner}${btn}
      <tr><td style="font-size:17px;line-height:1.65;color:${CHARCOAL};padding:18px 0 0;">Janelle<br/><span style="font-family:Arial,sans-serif;font-size:13px;color:#8a8a8a;">The Relationship Life Cycle&trade;</span></td></tr>
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;padding:18px 32px;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#9a9a9a;"><tr><td>
      You're receiving this because you took the Relationship Snapshot&trade;.<br/>
      <a href="${v.unsubscribeUrl}" style="color:#9a9a9a;">Unsubscribe</a> &middot; Janelle Dawsey, LMFT &middot; Relationship Life Cycle&trade;
    </td></tr></table>
  </td></tr></table></body></html>`;
}
const p = (t: string) => `<tr><td style="font-size:17px;line-height:1.65;color:${CHARCOAL};padding:6px 0;">${t}</td></tr>`;
const h1 = (t: string) => `<tr><td style="font-size:25px;line-height:1.25;color:${NAVY};font-weight:600;padding:6px 0 10px;">${t}</td></tr>`;
const quoteBlock = (t: string) => `<tr><td style="padding:8px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-left:3px solid ${CORAL};padding:4px 0 4px 16px;font-size:17px;line-height:1.6;color:${NAVY};font-style:italic;">${t}</td></tr></table></td></tr>`;
const ul = (items: string[]) => `<tr><td style="padding:6px 0;"><ul style="margin:0;padding-left:22px;">${items.map((i) => `<li style="font-size:17px;line-height:1.65;color:${CHARCOAL};padding:2px 0;">${i}</li>`).join("")}</ul></td></tr>`;
const q = (t: string) => `&ldquo;${t}&rdquo;`;
const tq = (t: string) => `“${t}”`;
const tList = (items: string[]) => items.map((i) => `- ${i}`).join("\n");
const foot = (v: Vars) => `\n\nJanelle\nThe Relationship Life Cycle\n\n—\nYou're receiving this because you took the Relationship Snapshot.\nUnsubscribe: ${v.unsubscribeUrl}\nJanelle Dawsey, LMFT · Relationship Life Cycle`;
const escapeHtml = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Greeting: "Hi {first name}," when captured at the email gate, else "Hi there,".
const hiHtml = (v: Vars) => `Hi ${escapeHtml(v.firstName ?? "there")},`;
const hiText = (v: Vars) => `Hi ${v.firstName ?? "there"},`;

interface Step {
  key: string;
  offsetDays: number;
  skip?: (v: Vars) => boolean;
  subject: (v: Vars) => string;
  preview: string;
  body: (v: Vars) => { html: string; text: string };
}

// ── the sequence: 5 emails across 10 days (approved copy; glue grammar only) ──

export const SEQUENCE: Step[] = [
  // Day 1 — Your result was not random
  {
    key: "d1-recognition", offsetDays: 0,
    subject: () => "Your result was not based on one answer",
    preview: "Your result reflects a pattern across your answers, not a single moment.",
    body: (v) => ({
      html: layout(
        h1("Your result was not random") + p(hiHtml(v)) +
        p(`Your Relationship Snapshot&trade; result &mdash; ${q(v.resultTitle)} &mdash; was not selected because of one answer.`) +
        p("It surfaced because this experience appeared consistently across the choices that resonated with you.") +
        p("That matters.") +
        p("One difficult conversation, disappointing date, or stressful season does not always tell us very much by itself. But when the same experience keeps showing up in different forms, it may be pointing to a pattern worth understanding.") +
        p("For you, that pattern may look like this:") + quoteBlock(v.corePattern) +
        p("The purpose of your result is not to put you in a box or tell you what decision to make. It is to help you recognize what may be influencing the way you connect, protect yourself, respond, or make relationship decisions right now.") +
        p("You do not have to figure all of that out today. For now, take another look at your result and notice what feels especially familiar.") +
        p("Over the next several days, I&rsquo;ll help you look beneath the result so you can better understand what it may mean for you."),
        v, { label: "Revisit My Snapshot Results", url: v.resultsUrl }),
      text: `${hiText(v)}\n\nYour Relationship Snapshot result — ${tq(v.resultTitle)} — was not selected because of one answer.\n\nIt surfaced because this experience appeared consistently across the choices that resonated with you.\n\nThat matters.\n\nOne difficult conversation, disappointing date, or stressful season does not always tell us very much by itself. But when the same experience keeps showing up in different forms, it may be pointing to a pattern worth understanding.\n\nFor you, that pattern may look like this:\n\n${v.corePattern}\n\nThe purpose of your result is not to put you in a box or tell you what decision to make. It is to help you recognize what may be influencing the way you connect, protect yourself, respond, or make relationship decisions right now.\n\nYou do not have to figure all of that out today. For now, take another look at your result and notice what feels especially familiar:\n${v.resultsUrl}\n\nOver the next several days, I'll help you look beneath the result so you can better understand what it may mean for you.${foot(v)}`,
    }),
  },
  // Day 4 — How the pattern may show up
  {
    key: "d4-selfawareness", offsetDays: 2,
    subject: () => "Where does this show up for you?",
    preview: "Notice what you think, feel, and do when this experience gets activated.",
    body: (v) => {
      const secondaryHtml = v.secondaryResultTitle
        ? p(`Your Snapshot also identified ${q(v.secondaryResultTitle)} as a secondary experience. That may help explain why your reactions do not always fit neatly into one pattern. One experience may influence what you fear, while the other influences how you respond.`)
        : "";
      const secondaryText = v.secondaryResultTitle
        ? `\n\nYour Snapshot also identified ${tq(v.secondaryResultTitle)} as a secondary experience. That may help explain why your reactions do not always fit neatly into one pattern. One experience may influence what you fear, while the other influences how you respond.`
        : "";
      return {
        html: layout(
          h1("How the pattern may show up") + p(hiHtml(v)) +
          p("Knowing the name of a pattern is helpful. Recognizing it while it is happening is even more useful.") +
          p(`Your result, ${q(v.resultTitle)}, may influence more than what you do. It may also affect:`) +
          ul(["What you expect from another person", "How you interpret their behavior", "What you assume will happen next", "What you say or avoid saying", "What you tolerate, pursue, question, or protect"]) +
          p("Think about a recent relationship moment connected to your result.") +
          p("Then finish these three sentences:") +
          ul(["<strong>I noticed:</strong> What happened?", "<strong>I told myself:</strong> What meaning did you give it?", "<strong>I responded by:</strong> What did you do next?"]) +
          p("There are no perfect answers. The goal is to notice the path between the event and your response.") +
          secondaryHtml +
          p("You are not trying to judge your response. You are learning to see it clearly."),
          v, { label: "Return to My Snapshot Results", url: v.resultsUrl }),
        text: `${hiText(v)}\n\nKnowing the name of a pattern is helpful. Recognizing it while it is happening is even more useful.\n\nYour result, ${tq(v.resultTitle)}, may influence more than what you do. It may also affect:\n\n- What you expect from another person\n- How you interpret their behavior\n- What you assume will happen next\n- What you say or avoid saying\n- What you tolerate, pursue, question, or protect\n\nThink about a recent relationship moment connected to your result.\n\nThen finish these three sentences:\n\n- I noticed: What happened?\n- I told myself: What meaning did you give it?\n- I responded by: What did you do next?\n\nThere are no perfect answers. The goal is to notice the path between the event and your response.${secondaryText}\n\nYou are not trying to judge your response. You are learning to see it clearly.\n\nReturn to your results: ${v.resultsUrl}${foot(v)}`,
      };
    },
  },
  // Day 6 — What staying in the pattern can cost (first soft Playbook mention)
  {
    key: "d6-consequence", offsetDays: 5,
    subject: () => "What could this pattern be costing you?",
    preview: "The cost is not always dramatic. Sometimes it accumulates quietly.",
    body: (v) => {
      const playbookHtml = v.playbookAvailable
        ? p(`Your personalized Relationship Playbook&trade;, <strong>${v.playbookSubtitle}</strong>, was created to help you explore that question more deeply and begin working with the pattern in practical ways.`)
        : "";
      const playbookText = v.playbookAvailable
        ? `\n\nYour personalized Relationship Playbook, ${v.playbookSubtitle}, was created to help you explore that question more deeply and begin working with the pattern in practical ways.`
        : "";
      const cta = v.playbookAvailable
        ? { label: "See My Personalized Playbook", url: v.resultsUrl }
        : { label: "Revisit My Snapshot Results", url: v.resultsUrl };
      return {
        html: layout(
          h1("What staying in the pattern can cost") + p(hiHtml(v)) +
          p("Not every relationship pattern creates an immediate crisis.") +
          p("Some patterns are quieter than that.") +
          p("They affect one decision, one conversation, or one relationship at a time. Eventually, the person may realize they have been living with the same uncertainty, distance, fear, or frustration in different forms.") +
          p(`For ${q(v.resultTitle)}, the cost of leaving the pattern unexamined may include:`) +
          quoteBlock(v.costOfStayingHere) +
          p("This is not a prediction. Your Snapshot cannot tell you exactly what will happen next.") +
          p("It is an invitation to consider whether this experience is taking something from you that you no longer want to keep giving.") +
          p("Maybe the cost is peace.<br/>Maybe it is confidence in your own judgment.<br/>Maybe it is emotional closeness.<br/>Maybe it is time.<br/>Maybe it is the ability to make a clear decision.") +
          p("You do not need to panic or force an answer. But you do deserve to understand what the pattern is asking of you.") +
          playbookHtml,
          v, cta),
        text: `${hiText(v)}\n\nNot every relationship pattern creates an immediate crisis.\n\nSome patterns are quieter than that.\n\nThey affect one decision, one conversation, or one relationship at a time. Eventually, the person may realize they have been living with the same uncertainty, distance, fear, or frustration in different forms.\n\nFor ${tq(v.resultTitle)}, the cost of leaving the pattern unexamined may include:\n\n${v.costOfStayingHere}\n\nThis is not a prediction. Your Snapshot cannot tell you exactly what will happen next.\n\nIt is an invitation to consider whether this experience is taking something from you that you no longer want to keep giving.\n\nMaybe the cost is peace.\nMaybe it is confidence in your own judgment.\nMaybe it is emotional closeness.\nMaybe it is time.\nMaybe it is the ability to make a clear decision.\n\nYou do not need to panic or force an answer. But you do deserve to understand what the pattern is asking of you.${playbookText}\n\n${cta.label}: ${v.resultsUrl}${foot(v)}`,
      };
    },
  },
  // Day 9 — What makes the Playbook personal (skipped when no purchasable Playbook)
  {
    key: "d9-continuity", offsetDays: 7,
    skip: (v) => !v.playbookAvailable,
    subject: () => "What makes your Playbook personal",
    preview: "Your Playbook begins with the pattern your answers identified.",
    body: (v) => ({
      html: layout(
        h1("What makes the Playbook personal") + p(hiHtml(v)) +
        p("Your Relationship Playbook&trade; is not a general collection of relationship tips.") +
        p(`Your version, <strong>${v.playbookSubtitle}</strong>, begins with the experience identified through your Snapshot:`) +
        quoteBlock(v.resultTitle) +
        p("That result shapes the focus of the Playbook.") +
        p("The Snapshot helped you recognize the pattern and understand what it may mean. The Playbook takes you further by helping you explore the pattern, reflect on how it appears in your life, and practice responses that support your growth.") +
        p("Your central takeaway from the Snapshot is:") + quoteBlock(v.keyTakeaway) +
        p("Your Playbook helps you do something with that insight.") +
        p("It is designed to help you:") +
        ul([
          "Understand the pattern beyond its surface behavior",
          "Recognize what tends to activate it",
          "Examine the beliefs and protective responses connected to it",
          "Reflect on how it affects your relationship choices",
          "Practice healthier and more intentional responses",
          `Move toward this: ${v.growthLooksLike}`,
        ]) +
        p(`The Snapshot answers, ${q("What experience may be shaping me right now?")}`) +
        p(`The Playbook helps you begin answering, ${q("What can I do with what I now understand?")}`) +
        p(`Your personalized Playbook is available for <strong>${v.price}</strong>.`),
        v, { label: "Get My Personalized Relationship Playbook", url: v.resultsUrl }),
      text: `${hiText(v)}\n\nYour Relationship Playbook is not a general collection of relationship tips.\n\nYour version, ${v.playbookSubtitle}, begins with the experience identified through your Snapshot:\n\n${tq(v.resultTitle)}\n\nThat result shapes the focus of the Playbook.\n\nThe Snapshot helped you recognize the pattern and understand what it may mean. The Playbook takes you further by helping you explore the pattern, reflect on how it appears in your life, and practice responses that support your growth.\n\nYour central takeaway from the Snapshot is:\n\n${v.keyTakeaway}\n\nYour Playbook helps you do something with that insight.\n\nIt is designed to help you:\n- Understand the pattern beyond its surface behavior\n- Recognize what tends to activate it\n- Examine the beliefs and protective responses connected to it\n- Reflect on how it affects your relationship choices\n- Practice healthier and more intentional responses\n- Move toward this: ${v.growthLooksLike}\n\nThe Snapshot answers, "What experience may be shaping me right now?"\nThe Playbook helps you begin answering, "What can I do with what I now understand?"\n\nYour personalized Playbook is available for ${v.price}.\n\nGet it here: ${v.resultsUrl}${foot(v)}`,
    }),
  },
  // Day 10 — A decision without pressure
  {
    key: "d10-decision", offsetDays: 10,
    subject: () => "What will you do with what you learned?",
    preview: "You do not need to rush, but you do deserve a next step.",
    body: (v) => {
      const playbookHtml = v.playbookAvailable
        ? p(`But if you are ready to go beyond recognition, your personalized Relationship Playbook&trade;, <strong>${v.playbookSubtitle}</strong>, is your next step.`) +
          p("It was created to help you work through this particular experience with more structure, reflection, and practical guidance.") +
          p("Your Snapshot gave you a place to begin.<br/>Your Playbook helps you continue.")
        : p("Your Snapshot gave you a place to begin — and it will be here whenever you want to come back to it.");
      const cta = v.playbookAvailable
        ? { label: "Get My Personalized Relationship Playbook", url: v.resultsUrl }
        : { label: "Return to My Snapshot Results", url: v.resultsUrl };
      const secondary = v.playbookAvailable
        ? p(`If now is not the right time, you can still revisit your result <a href="${v.resultsUrl}" style="color:${NAVY};">here</a>.`)
        : "";
      return {
        html: layout(
          h1("A decision without pressure") + p(hiHtml(v)) +
          p("Over the past several days, we have looked more closely at your Relationship Snapshot&trade; result:") +
          quoteBlock(v.resultTitle) +
          p("You have considered what the pattern may mean, why it may happen, how it shows up, what it may be protecting, and what growth could look like.") +
          p("Your result is still yours whether or not you purchase anything.") +
          p("You can return to it, reflect on it, and use it as language for something you may not have known how to explain before.") +
          playbookHtml + secondary +
          p("You do not have to rush your process. Just do not confuse needing time with needing to remain stuck."),
          v, cta),
        text: `${hiText(v)}\n\nOver the past several days, we have looked more closely at your Relationship Snapshot result:\n\n${tq(v.resultTitle)}\n\nYou have considered what the pattern may mean, why it may happen, how it shows up, what it may be protecting, and what growth could look like.\n\nYour result is still yours whether or not you purchase anything.\n\nYou can return to it, reflect on it, and use it as language for something you may not have known how to explain before.${v.playbookAvailable ? `\n\nBut if you are ready to go beyond recognition, your personalized Relationship Playbook, ${v.playbookSubtitle}, is your next step.\n\nIt was created to help you work through this particular experience with more structure, reflection, and practical guidance.\n\nYour Snapshot gave you a place to begin.\nYour Playbook helps you continue.\n\nGet your Playbook: ${v.resultsUrl}\n\nIf now is not the right time, you can still revisit your result here: ${v.resultsUrl}` : `\n\nYour Snapshot gave you a place to begin — and it will be here whenever you want to come back to it.\n\nReturn to your results: ${v.resultsUrl}`}\n\nYou do not have to rush your process. Just do not confuse needing time with needing to remain stuck.${foot(v)}`,
      };
    },
  },
];

// ── engine (enrollment, sends, purchase exit, unsubscribe) ────────────────────

interface SessionRow {
  id: string; contact_email: string | null; contact_name: string | null; primary_cluster_id: number | null; secondary_cluster_id: number | null;
  converted_at: string | null; nurture_status: string; nurture_step: number; nurture_last_sent_at: string | null;
}

const SESSION_COLS = "id, contact_email, contact_name, primary_cluster_id, secondary_cluster_id, converted_at, nurture_status, nurture_step, nurture_last_sent_at";

// Emails reference the result as a LABEL inside sentences, so the leading
// "You're " of result_title is stripped (owner decision 2026-08-02):
// "You're Feeling Unseen and Unappreciated" → "Feeling Unseen and Unappreciated".
// Titles without the prefix (e.g. "Guarded From Getting Used") pass through.
// The results PAGE keeps the full second-person headline — this is email-only.
const stripYoure = (t: string) => t.replace(/^You['’]re\s+/i, "");

export async function varsFor(row: Pick<SessionRow, "id" | "primary_cluster_id" | "secondary_cluster_id"> & { contact_name?: string | null }): Promise<Vars | null> {
  const s = getSupabaseAdminClient();
  if (row.primary_cluster_id == null) return null;
  const ids = [row.primary_cluster_id, row.secondary_cluster_id].filter((x): x is number => typeof x === "number");
  const { data } = await s.from("snapshot_clusters")
    .select("id, result_title, name, core_pattern, why_this_happens, how_it_may_show_up, unmet_need, strengths, blind_spots, cost_of_staying_here, growth_looks_like, developmental_focus, key_takeaway, playbook_subtitle")
    .in("id", ids);
  const byId = new Map(((data ?? []) as Record<string, unknown>[]).map((c) => [c.id as number, c]));
  const c = byId.get(row.primary_cluster_id);
  if (!c) return null;
  const sec = row.secondary_cluster_id != null ? byId.get(row.secondary_cluster_id) : null;
  const str = (x: unknown) => (typeof x === "string" ? x : "");
  const arr = (x: unknown) => (Array.isArray(x) ? (x as string[]) : []);
  const blindSpots = arr(c.blind_spots);
  const firstName = (row.contact_name ?? "").trim().split(/\s+/)[0]?.slice(0, 40) || null;
  return {
    firstName,
    resultTitle: stripYoure(str(c.result_title)) || str(c.name),
    secondaryResultTitle: sec ? (stripYoure(str(sec.result_title)) || str(sec.name) || null) : null,
    corePattern: str(c.core_pattern),
    whyThisHappens: str(c.why_this_happens),
    howItMayShowUp: arr(c.how_it_may_show_up),
    unmetNeed: str(c.unmet_need),
    strengths: arr(c.strengths),
    blindSpotFirst: blindSpots[0] ?? null,
    costOfStayingHere: str(c.cost_of_staying_here),
    growthLooksLike: str(c.growth_looks_like),
    developmentalFocus: str(c.developmental_focus),
    keyTakeaway: str(c.key_takeaway),
    playbookSubtitle: str(c.playbook_subtitle) || PLAYBOOK_FALLBACK_NAME,
    playbookAvailable: playbookUrl(row.primary_cluster_id) != null && PLAYBOOK_CLUSTERS.has(row.primary_cluster_id),
    price: PLAYBOOK_PRICE_DISPLAY,
    resultsUrl: `${SITE}/snapshot/results/${row.id}`,
    unsubscribeUrl: `${SITE}/api/snapshot/unsubscribe?session=${row.id}`,
  };
}

async function sendStep(sessionId: string): Promise<void> {
  const s = getSupabaseAdminClient();
  // Re-read status right before sending — the purchase exit (webhook) or an
  // unsubscribe between crons must always win.
  const { data } = await s.from("snapshot_quiz_sessions").select(SESSION_COLS).eq("id", sessionId).maybeSingle();
  const row = data as SessionRow | null;
  if (!row || row.nurture_status !== "active" || !row.contact_email || !row.converted_at) return;

  let stepIdx = row.nurture_step;
  let step = SEQUENCE[stepIdx];
  if (!step) {
    await s.from("snapshot_quiz_sessions").update({ nurture_status: "completed", nurture_next_at: null }).eq("id", sessionId);
    return;
  }
  const v = await varsFor(row);
  if (!v) return;

  // Skippable steps (e.g. Day 9 for clusters with no purchasable Playbook).
  while (step && step.skip?.(v)) { stepIdx++; step = SEQUENCE[stepIdx]; }
  if (!step) {
    await s.from("snapshot_quiz_sessions").update({ nurture_status: "completed", nurture_step: stepIdx, nurture_next_at: null }).eq("id", sessionId);
    return;
  }

  const { html, text } = step.body(v);
  await sendEmail({ to: row.contact_email, subject: step.subject(v), html, text,
    headers: { "List-Unsubscribe": `<${v.unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } });

  const nextStep = stepIdx + 1;
  const done = nextStep >= SEQUENCE.length;
  const nextAt = done ? null : new Date(new Date(row.converted_at).getTime() + SEQUENCE[nextStep].offsetDays * 86400000).toISOString();
  await s.from("snapshot_quiz_sessions").update({
    nurture_step: nextStep, nurture_status: done ? "completed" : "active",
    nurture_last_sent_at: new Date().toISOString(), nurture_next_at: nextAt,
  }).eq("id", sessionId);
}

// Enroll a just-converted session and send Day 1 immediately (idempotent).
export async function enrollFromSession(sessionId: string): Promise<void> {
  if (!emailConfigured()) return;
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("snapshot_quiz_sessions").select(SESSION_COLS).eq("id", sessionId).maybeSingle();
    const row = data as Partial<SessionRow> | null;
    if (!row?.contact_email || !row.primary_cluster_id || !row.converted_at) return;
    if (row.nurture_last_sent_at) return; // already enrolled
    if (row.nurture_status === "purchased" || row.nurture_status === "unsubscribed") return;
    await s.from("snapshot_quiz_sessions").update({ nurture_status: "active", nurture_step: 0, nurture_next_at: new Date().toISOString() }).eq("id", sessionId);
    await sendStep(sessionId);
  } catch { /* resilient */ }
}

export async function processDueNurture(limit = 200): Promise<{ processed: number }> {
  if (!emailConfigured()) return { processed: 0 };
  try {
    const s = getSupabaseAdminClient();
    const { data: due } = await s.from("snapshot_quiz_sessions")
      .select("id").eq("nurture_status", "active").not("converted_at", "is", null)
      .lte("nurture_next_at", new Date().toISOString()).limit(limit);
    let processed = 0;
    for (const d of (due ?? []) as { id: string }[]) { await sendStep(d.id); processed++; }
    return { processed };
  } catch { return { processed: 0 }; }
}

/**
 * Purchase exit — called by the Stripe webhook the moment a Playbook is granted.
 * Ends the nurture immediately for (a) the exact quiz session that started the
 * checkout (metadata.session_id), and (b) any active sessions matching the
 * purchaser's email + the purchased cluster (covers catalog-page purchases).
 * Resilient: never throws into the webhook.
 */
export async function exitNurtureOnPurchase(opts: { sessionId?: string | null; email?: string | null; clusterId?: number | null }): Promise<void> {
  try {
    const s = getSupabaseAdminClient();
    if (opts.sessionId) {
      await s.from("snapshot_quiz_sessions")
        .update({ nurture_status: "purchased", nurture_next_at: null })
        .eq("id", opts.sessionId).in("nurture_status", ["active", "completed"]);
    }
    if (opts.email && opts.clusterId != null) {
      await s.from("snapshot_quiz_sessions")
        .update({ nurture_status: "purchased", nurture_next_at: null })
        .eq("contact_email", opts.email.toLowerCase()).eq("primary_cluster_id", opts.clusterId)
        .eq("nurture_status", "active");
    }
  } catch { /* resilient — a nurture hiccup must never break the grant */ }
}

export async function unsubscribeSession(sessionId: string): Promise<boolean> {
  try {
    const s = getSupabaseAdminClient();
    const { error } = await s.from("snapshot_quiz_sessions")
      .update({ nurture_status: "unsubscribed", nurture_next_at: null }).eq("id", sessionId);
    return !error;
  } catch { return false; }
}
