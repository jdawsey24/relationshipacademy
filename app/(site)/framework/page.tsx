import SectionLabel from "@/components/site/SectionLabel";
import CtaButton from "@/components/site/CtaButton";
import PhaseCard from "@/components/site/PhaseCard";
import DomainCard from "@/components/site/DomainCard";
import PhaseCycle from "@/components/site/PhaseCycle";
import { PRINCIPLES } from "@/lib/frameworkContent";
import { classesFor } from "@/lib/phases";
import { getSiteContentMap, get, applyPhaseOverrides, applyDomainOverrides } from "@/lib/siteContent";

export const metadata = {
  title: "The Framework | Relationship Life Cycle™",
  description:
    "Every relationship has different needs at different points in its journey. The Relationship Life Cycle™ gives you the context to understand where you are.",
};

export const revalidate = 60;

export default async function FrameworkPage() {
  const content = await getSiteContentMap();
  const phases = applyPhaseOverrides(content);
  const domains = applyDomainOverrides(content);
  return (
    <main className="bg-warm-ivory">
      {/* Hero */}
      <section className="px-6 pt-36 pb-16 text-center">
        <div className="mx-auto max-w-3xl">
          <SectionLabel className="mb-4">{get(content, "framework.hero.eyebrow", "The Relationship Life Cycle™ Framework")}</SectionLabel>
          <h1 className="font-display text-[44px] font-semibold leading-[1.05] text-midnight-navy sm:text-6xl">
            {get(content, "framework.hero.headline", "Relationships have seasons. This is the map.")}
          </h1>
          <p className="mx-auto mt-6 max-w-[560px] font-body text-lg leading-relaxed text-charcoal">
            {get(content, "framework.hero.subhead", "Every relationship has different needs at different points in its journey. The Relationship Life Cycle™ gives you the context to understand where you are — and what comes next.")}
          </p>
        </div>
      </section>

      {/* The Problem — before the definition */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-[44px] sm:leading-tight">
            We don&apos;t have a shortage of relationship advice.
          </h2>
          <div className="mx-auto mt-6 max-w-[680px] space-y-4 text-left font-body text-[17px] leading-relaxed text-charcoal">
            <p>We&apos;re surrounded by conversations about communication, attachment, trust, conflict, boundaries, dating, marriage, divorce, healing, and countless other relationship topics. Most of it is useful. Most of it is true.</p>
            <p>The problem isn&apos;t that the advice is wrong. The problem is that it&apos;s often taught in isolation — as though each relationship challenge exists independently from the larger journey.</p>
            <p>A couple struggling with conflict doesn&apos;t necessarily have a conflict problem. They may have never built the foundation that allows them to navigate conflict together. A person who keeps choosing the wrong partners may not need dating advice. They may need a clearer understanding of what the early stages of a relationship are actually supposed to accomplish.</p>
            <p>The Relationship Life Cycle™ was created to provide the context that makes everything else make more sense.</p>
          </div>
        </div>
      </section>

      {/* Framework Definition */}
      <section className="bg-[#FBF9F5] px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-display text-3xl font-semibold text-midnight-navy sm:text-[44px]">
            What is the Relationship Life Cycle™?
          </h2>
          <div className="mx-auto mt-6 max-w-[680px] space-y-4 font-body text-[17px] leading-relaxed text-charcoal">
            <p>The Relationship Life Cycle™ is a developmental framework for understanding how relationships grow, change, and evolve over time.</p>
            <p>It&apos;s built on a simple but powerful idea: relationships are not static. They develop. The needs of a relationship in its earliest stages are not the same as its needs five years later. The skills required after a breakup are different from those needed at the beginning of a new relationship.</p>
            <p>Most relationship advice treats these as separate conversations. The Relationship Life Cycle™ brings them together into one developmental framework — organized around six phases, six universal areas of focus, and the idea that every phase serves a specific purpose in the larger journey.</p>
          </div>
        </div>
      </section>

      {/* Why This Matters + throughline pull quote */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">
            Why developmental context changes everything.
          </h2>
          <div className="mt-6 space-y-4 font-body text-[17px] leading-relaxed text-charcoal">
            <p>After years of clinical practice, a pattern became impossible to ignore. The resentment, the distance, the feeling that couples had somehow failed each other — it rarely started where they thought it did.</p>
            <p>Most of the time, the relationship had simply outpaced itself. They&apos;d moved forward without building what they needed to carry them through. Not because they didn&apos;t love each other. Because nobody ever showed them what that foundation was supposed to look like — or when they needed to build it.</p>
            <p>Sometimes the challenge isn&apos;t the relationship. It&apos;s trying to solve today&apos;s problems with yesterday&apos;s expectations — or tomorrow&apos;s expectations applied too soon.</p>
            <p>The Relationship Life Cycle™ gives people the map they were never given.</p>
          </div>
        </div>
      </section>
      <section className="bg-midnight-navy px-6 py-20 text-center text-white">
        <blockquote className="mx-auto max-w-3xl font-display text-2xl leading-relaxed sm:text-3xl">
          “Every relationship has different needs at different points in its journey. The first step is understanding where you are.”
        </blockquote>
      </section>

      {/* Core Principles */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">How the framework works.</h2>
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

      {/* Six Phases */}
      <section id="phases" className="bg-[#FBF9F5] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-[44px]">
              The six phases of the Relationship Life Cycle™
            </h2>
            <p className="mx-auto mt-4 max-w-[680px] font-body text-[17px] leading-relaxed text-charcoal">
              Each phase has a distinct purpose, a primary focus, and a set of skills and experiences associated with healthy progression.
            </p>
          </div>
          <div className="mt-10">
            <PhaseCycle />
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {phases.map((p) => (
              <PhaseCard key={p.slug} number={p.number} name={p.name} primaryFocus={p.primaryFocus} task={p.task} description={p.cardDescription} color={p.color} href={`/framework/phases/${p.slug}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Six Areas of Focus */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">Six areas. Every phase.</h2>
            <p className="mt-4 font-body text-[17px] leading-relaxed text-charcoal">
              Every relationship expresses itself through six key areas — communication, trust, emotional connection, how conflict is handled, how responsibilities are shared, and physical intimacy. These areas are present throughout every phase of the relationship. But what they look like — and what they require — changes as the relationship develops.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((d) => (
              <DomainCard key={d.slug} name={d.name} description={d.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Seasons pull quote */}
      <section className="bg-midnight-navy px-6 py-24 text-center text-white">
        <figure className="mx-auto max-w-3xl">
          <blockquote className="font-display text-2xl leading-relaxed sm:text-3xl">
            “Spring is not better than winter. Summer is not more important than autumn. Each season serves a different purpose. Every phase of relationship development serves a different purpose.”
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
          <div className="mt-8"><CtaButton href="/snapshot/intro" variant="primary">Take the Free Snapshot</CtaButton></div>
        </div>
      </section>
    </main>
  );
}
