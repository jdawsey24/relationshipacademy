"use client";

import { isInputBlock, BLOCK_TYPES } from "@/lib/companion";

// Renders ONE experience block. Content is placeholder until the approved library
// is supplied — this component ships; the words don't. Display blocks show their
// placeholder copy; input blocks capture a response via onChange(value).
// Structured inputs (fact vs assumption, decision comparison) use object values.

export interface RenderBlock { type: string; order: number; payload: unknown; conditional_on: unknown }

const SINGLE_LINE = new Set(["reflection_single", "user_next_step"]);
const TWO_FIELD: Record<string, [string, string]> = {
  fact_vs_assumption: ["What I know (facts)", "What I'm assuming"],
  decision_comparison: ["Option A", "Option B"],
};

function placeholderText(payload: unknown): string {
  const p = payload as { placeholder?: string; text?: string } | null;
  return p?.placeholder ?? p?.text ?? "[CONTENT TO BE PROVIDED]";
}

export default function BlockView({ block, value, onChange, disabled }: {
  block: RenderBlock; value: unknown; onChange: (v: unknown) => void; disabled?: boolean;
}) {
  const label = BLOCK_TYPES.find((b) => b.type === block.type)?.label ?? block.type;
  const isInput = isInputBlock(block.type);
  const twoField = TWO_FIELD[block.type];

  // Display-only block.
  if (!isInput) {
    const safety = block.type === "safety_notice" || block.type === "professional_support";
    return (
      <section className={`rounded-2xl border p-5 ${safety ? "border-amber-warm/40 bg-amber-warm/5" : "border-light-gray bg-white"}`}>
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/45">{label}</p>
        <p className="mt-2 font-body leading-relaxed text-charcoal/80">{placeholderText(block.payload)}</p>
      </section>
    );
  }

  // Structured two-field input.
  if (twoField) {
    const v = (value as { a?: string; b?: string }) ?? {};
    return (
      <section className="rounded-2xl border border-light-gray bg-white p-5">
        <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/45">{label}</p>
        <p className="mt-1 font-body text-sm text-charcoal/60">{placeholderText(block.payload)}</p>
        <div className="mt-3 grid gap-2.5">
          {(["a", "b"] as const).map((k, i) => (
            <label key={k} className="block">
              <span className="font-ui text-xs text-charcoal/55">{twoField[i]}</span>
              <textarea disabled={disabled} value={v[k] ?? ""} onChange={(e) => onChange({ ...v, [k]: e.target.value })} rows={2}
                className="mt-1 w-full rounded-xl border border-light-gray bg-warm-ivory/40 px-3 py-2 font-body text-sm focus:border-midnight-navy/40 focus:outline-none" />
            </label>
          ))}
        </div>
      </section>
    );
  }

  // Single-line or long free-text input.
  return (
    <section className="rounded-2xl border border-light-gray bg-white p-5">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/45">{label}</p>
      <p className="mt-1 font-body text-sm text-charcoal/60">{placeholderText(block.payload)}</p>
      {SINGLE_LINE.has(block.type) ? (
        <input disabled={disabled} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}
          className="mt-3 w-full rounded-xl border border-light-gray bg-warm-ivory/40 px-3 py-2.5 font-body text-sm focus:border-midnight-navy/40 focus:outline-none" />
      ) : (
        <textarea disabled={disabled} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} rows={4}
          className="mt-3 w-full rounded-xl border border-light-gray bg-warm-ivory/40 px-3 py-2.5 font-body text-sm focus:border-midnight-navy/40 focus:outline-none" />
      )}
    </section>
  );
}
