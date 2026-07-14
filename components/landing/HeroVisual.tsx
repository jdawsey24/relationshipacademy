import ResultsPreviewMock from "./ResultsPreviewMock";

// Hero visual: the Snapshot results preview as the single hero object, on a soft
// ambient glow, gently floating. No photography.
export default function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[420px] py-8">
      <style>{`
        @keyframes hv-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .hv-float { animation: hv-float 6s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce){ .hv-float{animation:none} }
      `}</style>
      <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[42%] bg-gradient-to-br from-soft-coral/25 via-transparent to-sage-green/20 blur-3xl" />
      <div className="hv-float"><ResultsPreviewMock /></div>
    </div>
  );
}
