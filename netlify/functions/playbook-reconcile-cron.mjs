// Netlify Scheduled Function — weekly Playbook entitlement reconciliation.
// The endpoint does the real work (Stripe + DB + Resend); this just triggers it
// on a schedule with the shared secret.
//
// Read-only by design: it reports and emails, it never repairs. Repair creates
// accounts and revokes access, which shouldn't happen unattended.
export default async () => {
  const base = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";
  const secret = process.env.CRON_SECRET || "";
  const path = "/api/cron/playbook-reconcile";
  try {
    const res = await fetch(`${base}${path}?secret=${encodeURIComponent(secret)}`);
    console.log(`${path}:`, res.status, await res.text());
  } catch (e) {
    console.log(`${path} error:`, e?.message ?? e);
  }
  return new Response("ok");
};

// Mondays at 15:00 UTC — an hour after the daily email cron, so the two never
// contend, and early enough in the week to act on what it finds.
export const config = { schedule: "0 15 * * 1" };
