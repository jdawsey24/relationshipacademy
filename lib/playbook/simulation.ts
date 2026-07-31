// Rev 3 Experience layer — deterministic simulation engine (pure, no I/O, no LLM).
// See docs/playbook-architecture-rev3.md §6. Nodes form an authored GRAPH
// (startNodeId + per-node/option `next`); the SimulationPlayer owns navigation/state,
// this module owns the pure logic: next-node resolution, fidelity-state aggregation,
// and full content validation.

import type { Simulation, SimNode, FidelityOutcome, FidelityState, FidelityDimension, InteractionKind, ReconsiderFidelity, ChosenStance } from "@/lib/playbook/contentSchema";

const CHOSEN_STANCES: ChosenStance[] = ["rest", "not_now", "lightly_open", "return_later", "pause_decision"];
/** Extract a decisionRoom stance from the selected `stance:<enum>` signal (default pause_decision). */
function stanceFromSignals(sigs: Set<string>): ChosenStance {
  const raw = [...sigs].find((s) => s.startsWith("stance:"))?.slice("stance:".length);
  return raw && (CHOSEN_STANCES as string[]).includes(raw) ? (raw as ChosenStance) : "pause_decision";
}
function hasStance(sigs: Set<string>): boolean {
  return [...sigs].some((s) => s.startsWith("stance:"));
}

const FIDELITY_STATES: FidelityState[] = ["demonstrated", "not_demonstrated", "not_applicable"];
const DIMENSIONS: FidelityDimension[] = ["evidence_reconsidered", "interpretation_response_appropriate"];

/** The signature-appropriate "nothing exercised yet" outcome (replaces the old flat constant). */
export function notApplicableFor(signature: InteractionKind): FidelityOutcome {
  switch (signature) {
    case "dualAttention":
      return { signature, evaluator_stance_held: "not_applicable", fit_information_kept_in_view: "not_applicable" };
    case "decisionRoom":
      return { signature, intentional_stance_selected: "not_applicable", discouragement_distinguished_from_conclusion: "not_applicable", chosen_stance: "pause_decision" };
    case "investmentView":
      return { signature, investment_evidence_tied: "not_applicable", effort_without_new_evidence_noticed: "not_applicable" };
    case "communicationRehearsal":
      return { signature, preference_expressed_clearly: "not_applicable", unnecessary_self_erasure_avoided: "not_applicable" };
    default:
      // evidenceTimeline / conclusionNarrowing (and any non-sim InteractionKind fallback)
      return { signature: (signature === "conclusionNarrowing" ? "conclusionNarrowing" : "evidenceTimeline"), evidence_reconsidered: "not_applicable", interpretation_response_appropriate: "not_applicable" };
  }
}

export function nodeMap(sim: Simulation): Map<string, SimNode> {
  return new Map(sim.nodes.map((n) => [n.id, n]));
}

/** Every possible successor node id from a node (used for validation traversal). */
export function successors(node: SimNode): string[] {
  if (node.kind === "teach") return [];
  if (node.kind === "decision" || node.kind === "reconsider") {
    return [...new Set(node.options.map((o) => o.next ?? node.next).filter((x): x is string => Boolean(x)))];
  }
  return node.next ? [node.next] : [];
}

/** The concrete next-node id given the (optional) chosen option. Undefined = wait
 *  (choice not yet made) or terminal (teach). Branching changes teaching only. */
export function nextNodeId(node: SimNode, optionId?: string): string | undefined {
  if (node.kind === "teach") return undefined;
  if (node.kind === "decision" || node.kind === "reconsider") {
    if (!optionId) return undefined;
    const opt = node.options.find((o) => o.id === optionId);
    return opt?.next ?? node.next;
  }
  return node.next;
}

/** The ordered nodes visited from the start up to (but not including) `currentId`,
 *  following the reader's recorded selections. Deterministic → safe to recompute on
 *  resume (the graph is validated acyclic). */
export function pathBefore(sim: Simulation, currentId: string, selections: Record<string, string>): SimNode[] {
  const map = nodeMap(sim);
  const out: SimNode[] = [];
  const seen = new Set<string>();
  let id: string | undefined = sim.startNodeId;
  while (id && id !== currentId && map.has(id) && !seen.has(id)) {
    seen.add(id);
    const node = map.get(id)!;
    out.push(node);
    id = nextNodeId(node, selections[id]);
  }
  return out;
}

// ---- Fidelity aggregation (explicit states; revision is NOT the target) ----------

/** Aggregate the reader's reconsider selections into an explicit fidelity outcome.
 *  Default is not_applicable (dimension not exercised); each answered reconsider sets
 *  the authored states for that response (last answered reconsider wins).
 *  GUARDRAILS: fidelity is read ONLY from authored reconsider responses (never inferred
 *  from signature — G1) and takes NO literature/JIT input (JIT is Exposure-only — G2). */
/** The set of per-option `signal` tags on the reader's SELECTED decision/reconsider options.
 *  This is how the choice-computed signatures read fidelity — from authored semantic tags,
 *  never from hardcoded node ids. JIT/literature is never an input (G2). */
export function selectedSignals(sim: Simulation, selections: Record<string, string>): Set<string> {
  const out = new Set<string>();
  for (const n of sim.nodes) {
    if (n.kind !== "decision" && n.kind !== "reconsider") continue;
    const opt = n.options.find((o) => o.id === selections[n.id]);
    if (opt?.signal) out.add(opt.signal);
  }
  return out;
}

/** Like `selectedSignals`, but COUNTS occurrences — for signatures whose fidelity is a majority
 *  over repeated moments (e.g. communicationRehearsal: clarity/erasure across three moments). */
export function selectedSignalCounts(sim: Simulation, selections: Record<string, string>): Map<string, number> {
  const out = new Map<string, number>();
  for (const n of sim.nodes) {
    if (n.kind !== "decision" && n.kind !== "reconsider") continue;
    const opt = n.options.find((o) => o.id === selections[n.id]);
    if (opt?.signal) out.set(opt.signal, (out.get(opt.signal) ?? 0) + 1);
  }
  return out;
}

export function aggregateFidelity(sim: Simulation, selections: Record<string, string>, _captures: Record<string, string> = {}): FidelityOutcome {
  switch (sim.signature) {
    case "evidenceTimeline":
    case "conclusionNarrowing": {
      // Reconsider-based: last answered reconsider's authored fragment wins (unchanged behavior).
      let f: ReconsiderFidelity = { evidence_reconsidered: "not_applicable", interpretation_response_appropriate: "not_applicable" };
      for (const n of sim.nodes) {
        if (n.kind !== "reconsider") continue;
        const opt = n.options.find((o) => o.id === selections[n.id]);
        if (opt?.fidelity) f = { ...opt.fidelity };
      }
      return { signature: sim.signature, ...f };
    }
    case "dualAttention": {
      // "fit_kept" on any fit-aware read → fit information kept in view; the evaluator stance
      // needs BOTH the "held_both" reconsider AND that fit was kept in view (approved graph §5).
      const sigs = selectedSignals(sim, selections);
      const fit: FidelityState = sigs.has("fit_kept") ? "demonstrated" : "not_demonstrated";
      const held: FidelityState = sigs.has("held_both") && fit === "demonstrated" ? "demonstrated" : "not_demonstrated";
      return { signature: "dualAttention", evaluator_stance_held: held, fit_information_kept_in_view: fit };
    }
    case "decisionRoom": {
      // Any `stance:*` chosen → an intentional stance was selected (pause_decision counts).
      // Distinguished from a forever conclusion UNLESS the reader re-asserted "held_forever".
      const sigs = selectedSignals(sim, selections);
      const intentional_stance_selected: FidelityState = hasStance(sigs) ? "demonstrated" : "not_demonstrated";
      const discouragement_distinguished_from_conclusion: FidelityState = sigs.has("held_forever") ? "not_demonstrated" : "demonstrated";
      return { signature: "decisionRoom", intentional_stance_selected, discouragement_distinguished_from_conclusion, chosen_stance: stanceFromSignals(sigs) };
    }
    case "investmentView": {
      // The lull round is the pivot: increasing investment there is investment NOT tied to new
      // evidence; "noticed" fails only if the reader also claimed a new signal that wasn't there.
      // Round context is encoded in the option tags, so this stays node-id-agnostic.
      const sigs = selectedSignals(sim, selections);
      const increasedAtLull = sigs.has("increase_at_lull");
      const investment_evidence_tied: FidelityState = increasedAtLull ? "not_demonstrated" : "demonstrated";
      const effort_without_new_evidence_noticed: FidelityState = increasedAtLull && sigs.has("claimed_evidence_at_lull") ? "not_demonstrated" : "demonstrated";
      return { signature: "investmentView", investment_evidence_tied, effort_without_new_evidence_noticed };
    }
    case "communicationRehearsal": {
      // A majority over the three low-risk moments. Stated = clear OR buried-in-apology;
      // non-erased = clear only. Reaction is never an input (success ≠ "did they like it").
      const counts = selectedSignalCounts(sim, selections);
      const clear = counts.get("clear") ?? 0;
      const buried = counts.get("buried") ?? 0;
      const preference_expressed_clearly: FidelityState = clear + buried >= 2 ? "demonstrated" : "not_demonstrated";
      const unnecessary_self_erasure_avoided: FidelityState = clear >= 2 ? "demonstrated" : "not_demonstrated";
      return { signature: "communicationRehearsal", preference_expressed_clearly, unnecessary_self_erasure_avoided };
    }
    default:
      return notApplicableFor(sim.signature);
  }
}

// ---- Computed reveal resolution (owner decision #2) -------------------------------

/** Per-signature resolvers for `reveal.computedSummary`: a pure function of the run's
 *  selections/captures returning a key into the node's authored `variants`. */
export const REVEAL_RESOLVERS: Record<string, (sim: Simulation, selections: Record<string, string>, captures: Record<string, string>) => string> = {
  // dualAttention: where the reader's CHOICES focused in this exercise (not a measure of attention).
  dualAttentionFocus: (sim, selections) => {
    const sigs = selectedSignals(sim, selections);
    if (sigs.has("held_both")) return "both";
    if (sigs.has("fit_kept")) return "evaluation_active";
    return "interest";
  },
  // decisionRoom: the chosen, revisitable stance (variant key = the ChosenStance).
  decisionRoomStance: (sim, selections) => stanceFromSignals(selectedSignals(sim, selections)),
  // communicationRehearsal: observed clarity-vs-erasure across the three moments (not a grade).
  communicationRehearsalRecap: (sim, selections) => {
    const counts = selectedSignalCounts(sim, selections);
    if ((counts.get("clear") ?? 0) >= 2) return "clear";
    if ((counts.get("erased") ?? 0) >= 2) return "erased";
    return "mixed";
  },
};

export interface ResolvedReveal {
  paragraphs: string[];
  label?: string;
  summary?: string;
  recap: { label: string; value: string }[];
  reactions: { label: string; example: string }[];
}

/** Resolve a `reveal` node's content against the reader's own prior choices. Pure. Static
 *  `body` reveals resolve to just their paragraphs (backward compatible). */
export function resolveRevealContent(node: Extract<SimNode, { kind: "reveal" }>, sim: Simulation, selections: Record<string, string>, captures: Record<string, string> = {}): ResolvedReveal {
  const map = nodeMap(sim);
  const optionLabel = (fromNode: string): string | undefined => {
    const n = map.get(fromNode);
    if (!n || (n.kind !== "decision" && n.kind !== "reconsider")) return undefined;
    return n.options.find((o) => o.id === selections[fromNode])?.label;
  };
  let summary: string | undefined;
  if (node.computedSummary) {
    const key = REVEAL_RESOLVERS[node.computedSummary.resolver]?.(sim, selections, captures);
    summary = (key && node.computedSummary.variants[key]) || undefined;
  }
  const recap = (node.recap ?? [])
    .map((r) => ({ label: r.label, value: optionLabel(r.fromNode) }))
    .filter((r): r is { label: string; value: string } => Boolean(r.value));
  return { paragraphs: node.body ?? [], label: node.label, summary, recap, reactions: node.reactions ?? [] };
}

/** The minimal functional payload persisted on completion (§6.6). `aggregateFidelity` already
 *  produces exactly the signature's minimal, tagged shape, so this is the identity — kept as the
 *  named completion seam. */
export function completionPayload(fidelity: FidelityOutcome): FidelityOutcome {
  return fidelity;
}

// ---- Content validation ----------------------------------------------------------

export function terminalPlayIds(sim: Simulation): string[] {
  return sim.nodes.filter((n): n is Extract<SimNode, { kind: "teach" }> => n.kind === "teach").map((n) => n.toPlayId);
}

/**
 * Validate a simulation graph. Returns a list of human-readable errors ([] = valid).
 * Checks: start node exists; unique ids; every next resolves; every option has a route;
 * fidelity payloads conform; no unreachable nodes; no cycles; EVERY terminal path ends
 * in a teach handoff to an APPROVED play.
 */
export function validateSimulation(sim: Simulation, approvedPlayIds: Set<string>): string[] {
  const errs: string[] = [];
  const map = nodeMap(sim);
  if (sim.nodes.length !== map.size) errs.push("duplicate node id");
  if (!map.has(sim.startNodeId)) errs.push(`startNodeId "${sim.startNodeId}" does not exist`);

  for (const n of sim.nodes) {
    for (const s of successors(n)) if (!map.has(s)) errs.push(`${n.id} → unknown next "${s}"`);
    if (n.kind === "decision" || n.kind === "reconsider") {
      for (const o of n.options) if (!(o.next ?? n.next)) errs.push(`${n.id}/${o.id} has no next route`);
    }
    if (n.kind === "reconsider") {
      // RD/WM author a two-dimension fidelity fragment per option; other signatures compute
      // fidelity from selections and omit it. Validate the fragment only when present.
      for (const o of n.options) {
        if (o.fidelity) for (const d of DIMENSIONS) if (!FIDELITY_STATES.includes(o.fidelity[d])) errs.push(`${n.id}/${o.id} invalid fidelity.${d}`);
      }
    }
    if (n.kind === "teach" && !approvedPlayIds.has(n.toPlayId)) errs.push(`teach ${n.id} → unapproved play "${n.toPlayId}"`);
    // non-teach, non-choice node with no `next` dead-ends
    if (n.kind !== "teach" && n.kind !== "decision" && n.kind !== "reconsider" && successors(n).length === 0) {
      errs.push(`${n.id} dead-ends (no next, not a teach)`);
    }
  }

  // reachability + cycle detection from the start node
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>();
  const reachable = new Set<string>();
  const stack: string[] = [];
  function dfs(id: string) {
    color.set(id, GRAY);
    reachable.add(id);
    stack.push(id);
    const node = map.get(id);
    if (node) {
      for (const s of successors(node)) {
        if (!map.has(s)) continue;
        const c = color.get(s) ?? WHITE;
        if (c === GRAY) errs.push(`cycle: ${id} → ${s}`);
        else if (c === WHITE) dfs(s);
      }
    }
    stack.pop();
    color.set(id, BLACK);
  }
  if (map.has(sim.startNodeId)) dfs(sim.startNodeId);
  for (const n of sim.nodes) if (!reachable.has(n.id)) errs.push(`${n.id} is unreachable`);
  // every reachable terminal must be a teach handoff
  for (const id of reachable) {
    const n = map.get(id)!;
    if (successors(n).length === 0 && n.kind !== "teach") errs.push(`terminal node ${id} is not a teach handoff`);
  }
  return [...new Set(errs)];
}
