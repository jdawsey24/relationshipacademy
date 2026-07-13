// Client-safe publishing config. Approved Content Library records are routed to
// destinations via publication_mappings — one source, many destination mappings,
// no per-destination duplication.

export const DESTINATIONS = [
  { value: "resource_library", label: "Public Resource Library", public: true },
  { value: "my_journey", label: "My Journey", public: false },
  { value: "assessment_results", label: "Assessment Results", public: false },
  { value: "academy", label: "Relationship Academy", public: false },
  { value: "academy_plus", label: "Academy Plus", public: false },
  { value: "institute", label: "Professional Institute", public: false },
  { value: "course_lessons", label: "Course Lessons", public: false },
  { value: "book_companions", label: "Book Companions", public: false },
  { value: "internal", label: "Internal Library", public: false },
] as const;

export type Destination = (typeof DESTINATIONS)[number]["value"];

export function isDestination(v: string): v is Destination {
  return DESTINATIONS.some((d) => d.value === v);
}

export const PUBLISH_SOURCE_TYPES = [
  { value: "worksheet", label: "Worksheets" },
  { value: "lesson", label: "Lessons" },
  { value: "practice", label: "Practices" },
  { value: "activity", label: "Activities" },
  { value: "conversation_guide", label: "Conversation Guides" },
  { value: "journal_prompt", label: "Journal Prompts" },
  { value: "video", label: "Videos" },
  { value: "item", label: "Assessment Items" },
] as const;

export type PublishSourceType = (typeof PUBLISH_SOURCE_TYPES)[number]["value"];

export interface PublishableRecord {
  source_type: string;
  id: string;
  label: string;
  destinations: string[]; // active destinations this record is published to
}

export interface PublishedContent {
  source_type: string;
  id: string;
  title: string;
  description: string;
}
