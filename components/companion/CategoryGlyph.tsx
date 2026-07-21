import { categoryMeta } from "@/lib/companion/categoryMeta";

// A simple line icon for a situation category. Inherits `color` from the parent.
export default function CategoryGlyph({ categoryId, size = 20 }: { categoryId: string | null | undefined; size?: number }) {
  const { icon } = categoryMeta(categoryId);
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icon.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}
