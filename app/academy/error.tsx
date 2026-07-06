"use client";

import Link from "next/link";

// Segment error boundary for the Academy. Turns any unexpected runtime error
// into a calm, on-brand screen instead of a raw crash.
export default function AcademyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-2xl font-semibold text-midnight-navy">Something went wrong</h1>
      <p className="mt-2 max-w-md font-body text-charcoal/70">
        We hit an unexpected error loading this part of the Academy. Try again, or head back to your
        dashboard.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-midnight-navy px-6 py-2.5 font-ui text-sm font-medium text-white hover:bg-midnight-navy/90"
        >
          Try again
        </button>
        <Link
          href="/academy/dashboard"
          className="rounded-full border border-midnight-navy/20 px-6 py-2.5 font-ui text-sm font-medium text-midnight-navy hover:bg-midnight-navy/5"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
