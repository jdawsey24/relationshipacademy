// End-to-end smoke test for POST /api/score.
//
// Pulls the real snapshot questions from Supabase (so it works with whatever
// the live item IDs actually are), submits a full attempt to the running API,
// then reads back every table to confirm rows were written.
//
// Usage (after filling in .env.local and starting `npm run dev`):
//   npm run test:score
//
// Optional overrides:
//   API_BASE_URL   defaults to http://localhost:3000
//   STRUCTURAL_PHASE_SLUG  defaults to a competency phase (exercises alignment)

import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";

function fail(msg) {
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
}

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  fail(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Fill in .env.local — `npm run test:score` loads it automatically."
  );
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const COMPETENCY_STRUCTURAL = ["exploration", "exclusivity", "expansion"];

async function main() {
  const sessionId = randomUUID();
  console.log(`\n▶ Test session: ${sessionId}`);
  console.log(`▶ API base:    ${BASE_URL}\n`);

  // 1. Load the snapshot question set.
  const { data: questions, error: qErr } = await supabase
    .from("questions")
    .select("id, score_direction, in_snapshot")
    .eq("in_snapshot", true);
  if (qErr) fail(`Could not read questions: ${qErr.message}`);
  if (!questions?.length) fail("No snapshot questions found in the database.");
  console.log(`✔ Loaded ${questions.length} snapshot questions`);

  // 2. Pick a valid structural phase (prefer a competency phase to exercise alignment).
  const { data: structural, error: spErr } = await supabase
    .from("structural_phases")
    .select("slug");
  if (spErr) fail(`Could not read structural_phases: ${spErr.message}`);
  const slugs = (structural ?? []).map((s) => s.slug);
  const structuralPhaseSlug =
    process.env.STRUCTURAL_PHASE_SLUG ??
    COMPETENCY_STRUCTURAL.find((s) => slugs.includes(s)) ??
    slugs[0];
  if (!structuralPhaseSlug) fail("No structural_phases rows found.");
  console.log(`✔ Using structural phase: ${structuralPhaseSlug}`);

  // 3. Build a full set of responses (every snapshot item answered "4").
  const responses = questions.map((q) => ({
    question_id: q.id,
    raw_response: 4,
  }));

  const body = {
    session_id: sessionId,
    quiz_type: "snapshot",
    name: "Test Runner",
    email: "test@relationshiplc.com",
    relationship_length: "2-5 years",
    relationship_status_detail: "Living together",
    structural_phase_slug: structuralPhaseSlug,
    responses,
  };

  // 4. Call the API.
  let res;
  try {
    res = await fetch(`${BASE_URL}/api/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    fail(
      `Could not reach ${BASE_URL}/api/score — is the dev server running? (${e.message})`
    );
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    fail(`API returned ${res.status}: ${JSON.stringify(json, null, 2)}`);
  }
  console.log(`\n✔ API responded 200. Response body:`);
  console.log(JSON.stringify(json, null, 2));

  // 5. Verify rows were written to every table.
  const expiringPhase = structuralPhaseSlug === "expiration";
  const checks = [
    { table: "quiz_sessions", col: "id", min: 1 },
    { table: "structural_phase_selection", col: "session_id", min: 1 },
    { table: "quiz_responses", col: "session_id", min: 1 },
    { table: "domain_scores", col: "session_id", min: 1 },
    { table: "competency_phase_scores", col: "session_id", min: 1 },
    { table: "expiration_risk_results", col: "session_id", min: 0 },
    {
      table: "alignment_results",
      col: "session_id",
      // alignment is written only for competency structural phases
      min: expiringPhase ? 0 : 1,
    },
  ];

  console.log(`\n▶ Verifying writes:\n`);
  let allGood = true;
  for (const { table, col, min } of checks) {
    const { count, error } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq(col, sessionId);
    if (error) {
      console.log(`  ✖ ${table.padEnd(28)} ERROR: ${error.message}`);
      allGood = false;
      continue;
    }
    const ok = (count ?? 0) >= min;
    if (!ok) allGood = false;
    const mark = ok ? "✔" : "✖";
    const note = min === 0 && count === 0 ? " (none expected for this phase)" : "";
    console.log(`  ${mark} ${table.padEnd(28)} rows: ${count ?? 0}${note}`);
  }

  if (!allGood) {
    fail("One or more tables did not receive the expected rows (see above).");
  }
  console.log(`\n✅ All five result tables wrote correctly for session ${sessionId}\n`);
}

main().catch((e) => fail(e.stack || String(e)));
