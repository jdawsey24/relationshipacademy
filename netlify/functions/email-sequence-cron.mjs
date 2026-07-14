// Netlify Scheduled Function — pings the protected cron endpoint once a day to
// send any due emails in the Snapshot sequence. The endpoint does the real work
// (DB + Resend); this just triggers it on a schedule with the shared secret.
export default async () => {
  const base = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";
  const secret = process.env.CRON_SECRET || "";
  try {
    const res = await fetch(`${base}/api/cron/email-sequence?secret=${encodeURIComponent(secret)}`);
    const body = await res.text();
    console.log("email-sequence cron:", res.status, body);
  } catch (e) {
    console.log("email-sequence cron error:", e?.message ?? e);
  }
  return new Response("ok");
};

// Daily at 14:00 UTC.
export const config = { schedule: "0 14 * * *" };
