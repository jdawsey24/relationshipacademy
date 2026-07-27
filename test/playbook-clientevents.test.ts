import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPlaybookEvent } from "../lib/playbook/clientEvents";

const base = {
  playbookKey: "moving-beyond-rejection",
  playbookVersion: 1,
  objectType: "mission" as const,
  objectId: "mission-rd-read-before-react",
  objectVersion: 1,
};

test("builds a validated, idempotent mission_selected event with minimal payload", () => {
  const ev = buildPlaybookEvent({ ...base, eventType: "mission_selected", payload: {} });
  assert.ok(ev, "valid event built");
  assert.ok(ev!.action_id && ev!.action_id.length > 0, "carries an idempotency key");
  assert.equal(ev!.event_type, "mission_selected");
  assert.deepEqual(ev!.payload, {}, "minimal payload");
});

test("mission_attempt_reported accepts the minimal {rung_id} payload", () => {
  const ev = buildPlaybookEvent({ ...base, eventType: "mission_attempt_reported", payload: { rung_id: "decide" } });
  assert.ok(ev);
  assert.deepEqual(ev!.payload, { rung_id: "decide" });
});

test("a supplied action_id is preserved (retry idempotency)", () => {
  const ev = buildPlaybookEvent({ ...base, eventType: "mission_selected", payload: {}, actionId: "fixed-123" });
  assert.equal(ev!.action_id, "fixed-123");
});

test("non-conforming payload is rejected (never emit junk)", () => {
  const ev = buildPlaybookEvent({ ...base, eventType: "mission_selected", payload: { partner_name: "x" } });
  assert.equal(ev, null, "extra/surveillance keys rejected by the registry");
});

test("event/object mismatch is rejected", () => {
  const ev = buildPlaybookEvent({ ...base, objectType: "play", eventType: "mission_selected", payload: {} });
  assert.equal(ev, null);
});
