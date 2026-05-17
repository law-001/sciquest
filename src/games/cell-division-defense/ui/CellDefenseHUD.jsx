const PHASES = ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'];

const PHASE_COLORS = {
  interphase: '#3BAFA9',
  prophase:   '#9B59B6',
  metaphase:  '#00FFCC',
  anaphase:   '#FFD700',
  telophase:  '#A8C8F0',
  cytokinesis:'#FF6B6B',
};

const PHASE_LABELS = {
  interphase: 'INTERPHASE',
  prophase:   'PROPHASE',
  metaphase:  'METAPHASE',
  anaphase:   'ANAPHASE',
  telophase:  'TELOPHASE',
  cytokinesis:'CYTOKINESIS',
};

const MONO = '"Courier New", Courier, monospace';

export function CellDefenseHUD({ hp, atp, phase, mutations, wave, totalWaves, paused, onPause, onExit }) {
  const currentIdx = PHASES.indexOf(phase);
  const phaseColor = PHASE_COLORS[phase] ?? '#3BAFA9';
  const hpPct = Math.max(0, Math.min(100, hp));

  return (
    <div
      role="status"
      aria-label="Game status"
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 56,
        background: 'rgba(0,0,0,0.68)',
        borderBottom: '2px solid',
        borderImage: 'linear-gradient(to right, rgba(59,175,169,0) 0%, rgba(59,175,169,0.5) 50%, rgba(59,175,169,0) 100%) 1',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        fontFamily: MONO,
        gap: 0,
      }}
    >
      {/* ── Left: phase dots + name ────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {PHASES.map((p, i) => {
            const isPast    = i < currentIdx;
            const isCurrent = i === currentIdx;
            const color     = PHASE_COLORS[p];
            return (
              <div
                key={p}
                title={PHASE_LABELS[p]}
                aria-label={`${PHASE_LABELS[p]}: ${isCurrent ? 'current' : isPast ? 'complete' : 'upcoming'}`}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: isCurrent || isPast ? color : '#2a3340',
                  border: isCurrent || isPast ? 'none' : '1px solid #3a4350',
                  boxShadow: isCurrent ? `0 0 0 3px ${color}44, 0 0 14px 2px ${color}` : 'none',
                  transition: 'box-shadow 0.4s, background 0.3s',
                  flexShrink: 0,
                }}
              />
            );
          })}
        </div>

        <span
          style={{
            color: phaseColor,
            fontWeight: 700,
            fontSize: 18,
            textShadow: `0 0 8px ${phaseColor}`,
            whiteSpace: 'nowrap',
            letterSpacing: '0.04em',
          }}
        >
          {PHASE_LABELS[phase] ?? phase}
        </span>
      </div>

      {/* spacer */}
      <div style={{ flex: 1 }} />

      {/* ── Center: HP bar + ATP + wave ───────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>

        {/* HP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#FF6B6B', fontSize: 16, lineHeight: 1 }}>❤</span>
          <span style={{ color: '#ffffff', fontSize: 16, fontWeight: 700 }}> HP:</span>
          {/* Bar with text inside */}
          <div
            style={{
              position: 'relative',
              width: 110,
              height: 14,
              borderRadius: 4,
              background: 'rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}
            role="progressbar"
            aria-valuenow={hp}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Nucleus HP"
          >
            <div
              style={{
                position: 'absolute',
                inset: '1px',
                width: `calc(${hpPct}% - 2px)`,
                borderRadius: 3,
                background: `linear-gradient(to right, #FF8080, #CC2020)`,
                transition: 'width 0.4s ease',
              }}
            />
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: '#fff',
                textShadow: '0 0 3px rgba(0,0,0,0.9)',
                fontFamily: MONO,
                lineHeight: 1,
              }}
            >
              {hp} / 100
            </span>
          </div>
        </div>

        {/* Separator */}
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.12)' }} />

        {/* ATP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span
            style={{
              color: '#FFD700',
              fontSize: 16,
              textShadow: '0 0 8px #FFD700',
            }}
          >
            ⚡
          </span>
          <span style={{ color: '#ffffff', fontSize: 16, fontWeight: 700 }}> ATP:</span>
          <span
            style={{
              color: '#FFD700',
              fontSize: 16,
              fontWeight: 700,
              minWidth: 36,
            }}
          >
            {atp}
          </span>
        </div>

        {/* Wave counter */}
        {wave > 0 && (
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
            WAVE {String(wave).padStart(2, '0')} / {String(totalWaves).padStart(2, '0')}
          </span>
        )}

        {/* Mutations badge */}
        {mutations.length > 0 && (
          <span
            title={mutations.map(m => m.name ?? m).join(', ')}
            style={{
              color: '#FF9090',
              fontSize: 11,
              fontWeight: 700,
              background: 'rgba(80,10,10,0.78)',
              padding: '2px 8px',
              borderRadius: 6,
              border: '1px solid rgba(255,80,80,0.5)',
            }}
          >
            ⚠ {mutations.length} MUTATION{mutations.length !== 1 ? 'S' : ''}
          </span>
        )}

        {/* LIVE indicator */}
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10 }}>
          ● LIVE
        </span>
      </div>

      {/* spacer */}
      <div style={{ flex: 1 }} />

      {/* ── Right: pause + exit ───────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        {/* Pause button — matches game.js rectangle style */}
        <button
          onClick={onPause}
          aria-label={paused ? 'Resume game' : 'Pause game'}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: '1.5px solid #FF8C42',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 8px #FF8C42',
            padding: 0,
          }}
        >
          {paused ? (
            /* Play triangle */
            <svg width="14" height="14" viewBox="0 0 14 14" fill="#FF8C42" aria-hidden="true">
              <polygon points="3,1 13,7 3,13" />
            </svg>
          ) : (
            /* Two vertical bars */
            <svg width="14" height="16" viewBox="0 0 14 16" fill="#FF8C42" aria-hidden="true">
              <rect x="1" y="1" width="4" height="14" rx="1" />
              <rect x="9" y="1" width="4" height="14" rx="1" />
            </svg>
          )}
        </button>

        <button
          onClick={onExit}
          aria-label="Exit to game hub"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '6px 14px',
            height: 36,
            borderRadius: 8,
            border: '1.5px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.75)',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 700,
            fontFamily: MONO,
          }}
        >
          ← EXIT
        </button>
      </div>
    </div>
  );
}
