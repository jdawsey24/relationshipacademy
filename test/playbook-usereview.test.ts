import { test } from "node:test";
import assert from "node:assert/strict";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/finding-love-that-feels-mutual";
import { MBR_USE_REVIEWS } from "../content/playbook/finding-love-that-feels-mutual-usereviews";
import { useReviewForPlay } from "../lib/playbook/rev3Flow";
import { recordUseReview, reviewEntries, markMissionReviewed, recordMissionSelected } from "../lib/playbook/progressActions";
import { emptyProgress } from "../lib/playbook/contentSchema";

const builtPlayIds = new Set(C.plays.map((p) => p.playId));

test("each built Play has a structured Use Review (bounded selects, no journaling)", () => {
  assert.equal(MBR_USE_REVIEWS.length, 6);
  // Every built Cluster-1 Play now has a Use Review (all six covered).
  for (const p of C.plays) {
    assert.ok(useReviewForPlay(C, p.playId), `${p.playId} has a Use Review`);
  }
  for (const r of MBR_USE_REVIEWS) {
    assert.ok(builtPlayIds.has(r.playId));
    for (const prompt of [r.didDifferently, r.performedOperation, r.becameClearer, r.stuckWhere]) {
      assert.ok(prompt.label.trim().length > 0, `${r.id} prompt has a label`);
      assert.ok(prompt.options.length >= 2, `${r.id} prompt is a bounded select`);
    }
    // multi where more than one response can apply; single, prioritized friction point
    assert.equal(r.didDifferently.multi, true, `${r.id} did-differently is multi-select`);
    assert.equal(r.becameClearer.multi, true, `${r.id} became-clearer is multi-select`);
    assert.notEqual(r.stuckWhere.multi, true, `${r.id} stuck is single-select (prioritized)`);
    assert.match(r.stuckWhere.label, /stuck most/i, `${r.id} asks where stuck MOST`);
    // non-evaluative fidelity prompt; consumer options still map to yes/partly/no
    assert.match(r.performedOperation.label, /how closely did you use the move/i);
    assert.deepEqual(r.performedOperation.options, ["Pretty closely", "Some of it", "Not really this time"]);
  }
  // RD: Discernment isn't equated with passive waiting
  const rd = MBR_USE_REVIEWS.find((r) => r.playId === "read-and-decide")!;
  assert.ok(rd.didDifferently.options.includes("I figured out what would actually tell me more"));
  assert.ok(!rd.didDifferently.options.some((o) => /waited/i.test(o)), "no passive-waiting option");
  assert.equal(useReviewForPlay(C, "read-and-decide")?.id, "review-read-and-decide");
});

test("recordUseReview persists structured signals as a logged use (feeds Change Path); additive", () => {
  const p0 = emptyProgress("finding-love-that-feels-mutual", 1);
  const p1 = recordUseReview(p0, "read-and-decide", { performed: "partly", stuck: "Acting on what I already saw", kept: true });
  assert.equal(p1.use_review_state?.version, 1);
  assert.deepEqual(p1.use_review_state?.reviews?.["read-and-decide"], [{ performed: "partly", stuck: "Acting on what I already saw", kept: true }]);
  assert.deepEqual(p1.recognized, []);
});

test("recordUseReview accumulates multiple real-life uses over time (never overwrites), newest last, with timestamps", () => {
  const p0 = emptyProgress("finding-love-that-feels-mutual", 1);
  const p1 = recordUseReview(p0, "read-and-decide", { performed: "yes" }, "2026-07-01T10:00:00.000Z");
  const p2 = recordUseReview(p1, "read-and-decide", { performed: "partly", stuck: "s" }, "2026-07-20T10:00:00.000Z");
  const list = p2.use_review_state?.reviews?.["read-and-decide"];
  assert.equal(list?.length, 2, "both uses kept, not overwritten");
  assert.deepEqual(list?.[0], { performed: "yes", at: "2026-07-01T10:00:00.000Z" });
  assert.deepEqual(list?.[1], { performed: "partly", stuck: "s", at: "2026-07-20T10:00:00.000Z" }, "newest last");
});

test("recordUseReview coerces a legacy single-object review into the list before appending", () => {
  const p0 = emptyProgress("finding-love-that-feels-mutual", 1);
  // Simulate a legacy row where reviews[pid] is a single object, not a list.
  const legacy = { ...p0, use_review_state: { version: 1, reviews: { "read-and-decide": { performed: "no" } } } } as unknown as typeof p0;
  const p1 = recordUseReview(legacy, "read-and-decide", { performed: "yes" });
  assert.deepEqual(p1.use_review_state?.reviews?.["read-and-decide"], [{ performed: "no" }, { performed: "yes" }]);
});

test("recordUseReview stores an optional trimmed 'experience' note on the entry (bounded)", () => {
  const p0 = emptyProgress("finding-love-that-feels-mutual", 1);
  const p1 = recordUseReview(p0, "read-and-decide", { performed: "yes" }, "2026-07-28T10:00:00.000Z", "  we made a plan and I said the real thing  ");
  const e = p1.use_review_state?.reviews?.["read-and-decide"]?.[0];
  assert.equal(e?.experience, "we made a plan and I said the real thing", "trimmed, stored on the entry");
  // an empty/whitespace note is not stored
  const p2 = recordUseReview(p1, "read-and-decide", { performed: "partly" }, undefined, "   ");
  assert.equal("experience" in (p2.use_review_state?.reviews?.["read-and-decide"]?.[1] ?? {}), false, "blank note omitted");
  // very long note is capped
  const p3 = recordUseReview(p0, "read-and-decide", {}, undefined, "x".repeat(5000));
  assert.equal(p3.use_review_state?.reviews?.["read-and-decide"]?.[0]?.experience?.length, 2000, "note capped at 2000");
});

test("reviewEntries tolerates absent, legacy-object, and list shapes", () => {
  const p0 = emptyProgress("finding-love-that-feels-mutual", 1);
  assert.deepEqual(reviewEntries(p0, "read-and-decide"), []);
  const legacy = { ...p0, use_review_state: { version: 1, reviews: { x: { performed: "partly" } } } } as unknown as typeof p0;
  assert.deepEqual(reviewEntries(legacy, "x"), [{ performed: "partly" }]);
  const list = recordUseReview(p0, "x", { performed: "yes" });
  assert.equal(reviewEntries(list, "x").length, 1);
});

test("markMissionReviewed sets the mission state to reviewed", () => {
  const p0 = recordMissionSelected(emptyProgress("finding-love-that-feels-mutual", 1), "mission-rd-read-before-react");
  const p1 = markMissionReviewed(p0, "mission-rd-read-before-react");
  assert.equal(p1.practice_state?.missions?.["mission-rd-read-before-react"]?.state, "reviewed");
});
