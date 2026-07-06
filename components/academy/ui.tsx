// Small server-safe presentational primitives for the Academy portal.
import { tierLabel } from "@/lib/academy";

export function ProgressBar({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-midnight-navy/10">
      <div
        className="h-full rounded-full bg-sage-green transition-all"
        style={{ width: `${p}%` }}
        role="progressbar"
        aria-valuenow={p}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

export function TierBadge({ tier }: { tier: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-plum/12 px-2.5 py-0.5 font-ui text-xs font-medium text-plum">
      {tierLabel(tier)}
    </span>
  );
}

export function LockPill({ label = "Locked" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-midnight-navy/8 px-2.5 py-0.5 font-ui text-xs font-medium text-midnight-navy/60">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="5" y="11" width="14" height="9" rx="2" fill="currentColor" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
      {label}
    </span>
  );
}

export function PreviewPill() {
  return (
    <span className="inline-flex items-center rounded-full bg-sage-green/20 px-2.5 py-0.5 font-ui text-xs font-medium text-midnight-navy">
      Free preview
    </span>
  );
}

/** A boxed section used throughout lessons and the dashboard. */
export function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-midnight-navy/10 bg-white p-6 ${className}`}>
      {title && (
        <h2 className="mb-3 font-ui text-xs font-semibold uppercase tracking-[0.15em] text-plum">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
