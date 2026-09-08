import {
  CHLOROPLAST_SPOTS,
  MITOCHONDRIA_SPOTS,
  NUCLEUS,
  ORGANELLES,
  RIBOSOME_SPOTS,
  VACUOLE,
} from '../data/organelles';

// The one plant cell every level draws. It takes plain numbers and renders the
// cell in that state — it holds no simulation of its own.
//
// Coordinates all live in the 320 x 220 viewBox; the shapes are deliberately
// simple so they can be swapped for artwork later without touching the layout.

const VIEW_W = 320;
const VIEW_H = 220;

// Routes the moving particles follow. Each lane starts outside the cell and
// ends at an organelle (or the other way around, for what the cell releases).
const LANES = {
  light: ['M 160 -14 L 132 26', 'M 250 -14 L 214 26', 'M 74 -12 L 62 40'],
  water: ['M -14 200 L 60 190 L 146 188', 'M -14 150 L 40 168 L 60 178'],
  co2: ['M 334 60 L 292 66 L 278 68', 'M 334 176 L 292 170 L 274 168'],
  glucose: ['M 132 40 L 150 78 L 160 104', 'M 268 158 L 214 132 L 178 116'],
  oxygen: ['M 214 26 L 236 -6', 'M 62 44 L 26 -8'],
  waterIn: ['M -14 44 L 44 62', 'M 334 116 L 268 112', 'M 160 236 L 158 176', 'M -14 168 L 40 156'],
  waterOut: ['M 44 62 L -14 44', 'M 268 112 L 334 116', 'M 158 176 L 160 236', 'M 40 156 L -14 168'],
};

const STREAM_COLOR = {
  light: '#f5c84a',
  water: '#5aa9e6',
  co2: '#9aa0a6',
  glucose: '#f08a4b',
  oxygen: '#3bafa9',
  waterIn: '#5aa9e6',
  waterOut: '#5aa9e6',
};

function Stream({ kind, lanes, perLane, duration, animate }) {
  if (perLane <= 0) return null;
  const color = STREAM_COLOR[kind];
  return (
    <g aria-hidden="true">
      {lanes.map((d, laneIndex) => (
        <g key={`${kind}-${laneIndex}`}>
          <path d={d} fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="3 5" opacity="0.35" />
          {animate
            && Array.from({ length: perLane }, (_, i) => (
              <circle key={i} r={kind === 'light' ? 3.4 : 2.8} fill={color} opacity="0.9">
                <animateMotion
                  path={d}
                  dur={`${duration}s`}
                  begin={`${-(i * duration) / perLane}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
        </g>
      ))}
    </g>
  );
}

function Chloroplast({ spot, glow, damaged }) {
  const fill = damaged ? '#b7b1a2' : '#3f9b56';
  return (
    <g transform={`translate(${spot.x} ${spot.y}) rotate(${spot.tilt})`}>
      {glow > 0.05 && !damaged && (
        <ellipse rx="21" ry="14" fill="#f5c84a" opacity={0.1 + glow * 0.35} />
      )}
      <ellipse rx="15" ry="9.5" fill={fill} stroke="#2b6c3c" strokeWidth="1.4" />
      <g fill="#2b6c3c" opacity={damaged ? 0.35 : 0.75}>
        <rect x="-8" y="-3.5" width="5" height="7" rx="1.6" />
        <rect x="-1" y="-4.5" width="5" height="9" rx="1.6" />
        <rect x="6" y="-3" width="4" height="6" rx="1.6" />
      </g>
      {damaged && (
        <path d="M -9 -6 L 9 6 M 9 -6 L -9 6" stroke="#d1544f" strokeWidth="2" strokeLinecap="round" />
      )}
    </g>
  );
}

function Mitochondrion({ spot, activity, damaged }) {
  const fill = damaged ? '#c9bfae' : '#e08a5f';
  return (
    <g transform={`translate(${spot.x} ${spot.y}) rotate(${spot.tilt})`}>
      {activity > 0.05 && !damaged && (
        <ellipse rx="22" ry="13" fill="#f08a4b" opacity={0.08 + activity * 0.25} />
      )}
      <ellipse rx="16" ry="8.5" fill={fill} stroke="#a9532c" strokeWidth="1.4" />
      <path
        d="M -11 0 q 3.5 -5 7 0 q 3.5 5 7 0 q 3.5 -5 6 0"
        fill="none"
        stroke="#a9532c"
        strokeWidth="1.4"
        opacity={damaged ? 0.3 : 0.85}
      />
      {damaged && (
        <path d="M -10 -6 L 10 6 M 10 -6 L -10 6" stroke="#d1544f" strokeWidth="2" strokeLinecap="round" />
      )}
    </g>
  );
}

function Hotspot({ id, x, y, w, h, rx, label, selected, onSelect }) {
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={rx}
        fill="transparent"
        stroke={selected ? '#d1544f' : 'transparent'}
        strokeWidth="2.5"
        strokeDasharray="5 4"
        className="pc-hotspot"
        role="button"
        tabIndex={0}
        aria-label={label}
        aria-pressed={selected}
        onClick={() => onSelect(id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(id);
          }
        }}
      />
    </g>
  );
}

export function CellView({
  // 0–1, how hard photosynthesis is running.
  activity = 0,
  // 0–1, how hard respiration is running.
  respiration = 0,
  vacuoleFill = 40,
  turgor = 60,
  health = 100,
  photosynthesis = null,
  waterFlow = null,
  damagedId = null,
  selectedId = null,
  onSelectOrganelle = null,
  reducedMotion = false,
  particleBudget = 2,
  title = 'Plant cell',
}) {
  // A cell short of water pulls its membrane away from the wall — the gap is
  // exactly what plasmolysis looks like down a microscope.
  const slack = Math.max(0, (70 - Math.min(turgor, 70)) / 70) * 7;
  const wilt = Math.max(0, (60 - Math.min(health, 60)) / 60);

  const vacRx = VACUOLE.minRx + (VACUOLE.maxRx - VACUOLE.minRx) * (vacuoleFill / 100);
  const vacRy = VACUOLE.minRy + (VACUOLE.maxRy - VACUOLE.minRy) * (vacuoleFill / 100);

  const animate = !reducedMotion;
  const selectable = typeof onSelectOrganelle === 'function';
  const perLane = (amount) => Math.min(particleBudget, Math.round(amount * particleBudget));

  return (
    <svg
      className="pc-cell"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{title}</title>

      {/* Cell wall — the outermost layer, thick and rigid. */}
      <rect
        x="5" y="5" width={VIEW_W - 10} height={VIEW_H - 10} rx="34"
        fill="none" stroke="#7d9b4e" strokeWidth="9"
        opacity={damagedId === 'cellWall' ? 0.45 : 1}
      />
      <rect
        x="5" y="5" width={VIEW_W - 10} height={VIEW_H - 10} rx="34"
        fill="none" stroke="#5d7a34" strokeWidth="1.5" opacity="0.5"
      />

      {/* Cytoplasm, held inside the cell membrane. */}
      <rect
        x={11 + slack} y={11 + slack}
        width={VIEW_W - 22 - slack * 2} height={VIEW_H - 22 - slack * 2}
        rx={28}
        fill={wilt > 0.35 ? '#e8e3cf' : '#dff0e2'}
        stroke={damagedId === 'membrane' ? '#d1544f' : '#2f7d5c'}
        strokeWidth="2.4"
        strokeDasharray={damagedId === 'membrane' ? '6 5' : undefined}
        className="pc-cell__membrane"
      />

      {/* Vacuole — the store. Grows and shrinks with what is in it. */}
      <g className="pc-cell__vacuole">
        <ellipse
          cx={VACUOLE.x} cy={VACUOLE.y} rx={vacRx} ry={vacRy}
          fill="#bfe3f2"
          stroke={damagedId === 'vacuole' ? '#d1544f' : '#4f9ec4'}
          strokeWidth="2"
          strokeDasharray={damagedId === 'vacuole' ? '6 5' : undefined}
          opacity="0.85"
        />
        <ellipse
          cx={VACUOLE.x - vacRx * 0.3} cy={VACUOLE.y - vacRy * 0.35}
          rx={vacRx * 0.32} ry={vacRy * 0.24}
          fill="#ffffff" opacity="0.35"
        />
      </g>

      {/* Nucleus, pushed to the side by the vacuole. */}
      <g opacity={damagedId === 'nucleus' ? 0.5 : 1}>
        <circle cx={NUCLEUS.x} cy={NUCLEUS.y} r={NUCLEUS.r} fill="#c8b6e2" stroke="#7b5ea7" strokeWidth="2" />
        <circle cx={NUCLEUS.x + 4} cy={NUCLEUS.y - 3} r="8" fill="#7b5ea7" opacity="0.55" />
      </g>

      {RIBOSOME_SPOTS.map((spot) => (
        <circle key={`r-${spot.x}-${spot.y}`} cx={spot.x} cy={spot.y} r="2.6" fill="#6f6553" opacity="0.55" />
      ))}

      {MITOCHONDRIA_SPOTS.map((spot) => (
        <Mitochondrion
          key={`m-${spot.x}`}
          spot={spot}
          activity={respiration}
          damaged={damagedId === 'mitochondrion'}
        />
      ))}

      {CHLOROPLAST_SPOTS.map((spot) => (
        <Chloroplast
          key={`c-${spot.x}-${spot.y}`}
          spot={spot}
          glow={activity}
          damaged={damagedId === 'chloroplast'}
        />
      ))}

      {photosynthesis && (
        <g>
          <Stream kind="light" lanes={LANES.light} perLane={perLane(photosynthesis.light / 100)} duration={1.6} animate={animate} />
          <Stream kind="water" lanes={LANES.water} perLane={perLane(photosynthesis.water / 100)} duration={2.6} animate={animate} />
          <Stream kind="co2" lanes={LANES.co2} perLane={perLane(photosynthesis.co2 / 100)} duration={2.4} animate={animate} />
          <Stream kind="glucose" lanes={LANES.glucose} perLane={perLane(photosynthesis.rate)} duration={2.2} animate={animate} />
          <Stream kind="oxygen" lanes={LANES.oxygen} perLane={perLane(photosynthesis.rate)} duration={2} animate={animate} />
        </g>
      )}

      {waterFlow && waterFlow.direction !== 'still' && (
        <Stream
          kind={waterFlow.direction === 'in' ? 'waterIn' : 'waterOut'}
          lanes={waterFlow.direction === 'in' ? LANES.waterIn : LANES.waterOut}
          perLane={perLane(waterFlow.strength)}
          duration={Math.max(1.1, 3.4 - waterFlow.strength * 2)}
          animate={animate}
        />
      )}

      {selectable && (
        <g>
          <Hotspot id="cellWall" x={160} y={9} w={300} h={16} rx={8} label={ORGANELLES.cellWall.name} selected={selectedId === 'cellWall'} onSelect={onSelectOrganelle} />
          <Hotspot id="membrane" x={160} y={24} w={286} h={16} rx={8} label={ORGANELLES.membrane.name} selected={selectedId === 'membrane'} onSelect={onSelectOrganelle} />
          <Hotspot id="vacuole" x={VACUOLE.x} y={VACUOLE.y} w={vacRx * 2} h={vacRy * 2} rx={vacRy} label={ORGANELLES.vacuole.name} selected={selectedId === 'vacuole'} onSelect={onSelectOrganelle} />
          <Hotspot id="nucleus" x={NUCLEUS.x} y={NUCLEUS.y} w={54} h={54} rx={27} label={ORGANELLES.nucleus.name} selected={selectedId === 'nucleus'} onSelect={onSelectOrganelle} />
          <Hotspot id="chloroplast" x={CHLOROPLAST_SPOTS[2].x} y={CHLOROPLAST_SPOTS[2].y} w={40} h={26} rx={13} label={ORGANELLES.chloroplast.name} selected={selectedId === 'chloroplast'} onSelect={onSelectOrganelle} />
          <Hotspot id="chloroplast" x={CHLOROPLAST_SPOTS[5].x} y={CHLOROPLAST_SPOTS[5].y} w={40} h={26} rx={13} label={ORGANELLES.chloroplast.name} selected={selectedId === 'chloroplast'} onSelect={onSelectOrganelle} />
          <Hotspot id="mitochondrion" x={MITOCHONDRIA_SPOTS[0].x} y={MITOCHONDRIA_SPOTS[0].y} w={42} h={24} rx={12} label={ORGANELLES.mitochondrion.name} selected={selectedId === 'mitochondrion'} onSelect={onSelectOrganelle} />
        </g>
      )}
    </svg>
  );
}
