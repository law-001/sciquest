// The one animal cell Levels 1 and 3 draw, in the same 320 x 220 viewBox as
// plant-cell's views so it slots into the shared stage. Plain shapes for now;
// docs/asset-prompts/animal-cell.md lists the art that replaces each one.

const CX = 160;
const CY = 112;

const MEMBRANE = 'M 160 22 C 232 18 296 52 294 110 C 292 170 236 204 164 202 C 92 202 28 176 26 112 C 24 52 92 26 160 22 Z';

const MITOCHONDRIA = [
  { x: 238, y: 76, tilt: 22 },
  { x: 98, y: 162, tilt: -14 },
  { x: 230, y: 160, tilt: 8 },
];
const LYSOSOMES = [{ x: 58, y: 114 }, { x: 178, y: 182 }, { x: 270, y: 118 }];
const RIBOSOMES = [[204, 88], [210, 100], [204, 112], [210, 124], [204, 136], [128, 58], [64, 84], [262, 96], [150, 176]];

// Where the dashed ring goes when Level 3 highlights an organelle: [x, y, rx, ry].
const HALOS = {
  nucleus: [[150, 108, 34, 34]],
  mitochondrion: MITOCHONDRIA.map(({ x, y }) => [x, y, 22, 14]),
  ribosome: [[207, 112, 12, 32]],
  golgi: [[92, 72, 30, 18]],
  lysosome: LYSOSOMES.map(({ x, y }) => [x, y, 11, 11]),
};

// Particle routes for Level 1: food and oxygen in to the mitochondria, energy
// out into the cell, carbon dioxide out of it.
const LANES = {
  glucose: ['M -14 172 L 84 164', 'M 150 -14 L 228 70'],
  oxygen: ['M 334 40 L 252 72', 'M 334 196 L 244 164'],
  energy: ['M 232 70 L 176 56', 'M 104 156 L 132 128', 'M 222 154 L 186 136'],
  co2: ['M 248 84 L 334 116', 'M 90 168 L -14 204'],
};
const STREAM_COLOR = { glucose: '#f08a4b', oxygen: '#2bafa9', energy: '#d9a824', co2: '#8a8f94' };

function Stream({ kind, perLane, duration, animate }) {
  if (perLane <= 0) return null;
  return (
    <g aria-hidden="true">
      {LANES[kind].map((d) => (
        <g key={d}>
          <path d={d} fill="none" stroke={STREAM_COLOR[kind]} strokeWidth="1.2" strokeDasharray="3 5" opacity="0.4" />
          {animate && Array.from({ length: perLane }, (_, i) => (
            <circle key={i} r={kind === 'energy' ? 4.5 : 6} fill={STREAM_COLOR[kind]} opacity="0.9">
              <animateMotion path={d} dur={`${duration}s`} begin={`${-(i * duration) / perLane}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      ))}
    </g>
  );
}

function Label({ x, y, children, anchor = 'middle' }) {
  return <text x={x} y={y} textAnchor={anchor} fontSize="9" fontWeight="800" fill="#4a4231">{children}</text>;
}

export function AnimalCellView({
  // { glucose, oxygen, rate } — glucose/oxygen in %, rate 0–1. Level 1 only.
  respiration = null,
  health = 100,
  // Organelle ids to ring in red (Level 3's current picks).
  highlighted = [],
  reducedMotion = false,
  particleBudget = 2,
  title = 'Animal cell',
}) {
  const animate = !reducedMotion;
  const perLane = (amount) => Math.min(particleBudget, Math.round(amount * particleBudget));

  return (
    <svg className="pc-cell" viewBox="0 0 320 220" role="img" aria-label={title} preserveAspectRatio="xMidYMid meet">
      <title>{title}</title>
      <rect x="4" y="4" width="312" height="212" rx="14" fill="#fffaf0" stroke="rgba(43,36,23,0.12)" strokeWidth="1.5" />

      {/* A weak cell's cytoplasm fades, so health shows in the picture too. */}
      <path d={MEMBRANE} fill="#fde3cc" fillOpacity={0.4 + 0.6 * (health / 100)} stroke="#d76d2e" strokeWidth="3" />
      <Label x={CX} y={16}>cell membrane — no cell wall</Label>
      <Label x={60} y={190}>cytoplasm</Label>

      <g aria-hidden="true">
        {/* Golgi apparatus: a stack of curved sacs. */}
        {[0, 7, 14].map((dy) => (
          <path key={dy} d={`M 70 ${62 + dy} q 22 -12 44 0`} fill="none" stroke="#1d8580" strokeWidth="4" strokeLinecap="round" />
        ))}
        <Label x={92} y={98}>Golgi</Label>

        {/* Endoplasmic reticulum folds beside the nucleus, studded with ribosomes. */}
        {[188, 196].map((x) => (
          <path key={x} d={`M ${x} 84 q 10 10 0 20 q -10 10 0 20 q 10 10 0 20`} fill="none" stroke="#2bafa9" strokeWidth="2.5" strokeLinecap="round" />
        ))}
        {RIBOSOMES.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" fill="#6f6553" />)}
        <Label x={222} y={146} anchor="start">ribosomes</Label>

        <circle cx="150" cy="108" r="26" fill="#f5d48a" stroke="#b8860b" strokeWidth="2.5" />
        <circle cx="157" cy="103" r="8" fill="#d9a824" />
        <Label x={150} y={146}>nucleus</Label>

        {MITOCHONDRIA.map(({ x, y, tilt }) => (
          <g key={`${x}-${y}`} transform={`rotate(${tilt} ${x} ${y})`}>
            <ellipse cx={x} cy={y} rx="17" ry="9" fill="#f08a4b" stroke="#b4531f" strokeWidth="2" />
            <path d={`M ${x - 11} ${y} l 4 -5 l 4 10 l 4 -10 l 4 10 l 4 -10 l 2 5`} fill="none" stroke="#fde3cc" strokeWidth="1.5" />
          </g>
        ))}
        <Label x={238} y={58}>mitochondria</Label>

        {LYSOSOMES.map(({ x, y }) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill="#e9837f" stroke="#a83a36" strokeWidth="1.5" />
        ))}
        <Label x={58} y={134}>lysosome</Label>
      </g>

      {respiration && (
        <g>
          <Stream kind="glucose" perLane={perLane(respiration.glucose / 100)} duration={2.4} animate={animate} />
          <Stream kind="oxygen" perLane={perLane(respiration.oxygen / 100)} duration={2.2} animate={animate} />
          <Stream kind="energy" perLane={perLane(respiration.rate)} duration={1.4} animate={animate} />
          <Stream kind="co2" perLane={perLane(respiration.rate)} duration={2.4} animate={animate} />
        </g>
      )}

      <g aria-hidden="true" fill="none" stroke="#d1544f" strokeWidth="2.5" strokeDasharray="5 4">
        {highlighted.includes('membrane') && <path d={MEMBRANE} strokeWidth="5" />}
        {highlighted.flatMap((id) => (HALOS[id] ?? []).map(([x, y, rx, ry]) => (
          <ellipse key={`${id}-${x}-${y}`} cx={x} cy={y} rx={rx} ry={ry} />
        )))}
      </g>
    </svg>
  );
}
