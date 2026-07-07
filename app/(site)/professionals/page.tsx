import Link from "next/link";
import SectionLabel from "@/components/site/SectionLabel";
import LeadForm from "@/components/site/LeadForm";
import RichText from "@/components/site/RichText";
import { getSiteContentMap, get, buildPageMetadata } from "@/lib/siteContent";

export const revalidate = 60;

export async function generateMetadata() {
  return buildPageMetadata(await getSiteContentMap(), "professionals");
}

const AUDIENCES = [
  { name: "Therapists & Counselors", challenge: "Clients often present with relationship distress that is hard to contextualize within a single session or complaint.", help: "The framework provides a developmental structure for understanding where the relationship is and what competencies may be underdeveloped — giving clinicians a clearer picture of what to address and when." },
  { name: "Coaches & Consultants", challenge: "Coaching clients want to move forward in their relationships but lack a developmental framework for understanding what they actually need.", help: "The Relationship Life Cycle™ gives coaches a structured way to assess where a client is relationally and build development plans that match their current stage." },
  { name: "Organizations & HR", challenge: "Workplace relationships — between leaders, teams, and colleagues — are rarely supported with the same developmental intentionality as other organizational systems.", help: "The framework's principles apply to professional relationship development, providing a lens for understanding collaboration, trust-building, and relational transitions in the workplace." },
  { name: "Faith Communities", challenge: "Pastoral and lay counselors often support couples and individuals through major relational transitions without a developmental framework for guidance.", help: "The Relationship Life Cycle™ provides a structured, non-clinical developmental framework that complements faith-based relationship support." },
  { name: "Family Law Attorneys", challenge: "Attorneys regularly encounter clients in the most acute phases of relational dissolution, often without tools to help clients understand their experience developmentally.", help: "The framework provides language for the Expiration, Recovery, and Renewal phases — helping attorneys better understand and support clients navigating separation and divorce." },
  { name: "Healthcare Providers", challenge: "Health outcomes are deeply connected to relationship quality, but healthcare providers rarely have structured frameworks for addressing relational health.", help: "The Relationship Life Cycle™ offers a developmental lens for understanding how relationship phases and relational stress may be affecting patient wellbeing." },
];

const APPLICATIONS = [
  "Clinical practice", "Client education", "Coaching", "Organizational consulting", "Workshop facilitation",
  "Premarital education", "Divorce recovery", "Clinical supervision", "Curriculum development", "Assessment and evaluation",
];

const ECOSYSTEM = [
  { name: "Clinical Manual", status: "" },
  { name: "Facilitator Manual", status: "" },
  { name: "Assessment Tools", status: "Available now" },
  { name: "CE Courses", status: "In development" },
  { name: "Certification", status: "In development" },
  { name: "Professional Training", status: "In development" },
  { name: "Research & Validation", status: "In development" },
  { name: "Workshops & Consulting", status: "" },
];

const AUTHORITY = [
  "Developed by Janelle Dawsey, LMFT (License No. MFT001614)",
  "Grounded in clinical observation and relationship development research",
  "Structured operational definitions for each phase and domain",
  "Designed for professional application and future research validation",
];

export default async function ProfessionalsPage() {
  const content = await getSiteContentMap();
  return (
    <main className="bg-warm-ivory">
      {/* Hero */}
      <section className="px-6 pt-36 pb-14 text-center">
        <div className="mx-auto max-w-3xl">
          <SectionLabel className="mb-4">{get(content, "professionals.hero.eyebrow", "For Professionals")}</SectionLabel>
          <h1 className="font-display text-[36px] font-semibold leading-[1.08] text-midnight-navy sm:text-5xl">
            {get(content, "professionals.hero.headline", "A developmental framework that gives relationship work a clearer foundation.")}
          </h1>
          <p className="mx-auto mt-6 max-w-[580px] font-body text-lg leading-relaxed text-charcoal">
            {get(content, "professionals.hero.subhead", "The Relationship Life Cycle™ doesn't replace the models you already use. It provides the developmental context that helps you understand where a relationship is — and what it needs — at every stage.")}
          </p>
          <div className="mt-8">
            <Link
              href="/institute"
              className="inline-block rounded-full bg-midnight-navy px-7 py-3 font-ui text-sm font-medium text-white transition-colors hover:bg-midnight-navy/90"
            >
              Visit the Professional Institute →
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem Professionals Face */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">{get(content, "professionals.gap.heading", "The gap most professionals recognize.")}</h2>
          <div className="mt-6 space-y-4 font-body text-[17px] leading-relaxed text-charcoal">
            <RichText text={get(content, "professionals.gap.body", "Most professionals who work with relationships encounter the same pattern. Clients arrive with good intentions, clear struggles, and years of accumulated damage from needs that were never properly understood or addressed at the right time.\n\nThe Relationship Life Cycle™ Framework was created from that clinical observation: most relationship challenges aren't caused by bad people. They're caused by relationships that outpaced their own foundation — moving forward without building the skills each phase required.\n\nThis framework gives professionals a shared developmental language for understanding that gap.")} />
          </div>
        </div>
      </section>

      {/* Positioning */}
      <section className="bg-[#F2F5F2] px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">{get(content, "professionals.position.heading", "A complement, not a competitor.")}</h2>
          <div className="mt-6 space-y-4 font-body text-[17px] leading-relaxed text-charcoal">
            <RichText text={get(content, "professionals.position.body", "The Relationship Life Cycle™ is not designed to replace attachment theory, Gottman Method, EFT, or any existing therapeutic model. It provides the developmental framework that organizes when and why different relationship needs, challenges, and skills become most relevant.\n\nThink of it as the map that helps your existing tools make more sense — to you and to the people you serve.")} />
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">{get(content, "professionals.audiences.heading", "Who this is for")}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {AUDIENCES.map((a) => (
              <div key={a.name} className="rounded-xl border border-light-gray bg-white p-6">
                <h3 className="font-display text-xl font-semibold text-midnight-navy">{a.name}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-charcoal"><span className="font-semibold">Challenge:</span> {a.challenge}</p>
                <p className="mt-2 font-body text-sm leading-relaxed text-charcoal"><span className="font-semibold">How it helps:</span> {a.help}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beyond Romantic */}
      <section className="bg-[#FBF9F5] px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">{get(content, "professionals.beyond.heading", "Beyond romantic relationships.")}</h2>
          <div className="mt-6 space-y-4 font-body text-[17px] leading-relaxed text-charcoal">
            <RichText text={get(content, "professionals.beyond.body", "The Relationship Life Cycle™ Framework is fundamentally about relational development — which means its principles extend beyond romantic partnerships.\n\nRelationships between parents and children, colleagues and teams, mentors and mentees, friends and communities — all of these develop over time. All of them have phases, tasks, and opportunities for growth.\n\nThe framework's application to non-romantic relationships is an active area of development. What exists today in the context of romantic partnerships is the foundation for a much broader body of work.")} />
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">{get(content, "professionals.apps.heading", "How professionals are using the framework.")}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {APPLICATIONS.map((a) => (
              <span key={a} className="rounded-full border border-midnight-navy/20 bg-white px-4 py-2 font-ui text-sm text-charcoal">{a}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="bg-[#FBF9F5] px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">{get(content, "professionals.ecosystem.heading", "A growing professional ecosystem.")}</h2>
          <p className="mt-3 max-w-[680px] font-body text-[17px] leading-relaxed text-charcoal">
            {get(content, "professionals.ecosystem.body", "The Relationship Life Cycle™ is being developed into a comprehensive professional ecosystem. What exists today is the beginning.")}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ECOSYSTEM.map((e) => (
              <div key={e.name} className="rounded-xl border border-light-gray bg-white p-5">
                <h3 className="font-display text-lg font-semibold text-midnight-navy">{e.name}</h3>
                {e.status && (
                  <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 font-ui text-[11px] uppercase tracking-wide ${e.status === "Available now" ? "bg-sage-green/20 text-sage-green" : "bg-light-gray text-charcoal/60"}`}>
                    {e.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authority */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">{get(content, "professionals.authority.heading", "Built with clinical rigor.")}</h2>
          <ul className="mt-6 flex flex-col gap-3">
            {AUTHORITY.map((a) => (
              <li key={a} className="flex items-start gap-3 font-body text-charcoal">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-midnight-navy/10 text-xs text-midnight-navy">✓</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA form */}
      <section className="bg-midnight-navy px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-semibold text-white">{get(content, "professionals.cta.heading", "Join the framework as it grows.")}</h2>
          <p className="mx-auto mt-4 max-w-md font-body text-white/85">
            {get(content, "professionals.cta.body", "Professional resources, manuals, CE courses, and certification are in development. Register your interest to be notified as new professional tools become available — and to be part of shaping the framework's professional ecosystem.")}
          </p>
          <div className="mt-8 rounded-2xl bg-white p-6 text-left">
            <LeadForm
              source="professional_interest"
              fields={["name", "email", "organization"]}
              extraFields={[{ key: "role", label: "Your role or credentials" }]}
              submitLabel="Register My Interest"
              successMessage="Thank you — we'll notify you as professional resources launch."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
