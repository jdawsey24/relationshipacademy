import { test } from "node:test";
import assert from "node:assert/strict";
import { validateEvent, EVENT_REGISTRY, isPlaybookEventType, type IncomingEvent } from "../lib/playbook/events";

function base(over: Partial<IncomingEvent>): IncomingEvent {
  return {
    action_id: "a-1",
    playbook_key: "moving-beyond-rejection",
    playbook_version: 1,
    object_type: "simulation",
    object_id: "sim-rd",
    object_version: 1,
    event_type: "simulation_completed",
    payload: { evidence_reconsidered: true },
    ...over,
  };
}

test("valid event passes and returns the registry schema_version", () => {
  const r = validateEvent(base({}));
  assert.deepEqual(r, { ok: true, schema_version: 1 });
});

test("missing action_id is rejected (idempotency key required)", () => {
  const r = validateEvent(base({ action_id: "" }));
  assert.equal(r.ok, false);
});

test("unknown event_type is rejected", () => {
  const r = validateEvent(base({ event_type: "made_up_event" }));
  assert.equal(r.ok, false);
  assert.equal(isPlaybookEventType("made_up_event"), false);
});

test("event_type must match its registered object_type", () => {
  const r = validateEvent(base({ object_type: "play" })); // simulation_completed is for 'simulation'
  assert.equal(r.ok, false);
});

test("payload must match the per-event schema; unknown keys rejected (minimal payloads)", () => {
  assert.equal(validateEvent(base({ payload: { evidence_reconsidered: "yes" } })).ok, false, "wrong type");
  assert.equal(validateEvent(base({ payload: { partner_name: "x" } })).ok, false, "extra/surveillance key rejected");
  assert.equal(validateEvent(base({ payload: {} })).ok, true, "all-optional payload is fine");
});

test("use_reviewed accepts only bounded structured values", () => {
  const ev = (payload: unknown) =>
    validateEvent(base({ object_type: "use_review", object_id: "ur-rd", event_type: "use_reviewed", payload }));
  assert.equal(ev({ performed: "partly", kept: true }).ok, true);
  assert.equal(ev({ performed: "maybe" }).ok, false, "performed is a bounded enum");
});

test("every registered event has a positive integer schema_version", () => {
  for (const [name, def] of Object.entries(EVENT_REGISTRY)) {
    assert.ok(Number.isInteger(def.schemaVersion) && def.schemaVersion >= 1, `${name} schemaVersion`);
  }
});
