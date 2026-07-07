import InstituteSection from "@/components/institute/InstituteSection";
import { getSectionOfferings } from "@/lib/instituteData";

export const dynamic = "force-dynamic";
export const metadata = { title: "Workshops | RLC™ Professional Institute" };

export default async function WorkshopsPage() {
  const offerings = await getSectionOfferings("workshops");
  return (
    <InstituteSection
      eyebrow="Live Training"
      title="Professional Workshops"
      intro="Live, interactive workshops where helping professionals learn to use the Relationship Life Cycle™ Framework in real practice — with room for questions, discussion, and case examples."
      offerings={offerings}
      note="Workshop dates and registration will open here as they are scheduled."
    />
  );
}
