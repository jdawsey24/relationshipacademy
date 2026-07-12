// Client-safe config for the Learning Library (Phase C). No server imports.
// Each entry describes one competency-keyed content type: its table, business-
// key column, display label column, and which filters apply. Drives the generic
// list/edit APIs + UI so all eleven types share one code path.

export interface LibraryConfig {
  table: string;
  pk: string;
  label: string;
  labelCol: string;      // primary display + search column
  competencyCol: string | null; // column to filter competency by, or null
  hasDomain: boolean;
  hasPhase: boolean;
  idPrefix: string;      // business-ID prefix, used when minting AI-drafted rows
  generatable: boolean;  // AI authoring assist offered for this type
  reference?: boolean;   // indicators default to 'active', not 'draft'
}

export const LEARNING_TABLES = {
  practices: { table: "studio_practices", pk: "practice_id", label: "Practices", labelCol: "name", competencyCol: "competency_id", hasDomain: true, hasPhase: true, idPrefix: "PRA", generatable: true },
  activities: { table: "studio_activities", pk: "activity_id", label: "Activities", labelCol: "name", competencyCol: "competency_id", hasDomain: true, hasPhase: true, idPrefix: "ACT", generatable: true },
  interventions: { table: "studio_interventions", pk: "intervention_id", label: "Interventions", labelCol: "name", competencyCol: "competency_id", hasDomain: true, hasPhase: true, idPrefix: "INT", generatable: true },
  worksheets: { table: "studio_worksheets", pk: "worksheet_id", label: "Worksheets", labelCol: "title", competencyCol: "competency_id", hasDomain: true, hasPhase: true, idPrefix: "WS", generatable: true },
  "conversation-guides": { table: "studio_conversation_guides", pk: "guide_id", label: "Conversation Guides", labelCol: "title", competencyCol: "competency_id", hasDomain: true, hasPhase: true, idPrefix: "CG", generatable: true },
  "journal-prompts": { table: "studio_journal_prompts", pk: "prompt_id", label: "Journal Prompts", labelCol: "title", competencyCol: "competency_id", hasDomain: true, hasPhase: true, idPrefix: "JP", generatable: true },
  videos: { table: "studio_videos", pk: "video_id", label: "Videos", labelCol: "title", competencyCol: "competency_id", hasDomain: true, hasPhase: true, idPrefix: "VID", generatable: true },
  lessons: { table: "studio_lessons", pk: "lesson_id", label: "Academy Lessons", labelCol: "title", competencyCol: null, hasDomain: true, hasPhase: true, idPrefix: "LES", generatable: true },
  courses: { table: "studio_courses", pk: "course_id", label: "Courses", labelCol: "name", competencyCol: null, hasDomain: true, hasPhase: true, idPrefix: "COURSE", generatable: false },
  "behavioral-indicators": { table: "studio_behavioral_indicators", pk: "behavior_id", label: "Behavioral Indicators", labelCol: "indicator", competencyCol: "competency_id", hasDomain: true, hasPhase: true, idPrefix: "BI", generatable: false, reference: true },
  "incomplete-indicators": { table: "studio_incomplete_indicators", pk: "indicator_id", label: "Incomplete Indicators", labelCol: "indicator", competencyCol: "competency_id", hasDomain: true, hasPhase: true, idPrefix: "II", generatable: false, reference: true },
} as const satisfies Record<string, LibraryConfig>;

export type LibraryType = keyof typeof LEARNING_TABLES;

export function isLibraryType(k: string): k is LibraryType {
  return k in LEARNING_TABLES;
}

// Display order for the nav.
export const LIBRARY_ORDER: LibraryType[] = [
  "practices", "activities", "interventions", "worksheets", "conversation-guides",
  "journal-prompts", "videos", "lessons", "courses", "behavioral-indicators", "incomplete-indicators",
];
