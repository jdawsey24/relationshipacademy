import Link from "next/link";
import type { CSSProperties } from "react";
import { listAssessments } from "@/lib/snapshot/data";
import { MarkerMark, markerHue } from "@/components/site/MarkerMark";
import { IconTile, CARD_HOVER } from "@/components/site/IconTile";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Relationship Snapshot™ — Where are you right now?",
  description: "Pick the moment that fits where you are, answer a few honest questions, and get a clear read on what your relationship life needs next.",
};

const SINGLE_IDS = ["single_but_dating", "single_contemplating_dating"];
const SUB_LABEL: Record<string, string> = {
  single_but_dating: "Actively dating",
  single_contemplating_dating: "Contemplating dating",
};

export default async function QuizPickerPage() {
  const assessments = await listAssessments();
  type Assessment = (typeof assessments)[number];
  const singles = SINGLE_IDS
    .map((id) => assessments.find((a) => a.id === id))
    .filter((a): a is Assessment => Boolean(a));
  const others = assessments.filter((a) => !SINGLE_IDS.includes(a.id));
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
        {/* Single — one choice up front, then which kind of single */}
        {singles.length > 0 && (
          <details
            style={{ "--hue": "#6B7C97" } as CSSProperties}
            className="group overflow-hidden rounded-2xl border border-light-gray bg-white transition-all open:border-slate-blue/40 has-[summary:hover]:-translate-y-0.5 has-[summary:hover]:border-[var(--hue)] has-[summary:hover]:shadow-[0_10px_30px_-16px_var(--hue)] [&_summary]:list-none">
            <summary className="flex cursor-pointer items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <IconTile hue="#6B7C97">
                <MarkerMark id="single" className="h-[26px] w-[26px]" />
              </IconTile>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-semibold text-midnight-navy">Single</span>
                <span className="mt-0.5 block font-body text-[15px] leading-relaxed text-charcoal/75">You&apos;re not in a relationship right now — which fits?</span>
              </span>
              <span className="shrink-0 text-midnight-navy/40 transition-transform group-open:rotate-180" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
              </span>
            </summary>
            <div className="space-y-2 border-t border-light-gray bg-[#FBF9F5] px-3 pb-3 pt-3">
              {singles.map((a) => <MarkerRow key={a.id} a={a} label={SUB_LABEL[a.id]} sub />)}
            </div>
          </details>
        )}
        {/* Everyone else */}
        {others.map((a) => <MarkerRow key={a.id} a={a} />)}
      </div>

      <p className="mt-8 font-ui text-sm text-charcoal/50">Free · about 3 minutes · no account needed</p>
    </main>
  );
}

function MarkerRow({ a, label, sub }: { a: { id: string; display_name: string; entry_prompt: string }; label?: string; sub?: boolean }) {
  const hue = markerHue(a.id);
  return (
    <Link
      href={`/snapshot/${a.id}`}
      style={{ "--hue": hue } as CSSProperties}
      className={`group flex items-center gap-4 border ${
        sub
          ? "rounded-xl border-transparent bg-[#FBF9F5] px-4 py-3.5 transition-all hover:-translate-y-0.5 hover:border-[var(--hue)] hover:bg-white"
          : `rounded-2xl border-light-gray bg-white px-5 py-4 ${CARD_HOVER}`
      }`}
    >
      <IconTile hue={hue}>
        <MarkerMark id={a.id} className="h-[26px] w-[26px]" />
      </IconTile>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg font-semibold text-midnight-navy">{label ?? a.display_name}</span>
        <span className="mt-0.5 block font-body text-[15px] leading-relaxed text-charcoal/75">{a.entry_prompt}</span>
      </span>
      <span className="shrink-0 text-xl transition-transform group-hover:translate-x-0.5" style={{ color: hue }} aria-hidden="true">→</span>
    </Link>
  );
}
