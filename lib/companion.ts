// Relationship Companion — client-safe constants & types (NO server imports, so
// this is importable from client components). Server logic lives in
// lib/companionAuth.ts and lib/companion/*.

// ---------------------------------------------------------------------------
// Feature flag — keep the Companion hidden until launch. Off unless explicitly
// enabled. (Pre-launch we also simply don't surface nav/preview links.)
// ---------------------------------------------------------------------------
export const COMPANION_ENABLED = process.env.NEXT_PUBLIC_COMPANION_ENABLED === "true";
export const COMPANION_PRODUCT_KEY = "companion";

// ---------------------------------------------------------------------------
// Relationship status (consumer labels; internal structural context stored in DB).
// Status and developmental phase are SEPARATE — never derive a phase from status.
// ---------------------------------------------------------------------------
export const RELATIONSHIP_STATUSES = [
  { key: "single", label: "Single" },
  { key: "dating", label: "Dating" },
  { key: "committed", label: "Committed Relationship" },
  { key: "engaged", label: "Engaged" },
  { key: "married", label: "Married" },
] as const;
export type RelationshipStatusKey = (typeof RELATIONSHIP_STATUSES)[number]["key"];

// Onboarding interest topics (preference filters only — never assessment results).
export const INTEREST_TOPICS = [
  "Dating", "Communication", "Trust", "Conflict", "Boundaries", "Emotional connection",
  "Physical intimacy", "Shared responsibilities", "Decisions", "Healing", "Personal growth",
] as const;

// ---------------------------------------------------------------------------
// The 22 guided-experience block types. Renderer registers one component each.
// ---------------------------------------------------------------------------
export const BLOCK_TYPES = [
  { type: "intro_context", label: "Introductory context", input: false },
  { type: "educational_note", label: "Educational note", input: false },
  { type: "reflection_single", label: "Single-line reflection", input: true },
  { type: "reflection_long", label: "Long-form reflection", input: true },
  { type: "reflection_multiple_choice", label: "Multiple-choice reflection", input: true },
  { type: "checkbox_select", label: "Checkbox selection", input: true },
  { type: "emotion_select", label: "Emotion selection", input: true },
  { type: "fact_vs_assumption", label: "Fact-versus-assumption sorting", input: true },
  { type: "perspective_taking", label: "Perspective-taking prompt", input: true },
  { type: "values_check", label: "Values check", input: true },
  { type: "needs_identification", label: "Needs identification", input: true },
  { type: "boundary_reflection", label: "Boundary reflection", input: true },
  { type: "decision_comparison", label: "Decision comparison", input: true },
  { type: "conversation_planner", label: "Conversation planner", input: true },
  { type: "ownership_reflection", label: "Responsibility or ownership reflection", input: true },
  { type: "pattern_recognition", label: "Pattern recognition", input: true },
  { type: "practice_recommendation", label: "Practice recommendation", input: false },
  { type: "safety_notice", label: "Safety notice", input: false },
  { type: "professional_support", label: "Professional-support recommendation", input: false },
  { type: "closing_summary", label: "Closing summary", input: false },
  { type: "user_next_step", label: "User-created next step", input: true },
  { type: "free_write", label: "Free-write block", input: true },
] as const;
export type BlockType = (typeof BLOCK_TYPES)[number]["type"];
export const BLOCK_TYPE_SET = new Set<string>(BLOCK_TYPES.map((b) => b.type));
export const isInputBlock = (type: string) => BLOCK_TYPES.find((b) => b.type === type)?.input ?? false;

// ---------------------------------------------------------------------------
// Content governance ladder + transition engine (mirrors lib/studio.ts).
// Draft -> Internal Review -> Theory Review -> Clinical/Safety Review ->
// Approved -> Published -> Archived. Editors submit; only owner advances/publishes.
// ---------------------------------------------------------------------------
export const CONTENT_STATUSES = [
  "draft", "internal_review", "theory_review", "safety_review", "approved", "published", "archived",
] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Draft", internal_review: "Internal Review", theory_review: "Theory Review",
  safety_review: "Clinical / Safety Review", approved: "Approved", published: "Published", archived: "Archived",
};

export type ContentAction =
  | "submit_for_review" | "advance" | "request_changes" | "approve" | "publish" | "unpublish" | "revise" | "archive" | "restore";

// from -> action -> { to, ownerOnly }. `revise` reopens an approved item for
// editing (a new draft cycle) WITHOUT touching the already-published version.
export const TRANSITIONS: Record<ContentStatus, Partial<Record<ContentAction, { to: ContentStatus; ownerOnly: boolean }>>> = {
  draft:           { submit_for_review: { to: "internal_review", ownerOnly: false } },
  internal_review: { advance: { to: "theory_review", ownerOnly: true }, request_changes: { to: "draft", ownerOnly: true } },
  theory_review:   { advance: { to: "safety_review", ownerOnly: true }, request_changes: { to: "draft", ownerOnly: true } },
  safety_review:   { approve: { to: "approved", ownerOnly: true }, request_changes: { to: "draft", ownerOnly: true } },
  approved:        { publish: { to: "published", ownerOnly: true }, revise: { to: "draft", ownerOnly: true }, archive: { to: "archived", ownerOnly: true } },
  published:       { unpublish: { to: "approved", ownerOnly: true }, archive: { to: "archived", ownerOnly: true } },
  archived:        { restore: { to: "draft", ownerOnly: true } },
};

export function canTransition(from: ContentStatus, action: ContentAction, isOwner: boolean): boolean {
  const t = TRANSITIONS[from]?.[action];
  return !!t && (!t.ownerOnly || isOwner);
}
export function nextStatus(from: ContentStatus, action: ContentAction): ContentStatus | null {
  return TRANSITIONS[from]?.[action]?.to ?? null;
}
// Draft blocks are editable only while a Draft (or after request_changes returns to Draft).
export function isEditable(status: ContentStatus): boolean {
  return status === "draft";
}

// Entitlement grant sources (extensible; V1 uses one_time_purchase).
export const ENTITLEMENT_SOURCES = [
  "one_time_purchase", "bundle", "academy_inclusion", "promotional", "manual_grant", "subscription",
] as const;
export type EntitlementSource = (typeof ENTITLEMENT_SOURCES)[number];
