// Client-safe types + constants for the Asset Library and Recommendation Mapper
// (Phase D). No server imports.

import type { StudioStatus } from "@/lib/studio";
export type { StudioStatus } from "@/lib/studio";

export const ASSET_TYPES = ["image", "pdf", "document", "video", "audio", "other"] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

export function assetTypeFromName(name: string): AssetType {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx", "txt", "rtf", "md", "ppt", "pptx", "xls", "xlsx", "csv"].includes(ext)) return "document";
  if (["mp4", "mov", "webm", "avi", "mkv"].includes(ext)) return "video";
  if (["mp3", "wav", "m4a", "aac", "ogg"].includes(ext)) return "audio";
  return "other";
}

export interface Asset {
  id: string;
  storage_path: string | null;
  file_name: string | null;
  file_url: string | null;
  title: string | null;
  asset_type: string | null;
  description: string | null;
  audience: string | null;
  competency_id: string | null;
  phase: string | null;
  domain: string | null;
  tags: string[];
  size_bytes: number | null;
  source: string | null;
  status: StudioStatus;
  updated_at: string;
}

// The recommendation trigger types the results page understands. "Domain Low"
// is the original behavior (two weakest domains); Phase + Risk are additive.
export const REC_TRIGGER_TYPES: { value: string; label: string; hint: string }[] = [
  { value: "Domain Low", label: "Domain Low", hint: "trigger_value = domain name (e.g. Communication); shown for the respondent's two weakest domains." },
  { value: "Phase", label: "Phase", hint: "trigger_value = structural phase slug (e.g. exploration); shown for the respondent's selected phase." },
  { value: "Risk", label: "Risk", hint: "trigger_value = expiration risk level (e.g. Elevated Risk); shown when the risk level matches." },
];

export interface ResultRecommendation {
  id: string;
  trigger_type: string;
  trigger_value: string;
  recommendation_text: string | null;
  next_step: string | null;
  audience: string;
  status: StudioStatus;
  notes: string | null;
  sort_order: number;
  updated_at: string;
}
