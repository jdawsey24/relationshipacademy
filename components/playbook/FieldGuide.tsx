"use client";

// Rev 3 Understand layer — the navigable field guide (Step 3, revised).
//
// Renders authored LiteratureEntry content: optional, non-sequential, browseable.
// No "next"; the reader picks entries and follows related links. Read-only.
//
// Three depths: Core Guides + Question Reads are browseable; Just-in-Time entries
// are surfaced at their anchors FIRST (by the engine, later step) and only appear
// as related reading once surfaced — `availableJitIds` carries which JIT entries the
// reader has already seen. Flag-gated at the call site; not wired into v0.

import { useEffect, useRef, useState } from "react";
import type { LiteratureBlock, LiteratureEntry } from "@/lib/playbook/contentSchema";

const focusBtn =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-midnight-navy focus-visible:ring-offset-2 focus-visible:ring-offset-warm-ivory";

function Block({ block }: { block: LiteratureBlock }) {
  switch (block.kind) {
    case "paragraph":
      return (
        <section className="space-y-3">
          {block.heading && <h2 className="font-ui text-sm font-semibold uppercase tracking-wide text-charcoal/55">{block.heading}</h2>}
          {block.body.map((p, j) => (
            <p key={j} className="font-body text-[16px] leading-relaxed text-charcoal/85">{p}</p>
          ))}
        </section>
      );
    case "distinction":
      return (
        <aside className="rounded-2xl border border-slate-blue/30 bg-slate-blue/10 p-4">
          <p className="font-ui text-xs font-semibold uppercase tracking-wide text-slate-blue">{block.label}</p>
          {block.body.map((p, j) => (
            <p key={j} className="mt-2 font-body text-[15px] leading-relaxed text-charcoal/85">{p}</p>
          ))}
        </aside>
      );
    case "list":
      return (
        <div className="space-y-2">
          {block.label && <p className="font-ui text-sm font-medium text-charcoal">{block.label}</p>}
          <ul className="space-y-1">
            {block.items.map((it, j) => (
              <li key={j} className="flex gap-2 font-body text-[15px] leading-relaxed text-charcoal/85">
                <span aria-hidden="true" className="text-coral-rose">•</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "example":
      return (
        <figure className="rounded-2xl bg-warm-ivory px-4 py-3">
          <figcaption className="font-ui text-xs uppercase tracking-wide text-charcoal/45">For example</figcaption>
          {block.body.map((p, j) => (
            <p key={j} className="mt-1 font-body text-[15px] italic leading-relaxed text-charcoal/80">{p}</p>
          ))}
        </figure>
      );
    case "guardrail":
      return (
        <aside className="rounded-2xl bg-sage-green/12 px-4 py-3" role="note">
          <p className="font-ui text-xs uppercase tracking-wide text-charcoal/50">Keep in mind</p>
          {block.body.map((p, j) => (
            <p key={j} className="mt-1 font-body text-[15px] leading-relaxed text-charcoal/85">{p}</p>
          ))}
        </aside>
      );
    default:
      return null;
  }
}

const BROWSE_SECTIONS: { key: string; heading: string; match: (e: LiteratureEntry) => boolean }[] = [
  { key: "core", heading: "Core guides", match: (e) => e.scope === "cluster" && e.depth !== "question" },
  { key: "questions", heading: "Common questions", match: (e) => e.scope === "cluster" && e.depth === "question" },
  { key: "play", heading: "Behind the tools", match: (e) => e.scope === "play" },
  // JIT entries are intentionally NOT a browse section — they surface at their anchors.
];

export interface FieldGuideProps {
  entries: LiteratureEntry[];
  /** JIT entry ids the reader has already encountered at an anchor — eligible for revisit. */
  availableJitIds?: string[];
  title?: string;
  onExit?: () => void;
}

export default function FieldGuide({ entries, availableJitIds = [], title = "Understand this pattern", onExit }: FieldGuideProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRun = useRef(true);

  // Move focus to the heading on navigation (into an article, back to the index) —
  // skip the initial mount so we don't steal focus on first render.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [activeId]);

  const byId = (id: string) => entries.find((e) => e.id === id);
  const jitAvailable = new Set(availableJitIds);
  const active = activeId ? byId(activeId) : null;

  if (active) {
    const related = (active.related ?? [])
      .map(byId)
      .filter((e): e is LiteratureEntry => Boolean(e))
      // JIT related links only appear once the reader has seen them at their anchor.
      .filter((e) => e.scope !== "jit" || jitAvailable.has(e.id));
    return (
      <article className="mx-auto max-w-2xl px-5 py-8" aria-label={active.title}>
        <button type="button" onClick={() => setActiveId(null)} className={`font-ui text-sm text-charcoal/55 hover:text-charcoal ${focusBtn}`}>
          ← All topics
        </button>
        <h1 ref={headingRef} tabIndex={-1} className="mt-6 font-display text-2xl text-midnight-navy focus:outline-none">{active.title}</h1>
        <div className="mt-5 space-y-6">
          {active.body.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
        {related.length > 0 && (
          <nav className="mt-8 border-t border-light-gray pt-5" aria-label="Related reading">
            <p className="font-ui text-xs uppercase tracking-wide text-charcoal/50">Related</p>
            <ul className="mt-2 space-y-1">
              {related.map((r) => (
                <li key={r.id}>
                  <button type="button" onClick={() => setActiveId(r.id)} className={`text-left font-body text-[15px] text-midnight-navy underline hover:opacity-80 ${focusBtn}`}>
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
        <h1 ref={headingRef} tabIndex={-1} className="font-display text-2xl text-midnight-navy focus:outline-none">{title}</h1>
        {onExit && (
          <button type="button" onClick={onExit} className={`font-ui text-sm text-charcoal/55 hover:text-charcoal ${focusBtn}`}>
            Done
          </button>
        )}
      </div>
      <p className="mt-2 font-body text-[15px] text-charcoal/70">Read whatever pulls at you, in any order. Nothing here is required.</p>
      {BROWSE_SECTIONS.map(({ key, heading, match }) => {
        const inSection = entries.filter(match);
        if (inSection.length === 0) return null;
        return (
          <div key={key} className="mt-8">
            <h2 className="font-ui text-sm font-semibold uppercase tracking-wide text-charcoal/55">{heading}</h2>
            <ul className="mt-3 space-y-2">
              {inSection.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(e.id)}
                    className={`w-full rounded-2xl bg-white/70 px-4 py-3 text-left font-body text-[16px] text-charcoal transition hover:bg-white ${focusBtn}`}
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
