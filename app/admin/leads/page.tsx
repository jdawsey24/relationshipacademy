import { redirect } from "next/navigation";

// Leads moved into the CRM section (organized by source).
export default function LeadsRedirect() {
  redirect("/admin/crm");
}
