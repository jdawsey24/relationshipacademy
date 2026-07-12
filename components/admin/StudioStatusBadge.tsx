import { STATUS_LABELS, type StudioStatus } from "@/lib/studio";

const CLASS: Record<StudioStatus, string> = {
  draft: "bg-light-gray text-charcoal/60",
  in_review: "bg-amber-100 text-amber-800",
  changes_requested: "bg-coral-rose/20 text-coral-rose",
  approved: "bg-blue-100 text-blue-700",
  published: "bg-sage-green/20 text-sage-green",
  retired: "bg-light-gray text-charcoal/40",
};

export default function StudioStatusBadge({ status }: { status: string }) {
  const st = (status in STATUS_LABELS ? status : "draft") as StudioStatus;
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${CLASS[st]}`}>
      {STATUS_LABELS[st]}
    </span>
  );
}
