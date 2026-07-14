import type { Moment } from "./moments";

// Feather all four edges so the photo has no hard border.
const FEATHER =
  "linear-gradient(to right, transparent, #000 13%, #000 87%, transparent), linear-gradient(to bottom, transparent, #000 13%, #000 87%, transparent)";

export default function MomentTile({
  moment,
  className = "",
  variant = "embed",
}: {
  moment: Moment;
  className?: string;
  variant?: "embed" | "framed";
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
  // Embed: feathered edges + multiply blend + reduced opacity, so the image
  // recedes and reads as part of the ivory surface rather than sitting on top.
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
        mixBlendMode: "multiply",
        opacity: 0.85,
      }}
    />
  );
}
