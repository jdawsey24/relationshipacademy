import Link from "next/link";
import type { CSSProperties } from "react";
import { listAssessments } from "@/lib/snapshot/data";
import { MarkerMark, markerHue } from "@/components/site/MarkerMark";

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
          const hue = markerHue(a.id);
          return (
            <Link
              key={a.id}
              href={`/snapshot/${a.id}`}
              style={{ "--hue": hue } as CSSProperties}
              className="group flex items-center gap-4 rounded-2xl border border-light-gray bg-white px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-[var(--hue)] hover:shadow-[0_10px_30px_-16px_var(--hue)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${hue}1f` }}>
                <MarkerMark id={a.id} className="h-[26px] w-[26px]" style={{ color: hue }} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-semibold text-midnight-navy">{a.display_name}</span>
                <span className="mt-0.5 block font-body text-[15px] leading-relaxed text-charcoal/75">{a.entry_prompt}</span>
              </span>
              <span className="shrink-0 text-xl transition-transform group-hover:translate-x-0.5" style={{ color: hue }} aria-hidden="true">→</span>
            </Link>
          );
        })}
      </div>

      <p className="mt-8 font-ui text-sm text-charcoal/50">Free · about 3 minutes · no account needed</p>
    </main>
  );
}
