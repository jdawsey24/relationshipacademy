import SectionLabel from "@/components/site/SectionLabel";
import CtaButton from "@/components/site/CtaButton";
import PhaseCard from "@/components/site/PhaseCard";
import DomainCard from "@/components/site/DomainCard";
import PhaseCycle from "@/components/site/PhaseCycle";
import {
  PHASES,
  DOMAINS_CONTENT,
  PRINCIPLES,
  FRAMEWORK_OVERVIEW,
} from "@/lib/frameworkContent";
import { classesFor } from "@/lib/phases";

export const metadata = {
  title: "The Framework | Relationship Life Cycle™",
  description:
    "The Relationship Life Cycle™ is a developmental framework for understanding how relationships grow, evolve, and change.",
};

export default function FrameworkPage() {
  return (
    <main className="bg-warm-ivory">
      {/* Hero */}
      <section className="px-6 pt-36 pb-16 text-center">
        <div className="mx-auto max-w-3xl">
          <SectionLabel className="mb-4">The Relationship Life Cycle™ Framework</SectionLabel>
          <h1 className="font-display text-[44px] font-semibold leading-[1.05] text-midnight-navy sm:text-6xl">
            Relationships have seasons. This is the map.
          </h1>
          <p className="mx-auto mt-6 max-w-[580px] font-body text-lg leading-relaxed text-charcoal">
            The Relationship Life Cycle™ is a developmental framework for understanding how relationships grow, evolve, and change — built on the principle that every phase of a relationship has a distinct purpose, task, and set of opportunities.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">
            What is the Relationship Life Cycle™?
          </h2>
          <div className="mt-6 space-y-4">
            {FRAMEWORK_OVERVIEW.map((p, i) => (
              <p key={i} className="font-body text-base leading-relaxed text-charcoal">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">Core Principles of the Framework</h2>
          <div className="mt-8 space-y-4">
            {PRINCIPLES.map((p) => {
              const c = classesFor(p.color);
              return (
                <div key={p.title} className={`rounded-r-lg border-l-4 ${c.border} bg-white py-4 pl-5 pr-4`}>
                  <h3 className="font-display text-xl font-semibold text-midnight-navy">{p.title}</h3>
                  <p className="mt-1 font-body text-[15px] leading-relaxed text-charcoal">{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Phase Cycle Visualization */}
      <section className="bg-[#FBF9F5] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel className="mb-3">The Cycle</SectionLabel>
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">Six phases, one continuous journey.</h2>
          <p className="mx-auto mt-4 max-w-[580px] font-body text-[16px] leading-relaxed text-charcoal">
            Select any phase to explore its purpose, developmental task, and opportunities.
          </p>
          <div className="mt-10">
            <PhaseCycle />
          </div>
        </div>
      </section>

      {/* Six Phases */}
      <section id="phases" className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-midnight-navy">The Six Developmental Phases</h2>
            <p className="mt-3 font-body text-[16px] leading-relaxed text-charcoal">
              Each phase of the Relationship Life Cycle™ has a distinct purpose, a primary developmental task, and a set of competencies associated with healthy progression.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PHASES.map((p) => (
              <PhaseCard key={p.slug} number={p.number} name={p.name} task={p.task} description={p.cardDescription} color={p.color} href={`/framework/phases/${p.slug}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Six Domains */}
      <section className="bg-[#FBF9F5] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-midnight-navy">The Six Universal Domains</h2>
            <p className="mt-3 font-body text-[16px] leading-relaxed text-charcoal">
              The Relationship Life Cycle™ measures relational functioning across six universal domains — present throughout every phase of the relationship, but evaluated differently depending on where the relationship is developmentally.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DOMAINS_CONTENT.map((d) => (
              <DomainCard key={d.name} name={d.name} description={d.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Seasons Metaphor */}
      <section className="bg-midnight-navy px-6 py-24 text-center text-white">
        <figure className="mx-auto max-w-3xl">
          <blockquote className="font-display text-2xl leading-relaxed sm:text-3xl">
            “Spring is not better than winter. Summer is not more important than autumn. Each season serves a different purpose. Likewise, each phase of relationship development serves a different purpose.”
          </blockquote>
          <figcaption className="mt-6 font-ui text-sm uppercase tracking-wide text-white/60">
            — Relationship Life Cycle™ Framework
          </figcaption>
        </figure>
      </section>

      {/* Assessment CTA */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">Ready to see where your relationship is?</h2>
          <p className="mx-auto mt-4 max-w-[560px] font-body text-[16px] leading-relaxed text-charcoal">
            The Relationship Snapshot™ measures your relationship&apos;s developmental functioning across all six domains.
          </p>
          <div className="mt-8">
            <CtaButton href="/snapshot/intro" variant="primary">Take the Free Snapshot</CtaButton>
          </div>
        </div>
      </section>
    </main>
  );
}
