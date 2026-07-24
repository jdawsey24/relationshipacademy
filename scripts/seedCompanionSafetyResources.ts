/**
 * Enter the owner-approved U.S. production safety resources into the CMS.
 * Owner-approved (see the conversation) with official sources. Verification fields
 * carry the OWNER/ADMIN identity + the actual verification date — never an AI.
 * Jurisdiction is US (NOT global): routing stays jurisdiction-aware.
 *
 * Idempotent: matches an existing row by (resource_kind, jurisdiction) and updates
 * it, else inserts. Run:
 *   (set -a; . ./.env.local; set +a; npx tsx scripts/seedCompanionSafetyResources.ts)
 */
import { getSupabaseAdminClient } from "../lib/supabase";

const VERIFIED_BY = "Janelle Dawsey, LMFT";     // owner/admin of record (human verifier)
const VERIFIED_AT = "2026-07-24T00:00:00Z";      // actual date of verification

const RESOURCES = [
  {
    name: "988 Suicide & Crisis Lifeline",
    description: "Free, confidential crisis support, 24/7.",
    contact: "Call or text 988",
    url: "https://988lifeline.org/get-help/",
    jurisdiction: "US",
    hours: "24/7",
    resource_kind: "suicide_crisis",
    applies_to_categories: ["self_harm"],
    applies_to_levels: ["2", "3", "immediate_danger"],
    source: "988lifeline.org/get-help/",
    sort_order: 1,
  },
  {
    name: "National Domestic Violence Hotline",
    description: "Advocates available 24/7 for anyone affected by relationship abuse.",
    contact: "Call 800-799-7233 · Text START to 88788",
    url: "https://www.thehotline.org/get-help/",
    jurisdiction: "US",
    hours: "24/7",
    resource_kind: "ipv",
    applies_to_categories: ["ipv"],
    applies_to_levels: ["2", "3", "immediate_danger"],
    source: "thehotline.org/get-help/",
    sort_order: 2,
  },
  {
    name: "RAINN National Sexual Assault Hotline",
    description: "Free, confidential support for survivors of sexual assault, 24/7.",
    contact: "Call 800-656-4673 · Text HOPE to 64673",
    url: "https://www.rainn.org/help-and-healing/hotline/",
    jurisdiction: "US",
    hours: "24/7",
    resource_kind: "sexual_assault",
    applies_to_categories: ["sexual_coercion"],
    applies_to_levels: ["2", "3", "immediate_danger"],
    source: "rainn.org/help-and-healing/hotline/",
    sort_order: 3,
  },
  {
    name: "U.S. Emergency Services (911)",
    description: "For an immediate emergency or danger to life or safety.",
    contact: "Call 911",
    url: "https://www.911.gov/calling-911/",
    jurisdiction: "US",
    hours: "24/7",
    resource_kind: "emergency",
    applies_to_categories: [],           // routed by kind (immediate / undetermined / harm_to_others)
    applies_to_levels: ["3", "immediate_danger"],
    source: "911.gov/calling-911/",
    sort_order: 0,
  },
];

async function main() {
  const s = getSupabaseAdminClient();
  for (const r of RESOURCES) {
    const row = {
      name: r.name, description: r.description, contact: r.contact, url: r.url,
      jurisdiction: r.jurisdiction, hours: r.hours, resource_kind: r.resource_kind,
      applies_to_categories: r.applies_to_categories, applies_to_levels: r.applies_to_levels,
      sort_order: r.sort_order, source: r.source,
      verified_by: VERIFIED_BY, verified_at: VERIFIED_AT, is_active: true,
      updated_at: new Date().toISOString(),
    };
    const { data: existing } = await s.from("companion_safety_resources")
      .select("id").eq("resource_kind", r.resource_kind).eq("jurisdiction", r.jurisdiction).limit(1).maybeSingle();
    if (existing?.id) {
      const { error } = await s.from("companion_safety_resources").update(row).eq("id", existing.id);
      console.log(`${error ? "ERR " + error.message : "updated"}  ${r.name}`);
    } else {
      const { error } = await s.from("companion_safety_resources").insert(row);
      console.log(`${error ? "ERR " + error.message : "inserted"}  ${r.name}`);
    }
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
