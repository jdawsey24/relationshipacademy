import Link from "next/link";
import { redirect } from "next/navigation";
import { getMember, memberCanAccess } from "@/lib/academyAuth";
import { getLiveSessions } from "@/lib/liveData";
import LiveSessionsView from "@/components/live/LiveSessionsView";

export const dynamic = "force-dynamic";

export default async function AcademyLivePage() {
  const member = await getMember();
  if (!member) redirect("/academy/login");

  const hasAccess = memberCanAccess(member, "academy_plus");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">Live Sessions</h1>
        <p className="mt-2 max-w-2xl font-body text-charcoal/70">
          Join live sessions and catch up on replays.
        </p>
      </header>

      {hasAccess ? (
        <LiveSessionsView sessions={await getLiveSessions("academy")} />
      ) : (
        <div className="rounded-2xl border border-midnight-navy/10 bg-white p-8 text-center">
          <p className="font-body text-charcoal/80">
            Live sessions are included with <strong>Academy Plus</strong>.
          </p>
          <Link href="/academy/account" className="mt-5 inline-block rounded-full bg-plum px-6 py-2.5 font-ui text-sm font-medium text-white hover:bg-plum/90">
            Upgrade to Academy Plus
          </Link>
        </div>
      )}
    </div>
  );
}
