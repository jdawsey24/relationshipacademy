import { redirect } from "next/navigation";
import { getProfessional } from "@/lib/instituteAuth";
import InstituteAccountForm from "@/components/institute/InstituteAccountForm";

export const dynamic = "force-dynamic";

export default async function InstituteAccountPage() {
  const pro = await getProfessional();
  if (!pro) redirect("/institute/login");
  if (!pro.isProfessional) redirect("/institute/dashboard");

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:px-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">Account</h1>
        <p className="mt-2 font-body text-charcoal/70">Manage your professional profile and password.</p>
      </header>

      <div className="mt-8 rounded-2xl border border-midnight-navy/10 bg-white p-6">
        <p className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-plum">Professional access</p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 font-body text-midnight-navy">
            <span className="inline-block h-2 w-2 rounded-full bg-sage-green" /> Active
          </span>
          <span className="font-ui text-sm text-charcoal/60">{pro.user.email}</span>
        </div>
        <p className="mt-3 font-body text-sm text-charcoal/70">
          You have access to the Professional Institute. Enrollment in specific programs (CE courses,
          certifications, live workshops) opens as they launch.
        </p>
      </div>

      <div className="mt-6">
        <InstituteAccountForm initialName={pro.profile.full_name ?? ""} />
      </div>
    </div>
  );
}
