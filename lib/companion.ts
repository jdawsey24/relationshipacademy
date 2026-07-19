// Relationship Companion — client-safe constants & types (NO server imports, so
// this is importable from client components). Server logic lives in
// lib/companionAuth.ts and lib/companion/*.

// ---------------------------------------------------------------------------
// Feature flag — keep the Companion hidden until launch. Off unless explicitly
// enabled. (Pre-launch we also simply don't surface nav/preview links.)
// ---------------------------------------------------------------------------
export const COMPANION_ENABLED = process.env.NEXT_PUBLIC_COMPANION_ENABLED === "true";
export const COMPANION_PRODUCT_KEY = "companion";
// Stripe Price lookup_key for the one-time Companion purchase. The owner creates
// a Price with this lookup_key (metadata product_key="companion",
// billing_type="one_time") in Stripe; checkout is inert until it exists.
export const COMPANION_PRICE_LOOKUP_KEY = "companion_onetime";

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

// ---------------------------------------------------------------------------
// Blueprint sections (living, completed gradually). Labels are consumer-facing;
// descriptions are placeholders until approved copy is supplied.
// ---------------------------------------------------------------------------
export const BLUEPRINT_SECTIONS = [
  { key: "vision", label: "Relationship vision" },
  { key: "core_values", label: "Core values" },
  { key: "emotional_safety", label: "What helps me feel emotionally safe" },
  { key: "what_makes_me_withdraw", label: "What makes me withdraw" },
  { key: "what_helps_me_trust", label: "What helps me trust" },
  { key: "what_overwhelms_me", label: "What overwhelms me" },
  { key: "what_helps_me_reconnect", label: "What helps me reconnect" },
  { key: "experiences_that_shaped_me", label: "Experiences that shaped me" },
  { key: "lessons_learned", label: "Lessons I have learned" },
  { key: "patterns_to_change", label: "Patterns I want to change" },
  { key: "strengths_developed", label: "Strengths I have developed" },
  { key: "qualities_to_embody", label: "Qualities I want to embody" },
  { key: "qualities_i_value", label: "Qualities I value in relationships" },
  { key: "green_flags", label: "Green flags" },
  { key: "yellow_flags", label: "Yellow flags" },
  { key: "red_flags", label: "Red flags" },
  { key: "boundaries", label: "Boundaries" },
  { key: "non_negotiables", label: "Non-negotiables" },
  { key: "support_system", label: "Support system" },
  { key: "growth_priorities", label: "Current growth priorities" },
  { key: "relationship_commitment", label: "Personal relationship commitment" },
] as const;
export type BlueprintSectionKey = (typeof BLUEPRINT_SECTIONS)[number]["key"];
export const BLUEPRINT_SECTION_KEYS = new Set<string>(BLUEPRINT_SECTIONS.map((s) => s.key));

// Conversation Planner fields (launchable standalone or from an experience).
export const PLANNER_FIELDS = [
  { key: "discuss", label: "What do I want to discuss?" },
  { key: "why_matters", label: "Why does this matter?" },
  { key: "hoped_outcome", label: "What outcome am I hoping for?" },
  { key: "facts", label: "What facts do I know?" },
  { key: "assumptions", label: "What assumptions am I making?" },
  { key: "want_understood", label: "What do I want the other person to understand?" },
  { key: "want_to_understand", label: "What do I want to understand from them?" },
  { key: "boundary_request", label: "What boundary, request, or need do I want to communicate?" },
  { key: "how_communicate", label: "How do I want to communicate it?" },
  { key: "respectful_looks_like", label: "What would a respectful conversation look like?" },
  { key: "when_where", label: "When and where should the conversation happen?" },
  { key: "after_reflection", label: "After-conversation reflection" },
] as const;
export type PlannerFieldKey = (typeof PLANNER_FIELDS)[number]["key"];
export const PLANNER_FIELD_KEYS = new Set<string>(PLANNER_FIELDS.map((f) => f.key));

// Entitlement grant sources (extensible; V1 uses one_time_purchase).
export const ENTITLEMENT_SOURCES = [
  "one_time_purchase", "bundle", "academy_inclusion", "promotional", "manual_grant", "subscription",
] as const;
export type EntitlementSource = (typeof ENTITLEMENT_SOURCES)[number];
