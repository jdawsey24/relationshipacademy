import { getSupabaseAdminClient } from "@/lib/supabase";
import { emailConfigured, sendEmail } from "@/lib/email/client";
import { ACADEMY_URL } from "@/lib/flagship";

// Per-cluster nurture for converted Snapshot sessions. One templated sequence,
// personalized by the person's Primary cluster (name, alignment paragraph,
// content pillars). Fully resilient: never blocks conversion, no-ops if email
// isn't configured. Tracking lives on snapshot_quiz_sessions.

const SITE = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";
const NAVY = "#1C3557", CORAL = "#D9777D", IVORY = "#F7F4EF", CHARCOAL = "#333333";

interface Vars {
  clusterName: string;
  alignmentParagraph: string;
  contentPillars: string[];
  resultsUrl: string;
  academyUrl: string;
  unsubscribeUrl: string;
}

function layout(inner: string, v: Vars, cta?: { label: string; url: string }): string {
  const btn = cta
    ? `<tr><td style="padding:10px 0 4px;"><a href="${cta.url}" style="display:inline-block;background:${CORAL};color:#fff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 30px;border-radius:9999px;">${cta.label}</a></td></tr>`
    : "";
  return `<!doctype html><html><body style="margin:0;padding:0;background:${IVORY};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${IVORY};padding:28px 12px;"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;padding:36px 32px;font-family:Georgia,serif;color:${CHARCOAL};">
      <tr><td style="padding-bottom:8px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8a8a8a;">Relationship Life Cycle&trade;</td></tr>
      ${inner}${btn}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;padding:18px 32px;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#9a9a9a;"><tr><td>
      You're receiving this because you took the Relationship Snapshot&trade;.<br/>
      <a href="${v.unsubscribeUrl}" style="color:#9a9a9a;">Unsubscribe</a> &middot; Janelle Dawsey, LMFT &middot; Relationship Life Cycle&trade;
    </td></tr></table>
  </td></tr></table></body></html>`;
}
const p = (t: string) => `<tr><td style="font-size:17px;line-height:1.65;color:${CHARCOAL};padding:6px 0;">${t}</td></tr>`;
const h1 = (t: string) => `<tr><td style="font-size:25px;line-height:1.25;color:${NAVY};font-weight:600;padding:6px 0 10px;">${t}</td></tr>`;
const foot = (v: Vars) => `\n\n—\nYou took the Relationship Snapshot.\nUnsubscribe: ${v.unsubscribeUrl}\nJanelle Dawsey, LMFT · Relationship Life Cycle`;
const pillar = (v: Vars, i: number) => v.contentPillars[i] || "your relationship";

interface Step { key: string; offsetDays: number; subject: (v: Vars) => string; body: (v: Vars) => { html: string; text: string } }

export const SEQUENCE: Step[] = [
  {
    key: "result", offsetDays: 0,
    subject: (v) => `Your Snapshot result: ${v.clusterName}`,
    body: (v) => ({
      html: layout(h1("Here's what your Snapshot shows") + p("Hi there,") + p(v.alignmentParagraph) +
        p("Over the next few days I'll send a few short notes to help you make sense of this and decide what to do with it. No pressure — just a little clarity at a time.") +
        p("You can revisit your results anytime:"), v, { label: "View your results", url: v.resultsUrl }),
      text: `Hi there,\n\n${v.alignmentParagraph}\n\nOver the next few days I'll send a few short notes to help you make sense of this. View your results: ${v.resultsUrl}${foot(v)}`,
    }),
  },
  {
    key: "pillar-1", offsetDays: 2,
    subject: (v) => `On ${pillar(v, 0).toLowerCase()}`,
    body: (v) => ({
      html: layout(h1(pillar(v, 0)) + p("Hi there,") +
        p(`One thing that comes up a lot for people whose results align with <strong>${v.clusterName}</strong> is ${pillar(v, 0).toLowerCase()}.`) +
        p("It's worth sitting with — not to fix overnight, but to notice how it actually shows up for you. That awareness is where change quietly starts.") +
        p("This week, just notice it. That's enough."), v),
      text: `Hi there,\n\nOne thing that comes up a lot for people whose results align with ${v.clusterName} is ${pillar(v, 0).toLowerCase()}. It's worth sitting with — not to fix overnight, but to notice how it shows up for you. This week, just notice it. That's enough.${foot(v)}`,
    }),
  },
  {
    key: "pillar-2", offsetDays: 4,
    subject: (v) => `A little more on ${pillar(v, 1).toLowerCase()}`,
    body: (v) => ({
      html: layout(h1(pillar(v, 1)) + p("Hi there,") +
        p(`Another piece of the ${v.clusterName.toLowerCase()} pattern is ${pillar(v, 1).toLowerCase()}.`) +
        p("Growth here rarely comes from big dramatic changes — it comes from small, repeatable moments of doing it a little differently.") +
        p("Pick one small thing this week. Small is the point."), v, { label: "Revisit your results", url: v.resultsUrl }),
      text: `Hi there,\n\nAnother piece of the ${v.clusterName} pattern is ${pillar(v, 1).toLowerCase()}. Growth here comes from small, repeatable moments. Pick one small thing this week. Revisit your results: ${v.resultsUrl}${foot(v)}`,
    }),
  },
  {
    key: "academy", offsetDays: 7,
    subject: () => "Ready to go a little deeper?",
    body: (v) => ({
      html: layout(h1("Keep going with the Academy") + p("Hi there,") +
        p(`Your Snapshot showed you where things stand with ${v.clusterName.toLowerCase()}. If you're ready to actually build on it, that's what the Relationship Academy is for.`) +
        p("Inside you'll find guided lessons, live sessions, and a supportive community organized around the same framework behind your Snapshot — a warm, judgment-free place to keep doing this work.") +
        p("I'd love to see you there."), v, { label: "Join the Relationship Academy", url: v.academyUrl }),
      text: `Hi there,\n\nYour Snapshot showed you where things stand with ${v.clusterName}. The Relationship Academy is where you build on it — guided lessons, live sessions, and a supportive community. Join: ${v.academyUrl}${foot(v)}`,
    }),
  },
];

interface SessionRow {
  id: string; contact_email: string | null; primary_cluster_id: number | null;
  converted_at: string | null; nurture_status: string; nurture_step: number; nurture_last_sent_at: string | null;
}

async function varsFor(row: SessionRow): Promise<Vars | null> {
  const s = getSupabaseAdminClient();
  const { data: c } = await s.from("snapshot_clusters")
    .select("name, alignment_paragraph, content_pillars").eq("id", row.primary_cluster_id).maybeSingle();
  if (!c) return null;
  const cl = c as { name: string; alignment_paragraph: string; content_pillars: unknown };
  return {
    clusterName: cl.name,
    alignmentParagraph: cl.alignment_paragraph,
    contentPillars: Array.isArray(cl.content_pillars) ? (cl.content_pillars as string[]) : [],
    resultsUrl: `${SITE}/snapshot/results/${row.id}`,
    academyUrl: ACADEMY_URL,
    unsubscribeUrl: `${SITE}/api/snapshot/unsubscribe?session=${row.id}`,
  };
}

async function sendStep(sessionId: string): Promise<void> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("snapshot_quiz_sessions")
    .select("id, contact_email, primary_cluster_id, converted_at, nurture_status, nurture_step, nurture_last_sent_at")
    .eq("id", sessionId).maybeSingle();
  const row = data as SessionRow | null;
  if (!row || row.nurture_status !== "active" || !row.contact_email || !row.converted_at) return;

  const step = SEQUENCE[row.nurture_step];
  if (!step) {
    await s.from("snapshot_quiz_sessions").update({ nurture_status: "completed", nurture_next_at: null }).eq("id", sessionId);
    return;
  }
  const v = await varsFor(row);
  if (!v) return;
  const { html, text } = step.body(v);
  await sendEmail({ to: row.contact_email, subject: step.subject(v), html, text,
    headers: { "List-Unsubscribe": `<${v.unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } });

  const nextStep = row.nurture_step + 1;
  const done = nextStep >= SEQUENCE.length;
  const nextAt = done ? null : new Date(new Date(row.converted_at).getTime() + SEQUENCE[nextStep].offsetDays * 86400000).toISOString();
  await s.from("snapshot_quiz_sessions").update({
    nurture_step: nextStep, nurture_status: done ? "completed" : "active",
    nurture_last_sent_at: new Date().toISOString(), nurture_next_at: nextAt,
  }).eq("id", sessionId);
}

// Enroll a just-converted session and send day-0 immediately (idempotent).
export async function enrollFromSession(sessionId: string): Promise<void> {
  if (!emailConfigured()) return;
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("snapshot_quiz_sessions")
      .select("id, contact_email, primary_cluster_id, converted_at, nurture_last_sent_at, nurture_status")
      .eq("id", sessionId).maybeSingle();
    const row = data as Partial<SessionRow> | null;
    if (!row?.contact_email || !row.primary_cluster_id || !row.converted_at) return;
    if (row.nurture_last_sent_at) return; // already enrolled
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

export async function unsubscribeSession(sessionId: string): Promise<boolean> {
  try {
    const s = getSupabaseAdminClient();
    const { error } = await s.from("snapshot_quiz_sessions")
      .update({ nurture_status: "unsubscribed", nurture_next_at: null }).eq("id", sessionId);
    return !error;
  } catch { return false; }
}
