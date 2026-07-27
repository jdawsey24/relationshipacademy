// Rev 3 server-side event registry (§9, §10.2 of docs/playbook-architecture-rev3.md).
//
// The SINGLE validated, idempotent path that writes the append-only `playbook_events`
// stream. This module is the pure, type-safe REGISTRY + payload validators. The API
// route (later step) performs the remaining ordered checks — authenticated user,
// current entitlement, registered object id, object belongs to that playbook/version,
// idempotency key not already consumed — then inserts via the service-role client.
//
// No LLM. No client insertion. Payloads are MINIMAL and functional.

export type PlaybookObjectType = "literature" | "simulation" | "play" | "mission" | "use_review";

export type PlaybookEventType =
  | "literature_opened"
  | "simulation_completed"
  | "operation_performed"
  | "mission_selected"
  | "mission_attempt_reported"
  | "use_reviewed"
  | "focus_changed";

/** A minimal runtime validator: returns true iff `payload` matches the event's schema. */
type PayloadValidator = (payload: unknown) => boolean;

export interface EventDef {
  objectType: PlaybookObjectType;
  schemaVersion: number;
  validatePayload: PayloadValidator;
}

// ---- tiny dependency-free validators ------------------------------------------
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isBool = (v: unknown) => typeof v === "boolean";
const isStr = (v: unknown) => typeof v === "string";
const optional = (v: unknown, check: (x: unknown) => boolean) => v === undefined || check(v);
/** Reject any key not in the allow-list (keeps payloads minimal + functional). */
const onlyKeys = (p: Record<string, unknown>, keys: string[]) => Object.keys(p).every((k) => keys.includes(k));

// ---- the registry -------------------------------------------------------------
// Each event declares its object type, payload schema version, and a payload
// validator. Adding an event or changing a payload shape bumps schemaVersion here.

export const EVENT_REGISTRY: Record<PlaybookEventType, EventDef> = {
  literature_opened: {
    objectType: "literature",
    schemaVersion: 1,
    // content engagement only — never a change signal
    validatePayload: (p) => isObj(p) && onlyKeys(p, ["revisit"]) && optional(p.revisit, isBool),
  },
  simulation_completed: {
    objectType: "simulation",
    schemaVersion: 1,
    validatePayload: (p) =>
      isObj(p) &&
      onlyKeys(p, ["evidence_reconsidered", "interpretation_revised_when_warranted"]) &&
      optional(p.evidence_reconsidered, isBool) &&
      optional(p.interpretation_revised_when_warranted, isBool),
  },
  operation_performed: {
    objectType: "play",
    schemaVersion: 1,
    validatePayload: (p) => isObj(p) && onlyKeys(p, []),
  },
  mission_selected: {
    objectType: "mission",
    schemaVersion: 1,
    validatePayload: (p) => isObj(p) && onlyKeys(p, ["rung_id"]) && optional(p.rung_id, isStr),
  },
  mission_attempt_reported: {
    objectType: "mission",
    schemaVersion: 1,
    validatePayload: (p) => isObj(p) && onlyKeys(p, ["rung_id"]) && optional(p.rung_id, isStr),
  },
  use_reviewed: {
    objectType: "use_review",
    schemaVersion: 1,
    // structured selects only; "performed" is the fidelity signal; kept/updated are tool-review
    validatePayload: (p) =>
      isObj(p) &&
      onlyKeys(p, ["performed", "stuck", "kept", "updated"]) &&
      optional(p.performed, (v) => v === "yes" || v === "partly" || v === "no") &&
      optional(p.stuck, isStr) &&
      optional(p.kept, isBool) &&
      optional(p.updated, isBool),
  },
  focus_changed: {
    objectType: "play",
    schemaVersion: 1,
    validatePayload: (p) => isObj(p) && onlyKeys(p, ["focus"]) && optional(p.focus, isStr),
  },
};

export function isPlaybookEventType(v: string): v is PlaybookEventType {
  return Object.prototype.hasOwnProperty.call(EVENT_REGISTRY, v);
}

/** The client-supplied shape for one logical product action to be recorded. */
export interface IncomingEvent {
  action_id: string; // idempotency key — one logical action → one event
  playbook_key: string;
  playbook_version: number;
  object_type: string;
  object_id: string;
  object_version: number;
  event_type: string;
  payload: unknown;
}

export type EventValidation =
  | { ok: true; schema_version: number }
  | { ok: false; reason: string };

/**
 * Registry-level validation (the pure part of the ordered write-path checks):
 * event is registered · object_type matches the registry · payload matches the
 * schema. Auth, entitlement, object-id registration/version, and idempotency are
 * enforced by the API route in a later step, before insertion.
 */
export function validateEvent(input: IncomingEvent): EventValidation {
  if (!input.action_id || typeof input.action_id !== "string") return { ok: false, reason: "missing action_id" };
  if (!isPlaybookEventType(input.event_type)) return { ok: false, reason: `unknown event_type: ${input.event_type}` };
  const def = EVENT_REGISTRY[input.event_type];
  if (input.object_type !== def.objectType) {
    return { ok: false, reason: `event ${input.event_type} not allowed for object_type ${input.object_type}` };
  }
  if (!def.validatePayload(input.payload)) return { ok: false, reason: "payload failed schema validation" };
  return { ok: true, schema_version: def.schemaVersion };
}
