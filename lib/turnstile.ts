// Server-side Cloudflare Turnstile verification. Disabled (returns true) until
// TURNSTILE_SECRET_KEY is configured, so forms keep working before the keys are
// added. Fails OPEN on a network/parse error (Cloudflare unreachable) to avoid
// dropping legitimate leads during an outage, but rejects an explicit failure.

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** True when Turnstile is configured server-side. */
export function turnstileConfigured(): boolean {
  return !!process.env.TURNSTILE_SECRET_KEY;
}

export async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;          // not configured yet → treat as passing
  if (!token) return false;          // configured but no token → block
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (e) {
    console.error("[turnstile] verification error (failing open):", e instanceof Error ? e.message : e);
    return true;                     // Cloudflare unreachable → don't drop the lead
  }
}
