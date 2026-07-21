import { redirect } from "next/navigation";
import Link from "next/link";
import { getMember } from "@/lib/academyAuth";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { getOwnedPlaybookClusterIds } from "@/lib/snapshot/playbookGrants";

export const dynamic = "force-dynamic";

// My Playbooks — where a buyer lands after purchase and returns to re-download.
// Downloads are ownership-gated (/api/playbooks/[cluster]/download). Requires
// a signed-in member; the checkout success_url points here.
export default async function PlaybooksPage({ searchParams }: { searchParams: Promise<{ purchase?: string }> }) {
  const member = await getMember();
  if (!member) redirect("/academy/login?next=/playbooks");
  const { purchase } = await searchParams;

  const clusterIds = await getOwnedPlaybookClusterIds(member.user.id);
  let names = new Map<number, string>();
  if (clusterIds.length) {
    const { data } = await getSupabaseAdminClient().from("snapshot_clusters").select("id, name").in("id", clusterIds);
    names = new Map(((data ?? []) as { id: number; name: string }[]).map((c) => [c.id, c.name]));
  }

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-10">
      <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.15em] text-charcoal/45">The Relationship Playbook&trade;</p>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-midnight-navy sm:text-4xl">Your playbooks</h1>
      <p className="mt-2 font-body text-charcoal/70">Everything you&apos;ve unlocked, ready whenever you need it.</p>

      {purchase === "success" && (
        <div className="mt-5 rounded-2xl border border-[#5F9E7C]/30 bg-[#5F9E7C]/[0.08] p-4 font-body text-sm text-charcoal/80">
          Thank you — your purchase is complete. Your playbook is below. If it isn&apos;t showing yet, give it a moment and refresh.
        </div>
      )}

      {clusterIds.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-light-gray bg-white/60 p-8 text-center">
          <p className="font-body text-charcoal/60">You haven&apos;t unlocked any playbooks yet.</p>
          <Link href="/snapshot" className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-full bg-midnight-navy px-6 font-ui text-sm font-semibold text-white transition-opacity hover:opacity-95">
            Take the Snapshot
          </Link>
        </div>
      ) : (
        <div className="mt-7 space-y-2.5">
          {clusterIds.map((id) => (
            <div key={id} className="flex items-center gap-3.5 rounded-2xl border border-light-gray bg-white p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-coral-rose/10 text-coral-rose" aria-hidden="true">
                <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h9l4 4v12H6z" /><path d="M14 4v5h5" /></svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-semibold leading-tight text-midnight-navy">{names.get(id) ?? "Your Playbook"}</span>
                <span className="mt-0.5 block font-body text-[13px] text-charcoal/55">Relationship Playbook (PDF)</span>
              </span>
              <a href={`/api/playbooks/${id}/download`} target="_blank" rel="noopener noreferrer"
                className="shrink-0 rounded-full bg-midnight-navy px-5 py-2.5 font-ui text-sm font-semibold text-white transition-opacity hover:opacity-95">
                Open
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
