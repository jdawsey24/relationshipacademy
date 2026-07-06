import RichText from "@/components/site/RichText";
import { getSiteContentMap, get, buildPageMetadata } from "@/lib/siteContent";

export const revalidate = 60;

export async function generateMetadata() {
  return buildPageMetadata(await getSiteContentMap(), "about");
}

const ROADMAP = [
  { name: "Assessment", status: "Live" },
  { name: "Framework Education", status: "Live" },
  { name: "The Relationship Academy", status: "Live" },
  { name: "Clinical Manual", status: "In development" },
  { name: "CE Courses", status: "In development" },
  { name: "Professional Certification", status: "In development" },
  { name: "Research & Validation", status: "In development" },
  { name: "Organizational Consulting", status: "In development" },
];

export default async function AboutPage() {
  const content = await getSiteContentMap();
  return (
    <main className="bg-warm-ivory">
      {/* The Story */}
      <section className="px-6 pt-40 pb-16">
        <div className="mx-auto max-w-2xl">
          <p className="font-display text-3xl font-semibold leading-snug text-midnight-navy sm:text-[32px]">
            {get(content, "about.story.opening", "After years of sitting with couples in therapy, a pattern became impossible to ignore.")}
          </p>
          <div className="mt-6 space-y-4 font-body text-[17px] leading-relaxed text-charcoal">
            <RichText text={get(content, "about.story.body", "The resentment. The distance. The feeling that they'd somehow failed each other. It rarely started where they thought it did.\n\nMost of the time, the relationship had simply outpaced itself. They'd moved forward — into commitment, into shared lives, into families — without building what they needed to carry them through. Not because they didn't love each other. Because nobody ever showed them what that foundation was supposed to look like. Or when they needed to build it.\n\nPeople would arrive in therapy full of pain, and you'd start to understand their story — how they got to where they were — and realize the resentment wasn't really about what was happening now. It was the accumulation of years of needs that had never been recognized, skills that had never been built, phases that had been skipped over or rushed through without anyone understanding what was being left behind.\n\nThat recognition became the Relationship Life Cycle™.")} />
          </div>
        </div>
      </section>

      {/* Why the Framework Was Created */}
      <section className="bg-[#FBF9F5] px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">{get(content, "about.created.heading", "A map that didn't exist.")}</h2>
          <div className="mt-6 space-y-4 font-body text-[17px] leading-relaxed text-charcoal">
            <RichText text={get(content, "about.created.body", "There is no shortage of relationship advice. There are books, courses, therapists, coaches, podcasts, and frameworks addressing every aspect of relationships imaginable.\n\nBut most of that guidance addresses individual pieces. Very little addresses how those pieces fit together across the full development of a relationship.\n\nThe Relationship Life Cycle™ was created to provide that context. Not to replace what already exists — but to give it a developmental home. To help people understand that where they are in their relationship determines what they need, what challenges are normal, and what comes next.\n\nSometimes the challenge isn't the relationship. It's trying to solve today's problems with yesterday's expectations — or applying tomorrow's standards before the foundation has been built.")} />
          </div>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-3xl gap-10 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-midnight-navy">{get(content, "about.mission.heading", "Mission")}</h2>
            <p className="mt-3 font-body text-[16px] leading-relaxed text-charcoal">
              {get(content, "about.mission.body", "To give every person a developmental map for their relationships — so that where they are makes sense, what they need becomes clear, and the path forward feels possible.")}
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-midnight-navy">{get(content, "about.vision.heading", "Vision")}</h2>
            <p className="mt-3 font-body text-[16px] leading-relaxed text-charcoal">
              {get(content, "about.vision.body", "A world where relationship development is understood, not assumed — where individuals and couples have access to the language, tools, and frameworks they need to navigate every phase of the relational journey.")}
            </p>
          </div>
        </div>
      </section>

      {/* About Janelle */}
      <section className="bg-[#FBF9F5] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">{get(content, "about.janelle.heading", "About Janelle Dawsey, LMFT")}</h2>
          <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/janelle-about.jpg" alt="Janelle Dawsey, LMFT" className="w-full max-w-[220px] rounded-2xl object-cover shadow-sm" />
            <div className="flex-1 space-y-4 font-body text-[16px] leading-relaxed text-charcoal">
              <p>Janelle Dawsey became a therapist because she believed relationships could change people&apos;s lives — and that the right support at the right moment could make all the difference. What she didn&apos;t expect was how clearly clinical practice would reveal the gap: not in the quality of people&apos;s intentions, but in their access to a developmental map for the journey they were on.</p>
              <p>The Relationship Life Cycle™ is her attempt to close that gap.</p>
              <p>Janelle is a Licensed Marriage and Family Therapist (License No. MFT001614), certified matchmaker, author, and the founder and CEO of Symmetricly — a multi-clinician relationship wellness firm based in Smyrna, Georgia. She holds a Master of Science in Marriage and Family Therapy from Mercer University and is the author of <em>The Real Mommy Makeover</em> and <em>Healing After Heartbreak</em>.</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {["LMFT", "MS, MFT — Mercer University", "Author", "Certified Matchmaker", "Founder & CEO, Symmetricly"].map((t) => (
                  <span key={t} className="rounded-full border border-midnight-navy/25 px-3 py-1 font-ui text-xs text-midnight-navy">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Future */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">{get(content, "about.future.heading", "Where the Relationship Life Cycle™ is going.")}</h2>
          <p className="mt-4 max-w-[680px] font-body text-[17px] leading-relaxed text-charcoal">
            {get(content, "about.future.body", "What exists today — the framework, the assessment, this website — is the beginning of something much larger. The Relationship Life Cycle™ is being developed into a comprehensive ecosystem for relationship education, professional training, and research. The goal is for the framework to become a foundational reference point for how relationships are understood, supported, and taught — across clinical practice, organizational settings, education, faith communities, and beyond.")}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROADMAP.map((r) => (
              <div key={r.name} className="rounded-xl border border-light-gray bg-white p-5">
                <h3 className="font-display text-lg font-semibold text-midnight-navy">{r.name}</h3>
                <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 font-ui text-[11px] uppercase tracking-wide ${r.status === "Live" ? "bg-sage-green/20 text-sage-green" : "bg-light-gray text-charcoal/60"}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="bg-[#FBF9F5] px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-midnight-navy">{get(content, "about.media.heading", "Media & Press")}</h2>
          <p className="mt-3 font-body text-[16px] leading-relaxed text-charcoal">
            For media inquiries, interview requests, or press kit access, please contact{" "}
            <a href="mailto:info@symmetricly.co" className="text-midnight-navy underline underline-offset-4">info@symmetricly.co</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
