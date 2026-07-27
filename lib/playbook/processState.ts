// Rev 3 process-state model (§1 of docs/playbook-architecture-rev3.md).
//
// Product/process states — NOT RLC constructs. They exist so the system never
// collapses "completed a Play" into "improved". Pure + unit-testable; no I/O.
//
//   Exposure          — encountered/read/practiced-in-app (never a change claim)
//   Attempt           — tried to use the operation (in-sim and/or real world)
//   Technique Fidelity — used it as intended, in-app (evidence-anchored, not "changed my mind")
//   Transfer          — attempted to carry it into >=1 authentic context beyond the rehearsal

export type ProcessState = "exposure" | "attempt" | "technique_fidelity" | "transfer";

export const PROCESS_STATE_ORDER: ProcessState[] = ["exposure", "attempt", "technique_fidelity", "transfer"];

/**
 * The separately-tracked functional signals (§1, "never conflated"). Tool-review
 * signals are Change-Path inputs but are NOT Transfer. Transfer requires a reported
 * attempt to enact in an authentic context beyond the original rehearsal.
 */
export interface ProcessSignals {
  exposure?: boolean; // opened literature / viewed a simulation / explored a play
  attempt?: boolean; // performed the operation, or selected/《reported》 a mission
  technique_fidelity?: boolean; // in-app: reconsidered evidence & revised when warranted
  tool_reviewed?: boolean; // reviewed the saved tool against experience
  tool_retained?: boolean; // kept it
  tool_updated?: boolean; // revised it
  used_in_another_context?: boolean; // reported real-world enactment beyond the rehearsal
  technique_fidelity_in_context?: boolean; // reported/structured in-context fidelity
  /** Progression-advance counts toward Transfer ONLY when it follows real-world enactment. */
  progression_advanced?: boolean;
}

/**
 * The HIGHEST process-state legitimately supported by the signals. Deliberately
 * conservative: tool-review alone never reaches Transfer; progression-advance
 * only contributes to Transfer if real-world enactment was also reported.
 */
export function highestProcessState(s: ProcessSignals): ProcessState {
  const transfer =
    Boolean(s.used_in_another_context) ||
    Boolean(s.technique_fidelity_in_context) ||
    (Boolean(s.progression_advanced) && Boolean(s.used_in_another_context));
  if (transfer) return "transfer";
  if (s.technique_fidelity) return "technique_fidelity";
  if (s.attempt) return "attempt";
  return "exposure";
}

/** True only where evidence legitimately supports canonical Developmental Application:
 *  real-context Transfer evidence, never in-app Attempt/Fidelity alone (§1). */
export function supportsDevelopmentalApplication(s: ProcessSignals): boolean {
  return Boolean(s.used_in_another_context) || Boolean(s.technique_fidelity_in_context);
}
