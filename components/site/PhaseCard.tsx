import Link from "next/link";
import { classesFor, type ColorToken } from "@/lib/phases";

interface PhaseCardProps {
  number: number;
  name: string;
  primaryFocus: string;
  description: string;
  color: ColorToken;
  href: string;
  /** framework-language developmental task, shown small (Framework page only) */
  task?: string;
}

export default function PhaseCard({
  number,
  name,
  primaryFocus,
  description,
  color,
  href,
  task,
}: PhaseCardProps) {
  const c = classesFor(color);
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-light-gray bg-white p-6 transition-shadow hover:shadow-md"
    >
      <span className={`absolute left-0 top-0 h-full w-1 ${c.barFill}`} aria-hidden="true" />
      <span className={`font-ui text-[11px] font-semibold uppercase tracking-[0.15em] ${c.text}`}>
        Phase {number}
      </span>
      <span className="mt-2 font-display text-2xl font-semibold text-midnight-navy">{name}</span>
      <span className="mt-1 font-body text-sm text-charcoal/80">{primaryFocus}</span>
      {task && (
        <span className="mt-1 font-ui text-[11px] uppercase tracking-wide text-charcoal/45">
          Developmental task: {task}
        </span>
      )}
      <span className="mt-3 font-body text-[15px] leading-relaxed text-charcoal">{description}</span>
    </Link>
  );
}
