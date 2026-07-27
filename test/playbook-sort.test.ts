import { test } from "node:test";
import assert from "node:assert/strict";
import { correctionFor, allAssigned } from "../lib/playbook/sortLogic";
import type { SortItem } from "../lib/playbook/contentSchema";

const withCriterion: SortItem = { id: "i1", text: "t", correctBucket: "supports", correction: "nope" };
const plain: SortItem = { id: "i2", text: "t2" };

test("correctionFor fires only on the wrong bucket for criterion items", () => {
  assert.equal(correctionFor(withCriterion, "cant"), "nope");
  assert.equal(correctionFor(withCriterion, "supports"), null);
  assert.equal(correctionFor(plain, "anything"), null); // no criterion → never corrects
});

test("allAssigned is true only when every item has a bucket", () => {
  const items = [withCriterion, plain];
  assert.equal(allAssigned(items, {}), false);
  assert.equal(allAssigned(items, { i1: "supports" }), false);
  assert.equal(allAssigned(items, { i1: "supports", i2: "cant" }), true);
});
