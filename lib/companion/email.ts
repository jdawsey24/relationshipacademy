import { sendEmail } from "@/lib/email/client";

// Transactional post-purchase access email. Copy is PLACEHOLDER until approved.
// Framed as instant access to a web app saved to the phone — never a PDF download.
const NAVY = "#1C3557", IVORY = "#F7F4EF", CHARCOAL = "#333333", CORAL = "#D9777D";

export async function sendCompanionAccessEmail(to: string, appUrl: string): Promise<void> {
  if (!to) return;
  const html = `<!doctype html><html><body style="margin:0;background:${IVORY};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${IVORY};padding:28px 12px;"><tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;padding:36px 32px;font-family:Georgia,serif;color:${CHARCOAL};">
        <tr><td style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#8a8a8a;padding-bottom:8px;">Relationship Companion</td></tr>
        <tr><td style="font-size:24px;line-height:1.25;color:${NAVY};font-weight:600;padding:6px 0 10px;">Your Relationship Companion is ready</td></tr>
        <tr><td style="font-size:16px;line-height:1.6;padding:6px 0;">[TRANSACTIONAL EMAIL COPY TO BE PROVIDED] — Open it in your phone&rsquo;s browser, then add it to your Home Screen for quick access whenever you need it.</td></tr>
        <tr><td style="padding:14px 0 4px;"><a href="${appUrl}" style="display:inline-block;background:${CORAL};color:#fff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 30px;border-radius:9999px;">Open My Relationship Companion</a></td></tr>
        <tr><td style="font-size:13px;line-height:1.6;color:#8a8a8a;padding:16px 0 0;">[SIGN-IN + HOME-SCREEN INSTALL + TROUBLESHOOTING INSTRUCTIONS TO BE PROVIDED]</td></tr>
      </table>
    </td></tr></table></body></html>`;
  const text = `Your Relationship Companion is ready.\n\n[TRANSACTIONAL EMAIL COPY TO BE PROVIDED] Open it in your phone's browser, then add it to your Home Screen for quick access.\n\nOpen: ${appUrl}\n\n[SIGN-IN + INSTALL + TROUBLESHOOTING TO BE PROVIDED]`;
  await sendEmail({ to, subject: "Your Relationship Companion is ready", html, text });
}
