"use client";

// R7/§7 shared N-bucket sorter. Tap-to-assign is primary (drag is not required);
// fully keyboard-operable; no color-only cues; one optional gentle correction per
// item (accuracy criterion), otherwise no right/wrong.

import { useEffect, useState } from "react";
import type { SortBucket, SortItem } from "@/lib/playbook/contentSchema";
import { correctionFor, allAssigned as allAssignedFn } from "@/lib/playbook/sortLogic";

export interface SortEngineProps {
  buckets: SortBucket[];
  items: SortItem[];
  note?: string;
  onComplete: (assignments: Record<string, string>) => void;
  continueLabel?: string;
}

export default function SortEngine({ buckets, items, note, onComplete, continueLabel = "Continue" }: SortEngineProps) {
  const [assign, setAssign] = useState<Record<string, string>>({});
  const [corrections, setCorrections] = useState<Record<string, string>>({});
  const [focusId, setFocusId] = useState<string | null>(null);
  const allAssigned = allAssignedFn(items, assign);

  // Move focus to a correction when it appears (a11y: user is told why, in place).
  useEffect(() => {
    if (!focusId) return;
    const el = typeof document !== "undefined" ? document.getElementById(`pb-correction-${focusId}`) : null;
    el?.focus();
  }, [focusId]);

  function place(item: SortItem, bucketId: string) {
    setAssign((prev) => ({ ...prev, [item.id]: bucketId }));
    const correction = correctionFor(item, bucketId);
    setCorrections((prev) => {
      const next = { ...prev };
      if (correction) next[item.id] = correction;
      else delete next[item.id];
      return next;
    });
    if (correction) setFocusId(item.id);
    else setFocusId((prev) => (prev === item.id ? null : prev));
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3" role="list">
        {items.map((item) => {
          const current = assign[item.id];
          return (
            <li key={item.id} className="rounded-2xl bg-white/70 p-4">
              <p className="font-body text-[15px] leading-relaxed text-charcoal">{item.text}</p>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={`Sort: ${item.text}`}>
                {buckets.map((b) => {
                  const selected = current === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => place(item, b.id)}
                      className={
                        "rounded-full px-3 py-2 font-ui text-sm transition " +
                        (selected
                          ? "bg-midnight-navy text-warm-ivory"
                          : "bg-light-gray/60 text-charcoal hover:bg-light-gray")
                      }
                    >
                      {selected ? "✓ " : ""}
                      {b.label}
                    </button>
                  );
                })}
              </div>
              {corrections[item.id] && (
                <p
                  id={`pb-correction-${item.id}`}
                  tabIndex={-1}
                  className="mt-3 rounded-xl bg-soft-coral/20 px-3 py-2 font-body text-sm text-charcoal outline-none"
                  role="status"
                >
                  {corrections[item.id]}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {allAssigned && note && (
        <p className="rounded-2xl bg-sage-green/15 px-4 py-3 font-body text-[15px] leading-relaxed text-charcoal">
          {note}
        </p>
      )}

      <button
        type="button"
        disabled={!allAssigned}
        onClick={() => onComplete(assign)}
        className="rounded-full bg-coral-rose px-6 py-3 font-ui text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40"
      >
        {continueLabel}
      </button>
      {!allAssigned && (
        <p className="font-body text-sm text-charcoal/55">Sort each one to continue.</p>
      )}
    </div>
  );
}
