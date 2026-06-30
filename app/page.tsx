import Link from "next/link";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-warm-ivory px-6 py-16 text-center">
      <div className="flex w-full max-w-2xl flex-col items-center">
        <Logo variant="full" className="mb-10 text-2xl sm:text-3xl" />

        <h1 className="font-display text-4xl font-semibold leading-tight text-midnight-navy sm:text-6xl">
          Understand where your relationship really is.
        </h1>

        <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-charcoal">
          The Relationship Snapshot&trade; is a free developmental assessment
          based on the Relationship Life Cycle&trade; Framework. It measures how
          your relationship is functioning across six key areas — and whether
          that matches where you actually are.
        </p>

        <Link
          href="/snapshot/intro"
          className="mt-10 inline-flex min-h-[52px] items-center justify-center rounded-full bg-midnight-navy px-10 font-ui text-base font-medium text-white transition-colors hover:bg-midnight-navy/90"
        >
          Take the Free Snapshot
        </Link>
      </div>
    </main>
  );
}
