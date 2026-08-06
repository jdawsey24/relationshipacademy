import { NextResponse } from "next/server";
import { reconcilePlaybookEntitlements } from "@/lib/snapshot/playbookReconcile";
import { emailConfigured, sendEmail } from "@/lib/email/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Weekly Playbook entitlement reconciliation. Invoked by the Netlify scheduled
// function; CRON_SECRET-protected so it can't be triggered publicly.
//
// DELIBERATELY READ-ONLY. Repair creates auth accounts and revokes access, and
// doing that unattended on a schedule is how a bad week becomes a bad month —
// the first live run flagged a deleted test purchase that repair would have
// resurrected. So this reports and emails; a human decides whether to repair,
// via `npx tsx scripts/reconcilePlaybookEntitlements.ts --repair`.
//
// Silent when everything agrees — an alert that arrives every week regardless of
// state trains you to ignore it. Mail only goes out when something is wrong.

const NOTIFY = process.env.RECONCILE_NOTIFY_EMAIL || "admin@relationshiplc.com";
const WINDOW_HOURS = 24 * 8; // 8 days — a day of overlap so nothing falls between runs

export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret") || request.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report = await reconcilePlaybookEntitlements({ windowHours: WINDOW_HOURS, repair: false });
  const problems = report.missing_grants + report.stale_access;
  if (problems === 0) {
    return NextResponse.json({ ok: true, clean: true, paid_sessions: report.paid_sessions });
  }

  console.warn(`[cron/playbook-reconcile] ${report.missing_grants} missing grant(s), ${report.stale_access} stale access — ${JSON.stringify(report.discrepancies)}`);

  if (emailConfigured()) {
    const rows = report.discrepancies
      .map((d) => `• ${d.kind === "missing_grant" ? "PAID, NO ACCESS" : "MONEY RETURNED, STILL HAS ACCESS"} — ${d.email ?? "no email"}${d.cluster_id ? ` (cluster ${d.cluster_id})` : ""}\n  ${d.reason}\n  ${d.session}`)
      .join("\n\n");
    const text =
      `Playbook reconciliation found ${problems} discrepancy(ies) in the last ${WINDOW_HOURS / 24} days.\n\n${rows}\n\n` +
      `"PAID, NO ACCESS" means someone paid and has nothing — fix that first.\n` +
      `"MONEY RETURNED, STILL HAS ACCESS" means a refund or chargeback didn't revoke.\n\n` +
      `To review and repair:\n  npx tsx scripts/reconcilePlaybookEntitlements.ts --hours 192\n  (add --repair once you've read the list)\n`;
    await sendEmail({
      to: NOTIFY,
      subject: `Playbook reconciliation: ${problems} discrepancy${problems === 1 ? "" : "ies"}`,
      html: `<pre style="font-family:ui-monospace,Menlo,monospace;font-size:13px;line-height:1.6;white-space:pre-wrap">${text.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] as string)}</pre>`,
      text,
    });
  }

  return NextResponse.json({ ok: true, clean: false, report });
}
