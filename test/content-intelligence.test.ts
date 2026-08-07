import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { classifySentence, worthRaising } from "@/lib/contentIntelligence/language";
import { LIFECYCLE, OPTIONAL_GOVERNANCE_ACTION } from "@/lib/contentIntelligence/lenses";
import { DEFAULT_VISIBLE, FIELD_LABEL, BRIEF_FIELDS } from "@/lib/contentIntelligence/brief";

const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");

// ---------------------------------------------------------------------------
// 1. Audience-directed language is not a group claim
// ---------------------------------------------------------------------------

test("naming the intended audience is recorded, never raised", () => {
  const f = classifySentence("Some women don't want to accept what the inconsistency means.");
  const audience = f.find((x) => x.kind === "audience_reference");
  assert.ok(audience, "“some women” must register as an audience reference");
  assert.equal(audience.raise, false, "the audience must not be challenged");
});

test("a universal generalization IS raised", () => {
  const f = worthRaising("Men always know immediately whether they want to marry you.");
  assert.ok(f.some((x) => x.kind === "universal_generalization"));
});

test("the motive attribution is what gets questioned, not the audience", () => {
  const raised = worthRaising("Some women aren't truly confused about it.");
  assert.equal(raised.length, 1, "exactly one thing is worth asking about here");
  assert.equal(raised[0].kind, "motive_attribution");
  assert.match(raised[0].prompt, /What have you seen/,
    "it asks for the observation behind the reading, it does not correct the sentence");
});

test("an empirical claim is separated from an interpretation", () => {
  assert.ok(worthRaising("Most people know within the first month.")
    .some((x) => x.kind === "empirical_claim"));
  assert.deepEqual(worthRaising("In my experience most people know within the first month."), [],
    "hedged into a reading, it is no longer an empirical claim");
});

// ---------------------------------------------------------------------------
// 2. Thesis fidelity
// ---------------------------------------------------------------------------

test("a sharpened restatement is not stored as the decided main point", () => {
  const src = read("lib/contentIntelligence/brief.ts");
  assert.match(src, /a SHARPENED restatement is not the\s*\n?\/\/ same claim/);
  assert.match(src, /the second drops the mechanism/);
  // Owner-touched fields produce a suggestion, never a replacement.
  assert.match(src, /if \(prev && PROTECTED\.includes\(prev\.state\)\)/);
  assert.match(src, /ci_field_suggestions/);
});

test("every brief field is protected, not only the thesis", () => {
  const src = read("lib/contentIntelligence/brief.ts");
  const guard = src.slice(src.indexOf("const PROTECTED"), src.indexOf("export async function readBrief"));
  assert.match(guard, /owner_edited/);
  assert.match(guard, /owner_confirmed/);
  // The protection is applied before any field-specific logic.
  const infer = src.slice(src.indexOf("export async function inferField"));
  assert.ok(infer.indexOf("PROTECTED.includes") > 0, "the check runs for every field");
});

test("a thesis cannot come from a keyword alone", () => {
  const src = read("lib/contentIntelligence/brief.ts");
  assert.match(src, /if \(input\.field === "thesis"\)/);
  assert.match(src, /A main point has to come from something you said/);
});

// ---------------------------------------------------------------------------
// 3. Mapping lifecycle
// ---------------------------------------------------------------------------

test("reusable approval is not a stage of the lifecycle", () => {
  assert.deepEqual([...LIFECYCLE], [
    "candidate", "suggested", "selected",
    "validated_for_this_content", "draft_specific_bridge", "final_mapping_snapshot",
  ]);
  assert.ok(!(LIFECYCLE as readonly string[]).includes(OPTIONAL_GOVERNANCE_ACTION),
    "approval for reuse is a separate optional action, not the default final stage");
});

test("selecting a lens creates a draft-specific bridge, not an approved one", () => {
  const src = read("lib/contentIntelligence/lenses.ts");
  assert.match(src, /lifecycle_state: "validated_for_current_content"/);
  assert.ok(!/lifecycle_state: "owner_approved"[\s\S]{0,400}selectLens/.test(src));
  assert.match(src, /Validation for one draft never promotes a bridge|validating it\s*\n \* for this piece of content does not promote it/);
});

test("reuse approval is refused for material still in review", () => {
  const src = read("lib/contentIntelligence/lenses.ts");
  assert.match(src, /export async function approveForReuse/);
  assert.match(src, /cannot become a reusable mapping/);
});

test("the database defaults a bridge to the least privileged state", () => {
  const sql = read("supabase/migrations/0065_content_intelligence_sources.sql");
  assert.match(sql, /add column if not exists lifecycle_state text not null default 'draft'/);
});

// ---------------------------------------------------------------------------
// 4. Refined Option C
// ---------------------------------------------------------------------------

test("indexing is separated from framework approval", () => {
  const sql = read("supabase/migrations/0065_content_intelligence_sources.sql");
  assert.match(sql, /add column if not exists index_state/);
  assert.match(sql, /add column if not exists framework_approval_state/);
  assert.match(sql, /`status='active'` MEANT TWO THINGS AT ONCE/);
});

test("Recovery and Renewal keep their working provenance and stay in review", () => {
  const sql = read("supabase/migrations/0065_content_intelligence_sources.sql");
  assert.match(sql, /set framework_approval_state = 'in_review'/);
  assert.match(sql, /v0\.1 \(working; July 2026\)/);
  assert.match(sql, /code ~ '-\(RECV\|RENW\)-'/);
});

test("in-review material cannot become a validated mapping", () => {
  const src = read("lib/contentIntelligence/lenses.ts");
  assert.match(src, /source_approval_state !== "approved" && lens\.source_approval_state !== "draft"/);
  assert.match(src, /still a working draft that hasn't been approved/);
});

test("the provisional notice is one sentence, and only when it applies", () => {
  const src = read("lib/contentIntelligence/lenses.ts");
  assert.match(src, /export function provisionalNotice/);
  assert.match(src, /if \(lens\.source_approval_state === "approved" \|\| lens\.source_approval_state === "draft"\) return null;/);
});

// ---------------------------------------------------------------------------
// 5. Source governance
// ---------------------------------------------------------------------------

test("approval and supersession both require evidence", () => {
  const sql = read("supabase/migrations/0065_content_intelligence_sources.sql");
  assert.match(sql, /approval_state <> 'approved' or approval_evidence is not null/);
  assert.match(sql, /supersedes_id is null or supersession_evidence is not null/);
});

test("no Knowledge Base version is labelled approved", () => {
  const sql = read("supabase/migrations/0065_content_intelligence_sources.sql");
  assert.match(sql, /Current Knowledge Base implementation source, approval status unresolved/);
  assert.ok(!/'knowledge_base'[\s\S]{0,400}'approved'/.test(sql),
    "the Knowledge Base row must not claim approval");
});

test("quarantined records can never be retrieval-eligible", () => {
  const sql = read("supabase/migrations/0065_content_intelligence_sources.sql");
  assert.match(sql, /governance_status <> 'quarantined' or retrieval_eligible = false/);
  assert.match(sql, /'framework_crosswalk', null, 'quarantined', false/);
});

test("Companion sources are scoped in the data, not by prompt text", () => {
  const sql = read("supabase/migrations/0065_content_intelligence_sources.sql");
  assert.match(sql, /'product_companion'/);
  assert.match(sql, /enforced in the retrieval query, not in prompt text/);
});

// ---------------------------------------------------------------------------
// 6. Voice
// ---------------------------------------------------------------------------

test("voice rules start empty and cannot be approved without an approver", () => {
  const sql = read("supabase/migrations/0066_content_intelligence_conversation.sql");
  assert.match(sql, /status <> 'owner_approved' or approved_by is not null/);
  assert.match(sql, /The Playbook's documented voice belongs to a\s*\n--\s*different product and is NOT migrated here/);
  assert.ok(!/insert into public\.ce_voice_rules/.test(sql), "no voice rule is seeded");
});

test("a conversation-inferred preference can never be approved directly", () => {
  const sql = read("supabase/migrations/0066_content_intelligence_conversation.sql");
  assert.match(sql, /origin <> 'inferred_from_conversation' or status <> 'owner_approved'/);
});

// ---------------------------------------------------------------------------
// 7. Cost
// ---------------------------------------------------------------------------

test("limits are configurable and reaching one never destroys work", () => {
  const sql = read("supabase/migrations/0066_content_intelligence_conversation.sql");
  assert.match(sql, /conversation_soft_limit_usd numeric\(10,2\) not null default 4/);
  assert.match(sql, /conversation_hard_limit_usd numeric\(10,2\) not null default 6/);
  assert.match(sql, /daily_cost_limit_usd = 50/);
  assert.match(sql, /monthly_cost_limit_usd = 500/);

  const src = read("lib/contentIntelligence/conversation.ts");
  assert.match(src, /REACHING A LIMIT NEVER DESTROYS WORK/);
  assert.match(src, /Everything is saved/);
  assert.match(src, /export async function authoriseContinue/);
});

// ---------------------------------------------------------------------------
// 8. The default interface
// ---------------------------------------------------------------------------

test("home asks one question and offers one input", () => {
  const src = read("app/admin/content-studio/page.tsx");
  assert.match(src, /What are we thinking about\?/);
  assert.ok(!/Explore with me|Build it/.test(src), "no workflow choice before thinking starts");
  assert.match(src, /see what people are talking about/);
});

test("the workspace shows no technical vocabulary", () => {
  const src = read("app/admin/content-studio/c/[id]/page.tsx");
  for (const word of ["competency", "bridge", "inferred", "owner_edited", "mapping_valid",
                      "phase_id", "domain_id", "approval_state"]) {
    assert.ok(!new RegExp(`>[^<]*\\b${word}\\b`, "i").test(src),
      `"${word}" must not appear in the default view`);
  }
  assert.match(src, /What we&rsquo;ve decided/);
});

test("only five things show by default, with plain labels", () => {
  assert.deepEqual(DEFAULT_VISIBLE, ["thesis", "audience", "editorial_direction", "format", "purpose"]);
  assert.equal(FIELD_LABEL.thesis, "Main point");
  assert.equal(FIELD_LABEL.audience, "Who it's for");
  assert.ok(BRIEF_FIELDS.length > DEFAULT_VISIBLE.length, "the rest exists but is not shown");
});

test("the studio does not claim a voice it has not been given", () => {
  const src = read("app/admin/content-studio/c/[id]/page.tsx");
  assert.match(src, /No approved voice rules yet/);
});
