import { redirect } from "next/navigation";

// Legacy step — capture is now part of the single-page flow at /snapshot/intro.
export default function CaptureRedirect() {
  redirect("/snapshot/intro");
}
