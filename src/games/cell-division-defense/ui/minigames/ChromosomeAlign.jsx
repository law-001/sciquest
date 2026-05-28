import { useEffect, useRef, useState } from 'react';

const MONO        = '"Courier New", Courier, monospace';
const CHR_IDS     = ['A', 'B', 'C', 'D'];
const CHR_COLORS  = { A: '#9B59B6', B: '#6C3483', C: '#7D3C98', D: '#5B2C6F' };
const SNAP_PCT    = [12, 37, 62, 87];   // % of container width
const FALLBACK_W  = 450;               // assumed width before any interaction

function pickLayout() {
  const h = typeof window !== 'undefined' ? window.innerHeight : 800;
  const w = typeof window !== 'undefined' ? window.innerWidth  : 1200;
  // Shrink the playfield on small viewports so it fits inside the minigame
  // overlay without the modal needing to scroll on iPhone-class screens.
  if (w < 560 || h < 380) return { containerH: 170, chrSize: 30, snapRadius: 32, topY: 14, botY: 124 };
  if (w < 768 || h < 460) return { containerH: 210, chrSize: 36, snapRadius: 38, topY: 20, botY: 154 };
  return { containerH: 264, chrSize: 42, snapRadius: 44, topY: 26, botY: 196 };
}

function homeXY(id, w, layout) {
  const isTop = id === 'A' || id === 'B';
  const xPct  = (id === 'A' || id === 'C') ? 5 : 62;
  return { x: w * xPct / 100, y: isTop ? layout.topY : layout.botY };
}

function ChromosomeX({ color, size = 42, glow = false }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 44 44" aria-hidden="true"
      style={{ filter: glow ? `drop-shadow(0 0 7px ${color})` : 'none', transition: 'filter 0.2s' }}
    >
      <rect x="9"  y="3"  width="10" height="17" rx="5" fill={color} transform="rotate(-15 14 11)" />
      <rect x="25" y="3"  width="10" height="17" rx="5" fill={color} transform="rotate(15 30 11)" />
      <rect x="9"  y="24" width="10" height="17" rx="5" fill={color} transform="rotate(15 14 33)" />
      <rect x="25" y="24" width="10" height="17" rx="5" fill={color} transform="rotate(-15 30 33)" />
      <circle cx="22" cy="22" r="5" fill={color} />
    </svg>
  );
}

export default function ChromosomeAlign({ onComplete, onStarsUpdate }) {
  const [layout, setLayout] = useState(pickLayout);
  const { containerH: CONTAINER_H, chrSize: CHR_SIZE, snapRadius: SNAP_RADIUS } = layout;
  const PLATE_Y = CONTAINER_H / 2;

  useEffect(() => {
    const sync = () => setLayout(pickLayout());
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  // Lazy init uses fallback width; positions snap to actual container on first event
  const [positions, setPositions] = useState(() =>
    Object.fromEntries(CHR_IDS.map(id => [id, homeXY(id, FALLBACK_W, pickLayout())]))
  );
  const [placed,     setPlaced]     = useState({});   // id → zoneIdx
  const [occupied,   setOccupied]   = useState({});   // zoneIdx → id
  const [draggingId, setDraggingId] = useState(null);
  const [done,       setDone]       = useState(false);

  const containerRef  = useRef(null);
  const draggingRef   = useRef(null);   // { id, offsetX, offsetY }
  const placedRef     = useRef({});
  const occupiedRef   = useRef({});
  const doneRef       = useRef(false);
  const mountedRef    = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  function containerWidth() {
    return containerRef.current?.offsetWidth || FALLBACK_W;
  }

  function onPointerDown(e, id) {
    if (placedRef.current[id] !== undefined || doneRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = containerRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    draggingRef.current = {
      id,
      offsetX: px - positions[id].x,
      offsetY: py - positions[id].y,
    };
    setDraggingId(id);
  }

  function onPointerMove(e, id) {
    if (!draggingRef.current || draggingRef.current.id !== id) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const { offsetX, offsetY } = draggingRef.current;
    setPositions(prev => ({
      ...prev,
      [id]: { x: e.clientX - rect.left - offsetX, y: e.clientY - rect.top - offsetY },
    }));
  }

  function onPointerUp(e, id) {
    if (!draggingRef.current || draggingRef.current.id !== id) return;
    draggingRef.current = null;
    setDraggingId(null);

    const pos = positions[id];
    const cx  = pos.x + CHR_SIZE / 2;
    const cy  = pos.y + CHR_SIZE / 2;
    const w   = containerWidth();

    let snapped = false;
    for (let zi = 0; zi < SNAP_PCT.length; zi++) {
      if (occupiedRef.current[zi] !== undefined) continue;
      const zx   = w * SNAP_PCT[zi] / 100;
      const dist = Math.hypot(cx - zx, cy - PLATE_Y);
      if (dist <= SNAP_RADIUS) {
        const nx = zx - CHR_SIZE / 2;
        const ny = PLATE_Y - CHR_SIZE / 2;
        setPositions(prev => ({ ...prev, [id]: { x: nx, y: ny } }));

        const np = { ...placedRef.current,   [id]: zi  };
        const no = { ...occupiedRef.current, [zi]: id };
        placedRef.current   = np;
        occupiedRef.current = no;
        setPlaced({ ...np });
        setOccupied({ ...no });

        const count = Object.keys(np).length;
        onStarsUpdate?.(count >= 4 ? 3 : count >= 3 ? 2 : 1);
        snapped = true;

        if (count >= 4) {
          doneRef.current = true;
          setDone(true);
          setTimeout(() => {
            if (mountedRef.current) onComplete({ stars: 3 });
          }, 350);
        }
        break;
      }
    }

    if (!snapped) {
      // Return home using actual container width (corrects any fallback-width offset)
      setPositions(prev => ({ ...prev, [id]: homeXY(id, w, layout) }));
    }
  }

  const placedCount = Object.keys(placed).length;

  function submitNow() {
    if (doneRef.current) return;
    doneRef.current = true;
    setDone(true);
    onComplete({ stars: placedCount >= 3 ? 2 : 1 });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: MONO }}>
      <style>{`
        @keyframes cdd-plate-glow {
          0%, 100% { box-shadow: 0 0 6px 1px rgba(255,255,255,0.25); }
          50%       { box-shadow: 0 0 14px 3px rgba(255,255,255,0.55); }
        }
        @keyframes cdd-snap-pop {
          0%   { transform: scale(0.7) translateY(4px); }
          65%  { transform: scale(1.18); }
          100% { transform: scale(1.0); }
        }
      `}</style>

      <p style={{
        margin: 0, fontSize: 11, letterSpacing: '0.08em', textAlign: 'center',
        color: done ? '#3EDD88' : 'rgba(255,255,255,0.38)',
        textShadow: done ? '0 0 10px #3EDD88' : 'none',
        transition: 'color 0.4s',
      }}>
        {done ? 'ALL CHROMOSOMES ALIGNED' : `DRAG ONTO THE PLATE  (${placedCount} / 4)`}
      </p>

      {/* Play field */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          height: CONTAINER_H,
          userSelect: 'none',
          touchAction: 'none',
          overflow: 'visible',
        }}
      >
        {/* Metaphase plate */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: PLATE_Y - 1,
            left: 0, right: 0,
            height: 2,
            borderTop: '2px dashed rgba(255,255,255,0.55)',
            animation: 'cdd-plate-glow 2.5s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        {/* Snap zones — CSS % avoids reading ref during render */}
        {SNAP_PCT.map((pct, zi) => (
          <div
            key={zi}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: `${pct}%`,
              top: PLATE_Y,
              width: SNAP_RADIUS, height: SNAP_RADIUS,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              border: occupied[zi] !== undefined
                ? 'none'
                : '1.5px dashed rgba(255,255,255,0.2)',
              background: occupied[zi] !== undefined
                ? 'rgba(62,221,136,0.08)'
                : 'transparent',
              pointerEvents: 'none',
              transition: 'background 0.25s',
            }}
          />
        ))}

        {/* Chromosomes */}
        {CHR_IDS.map(id => {
          const pos        = positions[id];
          const isPlaced   = placed[id] !== undefined;
          const isDragging = draggingId === id;
          return (
            <div
              key={id}
              onPointerDown={e => onPointerDown(e, id)}
              onPointerMove={e => onPointerMove(e, id)}
              onPointerUp={e => onPointerUp(e, id)}
              aria-label={isPlaced ? `Chromosome ${id} aligned` : `Chromosome ${id}`}
              style={{
                position: 'absolute',
                left: pos.x, top: pos.y,
                width: CHR_SIZE, height: CHR_SIZE,
                cursor: isPlaced ? 'default' : isDragging ? 'grabbing' : 'grab',
                zIndex: isDragging ? 20 : isPlaced ? 8 : 2,
                transition: isDragging ? 'none' : 'left 0.22s ease, top 0.22s ease',
                animation: isPlaced ? 'cdd-snap-pop 0.35s ease-out' : 'none',
                touchAction: 'none',
              }}
            >
              <ChromosomeX color={CHR_COLORS[id]} size={CHR_SIZE} glow={isDragging} />
              {isPlaced && (
                <div style={{
                  position: 'absolute', top: -16, left: '50%',
                  transform: 'translateX(-50%)',
                  color: '#3EDD88', fontSize: 13, fontWeight: 700,
                  textShadow: '0 0 6px #3EDD88', pointerEvents: 'none',
                }}>✓</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Partial-score submit */}
      {placedCount >= 1 && !done && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={submitNow}
            style={{
              padding: '7px 22px', borderRadius: 8, minHeight: 36,
              border: '1.5px solid #00FFCC', background: 'rgba(0,255,204,0.08)',
              color: '#00FFCC', fontSize: 11, fontWeight: 700,
              cursor: 'pointer', fontFamily: MONO, letterSpacing: '0.1em',
            }}
          >
            SUBMIT {placedCount}/4 — {placedCount >= 3 ? 2 : 1} ★
          </button>
        </div>
      )}
    </div>
  );
}
