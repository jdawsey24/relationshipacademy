// Netlify Scheduled Function — pings the protected cron endpoint once a day to
// send any due emails in the Snapshot sequence. The endpoint does the real work
// (DB + Resend); this just triggers it on a schedule with the shared secret.
export default async () => {
  const base = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";
  const secret = process.env.CRON_SECRET || "";
  const q = `secret=${encodeURIComponent(secret)}`;
  for (const path of ["/api/cron/email-sequence", "/api/cron/snapshot-nurture"]) {
    try {
      const res = await fetch(`${base}${path}?${q}`);
      console.log(`${path}:`, res.status, await res.text());
    } catch (e) {
      console.log(`${path} error:`, e?.message ?? e);
    }
  }
  return new Response("ok");
};

// Daily at 14:00 UTC.
export const config = { schedule: "0 14 * * *" };
