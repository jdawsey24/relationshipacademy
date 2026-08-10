import { getSupabaseAdminClient } from "@/lib/supabase";
import { emailConfigured, sendEmail } from "@/lib/email/client";
import { CLARITY, deadlineLine } from "@/lib/datingWithClarity";
import {
  ALL_STEPS, WAITLIST_SEQUENCE, UnresolvedDecision, renderStep, varsFor, type Step,
} from "@/lib/email/claritySequence";

// Sending the Dating With Clarity launch calendar.
//
// The rules this enforces, all of them from the launch package:
//
//   ONE. A buyer stops receiving sales email immediately. The Stripe webhook
//   marks her `enrolled` the moment the seat is confirmed, and every send
//   re-reads the row before it goes out, so a purchase during a send still wins.
//
//   TWO. A held decision holds the email. A step declares which deadlines its
//   copy quotes; rendering it without them throws by construction. Rather than
//   catch that at send time and hope, this checks first and reports the held
//   steps in the cron response, so an unresolved decision is visible as a number
//   instead of as silence.
//
//   THREE. A late deadline email is worse than no deadline email. "Closes
//   tonight" arriving on Sunday is not a reminder, it is a mistake. A step whose
//   moment passed by more than STALE_AFTER_HOURS is marked as handled and never
//   sent. It is deliberately longer than a day so a single missed cron run does
//   not silently drop the whole calendar.

const SITE = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";
const STALE_AFTER_HOURS = 36;
const TABLE = "dating_clarity_waitlist";

export interface Row {
  id: string;
  email: string;
  first_name: string | null;
  status: "active" | "enrolled" | "unsubscribed";
  sent_steps: string[];
}

/** The deadlines as they read in a sentence, or null while undecided. */
function deadlines() {
  return {
    priority: deadlineLine(CLARITY.priorityClosesAt),
    enrollment: deadlineLine(CLARITY.enrollmentClosesAt),
  };
}

/** True when every deadline this step's copy quotes has been decided. */
export function stepIsReady(step: Step, at = deadlines()): boolean {
  return (step.needs ?? []).every((need) => !!at[need]);
}

/** Steps that cannot go out yet because a business decision is still open. */
export function heldSteps(at = deadlines()): string[] {
  return ALL_STEPS.filter((s) => !stepIsReady(s, at)).map((s) => s.key);
}

function varsForRow(row: Row) {
  const at = deadlines();
  return varsFor({
    firstName: (row.first_name ?? "").trim().split(/\s+/)[0] || null,
    unsubscribeUrl: `${SITE}/api/dating-with-clarity/unsubscribe?id=${row.id}`,
    priority: at.priority,
    enrollment: at.enrollment,
  });
}

/**
 * Send one step to one person, and record it.
 *
 * Records the step whether the send succeeded or was refused, because the
 * alternative is retrying a broken address every day for three weeks. A genuine
 * send failure is logged loudly instead.
 */
async function sendStep(row: Row, step: Step): Promise<"sent" | "skipped" | "failed"> {
  const admin = getSupabaseAdminClient();

  // Re-read rather than trust the scan: she may have bought or unsubscribed in
  // the seconds since.
  const { data: fresh } = await admin.from(TABLE)
    .select("status, sent_steps").eq("id", row.id).maybeSingle();
  const current = fresh as { status?: string; sent_steps?: string[] } | null;
  if (!current || current.status !== "active") return "skipped";
  if ((current.sent_steps ?? []).includes(step.key)) return "skipped";

  let rendered;
  try {
    rendered = renderStep(step, varsForRow(row));
  } catch (e) {
    // Only reachable if a step quotes a deadline it did not declare in `needs`.
    // Nothing goes out and nothing is recorded, so setting the date releases it.
    if (e instanceof UnresolvedDecision) {
      console.error(`[clarity] ${step.key} reaches for the ${e.deadline} deadline but does not declare it`);
      return "skipped";
    }
    throw e;
  }

  const { error } = await sendEmail({
    to: row.email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    headers: {
      "List-Unsubscribe": `<${SITE}/api/dating-with-clarity/unsubscribe?id=${row.id}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
  if (error) {
    console.error(`[clarity] ${step.key} to ${row.id} failed: ${error}`);
    return "failed";
  }

  await admin.from(TABLE).update({
    sent_steps: [...(current.sent_steps ?? []), step.key],
    last_sent_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", row.id);
  return "sent";
}

/**
 * Join the priority list.
 *
 * Re-submitting the form updates the answers instead of creating a second row
 * or erroring: a woman who fills the form in twice has told us more, not less.
 * The confirmation only goes out the first time.
 */
export async function joinWaitlist(input: {
  email: string;
  firstName?: string | null;
  datingStatus?: string | null;
  hardestPart?: string | null;
  confidenceGoal?: string | null;
  canAttend?: string | null;
}): Promise<{ ok: boolean; alreadyOnList: boolean }> {
  const admin = getSupabaseAdminClient();
  const email = input.email.trim().toLowerCase();

  const { data: existing } = await admin.from(TABLE)
    .select("id, status").eq("cohort", CLARITY.cohort).eq("email", email).maybeSingle();

  const answers = {
    first_name: input.firstName || null,
    dating_status: input.datingStatus || null,
    hardest_part: input.hardestPart || null,
    confidence_goal: input.confidenceGoal || null,
    can_attend: input.canAttend || null,
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    const prior = existing as { id: string; status: string };
    // Filling the form in again is an explicit request to be on the list, so it
    // undoes an earlier unsubscribe. It does NOT touch a buyer: she has her
    // seat, and putting her back on sales email is the wrong kind of eager.
    const revive = prior.status === "unsubscribed" ? { status: "active" } : {};
    await admin.from(TABLE).update({ ...answers, ...revive }).eq("id", prior.id);
    return { ok: true, alreadyOnList: true };
  }

  const { data: created, error } = await admin.from(TABLE)
    .insert({ cohort: CLARITY.cohort, email, ...answers })
    .select("id, email, first_name, status, sent_steps").maybeSingle();
  if (error || !created) {
    console.error("[clarity] waitlist insert failed:", error?.message);
    return { ok: false, alreadyOnList: false };
  }

  const w1 = WAITLIST_SEQUENCE.find((s) => s.onSignup);
  if (w1 && emailConfigured()) {
    await sendStep(created as unknown as Row, w1).catch(() => "failed");
  }
  return { ok: true, alreadyOnList: false };
}

export interface ProcessResult {
  due: string[];
  held: string[];
  stale: string[];
  sent: number;
  failed: number;
  recipients: number;
}

/**
 * The daily pass. Works out which steps are due today, then sends each of them
 * to everyone still active who has not had it.
 */
export async function processDueSteps(now: Date = new Date()): Promise<ProcessResult> {
  const at = deadlines();
  const held: string[] = [], stale: string[] = [], due: Step[] = [];

  for (const step of ALL_STEPS) {
    if (!step.sendOn) continue;                     // signup-triggered, not calendar
    if (now < step.sendOn) continue;                // not yet
    if (!stepIsReady(step, at)) { held.push(step.key); continue; }
    const hoursLate = (now.getTime() - step.sendOn.getTime()) / 3_600_000;
    if (hoursLate > STALE_AFTER_HOURS) { stale.push(step.key); continue; }
    due.push(step);
  }

  const result: ProcessResult = {
    due: due.map((s) => s.key), held, stale, sent: 0, failed: 0, recipients: 0,
  };
  if (!due.length || !emailConfigured()) return result;

  const { data } = await getSupabaseAdminClient().from(TABLE)
    .select("id, email, first_name, status, sent_steps")
    .eq("cohort", CLARITY.cohort).eq("status", "active");
  const rows = (data ?? []) as unknown as Row[];
  result.recipients = rows.length;

  for (const row of rows) {
    for (const step of due) {
      if (row.sent_steps?.includes(step.key)) continue;
      const outcome = await sendStep(row, step).catch(() => "failed" as const);
      if (outcome === "sent") result.sent++;
      else if (outcome === "failed") result.failed++;
    }
  }
  return result;
}

/**
 * A seat was paid for, so the sales emails stop.
 *
 * Called by the Stripe webhook. Matched on email because she does not have to
 * buy from the address she joined the list with, and if she did not join the
 * list at all there is simply nothing to suppress.
 */
export async function exitOnEnrolment(email: string): Promise<void> {
  try {
    await getSupabaseAdminClient().from(TABLE)
      .update({ status: "enrolled", updated_at: new Date().toISOString() })
      .eq("cohort", CLARITY.cohort).eq("email", email.trim().toLowerCase())
      .eq("status", "active");
  } catch (e) {
    // Never throw into the webhook: the seat is hers either way.
    console.error("[clarity] exitOnEnrolment failed:", e instanceof Error ? e.message : e);
  }
}

export async function unsubscribeFromWaitlist(id: string): Promise<void> {
  try {
    await getSupabaseAdminClient().from(TABLE)
      .update({ status: "unsubscribed", updated_at: new Date().toISOString() })
      .eq("id", id).eq("status", "active");
  } catch { /* resilient: the link must never error at her */ }
}
