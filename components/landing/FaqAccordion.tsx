"use client";

import { useState } from "react";

export interface Faq { q: string; a: string }

export default function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-light-gray overflow-hidden rounded-2xl border border-light-gray bg-white">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-display text-lg font-medium text-midnight-navy">{f.q}</span>
              <span className={`shrink-0 text-2xl leading-none text-coral-rose transition-transform ${isOpen ? "rotate-45" : ""}`} aria-hidden="true">+</span>
            </button>
            {isOpen && <p className="px-6 pb-6 -mt-1 font-body leading-relaxed text-charcoal/80">{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
