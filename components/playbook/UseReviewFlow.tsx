"use client";

// Rev 3 Step 7 — Integrate layer. The structured return after a real-world attempt.
// Bounded selects only (NO journaling). Captures functional signals — what the reader did
// differently, whether the operation was performed as intended (Technique Fidelity), what
// got clearer, where they got stuck — then the Keep/Update decision (does the saved Play
// still fit?). The only user-authored free text lives in the Keep/Update editor (the Play's
// own output), not here. Flag-gated at the call site; v0 keeps its Keep/Update dialog.

import { useState } from "react";
import type { UseReview, UseReviewSignals, StructuredPrompt } from "@/lib/playbook/contentSchema";

const primaryBtn = "rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-medium text-white transition hover:opacity-90";
const ghostBtn = "rounded-full border border-midnight-navy px-5 py-2 font-ui text-sm text-midnight-navy";

const PERFORMED_MAP: Record<string, "yes" | "partly" | "no"> = { Yes: "yes", Partly: "partly", "Not really": "no" };

function Choice({ prompt, name, value, onChange }: { prompt: StructuredPrompt; name: string; value?: string; onChange: (v: string) => void }) {
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

export interface UseReviewFlowProps {
  review: UseReview;
  /** Whether a saved output exists — drives Keep/Update vs. a plain finish. */
  hasSavedOutput: boolean;
  onComplete: (signals: UseReviewSignals, action: "keep" | "update" | "none") => void;
  onExit?: () => void;
}

export default function UseReviewFlow({ review, hasSavedOutput, onComplete, onExit }: UseReviewFlowProps) {
  const [didDifferently, setDidDifferently] = useState<string>();
  const [performed, setPerformed] = useState<string>();
  const [becameClearer, setBecameClearer] = useState<string>();
  const [stuck, setStuck] = useState<string>();

  function signals(extra: Partial<UseReviewSignals> = {}): UseReviewSignals {
    return {
      ...(didDifferently ? { didDifferently } : {}),
      ...(performed ? { performed: PERFORMED_MAP[performed] } : {}),
      ...(becameClearer ? { becameClearer } : {}),
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

        <Choice prompt={review.didDifferently} name="rv-did" value={didDifferently} onChange={setDidDifferently} />
        <Choice prompt={review.performedOperation} name="rv-perf" value={performed} onChange={setPerformed} />
        <Choice prompt={review.becameClearer} name="rv-clear" value={becameClearer} onChange={setBecameClearer} />
        <Choice prompt={review.stuckWhere} name="rv-stuck" value={stuck} onChange={setStuck} />

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
            <button type="button" className={primaryBtn} onClick={() => onComplete(signals(), "none")}>Done</button>
          )}
        </div>
      </div>
    </section>
  );
}
