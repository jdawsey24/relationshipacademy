// Pure, client-safe resource constants + types (no server-only imports).

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string | null;
  file_type: string | null;
  category: string | null;
  status: string;
  sort_order: number;
  updated_at?: string;
  updated_by?: string | null;
  created_at?: string;
}

export const RESOURCE_STATUSES = ["draft", "published"] as const;

/** Derive a short type label ("pdf", "docx") from a filename or URL. */
export function fileTypeFromName(name: string): string {
  const m = name.toLowerCase().match(/\.([a-z0-9]+)(?:\?|$)/);
  return m ? m[1] : "file";
}
