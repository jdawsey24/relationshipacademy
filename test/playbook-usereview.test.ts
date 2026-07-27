import { test } from "node:test";
import assert from "node:assert/strict";
import { MOVING_BEYOND_REJECTION as C } from "../content/playbook/moving-beyond-rejection";
import { MBR_USE_REVIEWS } from "../content/playbook/moving-beyond-rejection-usereviews";
import { useReviewForPlay } from "../lib/playbook/rev3Flow";
import { recordUseReview, markMissionReviewed, recordMissionSelected } from "../lib/playbook/progressActions";
import { emptyProgress } from "../lib/playbook/contentSchema";

const builtPlayIds = new Set(C.plays.map((p) => p.playId));

test("each built Play has a structured Use Review (bounded selects, no journaling)", () => {
  assert.equal(MBR_USE_REVIEWS.length, 2);
  for (const r of MBR_USE_REVIEWS) {
    assert.ok(builtPlayIds.has(r.playId));
    for (const prompt of [r.didDifferently, r.performedOperation, r.becameClearer, r.stuckWhere]) {
      assert.ok(prompt.label.trim().length > 0, `${r.id} prompt has a label`);
      assert.ok(prompt.options.length >= 2, `${r.id} prompt is a bounded select`);
    }
    // performedOperation is the yes/partly/no fidelity signal
    assert.deepEqual(r.performedOperation.options, ["Yes", "Partly", "Not really"]);
  }
  assert.equal(useReviewForPlay(C, "read-and-decide")?.id, "review-read-and-decide");
});

test("recordUseReview persists structured signals (feeds Change Path); additive", () => {
  const p0 = emptyProgress("moving-beyond-rejection", 1);
  const p1 = recordUseReview(p0, "read-and-decide", { performed: "partly", stuck: "Acting on what I already saw", kept: true });
  assert.equal(p1.use_review_state?.version, 1);
  assert.deepEqual(p1.use_review_state?.reviews?.["read-and-decide"], { performed: "partly", stuck: "Acting on what I already saw", kept: true });
  assert.deepEqual(p1.recognized, []);
});

test("markMissionReviewed sets the mission state to reviewed", () => {
  const p0 = recordMissionSelected(emptyProgress("moving-beyond-rejection", 1), "mission-rd-read-before-react");
  const p1 = markMissionReviewed(p0, "mission-rd-read-before-react");
  assert.equal(p1.practice_state?.missions?.["mission-rd-read-before-react"]?.state, "reviewed");
});
