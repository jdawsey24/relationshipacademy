/**
 * Reconcile Companion entitlements against Stripe (paid-but-ungranted repair).
 *
 *   report only (default):
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/reconcileCompanionEntitlements.ts)
 *   repair (grants the missing entitlements):
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/reconcileCompanionEntitlements.ts --repair --hours 168)
 *
 * Stripe stays authoritative for payment; this only repairs delivery. Idempotent —
 * safe to run repeatedly (grants are deduped by the DB unique index on stripe_ref).
 */
import { reconcileCompanionEntitlements } from "../lib/companion/entitlementReconcile";

async function main() {
  const repair = process.argv.includes("--repair");
  const hIdx = process.argv.indexOf("--hours");
  const windowHours = hIdx >= 0 ? Number(process.argv[hIdx + 1]) : 72;
  const report = await reconcileCompanionEntitlements({ windowHours, repair });
  console.log(JSON.stringify(report, null, 2));
  if (report.discrepancies > 0 && !repair) console.log(`\n${report.discrepancies} paid-but-ungranted session(s). Re-run with --repair to grant.`);
  if (report.still_failing > 0) console.log(`\n⚠ ${report.still_failing} still failing after repair — investigate (see refs_still_failing).`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
