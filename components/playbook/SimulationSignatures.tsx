"use client";

// Rev 3 Experience layer — signature presentation registry (Step 4, revised).
//
// The universal walker (SimulationPlayer) owns navigation/state/signals and renders the
// node INTERACTION. Each signature owns only its technique-specific CONTEXT panel
// (chrome), registered here — so the walker has no `if (signature === …)` blocks and new
// interaction types are added by registering a chrome, not by editing the walker.
//
// Chromes read AUTHORED display roles (node.role), never node order.

import type { FunctionComponent } from "react";
import type { Simulation, SimNode, SimDisplayRole } from "@/lib/playbook/contentSchema";

export interface SignatureChromeProps {
  simulation: Simulation;
  current: SimNode;
  visited: SimNode[]; // nodes advanced past (resume-safe path)
  captures: Record<string, string>;
  selections: Record<string, string>;
}

function roleNode(sim: Simulation, role: SimDisplayRole): SimNode | undefined {
  return sim.nodes.find((n) => n.role === role);
}

// ---- evidenceTimeline: unfolding evidence over time ---------------------------
const EvidenceTimelineChrome: FunctionComponent<SignatureChromeProps> = ({ visited }) => {
  const beats = visited.filter((n) => n.kind === "moment" || n.kind === "reveal");
  if (beats.length === 0) return null;
  return (
    <ol className="mb-6 space-y-3 border-l-2 border-slate-blue/30 pl-4" aria-label="What you've seen so far">
      {beats.map((n) => (
        <li key={n.id} className="relative">
          <span aria-hidden="true" className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-blue/60" />
          <p className="font-body text-[14px] leading-relaxed text-charcoal/70">
            {n.kind === "reveal" && n.label && <span className="mr-1 font-ui text-xs font-semibold uppercase text-slate-blue">{n.label}</span>}
            {(n as Extract<SimNode, { kind: "moment" | "reveal" }>).body.join(" ")}
          </p>
        </li>
      ))}
    </ol>
  );
};

// ---- conclusionNarrowing: one event expands, then narrows ---------------------
const ConclusionNarrowingChrome: FunctionComponent<SignatureChromeProps> = ({ simulation, visited, selections }) => {
  const eventNode = roleNode(simulation, "event");
  const expansionNode = roleNode(simulation, "expansion");
  const narrowingNode = roleNode(simulation, "narrowing");
  const eventSeen = eventNode && visited.some((n) => n.id === eventNode.id);
  if (!eventNode || !eventSeen) return null;

  // The reader's first read (from the expansion decision). A globalizing read shows as a
  // red "…grew into"; a bounded read shows as a neutral "…and you kept it bounded" — we
  // never frame a non-globalizing read as an expansion.
  const firstRead =
    expansionNode && expansionNode.kind === "decision"
      ? expansionNode.options.find((o) => o.id === selections[expansionNode.id])
      : undefined;
  const bounded = firstRead?.processTag === "bounded_to_evidence";
  const narrowedLabel =
    narrowingNode && narrowingNode.kind === "reconsider"
      ? narrowingNode.options.find(
          (o) => o.id === selections[narrowingNode.id] && o.fidelity.interpretation_response_appropriate === "demonstrated",
        )?.label
      : undefined;

  return (
    <div className="mb-6 space-y-3">
      <div className="rounded-2xl bg-warm-ivory px-4 py-3">
        <p className="font-ui text-xs uppercase tracking-wide text-charcoal/45">What happened</p>
        <p className="mt-1 font-body text-[15px] text-charcoal/85">{(eventNode as Extract<SimNode, { kind: "moment" }>).body.join(" ")}</p>
      </div>
      {firstRead && !bounded && (
        <div className="rounded-2xl border border-deep-red/30 bg-deep-red/5 px-4 py-3">
          <p className="font-ui text-xs uppercase tracking-wide text-deep-red/80">…grew into</p>
          <p className="mt-1 font-body text-[16px] font-medium text-charcoal">“{firstRead.label}”</p>
        </div>
      )}
      {firstRead && bounded && (
        <div className="rounded-2xl border border-sage-green/40 bg-sage-green/12 px-4 py-3">
          <p className="font-ui text-xs uppercase tracking-wide text-charcoal/50">…and you kept it bounded</p>
          <p className="mt-1 font-body text-[15px] text-charcoal/85">“{firstRead.label}”</p>
        </div>
      )}
      {narrowedLabel && (
        <div className="rounded-2xl border border-sage-green/40 bg-sage-green/12 px-4 py-2">
          <p className="font-ui text-xs uppercase tracking-wide text-charcoal/50">Narrowed to</p>
          <p className="mt-1 font-body text-[14px] text-charcoal/85">{narrowedLabel}</p>
        </div>
      )}
    </div>
  );
};

export const SIGNATURE_TITLE: Record<string, string> = {
  evidenceTimeline: "Reading the signals over time",
  conclusionNarrowing: "How big did the story get?",
};

/** Registry: signature → context chrome. Adding an interaction type = register a chrome. */
export const SIGNATURE_CHROME: Record<string, FunctionComponent<SignatureChromeProps>> = {
  evidenceTimeline: EvidenceTimelineChrome,
  conclusionNarrowing: ConclusionNarrowingChrome,
};
