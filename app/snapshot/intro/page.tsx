import Link from "next/link";
import Logo from "@/components/Logo";

const POINTS = [
  "This assessment takes about 10 minutes.",
  "Answer based on how your relationship is right now, not how you'd like it to be.",
  "There are no right or wrong answers.",
  "Your results will reflect where your relationship is developmentally — and where there may be room to grow.",
];

export default function IntroPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
      <Logo variant="full" href="/" className="h-9" />

      <div className="mt-16 flex flex-1 flex-col">
        <h1 className="font-display text-4xl font-semibold text-midnight-navy sm:text-5xl">
          Before you begin
        </h1>

        <ul className="mt-8 space-y-5">
          {POINTS.map((p) => (
            <li key={p} className="flex gap-3 font-body text-lg leading-relaxed text-charcoal">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral-rose" aria-hidden="true" />
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/snapshot/phase-select"
          className="mt-12 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-midnight-navy px-10 font-ui text-base font-medium text-white transition-colors hover:bg-midnight-navy/90 sm:w-auto sm:self-start"
        >
          Let&apos;s get started
        </Link>
      </div>
    </main>
  );
}
