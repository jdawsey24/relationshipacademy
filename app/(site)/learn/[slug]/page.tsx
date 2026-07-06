import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/site/Markdown";
import CtaButton from "@/components/site/CtaButton";
import JsonLd from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { getPublishedArticleBySlug } from "@/lib/articles";
import { getPhase } from "@/lib/frameworkContent";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getPublishedArticleBySlug(slug);
  if (!a) return { title: "Article | Relationship Life Cycle™" };
  const title = `${a.seo_title || a.title} | Relationship Life Cycle™`;
  const description = a.seo_description || a.summary || undefined;
  const url = `/learn/${a.slug}`;
  const image = a.featured_image_url || "/og-default.png";
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, type: "article", siteName: "Relationship Life Cycle™",
      images: [{ url: image }],
      ...(a.publish_date ? { publishedTime: a.publish_date } : {}),
      ...(a.author ? { authors: [a.author] } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

function fmtDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = await getPublishedArticleBySlug(slug);
  if (!a) notFound();

  const phase = a.related_phase_slug ? getPhase(a.related_phase_slug) : undefined;
  const date = fmtDate(a.publish_date);

  return (
    <main className="bg-warm-ivory">
      <JsonLd data={[
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Learning Center", path: "/learn" },
          { name: a.title, path: `/learn/${a.slug}` },
        ]),
        articleSchema({
          title: a.title,
          description: a.seo_description || a.summary,
          slug: a.slug,
          image: a.featured_image_url,
          author: a.author,
          publishDate: a.publish_date,
          updatedAt: a.updated_at,
        }),
      ]} />
      <article className="mx-auto max-w-2xl px-6 pt-36 pb-16">
        <Link href="/learn" className="font-ui text-sm text-midnight-navy hover:underline">← Learning Center</Link>

        <header className="mt-6">
          {a.category && <span className="font-ui text-xs uppercase tracking-wide text-coral-rose">{a.category}</span>}
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-midnight-navy sm:text-5xl">{a.title}</h1>
          <p className="mt-3 font-ui text-sm text-charcoal/60">
            {[a.author, date].filter(Boolean).join(" · ")}
          </p>
        </header>

        {a.featured_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.featured_image_url} alt={a.title} className="mt-8 w-full rounded-xl object-cover" />
        )}

        {a.summary && <p className="mt-8 font-body text-xl leading-relaxed text-charcoal/90">{a.summary}</p>}

        <div className="mt-6">
          {a.content ? <Markdown content={a.content} /> : null}
        </div>

        {phase && (
          <p className="mt-10 rounded-lg border border-light-gray bg-white p-4 font-body text-sm text-charcoal">
            Related phase:{" "}
            <Link href={`/framework/phases/${phase.slug}`} className="font-semibold text-midnight-navy underline underline-offset-2">
              {phase.name}
            </Link>
          </p>
        )}

        {a.cta_text && a.cta_url && (
          <div className="mt-10 text-center">
            <CtaButton href={a.cta_url} external={a.cta_url.startsWith("http")}>{a.cta_text}</CtaButton>
          </div>
        )}
      </article>
    </main>
  );
}
