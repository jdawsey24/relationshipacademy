import InstituteSection from "@/components/institute/InstituteSection";
import { getSectionContent } from "@/lib/instituteData";

export const dynamic = "force-dynamic";
export const metadata = { title: "Research | RLC™ Professional Institute" };

export default async function ResearchPage() {
  const props = await getSectionContent("research");
  return <InstituteSection {...props} />;
}
