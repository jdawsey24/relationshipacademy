/**
 * Import the approved platform keyword + Community records from
 * import/RLC_Cross_Platform_Keyword_System.xlsx into ce_platform_keywords,
 * ce_communities and ce_community_keywords.
 *
 *   report only (default — touches nothing):
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/importPlatformKeywords.ts)
 *   write:
 *     (set -a; . ./.env.local; set +a; npx tsx scripts/importPlatformKeywords.ts --apply)
 *
 * WHY THIS IS NOT A GENERIC IMPORTER
 * The seven platform sheets have deliberately different schemas — Threads is a
 * conversation phrase with a Community, TikTok is a spoken natural-language
 * query, YouTube is a long-tail search title, LinkedIn is a professional problem
 * framing, Pinterest is evergreen search language. Collapsing them into one
 * generic "keyword" list would destroy the thing that makes the workbook useful,
 * so each sheet gets an explicit column map below.
 *
 * PHASE TAGS ARE PRESERVED. The workbook uses compound tags ("Exploration /
 * Exclusivity", "Trust / Communication"). The raw string is stored verbatim in
 * phase_raw/domain_raw and the resolved fw_* ids are stored as ARRAYS. A tag that
 * doesn't resolve is REPORTED, never silently dropped.
 *
 * Idempotent: upserts on (platform, primary_phrase).
 */
import { readFileSync } from "node:fs";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { readWorkbook, type Sheet } from "@/lib/contentEngine/xlsx";

const WORKBOOK = "import/RLC_Cross_Platform_Keyword_System.xlsx";
const APPLY = process.argv.includes("--apply");

/** Per-sheet column mapping. `phrase` is that platform's native phrasing column. */
interface SheetMap {
  sheet: string;
  platform: string;
  phraseKind: string;
  phrase: string[];            // candidate header names, first match wins
  community?: string[];
  signalRole?: string[];
  doorway?: string[];
  interpretation?: string[];
  openingUse?: string[];
  supporting?: string[];
  format?: string[];
  cta?: string[];
}

const MAPS: SheetMap[] = [
  // Each platform names its phrase column differently — that IS the point of the
  // workbook, so every column name below was read off the sheet, not guessed.
  { sheet: "Threads",   platform: "threads",   phraseKind: "conversation",
    phrase: ["Primary keyword / phrase"], community: ["Community keyword"],
    signalRole: ["Signal role"], doorway: ["Audience doorway"],
    interpretation: ["RLC interpretation"], openingUse: ["Opening use"],
    supporting: ["Supporting terms"], format: ["Best format"], cta: ["CTA fit"] },
  { sheet: "Instagram", platform: "instagram", phraseKind: "spoken_query",
    phrase: ["Search phrase"], doorway: ["Audience doorway"],
    interpretation: ["RLC interpretation"], openingUse: ["Spoken hook", "On-screen text"],
    supporting: ["Supporting terms"], format: ["Best format"], cta: ["CTA fit"] },
  { sheet: "TikTok",    platform: "tiktok",    phraseKind: "spoken_query",
    phrase: ["Natural-language query"], doorway: ["Audience doorway"],
    interpretation: ["RLC interpretation"], openingUse: ["Spoken hook", "On-screen text"],
    supporting: ["Supporting terms"], format: ["Best format"], cta: ["CTA fit"] },
  { sheet: "YouTube",   platform: "youtube",   phraseKind: "search_title",
    phrase: ["Target search query"], doorway: ["Audience doorway"],
    interpretation: ["RLC interpretation"], openingUse: ["Video title", "Opening use"],
    supporting: ["Supporting terms"], format: ["Best format"], cta: ["CTA fit"] },
  { sheet: "LinkedIn",  platform: "linkedin",  phraseKind: "professional",
    phrase: ["Professional keyword"], doorway: ["Business problem", "Primary audience"],
    interpretation: ["RLC workplace bridge"], openingUse: ["Opening line"],
    supporting: ["Supporting professional terms"], format: ["Best format"], cta: ["CTA fit"] },
  { sheet: "X",         platform: "x",         phraseKind: "conversation",
    phrase: ["Exact phrase"], doorway: ["Audience doorway"],
    interpretation: ["RLC interpretation"], openingUse: ["Opening use"],
    supporting: ["Supporting terms"], format: ["Best format"], cta: ["CTA fit"] },
  { sheet: "Pinterest", platform: "pinterest", phraseKind: "evergreen",
    phrase: ["Long-tail search phrase"], doorway: ["Audience doorway"],
    interpretation: ["RLC interpretation"], openingUse: ["Opening use"],
    supporting: ["Supporting terms"], format: ["Best format"], cta: ["CTA fit"] },
];

const SCORE_COLS: Record<string, string[]> = {
  score_audience:   ["Audience recognition (1-5)", "Audience recognition"],
  score_platform:   ["Platform fit (1-5)", "Platform fit"],
  score_rlc:        ["RLC fit (1-5)", "RLC fit"],
  score_conversion: ["Conversion fit (1-5)", "Conversion fit"],
  score_momentum:   ["Momentum / evergreen (1-5)", "Momentum / evergreen"],
};

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

function pick(headers: string[], names: string[] | undefined): number {
  if (!names) return -1;
  for (const n of names) {
    const i = headers.findIndex((h) => norm(h) === norm(n));
    if (i >= 0) return i;
  }
  return -1;
}

/** Split "Exploration / Exclusivity" without losing either side. */
const splitTag = (raw: string) =>
  raw.split(/[/;,]/).map((s) => s.trim()).filter(Boolean);

/**
 * Resolve a workbook tag string to canonical ids.
 *
 * Two shapes the workbook uses that a naive split gets wrong:
 *   "All" / "All domains"          -> every id, not an unresolved tag
 *   "Emotional / Physical Intimacy" -> "Emotional" + "Physical Intimacy", where the
 *                                      first fragment shares the second's trailing
 *                                      noun. Repaired by re-trying "<fragment>
 *                                      <last word of the final fragment>".
 * Anything still unresolved is REPORTED, never silently dropped.
 */
function resolveTags(raw: string, lookup: Map<string, string>, unresolved: Set<string>): string[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  if (/^all( domains| phases)?$/i.test(trimmed)) return [...new Set(lookup.values())];

  const parts = splitTag(trimmed);
  const tail = parts[parts.length - 1] ?? "";
  const suffix = tail.split(/\s+/).slice(-1)[0] ?? "";
  const ids: string[] = [];
  for (const part of parts) {
    const direct = lookup.get(norm(part));
    if (direct) { ids.push(direct); continue; }
    const repaired = suffix && !norm(part).endsWith(norm(suffix))
      ? lookup.get(norm(`${part} ${suffix}`))
      : undefined;
    if (repaired) ids.push(repaired); else unresolved.add(part);
  }
  return [...new Set(ids)];
}

interface Report {
  platform: string; sheet: string; headerRow: number; read: number;
  mapped: number; skippedNoPhrase: number;
  unresolvedPhases: Set<string>; unresolvedDomains: Set<string>;
  communities: Set<string>;
}

async function main() {
  const wb = readWorkbook(readFileSync(WORKBOOK));
  const admin = getSupabaseAdminClient();

  // Framework lookups — names to ids. The ONLY source of valid tags.
  const [{ data: phases }, { data: domains }] = await Promise.all([
    admin.from("fw_phases").select("phase_id, name"),
    admin.from("fw_domains").select("domain_id, name"),
  ]);
  const phaseByName = new Map((phases ?? []).map((p) => [norm(p.name as string), p.phase_id as string]));
  const domainByName = new Map((domains ?? []).map((d) => [norm(d.name as string), d.domain_id as string]));
  // The workbook says "Physical Intimacy"; canon may say "Physical/Sexual Intimacy".
  for (const [name, id] of [...domainByName]) {
    if (name.includes("physical")) domainByName.set("physical/sexual intimacy", id);
  }

  const rows: Record<string, unknown>[] = [];
  const commRows: { platform: string; community_keyword: string }[] = [];
  const links: { platform: string; community: string; phrase: string }[] = [];
  const reports: Report[] = [];

  for (const map of MAPS) {
    const sheet: Sheet | undefined = wb.sheet(map.sheet);
    if (!sheet) { console.log(`  ⚠ sheet not found: ${map.sheet}`); continue; }
    const { headerRow, headers, data } = sheet.detectTable(["rank"]);
    const rep: Report = {
      platform: map.platform, sheet: map.sheet, headerRow, read: data.length,
      mapped: 0, skippedNoPhrase: 0,
      unresolvedPhases: new Set(), unresolvedDomains: new Set(), communities: new Set(),
    };

    const iPhrase = pick(headers, map.phrase);
    const iRank = pick(headers, ["Rank", "#"]);
    const iPhase = pick(headers, ["RLC phase"]);
    const iDomain = pick(headers, ["RLC domain"]);
    const iComm = pick(headers, map.community);
    const iOpp = pick(headers, ["Opportunity score"]);
    const iTier = pick(headers, ["Priority tier"]);

    data.forEach((r, idx) => {
      const phrase = iPhrase >= 0 ? String(r[iPhrase] ?? "").trim() : "";
      if (!phrase) { rep.skippedNoPhrase++; return; }

      const phaseRaw = iPhase >= 0 ? String(r[iPhase] ?? "").trim() : "";
      const domainRaw = iDomain >= 0 ? String(r[iDomain] ?? "").trim() : "";
      const phaseIds = resolveTags(phaseRaw, phaseByName, rep.unresolvedPhases);
      const domainIds = resolveTags(domainRaw, domainByName, rep.unresolvedDomains);

      const scores: Record<string, number | null> = {};
      for (const [col, names] of Object.entries(SCORE_COLS)) {
        const i = pick(headers, names);
        const v = i >= 0 ? Number(r[i]) : NaN;
        scores[col] = Number.isFinite(v) ? v : null;
      }

      const supportingRaw = pick(headers, map.supporting) >= 0
        ? String(r[pick(headers, map.supporting)] ?? "") : "";

      rows.push({
        platform: map.platform,
        rank: iRank >= 0 && Number.isFinite(Number(r[iRank])) ? Number(r[iRank]) : null,
        primary_phrase: phrase,
        phrase_kind: map.phraseKind,
        signal_role: pick(headers, map.signalRole) >= 0 ? String(r[pick(headers, map.signalRole)] ?? "") || null : null,
        audience_doorway: pick(headers, map.doorway) >= 0 ? String(r[pick(headers, map.doorway)] ?? "") || null : null,
        rlc_interpretation: pick(headers, map.interpretation) >= 0 ? String(r[pick(headers, map.interpretation)] ?? "") || null : null,
        opening_use: pick(headers, map.openingUse) >= 0 ? String(r[pick(headers, map.openingUse)] ?? "") || null : null,
        supporting_terms: supportingRaw.split(/;|,/).map((s) => s.trim()).filter(Boolean),
        best_format: pick(headers, map.format) >= 0 ? String(r[pick(headers, map.format)] ?? "") || null : null,
        cta_fit: pick(headers, map.cta) >= 0 ? String(r[pick(headers, map.cta)] ?? "") || null : null,
        phase_raw: phaseRaw || null,
        phase_ids: phaseIds,
        domain_raw: domainRaw || null,
        domain_ids: domainIds,
        ...scores,
        opportunity_score: iOpp >= 0 && Number.isFinite(Number(r[iOpp])) ? Number(r[iOpp]) : null,
        priority_tier: iTier >= 0 ? String(r[iTier] ?? "") || null : null,
        source_sheet: map.sheet,
        source_row: headerRow + 1 + idx,
      });
      rep.mapped++;

      if (iComm >= 0) {
        const c = String(r[iComm] ?? "").trim();
        if (c) {
          rep.communities.add(c);
          commRows.push({ platform: map.platform, community_keyword: c });
          links.push({ platform: map.platform, community: c, phrase });
        }
      }
    });

    reports.push(rep);
  }

  // ---- Reconciliation report -------------------------------------------------
  console.log(`\nWorkbook: ${WORKBOOK}`);
  console.log(`Mode: ${APPLY ? "APPLY (writes)" : "DRY RUN (no writes)"}\n`);
  console.log("platform    sheet       hdr  read  mapped  skipped  communities");
  for (const r of reports) {
    console.log(
      `${r.platform.padEnd(11)} ${r.sheet.padEnd(11)} ${String(r.headerRow).padStart(3)} ` +
      `${String(r.read).padStart(5)} ${String(r.mapped).padStart(7)} ${String(r.skippedNoPhrase).padStart(8)} ` +
      `${String(r.communities.size).padStart(12)}`
    );
  }
  const totalMapped = reports.reduce((a, r) => a + r.mapped, 0);
  const uniqComm = new Map(commRows.map((c) => [`${c.platform}::${c.community_keyword}`, c]));
  console.log(`\nkeyword rows: ${totalMapped}   communities: ${uniqComm.size}   community links: ${links.length}`);

  const upTags = new Set<string>(), udTags = new Set<string>();
  reports.forEach((r) => { r.unresolvedPhases.forEach((x) => upTags.add(x)); r.unresolvedDomains.forEach((x) => udTags.add(x)); });
  console.log(`unresolved phase tags : ${upTags.size ? [...upTags].join(" | ") : "none ✅"}`);
  console.log(`unresolved domain tags: ${udTags.size ? [...udTags].join(" | ") : "none ✅"}`);

  if (!APPLY) {
    console.log("\nDry run — nothing written. Re-run with --apply after the migration is applied.");
    return;
  }

  // ---- Write ----------------------------------------------------------------
  const { error: kErr } = await admin
    .from("ce_platform_keywords")
    .upsert(rows, { onConflict: "platform,primary_phrase" });
  if (kErr) throw new Error(`keywords: ${kErr.message}`);

  if (uniqComm.size) {
    const { error: cErr } = await admin
      .from("ce_communities")
      .upsert([...uniqComm.values()], { onConflict: "platform,community_keyword" });
    if (cErr) throw new Error(`communities: ${cErr.message}`);
  }

  // Link table needs ids; re-read both sides.
  const { data: kw } = await admin.from("ce_platform_keywords").select("id, platform, primary_phrase");
  const { data: cm } = await admin.from("ce_communities").select("id, platform, community_keyword");
  const kwId = new Map((kw ?? []).map((k) => [`${k.platform}::${k.primary_phrase}`, k.id as string]));
  const cmId = new Map((cm ?? []).map((c) => [`${c.platform}::${c.community_keyword}`, c.id as string]));
  const linkRows = links
    .map((l) => ({ community_id: cmId.get(`${l.platform}::${l.community}`), keyword_id: kwId.get(`${l.platform}::${l.phrase}`) }))
    .filter((l): l is { community_id: string; keyword_id: string } => !!l.community_id && !!l.keyword_id);
  if (linkRows.length) {
    const { error: lErr } = await admin
      .from("ce_community_keywords")
      .upsert(linkRows, { onConflict: "community_id,keyword_id" });
    if (lErr) throw new Error(`links: ${lErr.message}`);
  }

  console.log(`\n✅ wrote ${rows.length} keywords, ${uniqComm.size} communities, ${linkRows.length} links.`);
  console.log("Community attributes (official status, verification, authority fit, …) are");
  console.log("deliberately left NULL — the workbook has none. Author them in the UI.");
}

main().then(() => process.exit(0)).catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
