// Cluster 4 — "Learning to Date Without Losing Hope" content scaffold.
// Plays-only (PD-9); publish held (not yet in keys.ts INTERACTIVE / commerce map).
import { test } from "node:test";
import assert from "node:assert/strict";
import { validatePlaybookContent } from "../lib/playbook/contentValidate";
import { DATING_WITHOUT_LOSING_HOPE } from "../content/playbook/dating-without-losing-hope";
import { getPlaybookContent } from "../content/playbook";
import { clusterIdForKey, hasInteractivePlaybook } from "../lib/playbook/keys";

test("cluster 4 content module is structurally valid", () => {
  const errs = validatePlaybookContent(DATING_WITHOUT_LOSING_HOPE);
  assert.deepEqual(errs, [], "content errors: " + errs.join("; "));
});

test("cluster 4 has the three approved Plays, each with an output + portable", () => {
  const ids = DATING_WITHOUT_LOSING_HOPE.plays.map((p) => p.playId).sort();
  assert.deepEqual(ids, ["how-many-at-once", "them-or-the-pattern", "whos-actually-here"]);
  for (const p of DATING_WITHOUT_LOSING_HOPE.plays) {
    assert.ok(p.screens.some((s) => s.kind === "output"), `${p.playId} has an output screen`);
    assert.ok(p.portable.length > 0, `${p.playId} has a portable form`);
  }
});

test("cluster 4 is registered as content but NOT yet publish-wired", () => {
  // Loadable for preview/validation…
  assert.ok(getPlaybookContent("dating-without-losing-hope"));
  // …but the app must not serve it until keys.ts wiring + the §10 gates clear.
  assert.equal(hasInteractivePlaybook("dating-without-losing-hope"), false);
  assert.equal(clusterIdForKey("dating-without-losing-hope"), null);
});

test("cluster 4 literature cross-links all resolve (validator does not check literature)", () => {
  const lit = DATING_WITHOUT_LOSING_HOPE.literature ?? [];
  assert.equal(lit.length, 12);
  const ids = new Set(lit.map((e) => e.id));
  for (const e of lit) {
    for (const r of e.related ?? []) {
      assert.ok(ids.has(r), `literature "${e.id}" related "${r}" does not resolve`);
    }
  }
});
