"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Option = { id: string; statement: string };
type Question = { id: string; question_order: number; options: Option[] };
interface Quiz { questions: Question[] }
type TieOption = { cluster_id: number; name: string; statement: string };

export default function QuizPage() {
  const { assessment } = useParams<{ assessment: string }>();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [notFound, setNotFound] = useState(false);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [tiebreak, setTiebreak] = useState<{ sessionId: string; options: TieOption[] } | null>(null);

  useEffect(() => {
    // Start the session: resolves each slot's statement (unique per session) server-side.
    fetch(`/api/snapshot/start`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marker: assessment }),
    })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: { session_id: string; questions: Question[] }) => { setSessionId(d.session_id); setQuiz({ questions: d.questions }); })
      .catch(() => setNotFound(true));
  }, [assessment]);

  const submit = useCallback(async (finalAnswers: Record<string, string>) => {
    if (!quiz || !sessionId) return;
    setBusy(true); setErr(null);
    const payload = quiz.questions.map((q) => ({ question_id: q.id, option_id: finalAnswers[q.id] })).filter((a) => a.option_id);
    const res = await fetch(`/api/snapshot/score`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, answers: payload }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setBusy(false); setErr(d.error ?? "Something went wrong."); return; }
    if (d.tied && Array.isArray(d.tiebreak)) { setBusy(false); setTiebreak({ sessionId: d.session_id, options: d.tiebreak }); return; }
    router.push(`/snapshot/results/${d.session_id}`);
  }, [quiz, sessionId, router]);

  function choose(question: Question, optionId: string) {
    if (busy) return;
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);
    const isLast = idx === (quiz?.questions.length ?? 0) - 1;
    setTimeout(() => { if (isLast) submit(next); else setIdx((i) => i + 1); }, 260);
  }

  async function resolveTie(clusterId: number) {
    if (!tiebreak || busy) return;
    setBusy(true); setErr(null);
    const res = await fetch(`/api/snapshot/tiebreak`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: tiebreak.sessionId, cluster_id: clusterId }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setBusy(false); setErr(d.error ?? "Something went wrong."); return; }
    router.push(`/snapshot/results/${tiebreak.sessionId}`);
  }

  if (notFound) return <Centered>This quiz isn&apos;t available right now.</Centered>;
  if (!quiz) return <Centered>Loading…</Centered>;

  // Tiebreak step
  if (tiebreak) {
    return (
      <main className="mx-auto max-w-xl px-6 pb-24 pt-10">
        <p className="text-center font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">One more</p>
        <h2 className="mt-2 text-balance text-center font-display text-2xl font-semibold text-midnight-navy">Which feels more true right now?</h2>
        <div className="mt-7 space-y-2.5">
          {tiebreak.options.map((o) => (
            <button key={o.cluster_id} disabled={busy} onClick={() => resolveTie(o.cluster_id)}
              className="block w-full rounded-2xl border border-light-gray bg-white px-5 py-4 text-left font-body leading-relaxed text-charcoal transition-colors hover:border-midnight-navy/50 disabled:opacity-50">
              {o.statement}
            </button>
          ))}
        </div>
        {err && <p className="mt-4 text-center text-sm text-coral-rose">{err}</p>}
      </main>
    );
  }

  const q = quiz.questions[idx];
  const total = quiz.questions.length;
  const answering = busy && idx === total - 1;

  return (
    <main className="mx-auto max-w-xl px-6 pb-24 pt-8">
      <div className="mb-6">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-light-gray">
          <div className="h-full rounded-full bg-midnight-navy transition-all duration-300" style={{ width: `${Math.round((idx / total) * 100)}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <button onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0} className="font-ui text-sm text-charcoal/50 hover:text-charcoal disabled:opacity-0">Back</button>
          <p className="font-ui text-xs text-charcoal/45">{idx + 1} of {total}</p>
        </div>
      </div>

      <h2 className="text-balance font-display text-xl font-semibold text-midnight-navy sm:text-2xl">Which of these feels most true for you right now?</h2>
      <div className="mt-5 space-y-2.5">
        {q.options.map((o) => {
          const selected = answers[q.id] === o.id;
          return (
            <button key={o.id} disabled={busy} onClick={() => choose(q, o.id)}
              className={`block w-full rounded-2xl border px-5 py-4 text-left font-body leading-relaxed transition-colors disabled:cursor-default ${selected ? "border-midnight-navy bg-midnight-navy/5 text-midnight-navy" : "border-light-gray bg-white text-charcoal hover:border-midnight-navy/50"}`}>
              {o.statement}
            </button>
          );
        })}
      </div>
      {answering && <p className="mt-5 text-center font-ui text-sm text-charcoal/50">Reading your snapshot…</p>}
      {err && <p className="mt-4 text-center text-sm text-coral-rose">{err}</p>}
    </main>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-[70vh] items-center justify-center px-6"><p className="text-charcoal/60">{children}</p></main>;
}
