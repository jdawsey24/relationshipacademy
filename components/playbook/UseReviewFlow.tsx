"use client";

// Rev 3 Step 7 — Integrate layer. The structured return after a real-world attempt.
// Bounded selects only (NO journaling, NOT a checklist score). Captures functional signals:
// what the reader did differently (multi), whether the operation was used as intended
// (single — Technique Fidelity), what got clearer (multi), where they got stuck MOST
// (single — a prioritized friction point), then a tool decision:
//   • saved Play exists → Keep it / Update it (tool_retained / tool_updated)
//   • no saved Play     → Save this Play / Not right now (tool_saved_after_use)
// None of these independently constitutes Transfer. The only user-authored free text is in
// the Keep/Update editor (the Play's own output). Flag-gated; v0 keeps its Keep/Update dialog.

import { useState } from "react";
import type { UseReview, UseReviewSignals, StructuredPrompt } from "@/lib/playbook/contentSchema";

const primaryBtn = "rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-medium text-white transition hover:opacity-90";
const ghostBtn = "rounded-full border border-midnight-navy px-5 py-2 font-ui text-sm text-midnight-navy";

const PERFORMED_MAP: Record<string, "yes" | "partly" | "no"> = {
  "Pretty closely": "yes",
  "Some of it": "partly",
  "Not really this time": "no",
};

function SingleChoice({ prompt, name, value, onChange }: { prompt: StructuredPrompt; name: string; value?: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="space-y-2">
      <legend className="font-body text-[15px] font-medium text-charcoal">{prompt.label}</legend>
      {prompt.options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-2.5 font-body text-[15px] text-charcoal">
          <input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} />
          {opt}
        </label>
      ))}
    </fieldset>
  );
}

function MultiChoice({ prompt, values, onToggle }: { prompt: StructuredPrompt; values: string[]; onToggle: (v: string) => void }) {
  return (
    <fieldset className="space-y-2">
      <legend className="font-body text-[15px] font-medium text-charcoal">{prompt.label}</legend>
      {prompt.options.map((opt) => (
        <label key={opt} className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-2.5 font-body text-[15px] text-charcoal">
          <input type="checkbox" value={opt} checked={values.includes(opt)} onChange={() => onToggle(opt)} />
          {opt}
        </label>
      ))}
    </fieldset>
  );
}

export interface UseReviewFlowProps {
  review: UseReview;
  /** Whether a saved output exists — drives Keep/Update vs. a save decision. */
  hasSavedOutput: boolean;
  onComplete: (signals: UseReviewSignals, action: "keep" | "update" | "save" | "none") => void;
  onExit?: () => void;
}

export default function UseReviewFlow({ review, hasSavedOutput, onComplete, onExit }: UseReviewFlowProps) {
  const [didDifferently, setDidDifferently] = useState<string[]>([]);
  const [performed, setPerformed] = useState<string>();
  const [becameClearer, setBecameClearer] = useState<string[]>([]);
  const [stuck, setStuck] = useState<string>();

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  function signals(extra: Partial<UseReviewSignals> = {}): UseReviewSignals {
    return {
      ...(didDifferently.length ? { didDifferently } : {}),
      ...(performed ? { performed: PERFORMED_MAP[performed] } : {}),
      ...(becameClearer.length ? { becameClearer } : {}),
      ...(stuck ? { stuck } : {}),
      ...extra,
    };
  }

  return (
    <section className="mx-auto max-w-2xl px-5 py-8" aria-label="How the practice went">
      <div className="mb-4 flex items-center justify-between">
        {onExit && <button type="button" onClick={onExit} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">← Back</button>}
        <span className="font-ui text-xs uppercase tracking-wide text-charcoal/45">How it went</span>
      </div>

      <div className="rounded-3xl bg-white/60 p-6 sm:p-8 space-y-6">
        <p className="font-body text-[15px] text-charcoal/70">
          A quick, honest look at the practice itself — no score, and a hard moment isn't a failure here.
        </p>

        <MultiChoice prompt={review.didDifferently} values={didDifferently} onToggle={(v) => toggle(didDifferently, setDidDifferently, v)} />
        <SingleChoice prompt={review.performedOperation} name="rv-perf" value={performed} onChange={setPerformed} />
        <MultiChoice prompt={review.becameClearer} values={becameClearer} onToggle={(v) => toggle(becameClearer, setBecameClearer, v)} />
        <SingleChoice prompt={review.stuckWhere} name="rv-stuck" value={stuck} onChange={setStuck} />

        <div className="border-t border-light-gray pt-5">
          {hasSavedOutput ? (
            <>
              <p className="font-body text-[15px] text-charcoal/85">Does the Play you saved still fit what you learned?</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" className={primaryBtn} onClick={() => onComplete(signals({ kept: true }), "keep")}>Keep it</button>
                <button type="button" className={ghostBtn} onClick={() => onComplete(signals({ updated: true }), "update")}>Update it</button>
              </div>
            </>
          ) : (
            <>
              <p className="font-body text-[15px] text-charcoal/85">Would this be useful to keep for next time?</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" className={primaryBtn} onClick={() => onComplete(signals({ saved: true }), "save")}>Save this Play</button>
                <button type="button" className={ghostBtn} onClick={() => onComplete(signals(), "none")}>Not right now</button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
