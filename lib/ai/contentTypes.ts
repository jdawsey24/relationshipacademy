// Client-safe config for the Content Builder's per-type forms (AIS-2/3).

export const CONTENT_ASSET_TYPES = ["worksheet", "lesson", "practice", "conversation_guide", "journal_prompt", "activity", "video_outline"] as const;
export type ContentAssetType = (typeof CONTENT_ASSET_TYPES)[number];

export const CONTENT_TYPE_LABELS: Record<ContentAssetType, string> = {
  worksheet: "Worksheet", lesson: "Lesson", practice: "Practice", conversation_guide: "Conversation Guide",
  journal_prompt: "Journal Prompt", activity: "Activity", video_outline: "Video Outline",
};

export interface FormField {
  key: string;
  label: string;
  kind: "select" | "text" | "checkbox";
  options?: string[];
  default?: string;
}

const READING = ["Grade 3", "Grade 5", "Grade 8", "Professional"];
const VERSION = ["Consumer", "Professional"];

// Per-type parameter fields. Competency + audience + optional instructions are
// rendered commonly by the page.
export const CONTENT_FORMS: Record<ContentAssetType, FormField[]> = {
  worksheet: [
    { key: "delivery_setting", label: "Delivery setting", kind: "select", options: ["Self-guided", "Facilitated", "Couples", "Group"] },
    { key: "length", label: "Length", kind: "select", options: ["Short", "Medium", "Long"], default: "Medium" },
    { key: "difficulty", label: "Difficulty", kind: "select", options: ["Beginner", "Intermediate", "Advanced"] },
    { key: "reading_level", label: "Reading level", kind: "select", options: READING, default: "Grade 5" },
    { key: "version", label: "Version", kind: "select", options: VERSION },
    { key: "access_level", label: "Access level", kind: "select", options: ["Public", "Academy", "Academy Plus", "Institute"], default: "Academy" },
    { key: "facilitator_required", label: "Facilitator required", kind: "checkbox" },
  ],
  lesson: [
    { key: "duration", label: "Duration", kind: "select", options: ["10 min", "20 min", "30 min", "45 min", "60 min"], default: "20 min" },
    { key: "delivery_format", label: "Delivery format", kind: "select", options: ["Self-paced", "Live", "Video", "Reading"] },
    { key: "reading_level", label: "Reading level", kind: "select", options: READING, default: "Grade 8" },
    { key: "version", label: "Version", kind: "select", options: VERSION },
    { key: "certificate_relevance", label: "Certificate / CE", kind: "select", options: ["None", "Certificate", "CE"] },
  ],
  practice: [
    { key: "practice_type", label: "Practice type", kind: "select", options: ["Daily", "Weekly", "Guided", "In-the-moment"], default: "Guided" },
    { key: "difficulty", label: "Difficulty", kind: "select", options: ["Beginner", "Intermediate", "Advanced"] },
    { key: "estimated_duration", label: "Estimated duration", kind: "select", options: ["5-10 min", "10-20 min", "20-30 min"] },
    { key: "reading_level", label: "Reading level", kind: "select", options: READING, default: "Grade 5" },
  ],
  conversation_guide: [
    { key: "setting", label: "Setting", kind: "select", options: ["Individual", "Couple", "Facilitator"] },
    { key: "depth", label: "Depth", kind: "select", options: ["Light", "Moderate", "Deep"] },
  ],
  journal_prompt: [
    { key: "use_case", label: "Use case", kind: "select", options: ["Strength Identification", "Growth", "Repair", "Reflection"] },
    { key: "depth", label: "Depth", kind: "select", options: ["Brief", "Moderate", "Deep"] },
  ],
  activity: [
    { key: "setting", label: "Setting", kind: "select", options: ["Individual", "Couple", "Group"] },
    { key: "activity_type", label: "Activity type", kind: "select", options: ["Lab", "Role-play", "Experiential", "Discussion"], default: "Experiential" },
    { key: "facilitator_required", label: "Facilitator required", kind: "checkbox" },
  ],
  video_outline: [
    { key: "video_type", label: "Video type", kind: "select", options: ["Concept Lesson", "Skill Demo", "Story"], default: "Concept Lesson" },
    { key: "length", label: "Length", kind: "select", options: ["Short", "Medium", "Long"] },
    { key: "reading_level", label: "Reading level", kind: "select", options: READING, default: "Grade 8" },
  ],
};

// Review-Mode target types (existing assets that can be reviewed).
export const REVIEW_TARGET_TYPES = [
  { value: "worksheet", label: "Worksheet" },
  { value: "lesson", label: "Lesson" },
  { value: "practice", label: "Practice" },
  { value: "activity", label: "Activity" },
  { value: "conversation_guide", label: "Conversation Guide" },
  { value: "journal_prompt", label: "Journal Prompt" },
  { value: "item", label: "Assessment Item" },
] as const;
