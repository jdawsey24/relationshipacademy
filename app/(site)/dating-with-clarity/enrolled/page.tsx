import type { Metadata } from "next";
import Link from "next/link";
import SectionLabel from "@/components/site/SectionLabel";
import { CLARITY } from "@/lib/datingWithClarity";
import { getSupabaseAdminClient } from "@/lib/supabase";

// Where Stripe returns after payment.
//
// The webhook is what confirms the seat, and it can land a second or two after
// the redirect. So this page reads the enrolment row rather than assuming, and
// says "we're confirming" instead of "you're in" when the row is not paid yet.
// Telling someone she has a seat before the payment has settled is the one
// thing this page must not do.

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "You're enrolled — Dating With Clarity",
  robots: { index: false },
};

async function statusFor(sessionId: string | undefined): Promise<"paid" | "pending" | "unknown"> {
  if (!sessionId) return "unknown";
  try {
    const { data } = await getSupabaseAdminClient()
      .from("eyes_open_enrolments").select("status").eq("stripe_session_id", sessionId).maybeSingle();
    const s = (data as { status?: string } | null)?.status;
    return s === "paid" ? "paid" : s ? "pending" : "unknown";
  } catch {
    return "unknown";
  }
}

export default async function EnrolledPage({
  searchParams,
}: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const status = await statusFor(session_id);

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <SectionLabel>{status === "paid" ? "You're enrolled" : "Almost there"}</SectionLabel>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-midnight-navy">
        {status === "paid" ? "Your seat is confirmed" : "We're confirming your payment"}
      </h1>

      {status === "paid" ? (
        <p className="mx-auto mt-5 max-w-lg font-body text-lg leading-relaxed text-charcoal/75">
          A confirmation is on its way with all four dates. Your joining link arrives closer to
          the first class — nothing else is needed from you before then.
        </p>
      ) : (
        <p className="mx-auto mt-5 max-w-lg font-body text-lg leading-relaxed text-charcoal/75">
          This takes a moment to settle. Your confirmation email will arrive shortly — if it
          hasn&apos;t within a few minutes, reply to any email from us and we&apos;ll sort it out.
        </p>
      )}

      <div className="mx-auto mt-10 max-w-md divide-y divide-midnight-navy/10 rounded-2xl border border-midnight-navy/10 bg-white text-left">
        {CLARITY.weeks.map((w, i) => (
          <div key={w.title} className="px-6 py-4">
            <p className="font-ui text-eyebrow font-semibold uppercase text-charcoal/50">Week {i + 1}</p>
            <p className="mt-1 font-display text-lg font-semibold text-midnight-navy">{w.title}</p>
            <p className="font-body text-sm text-charcoal/60">{w.date} &middot; {CLARITY.time} ET</p>
          </div>
        ))}
      </div>

      <p className="mt-10 font-body text-body text-charcoal/70">
        Worth putting in your calendar now — all four run {CLARITY.time} ET.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-full border border-midnight-navy px-8 font-ui text-base font-medium text-midnight-navy hover:bg-midnight-navy hover:text-white"
      >
        Back to the site
      </Link>
    </div>
  );
}
