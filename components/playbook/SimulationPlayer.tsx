"use client";

// Rev 3 Experience layer — the universal, deterministic simulation walker (Step 4, revised).
//
// The walker owns navigation/state/signals/focus/resume. Signature-specific presentation
// lives in a registry (SimulationSignatures), not in this file. No LLM. Non-scoring.
// Nodes form an authored graph; branching changes teaching, never the partner's response.
//
// A11y: choices are tap/keyboard buttons (no drag); focus moves to each new node's primary
// prompt on transition; a dedicated live region announces new evidence/feedback (not the
// whole card); the flow is user-advanced/state-driven, so reduced motion is honored.

import { useEffect, useMemo, useRef, useState } from "react";
import type { Simulation, SimNode, FidelityOutcome } from "@/lib/playbook/contentSchema";
import { nodeMap, nextNodeId, aggregateFidelity, completionPayload, pathBefore } from "@/lib/playbook/simulation";
import { SIGNATURE_CHROME, SIGNATURE_TITLE } from "@/components/playbook/SimulationSignatures";

const nextBtn = "rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-40";
const optionBtn =
  "w-full rounded-2xl border px-4 py-3 text-left font-body text-[15px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-midnight-navy focus-visible:ring-offset-2 focus-visible:ring-offset-warm-ivory";

export interface SimulationRunSnapshot {
  nodeId: string;
  captures: Record<string, string>;
  selections: Record<string, string>;
}

export interface SimulationPlayerProps {
  simulation: Simulation;
  onComplete: (payload: FidelityOutcome, toPlayId: string) => void;
  onExit?: () => void;
  onScreenText?: (text: string) => void; // Layer A crisis screening for bounded free text
  onSurfaceJit?: (literatureId: string) => void; // surface authored JIT literature by id (never inlined)
  /** Resume boundary: seed the run from persisted simulation_state. */
  initialState?: Partial<SimulationRunSnapshot>;
  /** Called on every state change with the current snapshot (persist as simulation_state). */
  onProgress?: (snapshot: SimulationRunSnapshot) => void;
}

export default function SimulationPlayer({ simulation, onComplete, onExit, onScreenText, onSurfaceJit, initialState, onProgress }: SimulationPlayerProps) {
  const map = useMemo(() => nodeMap(simulation), [simulation]);
  const [currentNodeId, setCurrentNodeId] = useState(initialState?.nodeId ?? simulation.startNodeId);
  const [captures, setCaptures] = useState<Record<string, string>>(initialState?.captures ?? {});
  const [selections, setSelections] = useState<Record<string, string>>(initialState?.selections ?? {});
  const [draftText, setDraftText] = useState("");

  const promptRef = useRef<HTMLElement>(null);
  const firstRun = useRef(true);
  const node = map.get(currentNodeId);

  // Focus the new node's primary prompt on transition (skip initial mount); reset the
  // ephemeral free-text draft to whatever was previously captured for this node.
  useEffect(() => {
    setDraftText(node && node.kind === "capture" ? captures[node.id] ?? "" : "");
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    promptRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeId]);

  // Progress boundary (resume). Effect-based so it also captures the seed position.
  useEffect(() => {
    onProgress?.({ nodeId: currentNodeId, captures, selections });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeId, captures, selections]);

  // Malformed / exhausted graph — handle via effect, never a render-time side effect.
  useEffect(() => {
    if (!node) onExit?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);
  if (!node) return <p className="mx-auto max-w-2xl px-5 py-8 font-body text-charcoal/70">This experience isn't available.</p>;

  const advance = (toId?: string) => {
    if (toId && map.has(toId)) setCurrentNodeId(toId);
  };
  const Chrome = SIGNATURE_CHROME[simulation.signature];
  const visited = pathBefore(simulation, currentNodeId, selections);

  function continueChoiceNode() {
    if (node!.kind === "decision" || node!.kind === "reconsider") advance(nextNodeId(node!, selections[node!.id]));
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={onExit} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">← Back</button>
        <span className="font-ui text-xs uppercase tracking-wide text-charcoal/45">{SIGNATURE_TITLE[simulation.signature] ?? "Experience"}</span>
      </div>

      {Chrome && <Chrome simulation={simulation} current={node} visited={visited} captures={captures} selections={selections} />}

      <div className="rounded-3xl bg-white/60 p-6 sm:p-8">
        {(node.kind === "moment" || node.kind === "note") && (
          <div className="space-y-5">
            <p ref={promptRef as React.RefObject<HTMLParagraphElement>} tabIndex={-1} className="font-body text-[17px] leading-relaxed text-charcoal/85 focus:outline-none">{node.body[0]}</p>
            {node.body.slice(1).map((p, j) => <p key={j} className="font-body text-[17px] leading-relaxed text-charcoal/85">{p}</p>)}
            <JitLink node={node} onSurfaceJit={onSurfaceJit} />
            <button type="button" className={nextBtn} onClick={() => advance(node.next)}>Continue</button>
          </div>
        )}

        {node.kind === "reveal" && (
          <div className="space-y-5">
            <div aria-live="polite">
              <p ref={promptRef as React.RefObject<HTMLParagraphElement>} tabIndex={-1} className="font-ui text-xs font-semibold uppercase tracking-wide text-coral-rose focus:outline-none">{node.label ?? "What happened next"}</p>
              {node.body.map((p, j) => <p key={j} className="mt-2 font-body text-[17px] leading-relaxed text-charcoal/85">{p}</p>)}
            </div>
            <JitLink node={node} onSurfaceJit={onSurfaceJit} />
            <button type="button" className={nextBtn} onClick={() => advance(node.next)}>Continue</button>
          </div>
        )}

        {node.kind === "capture" && (
          <div className="space-y-5">
            <p ref={promptRef as React.RefObject<HTMLParagraphElement>} tabIndex={-1} className="font-body text-[16px] text-charcoal/85 focus:outline-none">{node.prompt}</p>
            {node.field.kind === "choice" ? (
              <fieldset className="space-y-2">
                <legend className="sr-only">{node.prompt}</legend>
                {node.field.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 font-body text-[15px] text-charcoal">
                    <input type="radio" name={`cap-${node.id}`} value={opt} checked={captures[node.id] === opt} onChange={() => setCaptures((c) => ({ ...c, [node.id]: opt }))} />
                    {opt}
                  </label>
                ))}
              </fieldset>
            ) : (
              <textarea
                rows={2}
                value={draftText}
                maxLength={node.field.maxLen}
                onChange={(e) => setDraftText(e.target.value)}
                className="w-full rounded-2xl border border-light-gray bg-white px-4 py-3 font-body text-[15px] text-charcoal outline-none focus:border-midnight-navy"
              />
            )}
            <JitLink node={node} onSurfaceJit={onSurfaceJit} />
            <button
              type="button"
              className={nextBtn}
              disabled={node.field.kind === "choice" ? !captures[node.id] : !draftText.trim()}
              onClick={() => {
                if (node.field.kind === "shortText") {
                  const v = draftText.trim();
                  if (onScreenText && v) onScreenText(v); // screen at advance time, not on blur
                  setCaptures((c) => ({ ...c, [node.id]: v }));
                }
                advance(node.next);
              }}
            >
              Continue
            </button>
          </div>
        )}

        {(node.kind === "decision" || node.kind === "reconsider") && (
          <div className="space-y-4">
            <p ref={promptRef as React.RefObject<HTMLParagraphElement>} tabIndex={-1} className="font-body text-[16px] text-charcoal/85 focus:outline-none">{node.prompt}</p>
            <JitLink node={node} onSurfaceJit={onSurfaceJit} />
            <div className="space-y-2">
              {node.options.map((opt) => {
                const selected = selections[node.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelections((s) => ({ ...s, [node.id]: opt.id }))}
                    className={optionBtn + (selected ? " border-midnight-navy bg-midnight-navy/5" : " border-light-gray bg-white/70 hover:bg-white")}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {selections[node.id] && (() => {
              const opt = node.options.find((o) => o.id === selections[node.id]);
              const fb = opt?.feedback ?? [];
              return (
                <div aria-live="polite" role="status" className="space-y-3">
                  {/* Neutral treatment — feedback is educational, not a "correct" verdict. */}
                  {fb.length > 0 && (
                    <div className="rounded-2xl border border-light-gray bg-white/70 px-4 py-3">
                      {fb.map((p, j) => <p key={j} className="font-body text-[15px] text-charcoal/85">{p}</p>)}
                    </div>
                  )}
                  <button type="button" className={nextBtn} onClick={continueChoiceNode}>Continue</button>
                </div>
              );
            })()}
          </div>
        )}

        {node.kind === "teach" && (
          <div className="space-y-5">
            <p ref={promptRef as React.RefObject<HTMLParagraphElement>} tabIndex={-1} className="font-body text-[17px] leading-relaxed text-charcoal/85 focus:outline-none">{node.body[0]}</p>
            {node.body.slice(1).map((p, j) => <p key={j} className="font-body text-[17px] leading-relaxed text-charcoal/85">{p}</p>)}
            <button
              type="button"
              className={nextBtn}
              onClick={() => onComplete(completionPayload(aggregateFidelity(simulation, selections)), node.toPlayId)}
            >
              Open the tool →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function JitLink({ node, onSurfaceJit }: { node: SimNode; onSurfaceJit?: (id: string) => void }) {
  if (!node.jitLiteratureId || !onSurfaceJit) return null;
  const id = node.jitLiteratureId;
  return (
    <button type="button" onClick={() => onSurfaceJit(id)} className="font-ui text-sm text-slate-blue underline hover:opacity-80">
      Related read
    </button>
  );
}
