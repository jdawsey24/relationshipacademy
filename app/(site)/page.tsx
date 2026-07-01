import Link from "next/link";
import Logo from "@/components/Logo";
import SectionLabel from "@/components/site/SectionLabel";
import CtaButton from "@/components/site/CtaButton";
import PhaseCard from "@/components/site/PhaseCard";
import { PHASES } from "@/lib/frameworkContent";

const FEATURES = [
  { title: "Six Developmental Phases", body: "Every relationship moves through phases — each with its own purpose, task, and opportunities.", icon: "phases" },
  { title: "Six Universal Domains", body: "Relational functioning is measured across six domains present in every phase.", icon: "domains" },
  { title: "Developmental Assessment", body: "The Relationship Snapshot™ shows where your relationship is functioning right now.", icon: "assessment" },
] as const;

function FeatureIcon({ kind }: { kind: string }) {
  const common = { width: 32, height: 32, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "phases")
    return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /></svg>);
  if (kind === "domains")
    return (<svg {...common}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>);
  return (<svg {...common}><path d="M4 19V5M4 19h16M8 15l3-4 3 3 4-6" /></svg>);
}

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-warm-ivory px-6 pt-24 text-center">
        <Logo variant="full" className="mb-10 h-16 sm:h-20" />
        <SectionLabel tone="sage" className="mb-4">Introducing the</SectionLabel>
        <h1 className="font-display text-[40px] font-semibold leading-[1.05] text-midnight-navy sm:text-6xl">
          The Relationship Life Cycle&trade;
        </h1>
        <p className="mt-6 max-w-[600px] font-body text-lg leading-relaxed text-charcoal sm:text-xl">
          A developmental framework for understanding how relationships grow, change, and evolve — built by a licensed therapist, grounded in relationship science.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <CtaButton href="/framework" variant="primary">Explore the Framework</CtaButton>
          <CtaButton href="/snapshot/intro" variant="secondary">Take the Free Assessment</CtaButton>
        </div>
        <span className="mt-16 animate-bounce text-midnight-navy/40" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
        </span>
      </section>

      {/* Framework Overview */}
      <section className="bg-warm-ivory px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <SectionLabel className="mb-3">The Framework</SectionLabel>
          <h2 className="font-display text-4xl font-semibold text-midnight-navy">
            Relationships don&apos;t just happen. They develop.
          </h2>
          <p className="mx-auto mt-6 max-w-[680px] font-body text-[17px] leading-relaxed text-charcoal">
            Most people are taught how to start relationships. Very few are taught how relationships actually develop. The Relationship Life Cycle™ changes that — by providing a map for where you are, what your relationship needs, and what comes next.
          </p>
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center">
                <span className="text-midnight-navy"><FeatureIcon kind={f.icon} /></span>
                <h3 className="mt-4 font-display text-xl font-semibold text-midnight-navy">{f.title}</h3>
                <p className="mt-2 max-w-[240px] font-body text-[15px] leading-relaxed text-charcoal">{f.body}</p>
              </div>
            ))}
          </div>
          <Link href="/framework" className="mt-12 inline-flex items-center gap-1 font-ui text-sm font-medium text-midnight-navy hover:gap-2 transition-all">
            Learn About the Framework <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* The Six Phases */}
      <section id="phases" className="bg-[#FBF9F5] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <SectionLabel className="mb-3">The Six Phases</SectionLabel>
            <h2 className="font-display text-4xl font-semibold text-midnight-navy">Every relationship has a season.</h2>
            <p className="mx-auto mt-4 max-w-[680px] font-body text-[17px] leading-relaxed text-charcoal">
              The Relationship Life Cycle™ identifies six developmental phases, each with its own purpose, tasks, and opportunities.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PHASES.map((p) => (
              <PhaseCard key={p.slug} number={p.number} name={p.name} task={p.task} description={p.cardDescription} color={p.color} href={`/framework/phases/${p.slug}`} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <CtaButton href="/framework#phases" variant="secondary">Explore All Six Phases</CtaButton>
          </div>
        </div>
      </section>

      {/* Why Development Matters */}
      <section className="bg-midnight-navy px-6 py-24 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <Logo variant="mark" className="mb-8 h-10" />
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Most relationship problems aren&apos;t caused by bad people. They&apos;re caused by developmental mismatches.
          </h2>
          <p className="mx-auto mt-6 max-w-[680px] font-body text-[17px] leading-relaxed text-white/85">
            When someone in Exploration expects the certainty of Expansion, there&apos;s a mismatch. When a couple in Expansion tries to operate with the emotional distance of Exploration, there&apos;s a mismatch. The Relationship Life Cycle™ gives people a language for what&apos;s actually happening — and what to do about it.
          </p>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[["6 Phases", "One continuous developmental journey"], ["6 Domains", "Measured across every phase"], ["1 Framework", "Built for real relationships"]].map(([n, l]) => (
              <div key={n}>
                <p className="font-display text-5xl font-semibold text-soft-coral">{n}</p>
                <p className="mt-2 font-body text-sm text-white/80">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment */}
      <section className="bg-warm-ivory px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel className="mb-3">The Relationship Snapshot&trade;</SectionLabel>
          <h2 className="font-display text-4xl font-semibold text-midnight-navy">Know where you are. Know what you need.</h2>
          <p className="mx-auto mt-4 max-w-[680px] font-body text-[17px] leading-relaxed text-charcoal">
            The Relationship Snapshot™ is a free developmental assessment based on the Relationship Life Cycle™ Framework. It measures how your relationship is functioning across six key domains — and compares that to your current developmental phase.
          </p>
          <ul className="mx-auto mt-8 flex max-w-xl flex-col gap-3 text-left">
            {["Free and takes about 10 minutes", "Results across 6 relational domains", "Personalized developmental insights"].map((b) => (
              <li key={b} className="flex items-center gap-3 font-body text-charcoal">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-green/20 text-sage-green">✓</span>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-center gap-3">
            <CtaButton href="/snapshot/intro" variant="primary">Take the Free Snapshot</CtaButton>
            <Link href="/assessment" className="font-ui text-sm text-midnight-navy underline underline-offset-4">Learn more about the assessment</Link>
          </div>
        </div>
      </section>

      {/* For Professionals */}
      <section className="bg-[#F2F5F2] px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel className="mb-3">For Professionals</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">
            Built for clinicians. Designed for every relationship.
          </h2>
          <p className="mx-auto mt-4 max-w-[680px] font-body text-[17px] leading-relaxed text-charcoal">
            The Relationship Life Cycle™ Framework is being used by therapists, coaches, attorneys, healthcare providers, and organizations to bring developmental clarity to the relationships they serve.
          </p>
          <div className="mt-8">
            <CtaButton href="/professionals" variant="secondary">Explore Professional Resources</CtaButton>
          </div>
        </div>
      </section>

      {/* Community / Academy */}
      <section className="bg-midnight-navy px-6 py-24 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">The Relationship Academy</h2>
          <p className="mx-auto mt-4 max-w-[600px] font-body text-[17px] leading-relaxed text-white/85">
            A community for people who want to understand and strengthen their relationships — guided by the Relationship Life Cycle™ Framework.
          </p>
          <div className="mt-8">
            <CtaButton href="https://skool.com/relationship-academy" variant="accent" external>
              Join The Relationship Academy
            </CtaButton>
          </div>
        </div>
      </section>
    </main>
  );
}
