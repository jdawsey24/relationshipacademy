import Link from "next/link";
import { notFound } from "next/navigation";
import CtaButton from "@/components/site/CtaButton";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { PHASES, getPhase } from "@/lib/frameworkContent";
import { classesFor } from "@/lib/phases";

export function generateStaticParams() {
  return PHASES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const phase = getPhase(slug);
  if (!phase) return { title: "Phase | Relationship Life Cycle™" };
  const title = `${phase.name} | The Relationship Life Cycle™`;
  const description = phase.cardDescription || phase.intro;
  const url = `/framework/phases/${phase.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", siteName: "Relationship Life Cycle™", images: [{ url: "/og-default.png" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og-default.png"] },
  };
}

export default async function PhaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const phase = getPhase(slug);
  if (!phase) notFound();

  const c = classesFor(phase.color);
  const idx = PHASES.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? PHASES[idx - 1] : null;
  const next = idx < PHASES.length - 1 ? PHASES[idx + 1] : null;

  return (
    <main className="bg-warm-ivory">
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "The Framework", path: "/framework" },
        { name: phase.name, path: `/framework/phases/${phase.slug}` },
      ])} />
      {/* Hero */}
      <section className={`${c.solidBg} ${c.solidText} px-6 pt-36 pb-16`}>
        <div className="mx-auto max-w-3xl">
          <p className="font-ui text-xs font-semibold uppercase tracking-[0.15em] opacity-80">
            Phase {phase.number} of 6
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">{phase.name}</h1>
          <p className="mt-3 font-ui text-sm uppercase tracking-[0.15em] opacity-80">
            Developmental Task: {phase.task}
          </p>
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed opacity-95">{phase.intro}</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-3xl px-6 pt-6">
        <nav className="font-ui text-sm text-charcoal/60">
          <Link href="/" className="hover:text-midnight-navy">Home</Link>
          <span className="mx-2">→</span>
          <Link href="/framework" className="hover:text-midnight-navy">The Framework</Link>
          <span className="mx-2">→</span>
          <span className="text-charcoal">{phase.name}</span>
        </nav>
      </div>

      {/* Content sections */}
      <div className="mx-auto max-w-2xl px-6 py-12">
        {!phase.fullyPopulated && (
          <p className={`mb-8 rounded-lg border-l-4 ${c.border} ${c.tintBg} py-3 pl-4 pr-3 font-body text-sm text-charcoal`}>
            This phase overview is being expanded with full content from the Relationship Life Cycle™ Framework Manual. The essentials are below.
          </p>
        )}
        <div className="space-y-12">
          {phase.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-2xl font-semibold text-midnight-navy">{s.heading}</h2>
              <div className="mt-4 space-y-4">
                {s.comingSoon ? (
                  <p className="font-body text-[15px] italic leading-relaxed text-charcoal/50">
                    Full content coming soon.
                  </p>
                ) : (
                  s.body.map((p, i) => (
                    <p key={i} className="font-body text-base leading-relaxed text-charcoal">{p}</p>
                  ))
                )}
              </div>
            </section>
          ))}
        </div>

        {/* Phase navigation */}
        <div className="mt-16 flex items-center justify-between border-t border-light-gray pt-6 font-ui text-sm">
          {prev ? (
            <Link href={`/framework/phases/${prev.slug}`} className="text-midnight-navy hover:underline">
              ← {prev.name}
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/framework/phases/${next.slug}`} className="text-midnight-navy hover:underline">
              {next.name} →
            </Link>
          ) : <span />}
        </div>
      </div>

      {/* Assessment CTA */}
      <section className="bg-midnight-navy px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-2xl font-semibold">Take the Relationship Snapshot™</h2>
          <p className="mx-auto mt-3 max-w-md font-body text-white/85">
            See how your relationship is functioning right now across all six domains.
          </p>
          <div className="mt-6">
            <CtaButton href="/snapshot/intro" variant="accent">Start the Free Snapshot</CtaButton>
          </div>
        </div>
      </section>
    </main>
  );
}
