import { getSupabaseAdminClient } from "../lib/supabase";

// One-off: author guided experiences for the 9 steward-audited published situations
// (DI-007/DI-012) that had no experience. Mirrors the existing published experiences'
// per-Experience-Type block flow. ALL block payloads are clearly-labeled PLACEHOLDERS —
// no final RLC reflection/educational content (owner authors real copy via the CMS).
// Idempotent: skips a situation that already has a published experience.
//   (set -a; . ./.env.local; set +a; npx tsx scripts/authorCompanionExperiences9.ts)

const TARGETS = ["RS-0020","RS-0023","RS-0027","RS-0040","RS-0047","RS-0048","RS-0050","RS-0051","RS-0054"];

// Block flow per Experience Type (extracted from existing published experiences of each type).
const FLOWS: Record<string, string[]> = {
  Build:     ["intro_context","educational_note","reflection_long","practice_recommendation","user_next_step","reflection_single","closing_summary"],
  Process:   ["intro_context","reflection_long","emotion_select","educational_note","pattern_recognition","user_next_step","closing_summary"],
  Celebrate: ["intro_context","reflection_long","checkbox_select","educational_note","reflection_long","emotion_select","closing_summary"],
  Prepare:   ["intro_context","values_check","reflection_long","educational_note","conversation_planner","closing_summary"],
  Decide:    ["intro_context","reflection_long","values_check","educational_note","user_next_step","closing_summary"],
};
const placeholderFor = (t: string): Record<string, string> =>
  t === "intro_context" ? { placeholder: "[APPROVED INTRODUCTION TO BE PROVIDED]" }
  : (t === "educational_note" || t === "closing_summary") ? { placeholder: "[EDUCATIONAL NOTE TO BE PROVIDED]" }
  : { placeholder: "[GUIDED REFLECTION PROMPT TO BE PROVIDED]" };

const slugify = (s: string) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

async function main() {
  const s = getSupabaseAdminClient();
  const { data: etypes } = await s.from("reg_experience_types").select("experience_type_id, name");
  const etName: Record<string, string> = Object.fromEntries((etypes ?? []).map((e: any) => [e.experience_type_id, e.name]));
  const { data: sits } = await s.from("reg_situations").select("*").in("situation_id", TARGETS);
  const { data: fmaps } = await s.from("reg_situation_framework_map").select("*").in("situation_id", TARGETS);
  const fmBy: Record<string, any> = Object.fromEntries((fmaps ?? []).map((f: any) => [f.situation_id, f]));

  let created = 0, skipped = 0;
  for (const sid of TARGETS) {
    const sit: any = (sits ?? []).find((r: any) => r.situation_id === sid);
    if (!sit) { console.log(`${sid}: situation not found — skip`); continue; }

    const { data: existing } = await s.from("companion_experiences").select("id").eq("situation_id", sid).eq("status", "published").limit(1).maybeSingle();
    if (existing) { console.log(`${sid}: already has a published experience — skip`); skipped++; continue; }

    const typeName = etName[sit.primary_experience_type_id] ?? "Process";
    const flow = FLOWS[typeName] ?? FLOWS.Process;
    const fm = fmBy[sid] ?? {};
    const slug = slugify(sit.official_title);

    // 1. experience record (published)
    const { data: exp, error: eErr } = await s.from("companion_experiences").insert({
      slug, title: sit.official_title, consumer_title: sit.official_title,
      short_description: "[APPROVED INTRODUCTION TO BE PROVIDED]", est_minutes: 6, mode: "guided",
      status: "published", current_version: 2, published_version: 1, owner: "seed", situation_id: sid,
      structural_context: sit.primary_status_key ?? null, phase: fm.phase_id ?? null,
      developmental_task: fm.developmental_task ?? null, domain: fm.domain_id ?? null,
      competency: fm.competency_id ?? null, situation_category: sit.primary_category_id ?? null,
      consumer_topic: sit.short_title ?? null,
    }).select("id").single();
    if (eErr) { console.log(`${sid}: insert failed — ${eErr.message}`); continue; }
    const expId = (exp as any).id;

    // 2. live editable blocks (for later CMS editing)
    const liveBlocks = flow.map((t, i) => ({ experience_id: expId, block_type: t, block_order: i, payload: placeholderFor(t), conditional_on: null }));
    await s.from("companion_experience_blocks").insert(liveBlocks);

    // 3. published version snapshot (what the consumer reads)
    const snapshot = flow.map((t, i) => ({ type: t, order: i, payload: placeholderFor(t), conditional_on: null }));
    const { error: vErr } = await s.from("companion_experience_versions").insert({ experience_id: expId, version_no: 1, blocks: snapshot, authored_by: "seed" });
    if (vErr) { console.log(`${sid}: version snapshot failed — ${vErr.message}`); continue; }

    console.log(`${sid}: ✅ ${typeName} → ${slug} (${flow.length} placeholder blocks)`);
    created++;
  }
  console.log(`\n✓ Done — ${created} created, ${skipped} skipped. All blocks are labeled placeholders.`);
}
main().catch((e) => { console.error("AUTHOR FAILED:", e.message); process.exit(1); });
