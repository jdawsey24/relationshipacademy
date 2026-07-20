"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import CompanionChrome from "@/components/companion/CompanionChrome";

interface Detail {
  situation_id: string; title: string; definition: string | null; user_need: string | null;
  category: string | null; publication_status: string; experience_slug: string | null;
}

export default function CompanionSituation() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [d, setD] = useState<Detail | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/companion/situations/${id}`).then((r) => { if (!r.ok) throw new Error(); return r.json(); }).then(setD).catch(() => setNotFound(true));
  }, [id]);

  if (notFound) return <CompanionChrome active="process"><p className="font-body text-sm text-charcoal/55">This isn&apos;t available right now.</p></CompanionChrome>;
  if (!d) return <CompanionChrome active="process"><p className="font-body text-sm text-charcoal/50">Loading…</p></CompanionChrome>;

  return (
    <CompanionChrome active="process">
      <button onClick={() => router.back()} className="font-ui text-sm text-charcoal/55">← Back</button>
      {d.category && <p className="mt-3 font-ui text-[11px] font-semibold uppercase tracking-wide text-charcoal/45">{d.category}</p>}
      <h1 className="mt-1 text-balance font-display text-3xl font-semibold leading-tight text-midnight-navy">{d.title}</h1>
      {d.publication_status !== "Published" && <p className="mt-1 font-ui text-[11px] uppercase tracking-wide text-coral-rose">Staff preview · {d.publication_status}</p>}

      {d.user_need && <p className="mt-4 font-body text-lg leading-relaxed text-charcoal/80">{d.user_need}</p>}
      {d.definition && <p className="mt-3 font-body text-[15px] leading-relaxed text-charcoal/65">{d.definition}</p>}

      <div className="mt-8">
        {d.experience_slug ? (
          <Link href={`/companion/process/${d.experience_slug}`} className="inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-midnight-navy px-8 font-ui text-sm font-semibold text-white">
            Begin
          </Link>
        ) : (
          <div className="rounded-2xl border border-dashed border-light-gray bg-white/60 p-6 text-center font-body text-sm text-charcoal/55">
            A guided experience for this situation is being prepared.
          </div>
        )}
      </div>
    </CompanionChrome>
  );
}
