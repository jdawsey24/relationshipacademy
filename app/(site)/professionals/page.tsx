import Link from "next/link";
import SectionLabel from "@/components/site/SectionLabel";
import LeadForm from "@/components/site/LeadForm";

export const metadata = { title: "For Professionals | Relationship Life Cycle™" };

const AUDIENCES = [
  { name: "Therapists & Counselors", body: "A developmental lens for assessing where a client's relationship is and what it needs next." },
  { name: "Coaches & Consultants", body: "A shared language for guiding clients through relational transitions." },
  { name: "Organizations & HR", body: "A framework for supporting relational health across teams and workplaces." },
  { name: "Faith Communities", body: "A structure for premarital, marital, and restorative relationship ministry." },
  { name: "Family Law Attorneys", body: "Developmental context for clients navigating separation and divorce." },
  { name: "Healthcare Providers", body: "A way to understand how relational phase affects wellbeing and care." },
];

const USE_CASES = [
  { title: "As a clinical assessment tool", body: "The Relationship Snapshot™ gives clinicians a structured, developmental read on relational functioning across six domains." },
  { title: "As an educational framework for clients", body: "The six phases give clients a map for where they are — reducing shame and clarifying what the current phase requires." },
  { title: "As an organizational training resource", body: "The framework equips teams and communities with a common developmental language for relationships." },
];

export default function ProfessionalsPage() {
  return (
    <main className="bg-warm-ivory">
      <section className="px-6 pt-36 pb-14 text-center">
        <div className="mx-auto max-w-3xl">
          <SectionLabel className="mb-4">For Professionals</SectionLabel>
          <h1 className="font-display text-[40px] font-semibold leading-[1.05] text-midnight-navy sm:text-5xl">
            Bring Developmental Clarity to the Relationships You Serve.
          </h1>
          <p className="mx-auto mt-6 max-w-[620px] font-body text-lg leading-relaxed text-charcoal">
            The Relationship Life Cycle™ Framework is being used by therapists, coaches, attorneys, healthcare providers, and organizations to understand and support the relationships they encounter professionally.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">Who This Is For</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div key={a.name} className="rounded-xl border border-light-gray bg-white p-6">
                <h3 className="font-display text-xl font-semibold text-midnight-navy">{a.name}</h3>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-charcoal">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F2F5F2] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">How Professionals Use the Framework</h2>
          <div className="mt-8 space-y-8">
            {USE_CASES.map((u) => (
              <div key={u.title}>
                <h3 className="font-display text-2xl font-semibold text-midnight-navy">{u.title}</h3>
                <p className="mt-2 font-body text-base leading-relaxed text-charcoal">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-semibold text-midnight-navy">Coming Soon</h2>
          <p className="mt-4 font-body text-base leading-relaxed text-charcoal">
            Professional resources, CE courses, facilitator training, and certification programs are in development.
          </p>
          <div className="mt-8 text-left">
            <LeadForm source="professional_interest" fields={["name", "email", "organization"]} submitLabel="Register My Interest" successMessage="Thank you — we'll notify you as professional resources launch." />
          </div>
        </div>
      </section>

      <section className="bg-midnight-navy px-6 py-14 text-center text-white">
        <p className="mx-auto max-w-xl font-body text-lg">
          Interested in bringing the Relationship Life Cycle™ to your organization?{" "}
          <Link href="/speaking" className="font-semibold text-soft-coral underline underline-offset-4">
            See Speaking &amp; Consulting
          </Link>
        </p>
      </section>
    </main>
  );
}
