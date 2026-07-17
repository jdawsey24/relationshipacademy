// Which clusters have a real Playbook PDF in /public/playbooks yet. As more
// Playbooks are added (public/playbooks/cluster-{id}.pdf), add the cluster id here.
// Clusters without one fall back to the "your Playbook is on its way" path.
export const PLAYBOOK_CLUSTERS = new Set<number>([1, 3, 4, 5, 6, 24]); // Exploration phase

export function playbookUrl(clusterId: number | null | undefined): string | null {
  if (clusterId == null || !PLAYBOOK_CLUSTERS.has(clusterId)) return null;
  return `/playbooks/cluster-${clusterId}.pdf`;
}
