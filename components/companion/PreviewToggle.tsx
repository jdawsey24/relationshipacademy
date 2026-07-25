"use client";

// Staff-only inline toggle between the draft preview and the real member view.
// Renders nothing for non-staff. Controlled by the parent (which owns the
// asUser state + refetch); this component only shows state and fires onToggle.
export default function PreviewToggle({ staff, asUser, onToggle }: {
  staff: boolean; asUser: boolean; onToggle: () => void;
}) {
  if (!staff) return null;
  return (
    <div className="mt-1 flex items-center gap-2">
      <span className={`font-ui text-[11px] font-semibold uppercase tracking-wide ${asUser ? "text-charcoal/45" : "text-coral-rose"}`}>
        {asUser ? "Viewing as a member" : "Staff preview · showing drafts"}
      </span>
      <button type="button" onClick={onToggle}
        className="rounded-full border border-light-gray px-2.5 py-0.5 font-ui text-[11px] font-medium text-midnight-navy/70 transition-colors hover:border-midnight-navy/30 hover:text-midnight-navy">
        {asUser ? "Show drafts" : "View as member"}
      </button>
    </div>
  );
}
