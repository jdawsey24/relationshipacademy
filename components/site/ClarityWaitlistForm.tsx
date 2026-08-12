"use client";

import { useState } from "react";
import Turnstile, { turnstileEnabled } from "@/components/site/Turnstile";

// The priority-waitlist form.
//
// Only the email is required. The four questions after it are the ones the
// launch package asks, and they exist to shape the first class rather than to
// qualify anybody out, so none of them blocks the signup. A woman who answers
// only the email is still on the list.
//
// Deliberately NOT a payment step: this page has no checkout on it at all.

const ATTEND = [
  "Yes, Thursday evenings work",
  "Most of them",
  "I'm not sure yet",
];

const STATUS = [
  "Actively dating",
  "Taking a break from dating",
  "Getting ready to date again",
  "Seeing someone right now",
  "Something else",
];

const input =
  "min-h-[48px] w-full rounded-lg border border-light-gray bg-white px-4 font-ui text-base text-charcoal outline-none focus:border-midnight-navy";
const label = "block font-ui text-sm font-medium text-charcoal/70";

export default function ClarityWaitlistForm({ classTime, guideTitle, guideHref }: {
  classTime: string; guideTitle: string; guideHref: string;
}) {
  const [v, setV] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState("");

  const set = (k: string, value: string) => setV((prev) => ({ ...prev, [k]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const email = (v.email ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (turnstileEnabled && !token) {
      setError("Please complete the verification.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/dating-with-clarity/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: v.first_name,
          dating_status: v.dating_status,
          hardest_part: v.hardest_part,
          confidence_goal: v.confidence_goal,
          can_attend: v.can_attend,
          turnstile_token: token,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
    } catch {
      setStatus("idle");
      setError("Something went wrong. Please try again.");
      // Turnstile tokens are single-use, so a retry needs a fresh one.
      if (turnstileEnabled) {
        window.turnstile?.reset();
        setToken("");
      }
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-sage-green/40 bg-sage-green/10 p-8 text-center">
        <p className="font-display text-2xl font-semibold text-midnight-navy">
          You&apos;re on the priority list.
        </p>

        {/*
          The guide leads, because this screen is the only moment she is
          definitely still here. Two seconds after submitting, no inbox in the
          way. The email repeats the link for when she closes the tab.
        */}
        <p className="mx-auto mt-4 max-w-md font-body text-body leading-relaxed text-charcoal/75">
          Here&apos;s your free guide to start with.
        </p>
        <a
          href={guideHref}
          download
          className="mt-4 inline-flex min-h-[52px] items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-base font-medium text-white transition-colors hover:bg-midnight-navy/90"
        >
          Download {guideTitle}
        </a>

        <p className="mx-auto mt-6 max-w-md font-body text-sm leading-relaxed text-charcoal/60">
          Your confirmation is on its way too. Priority enrollment opens August 17, and the founding
          cohort begins September 3.
        </p>
        <p className="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-charcoal/60">
          Add admin@notify.relationshiplc.com to your contacts so the enrollment email does not get
          lost. And if you have a minute, reply to the confirmation and tell me the dating decision
          you wish you felt more confident making. I read them.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <label className={label}>
        First name
        <input
          value={v.first_name ?? ""} onChange={(e) => set("first_name", e.target.value)}
          autoComplete="given-name" className={`mt-1.5 ${input}`}
        />
      </label>

      <label className={label}>
        Email address
        <input
          type="email" required value={v.email ?? ""} onChange={(e) => set("email", e.target.value)}
          autoComplete="email" className={`mt-1.5 ${input}`}
        />
      </label>

      <label className={label}>
        Where you are with dating right now
        <select
          value={v.dating_status ?? ""} onChange={(e) => set("dating_status", e.target.value)}
          className={`mt-1.5 ${input}`}
        >
          <option value="">Prefer not to say</option>
          {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>

      <label className={label}>
        What feels most confusing or difficult about dating right now?
        <textarea
          rows={3} value={v.hardest_part ?? ""} onChange={(e) => set("hardest_part", e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-light-gray bg-white px-4 py-3 font-ui text-base text-charcoal outline-none focus:border-midnight-navy"
        />
      </label>

      <label className={label}>
        What would you like to feel more confident doing?
        <textarea
          rows={3} value={v.confidence_goal ?? ""} onChange={(e) => set("confidence_goal", e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-light-gray bg-white px-4 py-3 font-ui text-base text-charcoal outline-none focus:border-midnight-navy"
        />
      </label>

      <label className={label}>
        Can you attend Thursday evenings, {classTime} ET?
        <select
          value={v.can_attend ?? ""} onChange={(e) => set("can_attend", e.target.value)}
          className={`mt-1.5 ${input}`}
        >
          <option value="">Prefer not to say</option>
          {ATTEND.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </label>

      <Turnstile onToken={setToken} />

      {error && <p className="font-body text-sm text-coral-rose">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-base font-medium text-white transition-colors hover:bg-midnight-navy/90 disabled:opacity-50"
      >
        {status === "sending" ? "Adding you…" : "Join the priority waitlist"}
      </button>

      <p className="font-body text-xs leading-relaxed text-charcoal/55">
        Joining the waitlist does not require payment and does not guarantee enrollment. You can
        unsubscribe from any email.
      </p>
    </form>
  );
}
