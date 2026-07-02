import KcTabs from "@/components/admin/KcTabs";
import ArticleEditor from "@/components/admin/ArticleEditor";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-midnight-navy">Knowledge Center</h1>
      <KcTabs />
      <h2 className="mb-5 text-lg font-semibold text-midnight-navy">Edit article</h2>
      <ArticleEditor id={id} />
    </div>
  );
}
