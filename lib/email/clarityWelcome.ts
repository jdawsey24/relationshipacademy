import { emailConfigured, sendEmail } from "@/lib/email/client";
import { CLARITY } from "@/lib/datingWithClarity";

// Enrollment confirmation for Dating With Clarity, sent by the Stripe
// webhook the moment a seat is confirmed.
//
// This one carries more weight than a digital-product receipt: she has bought a
// place at a live event on a specific night, and the thing she needs from this
// email is the dates in her calendar. So the dates lead, and they come from
// CLARITY rather than being typed here — one place to change if a date moves.
//
// What it deliberately does NOT contain is the joining link. That is not set
// yet, and a confirmation promising a link that isn't in it reads as broken.
// It says when the link arrives instead.
//
// Resilient: never throws into the webhook. The seat is hers whether or not
// this sends.

const SITE = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";
const NAVY = "#1C3557", IVORY = "#F7F4EF", CHARCOAL = "#333333";

export async function sendClarityWelcome(opts: { email: string; name?: string | null }) {
  if (!emailConfigured()) return;
  const first = (opts.name ?? "").trim().split(/\s+/)[0] || "there";

  const rows = CLARITY.weeks.map((w, i) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #E6E1D8;">
        <div style="font:600 13px/1.4 Georgia,serif;color:${NAVY};">Week ${i + 1} &middot; ${w.title}</div>
        <div style="font:14px/1.5 Georgia,serif;color:${CHARCOAL};opacity:.75;">${w.date} &middot; ${CLARITY.time} ET</div>
      </td>
    </tr>`).join("");

  const html = `
  <div style="background:${IVORY};padding:32px 0;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:36px;">
      <p style="font:600 12px/1 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${CHARCOAL};opacity:.5;margin:0;">
        You're enrolled
      </p>
      <h1 style="font:600 28px/1.25 Georgia,serif;color:${NAVY};margin:12px 0 0;">
        Dating With Clarity
      </h1>
      <p style="font:16px/1.6 Georgia,serif;color:${CHARCOAL};margin:20px 0 0;">
        Hi ${first} — your seat in the founding cohort is confirmed. Here are the four evenings;
        it's worth putting them in your calendar now.
      </p>

      <table role="presentation" width="100%" style="margin:22px 0 0;border-collapse:collapse;">${rows}</table>

      <p style="font:16px/1.6 Georgia,serif;color:${CHARCOAL};margin:22px 0 0;">
        All four classes run ${CLARITY.time} ET. Replays are included, so if you miss one you can
        catch it afterwards — but the live sessions are where the questions get answered.
      </p>
      <p style="font:16px/1.6 Georgia,serif;color:${CHARCOAL};margin:16px 0 0;">
        <strong>Your joining link will arrive closer to September 3</strong>, to the address you used
        to enroll. Nothing else is needed from you before then.
      </p>

      <p style="font:14px/1.6 Georgia,serif;color:${CHARCOAL};opacity:.7;margin:26px 0 0;">
        Questions about your enrollment? Just reply to this email.
      </p>
      <p style="font:13px/1.6 Georgia,serif;color:${CHARCOAL};opacity:.55;margin:22px 0 0;border-top:1px solid #E6E1D8;padding-top:16px;">
        Dating With Clarity is an educational program. It is not therapy, coaching,
        mental-health treatment, or a substitute for professional mental-health care, and
        participation does not create a therapist-client or coaching relationship.
        <a href="${SITE}/terms" style="color:${NAVY};">Terms</a> &middot;
        <a href="${SITE}/refund" style="color:${NAVY};">Refund policy</a>
      </p>
    </div>
  </div>`;

  const text = [
    `You're enrolled — Dating With Clarity`,
    ``,
    `Hi ${first}, your seat in the founding cohort is confirmed.`,
    ``,
    ...CLARITY.weeks.map((w, i) => `Week ${i + 1}: ${w.title} — ${w.date}, ${CLARITY.time} ET`),
    ``,
    `Replays are included. Your joining link will arrive closer to September 3, to this address.`,
    ``,
    `Questions? Reply to this email.`,
    ``,
    `Dating With Clarity is an educational program, not therapy or coaching.`,
  ].join("\n");

  await sendEmail({
    to: opts.email,
    subject: "You're in — Dating With Clarity starts September 3",
    html,
    text,
  });
}
