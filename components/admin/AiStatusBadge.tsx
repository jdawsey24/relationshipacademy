import { AI_STATUS_LABELS, type AiStatus } from "@/lib/ai/types";

const CLASS: Record<AiStatus, string> = {
  draft: "bg-light-gray text-charcoal/60",
  in_review: "bg-amber-100 text-amber-800",
  changes_requested: "bg-coral-rose/20 text-coral-rose",
  approved: "bg-blue-100 text-blue-700",
  published: "bg-sage-green/20 text-sage-green",
  rejected: "bg-coral-rose/20 text-coral-rose line-through",
  retired: "bg-light-gray text-charcoal/40",
};

export default function AiStatusBadge({ status }: { status: string }) {
  const st = (status in AI_STATUS_LABELS ? status : "draft") as AiStatus;
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${CLASS[st]}`}>{AI_STATUS_LABELS[st]}</span>;
}
