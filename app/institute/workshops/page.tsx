import InstituteSection from "@/components/institute/InstituteSection";
import { getSectionContent } from "@/lib/instituteData";

export const dynamic = "force-dynamic";
export const metadata = { title: "Workshops | RLC™ Professional Institute" };

export default async function WorkshopsPage() {
  const props = await getSectionContent("workshops");
  return <InstituteSection {...props} />;
}
