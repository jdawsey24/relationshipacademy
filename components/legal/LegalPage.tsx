"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

// Shared renderer for the governing legal documents. Faithful, readable typography;
// no framework chrome beyond the site shell it renders inside. Content comes from
// the current approved drafts — see lib/legal/documents.ts and lib/companion/disclosures.ts.

export interface LegalPageProps {
  title: string;
  effectiveDate?: string;
  lastUpdated?: string;
  markdown: string;
  /** Optional related-document links shown under the header. */
  related?: { label: string; href: string }[];
}

export default function LegalPage({ title, effectiveDate, lastUpdated, markdown, related }: LegalPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-14">
      <h1 className="font-display text-3xl font-semibold leading-tight text-midnight-navy sm:text-4xl">{title}</h1>
      {(effectiveDate || lastUpdated) && (
        <p className="mt-3 font-body text-sm text-charcoal/55">
          {effectiveDate && <>Effective date: {effectiveDate}</>}
          {effectiveDate && lastUpdated && <span className="px-2">·</span>}
          {lastUpdated && <>Last updated: {lastUpdated}</>}
        </p>
      )}

      {related && related.length > 0 && (
        <nav className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 border-y border-light-gray py-3">
          {related.map((r) => (
            <Link key={r.href} href={r.href} className="font-ui text-micro text-midnight-navy/70 underline underline-offset-2 hover:text-midnight-navy">
              {r.label}
            </Link>
          ))}
        </nav>
      )}

      <div
        className="mt-8 font-body leading-relaxed text-charcoal/85
          [&_h2]:mt-9 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-midnight-navy
          [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-[15px] [&_h3]:font-semibold [&_h3]:text-midnight-navy
          [&_p]:mt-3 [&_p]:text-[15px]
          [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_li]:text-[15px]
          [&_a]:text-midnight-navy [&_a]:underline [&_a]:underline-offset-2
          [&_strong]:font-semibold [&_strong]:text-midnight-navy"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </div>
    </main>
  );
}
