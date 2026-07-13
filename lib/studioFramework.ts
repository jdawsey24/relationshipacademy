// Client-safe config + types for the RLC Studio Framework browser and the
// Competency Workspace. No server imports — safe in client components. Reuses the
// domain/phase vocabulary from lib/studioAssessment.ts. Server reads live in
// lib/studioFrameworkData.ts.
//
// FRAMEWORK vs STUDIO:
//   Framework = the canonical IP (Phases · Domains · Competencies · Behavioral
//     Indicators · Structural Markers · Developmental Tasks · Decision Log).
//   RLC Studio = the authoring environment that DERIVES from the Framework.
// The Competency Workspace is the primary operational unit — the smallest
// complete place to build/review/publish everything tied to one competency.

import { DOMAIN_SLUGS, PHASE_SLUGS, domainLabel } from "@/lib/studioAssessment";
export { DOMAIN_SLUGS, PHASE_SLUGS, domainLabel };

/** Title-case a phase slug ("exploration" -> "Exploration"). */
export function phaseLabel(slug: string | null | undefined): string {
  return slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "";
}

// ---------------------------------------------------------------------------
// Framework hierarchy (Phase -> Domain -> Competency -> Behavioral Indicators)
// ---------------------------------------------------------------------------

export interface FrameworkCompetency {
  code: string;
  name: string;
  domain_slug: string | null;
  phase_slug: string | null; // = kb_competencies.competency_phase_slug
  status: string; // active | retired
}

export interface FrameworkNode {
  slug: string;
  name: string;
}

export interface FrameworkTree {
  phases: FrameworkNode[];
  domains: FrameworkNode[];
  competencies: FrameworkCompetency[];
}

// ---------------------------------------------------------------------------
// Competency Workspace tabs. `seg` is the URL segment appended to
// /admin/studio/competency/[code]. Overview is the index (empty segment).
// ---------------------------------------------------------------------------

export const WORKSPACE_TABS = [
  { key: "overview", label: "Overview", seg: "" },
  { key: "indicators", label: "Behavioral Indicators", seg: "indicators" },
  { key: "assessment", label: "Assessment", seg: "assessment" },
  { key: "content", label: "Content", seg: "content" },
  { key: "related", label: "Related Assets", seg: "related" },
  { key: "publishing", label: "Publishing", seg: "publishing" },
  { key: "health", label: "Health", seg: "health" },
] as const;

export type WorkspaceTabKey = (typeof WORKSPACE_TABS)[number]["key"];

/** The competency-keyed content types shown in the workspace Content tab, in
 *  display order. Keys match LEARNING_TABLES in lib/studioLibrary.ts. Lessons are
 *  multi-competency (competency_ids) so they surface under Related Assets, not
 *  here, to keep the single-competency listing accurate. */
export const WORKSPACE_CONTENT_TYPES = [
  "worksheets",
  "lessons",
  "practices",
  "activities",
  "interventions",
  "conversation-guides",
  "journal-prompts",
  "videos",
] as const;

// ---------------------------------------------------------------------------
// Workspace aggregate shapes (returned by lib/studioFrameworkData.ts) — declared
// here so client components can type against them.
// ---------------------------------------------------------------------------

export interface WorkspaceCounts {
  items: { total: number; approved: number; draft: number; reverse: number; phaseAnchored: number };
  indicators: { behavioral: number; incomplete: number };
  content: Record<string, number>; // keyed by WORKSPACE_CONTENT_TYPES key
  recommendations: number;
  published: number;
  lastUpdated: string | null;
}

export interface RelatedAssets {
  assessments: { assessment_id: string; name: string; itemCount: number }[];
  content: Record<string, number>;
  recommendations: number;
  destinations: { destination: string; count: number }[];
}
