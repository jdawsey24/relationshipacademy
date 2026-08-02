import { redirect, notFound } from "next/navigation";
import { getMember } from "@/lib/academyAuth";
import { getPlaybookContent } from "@/content/playbook";
import { ownsPlaybook, loadProgress } from "@/lib/playbook/progress";
import ExperienceShell from "@/components/playbook/ExperienceShell";
import RelatedPlaybooks from "@/components/playbook/RelatedPlaybooks";

export const dynamic = "force-dynamic";

// The interactive delivery mode of an OWNED playbook (new mode of the existing
// entitlement). Not-signed-in or not-owned → the marketing/checkout page.
export default async function PlaybookExperiencePage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const content = getPlaybookContent(key);
  if (!content) notFound();

  const member = await getMember();
  if (!member) redirect(`/playbooks/${key}`);

  const owns = await ownsPlaybook(member.user.id, key);
  if (!owns) redirect(`/playbooks/${key}`);

  const progress = await loadProgress(member.user.id, key, content.playbookVersion);

  // Cross-Playbook routing, publish-wired: an owned target opens its experience,
  // a non-owned one redirects to its marketing/checkout page (discover-and-buy).
  // Renders nothing when this Playbook has no routes.
  return (
    <>
      <ExperienceShell content={content} playbookKey={key} initialProgress={progress} />
      <div className="bg-warm-ivory px-5 pb-16">
        <RelatedPlaybooks
          fromKey={key}
          titleFor={(k) => getPlaybookContent(k)?.displayName}
          hrefFor={(to) => `/playbook/${to}`}
        />
      </div>
    </>
  );
}
