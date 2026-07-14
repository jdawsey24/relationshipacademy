"use client";

import { useEffect, useRef } from "react";
import MomentTile from "./MomentTile";
import ResultsPreviewMock from "./ResultsPreviewMock";
import { MOMENTS } from "./moments";

// The hero composition: the Snapshot results preview as the central object, with
// Relationship Moments™ floating at different depths around it. Gentle float via
// CSS; subtle pointer parallax layered on top (outer node = parallax, inner node
// = float, so they compose). Both disabled under prefers-reduced-motion.
export default function HeroMoments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.querySelectorAll<HTMLElement>("[data-depth]").forEach((n) => {
          const d = parseFloat(n.dataset.depth || "0");
          n.style.transform = `translate3d(${dx * d * 22}px, ${dy * d * 22}px, 0)`;
        });
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => { window.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[500px]">
      <style>{`
        @keyframes lm-float-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes lm-float-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes lm-float-c { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .lm-a{animation:lm-float-a 7s ease-in-out infinite}
        .lm-b{animation:lm-float-b 9s ease-in-out infinite}
        .lm-c{animation:lm-float-c 8s ease-in-out infinite}
        @media (prefers-reduced-motion: reduce){ .lm-a,.lm-b,.lm-c{animation:none} }
      `}</style>

      {/* soft ambient glow */}
      <div className="pointer-events-none absolute inset-6 -z-10 rounded-[40%] bg-gradient-to-br from-soft-coral/20 via-sage-green/10 to-dusty-plum/15 blur-2xl" />

      {/* center: results preview */}
      <div data-depth="0.5" className="absolute left-1/2 top-1/2 w-[64%] -translate-x-1/2 -translate-y-1/2 will-change-transform">
        <div className="lm-b"><ResultsPreviewMock /></div>
      </div>

      {/* floating moments */}
      <div data-depth="1.4" className="absolute left-0 top-4 h-28 w-36 will-change-transform">
        <div className="lm-a h-full w-full"><MomentTile moment={MOMENTS.coffee} className="h-full w-full" /></div>
      </div>
      <div data-depth="1.8" className="absolute right-0 top-20 h-24 w-28 will-change-transform">
        <div className="lm-c h-full w-full"><MomentTile moment={MOMENTS.walking} className="h-full w-full" /></div>
      </div>
      <div data-depth="1.1" className="absolute bottom-2 left-6 h-24 w-32 will-change-transform">
        <div className="lm-b h-full w-full"><MomentTile moment={MOMENTS.journal} className="h-full w-full" /></div>
      </div>
      <div data-depth="2" className="absolute bottom-14 right-2 h-20 w-24 will-change-transform">
        <div className="lm-a h-full w-full"><MomentTile moment={MOMENTS.planning} className="h-full w-full" /></div>
      </div>
    </div>
  );
}
