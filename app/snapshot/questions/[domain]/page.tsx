"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/quiz/ProgressBar";
import { useQuiz } from "@/components/quiz/QuizContext";
import {
  getDomainByRouteSlug,
  domainOrder,
  nextDomainRoute,
  prevDomainRoute,
} from "@/lib/domains";
import type { QuizQuestion } from "@/types/assessment";

const RESPONSE_OPTIONS = [
  { label: "Almost Never", score: 1 },
  { label: "Rarely", score: 2 },
  { label: "Sometimes", score: 3 },
  { label: "Often", score: 4 },
  { label: "Almost Always", score: 5 },
];

export default function DomainQuestionsPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain: routeSlug } = use(params);
  const router = useRouter();
  const { structuralPhaseSlug, responses, setResponse } = useQuiz();

  const domainMeta = getDomainByRouteSlug(routeSlug);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // If the flow hasn't been started (e.g. refresh/deep-link lost state), send
  // the respondent back to the phase select.
  useEffect(() => {
    if (domainMeta && !structuralPhaseSlug) {
      router.replace("/snapshot/phase-select");
    }
  }, [domainMeta, structuralPhaseSlug, router]);

  useEffect(() => {
    if (!domainMeta) return;
    let active = true;
    setQuestions(null);
    setLoadError(false);
    fetch(`/api/questions?domain=${routeSlug}`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((data) => {
        if (active) setQuestions(data.questions);
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, [routeSlug, domainMeta, reloadKey]);

  if (!domainMeta) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
        <p className="font-body text-charcoal">
          Unknown section.{" "}
          <Link href="/snapshot/phase-select" className="text-midnight-navy underline">
            Start over
          </Link>
          .
        </p>
      </main>
    );
  }

  const order = domainOrder(routeSlug);
  const prev = prevDomainRoute(routeSlug);
  const next = nextDomainRoute(routeSlug);
  const backHref = prev ? `/snapshot/questions/${prev}` : "/snapshot/phase-select";

  const allAnswered =
    !!questions && questions.length > 0 && questions.every((q) => responses[q.id] !== undefined);

  function handleContinue() {
    if (!allAnswered) return;
    if (next) router.push(`/snapshot/questions/${next}`);
    else router.push("/snapshot/capture");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-8">
      {/* top bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href={backHref}
          className="font-ui text-sm text-charcoal/70 transition-colors hover:text-midnight-navy"
        >
          ← Back
        </Link>
      </div>

      <div className="mt-4">
        <ProgressBar current={order} label={domainMeta.name} />
      </div>

      <h1 className="mt-8 font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">
        {domainMeta.name}
      </h1>

      {/* states */}
      {loadError && (
        <div className="mt-10 rounded-xl border border-light-gray bg-white p-6 text-center">
          <p className="font-body text-charcoal">Unable to load questions. Please refresh.</p>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-midnight-navy px-6 font-ui text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      )}

      {!loadError && !questions && (
        <p className="mt-10 font-body text-charcoal/60">Loading questions…</p>
      )}

      {!loadError && questions && (
        <>
          <div className="mt-6 divide-y divide-light-gray">
            {questions.map((q, i) => (
              <div key={q.id} className="py-6">
                <p className="font-body text-base leading-relaxed text-charcoal sm:text-lg">
                  <span className="mr-2 font-ui text-sm text-charcoal/40">{i + 1}.</span>
                  {q.question_text}
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-2">
                  {RESPONSE_OPTIONS.map((opt) => {
                    const selected = responses[q.id] === opt.score;
                    return (
                      <button
                        key={opt.score}
                        type="button"
                        onClick={() => setResponse(q.id, opt.score)}
                        aria-pressed={selected}
                        className={`min-h-[44px] flex-1 rounded-lg border px-2 py-2 font-ui text-sm transition-colors ${
                          selected
                            ? "border-midnight-navy bg-midnight-navy text-white"
                            : "border-light-gray bg-white text-charcoal hover:border-midnight-navy/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!allAnswered}
            className="mt-6 mb-4 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-midnight-navy px-10 font-ui text-base font-medium text-white transition-all hover:bg-midnight-navy/90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:self-end"
          >
            {next ? "Continue" : "Continue to results"}
          </button>
        </>
      )}
    </main>
  );
}
