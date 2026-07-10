import { redirect } from "next/navigation";
import { getProfessional } from "@/lib/instituteAuth";
import { getLiveSessions } from "@/lib/liveData";
import LiveSessionsView from "@/components/live/LiveSessionsView";

export const dynamic = "force-dynamic";

export default async function InstituteLivePage() {
  const pro = await getProfessional();
  if (!pro) redirect("/institute/login");
  if (!pro.isProfessional) redirect("/institute/dashboard");

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8">
      <header>
        <p className="font-ui text-xs uppercase tracking-[0.22em] text-plum">Professional Institute</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">Live Workshops</h1>
        <p className="mt-2 max-w-2xl font-body text-charcoal/70">
          Join live professional workshops and watch replays.
        </p>
      </header>

      <div className="mt-8">
        <LiveSessionsView sessions={await getLiveSessions("institute")} />
      </div>
    </div>
  );
}
