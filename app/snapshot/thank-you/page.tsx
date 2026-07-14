"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import CtaButton from "@/components/site/CtaButton";
import { ACADEMY_URL } from "@/lib/flagship";

// Post-assessment next-step page. Confirms the results + email series, and makes
// the primary Academy conversion pitch. Reached from the results page and linked
// from the email sequence. Personalizes by ?name= (optional) and keeps a link
// back to the results via ?attempt=.

function ThankYouInner() {
  const params = useSearchParams();
  const name = (params.get("name") || "").trim();
  const attempt = params.get("attempt");

  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <header className="mb-10 text-center"><Logo variant="full" href="/" className="mx-auto h-11" /></header>

      <section className="text-center">
        <p className="font-ui text-xs uppercase tracking-wide text-charcoal/50">Thank you{name ? `, ${name}` : ""}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-midnight-navy sm:text-5xl">Your snapshot is complete.</h1>
        <p className="mx-auto mt-5 max-w-lg font-body text-lg leading-relaxed text-charcoal/80">
          A copy of your results — plus a short series to help you put them into practice — is on its way to your inbox.
        </p>
        {attempt && (
          <p className="mt-4">
            <Link href={`/snapshot/results?attempt=${attempt}`} className="font-ui text-sm text-midnight-navy underline underline-offset-4 hover:opacity-80">
              View your results again
            </Link>
          </p>
        )}
      </section>

      {/* Primary Academy conversion */}
      <section className="mt-12 rounded-2xl bg-midnight-navy px-6 py-10 text-center text-white">
        <p className="font-ui text-xs uppercase tracking-wide text-white/60">Your next step</p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Keep growing with the Academy</h2>
        <p className="mx-auto mt-4 max-w-xl font-body text-[17px] leading-relaxed text-white/85">
          Your snapshot shows where your relationship is today. The Relationship Academy is where you build on it — guided
          lessons, live sessions, and a supportive community organized around the same framework, so you can strengthen the
          areas that matter most.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <CtaButton href={ACADEMY_URL} variant="accent" external>Join The Relationship Academy</CtaButton>
          <Link href="/framework" className="font-ui text-sm text-white/75 underline underline-offset-4 hover:text-white">
            Explore the framework first
          </Link>
        </div>
      </section>

      <footer className="mt-12 flex flex-col items-center gap-2 border-t border-light-gray pt-8 text-center">
        <p className="font-body text-sm text-charcoal/60">Developed by Janelle Dawsey, LMFT · Relationship Life Cycle&trade;</p>
      </footer>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center px-6"><p className="text-charcoal/60">Loading…</p></main>}>
      <ThankYouInner />
    </Suspense>
  );
}
