import SectionLabel from "@/components/site/SectionLabel";
import CtaButton from "@/components/site/CtaButton";
import LeadForm from "@/components/site/LeadForm";
import { getSiteContentMap, get } from "@/lib/siteContent";

export const revalidate = 60;

export const metadata = {
  title: "Speaking | Relationship Life Cycle™",
  description:
    "Janelle Dawsey brings the Relationship Life Cycle™ Framework to conferences, organizations, and communities.",
};

const EXPERIENCE = [
  "A new way of understanding how relationships develop over time",
  "Language for experiences they've had but couldn't name",
  "Practical insights they can apply immediately — personally and professionally",
  "Greater empathy for where they and others are in the relational journey",
  "A framework that continues to work long after the session ends",
];

const TOPICS = [
  { title: "Every Relationship Has a Season", audience: "General / Conference / Community", body: "A keynote introduction to the Relationship Life Cycle™ Framework — helping audiences understand that every relationship has phases, and every phase has a purpose. Participants leave with a developmental map for their relationships and language for where they are in the journey." },
  { title: "When Good Advice Stops Working", audience: "Professional / Clinical / Organizational", body: "An exploration of developmental mismatch — why applying the right advice at the wrong stage creates more confusion than clarity. Designed for professionals who work with relationships in any capacity." },
  { title: "What Your Relationship Actually Needs Right Now", audience: "Couples / Faith Communities / Healthcare / HR", body: "A practical session that helps participants identify where their relationship is in its development and what it needs to move forward — drawing directly from the six phases and six areas of the Relationship Life Cycle™." },
];

const AUDIENCES = [
  { name: "Corporate & Leadership", body: "Relational development in workplace and leadership contexts." },
  { name: "Healthcare", body: "Relationship health as a factor in patient outcomes and provider wellbeing." },
  { name: "Mental Health Professionals", body: "Clinical application of the developmental framework." },
  { name: "Legal Professionals", body: "Supporting clients through relational transitions (family law, mediation)." },
  { name: "Faith Communities", body: "Relationship development within pastoral and community contexts." },
  { name: "Education & Community Organizations", body: "Relationship literacy for students and community members." },
];

export default async function SpeakingPage() {
  const content = await getSiteContentMap();
  return (
    <main className="bg-warm-ivory">
      {/* Hero */}
      <section className="px-6 pt-36 pb-14 text-center">
        <div className="mx-auto max-w-3xl">
          <SectionLabel className="mb-4">{get(content, "speaking.hero.eyebrow", "Speaking & Keynotes")}</SectionLabel>
          <h1 className="font-display text-[36px] font-semibold leading-[1.08] text-midnight-navy sm:text-5xl">
            {get(content, "speaking.hero.headline", "Your audience will leave thinking about relationships differently.")}
          </h1>
          <p className="mx-auto mt-6 max-w-[560px] font-body text-lg leading-relaxed text-charcoal">
            {get(content, "speaking.hero.subhead", "Janelle Dawsey brings the Relationship Life Cycle™ Framework to conferences, organizations, healthcare systems, legal professionals, and faith communities — creating experiences that are educational, transformative, and immediately applicable.")}
          </p>
          <div className="mt-8"><CtaButton href="#inquiry">Inquire About Speaking</CtaButton></div>
        </div>
      </section>

      {/* What Audiences Experience */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">What your audience walks away with.</h2>
          <ul className="mt-6 flex flex-col gap-3">
            {EXPERIENCE.map((e) => (
              <li key={e} className="flex items-start gap-3 font-body text-charcoal">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coral-rose/15 text-xs text-coral-rose">✓</span>
                {e}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Speaker Bio */}
      <section className="bg-[#FBF9F5] px-6 py-16">
        <div className="mx-auto flex max-w-4xl flex-col gap-8 sm:flex-row sm:items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/janelle-speaking.jpg" alt="Janelle Dawsey, LMFT" className="w-full max-w-[240px] rounded-2xl object-cover shadow-sm" />
          <div className="flex-1">
            <h2 className="font-display text-2xl font-semibold text-midnight-navy">About Janelle Dawsey</h2>
            <div className="mt-3 space-y-3 font-body text-base leading-relaxed text-charcoal">
              <p>Janelle Dawsey is a Licensed Marriage and Family Therapist, author, certified matchmaker, and the creator of the Relationship Life Cycle™ Framework. After years of clinical practice — sitting with couples, individuals, and families navigating some of the most complex moments of their relational lives — she recognized a pattern that kept appearing: relationships weren&apos;t failing because people were bad at relationships. They were failing because no one had ever given them a developmental map.</p>
              <p>That recognition became the Relationship Life Cycle™.</p>
              <p>Janelle speaks from a place of clinical depth and genuine warmth. Her sessions don&apos;t feel like lectures. They feel like someone finally putting language to something audiences already knew was true — but had never heard said out loud.</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {["LMFT", "Author", "Certified Matchmaker", "Founder, Symmetricly"].map((t) => (
                <span key={t} className="rounded-full border border-midnight-navy/25 px-3 py-1 font-ui text-xs text-midnight-navy">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">Keynotes &amp; Sessions</h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {TOPICS.map((t) => (
              <div key={t.title} className="rounded-xl border border-light-gray bg-white p-6">
                <span className="font-ui text-[11px] uppercase tracking-wide text-charcoal/50">{t.audience}</span>
                <h3 className="mt-2 font-display text-xl font-semibold text-midnight-navy">{t.title}</h3>
                <p className="mt-3 font-body text-[15px] leading-relaxed text-charcoal">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section className="bg-[#FBF9F5] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">Who Janelle speaks to</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div key={a.name} className="rounded-xl border border-light-gray bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-midnight-navy">{a.name}</h3>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-charcoal">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workplace Applications */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">Relational development in the workplace.</h2>
          <div className="mt-6 space-y-4 font-body text-[17px] leading-relaxed text-charcoal">
            <p>The principles of the Relationship Life Cycle™ extend naturally into organizational settings. The way trust is built between a leader and a team, the way a new professional partnership develops, the way organizations navigate change — these are all relational experiences with developmental patterns.</p>
            <p>Janelle&apos;s organizational sessions apply the framework&apos;s developmental lens to the professional relationships that shape workplace culture, retention, and performance.</p>
          </div>
        </div>
      </section>

      {/* Social Proof (placeholder) */}
      <section className="bg-[#F2F5F2] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-2xl font-semibold text-midnight-navy">Organizations &amp; Events</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex h-16 items-center justify-center rounded-lg bg-white font-ui text-[11px] uppercase tracking-wide text-charcoal/30">
                Partner Logo
              </div>
            ))}
          </div>
          <div className="mx-auto mt-8 max-w-xl rounded-2xl bg-white p-6 text-center">
            <p className="font-body text-charcoal/40">Testimonial coming soon.</p>
          </div>
        </div>
      </section>

      {/* Inquiry */}
      <section id="inquiry" className="px-6 py-16">
        <div className="mx-auto max-w-xl">
          <h2 className="text-center font-display text-3xl font-semibold text-midnight-navy">Bring Janelle to your event</h2>
          <div className="mt-8">
            <LeadForm
              source="speaking_inquiry"
              fields={["name", "email", "organization", "message"]}
              eventTypeOptions={["Conference", "Corporate Event", "Workshop", "Faith Community", "Healthcare", "Legal", "Education", "Other"]}
              extraFields={[
                { key: "audience_size", label: "Estimated audience size" },
                { key: "event_date", label: "Event date (if known)" },
              ]}
              submitLabel="Send Inquiry"
              successMessage="Thank you — your inquiry has been received. We'll be in touch soon."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
