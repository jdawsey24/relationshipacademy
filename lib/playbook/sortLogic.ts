// Pure sorting logic for the SortEngine (unit-testable, no React).

import type { SortItem } from "@/lib/playbook/contentSchema";

/** The gentle correction to show for an item, or null (right bucket / no criterion). */
export function correctionFor(item: SortItem, bucketId: string): string | null {
  if (item.correctBucket && item.correction && bucketId !== item.correctBucket) {
    return item.correction;
  }
  return null;
}

/** True once every item has been assigned to a bucket. */
export function allAssigned(items: SortItem[], assignments: Record<string, string>): boolean {
  return items.every((it) => Boolean(assignments[it.id]));
}
