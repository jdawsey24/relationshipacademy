/**
 * Approve (or revert) a Knowledge Base phase narrative record.
 *
 *   review what you are approving:
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/approvePhaseNarrative.ts Recovery --show)
 *   dry run:
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/approvePhaseNarrative.ts Recovery)
 *   approve:
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/approvePhaseNarrative.ts Recovery --apply --by "you@example.com")
 *   revert to draft:
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/approvePhaseNarrative.ts Recovery --revert --apply)
 *
 * WHAT APPROVAL DOES, AND WHAT IT DOES NOT.
 *
 *   record_status = 'approved' means the RECORD is editorially final: the
 *   narrative is settled and no longer a working draft.
 *
 *   It does NOT authorise publication. That is ce_source_use_approvals — per
 *   source, per use, per audience — and it is a separate decision. A brief built
 *   from an approved record still reports publication_eligible = false until an
 *   approval row exists for the specific use and audience.
 *
 *   It also does not change the public site. The phase pages render from the
 *   `renderable` gate, which is about whether the fields a page needs are
 *   present, not about whether anyone approved them.
 *
 * Refuses to approve a record with empty suitability fields — approving an
 * incomplete record would make "approved" mean nothing.
 *
 * Every transition is written to ai_approval_events. Reversible with --revert.
 */
import { getSupabaseAdminClient } from "@/lib/supabase";

const ARGS = process.argv.slice(2);
const PHASE = ARGS.find((a) => !a.startsWith("--"));
const APPLY = ARGS.includes("--apply");
const REVERT = ARGS.includes("--revert");
const SHOW = ARGS.includes("--show");
const BY = ARGS.includes("--by") ? ARGS[ARGS.indexOf("--by") + 1] : "owner";

/** A record cannot be approved without these. Same list the projection gates on. */
const REQUIRED = [
  "safety_boundaries",
  "public_or_clinical_boundary",
  "reading_level",
  "approved_language",
  "prohibited_reductions",
] as const;

const filled = (v: unknown) =>
  Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim().length > 0 : v != null;

async function main() {
  if (!PHASE) {
    console.error("Usage: approvePhaseNarrative.ts <Phase> [--show|--apply|--revert] [--by email]");
    process.exit(1);
  }
  const s = getSupabaseAdminClient();

  const { data, error } = await s
    .from("kb_phase_narratives").select("*").eq("phase", PHASE).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) { console.error(`No ${PHASE} narrative record.`); process.exit(1); }
  const rec = data as Record<string, unknown>;

  if (SHOW) {
    for (const f of REQUIRED) {
      const v = rec[f];
      console.log(`\n── ${f} ──`);
      if (Array.isArray(v)) v.forEach((x, i) => console.log(`  ${String(i + 1).padStart(2)}. ${x}`));
      else console.log(`  ${v ?? "(empty)"}`);
    }
    return;
  }

  const wanted = REVERT ? "draft" : "approved";
  const current = String(rec.record_status);
  const missing = REQUIRED.filter((f) => !filled(rec[f]));

  console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN (no writes)"}\n`);
  console.log(`  ${PHASE}: record_status ${current} → ${wanted}`);
  console.log(`  suitability fields: ${REQUIRED.length - missing.length}/${REQUIRED.length} authored`);

  if (!REVERT && missing.length) {
    console.error(`\nRefusing: ${missing.join(", ")} are empty. Approving an incomplete record would make "approved" mean nothing.`);
    process.exit(1);
  }
  if (current === wanted) {
    console.log(`\nAlready ${wanted}. Nothing to do.`);
    return;
  }

  console.log(`\n  What this changes : the record becomes editorially final.`);
  console.log(`  What it does NOT  : publication. That is ce_source_use_approvals,`);
  console.log(`                      per source, per use, per audience — still separate.`);
  console.log(`  The public page   : unchanged. Phase pages render on the "renderable"`);
  console.log(`                      gate, not on approval.`);

  if (!APPLY) {
    console.log(`\nDry run — nothing written. Read the fields first with --show.`);
    return;
  }

  const { error: upErr } = await s.from("kb_phase_narratives")
    .update({ record_status: wanted, updated_at: new Date().toISOString() }).eq("phase", PHASE);
  if (upErr) throw new Error(upErr.message);

  await s.from("ai_approval_events").insert({
    draft_type: "phase_narrative",
    draft_id: rec.id as string,
    action: REVERT ? "reject" : "approve",
    actor_id: BY,
    prior_status: current,
    new_status: wanted,
    notes: REVERT
      ? `Reverted the ${PHASE} narrative record to draft.`
      : `Approved the ${PHASE} narrative record as editorially final. Does not authorise publication.`,
  });

  console.log(`\n✅ ${PHASE} record_status is now ${wanted}.`);
  if (!REVERT) {
    console.log(`   Revert with: npx tsx scripts/approvePhaseNarrative.ts ${PHASE} --revert --apply`);
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
