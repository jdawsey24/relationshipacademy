import KcTabs from "@/components/admin/KcTabs";
import ArticleEditor from "@/components/admin/ArticleEditor";

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold text-midnight-navy">Knowledge Center</h1>
      <KcTabs />
      <h2 className="mb-5 text-lg font-semibold text-midnight-navy">New article</h2>
      <ArticleEditor />
    </div>
  );
}
