import type { Moment } from "./moments";

// Feather all four edges so the photo dissolves into the page (no hard frame),
// then a soft drop shadow for depth — an Apple-style floating image.
const FEATHER =
  "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent), linear-gradient(to bottom, transparent, #000 10%, #000 90%, transparent)";

export default function MomentTile({
  moment,
  className = "",
  variant = "float",
}: {
  moment: Moment;
  className?: string;
  variant?: "float" | "framed";
}) {
  // Framed: a clean rounded photo (used for the founder portrait).
  if (variant === "framed") {
    return (
      <div
        role="img"
        aria-label={moment.alt}
        className={`rounded-2xl ${moment.tint} bg-cover bg-center shadow-md shadow-midnight-navy/10 ring-1 ring-black/5 ${className}`}
        style={{ backgroundImage: `url(${moment.src})` }}
      />
    );
  }
  // Float: feathered, transparent-edged, soft-shadowed — floats on the page.
  return (
    <div
      role="img"
      aria-label={moment.alt}
      className={`bg-cover bg-center ${className}`}
      style={{
        backgroundImage: `url(${moment.src})`,
        WebkitMaskImage: FEATHER,
        WebkitMaskComposite: "source-in",
        maskImage: FEATHER,
        maskComposite: "intersect",
        filter: "drop-shadow(0 18px 30px rgba(28,53,87,0.22))",
      }}
    />
  );
}
