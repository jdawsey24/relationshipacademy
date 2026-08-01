// Eyebrow label above section headings. Inter, uppercase, letter-spaced.

export default function SectionLabel({
  children,
  className = "",
  tone = "muted",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "muted" | "sage" | "white";
}) {
  const color =
    tone === "sage"
      ? "text-sage-green"
      : tone === "white"
        ? "text-white/70"
        : "text-charcoal/50";
  return (
    <p className={`font-ui text-eyebrow font-semibold uppercase ${color} ${className}`}>
      {children}
    </p>
  );
}
