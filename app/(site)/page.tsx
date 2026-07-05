import Link from "next/link";
import Logo from "@/components/Logo";
import SectionLabel from "@/components/site/SectionLabel";
import CtaButton from "@/components/site/CtaButton";
import PhaseCard from "@/components/site/PhaseCard";
import { getSiteContentMap, get, applyPhaseOverrides, buildPageMetadata } from "@/lib/siteContent";

// ISR: page is cached and regenerated periodically so CMS edits appear within
// ~a minute without making every request hit the database.
export const revalidate = 60;

export async function generateMetadata() {
  return buildPageMetadata(await getSiteContentMap(), "home");
}

const FEATURES = [
  { title: "Six relationship phases", body: "From the earliest stages of connection to rebuilding after loss.", icon: "phases" },
  { title: "Six areas of focus", body: "Every relationship expresses itself through six key areas, measured throughout every phase.", icon: "domains" },
  { title: "A free developmental assessment", body: "See exactly where your relationship is functioning right now.", icon: "assessment" },
] as const;

function FeatureIcon({ kind }: { kind: string }) {
  const common = { width: 32, height: 32, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "phases") return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /></svg>);
  if (kind === "domains") return (<svg {...common}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>);
  return (<svg {...common}><path d="M4 19V5M4 19h16M8 15l3-4 3 3 4-6" /></svg>);
}

export default async function HomePage() {
  const content = await getSiteContentMap();
  const phases = applyPhaseOverrides(content);
  return (
    <main>
      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-warm-ivory px-6 pt-24 text-center">
        <Logo variant="full" className="mb-10 h-16 sm:h-20" />
        <SectionLabel tone="sage" className="mb-4">
          {get(content, "home.hero.eyebrow", "The Relationship Life Cycle™")}
        </SectionLabel>
        <h1 className="font-display text-[40px] font-semibold leading-[1.05] text-midnight-navy sm:text-6xl">
          {get(content, "home.hero.headline", "Every relationship has a season.")}
        </h1>
        <p className="mt-6 max-w-[580px] font-body text-lg leading-relaxed text-charcoal sm:text-xl">
          {get(content, "home.hero.subhead", "Every relationship has different needs at different points in its journey. The first step is understanding where you are.")}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <CtaButton href="/framework" variant="primary">Explore the Framework</CtaButton>
          <CtaButton href="/snapshot/intro" variant="secondary">Take the Free Assessment</CtaButton>
        </div>
        <span className="mt-16 animate-bounce text-midnight-navy/40" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
        </span>
      </section>

      {/* Emotional Connection */}
      <section className="bg-warm-ivory px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">
            Wherever you are in your relationship journey, this is for you.
          </h2>
          <p className="mx-auto mt-6 max-w-[640px] font-body text-[17px] leading-relaxed text-charcoal">
            Whether you&apos;re figuring out if someone is right for you, navigating a committed relationship, rebuilding after something hard, or healing on your own — relationships look different at every stage. The Relationship Life Cycle™ gives you a way to understand where you are and what your relationship actually needs right now.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-[#FBF9F5] px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">
            Sometimes the challenge isn&apos;t your relationship.
          </h2>
          <p className="mt-3 font-body text-lg text-charcoal/90">
            It&apos;s trying to solve today&apos;s problems with yesterday&apos;s expectations.
          </p>
          <p className="mx-auto mt-6 max-w-[640px] font-body text-[16px] leading-relaxed text-charcoal">
            We&apos;re surrounded by relationship advice. Communication tips. Attachment styles. Conflict strategies. Love languages. Most of it is good. But good advice applied at the wrong moment — or the wrong stage — can make things harder, not easier. The Relationship Life Cycle™ doesn&apos;t replace what you already know about relationships. It gives it context.
          </p>
        </div>
      </section>

      {/* Framework Introduction */}
      <section className="bg-warm-ivory px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">A map for where you are.</h2>
          <p className="mx-auto mt-6 max-w-[640px] font-body text-[17px] leading-relaxed text-charcoal">
            The Relationship Life Cycle™ is a developmental framework that organizes relationship growth into six distinct phases — each with its own purpose, focus, and opportunities. It&apos;s not about whether your relationship is healthy or unhealthy. It&apos;s about understanding where it is and what it needs next.
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
          <Link href="/framework" className="mt-12 inline-flex items-center gap-1 font-ui text-sm font-medium text-midnight-navy transition-all hover:gap-2">
            Learn About the Framework <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* The Six Phases */}
      <section id="phases" className="bg-[#FBF9F5] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">Every relationship has a season.</h2>
            <p className="mx-auto mt-4 max-w-[680px] font-body text-[17px] leading-relaxed text-charcoal">
              The Relationship Life Cycle™ identifies six phases of relationship development — each one serving a distinct purpose in the larger journey.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {phases.map((p) => (
              <PhaseCard key={p.slug} number={p.number} name={p.name} primaryFocus={p.primaryFocus} description={p.cardDescription} color={p.color} href={`/framework/phases/${p.slug}`} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <CtaButton href="/framework#phases" variant="secondary">Explore All Six Phases</CtaButton>
          </div>
        </div>
      </section>

      {/* Assessment */}
      <section className="bg-warm-ivory px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">See where your relationship is right now.</h2>
          <p className="mx-auto mt-4 max-w-[680px] font-body text-[17px] leading-relaxed text-charcoal">
            The Relationship Snapshot™ is a free assessment that shows you how your relationship is functioning today — and what it might need next.
          </p>
          <ul className="mx-auto mt-8 flex max-w-md flex-col gap-3 text-left">
            {["Understand where your relationship is", "Discover what's already going well", "See what to focus on next"].map((b) => (
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
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">A framework built for clinical practice.</h2>
          <p className="mx-auto mt-4 max-w-[680px] font-body text-[16px] leading-relaxed text-charcoal">
            Therapists, coaches, attorneys, healthcare providers, and organizations are using the Relationship Life Cycle™ Framework to bring developmental clarity to the relationships they support. Professional resources, CE courses, and certification are in development.
          </p>
          <div className="mt-8"><CtaButton href="/professionals" variant="secondary">Explore Professional Resources</CtaButton></div>
        </div>
      </section>

      {/* Community */}
      <section className="bg-midnight-navy px-6 py-24 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">The Relationship Academy</h2>
          <p className="mx-auto mt-4 max-w-[600px] font-body text-[17px] leading-relaxed text-white/85">
            A community for people who want to go deeper — guided conversations, live sessions, and ongoing learning built around the Relationship Life Cycle™ Framework.
          </p>
          <div className="mt-8"><CtaButton href="https://skool.com/relationship-academy" variant="accent" external>Join The Relationship Academy</CtaButton></div>
        </div>
      </section>
    </main>
  );
}
