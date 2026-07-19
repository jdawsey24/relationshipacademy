// Several clusters have context-split item pools so statements read correctly for
// the person's situation. Keyed by cluster_id -> marker_id -> context. A cluster/
// marker pair that's absent falls through to the full, unfiltered pool.
//
// Two shapes here (mirrors CLUSTER_CONTEXT_BY_MARKER in build_marker_quizzes.py):
//  - Fully mapped (24, 19): every marker that uses the cluster is listed, because
//    the pool is entirely tagged (no untagged fallback items).
//  - Single-marker filter (20, 11, 16, 21): only the one marker whose pool needs
//    narrowing is listed; all other markers use the full pool.
export const CLUSTER_CONTEXT_BY_MARKER: Record<number, Record<string, string>> = {
  24: { single_but_dating: "pre_definition", single_contemplating_dating: "pre_definition", in_a_relationship: "post_definition" },
  19: { single_but_dating: "solo", single_contemplating_dating: "solo", recent_divorce_breakup: "solo", married_or_long_term: "partnered" },
  20: { married_or_long_term: "general" },
  11: { recent_divorce_breakup: "reflective" },
  16: { recent_divorce_breakup: "reflective" },
  21: { recent_divorce_breakup: "reflective" },
};

// The context filter for a given marker + cluster, or null to use the full pool.
export function contextFor(markerId: string, clusterId: number): string | null {
  return CLUSTER_CONTEXT_BY_MARKER[clusterId]?.[markerId] ?? null;
}

// In-place Fisher–Yates shuffle. Runtime randomness is fine here (not a workflow).
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
