import { redirect } from "next/navigation";
import { getMember } from "@/lib/academyAuth";
import { getJournalEntries, getPublishedCourses, getCourseWithContent } from "@/lib/academyData";
import { courseLessons, type CourseWithContent } from "@/lib/academy";
import JournalManager from "@/components/academy/JournalManager";

export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const member = await getMember();
  if (!member) redirect("/academy/login");

  const [entries, courses] = await Promise.all([
    getJournalEntries(member.user.id),
    getPublishedCourses(),
  ]);
  const full = (
    await Promise.all(courses.map((c) => getCourseWithContent(c.slug)))
  ).filter(Boolean) as CourseWithContent[];

  // Lesson lookup so lesson-linked entries can deep-link back.
  const lessons: Record<string, { id: string; slug: string; title: string; courseSlug: string }> = {};
  for (const c of full) {
    for (const l of courseLessons(c)) {
      lessons[l.id] = { id: l.id, slug: l.slug, title: l.title, courseSlug: c.slug };
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">Journal</h1>
        <p className="mt-2 max-w-2xl font-body text-charcoal/70">
          A private space for your reflections. Only you can see what you write here.
        </p>
      </header>
      <JournalManager
        initialEntries={entries}
        courses={courses.map((c) => ({ id: c.id, title: c.title, slug: c.slug }))}
        lessons={lessons}
      />
    </div>
  );
}
