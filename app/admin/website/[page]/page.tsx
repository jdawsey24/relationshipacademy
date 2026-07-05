import { notFound } from "next/navigation";
import WebsiteTabs from "@/components/admin/WebsiteTabs";
import ContentEditor from "@/components/admin/ContentEditor";
import { PAGE_MANIFESTS } from "@/lib/siteContent";

export function generateStaticParams() {
  return Object.keys(PAGE_MANIFESTS).map((page) => ({ page }));
}

export default async function WebsitePageEditor({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const manifest = PAGE_MANIFESTS[page];
  if (!manifest) notFound();

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-midnight-navy">Website</h1>
      <WebsiteTabs />
      <h2 className="mb-1 text-lg font-semibold text-midnight-navy">{manifest.label} page</h2>
      <p className="mb-5 max-w-2xl text-sm text-charcoal/60">
        Edit this page&apos;s headline copy and its SEO (browser title, meta description, and social share image). Leave a field blank to fall back to the built-in default. Changes appear on the site within about a minute.
      </p>
      <ContentEditor fields={manifest.fields} />
    </div>
  );
}
