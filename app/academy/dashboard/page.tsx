import Link from "next/link";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/academyAuth";
import {
  getPublishedCourses,
  getCourseWithContent,
  getProgress,
  getJournalEntries,
  getAnnouncements,
} from "@/lib/academyData";
import { getCertificates } from "@/lib/certificates";
import { getSiteContentMap, get } from "@/lib/siteContent";
import { coursePercent, courseLessons, type CourseWithContent } from "@/lib/academy";
import { ProgressBar, TierBadge, Panel } from "@/components/academy/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const member = await getMember();
  if (!member) redirect("/academy/login");

  const [courses, progress, journal, announcements, settings, certificates] = await Promise.all([
    getPublishedCourses(),
    getProgress(member.user.id),
    getJournalEntries(member.user.id),
    getAnnouncements(member.tier),
    getSiteContentMap(),
    getCertificates(member.user.id),
  ]);

  // Assemble full content for each published course to compute progress + next.
  const full = (
    await Promise.all(courses.map((c) => getCourseWithContent(c.slug)))
  ).filter(Boolean) as CourseWithContent[];

  const completedIds = new Set(
    progress.filter((p) => p.status === "completed").map((p) => p.lesson_id)
  );

  // Build a flat lesson lookup for "continue" + "recommended".
  const lessonIndex = new Map<
    string,
    { courseSlug: string; courseTitle: string; lessonSlug: string; title: string }
  >();
  for (const c of full) {
    for (const l of courseLessons(c)) {
      lessonIndex.set(l.id, {
        courseSlug: c.slug,
        courseTitle: c.title,
        lessonSlug: l.slug,
        title: l.title,
      });
    }
  }

  const withPercent = full
    .map((c) => ({ course: c, percent: coursePercent(c, progress) }))
    .filter((x) => courseLessons(x.course).length > 0);
  const inProgress = withPercent.filter((x) => x.percent > 0 && x.percent < 100);
  const completedCourses = withPercent.filter((x) => x.percent === 100);

  // Continue learning: most recently viewed, not-yet-completed lesson.
  const lastViewed = [...progress]
    .filter((p) => !completedIds.has(p.lesson_id))
    .sort((a, b) => b.last_viewed_at.localeCompare(a.last_viewed_at))[0];
  const continueLesson = lastViewed ? lessonIndex.get(lastViewed.lesson_id) : undefined;

  // Recommended next: first incomplete lesson across courses in order.
  let recommended: ReturnType<typeof lessonIndex.get> | undefined;
  for (const c of full) {
    const next = courseLessons(c).find((l) => !completedIds.has(l.id));
    if (next) {
      recommended = lessonIndex.get(next.id);
      break;
    }
  }

  const skoolUrl = get(settings, "settings.skool_url", "");
  const firstName = (member.profile.full_name || "").split(" ")[0];
  const recentJournal = journal.slice(0, 3);

  const primary = continueLesson ?? recommended;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-ui text-sm text-plum">Welcome back{firstName ? `, ${firstName}` : ""}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">
            Your Academy
          </h1>
        </div>
        <div className="flex items-center gap-2 font-ui text-sm text-charcoal/70">
          <span>Membership</span>
          <TierBadge tier={member.tier} />
        </div>
      </header>

      {/* Continue learning — the hero card */}
      {primary ? (
        <div className="rounded-2xl bg-midnight-navy p-7 text-white sm:p-9">
          <p className="font-ui text-xs uppercase tracking-[0.2em] text-white/60">
            {continueLesson ? "Continue learning" : "Recommended next"}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{primary.title}</h2>
          <p className="mt-1 font-body text-white/70">{primary.courseTitle}</p>
          <Link
            href={`/academy/courses/${primary.courseSlug}/${primary.lessonSlug}`}
            className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 font-ui text-sm font-medium text-midnight-navy transition-colors hover:bg-white/90"
          >
            {continueLesson ? "Resume lesson" : "Start lesson"}
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-midnight-navy/10 bg-white p-7">
          <h2 className="font-display text-2xl font-semibold text-midnight-navy">Start your first course</h2>
          <p className="mt-1 font-body text-charcoal/70">Explore the library and begin whenever you're ready.</p>
          <Link href="/academy/courses" className="mt-5 inline-block rounded-full bg-midnight-navy px-6 py-2.5 font-ui text-sm font-medium text-white hover:bg-midnight-navy/90">
            Browse courses
          </Link>
        </div>
      )}

      {/* Progress summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Courses in progress" value={inProgress.length} />
        <StatCard label="Lessons completed" value={completedIds.size} />
        <StatCard label="Courses completed" value={completedCourses.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Courses in progress */}
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Courses in progress">
            {inProgress.length === 0 ? (
              <p className="font-body text-sm text-charcoal/60">
                Nothing in progress yet.{" "}
                <Link href="/academy/courses" className="text-midnight-navy underline underline-offset-2">Browse the library →</Link>
              </p>
            ) : (
              <ul className="space-y-4">
                {inProgress.map(({ course, percent }) => (
                  <li key={course.id}>
                    <Link href={`/academy/courses/${course.slug}`} className="group block">
                      <div className="flex items-center justify-between">
                        <span className="font-body font-medium text-midnight-navy group-hover:underline">{course.title}</span>
                        <span className="font-ui text-sm text-charcoal/60">{percent}%</span>
                      </div>
                      <div className="mt-2"><ProgressBar percent={percent} /></div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Recent journal */}
          <Panel title="Recent journal entries">
            {recentJournal.length === 0 ? (
              <p className="font-body text-sm text-charcoal/60">
                Your reflections will appear here.{" "}
                <Link href="/academy/journal" className="text-midnight-navy underline underline-offset-2">Open your journal →</Link>
              </p>
            ) : (
              <ul className="divide-y divide-midnight-navy/8">
                {recentJournal.map((e) => (
                  <li key={e.id} className="py-3 first:pt-0 last:pb-0">
                    <Link href="/academy/journal" className="block hover:opacity-80">
                      <p className="font-body font-medium text-midnight-navy">{e.title || "Untitled reflection"}</p>
                      <p className="mt-0.5 line-clamp-2 font-body text-sm text-charcoal/60">{e.body}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {/* Sidebar: announcements, community, quick links */}
        <div className="space-y-6">
          <Panel title="Announcements">
            {announcements.length === 0 ? (
              <p className="font-body text-sm text-charcoal/60">No announcements right now.</p>
            ) : (
              <ul className="space-y-4">
                {announcements.slice(0, 4).map((a) => (
                  <li key={a.id}>
                    <p className="font-body font-medium text-midnight-navy">{a.title}</p>
                    {a.body && <p className="mt-0.5 font-body text-sm text-charcoal/70">{a.body}</p>}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Community">
            <p className="font-body text-sm text-charcoal/70">
              Discussion, weekly lives, Q&amp;A, and accountability happen on Skool.
            </p>
            <Link
              href="/academy/community"
              className="mt-4 inline-block rounded-full bg-plum px-5 py-2 font-ui text-sm font-medium text-white hover:bg-plum/90"
            >
              Go to Community
            </Link>
            {!skoolUrl && (
              <p className="mt-3 font-ui text-xs text-charcoal/50">Skool link set in Admin → Settings.</p>
            )}
          </Panel>

          <Panel title="Quick links">
            <ul className="space-y-2 font-body text-sm">
              <li><Link href="/academy/workbooks" className="text-midnight-navy hover:underline">Workbook library →</Link></li>
              <li><Link href="/academy/journal" className="text-midnight-navy hover:underline">Your journal →</Link></li>
              <li>
                <Link href="/academy/certificates" className="text-midnight-navy hover:underline">
                  Certificates{certificates.length > 0 ? ` (${certificates.length})` : ""} →
                </Link>
              </li>
              <li><Link href="/academy/account" className="text-midnight-navy hover:underline">Account &amp; membership →</Link></li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-midnight-navy/10 bg-white p-5">
      <p className="font-display text-3xl font-semibold text-midnight-navy">{value}</p>
      <p className="mt-1 font-ui text-sm text-charcoal/60">{label}</p>
    </div>
  );
}
