import { redirect } from "next/navigation";
import { getMember, memberCanAccess } from "@/lib/academyAuth";
import { getWorkbooks, getCourseTitleMap } from "@/lib/academyData";
import { LockPill } from "@/components/academy/ui";

export const dynamic = "force-dynamic";

export default async function WorkbooksPage() {
  const member = await getMember();
  if (!member) redirect("/academy/login");

  const [workbooks, courseTitles] = await Promise.all([
    getWorkbooks(),
    getCourseTitleMap(),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-midnight-navy sm:text-4xl">Workbooks</h1>
        <p className="mt-2 max-w-2xl font-body text-charcoal/70">
          Companion worksheets and downloadable PDFs for your courses.
        </p>
      </header>

      {workbooks.length === 0 ? (
        <p className="font-body text-charcoal/60">No workbooks are available yet. Check back soon.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {workbooks.map((w) => {
            const unlocked = memberCanAccess(member, w.min_tier);
            const canDownload = unlocked && !!w.file_url;
            return (
              <div key={w.id} className="flex flex-col rounded-2xl border border-midnight-navy/10 bg-white p-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-coral-rose/12 font-ui text-xs font-semibold uppercase text-coral-rose">
                    PDF
                  </span>
                  {!unlocked && <LockPill />}
                </div>
                <h2 className="font-display text-lg font-semibold text-midnight-navy">{w.title}</h2>
                {w.course_id && (
                  <p className="mt-0.5 font-ui text-xs text-plum">{courseTitles.get(w.course_id)}</p>
                )}
                {w.description && <p className="mt-2 font-body text-sm text-charcoal/70">{w.description}</p>}
                <div className="mt-auto pt-4">
                  {canDownload ? (
                    <a href={w.file_url!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-midnight-navy/20 px-5 py-2 font-ui text-sm font-medium text-midnight-navy hover:bg-midnight-navy/5">
                      ↓ Download
                    </a>
                  ) : unlocked ? (
                    <span className="font-ui text-sm text-charcoal/50">Coming soon</span>
                  ) : (
                    <span className="font-ui text-sm text-charcoal/50">Upgrade to access</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
