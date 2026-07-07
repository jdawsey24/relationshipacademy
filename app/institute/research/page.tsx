import InstituteSection from "@/components/institute/InstituteSection";
import { getSectionOfferings } from "@/lib/instituteData";

export const dynamic = "force-dynamic";
export const metadata = { title: "Research | RLC™ Professional Institute" };

export default async function ResearchPage() {
  const offerings = await getSectionOfferings("research");
  return (
    <InstituteSection
      eyebrow="Scholarship"
      title="Research & Publications"
      intro="The scholarly foundation of the Relationship Life Cycle™ Framework — research, white papers, and publications that inform professional practice and advance the model."
      offerings={offerings}
      note="Publications and research participation opportunities will be posted here as they become available."
    />
  );
}
