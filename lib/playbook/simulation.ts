// Rev 3 Experience layer — deterministic simulation engine (pure, no I/O, no LLM).
// See docs/playbook-architecture-rev3.md §6. Nodes form an authored GRAPH
// (startNodeId + per-node/option `next`); the SimulationPlayer owns navigation/state,
// this module owns the pure logic: next-node resolution, fidelity-state aggregation,
// and full content validation.

import type { Simulation, SimNode, FidelityOutcome, FidelityState, FidelityDimension } from "@/lib/playbook/contentSchema";

const FIDELITY_STATES: FidelityState[] = ["demonstrated", "not_demonstrated", "not_applicable"];
const DIMENSIONS: FidelityDimension[] = ["evidence_reconsidered", "interpretation_response_appropriate"];

export const NOT_APPLICABLE: FidelityOutcome = { evidence_reconsidered: "not_applicable", interpretation_response_appropriate: "not_applicable" };

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
export function aggregateFidelity(sim: Simulation, selections: Record<string, string>): FidelityOutcome {
  let out: FidelityOutcome = { ...NOT_APPLICABLE };
  for (const n of sim.nodes) {
    if (n.kind !== "reconsider") continue;
    const opt = n.options.find((o) => o.id === selections[n.id]);
    if (opt) out = { ...opt.fidelity };
  }
  return out;
}

/** The minimal functional payload persisted on completion (§6.6) — explicit states only. */
export function completionPayload(fidelity: FidelityOutcome): FidelityOutcome {
  return { evidence_reconsidered: fidelity.evidence_reconsidered, interpretation_response_appropriate: fidelity.interpretation_response_appropriate };
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
      for (const o of n.options) {
        for (const d of DIMENSIONS) if (!FIDELITY_STATES.includes(o.fidelity?.[d])) errs.push(`${n.id}/${o.id} invalid fidelity.${d}`);
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
