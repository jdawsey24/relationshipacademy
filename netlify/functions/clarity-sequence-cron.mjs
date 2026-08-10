// Netlify Scheduled Function — the Dating With Clarity launch calendar.
//
// Twice a day rather than once: the final day of enrollment has a morning email
// and an evening one, and a single daily run would collapse them into the same
// minute. 13:00 and 22:00 UTC are 9 a.m. and 6 p.m. Eastern while the launch is
// on. The endpoint is idempotent, so an extra run sends nothing twice.
export default async () => {
  const base = process.env.SITE_URL || process.env.URL || "https://relationshiplc.com";
  const secret = process.env.CRON_SECRET || "";
  try {
    const res = await fetch(`${base}/api/cron/clarity-sequence?secret=${encodeURIComponent(secret)}`);
    console.log("/api/cron/clarity-sequence:", res.status, await res.text());
  } catch (e) {
    console.log("/api/cron/clarity-sequence error:", e?.message ?? e);
  }
  return new Response("ok");
};

export const config = { schedule: "0 13,22 * * *" };
