"use client";

import AiStudioNav from "@/components/admin/AiStudioNav";

export default function AiContentBuilderPage() {
  return (
    <div>
      <AiStudioNav />
      <div className="max-w-2xl rounded-md border border-light-gray p-6">
        <h2 className="text-lg font-semibold text-midnight-navy">Content Builder — coming next (AIS-2)</h2>
        <p className="mt-2 text-sm text-charcoal/70">
          The foundation (provenance/staging, provider abstraction, RAG context, quality checks, duplicate detection,
          versioned prompt templates, review queue, and the Assessment Item generator) is built. The next phase adds
          dedicated, structured generators for <strong>Worksheets</strong> and <strong>Lessons</strong> (per-type forms +
          rich field schemas + preview modes), followed by practices, conversation guides, journal prompts, activities,
          and video outlines — all draft-only, owner-approved, and promoted into the Content Library on approval.
        </p>
        <p className="mt-3 text-sm text-charcoal/60">In the meantime, the existing Studio → Library “Generate with AI” draft flow remains available.</p>
      </div>
    </div>
  );
}
