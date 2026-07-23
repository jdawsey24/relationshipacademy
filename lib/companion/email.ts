import { sendEmail } from "@/lib/email/client";

// Transactional post-purchase access email. Framed as instant access to a private
// web app saved to the phone — never a PDF download.
const NAVY = "#1C3557", IVORY = "#F7F4EF", CHARCOAL = "#333333", CORAL = "#D9777D";
const SUPPORT = "admin@relationshiplc.com";

export async function sendCompanionAccessEmail(to: string, appUrl: string): Promise<void> {
  if (!to) return;
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

Your access is active. The Relationship Companion is a private space to work through what you're navigating — one situation at a time, at your own pace. There's no schedule to keep; come whenever you need to think something through.

Open it in your phone's browser, then add it to your Home Screen so it's there like an app whenever you want it.

Open: ${appUrl}

Signing in: use the email address from your purchase.
Add to Home Screen — iPhone (Safari): tap the Share icon, then "Add to Home Screen."
Android (Chrome): tap the menu, then "Add to Home screen."
Trouble getting in? Email ${SUPPORT} and we'll help.`;
  await sendEmail({ to, subject: "Your Relationship Companion is ready", html, text });
}
