import SectionLabel from "@/components/site/SectionLabel";
import LeadForm from "@/components/site/LeadForm";

export const metadata = { title: "Speaking | Relationship Life Cycle™" };

const TOPICS = [
  { title: "Understanding the Relationship Life Cycle™", body: "A keynote overview of the framework and its six developmental phases." },
  { title: "Developmental Mismatch: Why Good Relationships Struggle", body: "For professional audiences — how phase misalignment drives relational distress." },
  { title: "Where Are You? A Framework for Relational Self-Awareness", body: "For general audiences — a practical map for understanding your own relationships." },
];

function Headshot() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/janelle-speaking.jpg"
      alt="Janelle Dawsey, LMFT"
      className="w-full max-w-[240px] rounded-2xl object-cover shadow-sm"
    />
  );
}

export default function SpeakingPage() {
  return (
    <main className="bg-warm-ivory">
      <section className="px-6 pt-36 pb-14 text-center">
        <div className="mx-auto max-w-3xl">
          <SectionLabel className="mb-4">Speaking &amp; Keynotes</SectionLabel>
          <h1 className="font-display text-[40px] font-semibold leading-[1.05] text-midnight-navy sm:text-5xl">
            Bringing the Relationship Life Cycle™ to Your Audience.
          </h1>
          <p className="mx-auto mt-6 max-w-[620px] font-body text-lg leading-relaxed text-charcoal">
            Janelle Dawsey, LMFT brings the Relationship Life Cycle™ Framework to conferences, organizations, faith communities, legal professionals, and healthcare providers.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 sm:flex-row sm:items-start">
          <Headshot />
          <div className="flex-1">
            <h2 className="font-display text-2xl font-semibold text-midnight-navy">Janelle Dawsey, LMFT</h2>
            <p className="mt-3 font-body text-base leading-relaxed text-charcoal">
              Janelle Dawsey is a Licensed Marriage and Family Therapist, author, and the creator of the Relationship Life Cycle™ Framework. With over a decade of clinical experience, she has helped thousands of individuals and couples understand where they are in their relational development — and what they need to move forward. Her speaking engages audiences across the professional, organizational, and community spectrum.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#FBF9F5] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">Talk Topics</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {TOPICS.map((t) => (
              <div key={t.title} className="rounded-xl border border-light-gray bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-midnight-navy">{t.title}</h3>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-charcoal">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-xl">
          <h2 className="text-center font-display text-3xl font-semibold text-midnight-navy">Bring Janelle to Your Event</h2>
          <div className="mt-8">
            <LeadForm
              source="speaking_inquiry"
              fields={["name", "email", "organization", "event_type", "message"]}
              submitLabel="Send Inquiry"
              successMessage="Thank you — your inquiry has been received. We'll be in touch soon."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
