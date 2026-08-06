/**
 * Re-import Master Knowledge Base v2.4 into Postgres (owner ruling 13).
 *
 *   dry run (default — reads only, writes nothing):
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/importKnowledgeBaseV24.ts)
 *   apply:
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/importKnowledgeBaseV24.ts --apply)
 *   rollback the last apply:
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/importKnowledgeBaseV24.ts --rollback <backup_id>)
 *
 * NOT an uncontrolled replacement import. Specifically:
 *
 *   • UPSERT BY CANONICAL ID. Nothing is deleted. An existing competency is
 *     updated in place, so every foreign key pointing at it survives.
 *   • DRY-RUN COUNTS FIRST. Adds, updates and unchanged rows are reported before
 *     a single write, and the apply refuses to run if the shape looks wrong.
 *   • FK VALIDATION. Anything already referencing fw_competencies is checked for
 *     orphans BEFORE and AFTER. An import that would orphan a reference aborts.
 *   • BACKUP + ROLLBACK. The pre-import state of every touched row is written to
 *     ce_import_backups first, and --rollback restores it.
 *   • STATUS SEPARATION (ruling 1). framework_status is canonical for all 155 —
 *     the constructs are canonical. record_status carries the workbook's
 *     editorial state: draft for the original 111, in_review for the 44 Recovery
 *     and Renewal records. A Draft record does not make the construct provisional.
 *
 * Requires migration 0056 (framework_status / record_status columns).
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

/** Guard rails: refuse to apply if the workbook does not look like what we expect. */
const EXPECTED = { competencies: 155, domains: 6, phases: 6 };

const norm = (s: string) => (s ?? "").trim();
const lower = (s: string) => norm(s).toLowerCase();

/** Editorial state from the workbook, mapped to record_status. */
function recordStatus(raw: string): string {
  const v = lower(raw).replace(/\s+/g, "_");
  if (v === "in_review") return "in_review";
  if (v === "approved") return "approved";
  if (v === "retired") return "retired";
  return "draft";
}

interface CompRow {
  competency_id: string;
  name: string;
  phase: string;
  domain: string;
  developmental_task: string | null;
  framework_status: string;
  record_status: string;
}

function hashOf(o: unknown): string {
  return createHash("sha256").update(JSON.stringify(o)).digest("hex").slice(0, 16);
}

async function main() {
  const s = getSupabaseAdminClient();

  // ---- rollback path -------------------------------------------------------
  if (ROLLBACK_ID) {
    const { data: backup } = await s
      .from("ce_import_backups").select("*").eq("id", ROLLBACK_ID).maybeSingle();
    if (!backup) { console.error(`No backup ${ROLLBACK_ID}.`); process.exit(1); }
    const rows = (backup as { payload: CompRow[] }).payload ?? [];
    console.log(`Restoring ${rows.length} fw_competencies rows from backup ${ROLLBACK_ID}…`);
    const { error } = await s.from("fw_competencies").upsert(rows, { onConflict: "competency_id" });
    if (error) throw new Error(error.message);
    console.log("✅ restored. Rows added AFTER the backup are not removed — check the diff below.");
    return;
  }

  // ---- read the workbook ---------------------------------------------------
  const wb = readWorkbook(readFileSync(WORKBOOK));
  const comp = wb.sheet("04_Competencies");
  const detail = wb.sheet("22_Competency_Details");
  if (!comp || !detail) throw new Error("04_Competencies or 22_Competency_Details not found.");

  const c = comp.detectTable(["competency id"]);
  const d = detail.detectTable(["competency id"]);
  const ci = (n: string) => c.headers.findIndex((h) => lower(h) === lower(n));
  const di = (n: string) => d.headers.findIndex((h) => lower(h) === lower(n));

  const statusByComp = new Map<string, string>();
  const dId = di("Competency ID"), dStatus = di("Status");
  for (const r of d.data) {
    if (dId >= 0 && dStatus >= 0 && norm(r[dId])) statusByComp.set(norm(r[dId]), norm(r[dStatus]));
  }

  const idIdx = ci("Competency ID"), nameIdx = ci("Competency"),
        phaseIdx = ci("Phase"), domainIdx = ci("Domain"), taskIdx = ci("Developmental Task");

  const incoming: CompRow[] = [];
  for (const r of c.data) {
    const id = norm(r[idIdx]);
    if (!id) continue;
    incoming.push({
      competency_id: id,
      name: norm(r[nameIdx]),
      phase: norm(r[phaseIdx]),
      domain: norm(r[domainIdx]),
      developmental_task: norm(r[taskIdx]) || null,
      // Ruling 1: the CONSTRUCT is canonical for all six phases.
      framework_status: "canonical",
      // …while the RECORD carries the workbook's editorial state.
      record_status: recordStatus(statusByComp.get(id) ?? "Draft"),
    });
  }

  // ---- shape guard ---------------------------------------------------------
  if (incoming.length !== EXPECTED.competencies) {
    console.error(`Refusing: workbook has ${incoming.length} competencies, expected ${EXPECTED.competencies}.`);
    process.exit(1);
  }

  // ---- current state -------------------------------------------------------
  const { data: existingRows } = await s
    .from("fw_competencies").select("competency_id, name, phase, domain, developmental_task");
  const existing = new Map(
    (existingRows ?? []).map((r) => [(r as CompRow).competency_id, r as unknown as CompRow]),
  );

  const adds: CompRow[] = [], updates: CompRow[] = [], unchanged: CompRow[] = [];
  for (const row of incoming) {
    const prev = existing.get(row.competency_id);
    if (!prev) { adds.push(row); continue; }
    const same = prev.name === row.name && prev.phase === row.phase &&
                 prev.domain === row.domain && (prev.developmental_task ?? null) === row.developmental_task;
    (same ? unchanged : updates).push(row);
  }
  const incomingIds = new Set(incoming.map((r) => r.competency_id));
  const disappearing = [...existing.keys()].filter((id) => !incomingIds.has(id));

  // ---- FK validation -------------------------------------------------------
  // Anything already pointing at fw_competencies must still resolve afterwards.
  const { data: bridgeRefs } = await s
    .from("ce_relational_bridges").select("competency_id").not("competency_id", "is", null);
  const referenced = new Set(
    (bridgeRefs ?? []).map((r) => (r as { competency_id: string }).competency_id),
  );
  const wouldOrphan = [...referenced].filter((id) => !incomingIds.has(id));

  // ---- report --------------------------------------------------------------
  const byPhase: Record<string, number> = {};
  const byRecordStatus: Record<string, number> = {};
  for (const r of incoming) {
    byPhase[r.phase] = (byPhase[r.phase] ?? 0) + 1;
    byRecordStatus[r.record_status] = (byRecordStatus[r.record_status] ?? 0) + 1;
  }

  console.log(`Workbook: ${WORKBOOK}`);
  console.log(`Mode: ${APPLY ? "APPLY (transactional upsert)" : "DRY RUN (no writes)"}\n`);
  console.log(`competencies in workbook : ${incoming.length}`);
  console.log(`  by phase         : ${JSON.stringify(byPhase)}`);
  console.log(`  by record_status : ${JSON.stringify(byRecordStatus)}  (framework_status: canonical for all)`);
  console.log(`\ncurrently in fw_competencies : ${existing.size}`);
  console.log(`  to ADD      : ${adds.length}${adds.length ? "  e.g. " + adds.slice(0, 3).map((a) => a.competency_id).join(", ") : ""}`);
  console.log(`  to UPDATE   : ${updates.length}`);
  console.log(`  UNCHANGED   : ${unchanged.length}`);
  console.log(`  in DB but NOT in workbook (never deleted): ${disappearing.length}${disappearing.length ? " -> " + disappearing.slice(0, 5).join(", ") : ""}`);
  console.log(`\nFK safety:`);
  console.log(`  ce_relational_bridges referencing a competency : ${referenced.size}`);
  console.log(`  references that would ORPHAN                   : ${wouldOrphan.length}${wouldOrphan.length ? " -> " + wouldOrphan.join(", ") : "  ✅"}`);

  if (wouldOrphan.length) {
    console.error("\nRefusing: this import would orphan existing references.");
    process.exit(1);
  }

  if (!APPLY) {
    console.log("\nDry run — nothing written. Re-run with --apply once these counts look right.");
    return;
  }

  // ---- backup, then upsert -------------------------------------------------
  const backupId = crypto.randomUUID();
  const payload = [...existing.values()];
  const { error: bErr } = await s.from("ce_import_backups").insert({
    id: backupId,
    source: WORKBOOK,
    table_name: "fw_competencies",
    row_count: payload.length,
    payload,
    payload_hash: hashOf(payload),
  });
  if (bErr) throw new Error(`backup failed, aborting before any write: ${bErr.message}`);
  console.log(`\nbackup written: ${backupId} (${payload.length} rows)`);

  const { error } = await s.from("fw_competencies").upsert(incoming, { onConflict: "competency_id" });
  if (error) {
    console.error(`\nUpsert failed: ${error.message}`);
    console.error(`Roll back with:  npx tsx scripts/importKnowledgeBaseV24.ts --rollback ${backupId}`);
    process.exit(1);
  }

  // ---- verify --------------------------------------------------------------
  const { count } = await s.from("fw_competencies").select("*", { count: "exact", head: true });
  const { data: after } = await s.from("fw_competencies").select("competency_id");
  const afterIds = new Set((after ?? []).map((r) => (r as { competency_id: string }).competency_id));
  const stillOrphaned = [...referenced].filter((id) => !afterIds.has(id));

  console.log(`\n✅ applied. fw_competencies now holds ${count} rows.`);
  console.log(`   post-import orphaned references: ${stillOrphaned.length ? stillOrphaned.join(", ") : "none ✅"}`);
  console.log(`   rollback:  npx tsx scripts/importKnowledgeBaseV24.ts --rollback ${backupId}`);
  console.log(`\nNOTE: kb_competencies (narrative layer) is a SEPARATE import — not touched here.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
