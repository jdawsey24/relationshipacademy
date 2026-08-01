// An ambient, living diagram of the Relationship Life Cycle™ framework, for the
// homepage hero. The outer ring is the six developmental phases (cyclical, not
// terminal); the inner constellation is the six universal domains, each in a
// palette hue that ties back to the per-playbook mark system; a coral highlight
// travels the cycle. Pure SVG + CSS — no JS loop, and it freezes gracefully under
// prefers-reduced-motion.

const PHASES = [
  { label: "Exploration", node: [200, 60], text: [200, 38], anchor: "middle" },
  { label: "Exclusivity", node: [321.2, 130], text: [340.3, 119], anchor: "start" },
  { label: "Expansion", node: [321.2, 270], text: [340.3, 281], anchor: "start" },
  { label: "Expiration", node: [200, 340], text: [200, 366], anchor: "middle" },
  { label: "Recovery", node: [78.8, 270], text: [59.7, 281], anchor: "end" },
  { label: "Renewal", node: [78.8, 130], text: [59.7, 119], anchor: "end" },
] as const;

// six universal domains — hues mirror components/site/PlaybookMark
const DOMAINS: Array<{ pos: [number, number]; hue: string }> = [
  { pos: [229, 150], hue: "#D9777D" }, // Communication
  { pos: [258, 200], hue: "#8A9D8F" }, // Trust
  { pos: [229, 250], hue: "#6B7C97" }, // Conflict Management
  { pos: [171, 250], hue: "#9C7A97" }, // Emotional Intimacy
  { pos: [142, 200], hue: "#C9A96E" }, // Role Functioning
  { pos: [171, 150], hue: "#E7A2A4" }, // Physical / Sexual Intimacy
];

export default function FrameworkCycle({ className }: { className?: string }) {
  return (
    <div className={className}>
      <style>{`
        .fh{width:100%;height:auto;overflow:visible;}
        .fh-spin{transform-box:view-box;transform-origin:200px 200px;animation:fh-spin 30s linear infinite;}
        .fh-spin-slow{transform-box:view-box;transform-origin:200px 200px;animation:fh-spin 90s linear infinite;}
        .fh-node{transform-box:fill-box;transform-origin:center;animation:fh-pulse 6s ease-in-out infinite;}
        .fh-dom{transform-box:fill-box;transform-origin:center;animation:fh-twinkle 5s ease-in-out infinite;}
        @keyframes fh-spin{to{transform:rotate(360deg);}}
        @keyframes fh-pulse{0%,100%{opacity:.55;}50%{opacity:1;}}
        @keyframes fh-twinkle{0%,100%{opacity:.45;transform:scale(.9);}50%{opacity:1;transform:scale(1.12);}}
        @media (prefers-reduced-motion: reduce){
          .fh-spin,.fh-spin-slow,.fh-node,.fh-dom{animation:none;}
          .fh-dom{opacity:.85;}
        }
      `}</style>
      <svg className="fh" viewBox="-32 -8 464 416" role="img"
        aria-label="The Relationship Life Cycle framework: six developmental phases around a cycle, with six universal domains at the centre.">

        {/* faint atmosphere */}
        <circle cx="200" cy="200" r="140" fill="none" stroke="#1C3557" strokeOpacity="0.12" strokeWidth="1.25" />
        <circle className="fh-spin-slow" cx="200" cy="200" r="100" fill="none" stroke="#8A9D8F" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="2 8" strokeLinecap="round" />
        <circle cx="200" cy="200" r="58" fill="none" stroke="#1C3557" strokeOpacity="0.08" strokeWidth="1" />

        {/* centre hub */}
        <circle cx="200" cy="200" r="20" fill="#1C3557" fillOpacity="0.05" />
        <circle cx="200" cy="200" r="3.5" fill="#1C3557" fillOpacity="0.55" />

        {/* six domains — the inner constellation */}
        {DOMAINS.map((d, i) => (
          <circle key={i} className="fh-dom" cx={d.pos[0]} cy={d.pos[1]} r="4.5" fill={d.hue}
            style={{ animationDelay: `${i * 0.7}s` }} />
        ))}

        {/* six phases — nodes + labels around the cycle */}
        {PHASES.map((p, i) => (
          <g key={p.label}>
            <circle className="fh-node" cx={p.node[0]} cy={p.node[1]} r="5.5" fill="#1C3557"
              style={{ animationDelay: `${i * 0.9}s` }} />
            <text x={p.text[0]} y={p.text[1]} textAnchor={p.anchor} dominantBaseline="middle"
              className="font-ui" fontSize="11.5" fontWeight={600} letterSpacing="0.02em" fill="#1C3557" fillOpacity="0.62">
              {p.label}
            </text>
          </g>
        ))}

        {/* the highlight travelling the cycle */}
        <g className="fh-spin">
          <circle cx="200" cy="60" r="11" fill="#D9777D" fillOpacity="0.22" />
          <circle cx="200" cy="60" r="5" fill="#D9777D" />
        </g>
      </svg>
    </div>
  );
}
