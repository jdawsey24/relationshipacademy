import type { PhaseNarrativeProjection } from "@/lib/framework/phaseNarrative";
import { classesFor, type ColorToken } from "@/lib/phases";

// Renders a phase narrative entirely from the Knowledge Base projection.
//
// Every string here comes from kb_phase_narratives / kb_phase_domain_narratives.
// There is no prop for legacy copy and no fallback path — a phase that reaches
// this component has already passed the renderable check.

export default function KbPhaseNarrative({
  narrative,
  color,
}: {
  narrative: PhaseNarrativeProjection;
  color: ColorToken;
}) {
  const c = classesFor(color);

  return (
    <div className="space-y-14">
      {/* The core question */}
      <section>
        <h2 className="font-display text-2xl font-semibold text-midnight-navy">The question this phase asks</h2>
        <p className={`mt-4 rounded-r-lg border-l-4 ${c.border} ${c.tintBg} py-4 pl-5 pr-4 font-body text-lg italic leading-relaxed text-charcoal`}>
          {narrative.coreQuestion}
        </p>
      </section>

      {narrative.livedExperienceSummary && (
        <section>
          <h2 className="font-display text-2xl font-semibold text-midnight-navy">What this phase is like</h2>
          <p className="mt-4 font-body text-base leading-relaxed text-charcoal">{narrative.livedExperienceSummary}</p>
        </section>
      )}

      {narrative.developmentalExplanation && (
        <section>
          <h2 className="font-display text-2xl font-semibold text-midnight-navy">The developmental task</h2>
          <p className="mt-4 font-body text-base leading-relaxed text-charcoal">{narrative.developmentalExplanation}</p>
        </section>
      )}

      {/* Transformation */}
      {(narrative.transformationFrom.length > 0 || narrative.transformationToward.length > 0) && (
        <section>
          <h2 className="font-display text-2xl font-semibold text-midnight-navy">What changes</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="rounded-lg border border-light-gray bg-white p-5">
              <h3 className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/60">From</h3>
              <ul className="mt-3 space-y-2">
                {narrative.transformationFrom.map((t) => (
                  <li key={t} className="font-body text-sm leading-relaxed text-charcoal">{t}</li>
                ))}
              </ul>
            </div>
            <div className={`rounded-lg border ${c.border} ${c.tintBg} p-5`}>
              <h3 className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/60">Toward</h3>
              <ul className="mt-3 space-y-2">
                {narrative.transformationToward.map((t) => (
                  <li key={t} className="font-body text-sm leading-relaxed text-charcoal">{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* The six domain storylines */}
      {narrative.storylines.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-semibold text-midnight-navy">
            Six areas, one phase
          </h2>
          <div className="mt-6 space-y-8">
            {narrative.storylines.map((s) => (
              <div key={s.domain} className="border-t border-light-gray pt-6">
                <p className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/60">{s.domain}</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-midnight-navy">{s.storyline}</h3>
                {s.emotionalExperience && (
                  <p className="mt-3 font-body text-base leading-relaxed text-charcoal">{s.emotionalExperience}</p>
                )}
                {s.internalQuestions.map((q) => (
                  <p key={q} className="mt-3 font-body text-base italic leading-relaxed text-charcoal/90">{q}</p>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Governing truths — the reductions this phase is not */}
      {narrative.governingTruths.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-semibold text-midnight-navy">What this phase is not</h2>
          <ul className="mt-5 space-y-3">
            {narrative.governingTruths.map((t) => (
              <li key={t} className="rounded-lg border border-light-gray bg-white px-5 py-3 font-body text-base leading-relaxed text-charcoal">
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
