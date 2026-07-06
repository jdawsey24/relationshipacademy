// Renders a multi-paragraph string (paragraphs separated by blank lines) as a
// series of <p> elements. Used for CMS-editable body blocks so a whole section
// of prose can live in one textarea field. Paragraph spacing/typography comes
// from the wrapping container (e.g. `space-y-4 font-body …`).
export default function RichText({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className={className}>{p}</p>
      ))}
    </>
  );
}
