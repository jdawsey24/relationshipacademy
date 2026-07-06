import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getMember, memberCanAccess } from "@/lib/academyAuth";
import { getCourseWithContent, getProgress } from "@/lib/academyData";
import { coursePercent, courseLessons } from "@/lib/academy";
import { ProgressBar, TierBadge, LockPill, PreviewPill, Panel } from "@/components/academy/ui";

export const dynamic = "force-dynamic";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const member = await getMember();
  if (!member) redirect("/academy/login");
  const { courseSlug } = await params;

  const course = await getCourseWithContent(courseSlug);
  if (!course) notFound();

  const progress = await getProgress(member.user.id, course.id);
  const completed = new Set(
    progress.filter((p) => p.status === "completed").map((p) => p.lesson_id)
  );
  const percent = coursePercent(course, progress);
  const lessons = courseLessons(course);
  const courseUnlocked = memberCanAccess(member, course.min_tier);

  // First not-completed accessible lesson → the primary CTA target.
  const nextLesson =
    lessons.find(
      (l) => !completed.has(l.id) && (l.is_preview || memberCanAccess(member, l.min_tier))
    ) ?? lessons.find((l) => l.is_preview || memberCanAccess(member, l.min_tier));

  return (
    <div className="space-y-8">
      <nav className="font-ui text-sm text-charcoal/60">
        <Link href="/academy/courses" className="hover:text-midnight-navy">Courses</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{course.title}</span>
      </nav>

      {/* Header */}
      <header className="rounded-2xl border border-midnight-navy/10 bg-white p-7 sm:p-9">
        <div className="mb-3 flex items-center gap-2">
          {courseUnlocked ? <TierBadge tier={course.min_tier} /> : <LockPill label={`${tierName(course.min_tier)} tier`} />}
        </div>
        <h1 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">{course.title}</h1>
        {course.subtitle && <p className="mt-2 font-body text-lg text-charcoal/80">{course.subtitle}</p>}
        {course.description && <p className="mt-4 max-w-2xl font-body text-charcoal/70">{course.description}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-4 font-ui text-sm text-charcoal/60">
          <span>{lessons.length} lesson{lessons.length === 1 ? "" : "s"}</span>
          {course.estimated_minutes ? <span>· {course.estimated_minutes} min</span> : null}
          {course.audience ? <span>· For {course.audience}</span> : null}
        </div>

        {percent > 0 && (
          <div className="mt-6 max-w-md">
            <div className="mb-1 flex justify-between font-ui text-xs text-charcoal/60">
              <span>Your progress</span><span>{percent}%</span>
            </div>
            <ProgressBar percent={percent} />
          </div>
        )}

        {nextLesson && (
          <Link
            href={`/academy/courses/${course.slug}/${nextLesson.slug}`}
            className="mt-7 inline-block rounded-full bg-midnight-navy px-6 py-2.5 font-ui text-sm font-medium text-white hover:bg-midnight-navy/90"
          >
            {percent > 0 ? "Continue course" : "Start course"}
          </Link>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Curriculum */}
        <div className="lg:col-span-2 space-y-6">
          {course.modules.map((mod, mi) => (
            <Panel key={mod.id}>
              <p className="font-ui text-xs font-semibold uppercase tracking-[0.15em] text-plum">
                Module {mi + 1}
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold text-midnight-navy">{mod.title}</h2>
              {mod.summary && <p className="mt-1 font-body text-sm text-charcoal/70">{mod.summary}</p>}

              <ul className="mt-4 divide-y divide-midnight-navy/8">
                {mod.lessons.map((lesson, li) => {
                  const isDone = completed.has(lesson.id);
                  const accessible = lesson.is_preview || memberCanAccess(member, lesson.min_tier);
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/academy/courses/${course.slug}/${lesson.slug}`}
                        className="flex items-center gap-4 py-3 hover:opacity-90"
                      >
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-ui text-xs ${
                            isDone ? "bg-sage-green text-white" : "bg-midnight-navy/8 text-midnight-navy/70"
                          }`}
                        >
                          {isDone ? "✓" : li + 1}
                        </span>
                        <span className="flex-1 font-body text-midnight-navy">{lesson.title}</span>
                        {lesson.is_preview && !memberCanAccess(member, lesson.min_tier) && <PreviewPill />}
                        {!accessible && <LockPill />}
                        {lesson.estimated_minutes ? (
                          <span className="font-ui text-xs text-charcoal/50">{lesson.estimated_minutes} min</span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          ))}
        </div>

        {/* Objectives sidebar */}
        <div className="space-y-6">
          {course.learning_objectives.length > 0 && (
            <Panel title="What you'll learn">
              <ul className="space-y-2 font-body text-sm text-charcoal/80">
                {course.learning_objectives.map((o, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1 text-sage-green">✓</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
          {!courseUnlocked && (
            <Panel title="Unlock this course">
              <p className="font-body text-sm text-charcoal/70">
                This course is included with the {tierName(course.min_tier)} membership. Preview
                lessons are free — upgrade any time to unlock the full curriculum.
              </p>
              <Link href="/academy/account" className="mt-4 inline-block rounded-full bg-plum px-5 py-2 font-ui text-sm font-medium text-white hover:bg-plum/90">
                View membership
              </Link>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

function tierName(tier: string): string {
  return tier === "academy_plus" ? "Academy Plus" : tier === "professional" ? "Professional" : "Academy";
}
