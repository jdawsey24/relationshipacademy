"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useQuiz } from "@/components/quiz/QuizContext";

export default function CapturePage() {
  const router = useRouter();
  const { structuralPhaseSlug, responses, setSessionId } = useQuiz();

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [relationshipLength, setRelationshipLength] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const responseCount = Object.keys(responses).length;

  // If state was lost (refresh/deep-link), restart the flow rather than
  // submitting an empty attempt.
  useEffect(() => {
    if (!structuralPhaseSlug || responseCount === 0) {
      router.replace("/snapshot/phase-select");
    }
  }, [structuralPhaseSlug, responseCount, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!structuralPhaseSlug) {
      router.replace("/snapshot/phase-select");
      return;
    }

    const sessionId = crypto.randomUUID();
    const payload = {
      session_id: sessionId,
      quiz_type: "snapshot",
      name: firstName.trim(),
      email: email.trim(),
      relationship_length: relationshipLength.trim(),
      relationship_status_detail: "",
      structural_phase_slug: structuralPhaseSlug,
      responses: Object.entries(responses).map(([question_id, raw_response]) => ({
        question_id,
        raw_response,
      })),
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Scoring failed (${res.status}).`);
      }
      setSessionId(sessionId);
      router.push(`/snapshot/results?session_id=${sessionId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} Your answers are saved — please try again.`
          : "Something went wrong. Your answers are saved — please try again."
      );
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
      <Logo variant="full" href="/" className="text-lg" />

      <div className="mt-16 flex flex-1 flex-col">
        <h1 className="font-display text-4xl font-semibold text-midnight-navy">
          You&apos;re almost there.
        </h1>
        <p className="mt-3 font-body text-lg text-charcoal">
          Enter your name and email to receive your Relationship Snapshot&trade; results.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-1.5">
            <span className="font-ui text-sm font-medium text-charcoal">First name</span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
              className="min-h-[48px] rounded-lg border border-light-gray bg-white px-4 font-ui text-base text-charcoal outline-none focus:border-midnight-navy"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-ui text-sm font-medium text-charcoal">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="min-h-[48px] rounded-lg border border-light-gray bg-white px-4 font-ui text-base text-charcoal outline-none focus:border-midnight-navy"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-ui text-xs text-charcoal/70">
              How long have you been together? (optional)
            </span>
            <input
              type="text"
              value={relationshipLength}
              onChange={(e) => setRelationshipLength(e.target.value)}
              placeholder="e.g. 3 years"
              className="min-h-[44px] rounded-lg border border-light-gray bg-white px-4 font-ui text-sm text-charcoal outline-none focus:border-midnight-navy"
            />
          </label>

          {error && (
            <p className="rounded-lg bg-coral-rose/10 px-4 py-3 font-body text-sm text-coral-rose">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-midnight-navy px-10 font-ui text-base font-medium text-white transition-all hover:bg-midnight-navy/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Scoring…" : "Show My Results"}
          </button>

          <p className="text-center font-body text-xs text-charcoal/60">
            Your information is kept private and will never be sold.
          </p>
        </form>
      </div>
    </main>
  );
}
