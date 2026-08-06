/**
 * Approve (or revert) Content Engine prompt templates.
 *
 *   review the exact text first:
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/approvePromptTemplates.ts --show)
 *   dry run:
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/approvePromptTemplates.ts)
 *   approve:
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/approvePromptTemplates.ts --apply --by "you@example.com")
 *   revert to draft:
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/approvePromptTemplates.ts --revert --apply)
 *
 * WHAT APPROVAL DOES. getActiveTemplate() resolves the highest-version APPROVED
 * template for a generation type. Approving makes a stage runnable. It does not
 * generate anything, does not publish anything, and does not relax any other
 * gate: owner + MFA, the kill switch, the daily and monthly cost ceilings, the
 * bridge eligibility rule and the QC blocking rules all still apply, and every
 * draft still requires human review.
 *
 * WHY IT IS REVERSIBLE. --revert puts a version back to draft, which immediately
 * stops every stage that depends on it. Approval is a decision, not a one-way
 * door.
 *
 * Every transition is written to ai_approval_events with the prior and new
 * status, so "who made this runnable, and when" is answerable later.
 */
import { getSupabaseAdminClient } from "@/lib/supabase";

const APPLY = process.argv.includes("--apply");
const REVERT = process.argv.includes("--revert");
const SHOW = process.argv.includes("--show");
const BY = process.argv.includes("--by")
  ? process.argv[process.argv.indexOf("--by") + 1]
  : "owner";

/** The Script Builder pipeline. Only these — other generation types are untouched. */
const TYPES = [
  "ce_bridges",
  "ce_script_angles",
  "ce_script_draft",
  "ce_script_equivalence",
  "ce_script_packaging",
] as const;

const TARGET_VERSION = 6;

interface Tpl {
  id: string; generation_type: string; name: string; version: number;
  status: string; system_instruction: string; user_template: string;
}

async function main() {
  const s = getSupabaseAdminClient();

  const { data, error } = await s
    .from("prompt_templates")
    .select("id, generation_type, name, version, status, system_instruction, user_template")
    .in("generation_type", TYPES as unknown as string[])
    .order("generation_type").order("version");
  if (error) throw new Error(error.message);

  const all = (data ?? []) as Tpl[];
  const targets = all.filter((t) => t.version === TARGET_VERSION);

  if (SHOW) {
    for (const t of targets) {
      console.log("=".repeat(78));
      console.log(`${t.generation_type}  v${t.version}  [${t.status}]`);
      console.log(`${t.name}`);
      console.log("-".repeat(78));
      console.log(t.system_instruction);
      console.log("-".repeat(78) + "\nUSER TEMPLATE:");
      console.log(t.user_template);
      console.log();
    }
    return;
  }

  const wanted = REVERT ? "draft" : "approved";
  const missing = TYPES.filter((ty) => !targets.some((t) => t.generation_type === ty));
  if (missing.length) {
    console.error(`Missing v${TARGET_VERSION} for: ${missing.join(", ")}. Run the seeder first.`);
    process.exit(1);
  }

  console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN (no writes)"} — target status "${wanted}"\n`);
  const changing = targets.filter((t) => t.status !== wanted);

  for (const t of targets) {
    const action = t.status === wanted ? `already ${wanted}` : `${t.status} → ${wanted}`;
    console.log(`  ${t.generation_type.padEnd(24)} v${t.version}  ${action}`);
  }

  // Older approved versions are RETIRED, not just outranked.
  //
  // getActiveTemplate takes the highest approved version, so v4 wins while it is
  // approved. But leaving a superseded version approved means reverting v4 would
  // silently promote it — and a version is usually superseded because something
  // was wrong with it. Retiring makes the revert stop generation, which is what
  // a revert is for.
  const olderApproved = all.filter((t) => t.version < TARGET_VERSION && t.status === "approved");
  for (const t of olderApproved) {
    console.log(`  ${t.generation_type.padEnd(24)} v${t.version}  approved → retired (superseded)`);
  }

  if (!APPLY) {
    console.log(`\nDry run — nothing written. Re-run with --apply${REVERT ? " --revert" : ""}.`);
    console.log(`Read the exact prompt text first with --show.`);
    return;
  }

  // NOT an early return when nothing is changing: the settings sync below is a
  // separate switch and may still be out of step with the template statuses.
  // Returning here left the pipeline approved-but-disabled the first time.
  for (const t of changing) {
    const { error: upErr } = await s.from("prompt_templates").update({
      status: wanted,
      approved_by: REVERT ? null : BY,
      updated_at: new Date().toISOString(),
    }).eq("id", t.id);
    if (upErr) throw new Error(`${t.generation_type}: ${upErr.message}`);

    await s.from("ai_approval_events").insert({
      draft_type: "prompt_template",
      draft_id: t.id,
      action: REVERT ? "reject" : "approve",
      actor_id: BY,
      prior_status: t.status,
      new_status: wanted,
      notes: REVERT
        ? `Reverted ${t.generation_type} v${t.version} to draft; every stage using it stops immediately.`
        : `Approved ${t.generation_type} v${t.version} for the Script Builder pipeline.`,
    });
  }

  // Retire superseded versions only when approving; a revert must not touch them.
  if (!REVERT) {
    for (const t of olderApproved) {
      await s.from("prompt_templates")
        .update({ status: "retired", updated_at: new Date().toISOString() }).eq("id", t.id);
      await s.from("ai_approval_events").insert({
        draft_type: "prompt_template", draft_id: t.id, action: "retire", actor_id: BY,
        prior_status: t.status, new_status: "retired",
        notes: `Superseded by ${t.generation_type} v${TARGET_VERSION}.`,
      });
    }
  }

  console.log(
    changing.length
      ? `\n✅ ${changing.length} template(s) now ${wanted}.`
      : `\n   templates: all already ${wanted}.`,
  );
  if (!REVERT && olderApproved.length) {
    console.log(`   ${olderApproved.length} superseded version(s) retired.`);
  }

  // SECOND GATE. An approved template is not enough: preflightGeneration()
  // rejects any generation type absent from ai_settings.enabled_generation_types,
  // so the stages would refuse with "disabled in AI Settings" while looking
  // fully approved. Two switches, one decision — keep them together rather than
  // leaving the second one to be discovered at the first failed click.
  const { data: settingsRow } = await s
    .from("ai_settings").select("id, enabled_generation_types").limit(1).maybeSingle();

  if (settingsRow) {
    const row = settingsRow as { id: string; enabled_generation_types: string[] };
    const current = new Set(row.enabled_generation_types ?? []);
    const next = REVERT
      ? [...current].filter((t) => !(TYPES as readonly string[]).includes(t))
      : [...new Set([...current, ...TYPES])];

    const delta = REVERT
      ? (TYPES as readonly string[]).filter((t) => current.has(t))
      : (TYPES as readonly string[]).filter((t) => !current.has(t));

    if (delta.length) {
      const { error: sErr } = await s.from("ai_settings")
        .update({ enabled_generation_types: next, updated_by: BY, updated_at: new Date().toISOString() })
        .eq("id", row.id);
      if (sErr) throw new Error(`ai_settings: ${sErr.message}`);
      console.log(`   ai_settings: ${REVERT ? "removed" : "enabled"} ${delta.join(", ")}`);
    } else {
      console.log(`   ai_settings: already correct (${REVERT ? "none present" : "all present"}).`);
    }
  } else {
    console.log(`   ⚠ no ai_settings row — preflightGeneration falls back to defaults, ` +
                `which do NOT include the ce_* types. The stages will refuse.`);
  }

  if (!REVERT) {
    console.log(`   Stages are runnable. Nothing generates on its own, nothing publishes,`);
    console.log(`   and every draft still requires your review.`);
    console.log(`   Revert with: npx tsx scripts/approvePromptTemplates.ts --revert --apply`);
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
