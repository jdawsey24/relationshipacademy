// Cluster 24's item pool is context-split. Each marker that uses cluster 24 draws
// from exactly one context. Pre-relationship markers use pre_definition; a defined
// relationship uses post_definition. (Confirmed with owner.)
export const CLUSTER_24_CONTEXT: Record<string, string> = {
  single_but_dating: "pre_definition",
  single_contemplating_dating: "pre_definition",
  in_a_relationship: "post_definition",
};

// The context filter for a given marker + cluster (only cluster 24 is split).
export function contextFor(markerId: string, clusterId: number): string | null {
  if (clusterId !== 24) return null;
  return CLUSTER_24_CONTEXT[markerId] ?? null;
}

// In-place Fisher–Yates shuffle. Runtime randomness is fine here (not a workflow).
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
