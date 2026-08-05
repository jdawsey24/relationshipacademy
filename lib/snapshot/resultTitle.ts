// Consumer naming rule for a Snapshot result, shared by every surface that names
// a result INSIDE a sentence (nurture emails, the Playbook sales page).
//
// `snapshot_clusters.result_title` is written in the second person for the results
// PAGE headline ("You're Feeling Unseen and Unappreciated"), where it speaks to the
// reader. Used mid-sentence it reads wrong — "Your Snapshot pointed to You're
// Feeling Unseen…" — so the leading "You're " is stripped and the title becomes a
// label: "Your Snapshot pointed to Feeling Unseen and Unappreciated."
//
// Owner decision 2026-08-02. Titles without the prefix (e.g. "Guarded From Getting
// Used") pass through unchanged. The results page keeps the full second-person form.
export function resultLabel(title: string | null | undefined): string {
  return (title ?? "").replace(/^You['’]re\s+/i, "");
}
