// Brand logo. Renders the real transparent PNG assets in /public
// (generated from the uploaded artwork: white keyed out, trimmed, downscaled).
//
// Size the logo by passing a height class (e.g. "h-10") via className; width
// scales automatically.

import Link from "next/link";

type Variant = "full" | "wordmark" | "mark" | "monogram";

const SRC: Record<Variant, string> = {
  full: "/logo-full.png",
  wordmark: "/logo-full.png",
  mark: "/logo-mark.png",
  monogram: "/logo-mark.png",
};

interface LogoProps {
  variant?: Variant;
  className?: string;
  /** When set, the logo links here. */
  href?: string;
}

export default function Logo({ variant = "full", className = "", href }: LogoProps) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SRC[variant]}
      alt="Relationship Life Cycle"
      className={`w-auto ${className}`}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center" aria-label="Relationship Life Cycle">
        {img}
      </Link>
    );
  }
  return img;
}
