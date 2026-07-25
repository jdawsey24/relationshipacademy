import Link from "next/link";
import { categoryMeta } from "@/lib/companion/categoryMeta";

// Lightweight situation row for Home + Process. Designed to sit inside a single
// bordered container with hairline dividers (see SituationList) rather than as an
// individual shadowed card — so a long list reads as one calm list, not a wall.
// A slim category-colored accent bar keeps category identity without a heavy chip.
export default function SituationRow({ id, title, need, categoryId }: {
  id: string; title: string; need?: string | null; categoryId?: string | null;
}) {
  const { accent } = categoryMeta(categoryId);
  return (
    <Link href={`/companion/situations/${id}`}
      className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-warm-ivory/70">
      <span className="h-8 w-[3px] shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[15px] font-semibold leading-snug text-midnight-navy">{title}</span>
        {need && <span className="mt-0.5 block truncate font-body text-[12.5px] leading-snug text-charcoal/55">{need}</span>}
      </span>
    </Link>
  );
}
