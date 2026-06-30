"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useQuiz } from "@/components/quiz/QuizContext";
import { PHASE_CARDS, classesFor, type StructuralSlug } from "@/lib/phases";
import { DOMAINS } from "@/lib/domains";

export default function PhaseSelectPage() {
  const router = useRouter();
  const { setStructuralPhase } = useQuiz();
  const [selected, setSelected] = useState<StructuralSlug | null>(null);

  function handleContinue() {
    if (!selected) return;
    setStructuralPhase(selected);
    router.push(`/snapshot/questions/${DOMAINS[0].routeSlug}`);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10">
      <Logo variant="full" href="/" className="text-lg" />

      <div className="mt-12">
        <h1 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">
          First, where is your relationship right now?
        </h1>
        <p className="mt-3 font-body text-lg text-charcoal">
          Choose the option that best describes your current relationship structure.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PHASE_CARDS.map((card) => {
          const c = classesFor(card.color);
          const isSelected = selected === card.slug;
          return (
            <button
              key={card.slug}
              type="button"
              onClick={() => setSelected(card.slug)}
              aria-pressed={isSelected}
              className={`relative flex flex-col rounded-xl border-2 p-5 text-left transition-all ${
                isSelected
                  ? `${c.border} ${c.tintBg}`
                  : "border-light-gray bg-white hover:border-charcoal/20"
              }`}
            >
              {/* left accent bar */}
              <span
                className={`absolute left-0 top-4 bottom-4 w-1 rounded-full ${c.barFill}`}
                aria-hidden="true"
              />
              {isSelected && (
                <span
                  className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full ${c.solidBg} ${c.solidText}`}
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
              <span className="pl-3">
                <span className="font-display text-2xl font-semibold text-midnight-navy">
                  {card.name}
                </span>
                <span className="mt-2 block font-body text-base text-charcoal">
                  {card.description}
                </span>
                <span className="mt-3 block font-body text-sm italic text-charcoal/70">
                  Examples: {card.examples}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!selected}
        className="mt-10 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-midnight-navy px-10 font-ui text-base font-medium text-white transition-all hover:bg-midnight-navy/90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:self-start"
      >
        Continue
      </button>
    </main>
  );
}
