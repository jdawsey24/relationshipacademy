import { Resend } from "resend";

// Thin Resend wrapper. Resilient: returns { error } rather than throwing, and is
// a no-op (not configured) when RESEND_API_KEY is absent — so nothing in the app
// breaks if email isn't set up yet.

// From must be on a Resend-verified domain — notify.relationshiplc.com is verified
// (DKIM/SPF present); the bare root relationshiplc.com is NOT, so we send from the
// subdomain. Reply-To can be any address (just where replies land) → the brand inbox.
const FROM = process.env.EMAIL_FROM || "Relationship Life Cycle <admin@notify.relationshiplc.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO || "admin@relationshiplc.com";

let client: Resend | null = null;
function resend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

export function emailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}): Promise<{ id: string | null; error: string | null }> {
  const r = resend();
  if (!r) return { id: null, error: "RESEND_API_KEY not configured" };
  try {
    const { data, error } = await r.emails.send({
      from: FROM,
      to: opts.to,
      replyTo: REPLY_TO,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      headers: opts.headers,
    });
    if (error) return { id: null, error: error.message || "send failed" };
    return { id: data?.id ?? null, error: null };
  } catch (e) {
    return { id: null, error: e instanceof Error ? e.message : "send failed" };
  }
}
