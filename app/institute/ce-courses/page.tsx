import InstituteSection from "@/components/institute/InstituteSection";
import { getSectionContent } from "@/lib/instituteData";

export const dynamic = "force-dynamic";
export const metadata = { title: "CE Courses | RLC™ Professional Institute" };

export default async function CeCoursesPage() {
  const props = await getSectionContent("ce_courses");
  return <InstituteSection {...props} />;
}
