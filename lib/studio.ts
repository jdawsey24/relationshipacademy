// Client-safe Studio types, constants, and PURE helpers. No server imports —
// safe to use in client components (mirrors lib/academy.ts). All privileged
// reads/writes live in lib/studioData.ts + lib/studioWorkflow.ts (server only).

export type StudioRole = "owner" | "editor" | "viewer" | null;

export type ObjectType =
  | "assessment"
  | "assessment_item"
  | "scoring_rule"
  | "result_template"
  | "recommendation_map"
  | "course"
  | "lesson"
  | "practice"
  | "worksheet"
  | "activity"
  | "article"
  | "resource";

export type Audience = "consumer" | "academy" | "institute" | "clinical" | "admin";

export type StudioStatus =
  | "draft"
  | "in_review"
  | "changes_requested"
  | "approved"
  | "published"
  | "retired";

export type Provenance = "human" | "ai_generated" | "ai_assisted";

export type ReviewAction =
  | "create"
  | "update"
  | "submit_for_review"
  | "approve"
  | "request_changes"
  | "publish"
  | "unpublish"
  | "retire"
  | "ai_generate"
  | "restore"
  | "delete";

// Which object types Phase A can author. Every type is registered so the
// governance spine tracks it uniformly; only the ones with a wired publisher
// (see lib/studioWorkflow.ts) can actually go live in Phase A — the rest are
// authored/versioned/reviewed now and gain publishers in later phases.
export const OBJECT_TYPES: { value: ObjectType; label: string; phase: "A" | "B" | "C" | "D" }[] = [
  { value: "article", label: "Article", phase: "A" },
  { value: "practice", label: "Practice", phase: "C" },
  { value: "worksheet", label: "Worksheet", phase: "C" },
  { value: "activity", label: "Activity", phase: "C" },
  { value: "lesson", label: "Lesson", phase: "C" },
  { value: "course", label: "Course", phase: "C" },
  { value: "resource", label: "Resource", phase: "C" },
  { value: "assessment", label: "Assessment", phase: "B" },
  { value: "assessment_item", label: "Assessment item", phase: "B" },
  { value: "scoring_rule", label: "Scoring rule", phase: "B" },
  { value: "result_template", label: "Result template", phase: "B" },
  { value: "recommendation_map", label: "Recommendation mapping", phase: "D" },
];

// Object types whose publisher is wired in Phase A (a full publish round-trip
// into a live canonical table works today). Keep in sync with PUBLISHERS in
// lib/studioWorkflow.ts.
export const PUBLISHABLE_TYPES: ObjectType[] = ["article"];

export const AUDIENCES: { value: Audience; label: string; ownerOnly: boolean }[] = [
  { value: "consumer", label: "Consumer (public)", ownerOnly: false },
  { value: "academy", label: "Academy (members)", ownerOnly: false },
  { value: "institute", label: "Institute (professionals)", ownerOnly: false },
  { value: "clinical", label: "Clinical", ownerOnly: true },
  { value: "admin", label: "Administrative", ownerOnly: true },
];

export const OWNER_ONLY_AUDIENCES: Audience[] = ["clinical", "admin"];

export function isOwnerOnlyAudience(a: string): boolean {
  return (OWNER_ONLY_AUDIENCES as string[]).includes(a);
}

export const STATUS_LABELS: Record<StudioStatus, string> = {
  draft: "Draft",
  in_review: "In review",
  changes_requested: "Changes requested",
  approved: "Approved",
  published: "Published",
  retired: "Retired",
};

export const PROVENANCE_LABELS: Record<Provenance, string> = {
  human: "Human",
  ai_generated: "AI-generated",
  ai_assisted: "AI-assisted",
};

export interface KbCompetency {
  id: string;
  code: string | null;
  kind: string; // phase | domain | competency
  phase_slug: string | null;
  domain_slug: string | null;
  competency_phase_slug: string | null;
  name: string;
  definition: string | null;
  developmental_task: string | null;
  healthy_markers: string[];
  common_challenges: string[];
  growth_indicators: string[];
  audiences: string[];
  status: string; // active | retired
  source_ref: string | null;
  notes: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface StudioObject {
  id: string;
  object_type: ObjectType;
  audience: Audience;
  title: string;
  slug: string | null;
  status: StudioStatus;
  provenance: Provenance;
  current_version: number;
  published_version: number | null;
  canonical_ref: { table: string; id: string } | null;
  kb_refs: string[];
  summary: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudioVersion {
  id: string;
  object_id: string;
  version_no: number;
  body: Record<string, unknown>;
  provenance: Provenance;
  status_at: string | null;
  authored_by: string | null;
  note: string | null;
  created_at: string;
}

export interface StudioReview {
  id: string;
  object_id: string;
  version_no: number | null;
  action: ReviewAction;
  actor: string | null;
  notes: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Lifecycle rules — the single source of truth for who can do what, mirrored
// server-side in lib/studioWorkflow.ts. Editors draft & submit; ONLY the owner
// approves, publishes, retires. AI can only ever produce drafts.
// ---------------------------------------------------------------------------

// action -> the statuses it's valid FROM, and whether it's owner-only.
const TRANSITIONS: Record<
  Exclude<ReviewAction, "create" | "update" | "ai_generate" | "restore" | "delete">,
  { from: StudioStatus[]; ownerOnly: boolean }
> = {
  submit_for_review: { from: ["draft", "changes_requested"], ownerOnly: false },
  request_changes: { from: ["in_review"], ownerOnly: true },
  approve: { from: ["in_review"], ownerOnly: true },
  publish: { from: ["approved"], ownerOnly: true },
  unpublish: { from: ["published"], ownerOnly: true },
  retire: { from: ["draft", "changes_requested", "approved", "published"], ownerOnly: true },
};

export function canTransition(
  action: keyof typeof TRANSITIONS,
  status: StudioStatus,
  role: StudioRole
): boolean {
  const rule = TRANSITIONS[action];
  if (!rule) return false;
  if (!rule.from.includes(status)) return false;
  if (rule.ownerOnly && role !== "owner") return false;
  if (!rule.ownerOnly && role !== "owner" && role !== "editor") return false;
  return true;
}

// The next status a successful transition lands on.
export function nextStatus(action: keyof typeof TRANSITIONS): StudioStatus {
  switch (action) {
    case "submit_for_review": return "in_review";
    case "request_changes": return "changes_requested";
    case "approve": return "approved";
    case "publish": return "published";
    case "unpublish": return "draft";
    case "retire": return "retired";
  }
}

// The workflow actions available to `role` on an object in `status`.
export function availableActions(status: StudioStatus, role: StudioRole): (keyof typeof TRANSITIONS)[] {
  return (Object.keys(TRANSITIONS) as (keyof typeof TRANSITIONS)[]).filter((a) =>
    canTransition(a, status, role)
  );
}

/** Whether the body can still be edited (drafts + change requests only). */
export function isEditable(status: StudioStatus): boolean {
  return status === "draft" || status === "changes_requested";
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
