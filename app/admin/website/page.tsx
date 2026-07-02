import { redirect } from "next/navigation";

export default function WebsiteIndex() {
  redirect("/admin/website/announcement");
}
