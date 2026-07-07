import Link from "next/link";

// Shared template for the Institute's section pages. Keeps them consistent:
// a masthead-style hero, an intro, a list of (current or planned) offerings, and
// a call to register interest (the interest form lives on the Institute landing).
export interface Offering {
  title: string;
  description: string;
  status?: "available" | "coming"; // defaults to "coming" in Phase 1
}

export default function InstituteSection({
  eyebrow,
  title,
  intro,
  offerings,
  note,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  offerings: Offering[];
  note?: string;
}) {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-midnight-navy/10 bg-warm-ivory/50">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
          <p className="font-ui text-xs uppercase tracking-[0.25em] text-slate-blue">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold text-midnight-navy sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl font-body text-lg text-charcoal/80">{intro}</p>
        </div>
      </section>

      {/* Offerings */}
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {offerings.map((o) => (
            <div key={o.title} className="rounded-2xl border border-midnight-navy/10 bg-white p-6">
              <div className="mb-2 flex items-center gap-2">
                <h2 className="font-display text-xl font-semibold text-midnight-navy">{o.title}</h2>
                <span
                  className={`rounded-full px-2 py-0.5 font-ui text-xs ${
                    o.status === "available"
                      ? "bg-sage-green/20 text-midnight-navy"
                      : "bg-midnight-navy/8 text-charcoal/60"
                  }`}
                >
                  {o.status === "available" ? "Available" : "In development"}
                </span>
              </div>
              <p className="font-body text-sm text-charcoal/75">{o.description}</p>
            </div>
          ))}
        </div>

        {note && <p className="mt-8 max-w-2xl font-body text-sm text-charcoal/60">{note}</p>}

        {/* Interest CTA */}
        <div className="mt-12 rounded-2xl bg-midnight-navy px-6 py-8 text-center text-white sm:px-10">
          <h3 className="font-display text-2xl font-semibold">Be first to know</h3>
          <p className="mx-auto mt-2 max-w-xl font-body text-white/80">
            These offerings are being developed. Register your interest and we&apos;ll notify you as
            enrollment opens.
          </p>
          <Link
            href="/institute#interest"
            className="mt-6 inline-block rounded-full bg-white px-7 py-3 font-ui text-sm font-medium text-midnight-navy transition-colors hover:bg-white/90"
          >
            Register your interest →
          </Link>
        </div>
      </section>
    </div>
  );
}
