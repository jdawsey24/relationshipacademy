/*
 * Controlled test-send of the Companion "access is ready" email, mirroring the
 * production path in lib/companion/email.ts + lib/email/client.ts. Verifies:
 *   - deliverability from the Resend-verified domain,
 *   - the From display  = "Relationship Life Cycle <admin@notify.relationshiplc.com>",
 *   - the Reply-To       = admin@relationshiplc.com  (reply should land in that inbox),
 *   - the in-body support = admin@relationshiplc.com,
 *   - HTML + text rendering.
 *
 * The secret never touches the assistant — YOU supply RESEND_API_KEY at runtime.
 * Run from repo root, with the key exported (or placed in .env.local as
 * RESEND_API_KEY=...). It is NOT read from Netlify by this script.
 *
 *   RESEND_API_KEY="re_xxx" node scripts/sendCompanionTestEmail.mjs
 *   # or, if you add RESEND_API_KEY to .env.local:
 *   node scripts/sendCompanionTestEmail.mjs
 *
 * Sends to hello@janelledawsey.com. Subject is prefixed [TEST] so it isn't mistaken
 * for a real purchase. Delete this script after verifying if you like.
 */
import { readFileSync } from "node:fs";
try {
  for (const line of readFileSync(process.cwd() + "/.env.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch { /* no .env.local — rely on the exported env */ }

const KEY = process.env.RESEND_API_KEY;
if (!KEY) { console.error("✗ RESEND_API_KEY not set. Export it or add it to .env.local, then re-run."); process.exit(1); }

// --- mirror the production config (lib/email/client.ts defaults) ---
const FROM = process.env.EMAIL_FROM || "Relationship Life Cycle <admin@notify.relationshiplc.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO || "admin@relationshiplc.com";
const TO = "hello@janelledawsey.com";
const appUrl = "https://relationshiplc.com/companion/welcome?purchase=success";

// --- mirror the access-email content (lib/companion/email.ts) ---
const NAVY = "#1C3557", IVORY = "#F7F4EF", CHARCOAL = "#333333", CORAL = "#D9777D";
const SUPPORT = "admin@relationshiplc.com";
const html = `<!doctype html><html><body style="margin:0;background:${IVORY};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${IVORY};padding:28px 12px;"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;padding:36px 32px;font-family:Georgia,serif;color:${CHARCOAL};">
      <tr><td style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8a8a8a;padding-bottom:8px;">Relationship Companion</td></tr>
      <tr><td style="font-size:24px;line-height:1.25;color:${NAVY};font-weight:600;padding:6px 0 10px;">Your Relationship Companion is ready</td></tr>
      <tr><td style="font-size:16px;line-height:1.6;padding:6px 0;">Your access is active. The Relationship Companion&trade; is a private space to work through what you&rsquo;re navigating &mdash; one situation at a time, at your own pace. There&rsquo;s no schedule to keep; come whenever you need to think something through.</td></tr>
      <tr><td style="font-size:16px;line-height:1.6;padding:6px 0;">Open it in your phone&rsquo;s browser, then add it to your Home Screen so it&rsquo;s there like an app whenever you want it.</td></tr>
      <tr><td style="padding:14px 0 4px;"><a href="${appUrl}" style="display:inline-block;background:${CORAL};color:#fff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 30px;border-radius:9999px;">Open My Relationship Companion</a></td></tr>
      <tr><td style="font-size:13px;line-height:1.6;color:#8a8a8a;padding:18px 0 0;">
        <strong style="color:${CHARCOAL};">Signing in:</strong> use the email address from your purchase.<br/>
        <strong style="color:${CHARCOAL};">Add to your Home Screen &mdash; iPhone (Safari):</strong> tap the Share icon, then &ldquo;Add to Home Screen.&rdquo;<br/>
        <strong style="color:${CHARCOAL};">Android (Chrome):</strong> tap the menu (&#8942;), then &ldquo;Add to Home screen.&rdquo;<br/>
        Trouble getting in? Email <a href="mailto:${SUPPORT}" style="color:${NAVY};">${SUPPORT}</a> and we&rsquo;ll help.
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
const text = `Your Relationship Companion is ready.

Your access is active. ... (test send mirroring the production access email)

Open: ${appUrl}
Trouble getting in? Email ${SUPPORT} and we'll help.`;

const { Resend } = await import("resend");
const resend = new Resend(KEY);
console.log(`Sending [TEST] access email:\n  from    ${FROM}\n  reply-to ${REPLY_TO}\n  to      ${TO}\n`);
const { data, error } = await resend.emails.send({
  from: FROM, to: TO, replyTo: REPLY_TO,
  subject: "[TEST] Your Relationship Companion is ready", html, text,
});
if (error) { console.error("✗ send failed:", error.message || error); process.exit(1); }
console.log(`✓ sent. Resend id: ${data?.id ?? "(none)"}`);
console.log("Check hello@janelledawsey.com — verify From display, that it's not in spam, and that a Reply goes to admin@relationshiplc.com.");
