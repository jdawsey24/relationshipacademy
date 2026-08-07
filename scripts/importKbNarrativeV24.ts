/**
 * Import the Master Knowledge Base v2.4 COMPETENCY NARRATIVE layer into
 * kb_competencies.
 *
 *   dry run (default — reads only, writes nothing):
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/importKbNarrativeV24.ts)
 *   apply:
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/importKbNarrativeV24.ts --apply)
 *   rollback:
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/importKbNarrativeV24.ts --rollback <backup_id>)
 *
 * WHY THIS IS SEPARATE FROM importKnowledgeBaseV24.ts. That script imported the
 * competency CONSTRUCTS into fw_competencies — ids, phases, domains, tasks. This
 * one imports the NARRATIVE the constructs point at. Since v2.4 landed, the 44
 * Recovery and Renewal competencies have existed as canonical constructs with no
 * narrative text, so validateMapping has correctly refused every bridge to them
 * and two of six phases could produce nothing.
 *
 * WHAT `status = 'active'` MEANS HERE, AND WHAT IT DOES NOT. validateMapping
 * requires an active narrative record, so this is the switch that makes Recovery
 * and Renewal mappable. It means the source record is live rather than retired.
 * It does NOT mean approved for public use — that is ce_source_use_approvals,
 * per source, per use, per audience, and it stays empty for these 44.
 *
 * Same safety posture as the construct import: upsert by canonical code, never
 * delete, shape guard, backup before any write, rollback.
 */
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { readWorkbook } from "@/lib/contentEngine/xlsx";

const WORKBOOK = "import/RLC_Master_Knowledge_Base_v2.4_Recovery_Renewal_Derivative_Libraries.xlsx";
const APPLY = process.argv.includes("--apply");
const ROLLBACK_ID = process.argv.includes("--rollback")
  ? process.argv[process.argv.indexOf("--rollback") + 1]
  : null;

/** Refuse to apply if the workbook is not the shape we expect. */
const EXPECTED_ROWS = 155;
const EXPECTED_DETAIL_KEYS = 62;

const norm = (s: unknown) => String(s ?? "").trim();
const slug = (s: string) => norm(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Workbook multi-values are pipe-separated. Empty stays empty, never [""]. */
const list = (s: unknown): string[] =>
  norm(s).split("|").map((x) => x.trim()).filter(Boolean);

/**
 * Content hash with a canonical key order.
 *
 * JSON.stringify preserves insertion order, and Postgres returns jsonb keys in
 * its own order — so hashing the raw objects reported all 111 existing rows as
 * changed when a field-by-field diff showed zero differences. Sorting first
 * compares content instead of key ordering.
 */
const canonical = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(canonical);
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.keys(v as Record<string, unknown>).sort()
        .map((k) => [k, canonical((v as Record<string, unknown>)[k])]),
    );
  }
  return v;
};
const hashOf = (o: unknown) =>
  createHash("sha256").update(JSON.stringify(canonical(o))).digest("hex").slice(0, 16);

interface KbRow {
  code: string;
  kind: string;
  phase_slug: string;
  domain_slug: string;
  name: string;
  definition: string | null;
  purpose: string | null;
  developmental_task: string | null;
  healthy_markers: string[];
  common_challenges: string[];
  growth_indicators: string[];
  audiences: string[];
  status: string;
  source_ref: string | null;
  notes: string | null;
  sort_order: number;
  detail: Record<string, string | null>;
}

async function main() {
  const s = getSupabaseAdminClient();

  if (ROLLBACK_ID) {
    const { data } = await s.from("ce_import_backups").select("*").eq("id", ROLLBACK_ID).maybeSingle();
    if (!data) { console.error(`No backup ${ROLLBACK_ID}.`); process.exit(1); }
    const rows = (data as { payload: KbRow[] }).payload ?? [];
    console.log(`Restoring ${rows.length} kb_competencies rows from ${ROLLBACK_ID}…`);
    const { error } = await s.from("kb_competencies").upsert(rows, { onConflict: "code" });
    if (error) throw new Error(error.message);
    console.log("✅ restored. Rows ADDED after the backup are not removed — check the counts below.");
    return;
  }

  // --- read ----------------------------------------------------------------
  const wb = readWorkbook(readFileSync(WORKBOOK));
  const sheet = wb.sheet("22_Competency_Details");
  if (!sheet) throw new Error("22_Competency_Details not found.");
  const t = sheet.detectTable(["competency id"]);
  const H = t.headers;
  const at = (row: string[], name: string) => {
    const i = H.findIndex((h) => h.toLowerCase() === name.toLowerCase());
    return i < 0 ? "" : norm(row[i]);
  };

  if (H.filter(Boolean).length !== EXPECTED_DETAIL_KEYS) {
    console.error(`Refusing: ${H.filter(Boolean).length} columns, expected ${EXPECTED_DETAIL_KEYS}. The sheet shape changed.`);
    process.exit(1);
  }

  const incoming: KbRow[] = [];
  for (const row of t.data) {
    const code = at(row, "Competency ID");
    if (!code) continue;

    // The whole workbook row, keyed by header — the same 62-key shape the
    // existing 111 rows carry, so nothing downstream sees two formats.
    // Empty cells are stored as null, matching the existing 111 rows. Writing
    // "" instead made every row hash differently from its identical stored
    // twin, which reported all 111 as changed when nothing had changed.
    const detail: Record<string, string | null> = {};
    H.forEach((h, i) => { if (h) detail[h] = norm(row[i]) || null; });

    incoming.push({
      code,
      kind: "competency",
      phase_slug: slug(at(row, "Phase")),
      domain_slug: slug(at(row, "Domain")),
      name: at(row, "Competency Name"),
      definition: at(row, "Definition") || null,
      purpose: at(row, "Purpose") || null,
      developmental_task: at(row, "Developmental Task") || null,
      healthy_markers: list(at(row, "Observable Expressions")),
      common_challenges: list(at(row, "Common Developmental Barriers")),
      growth_indicators: list(at(row, "Common Developmental Enhancements")),
      // Matches the convention on all 111 existing rows. Descriptive, not a
      // grant: publication is ce_source_use_approvals, which stays empty here.
      audiences: ["consumer", "academy", "institute"],
      // Live, not retired. This is what validateMapping requires.
      status: "active",
      source_ref: [at(row, "Source Document"), at(row, "Source Chapter")].filter(Boolean).join("; ") || null,
      notes: at(row, "Operational Notes") || null,
      sort_order: 200,
      detail,
    });
  }

  if (incoming.length !== EXPECTED_ROWS) {
    console.error(`Refusing: ${incoming.length} competency rows, expected ${EXPECTED_ROWS}.`);
    process.exit(1);
  }

  // --- current state -------------------------------------------------------
  const { data: existingRows } = await s
    .from("kb_competencies")
    .select("code, kind, phase_slug, domain_slug, name, definition, purpose, developmental_task, healthy_markers, common_challenges, growth_indicators, audiences, status, source_ref, notes, sort_order, detail")
    .eq("kind", "competency");
  const existing = new Map((existingRows ?? []).map((r) => [(r as KbRow).code, r as unknown as KbRow]));

  const adds: KbRow[] = [], updates: KbRow[] = [], unchanged: KbRow[] = [];
  for (const row of incoming) {
    const prev = existing.get(row.code);
    if (!prev) { adds.push(row); continue; }
    // Compare the narrative, not the bookkeeping: a detail change is the thing
    // that matters, and re-writing identical rows would churn updated_at.
    (hashOf(prev.detail) === hashOf(row.detail) && prev.definition === row.definition
      ? unchanged : updates).push(row);
  }
  const incomingCodes = new Set(incoming.map((r) => r.code));
  const disappearing = [...existing.keys()].filter((c) => !incomingCodes.has(c));

  const byPhase: Record<string, number> = {};
  for (const r of incoming) byPhase[r.phase_slug] = (byPhase[r.phase_slug] ?? 0) + 1;

  console.log(`Workbook: ${WORKBOOK}`);
  console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN (no writes)"}\n`);
  console.log(`narrative rows in workbook : ${incoming.length}`);
  console.log(`  by phase : ${JSON.stringify(byPhase)}`);
  console.log(`  every row has a definition : ${incoming.every((r) => r.definition) ? "yes" : "NO"}`);
  console.log(`  every row has observable expressions : ${incoming.every((r) => r.healthy_markers.length) ? "yes" : "NO"}`);
  console.log(`\ncurrently in kb_competencies (kind=competency) : ${existing.size}`);
  console.log(`  to ADD    : ${adds.length}${adds.length ? "  e.g. " + adds.slice(0, 3).map((a) => a.code).join(", ") : ""}`);
  console.log(`  to UPDATE : ${updates.length}${updates.length ? "  e.g. " + updates.slice(0, 3).map((a) => a.code).join(", ") : ""}`);
  console.log(`  UNCHANGED : ${unchanged.length}`);
  console.log(`  in DB but NOT in workbook (never deleted) : ${disappearing.length}${disappearing.length ? " -> " + disappearing.slice(0, 5).join(", ") : ""}`);

  // Which competencies does this actually unblock?
  const { data: fw } = await s.from("fw_competencies").select("competency_id, phase");
  const fwCodes = new Set((fw ?? []).map((r) => (r as { competency_id: string }).competency_id));
  const orphanNarrative = incoming.filter((r) => !fwCodes.has(r.code));
  const unblocked = adds.filter((r) => fwCodes.has(r.code));
  console.log(`\nunblocks ${unblocked.length} canonical competencies that currently have no narrative`);
  console.log(`narrative rows with no canonical construct : ${orphanNarrative.length}${orphanNarrative.length ? " -> " + orphanNarrative.slice(0, 5).map((r) => r.code).join(", ") : " ✅"}`);
  if (orphanNarrative.length) {
    console.error("\nRefusing: narrative without a canonical construct would be unmappable text.");
    process.exit(1);
  }

  if (!APPLY) {
    console.log(`\nDry run — nothing written. Re-run with --apply once these counts look right.`);
    return;
  }

  // --- backup, then upsert -------------------------------------------------
  const backupId = crypto.randomUUID();
  const payload = [...existing.values()];
  const { error: bErr } = await s.from("ce_import_backups").insert({
    id: backupId, source: WORKBOOK, table_name: "kb_competencies",
    row_count: payload.length, payload, payload_hash: hashOf(payload),
  });
  if (bErr) throw new Error(`backup failed, aborting before any write: ${bErr.message}`);
  console.log(`\nbackup written: ${backupId} (${payload.length} rows)`);

  const { error } = await s.from("kb_competencies").upsert(incoming, { onConflict: "code" });
  if (error) {
    console.error(`\nUpsert failed: ${error.message}`);
    console.error(`Roll back with:  npx tsx scripts/importKbNarrativeV24.ts --rollback ${backupId}`);
    process.exit(1);
  }

  const { count } = await s.from("kb_competencies")
    .select("*", { count: "exact", head: true }).eq("kind", "competency");
  console.log(`\n✅ applied. kb_competencies now holds ${count} competency rows.`);
  console.log(`   rollback:  npx tsx scripts/importKbNarrativeV24.ts --rollback ${backupId}`);
  console.log(`\n   status='active' means the source record is LIVE, not approved for public use.`);
  console.log(`   ce_source_use_approvals is still the publication gate for every one of these.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
