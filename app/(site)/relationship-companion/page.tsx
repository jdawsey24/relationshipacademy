import type { Metadata } from "next";
import SectionLabel from "@/components/site/SectionLabel";
import CtaButton from "@/components/site/CtaButton";

export const metadata: Metadata = {
  title: "The Relationship Companion™ | Relationship Life Cycle™",
  description:
    "A private, guided space to work through what you're navigating in your relationship — one situation at a time. Built on the Relationship Life Cycle™ framework by Janelle Dawsey, LMFT.",
};

const STEPS = [
  { n: "1", title: "Tell it where you are", body: "Pick the situation you're actually facing — a hard conversation, a decision, a pattern you keep hitting." },
  { n: "2", title: "Work through a guided reflection", body: "A short, structured reflection helps you slow down, see it clearly, and figure out what you want — at your own pace." },
  { n: "3", title: "Keep what matters", body: "Your reflections, your Blueprint, and your plans stay private and build over time — so you can come back whenever you need." },
];

const INSIDE = [
  { title: "Guided reflections", body: "A private, judgment-free walkthrough for the situation you're in — grounded in the Relationship Life Cycle™ framework, not generic advice." },
  { title: "Your Relationship Blueprint™", body: "A living picture of what matters to you — your values, boundaries, and what you're looking for — that you fill in gradually." },
  { title: "Conversation Planner", body: "Prepare for a conversation that matters: what you want understood, what you want to ask, and how to say it." },
  { title: "Your private Journey", body: "Everything you've worked through, saved and searchable — a record of your own growth that's yours alone." },
];

const FAQ = [
  { q: "Is this therapy?", a: "No. The Relationship Companion is a private, educational tool for reflection and intentional decision-making. It isn't therapy, diagnosis, or crisis care, and it doesn't make decisions for you." },
  { q: "Is it private?", a: "Yes. Your reflections and entries are private to you. It's built privacy-first — your personal content is never used as marketing." },
  { q: "Do I need to download an app?", a: "No app store needed. It opens right in your browser, and you can add it to your phone's Home Screen so it works just like an app." },
  { q: "How much is it?", a: "It's a one-time purchase of $19.99 — or $9.99 if you already own a Relationship Playbook™ or an active Academy membership. No subscription." },
  { q: "How often do I use it?", a: "However often you like. There's no schedule to keep and nothing daily — come when you're navigating something and want to think it through." },
];

export default function RelationshipCompanionPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-14">
      {/* Hero */}
      <section className="text-center">
        <SectionLabel>The Relationship Companion&trade;</SectionLabel>
        <h1 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight text-midnight-navy sm:text-5xl">
          A private space to work through what you&apos;re navigating
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance font-body text-lg leading-relaxed text-charcoal/75">
          One situation at a time, at your own pace. Guided reflections built on the Relationship Life Cycle&trade; framework — so you can move through hard moments with more clarity and make choices that feel like yours.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <CtaButton href="/companion">Get the Companion — $19.99</CtaButton>
          <p className="font-body text-sm text-charcoal/50">One-time purchase · $9.99 for Playbook &amp; Academy members</p>
        </div>
      </section>

      {/* What it is */}
      <section className="mt-20 rounded-3xl bg-white/70 p-8 sm:p-12">
        <SectionLabel tone="sage">What it is</SectionLabel>
        <p className="mt-4 text-balance font-display text-2xl font-medium leading-relaxed text-midnight-navy sm:text-[28px]">
          Not another advice app. A calm, private place to think — designed around the real situations relationships actually bring.
        </p>
        <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-charcoal/75">
          Instead of generic tips, the Companion meets you where you are: you choose what you&apos;re facing, and it walks you through a short, structured reflection to help you understand it and decide what you want to do next. It&apos;s educational — a tool for your own thinking, developed by Janelle Dawsey, LMFT.
        </p>
      </section>

      {/* How it works */}
      <section className="mt-20">
        <div className="text-center">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">Three simple steps</h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-2xl border border-midnight-navy/10 bg-white p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-midnight-navy font-ui text-sm font-semibold text-white">{s.n}</span>
              <h3 className="mt-4 font-display text-xl font-semibold text-midnight-navy">{s.title}</h3>
              <p className="mt-2 font-body text-[15px] leading-relaxed text-charcoal/70">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What's inside */}
      <section className="mt-20">
        <div className="text-center">
          <SectionLabel>What&apos;s inside</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">Everything in one private place</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {INSIDE.map((f) => (
            <div key={f.title} className="rounded-2xl border border-midnight-navy/10 bg-white p-6">
              <h3 className="font-display text-xl font-semibold text-midnight-navy">{f.title}</h3>
              <p className="mt-2 font-body text-[15px] leading-relaxed text-charcoal/70">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Boundary / trust */}
      <section className="mt-20 rounded-3xl bg-midnight-navy px-8 py-12 text-center text-white sm:px-12">
        <SectionLabel tone="white">A note on what this is</SectionLabel>
        <p className="mx-auto mt-4 max-w-2xl text-balance font-display text-2xl font-medium leading-relaxed">
          The Companion is a private, educational tool — not therapy, diagnosis, or crisis care.
        </p>
        <p className="mx-auto mt-4 max-w-xl font-body text-[15px] leading-relaxed text-white/75">
          It supports your reflection and respects your autonomy; it never decides for you. If you&apos;re in crisis, it points you to real resources and support.
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-20">
        <div className="text-center">
          <SectionLabel>Questions</SectionLabel>
          <h2 className="mt-3 font-display text-3xl font-semibold text-midnight-navy">Good to know</h2>
        </div>
        <div className="mx-auto mt-10 max-w-2xl divide-y divide-midnight-navy/10">
          {FAQ.map((f) => (
            <div key={f.q} className="py-5">
              <h3 className="font-display text-lg font-semibold text-midnight-navy">{f.q}</h3>
              <p className="mt-2 font-body text-[15px] leading-relaxed text-charcoal/75">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-20 text-center">
        <h2 className="text-balance font-display text-3xl font-semibold text-midnight-navy">Give yourself a place to think it through</h2>
        <div className="mt-8 flex flex-col items-center gap-3">
          <CtaButton href="/companion">Get the Companion — $19.99</CtaButton>
          <p className="font-body text-sm text-charcoal/50">One-time purchase · Private · Opens in your browser</p>
        </div>
      </section>
    </main>
  );
}
