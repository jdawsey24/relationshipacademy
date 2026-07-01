import SectionLabel from "@/components/site/SectionLabel";
import CtaButton from "@/components/site/CtaButton";

export const metadata = {
  title: "The Assessment | Relationship Life Cycle™",
  description:
    "The Relationship Snapshot™ — a free developmental assessment based on the Relationship Life Cycle™ Framework.",
};

const STEPS = [
  { n: "1", title: "Choose your relationship stage", body: "Self-select the structural phase that best describes your relationship right now." },
  { n: "2", title: "Answer 47 developmental questions", body: "Across six domains — about ten minutes." },
  { n: "3", title: "Receive your Relationship Snapshot™", body: "Domain scores, developmental alignment, and personalized insights." },
];

const RECEIVE = [
  "Your Relationship Stage (structural phase)",
  "Developmental Alignment — are you functioning at the level your stage requires?",
  "Deterioration Risk Score",
  "Scores across all 6 domains",
  "A Personalized Development Plan",
];

const FAQ = [
  { q: "Is this a couples assessment or individual?", a: "You take it individually, reflecting on your relationship." },
  { q: "How long does it take?", a: "About 10 minutes." },
  { q: "Is my information private?", a: "Yes. Your responses are never sold or shared." },
  { q: "What's the difference between the Snapshot and the Profile?", a: "The Snapshot is free and provides a broad developmental picture. The Relationship Profile™ is a deeper paid assessment (coming soon)." },
  { q: "Do I need to take it with my partner?", a: "No. Each person takes it individually." },
];

const SAMPLE_DOMAINS = [
  { name: "Communication", score: "4.2", level: "Strength", color: "bg-sage-green" },
  { name: "Trust", score: "3.6", level: "Healthy Development", color: "bg-slate-blue" },
  { name: "Emotional Intimacy", score: "2.9", level: "Growth Opportunity", color: "bg-soft-coral" },
];

export default function AssessmentPage() {
  return (
    <main className="bg-warm-ivory">
      {/* Hero */}
      <section className="px-6 pt-36 pb-16 text-center">
        <div className="mx-auto max-w-3xl">
          <SectionLabel className="mb-4">The Relationship Snapshot™</SectionLabel>
          <h1 className="font-display text-[40px] font-semibold leading-[1.05] text-midnight-navy sm:text-5xl">
            A free developmental assessment based on the Relationship Life Cycle™ Framework.
          </h1>
          <p className="mx-auto mt-6 max-w-[600px] font-body text-lg leading-relaxed text-charcoal">
            Not a personality quiz. A developmental measurement — built on clinical research and the six universal domains of relational functioning.
          </p>
          <div className="mt-8"><CtaButton href="/snapshot/intro">Take the Free Snapshot</CtaButton></div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-display text-3xl font-semibold text-midnight-navy">How It Works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-xl border border-light-gray bg-white p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-midnight-navy font-ui text-sm font-semibold text-white">{s.n}</span>
                <h3 className="mt-4 font-display text-lg font-semibold text-midnight-navy">{s.title}</h3>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-charcoal">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Receive */}
      <section className="bg-[#FBF9F5] px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">What You&apos;ll Receive</h2>
          <ul className="mt-6 flex flex-col gap-3">
            {RECEIVE.map((r) => (
              <li key={r} className="flex items-start gap-3 font-body text-charcoal">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-green/20 text-xs text-sage-green">✓</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sample Results */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-3xl font-semibold text-midnight-navy">Sample Results</h2>
            <span className="font-ui text-xs uppercase tracking-wide text-charcoal/50">Example — not real results</span>
          </div>
          <div className="mt-6 rounded-2xl border border-light-gray bg-white p-6">
            <div className="rounded-xl bg-plum/10 p-4 text-center">
              <p className="font-ui text-[11px] uppercase tracking-wide text-charcoal/60">Your Relationship Stage</p>
              <p className="font-display text-2xl font-semibold text-plum">Choosing Each Other Intentionally</p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="rounded-full bg-sage-green px-4 py-1.5 font-ui text-sm font-semibold text-white">Congruent</span>
              <span className="font-body text-sm text-charcoal/70">Developmental Alignment</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {SAMPLE_DOMAINS.map((d) => (
                <div key={d.name} className="rounded-xl border border-light-gray p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-base font-semibold text-midnight-navy">{d.name}</span>
                    <span className="font-ui text-xl font-semibold text-midnight-navy">{d.score}</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-light-gray">
                    <div className={`h-full rounded-full ${d.color}`} style={{ width: `${(parseFloat(d.score) / 5) * 100}%` }} />
                  </div>
                  <span className="mt-2 inline-block font-ui text-[11px] text-charcoal/60">{d.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About the Assessment */}
      <section className="bg-[#FBF9F5] px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">About the Assessment</h2>
          <p className="mt-4 font-body text-base leading-relaxed text-charcoal">
            The Relationship Snapshot™ is built on the Relationship Life Cycle™ Framework&apos;s six universal domains. Each item in the assessment was developed to measure observable developmental behaviors — not personality traits or relationship satisfaction. The result is a developmental picture of where your relationship is functioning right now.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">Frequently Asked Questions</h2>
          <div className="mt-6 divide-y divide-light-gray">
            {FAQ.map((f) => (
              <div key={f.q} className="py-5">
                <h3 className="font-display text-lg font-semibold text-midnight-navy">{f.q}</h3>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-charcoal">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-midnight-navy px-6 py-16 text-center text-white">
        <h2 className="font-display text-3xl font-semibold">Begin your Relationship Snapshot™</h2>
        <div className="mt-6"><CtaButton href="/snapshot/intro" variant="accent">Take the Free Snapshot</CtaButton></div>
      </section>
    </main>
  );
}
