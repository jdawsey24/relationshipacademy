import { PHASES } from "@/lib/frameworkContent";
import type { ColorToken } from "@/lib/phases";
import { getPhaseNarrative } from "@/lib/framework/phaseNarrative";
import { get } from "@/lib/siteContent";

// Phase card props for /framework, resolved from the right source per phase.
//
// A knowledge_base phase takes its card copy from kb_phase_narratives and is
// NOT subject to site_content overrides. That exclusion is the point: a CMS
// override on a cut-over phase would be a second authoring source, which is what
// the cutover removed. Legacy phases keep their existing override behaviour
// until they are migrated too.

export interface PhaseCardProps {
  slug: string;
  number: number;
  name: string;
  color: ColorToken;
  task: string;
  primaryFocus: string;
  description: string;
  source: "knowledge_base" | "legacy_manual";
  /** Present for knowledge_base phases — proves all routes share a version. */
  sourceVersion?: string;
}

export async function resolvePhaseCards(content: Map<string, string>): Promise<PhaseCardProps[]> {
  return Promise.all(
    PHASES.map(async (p): Promise<PhaseCardProps> => {
      if (p.narrativeSource === "knowledge_base") {
        const n = await getPhaseNarrative(p.name);
        if (!n) {
          throw new Error(
            `${p.name} is declared knowledge_base but has no kb_phase_narratives record. ` +
              `Refusing to fall back to legacy copy.`,
          );
        }
        if (!n.renderable) {
          throw new Error(
            `${p.name} narrative is missing required fields: ${n.missingRequiredFields.join(", ")}. ` +
              `Refusing to fall back to legacy copy.`,
          );
        }
        return {
          slug: p.slug,
          number: p.number,
          name: n.phase, // canonical name, never the consumer title
          color: p.color,
          task: n.developmentalTask,
          primaryFocus: n.publicDescriptor ?? n.developmentalTask,
          description: n.cardDescription,
          source: "knowledge_base",
          sourceVersion: n.sourceVersion,
        };
      }

      return {
        slug: p.slug,
        number: p.number,
        name: p.name,
        color: p.color,
        task: p.task ?? "",
        primaryFocus: get(content, `phase.${p.slug}.primaryFocus`, p.primaryFocus ?? ""),
        description: get(content, `phase.${p.slug}.cardDescription`, p.cardDescription ?? ""),
        source: "legacy_manual",
      };
    }),
  );
}
