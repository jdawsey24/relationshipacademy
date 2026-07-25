import SituationRow from "./SituationRow";

interface Situation { situation_id: string; title: string; user_need: string | null; category_id: string | null }

// A single calm container of situation rows with hairline dividers — the whole
// list reads as one grouped surface instead of many floating cards. `categoryId`
// overrides the per-row category (used within a Process category section).
export default function SituationList({ situations, categoryId }: {
  situations: Situation[]; categoryId?: string | null;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-light-gray/70 bg-white/60 divide-y divide-light-gray/60">
      {situations.map((s) => (
        <SituationRow key={s.situation_id} id={s.situation_id} title={s.title} need={s.user_need}
          categoryId={categoryId ?? s.category_id} />
      ))}
    </div>
  );
}
