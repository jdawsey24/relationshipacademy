import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Logo from "@/components/Logo";
import { getMember } from "@/lib/academyAuth";
import { PROFESSIONAL_PLAN, formatPrice } from "@/lib/stripePlans";
import BillingPanel from "@/components/academy/BillingPanel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Professional Training | Relationship Life Cycle™ Academy",
  description:
    "Professional training in the Relationship Life Cycle™ framework for therapists, coaches, and practitioners.",
  robots: { index: true, follow: true },
};

// Practitioner track — deliberately separate from the consumer plans. Public
// (viewable logged-out, linked from the marketing site); logged-in members get
// the live enroll/manage panel.
export default async function ProfessionalAcademyPage() {
  const member = await getMember();
  const plan = PROFESSIONAL_PLAN;

  return (
    <div className="min-h-screen bg-warm-ivory">
      {/* Standalone top bar */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 md:px-8">
        <Logo variant="full" href="/" className="h-8" />
        {member ? (
          <Link href="/academy/dashboard" className="font-ui text-sm text-midnight-navy/70 hover:text-midnight-navy">
            ← Back to Academy
          </Link>
        ) : (
          <Link href="/academy/login" className="font-ui text-sm text-midnight-navy/70 hover:text-midnight-navy">
            Sign in
          </Link>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20 md:px-8">
        {/* Hero */}
        <section className="pt-8 text-center md:pt-14">
          <p className="font-ui text-xs uppercase tracking-[0.25em] text-plum">Professional Training</p>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold text-midnight-navy sm:text-5xl">
            Bring the Relationship Life Cycle™ into your practice
          </h1>
          <p className="mx-auto mt-5 max-w-2xl font-body text-lg text-charcoal/80">
            A dedicated training track for therapists, coaches, and practitioners — the framework,
            language, and tools to use the Relationship Life Cycle™ with the people you serve.
          </p>
        </section>

        {/* Value props */}
        <section className="mt-14 grid gap-5 sm:grid-cols-3">
          {[
            { t: "Learn the framework", d: "Go deep on the developmental model behind every phase and domain." },
            { t: "Apply it with clients", d: "Practical language, prompts, and structure you can use in sessions." },
            { t: "Grow with the work", d: "New modules, practitioner resources, and updates as the model evolves." },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-midnight-navy/10 bg-white p-6">
              <h3 className="font-display text-lg font-semibold text-midnight-navy">{c.t}</h3>
              <p className="mt-1 font-body text-sm text-charcoal/70">{c.d}</p>
            </div>
          ))}
        </section>

        {/* Enroll */}
        <section className="mt-14">
          <h2 className="text-center font-display text-2xl font-semibold text-midnight-navy">Enroll in Professional</h2>

          {member && !member.isStaff && (
            <div className="mx-auto mt-6 max-w-xl">
              <Suspense fallback={null}>
                <BillingPanel
                  currentTier={member.profile.membership_tier}
                  hasBilling={!!member.profile.stripe_customer_id}
                  status={member.profile.subscription_status ?? null}
                  plans={[plan]}
                  columns={1}
                />
              </Suspense>
            </div>
          )}

          {member?.isStaff && (
            <p className="mt-6 text-center font-ui text-sm text-charcoal/60">
              Staff account — you already have full access to all Academy content.
            </p>
          )}

          {!member && (
            <div className="mx-auto mt-6 max-w-md rounded-2xl border border-midnight-navy/10 bg-white p-7 text-center">
              <p className="font-display text-3xl font-semibold text-midnight-navy">
                {formatPrice(plan.month.amount)}
                <span className="font-ui text-base text-charcoal/50">/mo</span>
              </p>
              <p className="mt-1 font-ui text-sm text-charcoal/60">
                or {formatPrice(plan.year.amount)}/year
              </p>
              <ul className="mx-auto mt-5 max-w-sm space-y-2 text-left font-body text-sm text-charcoal/80">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-sage-green">✓</span>{f}</li>
                ))}
              </ul>
              <Link
                href="/academy/signup"
                className="mt-7 inline-block rounded-full bg-midnight-navy px-7 py-3 font-ui text-sm font-medium text-white hover:bg-midnight-navy/90"
              >
                Create your account to enroll
              </Link>
              <p className="mt-3 font-ui text-sm text-midnight-navy/60">
                Already a member?{" "}
                <Link href="/academy/login" className="underline underline-offset-4 hover:text-midnight-navy">Sign in</Link>
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
