import Link from "next/link";
import { categoryMeta, tint } from "@/lib/companion/categoryMeta";
import CategoryGlyph from "./CategoryGlyph";

// The shared situation card used on Home and Process. A category-colored icon
// chip, the title in the display serif, a one-line need, and a chevron.
export default function SituationCard({ id, title, need, categoryId }: {
  id: string; title: string; need?: string | null; categoryId?: string | null;
}) {
  const { accent } = categoryMeta(categoryId);
  return (
    <Link href={`/companion/situations/${id}`}
      className="group flex items-center gap-3.5 rounded-2xl border border-light-gray/70 bg-white p-3.5 transition-all hover:-translate-y-px hover:border-midnight-navy/25 hover:shadow-[0_3px_18px_rgba(28,53,87,0.07)]">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: tint(accent, 0.12), color: accent }}>
        <CategoryGlyph categoryId={categoryId} size={21} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[19px] font-semibold leading-tight text-midnight-navy">{title}</span>
        {need && <span className="mt-0.5 block truncate font-body text-[13px] text-charcoal/60">{need}</span>}
      </span>
      <span className="shrink-0 text-lg text-charcoal/25 transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
    </Link>
  );
}
