"use client";

import { isInputBlock } from "@/lib/companion";
import { tint } from "@/lib/companion/categoryMeta";

// Renders ONE experience block. Reading blocks (intro, insight, practice, closing,
// safety) are styled to be read; input blocks lead with a serif prompt and capture
// a response via onChange(value). Content is placeholder until the approved copy is
// supplied — this component ships; the words don't.

export interface RenderBlock { type: string; order: number; payload: unknown; conditional_on: unknown }

const SINGLE_LINE = new Set(["reflection_single", "user_next_step"]);
const TWO_FIELD: Record<string, [string, string]> = {
  fact_vs_assumption: ["What I know", "What I'm assuming"],
  decision_comparison: ["Option A", "Option B"],
};

// Non-input "reading" blocks get a soft tinted card + a small cue and icon.
const READING: Record<string, { label: string | null; accent: string; icon: string[] }> = {
  intro_context: { label: null, accent: "", icon: [] },
  educational_note: { label: "Worth knowing", accent: "#4F6D8C", icon: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", "M12 8v.01", "M12 11v5"] },
  practice_recommendation: { label: "A small practice", accent: "#5F9E7C", icon: ["M12 21v-9", "M12 12c-1-3-4-4-7-4 0 3 3 5 7 5z", "M12 12c1-4 4-5 7-5 0 3-3 5-7 5z"] },
  closing_summary: { label: "To carry with you", accent: "#B0596B", icon: ["M12 21s-7-4.6-9.4-8A4.9 4.9 0 0 1 12 6.8a4.9 4.9 0 0 1 9.4 6.2C19 16.4 12 21 12 21z"] },
};

function bodyText(payload: unknown): string {
  const p = payload as { placeholder?: string; text?: string } | null;
  return p?.placeholder ?? p?.text ?? "[CONTENT TO BE PROVIDED]";
}

function Glyph({ icon }: { icon: string[] }) {
  return (
    <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icon.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

export default function BlockView({ block, value, onChange, disabled }: {
  block: RenderBlock; value: unknown; onChange: (v: unknown) => void; disabled?: boolean;
}) {
  const isInput = isInputBlock(block.type);
  const text = bodyText(block.payload);

  // Reading (display-only) blocks.
  if (!isInput) {
    // The intro sets the scene — lead prose, no card.
    if (block.type === "intro_context") {
      return <p className="text-balance font-body text-[17px] leading-relaxed text-charcoal/85">{text}</p>;
    }
    // Safety blocks keep the amber treatment.
    if (block.type === "safety_notice" || block.type === "professional_support") {
      return (
        <section className="rounded-2xl border border-amber-warm/40 bg-amber-warm/5 p-5">
          <p className="font-body leading-relaxed text-charcoal/80">{text}</p>
        </section>
      );
    }
    const m = READING[block.type] ?? { label: null, accent: "#7C8794", icon: [] };
    return (
      <section className="rounded-2xl p-4" style={{ backgroundColor: tint(m.accent, 0.07), borderColor: tint(m.accent, 0.2), borderWidth: 1 }}>
        {m.label && (
          <div className="mb-1.5 flex items-center gap-1.5" style={{ color: m.accent }}>
            <Glyph icon={m.icon} />
            <span className="font-ui text-[11px] font-semibold uppercase tracking-wide">{m.label}</span>
          </div>
        )}
        <p className="font-body leading-relaxed text-charcoal/80">{text}</p>
      </section>
    );
  }

  // Structured two-field input.
  const twoField = TWO_FIELD[block.type];
  if (twoField) {
    const v = (value as { a?: string; b?: string }) ?? {};
    return (
      <section className="rounded-2xl border border-light-gray bg-white p-4">
        <p className="font-display text-[18px] font-semibold leading-snug text-midnight-navy">{text}</p>
        <div className="mt-3 grid gap-2.5">
          {(["a", "b"] as const).map((k, i) => (
            <label key={k} className="block">
              <span className="font-ui text-xs text-charcoal/55">{twoField[i]}</span>
              <textarea disabled={disabled} value={v[k] ?? ""} onChange={(e) => onChange({ ...v, [k]: e.target.value })} rows={2}
                className="mt-1 w-full rounded-xl border border-light-gray bg-warm-ivory/50 px-3 py-2 font-body text-sm text-charcoal focus:border-midnight-navy/40 focus:outline-none focus:ring-2 focus:ring-midnight-navy/10" />
            </label>
          ))}
        </div>
      </section>
    );
  }

  // Single-line or long free-text input — the prompt leads in the display serif.
  return (
    <section className="rounded-2xl border border-light-gray bg-white p-4">
      <p className="font-display text-[18px] font-semibold leading-snug text-midnight-navy">{text}</p>
      {SINGLE_LINE.has(block.type) ? (
        <input disabled={disabled} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} aria-label={text}
          className="mt-3 w-full rounded-xl border border-light-gray bg-warm-ivory/50 px-3 py-2.5 font-body text-sm text-charcoal focus:border-midnight-navy/40 focus:outline-none focus:ring-2 focus:ring-midnight-navy/10" />
      ) : (
        <textarea disabled={disabled} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)} rows={4} aria-label={text}
          className="mt-3 w-full rounded-xl border border-light-gray bg-warm-ivory/50 px-3 py-2.5 font-body text-sm leading-relaxed text-charcoal focus:border-midnight-navy/40 focus:outline-none focus:ring-2 focus:ring-midnight-navy/10" />
      )}
    </section>
  );
}
