// Rev 3 Step 6 — client seam for the append-only longitudinal event stream.
//
// Product actions update current-state (practice_state, etc.) AND, through this seam, emit
// a VALIDATED, IDEMPOTENT event. `buildPlaybookEvent` constructs + registry-validates the
// event with a stable action_id (idempotency key). `emitPlaybookEvent` best-effort POSTs it
// to the server writer — which lands the append-only row once the endpoint + migration are
// live (owner-gated). Payloads are MINIMAL functional metadata only: no relationship
// narrative, no partner-monitoring data.

import { validateEvent, type IncomingEvent, type PlaybookEventType, type PlaybookObjectType } from "@/lib/playbook/events";

function genActionId(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  return c?.randomUUID ? c.randomUUID() : `act-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

export interface BuildEventInput {
  playbookKey: string;
  playbookVersion: number;
  objectType: PlaybookObjectType;
  objectId: string;
  objectVersion: number;
  eventType: PlaybookEventType;
  payload: Record<string, unknown>;
  actionId?: string; // supply to make retries idempotent; otherwise generated
}

/** Build + registry-validate an event. Returns null if it doesn't conform (never emit junk). */
export function buildPlaybookEvent(input: BuildEventInput): IncomingEvent | null {
  const event: IncomingEvent = {
    action_id: input.actionId ?? genActionId(),
    playbook_key: input.playbookKey,
    playbook_version: input.playbookVersion,
    object_type: input.objectType,
    object_id: input.objectId,
    object_version: input.objectVersion,
    event_type: input.eventType,
    payload: input.payload,
  };
  return validateEvent(event).ok ? event : null;
}

/** Best-effort append to the server event stream. No-op-on-failure until the endpoint +
 *  migration are live; the server enforces idempotency on (user_id, action_id). */
export async function emitPlaybookEvent(playbookKey: string, event: IncomingEvent): Promise<void> {
  try {
    await fetch(`/api/playbook/${encodeURIComponent(playbookKey)}/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch {
    /* best-effort: current-state already persisted; the longitudinal write lands when live */
  }
}
