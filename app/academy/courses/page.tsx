import Link from "next/link";
import { redirect } from "next/navigation";
import { getMember, memberCanAccess } from "@/lib/academyAuth";
import { getPublishedCourses, getCourseWithContent, getProgress } from "@/lib/academyData";
import { coursePercent, courseLessons, type CourseWithContent } from "@/lib/academy";
import { ProgressBar, TierBadge, LockPill } from "@/components/academy/ui";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const member = await getMember();
  if (!member) redirect("/academy/login");

  const [courses, progress] = await Promise.all([
    getPublishedCourses(),
    getProgress(member.user.id),
  ]);
  const full = (
    await Promise.all(courses.map((c) => getCourseWithContent(c.slug)))
  ).filter(Boolean) as CourseWithContent[];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">Courses</h1>
        <p className="mt-2 max-w-2xl font-body text-charcoal/70">
          Structured, self-paced learning for the Relationship Life Cycle™.
        </p>
      </header>

      {full.length === 0 ? (
        <p className="font-body text-charcoal/60">No courses are published yet. Check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {full.map((course) => {
            const lessons = courseLessons(course);
            const percent = coursePercent(course, progress);
            const unlocked = memberCanAccess(member, course.min_tier);
            // A course with any preview lesson is still worth entering when locked.
            const hasPreview = lessons.some((l) => l.is_preview);
            return (
              <Link
                key={course.id}
                href={`/academy/courses/${course.slug}`}
                className="group flex flex-col rounded-2xl border border-midnight-navy/10 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-2">
                  {unlocked ? <TierBadge tier={course.min_tier} /> : <LockPill />}
                  {!unlocked && hasPreview && (
                    <span className="font-ui text-xs text-sage-green">Preview available</span>
                  )}
                </div>
                <h2 className="font-display text-xl font-semibold text-midnight-navy group-hover:underline">
                  {course.title}
                </h2>
                {course.subtitle && (
                  <p className="mt-1 font-body text-sm text-charcoal/70">{course.subtitle}</p>
                )}
                <div className="mt-4 flex items-center gap-3 font-ui text-xs text-charcoal/60">
                  <span>{lessons.length} lesson{lessons.length === 1 ? "" : "s"}</span>
                  {course.estimated_minutes ? <span>· {course.estimated_minutes} min</span> : null}
                </div>
                {percent > 0 && (
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between font-ui text-xs text-charcoal/60">
                      <span>Progress</span><span>{percent}%</span>
                    </div>
                    <ProgressBar percent={percent} />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
