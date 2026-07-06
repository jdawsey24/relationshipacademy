import { getSupabaseAdminClient } from "@/lib/supabase";
import { tierRank } from "@/lib/academy";
import type {
  Announcement,
  Course,
  CourseWithContent,
  JournalEntry,
  Lesson,
  LessonProgress,
  ModuleWithLessons,
  Workbook,
} from "@/lib/academy";

// Server-only Academy reads. All go through the service role (content tables are
// RLS-locked, not world-readable) and are RESILIENT: if the Academy migration
// hasn't run yet, every function returns an empty result instead of throwing, so
// the portal renders an empty state rather than a 500.

export async function getPublishedCourses(): Promise<Course[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data, error } = await s
      .from("courses")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    if (error) return [];
    return (data as Course[]) ?? [];
  } catch {
    return [];
  }
}

/** A published course with its ordered modules + published lessons, or null. */
export async function getCourseWithContent(
  slug: string
): Promise<CourseWithContent | null> {
  try {
    const s = getSupabaseAdminClient();
    const { data: course } = await s
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (!course) return null;

    const { data: modules } = await s
      .from("modules")
      .select("*")
      .eq("course_id", course.id)
      .order("sort_order", { ascending: true });

    const { data: lessons } = await s
      .from("lessons")
      .select("*")
      .eq("course_id", course.id)
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    const byModule = (modules ?? []).map<ModuleWithLessons>((m) => ({
      ...m,
      lessons: (lessons ?? []).filter((l: Lesson) => l.module_id === m.id),
    }));

    return { ...(course as Course), modules: byModule };
  } catch {
    return null;
  }
}

/** Flat, ordered list of a course's published lessons (for prev/next). */
export function flattenLessons(course: CourseWithContent): Lesson[] {
  return course.modules.flatMap((m) => m.lessons);
}

export async function getProgress(
  userId: string,
  courseId?: string
): Promise<LessonProgress[]> {
  try {
    const s = getSupabaseAdminClient();
    let q = s.from("lesson_progress").select("*").eq("user_id", userId);
    if (courseId) q = q.eq("course_id", courseId);
    const { data, error } = await q;
    if (error) return [];
    return (data as LessonProgress[]) ?? [];
  } catch {
    return [];
  }
}

export async function getJournalEntries(
  userId: string,
  filter?: { courseId?: string; lessonId?: string }
): Promise<JournalEntry[]> {
  try {
    const s = getSupabaseAdminClient();
    let q = s.from("journal_entries").select("*").eq("user_id", userId);
    if (filter?.courseId) q = q.eq("course_id", filter.courseId);
    if (filter?.lessonId) q = q.eq("lesson_id", filter.lessonId);
    const { data, error } = await q.order("updated_at", { ascending: false });
    if (error) return [];
    return (data as JournalEntry[]) ?? [];
  } catch {
    return [];
  }
}

export async function getWorkbooks(courseId?: string): Promise<Workbook[]> {
  try {
    const s = getSupabaseAdminClient();
    let q = s
      .from("workbooks")
      .select("*")
      .eq("status", "published");
    if (courseId) q = q.eq("course_id", courseId);
    const { data, error } = await q.order("sort_order", { ascending: true });
    if (error) return [];
    return (data as Workbook[]) ?? [];
  } catch {
    return [];
  }
}

/** Published announcements visible to a member at `tier`, newest first. */
export async function getAnnouncements(tier: string): Promise<Announcement[]> {
  try {
    const s = getSupabaseAdminClient();
    const { data, error } = await s
      .from("announcements")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) return [];
    return ((data as Announcement[]) ?? []).filter(
      (a) => tierRank(tier) >= tierRank(a.min_tier)
    );
  } catch {
    return [];
  }
}

/** Course rows keyed by id — handy for labeling journal/progress lists. */
export async function getCourseTitleMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const s = getSupabaseAdminClient();
    const { data } = await s.from("courses").select("id, title, slug");
    for (const c of data ?? []) map.set(c.id, c.title);
  } catch {
    /* empty */
  }
  return map;
}
