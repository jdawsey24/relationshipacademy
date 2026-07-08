import InstituteSection from "@/components/institute/InstituteSection";
import { getSectionContent } from "@/lib/instituteData";

export const dynamic = "force-dynamic";
export const metadata = { title: "Professional Resources | RLC™ Professional Institute" };

export default async function ProfessionalResourcesPage() {
  const props = await getSectionContent("professional_resources");
  return <InstituteSection {...props} />;
}
