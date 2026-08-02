import { getSupabaseAdminClient } from "@/lib/supabase";
import { emailConfigured, sendEmail } from "@/lib/email/client";
import { keyForClusterId } from "@/lib/playbook/keys";
import { getPlaybookContent } from "@/content/playbook";

// Playbook delivery email — sent by the Stripe webhook the moment a purchase is
// granted. This is the start of the post-purchase flow (purchasers exit the
// pre-purchase nurture at the same moment; see exitNurtureOnPurchase). Minimal by
// design: confirm, name the Playbook, one CTA to open it. No Academy or Companion
// mentions. Resilient: never throws into the webhook; no-ops if email is not
// configured or the cluster has no served interactive key.

const SITE = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";
const NAVY = "#1C3557", CORAL = "#D9777D", IVORY = "#F7F4EF", CHARCOAL = "#333333";

async function playbookDisplayName(clusterId: number, key: string): Promise<string> {
  // Snapshot clusters carry the consumer playbook name; 900-block products
  // (no snapshot_clusters row) fall back to the authored content's displayName.
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("snapshot_clusters").select("playbook_subtitle").eq("id", clusterId).maybeSingle();
    const fromDb = (data as { playbook_subtitle?: string | null } | null)?.playbook_subtitle;
    if (fromDb) return fromDb;
  } catch { /* fall through */ }
  return getPlaybookContent(key)?.displayName ?? "Your Relationship Playbook";
}

export async function sendPlaybookDeliveryEmail(opts: { to: string; clusterId: number }): Promise<void> {
  if (!emailConfigured()) return;
  try {
    const key = keyForClusterId(opts.clusterId);
    if (!key) return; // no served interactive experience for this id
    const name = await playbookDisplayName(opts.clusterId, key);
    const url = `${SITE}/playbook/${key}`;

    const html = `<!doctype html><html><body style="margin:0;padding:0;background:${IVORY};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${IVORY};padding:28px 12px;"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;padding:36px 32px;font-family:Georgia,serif;color:${CHARCOAL};">
      <tr><td style="padding-bottom:8px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8a8a8a;">Relationship Life Cycle&trade;</td></tr>
      <tr><td style="font-size:25px;line-height:1.25;color:${NAVY};font-weight:600;padding:6px 0 10px;">Your Playbook is ready</td></tr>
      <tr><td style="font-size:17px;line-height:1.65;color:${CHARCOAL};padding:6px 0;">Hi there,</td></tr>
      <tr><td style="font-size:17px;line-height:1.65;color:${CHARCOAL};padding:6px 0;">Thank you. Your Relationship Playbook&trade;, <strong>${name}</strong>, is ready for you.</td></tr>
      <tr><td style="font-size:17px;line-height:1.65;color:${CHARCOAL};padding:6px 0;">It&rsquo;s an interactive walk-through you work through at your own pace &mdash; and it&rsquo;s yours to keep, so you can return to it as often as you need.</td></tr>
      <tr><td style="padding:14px 0 4px;"><a href="${url}" style="display:inline-block;background:${CORAL};color:#fff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 30px;border-radius:9999px;">Open My Playbook</a></td></tr>
      <tr><td style="font-size:15px;line-height:1.65;color:${CHARCOAL};padding:10px 0 0;">If you have any trouble opening it, just reply to this email and we&rsquo;ll get you sorted.</td></tr>
      <tr><td style="font-size:17px;line-height:1.65;color:${CHARCOAL};padding:18px 0 0;">Janelle<br/><span style="font-family:Arial,sans-serif;font-size:13px;color:#8a8a8a;">The Relationship Life Cycle&trade;</span></td></tr>
    </table>
  </td></tr></table></body></html>`;

    const text = `Hi there,\n\nThank you. Your Relationship Playbook, ${name}, is ready for you.\n\nIt's an interactive walk-through you work through at your own pace — and it's yours to keep, so you can return to it as often as you need.\n\nOpen it here: ${url}\n\nIf you have any trouble opening it, just reply to this email and we'll get you sorted.\n\nJanelle\nThe Relationship Life Cycle`;

    await sendEmail({ to: opts.to, subject: "Your Relationship Playbook is ready", html, text });
  } catch { /* resilient — delivery email must never break the grant */ }
}
