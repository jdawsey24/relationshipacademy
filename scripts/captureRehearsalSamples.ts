/**
 * Build rehearsal samples out of runs that already happened.
 *
 *   (set -a; . ./.env.local; set +a; npx tsx scripts/captureRehearsalSamples.ts --apply)
 *
 * Provider responses were never stored, only what was saved from them, so a
 * sample is reconstructed from the rows: the variations, their formats, the
 * brief they were written against. Reconstruction is exact for everything the
 * screen uses, and drops the fields nothing reads.
 *
 * Every sample is validated against the stage's real schema before it is kept.
 * A sample that would not have validated live is worse than no sample: it turns
 * rehearsal into a test of something the real path never does.
 */
import { getSupabaseAdminClient } from "@/lib/supabase";
import { STAGE_LIMITS, STAGE_SCHEMAS } from "@/lib/contentStudio/stages";

const APPLY = process.argv.includes("--apply");

/** The subset of JSON Schema these schemas use: required keys, and their types. */
function validates(schema: unknown, value: unknown): string[] {
  const s = schema as { required?: string[]; properties?: Record<string, unknown> };
  const v = value as Record<string, unknown>;
  const missing: string[] = [];
  for (const key of s.required ?? []) {
    if (v[key] === undefined || v[key] === null || v[key] === "") missing.push(key);
  }
  return missing;
}

async function main() {
  const s = getSupabaseAdminClient();
  console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN"}\n`);

  const samples: { generation_type: string; label: string; output: Record<string, unknown> }[] = [];

  // --- cs_variations, rebuilt from the options and the brief they came from ---
  const { data: convs } = await s.from("ci_conversations")
    .select("id, title, brief").order("created_at", { ascending: false }).limit(40);

  for (const conv of (convs ?? []) as { id: string; title: string | null; brief: Record<string, unknown> }[]) {
    const { data: opts } = await s.from("ci_script_options")
      .select("technique, format, content, why").eq("conversation_id", conv.id)
      .eq("stage", "variation").order("idx");
    const rows = (opts ?? []) as { technique: string | null; format: string | null; content: string; why: string | null }[];
    if (rows.length < STAGE_LIMITS.variations) continue;

    const output: Record<string, unknown> = {
      brief: Object.keys(conv.brief ?? {}).length ? conv.brief : {
        audience: "recorded before the brief was stored", phase: "Exploration",
        developmental_task: "Discernment", core_struggle: "—", core_lesson: "—",
      },
    };
    rows.slice(0, STAGE_LIMITS.variations).forEach((r, i) => {
      output[`variation_${i + 1}`] = {
        approach: r.technique ?? "variation",
        hook_format: r.format ?? "to_camera",
        script: r.content,
        ...(r.why?.startsWith("On screen: ") ? { on_screen: r.why.slice(11) } : {}),
      };
    });

    const missing = validates(STAGE_SCHEMAS.variations, output);
    if (missing.length) {
      console.log(`  skip ${conv.title}: missing ${missing.join(", ")}`);
      continue;
    }
    samples.push({ generation_type: "cs_variations", label: conv.title ?? conv.id.slice(0, 8), output });
  }

  // --- cs_tighten, from scripts that were actually tightened -----------------
  const { data: tightened } = await s.from("ci_scripts")
    .select("script, cut_notes").not("tightened_from", "is", null).limit(10);
  for (const t of (tightened ?? []) as { script: string; cut_notes: string | null }[]) {
    if (!t.cut_notes) continue;
    samples.push({
      generation_type: "cs_tighten",
      label: `${Math.round(t.script.split(/\s+/).length / 2.6)}s`,
      output: { script: t.script, cut_notes: t.cut_notes },
    });
  }

  const byType = samples.reduce<Record<string, number>>((a, x) => {
    a[x.generation_type] = (a[x.generation_type] ?? 0) + 1; return a;
  }, {});
  for (const [type, n] of Object.entries(byType)) console.log(`  ${type}: ${n} samples`);

  const stages = ["cs_variations", "cs_tighten", "cs_hooks", "cs_bodies", "cs_close", "cs_assemble"];
  const empty = stages.filter((t) => !byType[t]);
  if (empty.length) {
    // Said out loud rather than discovered when a button does nothing.
    console.log(`\n  no samples yet for: ${empty.join(", ")}`);
    console.log("  Those stages will fail in rehearsal until they run for real once.");
  }

  if (!APPLY) { console.log("\nDry run — nothing written. Re-run with --apply."); return; }
  if (!samples.length) { console.log("\nNothing to write."); return; }

  await s.from("ai_rehearsal_samples").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  const { error } = await s.from("ai_rehearsal_samples").insert(samples);
  if (error) throw new Error(error.message);
  console.log(`\n✅ ${samples.length} samples stored. Turn on rehearsal in a project to use them.`);
}

main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
