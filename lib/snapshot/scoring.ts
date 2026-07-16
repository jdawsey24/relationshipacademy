// Pure scoring for the Relationship Snapshot cluster quizzes. Each answer is the
// cluster_id of the selected option; the Primary result is the most-picked
// cluster, Secondary the runner-up. A first-place tie is flagged (resolved with a
// head-to-head tiebreak question in the flow, per the architecture doc). No DB, no
// side effects — the data layer loads answers and calls this.

export interface Tally { clusterId: number; wins: number }
export interface ScoreResult {
  primary: Tally | null;
  secondary: Tally | null;
  isTied: boolean;      // first place is tied → resolve before finalizing
  tiedClusterIds: number[];
  ranked: Tally[];
}

export function scoreClusters(selectedClusterIds: number[]): ScoreResult {
  const tally = new Map<number, number>();
  for (const cid of selectedClusterIds) tally.set(cid, (tally.get(cid) ?? 0) + 1);

  // Rank by wins desc; break display ties by cluster id for a stable order.
  const ranked = [...tally.entries()]
    .map(([clusterId, wins]) => ({ clusterId, wins }))
    .sort((a, b) => b.wins - a.wins || a.clusterId - b.clusterId);

  const top = ranked[0]?.wins ?? 0;
  const tiedClusterIds = ranked.filter((r) => r.wins === top).map((r) => r.clusterId);
  const isTied = tiedClusterIds.length > 1;

  return {
    primary: ranked[0] ?? null,
    secondary: isTied ? null : (ranked[1] ?? null),
    isTied,
    tiedClusterIds,
    ranked,
  };
}
