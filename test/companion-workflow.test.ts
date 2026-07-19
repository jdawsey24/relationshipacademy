import { test } from "node:test";
import assert from "node:assert/strict";
import {
  canTransition, nextStatus, isEditable, BLOCK_TYPES, BLOCK_TYPE_SET, isInputBlock, TRANSITIONS,
} from "../lib/companion";

test("only Draft is editable", () => {
  assert.equal(isEditable("draft"), true);
  for (const s of ["internal_review", "theory_review", "safety_review", "approved", "published", "archived"] as const) {
    assert.equal(isEditable(s), false, `${s} must not be editable`);
  }
});

test("editors can submit; only owner advances/publishes", () => {
  assert.equal(canTransition("draft", "submit_for_review", false), true);   // editor
  assert.equal(canTransition("internal_review", "advance", false), false);  // editor blocked
  assert.equal(canTransition("internal_review", "advance", true), true);    // owner
  assert.equal(canTransition("approved", "publish", true), true);
  assert.equal(canTransition("approved", "publish", false), false);
});

test("ladder advances Draft -> ... -> Published and can revise/archive", () => {
  assert.equal(nextStatus("draft", "submit_for_review"), "internal_review");
  assert.equal(nextStatus("internal_review", "advance"), "theory_review");
  assert.equal(nextStatus("theory_review", "advance"), "safety_review");
  assert.equal(nextStatus("safety_review", "approve"), "approved");
  assert.equal(nextStatus("approved", "publish"), "published");
  assert.equal(nextStatus("published", "unpublish"), "approved");
  assert.equal(nextStatus("approved", "revise"), "draft");   // reopen without touching published version
  assert.equal(nextStatus("published", "archive"), "archived");
});

test("invalid transitions are rejected", () => {
  assert.equal(canTransition("draft", "publish", true), false);
  assert.equal(canTransition("published", "advance", true), false);
  assert.equal(nextStatus("archived", "publish"), null);
});

test("all 22 block types present; input flag consistent", () => {
  assert.equal(BLOCK_TYPES.length, 22);
  assert.equal(BLOCK_TYPE_SET.has("free_write"), true);
  assert.equal(BLOCK_TYPE_SET.has("not_a_block"), false);
  assert.equal(isInputBlock("reflection_long"), true);
  assert.equal(isInputBlock("educational_note"), false);
});

test("every from-state's transitions point to a real status", () => {
  for (const [, actions] of Object.entries(TRANSITIONS)) {
    for (const t of Object.values(actions)) {
      assert.ok(["draft", "internal_review", "theory_review", "safety_review", "approved", "published", "archived"].includes(t!.to));
    }
  }
});
