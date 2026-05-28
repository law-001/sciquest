import { useEffect, useRef, useState } from 'react';
import { useViewportBp } from '../useViewportBp';

const MONO    = '"Courier New", Courier, monospace';
const VB_W    = 500;
const VB_H    = 220;
const MIN_PTS = 10;   // minimum points for a valid drawing
const CLOSE_D = 32;   // max distance (SVG units) between first and last point to close

// Chromosome cluster data
const CLUSTERS = [
  { cx: 120, cy: 110, label: 'LEFT' },
  { cx: 380, cy: 110, label: 'RIGHT' },
];

// 3 relative chromosome positions per cluster
const CHR_OFFSETS = [
  { dx: -18, dy: -17 },
  { dx:  16, dy: -17 },
  { dx:  -2, dy:  18 },
];

// SVG X shape made from two rounded rectangles
function ChromXSVG({ x, y, color, size = 15 }) {
  const h = size;
  const w = size * 0.38;
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={w / 2}
        fill={color} transform={`rotate(45,${x},${y})`} />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={w / 2}
        fill={color} transform={`rotate(-45,${x},${y})`} />
    </g>
  );
}

// Ray-cast point-in-polygon
function pointInPoly(px, py, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i].x, yi = pts[i].y;
    const xj = pts[j].x, yj = pts[j].y;
    if (((yi > py) !== (yj > py)) &&
        (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

function svgPt(e, svgEl) {
  const r = svgEl.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * (VB_W / r.width),
    y: (e.clientY - r.top)  * (VB_H / r.height),
  };
}

function ptsStr(pts) {
  return pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}

export default function NuclearEnvelope({ onComplete, onStarsUpdate }) {
  const bp = useViewportBp();
  const isXS = bp === 'xs';
  const isSM = bp === 'sm';
  const maxW = isXS ? 320 : isSM ? 400 : 500;

  const [drawings,      setDrawings]      = useState([null, null]);
  const [currentDraw,   setCurrentDraw]   = useState(0);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [hint,          setHint]          = useState('');
  const [done,          setDone]          = useState(false);

  const svgRef         = useRef(null);
  const drawingsRef    = useRef([null, null]);
  const currentDrawRef = useRef(0);
  const currentPtsRef  = useRef([]);
  const isDrawingRef   = useRef(false);
  const doneRef        = useRef(false);
  const mountedRef     = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  function handlePointerDown(e) {
    if (doneRef.current || currentDrawRef.current >= 2) return;
    if (isDrawingRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = svgPt(e, svgRef.current);
    isDrawingRef.current = true;
    currentPtsRef.current = [pt];
    setCurrentPoints([pt]);
    setHint('');
  }

  function handlePointerMove(e) {
    if (!isDrawingRef.current) return;
    const pt = svgPt(e, svgRef.current);
    currentPtsRef.current = [...currentPtsRef.current, pt];
    setCurrentPoints(currentPtsRef.current.slice());
  }

  function handlePointerUp() {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    const pts = currentPtsRef.current;
    currentPtsRef.current = [];
    setCurrentPoints([]);

    if (pts.length < MIN_PTS) {
      setHint('Draw a larger shape!');
      return;
    }

    const first = pts[0];
    const last  = pts[pts.length - 1];
    const isClosed = Math.hypot(last.x - first.x, last.y - first.y) <= CLOSE_D;
    if (!isClosed) {
      setHint('Not closed — end where you started!');
      return;
    }

    const ci = currentDrawRef.current;
    const { cx, cy } = CLUSTERS[ci];
    if (!pointInPoly(cx, cy, pts)) {
      setHint(`Surround the ${CLUSTERS[ci].label} cluster!`);
      return;
    }

    // Valid drawing
    const next = [...drawingsRef.current];
    next[ci] = pts;
    drawingsRef.current = next;
    setDrawings(next.slice());
    setHint('');

    const doneCount = next.filter(Boolean).length;
    onStarsUpdate?.(doneCount >= 2 ? 3 : 2);

    if (doneCount >= 2) {
      doneRef.current = true;
      setDone(true);
      setTimeout(() => { if (mountedRef.current) onComplete({ stars: 3 }); }, 350);
    } else {
      currentDrawRef.current = ci + 1;
      setCurrentDraw(ci + 1);
    }
  }

  function submitNow() {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    const n = drawingsRef.current.filter(Boolean).length;
    onComplete({ stars: n >= 2 ? 3 : n >= 1 ? 2 : 1 });
  }

  const drawnCount = drawings.filter(Boolean).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: MONO }}>
      <style>{`
        @keyframes cdd-hint-pulse {
          0%, 100% { stroke-opacity: 0.12; }
          50%       { stroke-opacity: 0.28; }
        }
      `}</style>

      {/* Status line */}
      <div style={{
        minHeight: 16, fontSize: 11, textAlign: 'center', letterSpacing: '0.07em',
        color: hint ? '#FF8080' : done ? '#3EDD88' : 'rgba(255,255,255,0.38)',
        textShadow: done ? '0 0 10px #3EDD88' : 'none',
        transition: 'color 0.3s',
      }}>
        {done ? 'BOTH NUCLEI ENCLOSED'
          : hint || (currentDraw === 0
            ? 'DRAW A CLOSED SHAPE AROUND THE LEFT CLUSTER'
            : 'NOW SURROUND THE RIGHT CLUSTER')}
      </div>

      {/* SVG drawing field. maxWidth caps how wide it stretches on mobile
          landscape so the full drawing area stays inside the modal. Using
          aspect-ratio (vs padding-bottom %) so the height collapses with
          maxWidth instead of with the parent's width. */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: maxW,
        margin: '0 auto',
        aspectRatio: `${VB_W} / ${VB_H}`,
      }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            cursor: done || currentDraw >= 2 ? 'default' : 'crosshair',
            touchAction: 'none',
            userSelect: 'none',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Background */}
          <rect x={0} y={0} width={VB_W} height={VB_H}
            fill="rgba(10,22,36,0.5)" rx={8} />

          {/* Hint ovals — active one is slightly brighter */}
          {CLUSTERS.map((cl, i) => (
            <ellipse
              key={i}
              cx={cl.cx} cy={cl.cy} rx={72} ry={54}
              fill="none"
              stroke="white"
              strokeWidth={1.5}
              strokeDasharray="7 5"
              style={{
                animation: i === currentDraw && !done
                  ? 'cdd-hint-pulse 2s ease-in-out infinite'
                  : 'none',
                strokeOpacity: i === currentDraw && !done ? 0.2 : 0.08,
              }}
              pointerEvents="none"
            />
          ))}

          {/* Completed drawings (filled polygon + stroke) */}
          {drawings.map((pts, i) => pts && (
            <polygon key={i}
              points={ptsStr(pts)}
              fill="rgba(168,200,240,0.13)"
              stroke="#3BAFA9"
              strokeWidth={2}
              strokeLinejoin="round"
              pointerEvents="none"
            />
          ))}

          {/* Active drawing in progress */}
          {currentPoints.length > 1 && (
            <polyline
              points={ptsStr(currentPoints)}
              fill="none"
              stroke="#3BAFA9"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              pointerEvents="none"
            />
          )}

          {/* Chromosome clusters */}
          {CLUSTERS.map((cl, ci) =>
            CHR_OFFSETS.map((off, xi) => (
              <ChromXSVG
                key={`${ci}-${xi}`}
                x={cl.cx + off.dx}
                y={cl.cy + off.dy}
                size={15}
                color={drawings[ci] ? '#3EDD88' : '#9B59B6'}
              />
            ))
          )}

          {/* Cluster labels */}
          {CLUSTERS.map((cl, i) => (
            <text key={i}
              x={cl.cx} y={cl.cy + 46}
              textAnchor="middle"
              fill={drawings[i] ? '#3EDD88' : 'rgba(255,255,255,0.3)'}
              fontSize={10}
              fontFamily={MONO}
              pointerEvents="none"
            >
              {drawings[i] ? '✓ ' : (currentDraw === i ? '◎ ' : '○ ')}
              NUCLEUS {i + 1}
            </text>
          ))}
        </svg>
      </div>

      {/* Submit */}
      {!done && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={submitNow}
            style={{
              padding: '7px 22px', borderRadius: 8, minHeight: 36,
              border: '1.5px solid #A8C8F0', background: 'rgba(168,200,240,0.08)',
              color: '#A8C8F0', fontSize: 11, fontWeight: 700,
              cursor: 'pointer', fontFamily: MONO, letterSpacing: '0.1em',
            }}
          >
            SUBMIT {drawnCount}/2 — {drawnCount >= 2 ? 3 : drawnCount >= 1 ? 2 : 1} ★
          </button>
        </div>
      )}
    </div>
  );
}
