import Link from "next/link";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import { getMember } from "@/lib/academyAuth";

export const dynamic = "force-dynamic";

// Public gateway. Signed-in members skip straight to the dashboard.
export default async function AcademyLanding() {
  const member = await getMember();
  if (member) redirect("/academy/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <Logo variant="full" href="/" className="mb-10 h-11" />
      <p className="font-ui text-xs uppercase tracking-[0.25em] text-plum">The Academy</p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-midnight-navy sm:text-5xl">
        Your private learning home for the Relationship Life Cycle™
      </h1>
      <p className="mt-5 max-w-xl font-body text-lg text-charcoal/80">
        Structured courses, guided reflection, and workbooks — a calm, focused
        space to grow, distinct from the community over on Skool.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/academy/signup"
          className="rounded-full bg-midnight-navy px-7 py-3 font-ui text-sm font-medium text-white transition-colors hover:bg-midnight-navy/90"
        >
          Create your free account
        </Link>
        <Link
          href="/academy/login"
          className="rounded-full border border-midnight-navy/20 px-7 py-3 font-ui text-sm font-medium text-midnight-navy transition-colors hover:bg-midnight-navy/5"
        >
          Sign in
        </Link>
      </div>
      <Link
        href="/"
        className="mt-10 font-ui text-sm text-midnight-navy/60 underline underline-offset-4 hover:text-midnight-navy"
      >
        ← Back to relationshiplc.com
      </Link>
    </div>
  );
}
