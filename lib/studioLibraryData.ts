import { getSupabaseAdminClient } from "@/lib/supabase";
import { LEARNING_TABLES, type LibraryType } from "@/lib/studioLibrary";

// Server-only Learning Library reads. Service role (RLS-locked) + RESILIENT: if
// migration 0019 hasn't run yet, returns empty instead of throwing.

export interface LibraryFilters {
  competency_id?: string;
  domain?: string;
  phase?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface LibraryPage {
  rows: Record<string, unknown>[];
  total: number;
  page: number;
  pageSize: number;
}

export async function listLibrary(type: LibraryType, f: LibraryFilters = {}): Promise<LibraryPage> {
  const cfg = LEARNING_TABLES[type];
  const page = Math.max(1, f.page ?? 1);
  const pageSize = Math.min(200, Math.max(1, f.pageSize ?? 50));
  try {
    const s = getSupabaseAdminClient();
    let q = s.from(cfg.table).select("*", { count: "exact" });
    if (f.competency_id && cfg.competencyCol) q = q.eq(cfg.competencyCol, f.competency_id);
    if (f.domain && cfg.hasDomain) q = q.eq("domain", f.domain);
    if (f.phase && cfg.hasPhase) q = q.eq("phase", f.phase);
    if (f.status) q = q.eq("status", f.status);
    if (f.search) q = q.ilike(cfg.labelCol, `%${f.search}%`);
    const from = (page - 1) * pageSize;
    q = q.order(cfg.pk).range(from, from + pageSize - 1);
    const { data, count, error } = await q;
    if (error) return { rows: [], total: 0, page, pageSize };
    return { rows: (data as Record<string, unknown>[]) ?? [], total: count ?? 0, page, pageSize };
  } catch {
    return { rows: [], total: 0, page, pageSize };
  }
}

/** Row counts per library type — powers the Library overview page. */
export async function libraryCounts(): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  try {
    const s = getSupabaseAdminClient();
    await Promise.all(
      (Object.keys(LEARNING_TABLES) as LibraryType[]).map(async (t) => {
        const { count } = await s.from(LEARNING_TABLES[t].table).select("*", { count: "exact", head: true });
        out[t] = count ?? 0;
      })
    );
  } catch {
    // leave empty
  }
  return out;
}
