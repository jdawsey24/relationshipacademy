"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { StructuralSlug } from "@/lib/phases";

// Lightweight quiz state shared across the /snapshot/* pages via the snapshot
// layout. Intentionally no external state library — just context + useState.
// State lives for the duration of client-side navigation within /snapshot;
// a full page refresh resets it (the results page survives refresh because it
// reloads by session_id from the URL).

export interface QuizState {
  structuralPhaseSlug: StructuralSlug | null;
  setStructuralPhase: (slug: StructuralSlug) => void;
  /** question_id -> raw_response (1..5) */
  responses: Record<string, number>;
  setResponse: (questionId: string, rawResponse: number) => void;
  sessionId: string | null;
  setSessionId: (id: string) => void;
  reset: () => void;
}

const QuizContext = createContext<QuizState | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [structuralPhaseSlug, setStructuralPhaseSlug] =
    useState<StructuralSlug | null>(null);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [sessionId, setSessionIdState] = useState<string | null>(null);

  const setStructuralPhase = useCallback(
    (slug: StructuralSlug) => setStructuralPhaseSlug(slug),
    []
  );
  const setResponse = useCallback(
    (questionId: string, rawResponse: number) =>
      setResponses((prev) => ({ ...prev, [questionId]: rawResponse })),
    []
  );
  const setSessionId = useCallback((id: string) => setSessionIdState(id), []);
  const reset = useCallback(() => {
    setStructuralPhaseSlug(null);
    setResponses({});
    setSessionIdState(null);
  }, []);

  const value = useMemo<QuizState>(
    () => ({
      structuralPhaseSlug,
      setStructuralPhase,
      responses,
      setResponse,
      sessionId,
      setSessionId,
      reset,
    }),
    [structuralPhaseSlug, responses, sessionId, setStructuralPhase, setResponse, setSessionId, reset]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizState {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return ctx;
}
