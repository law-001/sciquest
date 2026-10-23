// Level 2's close-up cell, drawn like the lesson's "One Cell, Both Kinds"
// widget so students recognise it: a plant cell whose central vacuole fills
// and empties inside a rigid wall, or an animal cell with only a membrane.
// Same 320 x 220 viewBox as the other views so it slots into the stage.

const CX = 160;
const CY = 112;

const CHLOROPLAST_SPOTS = [[0.5, 0.1], [0.9, 0.35], [0.82, 0.88], [0.28, 0.9]];

export function WaterCell({ kind, water, burst = false }) {
  const fill = Math.min(1, Math.max(0, water / 100));
  const isPlant = kind === 'plant';
  const label = isPlant
    ? `Plant cell. The central vacuole is ${Math.round(water)} percent full${fill >= 1 ? ' and pressing on the cell wall' : ''}.`
    : burst ? 'Animal cell. It has burst.' : `Animal cell, ${Math.round(water)} percent full of water.`;

  return (
    <svg className="pc-cell" viewBox="0 0 320 220" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      <title>{label}</title>
      <rect x="4" y="4" width="312" height="212" rx="14" fill="#fffaf0" stroke="rgba(43,36,23,0.12)" strokeWidth="1.5" />
      {isPlant ? <PlantCell fill={fill} /> : <AnimalCell fill={fill} burst={burst} />}
      <text x={CX} y="210" textAnchor="middle" fontSize="11" fontWeight="800" fill="#4a4231">
        {isPlant ? 'PLANT CELL' : 'ANIMAL CELL'}
      </text>
    </svg>
  );
}

function PlantCell({ fill }) {
  // With less water the membrane pulls in from the wall; full, it presses on it.
  const gap = 6 + (1 - fill) * 30;
  const mx = 45 + gap;
  const my = 31 + gap;
  const mw = 230 - gap * 2;
  const mh = 160 - gap * 2;
  const vw = (mw - 70) * (0.2 + 0.8 * fill);
  const vh = (mh - 46) * (0.3 + 0.7 * fill);
  const membranePlasmolysed = Math.min(1, Math.max(0, (0.4 - fill) / 0.3));
  const vacuole = {
    shrivelled: 1 - Math.min(1, fill * 2),
    half: fill < 0.5 ? fill * 2 : (1 - fill) * 2,
    full: Math.max(0, fill * 2 - 1),
  };
  const vx = CX + 18 - vw / 2;
  const vy = CY - vh / 2;

  return (
    <g>
      <image href="/games/plant-cell/art/cell-wall.png" x="40" y="26" width="240" height="170" preserveAspectRatio="none" />
      <text x={CX} y="19" textAnchor="middle" fontSize="11" fontWeight="900" fill="#15803D">cell wall</text>

      <image href="/games/plant-cell/art/water-membrane-turgid.png" x={mx} y={my} width={mw} height={mh} preserveAspectRatio="none" opacity={1 - membranePlasmolysed} />
      <image href="/games/plant-cell/art/water-membrane-plasmolysed.png" x={mx} y={my} width={mw} height={mh} preserveAspectRatio="none" opacity={membranePlasmolysed} />
      <image href="/games/plant-cell/art/water-vacuole-shrivelled.png" x={vx} y={vy} width={vw} height={vh} preserveAspectRatio="none" opacity={vacuole.shrivelled} />
      <image href="/games/plant-cell/art/water-vacuole-half.png" x={vx} y={vy} width={vw} height={vh} preserveAspectRatio="none" opacity={vacuole.half} />
      <image href="/games/plant-cell/art/water-vacuole-full.png" x={vx} y={vy} width={vw} height={vh} preserveAspectRatio="none" opacity={vacuole.full} />
      <text x={CX + 18} y={CY + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#0f766e">central vacuole</text>

      <image href="/games/plant-cell/art/nucleus.png" x={mx + 14} y={my + 16} width="28" height="28" preserveAspectRatio="xMidYMid meet" />
      {CHLOROPLAST_SPOTS.map(([fx, fy]) => (
        <image key={`${fx}-${fy}`} href="/games/plant-cell/art/chloroplast-idle.png" x={mx + mw * fx - 11} y={my + mh * fy - 6} width="22" height="12" preserveAspectRatio="none" />
      ))}

      {fill >= 0.95 && (
        <g className="pc-turgor-arrows">
          {[[vx + vw - 4, CY - 8, 0], [CX + 10, vy - 12, -90], [vx - 28, CY + 8, 180], [CX + 26, vy + vh + 12, 90]].map(([x, y, rotation]) => (
            <image key={rotation} href="/games/plant-cell/art/turgor-arrow.png" x={x} y={y} width="24" height="16" preserveAspectRatio="none" transform={`rotate(${rotation} ${x + 12} ${y + 8})`} />
          ))}
          <text x={CX + 18} y={CY + 20} textAnchor="middle" fontSize="10" fontWeight="800" fill="#B45309">turgor pressure pushes out</text>
        </g>
      )}
    </g>
  );
}

function AnimalCell({ fill, burst }) {
  const rx = (120 + fill * 110) / 2;
  const ry = (84 + fill * 84) / 2;

  return (
    <g>
      <text x={CX} y="19" textAnchor="middle" fontSize="11" fontWeight="900" fill="#B45309">cell membrane — no cell wall</text>
      {burst ? <image href="/games/plant-cell/art/animal-cell-burst.png" x={CX - rx - 28} y={CY - ry - 28} width={rx * 2 + 56} height={ry * 2 + 56} preserveAspectRatio="none" /> : <>
        <image href="/games/plant-cell/art/animal-cell-normal.png" x={CX - rx} y={CY - ry} width={rx * 2} height={ry * 2} preserveAspectRatio="none" opacity={1 - Math.max(0, (fill - 0.6) / 0.4)} />
        <image href="/games/plant-cell/art/animal-cell-swollen.png" x={CX - rx} y={CY - ry} width={rx * 2} height={ry * 2} preserveAspectRatio="none" opacity={Math.max(0, (fill - 0.6) / 0.4)} />
      </>}
      <image href="/games/plant-cell/art/nucleus.png" x={CX - rx * 0.35 - 14} y={CY - ry * 0.25 - 14} width="28" height="28" preserveAspectRatio="xMidYMid meet" opacity={burst ? 0.4 : 1} />
      {burst && (
        <g>
          {Array.from({ length: 7 }, (_, i) => {
            const angle = (i / 7) * Math.PI * 2;
            return <image key={i} href="/games/plant-cell/art/cell-fragment.png" x={CX + Math.cos(angle) * (rx + 18) - 5} y={CY + Math.sin(angle) * (ry + 12) - 5} width="10" height="10" preserveAspectRatio="xMidYMid meet" transform={`rotate(${i * 51} ${CX + Math.cos(angle) * (rx + 18)} ${CY + Math.sin(angle) * (ry + 12)})`} />;
          })}
          <text x={CX} y={CY + 7} textAnchor="middle" fontSize="20" fontWeight="900" fill="#DC2626">BURST</text>
        </g>
      )}
    </g>
  );
}
