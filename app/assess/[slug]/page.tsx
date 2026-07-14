"use client";

import { useParams } from "next/navigation";
import AssessFlow from "@/components/assess/AssessFlow";

export default function AssessQuizPage() {
  const { slug } = useParams<{ slug: string }>();
  return <AssessFlow slug={slug} resultsHref={(a) => `/assess/${encodeURIComponent(slug)}/results?attempt=${a}`} />;
}
