import { Resend } from "resend";

// Thin Resend wrapper. Resilient: returns { error } rather than throwing, and is
// a no-op (not configured) when RESEND_API_KEY is absent — so nothing in the app
// breaks if email isn't set up yet.

const FROM = process.env.EMAIL_FROM || "Relationship Life Cycle <snapshot@notify.relationshiplc.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO || "hello@janelledawsey.com";

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
