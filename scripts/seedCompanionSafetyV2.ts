/**
 * Seed the Safety Layer V2 registry from data/companion-safety/registry.seed.json.
 *
 * INSERT-IF-ABSENT (idempotent, non-destructive): existing rows — including any
 * the clinician has edited in the admin CMS — are left untouched. Only patterns
 * not already present (same risk_category + canonical_concept + pattern) are added.
 *
 * PREREQUISITES:
 *   1. Owner has reviewed data/companion-safety/registry.seed.json (severities!).
 *   2. Owner has run supabase/migrations/0048_safety_v2.sql in production.
 *
 * RUN (after both):
 *   (set -a; . ./.env.local; set +a; npx tsx scripts/seedCompanionSafetyV2.ts)
 */
import { readFileSync } from "node:fs";
import { getSupabaseAdminClient } from "../lib/supabase";

interface RuleGroup { concept: string; severity: 1 | 2 | 3; match_type: string; patterns: string[]; negation_sensitive?: boolean; context_required?: boolean }
interface ImmGroup { kind: string; match_type: string; implies_category?: string; patterns: string[] }
interface RespRow { level: string; heading: string; message: string; discreet_mode?: boolean }
interface Seed {
  registry_version?: string;
  rules: Record<string, RuleGroup[]>;
  immediacy_terms: ImmGroup[];
  responses?: RespRow[];
}

async function main() {
  const seed = JSON.parse(readFileSync(new URL("../data/companion-safety/registry.seed.json", import.meta.url), "utf8")) as Seed & { _meta?: { registry_version?: string } };
  const version = seed.registry_version ?? seed._meta?.registry_version ?? "2.0.0";
  const s = getSupabaseAdminClient();

  // ---- triggers ----
  const { data: existingTrig } = await s.from("companion_safety_triggers").select("risk_category, canonical_concept, pattern");
  const trigKey = (c: string, k: string, p: string) => `${c}|${k}|${p.toLowerCase()}`;
  const haveTrig = new Set((existingTrig ?? []).map((r) => trigKey(r.risk_category ?? "", r.canonical_concept ?? "", r.pattern ?? "")));

  const trigRows: Record<string, unknown>[] = [];
  for (const [category, groups] of Object.entries(seed.rules)) {
    for (const g of groups) {
      for (const pattern of g.patterns) {
        if (haveTrig.has(trigKey(category, g.concept, pattern))) continue;
        trigRows.push({
          pattern, match_type: g.match_type ?? "phrase", risk_category: category,
          canonical_concept: g.concept, severity: g.severity,
          context_required: g.context_required ?? true,
          negation_sensitive: g.negation_sensitive ?? true,
          is_active: true, registry_version: version, created_by: "seed:v2",
          notes: "Seeded from registry.seed.json (owner-reviewed).",
        });
      }
    }
  }

  // ---- immediacy terms ----
  const { data: existingImm } = await s.from("companion_safety_immediacy_terms").select("kind, pattern");
  const immKey = (k: string, p: string) => `${k}|${p.toLowerCase()}`;
  const haveImm = new Set((existingImm ?? []).map((r) => immKey(r.kind ?? "", r.pattern ?? "")));
  const immRows: Record<string, unknown>[] = [];
  for (const g of seed.immediacy_terms) {
    for (const pattern of g.patterns) {
      if (haveImm.has(immKey(g.kind, pattern))) continue;
      immRows.push({
        pattern, match_type: g.match_type ?? "phrase", kind: g.kind,
        implies_category: g.implies_category ?? null, is_active: true,
        registry_version: version, created_by: "seed:v2",
      });
    }
  }

  // ---- responses (owner-approved copy) — insert-if-absent by level ----
  const { data: existingResp } = await s.from("companion_safety_responses").select("level");
  const haveResp = new Set((existingResp ?? []).map((r) => r.level));
  const respRows = (seed.responses ?? [])
    .filter((r) => !haveResp.has(r.level))
    .map((r) => ({ level: r.level, heading: r.heading, message: r.message, discreet_mode: r.discreet_mode ?? false, is_active: true, updated_by: "seed:v2" }));

  if (trigRows.length) {
    const { error } = await s.from("companion_safety_triggers").insert(trigRows);
    if (error) throw error;
  }
  if (immRows.length) {
    const { error } = await s.from("companion_safety_immediacy_terms").insert(immRows);
    if (error) throw error;
  }
  if (respRows.length) {
    const { error } = await s.from("companion_safety_responses").insert(respRows);
    if (error) throw error;
  }

  console.log(`Seeded ${trigRows.length} new triggers, ${immRows.length} new immediacy terms, ${respRows.length} new responses (registry_version ${version}).`);
  console.log(`Skipped ${haveTrig.size} existing triggers / ${haveImm.size} existing terms / ${haveResp.size} existing responses (non-destructive).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
