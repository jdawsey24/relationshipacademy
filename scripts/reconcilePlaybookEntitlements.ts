/**
 * Reconcile Playbook entitlements against Stripe, in BOTH directions.
 *
 *   report only (default):
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/reconcilePlaybookEntitlements.ts)
 *   repair (grant the missing, revoke the stale):
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/reconcilePlaybookEntitlements.ts --repair --hours 168)
 *
 * Finds:
 *   MISSING_GRANT — Stripe says paid, we have no active entitlement. The customer
 *                   paid and has nothing. (Guest sessions are provisioned on repair,
 *                   exactly as the webhook would.)
 *   STALE_ACCESS  — refunded or charged back, but access is still active. We gave
 *                   the money back and they kept the product.
 *
 * Stripe stays authoritative for money; this only repairs ACCESS. Idempotent —
 * safe to run repeatedly. Read-only unless --repair is passed.
 */
import { reconcilePlaybookEntitlements } from "../lib/snapshot/playbookReconcile";

async function main() {
  const repair = process.argv.includes("--repair");
  const hIdx = process.argv.indexOf("--hours");
  const windowHours = hIdx >= 0 ? Number(process.argv[hIdx + 1]) : 72;

  const report = await reconcilePlaybookEntitlements({ windowHours, repair });
  console.log(JSON.stringify(report, null, 2));

  const { missing_grants, stale_access, still_failing } = report;
  if (!missing_grants && !stale_access) {
    console.log(`\n✅ Clean — ${report.paid_sessions} paid session(s) in the last ${windowHours}h all agree with our access state.`);
    return;
  }
  if (missing_grants) {
    console.log(`\n⚠ ${missing_grants} PAID session(s) with no active entitlement — someone paid and has nothing.`);
  }
  if (stale_access) {
    console.log(`\n⚠ ${stale_access} session(s) where the money came back but access is still active.`);
  }
  if (!repair) console.log("\nRe-run with --repair to fix.");
  if (still_failing) console.log(`\n❌ ${still_failing} still unresolved after repair — investigate the "error" fields above.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
