// Server-side sanitization of incoming progress (unit-testable, no request coupling).
// user_id / playbook_key / playbook_version are AUTHORITATIVE from the server, never
// trusted from the client. Functional data only; outputs version-stamped.
//
// Phase D: the Rev 3 separated state objects (simulation/practice/use_review/change_path/
// literature) are now carried through (they persist to the 0053 jsonb columns). Each is
// sanitized to its bounded, enum-validated functional shape — no free-text bloat, no
// partner data, sizes capped — before it can reach the DB.

import {
  emptyProgress,
  type PlaybookProgress,
  type PlayStateValue,
  type StoredOutput,
  type SavedPlayCard,
  type LiteratureState,
  type SimulationState,
  type SimulationRunState,
  type PracticeState,
  type MissionRunState,
  type UseReviewState,
  type UseReviewSignals,
  type UseReviewEntry,
  type ChangePathState,
  type FidelityOutcome,
} from "@/lib/playbook/contentSchema";

const STATES: PlayStateValue[] = ["available", "explored", "in_my_plays", "used"];

export function sanitizeStates(v: unknown): Record<string, PlayStateValue> {
  const out: Record<string, PlayStateValue> = {};
  if (v && typeof v === "object") {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (typeof val === "string" && (STATES as string[]).includes(val)) out[k] = val as PlayStateValue;
    }
  }
  return out;
}

export function sanitizeOutputs(v: unknown): Record<string, StoredOutput> {
  const out: Record<string, StoredOutput> = {};
  if (v && typeof v === "object") {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      const o = val as Partial<StoredOutput> | null;
      if (o && typeof o === "object" && o.payload && typeof o.payload === "object") {
        out[k] = {
          output_schema_version: Number(o.output_schema_version) || 1,
          play_version: Number(o.play_version) || 1,
          payload: o.payload as Record<string, unknown>,
        };
      }
    }
  }
  return out;
}

export function sanitizeMyPlays(v: unknown): SavedPlayCard[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((c): c is SavedPlayCard => Boolean(c) && typeof c === "object" && typeof (c as SavedPlayCard).play_id === "string")
    .slice(0, 50)
    .map((c) => ({
      play_id: String(c.play_id),
      play_version: Number(c.play_version) || 1,
      name: String(c.name ?? ""),
      when: String(c.when ?? ""),
      move: String(c.move ?? ""),
      lookingFor: String(c.lookingFor ?? ""),
      watchOut: String(c.watchOut ?? ""),
      remember: String(c.remember ?? ""),
    }));
}

// ---- Rev 3 separated state objects (Phase D) ----------------------------------

const isObj = (v: unknown): v is Record<string, unknown> => Boolean(v) && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown, max: number): string | undefined => (typeof v === "string" ? v.slice(0, max) : undefined);
const num = (v: unknown, fallback: number): number => (Number.isFinite(v) ? Number(v) : fallback);
const strArr = (v: unknown, maxItems: number, maxLen: number): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, maxItems).map((x) => x.slice(0, maxLen)) : [];
/** A bounded id→string map (capped count + key/value length). Prevents payload bloat / stuffing. */
function boundedStrMap(v: unknown, maxEntries: number, maxLen: number): Record<string, string> {
  const out: Record<string, string> = {};
  if (isObj(v)) {
    let n = 0;
    for (const [k, val] of Object.entries(v)) {
      if (n++ >= maxEntries) break;
      if (typeof val === "string") out[k.slice(0, 200)] = val.slice(0, maxLen);
    }
  }
  return out;
}

const FID_STATES = new Set(["demonstrated", "not_demonstrated", "not_applicable"]);
const CHOSEN_STANCES = new Set(["rest", "not_now", "lightly_open", "return_later", "pause_decision"]);
/** Per-signature fidelity fields (mirrors the event registry; keeps the tagged union honest). */
const FIDELITY_FIELDS: Record<string, string[]> = {
  evidenceTimeline: ["evidence_reconsidered", "interpretation_response_appropriate"],
  conclusionNarrowing: ["evidence_reconsidered", "interpretation_response_appropriate"],
  dualAttention: ["evaluator_stance_held", "fit_information_kept_in_view"],
  decisionRoom: ["intentional_stance_selected", "discouragement_distinguished_from_conclusion"],
  investmentView: ["investment_evidence_tied", "effort_without_new_evidence_noticed"],
  communicationRehearsal: ["preference_expressed_clearly", "unnecessary_self_erasure_avoided"],
};
export function sanitizeFidelity(v: unknown): FidelityOutcome | undefined {
  if (!isObj(v) || typeof v.signature !== "string" || !FIDELITY_FIELDS[v.signature]) return undefined;
  const out: Record<string, unknown> = { signature: v.signature };
  for (const f of FIDELITY_FIELDS[v.signature]) out[f] = FID_STATES.has(v[f] as string) ? v[f] : "not_applicable";
  if (v.signature === "decisionRoom") out.chosen_stance = CHOSEN_STANCES.has(v.chosen_stance as string) ? v.chosen_stance : "pause_decision";
  return out as FidelityOutcome;
}

export function sanitizeSimulationState(v: unknown): SimulationState | undefined {
  if (!isObj(v)) return undefined;
  const out: SimulationState = { version: num(v.version, 1) };
  if (isObj(v.runs)) {
    const runs: Record<string, SimulationRunState> = {};
    let n = 0;
    for (const [simId, r] of Object.entries(v.runs)) {
      if (n++ >= 50) break;
      if (!isObj(r)) continue;
      const run: SimulationRunState = {};
      if (typeof r.completed === "boolean") run.completed = r.completed;
      const nodeId = str(r.nodeId, 200);
      if (nodeId) run.nodeId = nodeId;
      const captures = boundedStrMap(r.captures, 100, 500);
      if (Object.keys(captures).length) run.captures = captures;
      const selections = boundedStrMap(r.selections, 100, 200);
      if (Object.keys(selections).length) run.selections = selections;
      const fid = sanitizeFidelity(r.fidelity);
      if (fid) run.fidelity = fid;
      runs[simId.slice(0, 200)] = run;
    }
    out.runs = runs;
  }
  return out;
}

const MISSION_STATES = new Set(["selected", "attempted", "reviewed"]);
const MISSION_REPORTS = new Set(["attempted", "no_opportunity", "opportunity_not_taken", "unsuitable"]);
export function sanitizePracticeState(v: unknown): PracticeState | undefined {
  if (!isObj(v)) return undefined;
  const out: PracticeState = { version: num(v.version, 1) };
  const cur = str(v.currentMissionId, 200);
  if (cur) out.currentMissionId = cur;
  if (isObj(v.missions)) {
    const missions: Record<string, MissionRunState> = {};
    let n = 0;
    for (const [mid, m] of Object.entries(v.missions)) {
      if (n++ >= 50) break;
      if (!isObj(m) || !MISSION_STATES.has(m.state as string)) continue;
      const run: MissionRunState = { state: m.state as MissionRunState["state"] };
      const rungId = str(m.rungId, 200);
      if (rungId) run.rungId = rungId;
      if (typeof m.stretchEligible === "boolean") run.stretchEligible = m.stretchEligible;
      if (MISSION_REPORTS.has(m.lastReport as string)) run.lastReport = m.lastReport as MissionRunState["lastReport"];
      if (Number.isFinite(m.attemptCount)) run.attemptCount = Math.max(0, Math.min(999, Math.floor(Number(m.attemptCount))));
      missions[mid.slice(0, 200)] = run;
    }
    out.missions = missions;
  }
  return out;
}

const PERFORMED = new Set(["yes", "partly", "no"]);
function sanitizeUseReviewSignals(v: Record<string, unknown>): UseReviewSignals {
  const s: UseReviewSignals = {};
  if (PERFORMED.has(v.performed as string)) s.performed = v.performed as UseReviewSignals["performed"];
  const dd = strArr(v.didDifferently, 20, 200);
  if (dd.length) s.didDifferently = dd;
  const bc = strArr(v.becameClearer, 20, 200);
  if (bc.length) s.becameClearer = bc;
  const stuck = str(v.stuck, 200);
  if (stuck) s.stuck = stuck;
  if (typeof v.kept === "boolean") s.kept = v.kept;
  if (typeof v.updated === "boolean") s.updated = v.updated;
  if (typeof v.saved === "boolean") s.saved = v.saved;
  return s;
}
const MAX_REVIEW_ENTRIES = 50;
function sanitizeUseReviewEntry(v: Record<string, unknown>): UseReviewEntry {
  const e: UseReviewEntry = sanitizeUseReviewSignals(v);
  const at = str(v.at, 40); // ISO timestamp, display-only — bounded, never trusted for logic
  if (at) e.at = at;
  const experience = str(v.experience, 2000); // optional free-text note — bounded, reader's own
  if (experience) e.experience = experience;
  return e;
}
export function sanitizeUseReviewState(v: unknown): UseReviewState | undefined {
  if (!isObj(v)) return undefined;
  const out: UseReviewState = { version: num(v.version, 1) };
  if (isObj(v.reviews)) {
    const reviews: Record<string, UseReviewEntry[]> = {};
    let n = 0;
    for (const [pid, r] of Object.entries(v.reviews)) {
      if (n++ >= 50) break;
      // New shape: an array of logged uses. Legacy: a single review object → one-element list.
      const list = Array.isArray(r) ? r : isObj(r) ? [r] : [];
      const entries = list.filter(isObj).slice(0, MAX_REVIEW_ENTRIES).map(sanitizeUseReviewEntry);
      if (entries.length) reviews[pid.slice(0, 200)] = entries;
    }
    out.reviews = reviews;
  }
  return out;
}

export function sanitizeChangePathState(v: unknown): ChangePathState | undefined {
  if (!isObj(v)) return undefined;
  const out: ChangePathState = { version: num(v.version, 1) };
  const cur = str(v.currentFocus, 200);
  if (cur) out.currentFocus = cur;
  const prior = str(v.priorFocus, 200);
  if (prior) out.priorFocus = prior;
  return out;
}

export function sanitizeLiteratureState(v: unknown): LiteratureState | undefined {
  if (!isObj(v)) return undefined;
  const out: LiteratureState = { version: num(v.version, 1) };
  const read = strArr(v.read, 500, 200);
  if (read.length) out.read = read;
  return out;
}

/** Build a safe PlaybookProgress from untrusted client input + authoritative server key/version. */
export function sanitizeIncomingProgress(
  body: unknown,
  playbookKey: string,
  playbookVersion: number,
): PlaybookProgress {
  const b = (body ?? {}) as Partial<PlaybookProgress>;
  const lit = sanitizeLiteratureState(b.literature_state);
  const sim = sanitizeSimulationState(b.simulation_state);
  const prac = sanitizePracticeState(b.practice_state);
  const rev = sanitizeUseReviewState(b.use_review_state);
  const cp = sanitizeChangePathState(b.change_path_state);
  return {
    ...emptyProgress(playbookKey, playbookVersion),
    recognized: Array.isArray(b.recognized) ? b.recognized.filter((x): x is string => typeof x === "string").slice(0, 100) : [],
    play_states: sanitizeStates(b.play_states),
    outputs: sanitizeOutputs(b.outputs),
    my_plays: sanitizeMyPlays(b.my_plays),
    // Rev 3 separated state — only included when present + valid (absent stays absent).
    ...(lit ? { literature_state: lit } : {}),
    ...(sim ? { simulation_state: sim } : {}),
    ...(prac ? { practice_state: prac } : {}),
    ...(rev ? { use_review_state: rev } : {}),
    ...(cp ? { change_path_state: cp } : {}),
  };
}
