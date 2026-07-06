import Image from "next/image";
import Link from "next/link";
import { PHASES } from "@/lib/frameworkContent";
import { classesFor } from "@/lib/phases";

// Centerpiece framework visual: the cycle diagram + a clickable phase strip
// beneath it (the spec's allowed, robust fallback to a fully custom SVG).
export default function PhaseCycle() {
  return (
    <div className="flex flex-col items-center">
      <Image
        src="/cycle-diagram.png"
        alt="The Relationship Life Cycle — six phases arranged in a cycle: Exploration, Exclusivity, Expansion, Expiration, Recovery, Renewal."
        width={576}
        height={576}
        sizes="(max-width: 640px) 100vw, 576px"
        className="h-auto w-full max-w-xl"
      />

      <div className="mt-8 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        {PHASES.map((p) => {
          const c = classesFor(p.color);
          return (
            <Link
              key={p.slug}
              href={`/${p.slug}`}
              className="group flex items-center gap-3 rounded-lg border border-light-gray bg-white px-4 py-3 transition-shadow hover:shadow-sm"
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${c.solidBg} ${c.solidText} font-ui text-xs font-semibold`}>
                {p.number}
              </span>
              <span className="font-display text-base font-semibold text-midnight-navy group-hover:text-coral-rose">
                {p.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
