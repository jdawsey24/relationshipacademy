"use client";

import { QuizProvider } from "@/components/quiz/QuizContext";

// Wraps every /snapshot/* page in the shared quiz state. Because this layout
// persists across client-side navigation within /snapshot, the respondent's
// phase selection and responses survive page-to-page moves.
export default function SnapshotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QuizProvider>
      <div className="min-h-screen bg-warm-ivory">{children}</div>
    </QuizProvider>
  );
}
