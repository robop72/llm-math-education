import React from 'react';

// ── Shared SVG helpers ────────────────────────────────────────────────────────

const T = ({ x, y, size = 11, anchor = 'middle', weight = 'normal', fill = '#e5e7eb', children }: {
  x: number; y: number; size?: number; anchor?: string; weight?: string; fill?: string; children: React.ReactNode;
}) => (
  <text x={x} y={y} fontSize={size} textAnchor={anchor} dominantBaseline="middle" fontWeight={weight} fill={fill} fontFamily="system-ui,sans-serif">
    {children}
  </text>
);

const Arrow = ({ x1, y1, x2, y2, color = '#6b7280' }: { x1: number; y1: number; x2: number; y2: number; color?: string }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} markerEnd="url(#arr)" />
);

const arrowDef = (
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#6b7280" />
    </marker>
    <marker id="arrb" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" />
    </marker>
    <marker id="arrg" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
    </marker>
  </defs>
);

// ── English Diagrams ──────────────────────────────────────────────────────────

const TeelParagraph = () => (
  <svg viewBox="0 0 600 150" width="100%" style={{ maxHeight: 150 }}>
    {arrowDef}
    {[
      { x: 10,  label: 'T', title: 'Topic Sentence',   sub: 'State your argument',    color: '#3b82f6' },
      { x: 155, label: 'E', title: 'Evidence',         sub: 'Quote or example',       color: '#10b981' },
      { x: 300, label: 'E', title: 'Explanation',      sub: 'How does it support?',   color: '#8b5cf6' },
      { x: 445, label: 'L', title: 'Linking Sentence', sub: 'Connect back to thesis', color: '#f59e0b' },
    ].map(({ x, label, title, sub, color }, i, arr) => (
      <g key={label + i}>
        <rect x={x} y={15} width={130} height={115} rx={8} fill={color} opacity={0.15} stroke={color} strokeWidth={1.5} />
        <T x={x + 65} y={52} size={28} weight="bold" fill={color}>{label}</T>
        <T x={x + 65} y={88} size={10} weight="bold" fill="#e5e7eb">{title}</T>
        <T x={x + 65} y={108} size={9} fill="#9ca3af">{sub}</T>
        {i < arr.length - 1 && <Arrow x1={x + 135} y1={72} x2={x + 150} y2={72} />}
      </g>
    ))}
  </svg>
);

const EssayStructure = () => (
  <svg viewBox="0 0 320 340" width="100%" style={{ maxHeight: 340 }}>
    {arrowDef}
    {[
      { y: 10,  label: 'INTRODUCTION',  sub: 'Hook · Context · Thesis',            color: '#3b82f6', h: 55 },
      { y: 75,  label: 'BODY 1',        sub: 'Topic sentence · TEEL · Link',       color: '#10b981', h: 50 },
      { y: 135, label: 'BODY 2',        sub: 'Topic sentence · TEEL · Link',       color: '#10b981', h: 50 },
      { y: 195, label: 'BODY 3',        sub: 'Topic sentence · TEEL · Link',       color: '#10b981', h: 50 },
      { y: 255, label: 'CONCLUSION',    sub: 'Restate thesis · Summarise · Clinch', color: '#8b5cf6', h: 55 },
    ].map(({ y, label, sub, color, h }, i, arr) => (
      <g key={label}>
        <rect x={20} y={y} width={280} height={h} rx={7} fill={color} opacity={0.15} stroke={color} strokeWidth={1.5} />
        <T x={160} y={y + h / 2 - 8} size={11} weight="bold" fill={color}>{label}</T>
        <T x={160} y={y + h / 2 + 10} size={9} fill="#9ca3af">{sub}</T>
        {i < arr.length - 1 && <Arrow x1={160} y1={y + h + 1} x2={160} y2={y + h + 12} />}
      </g>
    ))}
  </svg>
);

const StoryArc = () => (
  <svg viewBox="0 0 600 220" width="100%" style={{ maxHeight: 220 }}>
    {arrowDef}
    <path d="M 30,190 L 160,80 L 300,30 L 420,90 L 580,190" fill="none" stroke="#8b5cf6" strokeWidth={2.5} strokeLinejoin="round" />
    <circle cx={30}  cy={190} r={5} fill="#8b5cf6" />
    <circle cx={160} cy={80}  r={5} fill="#8b5cf6" />
    <circle cx={300} cy={30}  r={7} fill="#f59e0b" />
    <circle cx={420} cy={90}  r={5} fill="#8b5cf6" />
    <circle cx={580} cy={190} r={5} fill="#8b5cf6" />
    {[
      { x: 30,  y: 190, label: 'Exposition',      sub: 'Characters &\nsetting introduced', anchor: 'start' },
      { x: 155, y: 80,  label: 'Rising Action',   sub: 'Conflict builds,\ntension grows',     anchor: 'middle' },
      { x: 300, y: 30,  label: 'Climax',          sub: 'Peak tension,\nturning point',        anchor: 'middle' },
      { x: 430, y: 90,  label: 'Falling Action',  sub: 'Consequences\nunfold',                anchor: 'middle' },
      { x: 580, y: 190, label: 'Resolution',      sub: 'Conflict resolved,\nnew normal',      anchor: 'end' },
    ].map(({ x, y, label, sub, anchor }) => (
      <g key={label}>
        <T x={x} y={y - 16} size={10} weight="bold" fill="#e5e7eb" anchor={anchor}>{label}</T>
        {sub.split('\n').map((line, i) => (
          <T key={i} x={x} y={y - 4 + (i * 13) + 22} size={9} fill="#9ca3af" anchor={anchor}>{line}</T>
        ))}
      </g>
    ))}
    <line x1={30} y1={195} x2={580} y2={195} stroke="#374151" strokeWidth={1} strokeDasharray="4 3" />
  </svg>
);

const PersuasiveStructure = () => (
  <svg viewBox="0 0 600 140" width="100%" style={{ maxHeight: 140 }}>
    {arrowDef}
    {[
      { x: 10,  label: 'CLAIM',       sub: 'Your position\nor argument',  color: '#3b82f6' },
      { x: 155, label: 'EVIDENCE',    sub: 'Facts, stats,\nexpert quotes', color: '#10b981' },
      { x: 300, label: 'REASONING',   sub: 'Explain HOW\nevidence fits',  color: '#8b5cf6' },
      { x: 445, label: 'REBUTTAL',    sub: 'Address the\nopposing view',  color: '#f59e0b' },
    ].map(({ x, label, sub, color }, i, arr) => (
      <g key={label}>
        <rect x={x} y={10} width={130} height={120} rx={8} fill={color} opacity={0.15} stroke={color} strokeWidth={1.5} />
        <T x={x + 65} y={42} size={10} weight="bold" fill={color}>{label}</T>
        {sub.split('\n').map((line, j) => (
          <T key={j} x={x + 65} y={62 + j * 16} size={9} fill="#9ca3af">{line}</T>
        ))}
        {i < arr.length - 1 && <Arrow x1={x + 135} y1={70} x2={x + 150} y2={70} />}
      </g>
    ))}
  </svg>
);

const ArgumentMap = () => (
  <svg viewBox="0 0 520 260" width="100%" style={{ maxHeight: 260 }}>
    {arrowDef}
    <rect x={170} y={10} width={180} height={50} rx={8} fill="#3b82f6" opacity={0.2} stroke="#3b82f6" strokeWidth={1.5} />
    <T x={260} y={35} size={11} weight="bold" fill="#3b82f6">THESIS / CONTENTION</T>
    {[
      { x: 20,  y: 100, label: 'ARGUMENT 1', sub: '1st reason\nsupporting claim' },
      { x: 190, y: 100, label: 'ARGUMENT 2', sub: '2nd reason\nsupporting claim' },
      { x: 360, y: 100, label: 'ARGUMENT 3', sub: '3rd reason\nsupporting claim' },
    ].map(({ x, y, label, sub }) => (
      <g key={label}>
        <line x1={260} y1={60} x2={x + 80} y2={y} stroke="#6b7280" strokeWidth={1.5} markerEnd="url(#arr)" />
        <rect x={x} y={y} width={140} height={60} rx={7} fill="#10b981" opacity={0.15} stroke="#10b981" strokeWidth={1.5} />
        <T x={x + 70} y={y + 20} size={9} weight="bold" fill="#10b981">{label}</T>
        {sub.split('\n').map((line, i) => <T key={i} x={x + 70} y={y + 36 + i * 14} size={9} fill="#9ca3af">{line}</T>)}
        <rect x={x + 15} y={y + 80} width={110} height={40} rx={5} fill="#374151" />
        <T x={x + 70} y={y + 100} size={8} fill="#9ca3af">Evidence &amp; example</T>
        <line x1={x + 70} y1={y + 60} x2={x + 70} y2={y + 80} stroke="#6b7280" strokeWidth={1} markerEnd="url(#arr)" />
      </g>
    ))}
  </svg>
);

// ── Science Diagrams ──────────────────────────────────────────────────────────

const AnimalCell = () => (
  <svg viewBox="0 0 500 300" width="100%" style={{ maxHeight: 300 }}>
    <ellipse cx={220} cy={155} rx={175} ry={125} fill="#1e3a5f" stroke="#3b82f6" strokeWidth={2} opacity={0.6} />
    <T x={30} y={22} size={9} fill="#60a5fa" anchor="start">Cell membrane</T>
    <line x1={75} y1={32} x2={65} y2={55} stroke="#60a5fa" strokeWidth={1} />
    <ellipse cx={220} cy={145} rx={55} ry={42} fill="#312e81" stroke="#8b5cf6" strokeWidth={2} />
    <T x={220} y={138} size={9} weight="bold" fill="#a78bfa">Nucleus</T>
    <ellipse cx={220} cy={148} rx={18} ry={14} fill="#4c1d95" stroke="#7c3aed" strokeWidth={1.5} />
    <T x={220} y={148} size={7} fill="#c4b5fd">Nucleolus</T>
    {[
      { cx: 130, cy: 200, label: 'Mitochondria', color: '#dc2626' },
      { cx: 330, cy: 195, label: 'Mitochondria', color: '#dc2626' },
    ].map(({ cx, cy, label, color }, i) => (
      <g key={i}>
        <ellipse cx={cx} cy={cy} rx={28} ry={16} fill={color} opacity={0.25} stroke={color} strokeWidth={1.5} />
        <T x={cx} y={cy + 28} size={8} fill="#fca5a5">{label}</T>
        <line x1={cx} y1={cy + 16} x2={cx} y2={cy + 22} stroke="#fca5a5" strokeWidth={1} />
      </g>
    ))}
    {[{ cx: 310, cy: 105 }, { cx: 150, cy: 108 }, { cx: 260, cy: 230 }].map(({ cx, cy }, i) => (
      <circle key={i} cx={cx} cy={cy} r={5} fill="#fbbf24" opacity={0.8} />
    ))}
    <T x={350} y={85} size={8} fill="#fbbf24">Ribosomes</T>
    <line x1={335} y1={88} x2={320} y2={100} stroke="#fbbf24" strokeWidth={1} />
    <T x={220} y={265} size={9} fill="#6b7280">Cytoplasm fills the cell interior</T>
  </svg>
);

const PlantCell = () => (
  <svg viewBox="0 0 500 310" width="100%" style={{ maxHeight: 310 }}>
    <rect x={30} y={20} width={350} height={240} rx={4} fill="#14532d" stroke="#16a34a" strokeWidth={3} opacity={0.5} />
    <rect x={40} y={30} width={330} height={220} rx={2} fill="#1e3a5f" stroke="#3b82f6" strokeWidth={1.5} opacity={0.6} />
    <T x={30} y={14} size={9} fill="#4ade80" anchor="start">Cell wall</T>
    <T x={205} y={42} size={8} fill="#60a5fa">Cell membrane</T>
    <ellipse cx={205} cy={130} rx={48} ry={38} fill="#312e81" stroke="#8b5cf6" strokeWidth={2} />
    <T x={205} y={130} size={9} weight="bold" fill="#a78bfa">Nucleus</T>
    {[
      { x: 290, y: 60,  w: 65, h: 100, label: 'Large Vacuole', color: '#0e7490' },
    ].map(({ x, y, w, h, label, color }) => (
      <g key={label}>
        <rect x={x} y={y} width={w} height={h} rx={8} fill={color} opacity={0.3} stroke={color} strokeWidth={1.5} />
        <T x={x + w / 2} y={y + h / 2} size={8} fill="#67e8f9">{label}</T>
      </g>
    ))}
    {[
      { cx: 80,  cy: 80  },
      { cx: 110, cy: 180 },
      { cx: 260, cy: 190 },
    ].map(({ cx, cy }, i) => (
      <ellipse key={i} cx={cx} cy={cy} rx={18} ry={12} fill="#14532d" stroke="#22c55e" strokeWidth={1.5} opacity={0.9} />
    ))}
    <T x={60} y={55} size={8} fill="#86efac">Chloroplasts</T>
    <line x1={80} y1={62} x2={80} y2={68} stroke="#86efac" strokeWidth={1} />
    {[{ cx: 170, cy: 195 }, { cx: 240, cy: 80 }].map(({ cx, cy }, i) => (
      <ellipse key={i} cx={cx} cy={cy} rx={20} ry={12} fill="#dc2626" opacity={0.25} stroke="#dc2626" strokeWidth={1.5} />
    ))}
    <T x={415} y={130} size={8} fill="#fca5a5" anchor="start">Mito-</T>
    <T x={415} y={142} size={8} fill="#fca5a5" anchor="start">chondria</T>
    <line x1={413} y1={135} x2={260} y2={135} stroke="#fca5a5" strokeWidth={1} strokeDasharray="3 2" />
  </svg>
);

const WaterCycle = () => (
  <svg viewBox="0 0 600 300" width="100%" style={{ maxHeight: 300 }}>
    {arrowDef}
    <defs>
      <marker id="arrg2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
      </marker>
      <marker id="arrb2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#3b82f6" />
      </marker>
    </defs>
    <ellipse cx={300} cy={260} rx={280} ry={25} fill="#1e3a5f" stroke="#3b82f6" strokeWidth={1.5} />
    <T x={300} y={260} size={10} fill="#60a5fa">Ocean / Lake (Collection)</T>
    <path d="M 80,230 Q 40,140 100,80 Q 140,30 200,60 Q 250,20 300,50 Q 340,70 300,110" fill="#1e3a8a" stroke="#4f46e5" strokeWidth={1.5} opacity={0.7} />
    <T x={150} y={155} size={9} fill="#818cf8">Mountains</T>
    <ellipse cx={400} cy={80} rx={80} ry={40} fill="#374151" stroke="#6b7280" strokeWidth={1.5} opacity={0.8} />
    <ellipse cx={440} cy={65} rx={55} ry={32} fill="#4b5563" stroke="#9ca3af" strokeWidth={1} opacity={0.9} />
    <T x={420} y={75} size={10} fill="#e5e7eb">Clouds</T>
    <path d="M 200,240 Q 170,160 180,100" fill="none" stroke="#10b981" strokeWidth={2} markerEnd="url(#arrg2)" strokeDasharray="6 3" />
    <T x={130} y={175} size={9} fill="#34d399">Evaporation</T>
    <path d="M 180,100 Q 270,50 370,70" fill="none" stroke="#9ca3af" strokeWidth={1.5} markerEnd="url(#arr)" />
    <T x={265} y={45} size={9} fill="#d1d5db">Condensation</T>
    {[390, 410, 425, 445, 460].map((x, i) => (
      <path key={i} d={`M ${x},${115 + i * 3} L ${x - 8 + i * 2},${140 + i * 4}`} fill="none" stroke="#3b82f6" strokeWidth={1.5} markerEnd="url(#arrb2)" />
    ))}
    <T x={480} y={140} size={9} fill="#60a5fa">Precipitation</T>
    <path d="M 290,230 Q 250,195 220,165" fill="none" stroke="#6b7280" strokeWidth={1.5} markerEnd="url(#arr)" />
    <T x={310} y={205} size={9} fill="#9ca3af">Runoff</T>
    <path d="M 170,240 Q 140,180 155,100" fill="none" stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#arr)" strokeDasharray="5 3" />
    <T x={90} y={185} size={9} fill="#fcd34d">Transpiration</T>
    <circle cx={540} cy={60} r={25} fill="#fbbf24" opacity={0.25} stroke="#fbbf24" strokeWidth={2} />
    <T x={540} y={60} size={9} fill="#fbbf24">Sun</T>
  </svg>
);

const FoodChain = () => (
  <svg viewBox="0 0 600 160" width="100%" style={{ maxHeight: 160 }}>
    {arrowDef}
    {[
      { x: 20,  emoji: '☀️',  label: 'Sun',     sub: 'Energy source',    color: '#fbbf24' },
      { x: 135, emoji: '🌿', label: 'Grass',    sub: 'Producer',         color: '#10b981' },
      { x: 255, emoji: '🐇', label: 'Rabbit',   sub: 'Primary Consumer', color: '#60a5fa' },
      { x: 375, emoji: '🦊', label: 'Fox',      sub: '2° Consumer',      color: '#f59e0b' },
      { x: 490, emoji: '🦅', label: 'Eagle',    sub: '3° Consumer',      color: '#a78bfa' },
    ].map(({ x, emoji, label, sub, color }, i, arr) => (
      <g key={label}>
        <rect x={x} y={25} width={95} height={100} rx={8} fill={color} opacity={0.1} stroke={color} strokeWidth={1.5} />
        <T x={x + 47} y={55} size={22}>{emoji}</T>
        <T x={x + 47} y={90} size={10} weight="bold" fill={color}>{label}</T>
        <T x={x + 47} y={108} size={8} fill="#9ca3af">{sub}</T>
        {i < arr.length - 1 && <Arrow x1={x + 98} y1={75} x2={x + 130} y2={75} />}
      </g>
    ))}
    <T x={300} y={148} size={9} fill="#6b7280">Energy flows in the direction of the arrows</T>
  </svg>
);

const AtomBohr = () => (
  <svg viewBox="0 0 380 280" width="100%" style={{ maxHeight: 280 }}>
    <circle cx={190} cy={140} r={28} fill="#1e3a5f" stroke="#3b82f6" strokeWidth={2} />
    <T x={190} y={135} size={9} fill="#93c5fd">Protons (+)</T>
    <T x={190} y={150} size={9} fill="#fca5a5">Neutrons</T>
    {[75, 115, 155].map((r, shell) => (
      <ellipse key={shell} cx={190} cy={140} rx={r} ry={r * 0.5} fill="none" stroke="#374151" strokeWidth={1.5} strokeDasharray="4 3" />
    ))}
    {[
      { angle: 0,   r: 75,  shell: 1 },
      { angle: 180, r: 75,  shell: 1 },
      { angle: 60,  r: 115, shell: 2 },
      { angle: 140, r: 115, shell: 2 },
      { angle: 220, r: 115, shell: 2 },
      { angle: 300, r: 115, shell: 2 },
      { angle: 30,  r: 155, shell: 3 },
      { angle: 90,  r: 155, shell: 3 },
    ].map(({ angle, r, shell }, i) => {
      const rad = (angle * Math.PI) / 180;
      const rx = r; const ry = r * 0.5;
      const ex = 190 + rx * Math.cos(rad);
      const ey = 140 + ry * Math.sin(rad);
      return <circle key={i} cx={ex} cy={ey} r={6} fill="#fbbf24" stroke="#f59e0b" strokeWidth={1} />;
    })}
    <T x={190} y={140 - 75 * 0.5 - 12} size={9} fill="#9ca3af">Shell 1 (2e⁻)</T>
    <T x={190} y={140 - 115 * 0.5 - 12} size={9} fill="#9ca3af">Shell 2 (8e⁻)</T>
    <T x={190} y={140 - 155 * 0.5 - 12} size={9} fill="#9ca3af">Shell 3</T>
    <T x={335} y={140} size={9} fill="#fbbf24" anchor="start">Electron (−)</T>
  </svg>
);

const CircuitSeries = () => (
  <svg viewBox="0 0 500 240" width="100%" style={{ maxHeight: 240 }}>
    <line x1={60} y1={60}  x2={440} y2={60}  stroke="#9ca3af" strokeWidth={2} />
    <line x1={440} y1={60} x2={440} y2={180} stroke="#9ca3af" strokeWidth={2} />
    <line x1={440} y1={180} x2={60} y2={180} stroke="#9ca3af" strokeWidth={2} />
    <line x1={60} y1={180} x2={60} y2={60}   stroke="#9ca3af" strokeWidth={2} />
    <rect x={35} y={100} width={50} height={70} rx={4} fill="#1f2937" stroke="#6b7280" strokeWidth={2} />
    <line x1={60} y1={100} x2={60} y2={95}  stroke="#ef4444" strokeWidth={2} />
    <line x1={60} y1={170} x2={60} y2={175} stroke="#6b7280" strokeWidth={2} />
    <rect x={42} y={108} width={16} height={50} rx={2} fill="#374151" />
    {[{ x: 2 }, { x: 6 }, { x: 10 }, { x: 14 }].map(({ x }, i) => (
      <line key={i} x1={42 + x} y1={115} x2={42 + x + 2} y2={145} stroke="#fbbf24" strokeWidth={1} opacity={0.8} />
    ))}
    <T x={60} y={208} size={9} fill="#9ca3af">Battery</T>
    {[160, 300].map((cx, i) => (
      <g key={i}>
        <circle cx={cx} cy={60}  r={18} fill="#1f2937" stroke="#fbbf24" strokeWidth={2} />
        <line x1={cx - 8} y1={52}  x2={cx + 8} y2={68} stroke="#fbbf24" strokeWidth={2} />
        <line x1={cx + 8} y1={52}  x2={cx - 8} y2={68} stroke="#fbbf24" strokeWidth={2} />
        <T x={cx} y={35} size={9} fill="#fcd34d">Bulb {i + 1}</T>
      </g>
    ))}
    <T x={250} y={208} size={9} fill="#6b7280">Series Circuit — same current through each component</T>
  </svg>
);

const CircuitParallel = () => (
  <svg viewBox="0 0 500 260" width="100%" style={{ maxHeight: 260 }}>
    <line x1={60} y1={50}  x2={440} y2={50}  stroke="#9ca3af" strokeWidth={2} />
    <line x1={440} y1={50} x2={440} y2={210} stroke="#9ca3af" strokeWidth={2} />
    <line x1={440} y1={210} x2={60} y2={210} stroke="#9ca3af" strokeWidth={2} />
    <line x1={60} y1={210} x2={60} y2={50}   stroke="#9ca3af" strokeWidth={2} />
    <line x1={200} y1={50}  x2={200} y2={210} stroke="#374151" strokeWidth={1.5} />
    <line x1={320} y1={50}  x2={320} y2={210} stroke="#374151" strokeWidth={1.5} />
    <rect x={35} y={105} width={50} height={70} rx={4} fill="#1f2937" stroke="#6b7280" strokeWidth={2} />
    <T x={60} y={228} size={9} fill="#9ca3af">Battery</T>
    {[
      { cx: 260, cy: 50,  label: 'Bulb 1' },
      { cx: 260, cy: 210, label: 'Bulb 2' },
    ].map(({ cx, cy, label }, i) => (
      <g key={i}>
        <circle cx={cx} cy={cy} r={18} fill="#1f2937" stroke="#fbbf24" strokeWidth={2} />
        <line x1={cx - 8} y1={cy - 8} x2={cx + 8} y2={cy + 8} stroke="#fbbf24" strokeWidth={2} />
        <line x1={cx + 8} y1={cy - 8} x2={cx - 8} y2={cy + 8} stroke="#fbbf24" strokeWidth={2} />
        <T x={cx} y={cy + (i === 0 ? -28 : 28)} size={9} fill="#fcd34d">{label}</T>
      </g>
    ))}
    <T x={250} y={248} size={9} fill="#6b7280">Parallel Circuit — same voltage across each branch</T>
  </svg>
);

const WaveDiagram = () => (
  <svg viewBox="0 0 600 220" width="100%" style={{ maxHeight: 220 }}>
    {arrowDef}
    <line x1={30} y1={110} x2={580} y2={110} stroke="#374151" strokeWidth={1} strokeDasharray="4 3" />
    <path d="M 40,110 C 80,40 120,40 160,110 C 200,180 240,180 280,110 C 320,40 360,40 400,110 C 440,180 480,180 520,110" fill="none" stroke="#3b82f6" strokeWidth={2.5} />
    <line x1={160} y1={42}  x2={160} y2={108} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 2" />
    <line x1={280} y1={112} x2={280} y2={178} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 2" />
    <line x1={40}  y1={42}  x2={40}  y2={178} stroke="#6b7280" strokeWidth={1} strokeDasharray="2 2" />
    <line x1={40}  y1={110} x2={160} y2={110} stroke="#fbbf24" strokeWidth={2} />
    <T x={100} y={125} size={10} fill="#fcd34d" weight="bold">Amplitude (A)</T>
    <line x1={160} y1={42}  x2={40}  y2={42}  stroke="#fbbf24" strokeWidth={2} />
    <line x1={40}  y1={178} x2={280} y2={178} stroke="#10b981" strokeWidth={2} />
    <T x={160} y={196} size={10} fill="#34d399" weight="bold">Wavelength (λ)</T>
    <T x={40}  y={42}  size={10} fill="#93c5fd" anchor="start">Crest</T>
    <T x={280} y={196} size={10} fill="#93c5fd" anchor="middle">Trough</T>
    <Arrow x1={540} y1={110} x2={575} y2={110} color="#9ca3af" />
    <T x={555} y={100} size={9} fill="#9ca3af">Direction</T>
    <T x={300} y={20} size={10} fill="#6b7280">Transverse Wave</T>
  </svg>
);

const ParticleStates = () => (
  <svg viewBox="0 0 580 220" width="100%" style={{ maxHeight: 220 }}>
    {[
      { x: 10,  label: 'SOLID',  sub: 'Fixed shape &\nfixed volume', color: '#3b82f6',
        dots: [{cx:65,cy:75},{cx:95,cy:75},{cx:125,cy:75},{cx:155,cy:75},{cx:65,cy:105},{cx:95,cy:105},{cx:125,cy:105},{cx:155,cy:105},{cx:65,cy:135},{cx:95,cy:135},{cx:125,cy:135},{cx:155,cy:135}] },
      { x: 200, label: 'LIQUID', sub: 'No fixed shape,\nfixed volume',  color: '#10b981',
        dots: [{cx:255,cy:80},{cx:290,cy:85},{cx:325,cy:78},{cx:355,cy:83},{cx:265,cy:110},{cx:300,cy:115},{cx:340,cy:108},{cx:260,cy:140},{cx:295,cy:143},{cx:330,cy:138},{cx:360,cy:142}] },
      { x: 390, label: 'GAS',   sub: 'No fixed shape,\nno fixed volume', color: '#f59e0b',
        dots: [{cx:430,cy:70},{cx:490,cy:90},{cx:550,cy:75},{cx:450,cy:120},{cx:520,cy:110},{cx:470,cy:155},{cx:540,cy:145},{cx:435,cy:145}] },
    ].map(({ x, label, sub, color, dots }) => (
      <g key={label}>
        <rect x={x} y={30} width={180} height={145} rx={8} fill={color} opacity={0.08} stroke={color} strokeWidth={1.5} />
        <T x={x + 90} y={18} size={10} weight="bold" fill={color}>{label}</T>
        {dots.map((d, i) => <circle key={i} cx={d.cx} cy={d.cy} r={10} fill={color} opacity={0.5} stroke={color} strokeWidth={1} />)}
        {sub.split('\n').map((line, i) => <T key={i} x={x + 90} y={188 + i * 14} size={9} fill="#9ca3af">{line}</T>)}
      </g>
    ))}
  </svg>
);

const ElectromagneticSpectrum = () => (
  <svg viewBox="0 0 620 200" width="100%" style={{ maxHeight: 200 }}>
    {[
      { x: 10,  w: 80,  label: 'Radio',      sub: 'Longest λ\nLowest f', color: '#7c3aed' },
      { x: 95,  w: 75,  label: 'Microwave',  sub: 'Cooking\nSatellite',  color: '#2563eb' },
      { x: 175, w: 75,  label: 'Infrared',   sub: 'Heat\nRemote ctrl',   color: '#059669' },
      { x: 255, w: 90,  label: 'Visible',    sub: 'Eyes can\ndetect this', color: '#d97706' },
      { x: 350, w: 70,  label: 'Ultraviolet', sub: 'Sunburn\nSterilise', color: '#b45309' },
      { x: 425, w: 70,  label: 'X-ray',      sub: 'Medical\nimaging',    color: '#dc2626' },
      { x: 500, w: 110, label: 'Gamma',      sub: 'Shortest λ\nHighest f', color: '#7f1d1d' },
    ].map(({ x, w, label, sub, color }) => (
      <g key={label}>
        <rect x={x} y={60} width={w} height={55} fill={color} opacity={0.35} />
        <T x={x + w / 2} y={82} size={9} weight="bold" fill="#e5e7eb">{label}</T>
        {sub.split('\n').map((line, i) => <T key={i} x={x + w / 2} y={98 + i * 12} size={8} fill="#9ca3af">{line}</T>)}
      </g>
    ))}
    <rect x={10} y={60} width={600} height={55} fill="none" stroke="#4b5563" strokeWidth={1.5} />
    <defs>
      <linearGradient id="visGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"   stopColor="#7c3aed" />
        <stop offset="16%"  stopColor="#2563eb" />
        <stop offset="33%"  stopColor="#059669" />
        <stop offset="50%"  stopColor="#fbbf24" />
        <stop offset="67%"  stopColor="#f97316" />
        <stop offset="83%"  stopColor="#ef4444" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </linearGradient>
    </defs>
    <rect x={255} y={62} width={88} height={51} fill="url(#visGrad)" opacity={0.7} />
    <T x={10}  y={46} size={9} fill="#9ca3af" anchor="start">Longer wavelength (λ) — Lower frequency (f) — Lower energy</T>
    <T x={610} y={46} size={9} fill="#9ca3af" anchor="end">Shorter λ — Higher f — Higher energy</T>
    <T x={310} y={155} size={9} fill="#6b7280">Electromagnetic Spectrum</T>
  </svg>
);

// ── Diagram registry ──────────────────────────────────────────────────────────

export const DIAGRAM_MAP: Record<string, { title: string; icon: string; render: () => React.ReactElement }> = {
  // English
  'teel-paragraph':       { title: 'TEEL Paragraph Structure',   icon: '📝', render: () => <TeelParagraph /> },
  'essay-structure':      { title: '5-Paragraph Essay Structure', icon: '📄', render: () => <EssayStructure /> },
  'story-arc':            { title: "Freytag's Story Arc",         icon: '📖', render: () => <StoryArc /> },
  'persuasive-structure': { title: 'Persuasive Writing Structure', icon: '🗣️', render: () => <PersuasiveStructure /> },
  'argument-map':         { title: 'Argument Map',                icon: '🗺️', render: () => <ArgumentMap /> },
  // Science
  'animal-cell':          { title: 'Animal Cell',                 icon: '🔬', render: () => <AnimalCell /> },
  'plant-cell':           { title: 'Plant Cell',                  icon: '🌿', render: () => <PlantCell /> },
  'water-cycle':          { title: 'The Water Cycle',             icon: '💧', render: () => <WaterCycle /> },
  'food-chain':           { title: 'Food Chain',                  icon: '🌱', render: () => <FoodChain /> },
  'atom-bohr':            { title: 'Bohr Model Atom',             icon: '⚛️', render: () => <AtomBohr /> },
  'circuit-series':       { title: 'Series Circuit',              icon: '⚡', render: () => <CircuitSeries /> },
  'circuit-parallel':     { title: 'Parallel Circuit',            icon: '⚡', render: () => <CircuitParallel /> },
  'wave-diagram':         { title: 'Wave Diagram',                icon: '〰️', render: () => <WaveDiagram /> },
  'particle-states':      { title: 'States of Matter — Particle Model', icon: '🧪', render: () => <ParticleStates /> },
  'electromagnetic-spectrum': { title: 'Electromagnetic Spectrum', icon: '🌈', render: () => <ElectromagneticSpectrum /> },
};

// ── Widget component ──────────────────────────────────────────────────────────

export default function DiagramWidget({ id }: { id: string }) {
  const diagram = DIAGRAM_MAP[id.toLowerCase().trim()];
  if (!diagram) {
    return (
      <div className="my-3 px-4 py-3 rounded-xl border border-gray-700 text-xs text-gray-500">
        Diagram not found: <code>{id}</code>
      </div>
    );
  }
  return (
    <div className="my-3 rounded-xl overflow-hidden border border-gray-700 shadow-sm">
      <div className="px-4 py-2 bg-gray-800/80 border-b border-gray-700 flex items-center gap-2">
        <span className="text-sm">{diagram.icon}</span>
        <span className="text-xs font-medium text-gray-300">{diagram.title}</span>
      </div>
      <div className="bg-gray-900/60 p-3">
        {diagram.render()}
      </div>
    </div>
  );
}
