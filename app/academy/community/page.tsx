import { redirect } from "next/navigation";
import { getMember } from "@/lib/academyAuth";
import { tierRank } from "@/lib/academy";
import { getSiteContentMap, get } from "@/lib/siteContent";
import { Panel } from "@/components/academy/ui";

export const dynamic = "force-dynamic";

// The Academy is the structured learning space; Skool remains the community.
// This page is the bridge — it links out to Skool, it does not replace it.
export default async function CommunityPage() {
  const member = await getMember();
  if (!member) redirect("/academy/login");

  const settings = await getSiteContentMap();
  const skoolUrl = get(settings, "settings.skool_url", "");
  const hasLiveAccess = member.isStaff || tierRank(member.tier) >= tierRank("academy_plus");

  const links = [
    { title: "Community discussion", desc: "Ask questions and share where you are in the work." },
    { title: "Weekly lives", desc: "Join the live sessions and replays." },
    { title: "Q&A", desc: "Get your questions answered by Janelle and the community." },
    { title: "Challenges", desc: "Take part in guided challenges and prompts." },
    { title: "Accountability", desc: "Stay consistent alongside others on the same path." },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">Community</h1>
        <p className="mt-2 max-w-2xl font-body text-charcoal/70">
          The Academy is your structured learning home. The community — discussion, weekly lives,
          Q&amp;A, challenges, and accountability — lives on Skool.
        </p>
      </header>

      <div className="rounded-2xl bg-plum p-7 text-white sm:p-9">
        <h2 className="font-display text-2xl font-semibold">Join the conversation on Skool</h2>
        <p className="mt-2 max-w-xl font-body text-white/85">
          Bring your reflections from the lessons into the community and keep the momentum going.
        </p>
        {skoolUrl ? (
          <a
            href={skoolUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 font-ui text-sm font-medium text-plum transition-colors hover:bg-white/90"
          >
            Open Skool →
          </a>
        ) : (
          <p className="mt-6 font-ui text-sm text-white/70">
            The community link hasn&apos;t been set yet. (Admin → Settings → Skool URL.)
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((l) => (
          <Panel key={l.title}>
            <h3 className="font-display text-lg font-semibold text-midnight-navy">{l.title}</h3>
            <p className="mt-1 font-body text-sm text-charcoal/70">{l.desc}</p>
          </Panel>
        ))}
      </div>

      <Panel title="Live session resources">
        {hasLiveAccess ? (
          <p className="font-body text-sm text-charcoal/75">
            Slides, replays, and worksheets from live sessions will appear here as they&apos;re added.
          </p>
        ) : (
          <p className="font-body text-sm text-charcoal/75">
            Live session resources are included with <strong>Academy Plus</strong>. Upgrade any time
            to unlock replays and worksheets.
          </p>
        )}
      </Panel>
    </div>
  );
}
