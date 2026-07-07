// Client-safe Academy types, tier constants, and pure helpers.
// NO server imports here — this file is imported by client components too.

export type MembershipTier = "free" | "academy" | "academy_plus" | "professional";

// Numeric ranking so gating is a simple `>=`. "Admin" is NOT a tier — staff
// (app_metadata.role owner/editor) get a full-access override in academyAuth.
export const TIER_RANK: Record<MembershipTier, number> = {
  free: 0,
  academy: 1,
  academy_plus: 2,
  professional: 3,
};

export const TIERS: { value: MembershipTier; label: string; blurb: string }[] = [
  { value: "free", label: "Free", blurb: "Sample lessons and previews" },
  { value: "academy", label: "Academy", blurb: "Full course library" },
  { value: "academy_plus", label: "Academy Plus", blurb: "Courses + community & live resources" },
  { value: "professional", label: "Professional", blurb: "Clinician & professional training" },
];

export function tierRank(tier: string | null | undefined): number {
  return TIER_RANK[(tier as MembershipTier)] ?? 0;
}

export function tierLabel(tier: string | null | undefined): string {
  return TIERS.find((t) => t.value === tier)?.label ?? "Free";
}

// ---------------------------------------------------------------------------
// Row shapes (mirror migration 0010)
// ---------------------------------------------------------------------------
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  membership_tier: MembershipTier;
  skool_joined: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  audience: string | null;
  learning_objectives: string[];
  estimated_minutes: number | null;
  min_tier: MembershipTier;
  cover_image_url: string | null;
  sort_order: number;
  status: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  summary: string | null;
  sort_order: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  course_id: string;
  slug: string;
  title: string;
  video_url: string | null;
  content: string | null;
  key_takeaways: string | null;
  reflection_questions: string[];
  homework: string | null;
  workbook_url: string | null;
  skool_url: string | null;
  min_tier: MembershipTier;
  is_preview: boolean;
  estimated_minutes: number | null;
  sort_order: number;
  status: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  status: "started" | "completed";
  last_viewed_at: string;
  completed_at: string | null;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  lesson_id: string | null;
  course_id: string | null;
  title: string | null;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface Workbook {
  id: string;
  course_id: string | null;
  lesson_id: string | null;
  title: string;
  description: string | null;
  file_url: string | null;
  min_tier: MembershipTier;
  sort_order: number;
  status: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  serial: string;
  recipient_name: string | null;
  course_title: string | null;
  issued_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string | null;
  min_tier: MembershipTier;
  status: string;
  published_at: string;
}

// A module with its ordered lessons; a course with its ordered modules.
export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}
export interface CourseWithContent extends Course {
  modules: ModuleWithLessons[];
}

// ---------------------------------------------------------------------------
// Pure progress helpers
// ---------------------------------------------------------------------------
export function courseLessons(course: CourseWithContent): Lesson[] {
  return course.modules.flatMap((m) => m.lessons);
}

/** Percentage (0–100) of a course's lessons the user has completed. */
export function coursePercent(
  course: CourseWithContent,
  progress: LessonProgress[]
): number {
  const lessons = courseLessons(course);
  if (lessons.length === 0) return 0;
  const done = new Set(
    progress.filter((p) => p.status === "completed").map((p) => p.lesson_id)
  );
  const completed = lessons.filter((l) => done.has(l.id)).length;
  return Math.round((completed / lessons.length) * 100);
}

/** Access rule shared by course and lesson: preview OR tier reaches min OR staff. */
export function meetsTier(
  minTier: string,
  userTier: MembershipTier,
  isStaff: boolean
): boolean {
  return isStaff || tierRank(userTier) >= tierRank(minTier);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
