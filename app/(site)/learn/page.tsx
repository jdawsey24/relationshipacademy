import Link from "next/link";
import SectionLabel from "@/components/site/SectionLabel";
import LeadForm from "@/components/site/LeadForm";
import { getPublishedArticles } from "@/lib/articles";

export const metadata = { title: "Learning Center | Relationship Life Cycle™" };
export const revalidate = 60;

const CATEGORIES = [
  "Exploration & Dating", "Commitment & Exclusivity", "Building a Shared Life",
  "Conflict & Repair", "Breakups & Endings", "Healing & Recovery",
  "Relationship Development", "For Professionals",
];

export default async function LearnPage() {
  const articles = await getPublishedArticles();

  return (
    <main className="bg-warm-ivory">
      <section className="px-6 pt-36 pb-14 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-[40px] font-semibold leading-[1.05] text-midnight-navy sm:text-5xl">
            The Relationship Life Cycle™ Learning Center
          </h1>
          <p className="mx-auto mt-6 max-w-[600px] font-body text-lg leading-relaxed text-charcoal">
            Articles, guides, research, and resources for understanding relationship development.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <SectionLabel className="mb-4">Explore by Topic</SectionLabel>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <div key={c} className="rounded-xl border border-light-gray bg-white p-5 font-display text-lg font-semibold text-midnight-navy">{c}</div>
            ))}
          </div>
        </div>
      </section>

      {articles.length > 0 ? (
        <section className="px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <SectionLabel className="mb-4">Articles</SectionLabel>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <Link key={a.id} href={`/learn/${a.slug}`} className="flex flex-col overflow-hidden rounded-xl border border-light-gray bg-white transition-shadow hover:shadow-md">
                  {a.featured_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.featured_image_url} alt="" className="h-40 w-full object-cover" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {a.category && <span className="mb-2 font-ui text-[11px] uppercase tracking-wide text-coral-rose">{a.category}</span>}
                    <h3 className="font-display text-xl font-semibold text-midnight-navy">{a.title}</h3>
                    {a.summary && <p className="mt-2 font-body text-[15px] leading-relaxed text-charcoal">{a.summary}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <SectionLabel className="mb-4">Featured Articles</SectionLabel>
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { title: "Understanding the Exploration Phase", body: "What discernment really looks like in the earliest phase of a relationship." },
                { title: "Developmental Mismatch, Explained", body: "Why good relationships struggle when phases and expectations don't align." },
                { title: "The Six Universal Domains", body: "How relational functioning is measured across every phase." },
              ].map((a) => (
                <div key={a.title} className="flex flex-col rounded-xl border border-light-gray bg-white p-6">
                  <span className="mb-3 inline-flex w-fit rounded-full bg-light-gray px-3 py-1 font-ui text-[11px] uppercase tracking-wide text-charcoal/60">Coming soon</span>
                  <h3 className="font-display text-xl font-semibold text-midnight-navy">{a.title}</h3>
                  <p className="mt-2 font-body text-[15px] leading-relaxed text-charcoal">{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-midnight-navy px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-3xl font-semibold">More is on the way.</h2>
          <p className="mx-auto mt-4 max-w-md font-body text-white/85">Sign up to be notified when new content is published.</p>
          <div className="mx-auto mt-8 max-w-md text-left">
            <LeadForm source="learn_waitlist" fields={["name", "email"]} submitLabel="Notify Me" successMessage="You're on the list — we'll be in touch." />
          </div>
        </div>
      </section>
    </main>
  );
}
