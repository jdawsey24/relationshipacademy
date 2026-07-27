"use client";

// Owner-aware CTA for a Playbook detail page. Default (and for non-owners / while
// loading / no-JS): the buy button. For an owner of a playbook that has an
// interactive experience: "Open your Playbook" (interactive primary), with the PDF
// offered as a supporting download (R7). Ownership is resolved client-side so the
// marketing page stays static.

import { useEffect, useState } from "react";
import Link from "next/link";
import PlaybookBuyButton from "@/components/site/PlaybookBuyButton";

interface Access {
  signedIn: boolean;
  interactive: boolean;
  owned: boolean;
}

export function showsOpen(access: Access | undefined): boolean {
  return Boolean(access?.owned && access?.interactive);
}

export default function PlaybookCta({
  clusterId,
  slug,
  buyLabel,
  className = "",
}: {
  clusterId: number;
  slug: string;
  buyLabel: string;
  className?: string;
}) {
  const [access, setAccess] = useState<Access | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    fetch(`/api/playbook/${encodeURIComponent(slug)}/access`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d) setAccess(d as Access);
      })
      .catch(() => {
        /* leave as buy button */
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (showsOpen(access)) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <Link
          href={`/playbook/${slug}`}
          className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-coral-rose px-8 font-ui text-base font-medium text-white transition-colors hover:bg-coral-rose/90"
        >
          Open your Playbook →
        </Link>
        <a href={`/api/playbooks/${clusterId}/download`} className="font-ui text-sm text-charcoal/55 underline hover:text-charcoal">
          Prefer the PDF? Download it
        </a>
      </div>
    );
  }

  return <PlaybookBuyButton clusterId={clusterId} label={buyLabel} className={className} />;
}
