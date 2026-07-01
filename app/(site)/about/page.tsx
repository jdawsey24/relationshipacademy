import SectionLabel from "@/components/site/SectionLabel";

export const metadata = { title: "About | Relationship Life Cycle™" };

function Headshot() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/janelle-about.jpg"
      alt="Janelle Dawsey, LMFT"
      className="w-full max-w-[220px] rounded-2xl object-cover shadow-sm"
    />
  );
}

export default function AboutPage() {
  return (
    <main className="bg-warm-ivory">
      <section className="px-6 pt-36 pb-12 text-center">
        <h1 className="font-display text-[40px] font-semibold leading-[1.05] text-midnight-navy sm:text-5xl">
          About the Relationship Life Cycle™
        </h1>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-2xl space-y-12">
          <div>
            <SectionLabel className="mb-2">Our Mission</SectionLabel>
            <h2 className="font-display text-2xl font-semibold text-midnight-navy">Our Mission</h2>
            <p className="mt-3 font-body text-base leading-relaxed text-charcoal">
              To give every person a developmental map for their relationships — so that where they are makes sense, what they need becomes clear, and the path forward feels possible.
            </p>
          </div>

          <div>
            <SectionLabel className="mb-2">Our Vision</SectionLabel>
            <h2 className="font-display text-2xl font-semibold text-midnight-navy">Our Vision</h2>
            <p className="mt-3 font-body text-base leading-relaxed text-charcoal">
              A world where relationship development is understood, not assumed — where individuals and couples have access to the language, tools, and frameworks they need to navigate every phase of the relational journey.
            </p>
          </div>

          <div>
            <SectionLabel className="mb-2">Why It Exists</SectionLabel>
            <h2 className="font-display text-2xl font-semibold text-midnight-navy">Why the Relationship Life Cycle™ Was Created</h2>
            <p className="mt-3 font-body text-base leading-relaxed text-charcoal">
              Most people are taught how to start relationships. Very few are taught how relationships actually develop. After years of clinical practice, a pattern became clear: most relationship distress is not caused by bad people. It is caused by developmental mismatches — by expecting one phase to perform the task of another. The Relationship Life Cycle™ was created to address that gap.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#FBF9F5] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">About Janelle Dawsey, LMFT</h2>
          <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-start">
            <Headshot />
            <div className="flex-1">
              <p className="font-body text-base leading-relaxed text-charcoal">
                Janelle Dawsey is a Licensed Marriage and Family Therapist (License No. MFT001614), author, certified matchmaker, and the founder and CEO of Symmetricly — a multi-clinician relationship wellness firm based in Smyrna, Georgia. She holds a Master of Science in Marriage and Family Therapy from Mercer University and is the author of <em>The Real Mommy Makeover</em> and <em>Healing After Heartbreak</em>. The Relationship Life Cycle™ is her original framework, developed through years of clinical practice and a deep belief that every person deserves a map for their relationships.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["LMFT", "Author", "Certified Matchmaker", "Founder, Symmetricly"].map((b) => (
                  <span key={b} className="rounded-full border border-midnight-navy/25 px-3 py-1 font-ui text-xs text-midnight-navy">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-midnight-navy">Media &amp; Press</h2>
          <p className="mt-3 font-body text-base leading-relaxed text-charcoal">
            For media inquiries, interview requests, or press materials, please contact{" "}
            <a href="mailto:info@symmetricly.co" className="text-midnight-navy underline underline-offset-4">info@symmetricly.co</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
