import { redirect, notFound } from "next/navigation";
import { getMember } from "@/lib/academyAuth";
import { getPlaybookContent } from "@/content/playbook";
import { ownsPlaybook, loadProgress } from "@/lib/playbook/progress";
import ExperienceShell from "@/components/playbook/ExperienceShell";

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

  return <ExperienceShell content={content} playbookKey={key} initialProgress={progress} />;
}
