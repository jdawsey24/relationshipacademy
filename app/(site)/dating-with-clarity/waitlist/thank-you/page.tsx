import type { Metadata } from "next";
import Link from "next/link";
import SectionLabel from "@/components/site/SectionLabel";
import { CLARITY } from "@/lib/datingWithClarity";

// Where the waitlist form lands.
//
// This was an inline swap inside the form at first, and it was invisible in
// practice: the form is around 860px tall and the confirmation that replaced it
// is a third of that, so the page collapsed under the reader and left her
// looking at the footer. She had joined and had no idea.
//
// A real page fixes that by construction — you cannot be scrolled past a page
// you just navigated to. It is also what the launch package asks for, and it
// gives the launch a URL: a thank-you address is the thing an ad platform can
// count as a conversion, which matters the week traffic arrives from a video.
//
// Reachable on its own, which is fine. The guide is ungated by design, so the
// worst case is somebody gets a free PDF without joining, and the best case is
// that she forwards this link to a friend.

export const metadata: Metadata = {
  title: "You're on the priority list | Dating With Clarity",
  robots: { index: false },   // a step in a flow, not a landing page
};

export default function ClarityWaitlistThankYou() {
  return (
    <div className="mx-auto max-w-2xl px-6 pt-24 pb-24 text-center sm:pt-32">
      <SectionLabel>Founding cohort &middot; September 2026</SectionLabel>
      <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-midnight-navy">
        You&apos;re on the priority list.
      </h1>

      {/* The guide leads. It is the thing she was promised and the only one she
          gets right now, so it is the first thing on the page and the only
          button on it. */}
      <p className="mx-auto mt-6 max-w-md font-body text-lg leading-relaxed text-charcoal/75">
        Here&apos;s your free guide to start with.
      </p>
      <a
        href={CLARITY.guide.href}
        download
        className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-base font-medium text-white transition-colors hover:bg-midnight-navy/90"
      >
        Download {CLARITY.guide.title}
      </a>

      <div className="mx-auto mt-12 max-w-md space-y-4 border-t border-midnight-navy/10 pt-8 font-body text-body leading-relaxed text-charcoal/70">
        <p>
          Your confirmation is on its way. Priority enrollment opens August 17, and the founding
          cohort begins {CLARITY.weeks[0].date.replace(/^\w+, /, "")}.
        </p>
        <p>
          Add admin@notify.relationshiplc.com to your contacts so the enrollment email doesn&apos;t
          get lost.
        </p>
        <p>
          And if you have a minute: reply to the confirmation and tell me the dating decision you
          wish you felt more confident making. I read them.
        </p>
      </div>

      <Link
        href="/"
        className="mt-10 inline-flex min-h-[48px] items-center justify-center font-ui text-sm text-charcoal/55 underline-offset-4 hover:text-midnight-navy hover:underline"
      >
        Back to the site
      </Link>
    </div>
  );
}
