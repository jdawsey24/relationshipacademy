"use client";

// Rev 3 Understand layer — the navigable field guide (Step 3).
//
// Renders authored LiteratureEntry content: optional, non-sequential, browseable.
// No "next"; the reader picks entries and follows related links. Read-only — it
// records nothing here (read-state, where useful, is handled by the engine later,
// and is content engagement, never a change signal). Flag-gated at the call site;
// not wired into the v0 delivery path.

import { useState } from "react";
import type { LiteratureEntry, LiteratureScope } from "@/lib/playbook/contentSchema";

const SCOPE_SECTIONS: { scope: LiteratureScope; heading: string }[] = [
  { scope: "cluster", heading: "The big picture" },
  { scope: "play", heading: "Behind the tools" },
  { scope: "jit", heading: "Quick reads" },
];

export interface FieldGuideProps {
  entries: LiteratureEntry[];
  title?: string;
  onExit?: () => void;
}

export default function FieldGuide({ entries, title = "Understand this pattern", onExit }: FieldGuideProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const byId = (id: string) => entries.find((e) => e.id === id);
  const active = activeId ? byId(activeId) : null;

  if (active) {
    const related = (active.related ?? []).map(byId).filter((e): e is LiteratureEntry => Boolean(e));
    return (
      <article className="mx-auto max-w-2xl px-5 py-8" aria-label={active.title}>
        <button type="button" onClick={() => setActiveId(null)} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">
          ← All topics
        </button>
        <h1 className="mt-6 font-display text-2xl text-midnight-navy">{active.title}</h1>
        <div className="mt-5 space-y-6">
          {active.body.map((block, i) => (
            <section key={i} className="space-y-3">
              {block.heading && <h2 className="font-ui text-sm font-semibold uppercase tracking-wide text-charcoal/55">{block.heading}</h2>}
              {block.body.map((p, j) => (
                <p key={j} className="font-body text-[16px] leading-relaxed text-charcoal/85">{p}</p>
              ))}
            </section>
          ))}
        </div>
        {related.length > 0 && (
          <nav className="mt-8 border-t border-light-gray pt-5" aria-label="Related reading">
            <p className="font-ui text-xs uppercase tracking-wide text-charcoal/50">Related</p>
            <ul className="mt-2 space-y-1">
              {related.map((r) => (
                <li key={r.id}>
                  <button type="button" onClick={() => setActiveId(r.id)} className="text-left font-body text-[15px] text-midnight-navy underline hover:opacity-80">
                    {r.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-5 py-8" aria-label={title}>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-midnight-navy">{title}</h1>
        {onExit && (
          <button type="button" onClick={onExit} className="font-ui text-sm text-charcoal/55 hover:text-charcoal">
            Done
          </button>
        )}
      </div>
      <p className="mt-2 font-body text-[15px] text-charcoal/70">
        Read whatever pulls at you, in any order. Nothing here is required.
      </p>
      {SCOPE_SECTIONS.map(({ scope, heading }) => {
        const inScope = entries.filter((e) => e.scope === scope);
        if (inScope.length === 0) return null;
        return (
          <div key={scope} className="mt-8">
            <h2 className="font-ui text-sm font-semibold uppercase tracking-wide text-charcoal/55">{heading}</h2>
            <ul className="mt-3 space-y-2">
              {inScope.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(e.id)}
                    className="w-full rounded-2xl bg-white/70 px-4 py-3 text-left font-body text-[16px] text-charcoal transition hover:bg-white"
                  >
                    {e.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
