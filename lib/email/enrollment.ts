import { getSupabaseAdminClient } from "@/lib/supabase";
import { getLiveResultsDetailed } from "@/lib/studioScoringData";
import { emailConfigured, sendEmail } from "@/lib/email/client";
import { SEQUENCE, renderStep, type StepVars } from "@/lib/email/sequence";
import { ACADEMY_URL } from "@/lib/flagship";

// Enrollment + drip processing for the Snapshot email sequence. Fully resilient:
// every path swallows errors so email never blocks scoring or the cron. PII stays
// server-side (service-role only).

const SITE = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";

interface EnrollmentRow {
  id: string; email: string; first_name: string | null; attempt_id: string | null;
  growth_areas: string[]; current_step: number; status: string; enrolled_at: string;
}

function varsFor(e: EnrollmentRow): StepVars {
  return {
    firstName: e.first_name,
    growthAreas: Array.isArray(e.growth_areas) ? e.growth_areas : [],
    resultsUrl: e.attempt_id ? `${SITE}/snapshot/results?attempt=${e.attempt_id}` : `${SITE}/snapshot/intro`,
    academyUrl: ACADEMY_URL,
    unsubscribeUrl: `${SITE}/api/email/unsubscribe?id=${e.id}`,
  };
}

// Enroll a completed attempt and send the first email (results) immediately.
export async function enrollFromAttempt(attemptId: string): Promise<void> {
  if (!emailConfigured()) return;
  try {
    const s = getSupabaseAdminClient();
    const { data: att } = await s.from("studio_assessment_attempts")
      .select("respondent_email, respondent_name, structural_context").eq("id", attemptId).maybeSingle();
    const email = (att as Record<string, unknown> | null)?.respondent_email as string | undefined;
    if (!email) return;

    // Idempotent: one enrollment per attempt.
    const { data: existing } = await s.from("email_sequence_enrollments").select("id").eq("attempt_id", attemptId).maybeSingle();
    if (existing) return;

    const detailed = await getLiveResultsDetailed(attemptId);
    const growth = (detailed?.domains ?? [])
      .filter((d) => d.level === "Growth Opportunity" || d.level === "Needs Attention")
      .slice(-2).map((d) => d.name);
    const firstName = String((att as Record<string, unknown>).respondent_name ?? "").trim().split(/\s+/)[0] || null;

    const { data: enr } = await s.from("email_sequence_enrollments").insert({
      email, first_name: firstName, attempt_id: attemptId,
      structural_context: (att as Record<string, unknown>).structural_context ?? null,
      growth_areas: growth, current_step: 0, status: "active", next_send_at: new Date().toISOString(),
    }).select("id").maybeSingle();
    const enrollmentId = (enr as { id?: string } | null)?.id;
    if (enrollmentId) await sendStep(enrollmentId);
  } catch { /* resilient */ }
}

async function sendStep(enrollmentId: string): Promise<void> {
  const s = getSupabaseAdminClient();
  const { data } = await s.from("email_sequence_enrollments").select("*").eq("id", enrollmentId).maybeSingle();
  const e = data as EnrollmentRow | null;
  if (!e || e.status !== "active") return;

  const step = SEQUENCE[e.current_step];
  if (!step) {
    await s.from("email_sequence_enrollments").update({ status: "completed", next_send_at: null, updated_at: new Date().toISOString() }).eq("id", enrollmentId);
    return;
  }

  const v = varsFor(e);
  const { subject, html, text } = renderStep(step, v);
  const res = await sendEmail({
    to: e.email, subject, html, text,
    headers: { "List-Unsubscribe": `<${v.unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  });
  await s.from("email_sends").insert({ enrollment_id: enrollmentId, step_key: step.key, provider_id: res.id, status: res.error ? "error" : "sent" });

  // Advance to the next step (guarded by current_step so a re-run won't double-send).
  const nextStep = e.current_step + 1;
  const done = nextStep >= SEQUENCE.length;
  const nextSendAt = done ? null : new Date(new Date(e.enrolled_at).getTime() + SEQUENCE[nextStep].offsetDays * 86400000).toISOString();
  await s.from("email_sequence_enrollments").update({
    current_step: nextStep, status: done ? "completed" : "active",
    last_sent_at: new Date().toISOString(), next_send_at: nextSendAt, updated_at: new Date().toISOString(),
  }).eq("id", enrollmentId);
}

// Cron entry: send every enrollment whose next step is due.
export async function processDueEnrollments(limit = 200): Promise<{ processed: number }> {
  if (!emailConfigured()) return { processed: 0 };
  try {
    const s = getSupabaseAdminClient();
    const { data: due } = await s.from("email_sequence_enrollments")
      .select("id").eq("status", "active").lte("next_send_at", new Date().toISOString()).limit(limit);
    let processed = 0;
    for (const d of (due ?? []) as { id: string }[]) { await sendStep(d.id); processed++; }
    return { processed };
  } catch { return { processed: 0 }; }
}

export async function unsubscribe(enrollmentId: string): Promise<boolean> {
  try {
    const s = getSupabaseAdminClient();
    const { error } = await s.from("email_sequence_enrollments")
      .update({ status: "unsubscribed", next_send_at: null, updated_at: new Date().toISOString() }).eq("id", enrollmentId);
    return !error;
  } catch { return false; }
}
