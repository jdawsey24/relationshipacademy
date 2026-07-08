import Link from "next/link";
import LeadForm from "@/components/site/LeadForm";
import { getSiteContentMap, get } from "@/lib/siteContent";
import { LANDING_COPY } from "@/lib/institute";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Relationship Life Cycle™ Professional Institute",
  description:
    "The professional education division of the Relationship Life Cycle™ ecosystem — training and implementation resources for helping professionals.",
};

const OFFERINGS = [
  { title: "CE Courses", href: "/institute/ce-courses", desc: "Continuing education workshops and on-demand courses for licensed professionals." },
  { title: "Workshops", href: "/institute/workshops", desc: "Live professional workshops on the framework and its clinical application." },
  { title: "Certifications", href: "/institute/certifications", desc: "Certification programs — facilitator, clinical implementation, and assessment." },
  { title: "Professional Resources", href: "/institute/professional-resources", desc: "Implementation toolkits, assessment tools, and practitioner guides." },
  { title: "Research", href: "/institute/research", desc: "Research and publications on the Relationship Life Cycle™ framework." },
  { title: "Events", href: "/institute/events", desc: "Conferences and special events for the professional community." },
];

const AUDIENCE = [
  "Therapists & counselors",
  "Coaches",
  "Educators",
  "Clergy & faith leaders",
  "HR & workplace professionals",
  "Other helping professionals",
];

export default async function InstituteLandingPage() {
  const map = await getSiteContentMap();
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-midnight-navy/10 bg-warm-ivory/50">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center md:px-8 md:py-24">
          <p className="font-ui text-xs uppercase tracking-[0.25em] text-slate-blue">
            {get(map, "institute.landing.eyebrow", LANDING_COPY.eyebrow)}
          </p>
          <h1 className="mx-auto mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.08] text-midnight-navy sm:text-5xl md:text-6xl">
            {get(map, "institute.landing.headline", LANDING_COPY.headline)}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-body text-lg text-charcoal/80">
            {get(map, "institute.landing.subhead", LANDING_COPY.subhead)}
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="#interest" className="rounded-full bg-midnight-navy px-7 py-3 font-ui text-sm font-medium text-white hover:bg-midnight-navy/90">
              Register your interest
            </Link>
            <Link href="/institute/certifications" className="rounded-full border border-midnight-navy/20 px-7 py-3 font-ui text-sm font-medium text-midnight-navy hover:bg-midnight-navy/5">
              Explore certifications
            </Link>
          </div>
        </div>
      </section>

      {/* Academy vs Institute distinction */}
      <section className="mx-auto max-w-5xl px-5 py-16 md:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-midnight-navy/10 bg-white p-7">
            <p className="font-ui text-xs uppercase tracking-[0.2em] text-plum">Relationship Academy</p>
            <p className="mt-3 font-body text-charcoal/80">
              Teaches individuals and couples how to improve <strong>their own</strong> relationships
              through structured education, community, and practice.
            </p>
            <Link href="/academy" className="mt-4 inline-block font-ui text-sm text-midnight-navy underline underline-offset-4">Visit the Academy →</Link>
          </div>
          <div className="rounded-2xl border border-slate-blue/30 bg-midnight-navy p-7 text-white">
            <p className="font-ui text-xs uppercase tracking-[0.2em] text-white/60">Professional Institute</p>
            <p className="mt-3 font-body text-white/90">
              Teaches <strong>professionals</strong> how to apply the Relationship Life Cycle™
              Framework in their work with the people they serve.
            </p>
            <span className="mt-4 inline-block font-ui text-sm text-white/70">You are here</span>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="bg-warm-ivory/40">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">What the Institute offers</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OFFERINGS.map((o) => (
              <Link key={o.href} href={o.href} className="group rounded-2xl border border-midnight-navy/10 bg-white p-6 transition-shadow hover:shadow-md">
                <h3 className="font-display text-xl font-semibold text-midnight-navy group-hover:underline">{o.title}</h3>
                <p className="mt-2 font-body text-sm text-charcoal/70">{o.desc}</p>
                <span className="mt-4 inline-block font-ui text-sm text-midnight-navy">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 className="font-display text-3xl font-semibold text-midnight-navy">Who it&apos;s for</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {AUDIENCE.map((a) => (
            <span key={a} className="rounded-full border border-midnight-navy/15 bg-white px-4 py-2 font-ui text-sm text-charcoal/80">
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* Interest capture */}
      <section id="interest" className="bg-midnight-navy">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:px-8">
          <div className="text-white">
            <h2 className="font-display text-3xl font-semibold">Register your interest</h2>
            <p className="mt-4 max-w-md font-body text-white/80">
              The Institute&apos;s programs are being developed. Tell us what you&apos;re most
              interested in and we&apos;ll notify you as CE courses, workshops, and certifications
              open for enrollment.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 sm:p-8">
            <LeadForm
              source="professional_interest"
              fields={["name", "email", "organization", "message"]}
              inquiryTypeOptions={[
                "CE Courses",
                "Live Workshops",
                "Certification Programs",
                "Clinical Implementation Training",
                "Assessment Training",
                "Facilitator Training",
                "Case Consultation",
                "Professional Resources",
                "Other",
              ]}
              submitLabel="Register interest"
              successMessage="Thank you — we'll be in touch as Institute programs open."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
