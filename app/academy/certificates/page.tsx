import Link from "next/link";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/academyAuth";
import { getCertificates } from "@/lib/certificates";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const member = await getMember();
  if (!member) redirect("/academy/login");

  const certificates = await getCertificates(member.user.id);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">Certificates</h1>
        <p className="mt-2 max-w-2xl font-body text-charcoal/70">
          Earn a certificate by completing every lesson in a course.
        </p>
      </header>

      {certificates.length === 0 ? (
        <div className="rounded-2xl border border-midnight-navy/10 bg-white p-8 text-center">
          <p className="font-body text-charcoal/70">
            You haven&apos;t earned any certificates yet. Finish a course to earn your first one.
          </p>
          <Link
            href="/academy/courses"
            className="mt-5 inline-block rounded-full bg-midnight-navy px-6 py-2.5 font-ui text-sm font-medium text-white hover:bg-midnight-navy/90"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {certificates.map((c) => (
            <Link
              key={c.id}
              href={`/academy/certificates/${c.id}`}
              className="group rounded-2xl border border-midnight-navy/10 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-2 font-ui text-xs uppercase tracking-[0.2em] text-plum">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                  <path d="M8.5 14.5 7 22l5-3 5 3-1.5-7.5" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                Certificate
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold text-midnight-navy group-hover:underline">
                {c.course_title}
              </h2>
              <p className="mt-2 font-ui text-sm text-charcoal/60">
                Issued {new Date(c.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
              <p className="mt-1 font-ui text-xs text-charcoal/40">No. {c.serial}</p>
              <span className="mt-4 inline-block font-ui text-sm text-midnight-navy">View &amp; print →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
