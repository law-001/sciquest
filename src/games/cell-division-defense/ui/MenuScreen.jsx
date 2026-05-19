const MONO = '"Courier New", Courier, monospace';

const INSTRUCTIONS = [
  { key: 'select',  text: 'Pick a defender from the left panel' },
  { key: 'place',   text: 'Click a membrane slot to deploy it' },
  { key: 'range',   text: 'Towers fire at enemies that enter range' },
  { key: 'repair',  text: 'Repair Enzyme heals the nucleus over time' },
  { key: 'phases',  text: 'Survive 5 phases of mitosis to win' },
  { key: 'nucleus', text: 'Each enemy reaching the nucleus deals damage' },
];

const DEFENDERS = [
  { color: '#FF6B35', label: 'Lysosome' },
  { color: '#1A6EFF', label: 'Protein Kinase' },
  { color: '#2ECC71', label: 'Repair Enzyme' },
];

export function MenuScreen({ onStart, onExit }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#0D1B2A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: MONO,
        overflow: 'hidden',
        zIndex: 30,
      }}
    >
      {/* Exit button anchored top-left of the full screen */}
      <button
        onClick={onExit}
        style={{
          position: 'absolute',
          top: 16, left: 16,
          zIndex: 10,
          background: 'rgba(255,255,255,0.07)',
          border: '1.5px solid rgba(255,255,255,0.18)',
          borderRadius: 10,
          color: 'rgba(255,255,255,0.65)',
          fontFamily: MONO,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
          padding: '8px 16px',
          cursor: 'pointer',
          minHeight: 40,
          transition: 'background 0.15s, color 0.15s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
          e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.65)';
        }}
      >
        &larr; EXIT TO HUB
      </button>
      <style>{`
        @keyframes cdd-cell-pulse   { 0%,100%{transform:scale(1);opacity:.9} 50%{transform:scale(1.04);opacity:1} }
        @keyframes cdd-nucleus-pulse{ 0%,100%{transform:scale(.96)}           50%{transform:scale(1.04)}            }
        @keyframes cdd-aura         { 0%,100%{opacity:.35;transform:scale(1)} 50%{opacity:.6;transform:scale(1.06)} }
        @keyframes cdd-orbit        { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        .cdd-card {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: min(500px, calc(100vw - 32px));
          padding: clamp(20px, 4vh, 44px) clamp(18px, 4vw, 52px);
          gap: clamp(12px, 2vh, 28px);
          background: rgba(5,14,22,0.72);
          border: 1.5px solid rgba(59,175,169,0.35);
          border-radius: 20px;
          box-shadow: 0 0 80px rgba(59,175,169,0.1), 0 32px 64px rgba(0,0,0,0.5);
          backdrop-filter: blur(12px);
          overflow-y: auto;
          max-height: calc(100vh - 24px);
        }
        .cdd-cell-icon {
          --sz: clamp(56px, 12vmin, 90px);
          position: relative;
          width: var(--sz);
          height: var(--sz);
          flex-shrink: 0;
        }
        .cdd-title-h1  { font-size: clamp(22px, 4.5vw, 34px); }
        .cdd-title-sub { font-size: clamp(12px, 2.2vw, 16px); }
        .cdd-label     { font-size: clamp(10px, 1.5vw, 12px); }
        .cdd-instr-row { font-size: clamp(11px, 1.6vw, 13px); }
        .cdd-btn-start { font-size: clamp(13px, 2vw, 16px); padding: clamp(12px,2vh,16px) clamp(28px,5vw,52px); }

        /* Hide defenders row on very small heights */
        @media (max-height: 560px) { .cdd-defenders { display: none !important; } }
        /* Compact instructions on small heights */
        @media (max-height: 680px) { .cdd-instr-list { display: none !important; } }
        @media (max-height: 680px) { .cdd-divider    { display: none !important; } }
      `}</style>

      {/* Ambient radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(59,175,169,0.08) 0%, transparent 70%)',
      }} />

      {/* Hex grid */}
      <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }}>
        <defs>
          <pattern id="hex-menu" x="0" y="0" width="72" height="62.35" patternUnits="userSpaceOnUse">
            <polygon points="18,0 54,0 72,31.18 54,62.35 18,62.35 0,31.18" fill="none" stroke="white" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-menu)" />
      </svg>

      {/* Card */}
      <div className="cdd-card">

        {/* Cell illustration */}
        <div className="cdd-cell-icon">
          <div style={{
            position: 'absolute', inset: '-20%', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,175,169,0.25) 0%, transparent 68%)',
            animation: 'cdd-aura 2.4s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 35%, rgba(80,200,200,0.22), rgba(15,60,70,0.55))',
            border: '2px solid #3BAFA9',
            boxShadow: '0 0 18px rgba(59,175,169,0.45)',
            animation: 'cdd-cell-pulse 2s ease-in-out infinite',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              position: 'absolute', width: '100%', height: '100%',
              animation: 'cdd-orbit 6s linear infinite',
            }}>
              <div style={{
                position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)',
                width: '14%', height: '7%', borderRadius: 4,
                background: 'rgba(180,150,90,0.5)', border: '1px solid rgba(255,210,140,0.4)',
              }} />
            </div>
            <div style={{
              width: '28%', height: '28%', borderRadius: '50%', flexShrink: 0,
              background: 'radial-gradient(circle at 38% 32%, #D6E5F8, #5B8FD4)',
              boxShadow: '0 0 12px rgba(168,200,240,0.7)',
              animation: 'cdd-nucleus-pulse 2.8s ease-in-out infinite',
            }} />
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <div className="cdd-label" style={{ color: 'rgba(59,175,169,0.6)', letterSpacing: '0.3em', marginBottom: 8 }}>
            SCIQUEST · BIOLOGY
          </div>
          <h1 className="cdd-title-h1" style={{
            color: '#ffffff', fontWeight: 700, margin: 0,
            letterSpacing: '0.06em', lineHeight: 1.1,
            textShadow: '0 0 28px rgba(255,255,255,0.4), 0 2px 8px rgba(0,0,0,0.8)',
          }}>
            CELL DIVISION
          </h1>
          <div className="cdd-title-sub" style={{
            color: '#3BAFA9', letterSpacing: '0.22em', marginTop: 8,
            fontWeight: 700,
            textShadow: '0 0 16px #3BAFA9, 0 0 32px rgba(59,175,169,0.5)',
          }}>
            DIVIDE &amp; DEFEND
          </div>
        </div>

        {/* Divider */}
        <div className="cdd-divider" style={{
          width: '100%', height: 1,
          background: 'linear-gradient(to right, transparent, rgba(59,175,169,0.4), transparent)',
        }} />

        {/* Instructions */}
        <div className="cdd-instr-list" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="cdd-label" style={{ color: '#3BAFA9', letterSpacing: '0.2em', marginBottom: 4 }}>
            HOW TO PLAY
          </div>
          {INSTRUCTIONS.map(({ key, text }) => (
            <div key={key} className="cdd-instr-row" style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ color: '#3BAFA9', fontSize: '0.9em', flexShrink: 0 }}>&#9658;</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Defender previews */}
        <div className="cdd-defenders" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {DEFENDERS.map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: `radial-gradient(circle at 38% 35%, ${color}cc, ${color}44)`,
                boxShadow: `0 0 10px ${color}66`,
                border: `1.5px solid ${color}88`,
              }} />
              <span className="cdd-label" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em' }}>
                {label.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        {/* Start */}
        <button
          className="cdd-btn-start"
          onClick={onStart}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            borderRadius: 999, border: '1.5px solid #F97316',
            background: 'rgba(249,115,22,0.14)', color: '#F97316',
            fontWeight: 700, cursor: 'pointer', fontFamily: MONO,
            letterSpacing: '0.15em', minHeight: 44,
            boxShadow: '0 0 20px rgba(249,115,22,0.2)',
            transition: 'background 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(249,115,22,0.28)';
            e.currentTarget.style.boxShadow = '0 0 28px rgba(249,115,22,0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(249,115,22,0.14)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(249,115,22,0.2)';
          }}
        >
          ▶ START GAME
        </button>

      </div>
    </div>
  );
}
