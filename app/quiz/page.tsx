import Link from "next/link";
import { listAssessments } from "@/lib/snapshot/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Relationship Snapshot™ — Where are you right now?",
  description: "Pick the moment that fits where you are, answer a few honest questions, and get a clear read on what your relationship life needs next.",
};

export default async function QuizPickerPage() {
  const assessments = await listAssessments();
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-14 text-center sm:pt-20">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">The Relationship Snapshot&trade;</p>
      <h1 className="mx-auto mt-3 max-w-2xl text-balance font-display text-4xl font-semibold leading-[1.08] text-midnight-navy sm:text-5xl">
        Where are you right now?
      </h1>
      <p className="mx-auto mt-4 max-w-md font-body text-lg leading-relaxed text-charcoal/75">
        Pick the one that fits where your relationship life is today. There&apos;s no wrong choice — start with whatever feels closest.
      </p>

      <div className="mt-10 space-y-3 text-left">
        {assessments.map((a) => {
          const phase = a.display_name.replace(/\s*Assessment$/i, "");
          return (
            <Link
              key={a.id}
              href={`/quiz/${a.id}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-light-gray bg-white px-5 py-4 transition-colors hover:border-midnight-navy/50"
            >
              <span>
                <span className="block font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-coral-rose">{phase}</span>
                <span className="mt-0.5 block font-body text-[15px] leading-relaxed text-charcoal/90">{a.entry_prompt}</span>
              </span>
              <span className="shrink-0 text-xl text-midnight-navy/40 transition-transform group-hover:translate-x-0.5 group-hover:text-midnight-navy" aria-hidden="true">→</span>
            </Link>
          );
        })}
      </div>

      <p className="mt-8 font-ui text-sm text-charcoal/50">Free · about 3 minutes · no account needed</p>
    </main>
  );
}
