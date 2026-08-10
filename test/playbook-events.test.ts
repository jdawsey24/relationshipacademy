import { test } from "node:test";
import assert from "node:assert/strict";
import { validateEvent, EVENT_REGISTRY, isPlaybookEventType, type IncomingEvent } from "../lib/playbook/events";

function base(over: Partial<IncomingEvent>): IncomingEvent {
  return {
    action_id: "a-1",
    playbook_key: "finding-love-that-feels-mutual",
    playbook_version: 1,
    object_type: "simulation",
    object_id: "sim-rd",
    object_version: 1,
    event_type: "simulation_completed",
    payload: { signature: "evidenceTimeline", evidence_reconsidered: "demonstrated" },
    ...over,
  };
}

test("valid event passes and returns the registry schema_version", () => {
  const r = validateEvent(base({}));
  assert.deepEqual(r, { ok: true, schema_version: 3 });
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
  assert.equal(validateEvent(base({ payload: { signature: "evidenceTimeline", evidence_reconsidered: "yes" } })).ok, false, "wrong type");
  assert.equal(validateEvent(base({ payload: { signature: "evidenceTimeline", partner_name: "x" } })).ok, false, "extra/surveillance key rejected");
  assert.equal(validateEvent(base({ payload: { signature: "evidenceTimeline" } })).ok, true, "minimal payload (signature only) is fine");
  assert.equal(validateEvent(base({ payload: {} })).ok, false, "signature is required (discriminant)");
  assert.equal(validateEvent(base({ payload: { signature: "made_up_signature" } })).ok, false, "unknown signature rejected");
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
