import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfessional } from "@/lib/instituteAuth";
import { INSTITUTE_SECTIONS } from "@/lib/institute";
import ActivateProfessional from "@/components/institute/ActivateProfessional";

export const dynamic = "force-dynamic";

export default async function InstituteDashboardPage() {
  const pro = await getProfessional();
  if (!pro) redirect("/institute/login");

  const firstName = (pro.profile.full_name || "").split(" ")[0];

  // Signed in, but hasn't activated professional access yet (e.g. an Academy
  // member). Offer one-click activation (open + free).
  if (!pro.isProfessional) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center md:px-8">
        <p className="font-ui text-xs uppercase tracking-[0.22em] text-plum">Professional Institute</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">
          Activate professional access
        </h1>
        <p className="mx-auto mt-4 max-w-md font-body text-charcoal/75">
          Your account isn&apos;t set up for the Professional Institute yet. Activate free access to
          the professional training area — you can enroll in specific programs as they launch.
        </p>
        <div className="mt-8 flex justify-center">
          <ActivateProfessional />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
      <header>
        <p className="font-ui text-sm text-plum">Welcome{firstName ? `, ${firstName}` : ""}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">
          Professional Dashboard
        </h1>
        <p className="mt-2 max-w-2xl font-body text-charcoal/70">
          Your home for Relationship Life Cycle™ professional training. Programs open here as they
          launch — you&apos;ll see your enrollments and live sessions in this space.
        </p>
      </header>

      {/* Live workshops */}
      <section className="mt-8">
        <Link href="/institute/live" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-midnight-navy px-6 py-5 text-white transition-colors hover:bg-midnight-navy/90">
          <div>
            <p className="font-display text-lg font-semibold">Live Workshops</p>
            <p className="font-body text-sm text-white/75">Join live professional sessions and watch replays.</p>
          </div>
          <span className="font-ui text-sm">Open →</span>
        </Link>
      </section>

      {/* Explore offerings */}
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-midnight-navy">Explore the Institute</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INSTITUTE_SECTIONS.map((s) => (
            <Link key={s.key} href={s.path} className="group rounded-2xl border border-midnight-navy/10 bg-white p-5 transition-shadow hover:shadow-md">
              <span className="font-display text-lg font-semibold text-midnight-navy group-hover:underline">{s.label}</span>
              <span className="mt-2 block font-ui text-sm text-midnight-navy/70">View →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-midnight-navy/10 bg-warm-ivory/50 p-6">
        <h2 className="font-display text-lg font-semibold text-midnight-navy">Coming soon</h2>
        <p className="mt-2 font-body text-sm text-charcoal/70">
          Your enrolled CE courses, certification progress, live workshops, and downloadable
          professional resources will appear here as programs open for enrollment.
        </p>
      </section>
    </div>
  );
}
