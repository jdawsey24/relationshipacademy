import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getMember, memberCanAccess } from "@/lib/academyAuth";
import { getCourseWithContent, getProgress, getJournalEntries } from "@/lib/academyData";
import { courseLessons } from "@/lib/academy";
import { getSiteContentMap, get } from "@/lib/siteContent";
import Markdown from "@/components/site/Markdown";
import { Panel, LockPill } from "@/components/academy/ui";
import LessonProgress from "@/components/academy/LessonProgress";
import LessonJournal from "@/components/academy/LessonJournal";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const member = await getMember();
  if (!member) redirect("/academy/login");
  const { courseSlug, lessonSlug } = await params;

  const course = await getCourseWithContent(courseSlug);
  if (!course) notFound();

  const lessons = courseLessons(course);
  const idx = lessons.findIndex((l) => l.slug === lessonSlug);
  if (idx === -1) notFound();
  const lesson = lessons[idx];
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx < lessons.length - 1 ? lessons[idx + 1] : null;

  const accessible = lesson.is_preview || memberCanAccess(member, lesson.min_tier);

  const [progress, journalEntries, settings] = await Promise.all([
    getProgress(member.user.id, course.id),
    accessible ? getJournalEntries(member.user.id, { lessonId: lesson.id }) : Promise.resolve([]),
    getSiteContentMap(),
  ]);
  const isCompleted = progress.some((p) => p.lesson_id === lesson.id && p.status === "completed");
  const skoolUrl = lesson.skool_url || get(settings, "settings.skool_url", "");

  const takeaways = (lesson.key_takeaways || "")
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Breadcrumb */}
      <nav className="font-ui text-sm text-charcoal/60">
        <Link href="/academy/courses" className="hover:text-midnight-navy">Courses</Link>
        <span className="mx-2">/</span>
        <Link href={`/academy/courses/${course.slug}`} className="hover:text-midnight-navy">{course.title}</Link>
      </nav>

      <header>
        <p className="font-ui text-sm text-plum">Lesson {idx + 1} of {lessons.length}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">{lesson.title}</h1>
      </header>

      {!accessible ? (
        // ---- Locked state ----
        <Panel>
          <div className="flex flex-col items-start gap-4">
            <LockPill />
            <p className="font-body text-charcoal/80">
              This lesson is part of the {course.title} curriculum and is included with a paid
              membership. Preview lessons are always free.
            </p>
            <Link href="/academy/account" className="rounded-full bg-plum px-6 py-2.5 font-ui text-sm font-medium text-white hover:bg-plum/90">
              View membership options
            </Link>
          </div>
        </Panel>
      ) : (
        <>
          {/* Video */}
          <div>
            <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-midnight-navy/10 bg-midnight-navy/5">
              <div className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-midnight-navy/10">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M8 5v14l11-7z" fill="#1C3557" />
                  </svg>
                </div>
                <p className="mt-3 font-ui text-sm text-charcoal/60">
                  {lesson.video_url ? "Video ready" : "Video coming soon"}
                </p>
                {lesson.video_url && (
                  <a href={lesson.video_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-ui text-sm text-midnight-navy underline underline-offset-2">
                    Watch video →
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Lesson content */}
          {lesson.content && (
            <Panel>
              <Markdown content={lesson.content} />
            </Panel>
          )}

          {/* Key takeaways */}
          {takeaways.length > 0 && (
            <Panel title="Key takeaways">
              <ul className="space-y-2 font-body text-charcoal/85">
                {takeaways.map((t, i) => (
                  <li key={i} className="flex gap-2"><span className="mt-1 text-sage-green">✓</span><span>{t}</span></li>
                ))}
              </ul>
            </Panel>
          )}

          {/* Reflection questions */}
          {lesson.reflection_questions.length > 0 && (
            <Panel title="Reflection questions">
              <ol className="list-decimal space-y-2 pl-5 font-body text-charcoal/85 marker:text-plum">
                {lesson.reflection_questions.map((q, i) => <li key={i}>{q}</li>)}
              </ol>
            </Panel>
          )}

          {/* Homework */}
          {lesson.homework && (
            <Panel title="Homework">
              <p className="whitespace-pre-wrap font-body text-charcoal/85">{lesson.homework}</p>
            </Panel>
          )}

          {/* Journal */}
          <Panel title="Your journal">
            <LessonJournal lessonId={lesson.id} courseId={course.id} initialEntries={journalEntries} />
          </Panel>

          {/* Workbook */}
          <Panel title="Workbook">
            {lesson.workbook_url ? (
              <a href={lesson.workbook_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-midnight-navy/20 px-5 py-2 font-ui text-sm font-medium text-midnight-navy hover:bg-midnight-navy/5">
                ↓ Download workbook
              </a>
            ) : (
              <p className="font-body text-sm text-charcoal/60">A downloadable workbook for this lesson is coming soon.</p>
            )}
          </Panel>

          {/* Skool discussion */}
          {skoolUrl && (
            <Panel title="Discuss on Skool">
              <p className="font-body text-sm text-charcoal/70">Bring your reflections to the community.</p>
              <a href={skoolUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded-full bg-plum px-5 py-2 font-ui text-sm font-medium text-white hover:bg-plum/90">
                Open the discussion →
              </a>
            </Panel>
          )}

          {/* Mark complete */}
          <div className="flex justify-center py-2">
            <LessonProgress lessonId={lesson.id} courseId={course.id} initialCompleted={isCompleted} active={accessible} />
          </div>
        </>
      )}

      {/* Prev / next */}
      <nav className="flex items-center justify-between gap-4 border-t border-midnight-navy/10 pt-6">
        {prev ? (
          <Link href={`/academy/courses/${course.slug}/${prev.slug}`} className="group flex-1 rounded-xl border border-midnight-navy/10 bg-white p-4 hover:shadow-sm">
            <p className="font-ui text-xs text-charcoal/50">← Previous</p>
            <p className="mt-0.5 font-body text-sm font-medium text-midnight-navy group-hover:underline">{prev.title}</p>
          </Link>
        ) : <div className="flex-1" />}
        {next ? (
          <Link href={`/academy/courses/${course.slug}/${next.slug}`} className="group flex-1 rounded-xl border border-midnight-navy/10 bg-white p-4 text-right hover:shadow-sm">
            <p className="font-ui text-xs text-charcoal/50">Next →</p>
            <p className="mt-0.5 font-body text-sm font-medium text-midnight-navy group-hover:underline">{next.title}</p>
          </Link>
        ) : <div className="flex-1" />}
      </nav>
    </div>
  );
}
