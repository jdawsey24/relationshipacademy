import Link from "next/link";

// Site CTA button. Primary (navy fill), secondary (navy outline), accent
// (coral fill — community CTA only). Renders an internal Link or external <a>.

type Variant = "primary" | "secondary" | "accent";

interface CtaButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
}

const VARIANT: Record<Variant, string> = {
  primary: "bg-midnight-navy text-white hover:bg-midnight-navy/90",
  secondary:
    "border border-midnight-navy text-midnight-navy hover:bg-midnight-navy hover:text-white",
  accent: "bg-coral-rose text-white hover:bg-coral-rose/90",
};

export default function CtaButton({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: CtaButtonProps) {
  const cls = `inline-flex min-h-[52px] items-center justify-center rounded-full px-8 font-ui text-base font-medium transition-colors ${VARIANT[variant]} ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
