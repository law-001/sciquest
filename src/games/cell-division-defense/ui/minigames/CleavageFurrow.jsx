import { useEffect, useRef, useState } from 'react';
import { useViewportBp } from '../useViewportBp';

const MONO          = '"Courier New", Courier, monospace';
const CX            = 120;
const CY            = 120;
const R_OUT         = 98;
const R_IN          = 72;
const SECTION_COUNT = 6;
const GAP_DEG       = 3;
const FILL_RATE     = 0.04;
const FILL_INTERVAL = 30;

function toRad(deg) { return (deg * Math.PI) / 180; }

function arcPath(startDeg, endDeg) {
  if (endDeg - startDeg < 0.5) return null;
  const s = toRad(startDeg), e = toRad(endDeg);
  const la = (endDeg - startDeg) >= 180 ? 1 : 0;
  const f  = v => v.toFixed(2);
  const x1o = CX + R_OUT * Math.cos(s), y1o = CY + R_OUT * Math.sin(s);
  const x2o = CX + R_OUT * Math.cos(e), y2o = CY + R_OUT * Math.sin(e);
  const x2i = CX + R_IN  * Math.cos(e), y2i = CY + R_IN  * Math.sin(e);
  const x1i = CX + R_IN  * Math.cos(s), y1i = CY + R_IN  * Math.sin(s);
  return `M ${f(x1o)} ${f(y1o)} A ${R_OUT} ${R_OUT} 0 ${la} 1 ${f(x2o)} ${f(y2o)} L ${f(x2i)} ${f(y2i)} A ${R_IN} ${R_IN} 0 ${la} 0 ${f(x1i)} ${f(y1i)} Z`;
}

export default function CleavageFurrow({ onComplete, onStarsUpdate }) {
  const bp = useViewportBp();
  const isXS = bp === 'xs';
  const isSM = bp === 'sm';
  const ringMaxW = isXS ? 170 : isSM ? 210 : 260;

  const [sections,       setSections]       = useState([0, 0, 0, 0, 0, 0]);
  const [activeSection,  setActiveSection]  = useState(0);
  const [done,           setDone]           = useState(false);

  const sectionsRef      = useRef([0, 0, 0, 0, 0, 0]);
  const activeSectionRef = useRef(0);
  const doneRef          = useRef(false);
  const isHoldingRef     = useRef(false);
  const intervalRef      = useRef(null);
  const mountedRef       = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearInterval(intervalRef.current);
    };
  }, []);

  function startFilling(sectionIdx) {
    if (doneRef.current || sectionIdx !== activeSectionRef.current) return;
    if (intervalRef.current) return;
    isHoldingRef.current = true;

    intervalRef.current = setInterval(() => {
      if (!isHoldingRef.current || doneRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        return;
      }
      const ai   = activeSectionRef.current;
      const next = sectionsRef.current.slice();
      next[ai]   = Math.min(1, next[ai] + FILL_RATE);
      sectionsRef.current = next;
      setSections(next.slice());

      const completed = next.filter(s => s >= 1).length;
      onStarsUpdate?.(completed >= 6 ? 3 : completed >= 4 ? 2 : 1);

      if (next[ai] >= 1) {
        clearInterval(intervalRef.current);
        intervalRef.current  = null;
        isHoldingRef.current = false;

        if (completed >= SECTION_COUNT) {
          doneRef.current = true;
          setDone(true);
          setTimeout(() => { if (mountedRef.current) onComplete({ stars: 3 }); }, 350);
        } else {
          activeSectionRef.current = ai + 1;
          setActiveSection(ai + 1);
        }
      }
    }, FILL_INTERVAL);
  }

  function stopFilling() {
    isHoldingRef.current = false;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  function submitNow() {
    if (doneRef.current) return;
    stopFilling();
    doneRef.current = true;
    setDone(true);
    const completed = sectionsRef.current.filter(s => s >= 1).length;
    const stars     = completed >= 6 ? 3 : completed >= 4 ? 2 : completed >= 1 ? 1 : 0;
    onComplete({ stars });
  }

  const completedCount = sections.filter(s => s >= 1).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', fontFamily: MONO }}>
      <style>{`
        @keyframes cdd-furrow-pulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1;   }
        }
      `}</style>

      {/* Status */}
      <div style={{
        fontSize: 11, letterSpacing: '0.08em', textAlign: 'center',
        color: done ? '#3EDD88' : 'rgba(255,255,255,0.38)',
        textShadow: done ? '0 0 10px #3EDD88' : 'none',
        transition: 'color 0.3s',
        minHeight: 16,
      }}>
        {done
          ? 'CLEAVAGE FURROW COMPLETE'
          : `HOLD EACH SECTION TO PINCH  (${completedCount} / ${SECTION_COUNT})`}
      </div>

      {/* Drawing field */}
      <svg
        viewBox="0 0 240 240"
        style={{ width: '100%', maxWidth: ringMaxW, height: 'auto', touchAction: 'none', userSelect: 'none' }}
        aria-label="Cleavage furrow contractile ring"
      >
        {/* Cell membrane */}
        <circle cx={CX} cy={CY} r={108}
          fill="rgba(10,22,36,0.45)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={1.5}
          pointerEvents="none"
        />
        {/* Division plane */}
        <line x1={12} y1={CY} x2={228} y2={CY}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={1}
          strokeDasharray="4 4"
          pointerEvents="none"
        />

        {/* Arc sections */}
        {Array.from({ length: SECTION_COUNT }, (_, i) => {
          const s0         = -90 + i * 60 + GAP_DEG / 2;
          const s1         = -90 + (i + 1) * 60 - GAP_DEG / 2;
          const prog       = sections[i];
          const isActive   = i === activeSection && !done;
          const isComplete = prog >= 1;
          const fillEnd    = s0 + (s1 - s0) * prog;
          const bgP        = arcPath(s0, s1);
          const fgP        = prog > 0.005 ? arcPath(s0, fillEnd) : null;
          const midRad     = toRad(s0 + (s1 - s0) / 2);
          const lr         = (R_OUT + R_IN) / 2;
          const lx         = (CX + lr * Math.cos(midRad)).toFixed(1);
          const ly         = (CY + lr * Math.sin(midRad)).toFixed(1);

          return (
            <g key={i}>
              {/* Background track */}
              <path
                d={bgP}
                fill={isComplete ? 'rgba(62,221,136,0.1)' : 'rgba(59,175,169,0.08)'}
                stroke={isComplete ? '#3EDD88' : isActive ? '#3BAFA9' : 'rgba(59,175,169,0.28)'}
                strokeWidth={isActive ? 1.5 : 1}
                style={{
                  animation: isActive ? 'cdd-furrow-pulse 1.2s ease-in-out infinite' : 'none',
                  cursor: isActive ? 'pointer' : 'default',
                }}
                onPointerDown={isActive ? e => { e.currentTarget.setPointerCapture(e.pointerId); startFilling(i); } : undefined}
                onPointerUp={isActive ? stopFilling : undefined}
                onPointerCancel={isActive ? stopFilling : undefined}
              />
              {/* Fill progress */}
              {fgP && (
                <path
                  d={fgP}
                  fill={isComplete ? '#3EDD88' : '#3BAFA9'}
                  fillOpacity={isComplete ? 0.75 : 0.62}
                  stroke="none"
                  pointerEvents="none"
                />
              )}
              {/* Label */}
              <text
                x={lx} y={ly}
                textAnchor="middle" dominantBaseline="middle"
                fill={isComplete ? '#3EDD88' : isActive ? '#3BAFA9' : 'rgba(255,255,255,0.25)'}
                fontSize={9}
                fontFamily={MONO}
                pointerEvents="none"
              >
                {isComplete ? '✓' : (i + 1)}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Submit */}
      {!done && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={submitNow}
            style={{
              padding: '7px 22px', borderRadius: 8, minHeight: 36,
              border: '1.5px solid #FF6B6B', background: 'rgba(255,107,107,0.08)',
              color: '#FF6B6B', fontSize: 11, fontWeight: 700,
              cursor: 'pointer', fontFamily: MONO, letterSpacing: '0.1em',
            }}
          >
            SUBMIT {completedCount}/{SECTION_COUNT} — {completedCount >= 6 ? 3 : completedCount >= 4 ? 2 : completedCount >= 1 ? 1 : 0} ★
          </button>
        </div>
      )}
    </div>
  );
}
