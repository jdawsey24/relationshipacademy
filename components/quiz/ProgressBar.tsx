import Logo from "@/components/Logo";
import { TOTAL_DOMAINS } from "@/lib/domains";

interface ProgressBarProps {
  /** 1-based current domain index */
  current: number;
  /** current domain display name */
  label: string;
}

export default function ProgressBar({ current, label }: ProgressBarProps) {
  const pct = Math.round((current / TOTAL_DOMAINS) * 100);
  return (
    <div className="flex items-center gap-3">
      <Logo variant="mark" className="text-xl" />
      <div className="flex-1">
        <div className="mb-1 flex items-baseline justify-between font-ui text-xs text-charcoal/70">
          <span>
            {current} of {TOTAL_DOMAINS} — {label}
          </span>
          <span>{pct}%</span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-light-gray"
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={TOTAL_DOMAINS}
        >
          <div
            className="h-full rounded-full bg-midnight-navy transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
