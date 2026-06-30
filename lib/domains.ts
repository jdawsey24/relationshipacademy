// The six Snapshot domains, in presentation order. The database stores slugs
// with underscores (e.g. "emotional_intimacy"); the quiz URLs use hyphens
// (e.g. "emotional-intimacy"). These helpers map between the two forms.

export interface DomainMeta {
  /** DB slug (underscored), e.g. "emotional_intimacy" */
  dbSlug: string;
  /** URL slug (hyphenated), e.g. "emotional-intimacy" */
  routeSlug: string;
  name: string;
  /** number of in_snapshot questions (for progress display) */
  questionCount: number;
}

export const DOMAINS: DomainMeta[] = [
  { dbSlug: "communication", routeSlug: "communication", name: "Communication", questionCount: 6 },
  { dbSlug: "trust", routeSlug: "trust", name: "Trust", questionCount: 10 },
  { dbSlug: "emotional_intimacy", routeSlug: "emotional-intimacy", name: "Emotional Intimacy", questionCount: 8 },
  { dbSlug: "conflict_management", routeSlug: "conflict-management", name: "Conflict Management", questionCount: 8 },
  { dbSlug: "relational_functioning", routeSlug: "relational-functioning", name: "Relational Functioning", questionCount: 8 },
  { dbSlug: "physical_intimacy", routeSlug: "physical-intimacy", name: "Physical Intimacy", questionCount: 7 },
];

export const TOTAL_DOMAINS = DOMAINS.length;
export const TOTAL_QUESTIONS = DOMAINS.reduce((n, d) => n + d.questionCount, 0); // 47

export function dbSlugToRoute(dbSlug: string): string {
  return dbSlug.replaceAll("_", "-");
}

export function routeSlugToDb(routeSlug: string): string {
  return routeSlug.replaceAll("-", "_");
}

export function getDomainByRouteSlug(routeSlug: string): DomainMeta | undefined {
  return DOMAINS.find((d) => d.routeSlug === routeSlug);
}

/** 1-based index of a domain in the flow, or -1. */
export function domainOrder(routeSlug: string): number {
  return DOMAINS.findIndex((d) => d.routeSlug === routeSlug) + 1;
}

/** Route slug of the next domain page, or null if this is the last domain. */
export function nextDomainRoute(routeSlug: string): string | null {
  const i = DOMAINS.findIndex((d) => d.routeSlug === routeSlug);
  if (i < 0 || i >= DOMAINS.length - 1) return null;
  return DOMAINS[i + 1].routeSlug;
}

/** Route slug of the previous domain page, or null if this is the first domain. */
export function prevDomainRoute(routeSlug: string): string | null {
  const i = DOMAINS.findIndex((d) => d.routeSlug === routeSlug);
  if (i <= 0) return null;
  return DOMAINS[i - 1].routeSlug;
}
