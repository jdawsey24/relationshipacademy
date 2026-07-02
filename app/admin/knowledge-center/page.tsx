import { redirect } from "next/navigation";

export default function KnowledgeCenterIndex() {
  redirect("/admin/knowledge-center/articles");
}
