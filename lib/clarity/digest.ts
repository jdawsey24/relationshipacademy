import { getSupabaseAdminClient } from "@/lib/supabase";
import { emailConfigured, sendEmail } from "@/lib/email/client";
import { CLARITY } from "@/lib/datingWithClarity";

// Telling the owner that people are joining the priority list.
//
// Without this the signup was silent on her side: a row was written, the woman
// got her confirmation, and nothing else happened. The four questions on the
// form exist to shape the first class, and nobody was reading them.
//
// A DIGEST, NOT AN ALERT PER SIGNUP. If the video works there will be a burst,
// and thirty emails in an evening is how you learn to ignore the thirty-first.
// This runs on the cron that already exists and sends one message covering
// everyone it has not reported yet.
//
// ONCE A DAY (owner, 2026-08-12). The cron fires twice, so the limit is enforced
// here rather than by picking one of the two runs: a run can be missed or
// retried, and "only the 9am one" then means no digest at all that day. Instead
// it asks whether anything has already been reported on today's Eastern date,
// which is the actual rule and needs no new state to answer — the notified_at
// stamps already say. Skipped rows keep their null and go out tomorrow.
//
// SILENT WHEN THERE IS NOTHING. The same rule the Playbook reconciliation
// follows: a message that arrives whether or not anything happened stops being
// information. No signups, no email.
//
// Resilient throughout. This is a notification; it must never be able to break
// the sequence sender it rides along with.

const SITE = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";
const TO = process.env.CLARITY_NOTIFY_EMAIL || "admin@relationshiplc.com";
const TABLE = "dating_clarity_waitlist";
const NAVY = "#1C3557", IVORY = "#F7F4EF", CHARCOAL = "#333333";

interface Signup {
  id: string;
  email: string;
  first_name: string | null;
  dating_status: string | null;
  hardest_part: string | null;
  confidence_goal: string | null;
  can_attend: string | null;
  created_at: string;
}

export interface DigestResult {
  reported: number;
  total: number;
  sent: boolean;
  reason?: string;
}

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * "2026-08-12" for a moment, on the Eastern calendar.
 *
 * The day boundary has to be the owner's, not UTC's: the evening cron fires at
 * 22:00 UTC, which is still the same afternoon in New York but would already be
 * tomorrow on a UTC boundary for part of the year, quietly allowing a second
 * digest.
 */
function easternDay(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(d);
}

/** "Aug 12, 9:14 a.m." in the timezone the class runs in. */
function when(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    timeZone: "America/New_York",
  }).format(new Date(iso)).replace(" AM", " a.m.").replace(" PM", " p.m.");
}

function personHtml(s: Signup): string {
  const answer = (label: string, value: string | null) => value
    ? `<tr><td style="padding:3px 0;font:14px/1.55 Georgia,serif;color:${CHARCOAL};">
         <span style="color:#8a8a8a;">${label}:</span> ${esc(value)}
       </td></tr>`
    : "";
  return `
  <table role="presentation" width="100%" style="margin:0 0 18px;border-collapse:collapse;">
    <tr><td style="padding:0 0 4px;font:600 16px/1.4 Georgia,serif;color:${NAVY};">
      ${esc(s.first_name || "(no name given)")}
      <span style="font:13px/1.4 Arial,sans-serif;color:#8a8a8a;">&middot; ${esc(s.email)}</span>
    </td></tr>
    <tr><td style="padding:0 0 6px;font:12px/1.4 Arial,sans-serif;color:#9a9a9a;">joined ${when(s.created_at)} ET</td></tr>
    ${answer("Where she is with dating", s.dating_status)}
    ${answer("Can attend Thursdays", s.can_attend)}
    ${answer("Hardest part right now", s.hardest_part)}
    ${answer("Wants to feel confident", s.confidence_goal)}
  </table>`;
}

function personText(s: Signup): string {
  const answer = (label: string, value: string | null) => (value ? `\n  ${label}: ${value}` : "");
  return `${s.first_name || "(no name given)"} · ${s.email}\n  joined ${when(s.created_at)} ET`
    + answer("Where she is with dating", s.dating_status)
    + answer("Can attend Thursdays", s.can_attend)
    + answer("Hardest part right now", s.hardest_part)
    + answer("Wants to feel confident", s.confidence_goal);
}

/**
 * Report everyone not yet reported, then mark them.
 *
 * The stamp is written AFTER the send succeeds, so a failed send leaves them
 * for the next run rather than losing them silently. The cost of the other
 * order is that a signup disappears without ever being mentioned.
 */
export async function sendWaitlistDigest(now: Date = new Date()): Promise<DigestResult> {
  const result: DigestResult = { reported: 0, total: 0, sent: false };
  try {
    const s = getSupabaseAdminClient();

    const { data, error } = await s.from(TABLE)
      .select("id, email, first_name, dating_status, hardest_part, confidence_goal, can_attend, created_at")
      .eq("cohort", CLARITY.cohort).is("notified_at", null)
      .order("created_at", { ascending: true });
    if (error) return { ...result, reason: error.message };

    const fresh = (data ?? []) as unknown as Signup[];
    result.reported = fresh.length;
    if (!fresh.length) return { ...result, reason: "nothing new" };

    // One a day. Asked of the stamps rather than of the clock, so a missed or
    // retried run still gets its digest out instead of forfeiting the day.
    // These rows keep their null and go out in tomorrow's.
    const { data: latest } = await s.from(TABLE)
      .select("notified_at").eq("cohort", CLARITY.cohort)
      .not("notified_at", "is", null)
      .order("notified_at", { ascending: false }).limit(1).maybeSingle();
    const last = (latest as { notified_at?: string } | null)?.notified_at;
    if (last && easternDay(new Date(last)) === easternDay(now)) {
      return { ...result, reason: "already sent today" };
    }

    const { count } = await s.from(TABLE).select("id", { count: "exact", head: true })
      .eq("cohort", CLARITY.cohort).neq("status", "unsubscribed");
    result.total = count ?? fresh.length;

    if (!emailConfigured()) return { ...result, reason: "email not configured" };

    const headline = fresh.length === 1
      ? "1 new person on the priority list"
      : `${fresh.length} new people on the priority list`;

    const html = `
    <div style="background:${IVORY};padding:32px 0;">
      <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:16px;padding:34px;">
        <p style="font:600 12px/1 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8a8a8a;margin:0;">
          ${esc(CLARITY.name)} &middot; priority list
        </p>
        <h1 style="font:600 24px/1.3 Georgia,serif;color:${NAVY};margin:12px 0 4px;">${headline}</h1>
        <p style="font:15px/1.6 Georgia,serif;color:${CHARCOAL};opacity:.7;margin:0 0 24px;">
          ${result.total} on the list in total. The founding cohort holds ${CLARITY.seats}.
        </p>
        ${fresh.map(personHtml).join(`<hr style="border:none;border-top:1px solid #ECE7DE;margin:0 0 18px;"/>`)}
        <p style="font:14px/1.6 Georgia,serif;margin:26px 0 0;">
          <a href="${SITE}/admin/clarity" style="color:${NAVY};">See the whole list</a>
        </p>
      </div>
    </div>`;

    const text = `${headline}\n${result.total} on the list in total. The founding cohort holds ${CLARITY.seats}.\n\n`
      + fresh.map(personText).join("\n\n")
      + `\n\nSee the whole list: ${SITE}/admin/clarity`;

    const { error: sendError } = await sendEmail({
      to: TO, subject: `${headline} — ${CLARITY.name}`, html, text,
    });
    if (sendError) return { ...result, reason: sendError };

    // Only now. A stamp written before a failed send loses these people.
    //
    // Stamped with the SAME `now` the once-a-day check reads, not with a fresh
    // wall clock. Half-honouring an injected clock is worse than not accepting
    // one: the check and the stamp then disagree, and the disagreement only
    // shows up under test, which is exactly where it looks like a pass.
    await s.from(TABLE).update({ notified_at: now.toISOString() })
      .in("id", fresh.map((f) => f.id));

    return { ...result, sent: true };
  } catch (e) {
    return { ...result, reason: e instanceof Error ? e.message : "digest failed" };
  }
}
