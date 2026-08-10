import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionLabel from "@/components/site/SectionLabel";
import EyesOpenCheckout from "@/components/site/EyesOpenCheckout";
import { EYES_OPEN, seatsRemaining, enrolmentState } from "@/lib/eyesOpen";

// The enrolment step. Deliberately thin: she has already read the sales page,
// so this confirms what she is buying and takes the payment.
//
// The seat check runs here too, not only on the sales page. Someone can sit on
// this page while the last seat sells, and arriving with a stale link should
// not present a form that is going to fail.

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Enroll — Dating With Your Eyes Open | Relationship Life Cycle™",
  description: "Reserve your seat in the founding cohort of Dating With Your Eyes Open.",
  robots: { index: false },   // a checkout step, not a landing page
};

export default async function EnrollPage() {
  const seats = await seatsRemaining();
  const state = enrolmentState(seats);

  if (state !== "open") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <SectionLabel>Founding cohort</SectionLabel>
        <h1 className="mt-3 font-display text-4xl font-semibold text-midnight-navy">
          {state === "full" ? "All fifteen seats are taken" : "The September cohort has begun"}
        </h1>
        <p className="mx-auto mt-5 max-w-lg font-body text-lg leading-relaxed text-charcoal/75">
          The series runs again on Thursday evenings in October. {EYES_OPEN.nextCohort.note} Leave
          your email and you&apos;ll hear the dates first.
        </p>
        <Link
          href="/dating-with-your-eyes-open#october"
          className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-base font-medium text-white hover:bg-midnight-navy/90"
        >
          Join the {EYES_OPEN.nextCohort.label} list
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <Link
        href="/dating-with-your-eyes-open"
        className="font-ui text-sm text-charcoal/50 hover:text-midnight-navy"
      >
        ← Back to the details
      </Link>

      <SectionLabel className="mt-8">Founding cohort</SectionLabel>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-midnight-navy">
        Reserve your seat
      </h1>

      <dl className="mt-8 divide-y divide-midnight-navy/10 rounded-2xl border border-midnight-navy/10 bg-white">
        {[
          ["Series", "Dating With Your Eyes Open"],
          ["Dates", `${EYES_OPEN.datesLine} — four Thursdays`],
          ["Time", `${EYES_OPEN.time} ET`],
          ["Replays", "Included"],
          ["Tuition", EYES_OPEN.priceDisplay],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-6 px-6 py-4">
            <dt className="font-ui text-sm font-medium text-charcoal/60">{k}</dt>
            <dd className="text-right font-body text-body text-midnight-navy">{v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 font-body text-sm text-charcoal/60">
        {seats === 1 ? "One seat left." : `${seats} of ${EYES_OPEN.seats} seats left.`}
      </p>

      <EyesOpenCheckout priceDisplay={EYES_OPEN.priceDisplay} />

      <p className="mt-8 font-body text-xs leading-relaxed text-charcoal/50">
        By enrolling you agree to the{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-midnight-navy">Terms</Link> and{" "}
        <Link href="/refund" className="underline underline-offset-2 hover:text-midnight-navy">Refund Policy</Link>.
        Dating With Your Eyes Open is an educational program and is not therapy, coaching,
        mental-health treatment, or a substitute for professional mental-health care.
      </p>
    </div>
  );
}
