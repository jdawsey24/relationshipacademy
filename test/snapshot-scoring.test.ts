import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreClusters } from "../lib/snapshot/scoring";

test("primary is the most-picked cluster, secondary the runner-up", () => {
  const r = scoreClusters([5, 5, 5, 1, 1, 3]);
  assert.equal(r.primary?.clusterId, 5);
  assert.equal(r.primary?.wins, 3);
  assert.equal(r.secondary?.clusterId, 1);
  assert.equal(r.secondary?.wins, 2);
  assert.equal(r.isTied, false);
});

test("a first-place tie is flagged with no secondary until resolved", () => {
  const r = scoreClusters([5, 5, 1, 1, 3]);
  assert.equal(r.isTied, true);
  assert.deepEqual(r.tiedClusterIds.sort((a, b) => a - b), [1, 5]);
  assert.equal(r.secondary, null);
});

test("ranking is deterministic (win count desc, then cluster id)", () => {
  const a = scoreClusters([3, 3, 7, 7, 1]);
  const b = scoreClusters([7, 1, 3, 7, 3]);
  assert.deepEqual(a.ranked, b.ranked);
  // 3 and 7 tie at 2 → id order puts 3 first in the ranked list
  assert.equal(a.ranked[0].clusterId, 3);
});

test("empty answers yield no result, not a crash", () => {
  const r = scoreClusters([]);
  assert.equal(r.primary, null);
  assert.equal(r.secondary, null);
  assert.equal(r.isTied, false);
});
