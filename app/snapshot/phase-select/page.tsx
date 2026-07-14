import { redirect } from "next/navigation";

// Legacy step — the flagship is now a single-page flow at /snapshot/intro.
export default function PhaseSelectRedirect() {
  redirect("/snapshot/intro");
}
