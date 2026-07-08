import InstituteSection from "@/components/institute/InstituteSection";
import { getSectionContent } from "@/lib/instituteData";

export const dynamic = "force-dynamic";
export const metadata = { title: "Events | RLC™ Professional Institute" };

export default async function EventsPage() {
  const props = await getSectionContent("events");
  return <InstituteSection {...props} />;
}
