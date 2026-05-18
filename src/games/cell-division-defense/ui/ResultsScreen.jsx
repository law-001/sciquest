import { useEffect, useState } from 'react';

const MONO = '"Courier New", Courier, monospace';

export function ResultsScreen({ stars, mutations, hpLeft, xpEarned, levelTitle, onReplay, onExit }) {
  const [visibleStars, setVisibleStars] = useState(0);

  useEffect(() => {
    setVisibleStars(0);
    let count = 0;
    const id = setInterval(() => {
      count++;
      setVisibleStars(count);
      if (count >= Math.max(stars, 1)) clearInterval(id);
    }, 400);
    return () => clearInterval(id);
  }, [stars]);

  const failed = stars === 0;
  const accentColor = failed ? '#EF4444' : '#3BAFA9';
  const title = failed ? 'CELL FAILED' : 'DIVISION COMPLETE!';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        background: 'rgba(0,13,26,0.96)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: MONO,
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: '90%',
          background: '#0D1B2A',
          border: `1.5px solid ${failed ? 'rgba(239,68,68,0.3)' : 'rgba(59,175,169,0.35)'}`,
          borderRadius: 16,
          padding: '36px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {levelTitle && (
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.15em' }}>
            {levelTitle}
          </div>
        )}

        <h2
          style={{
            color: accentColor,
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
            letterSpacing: '0.12em',
            textShadow: `0 0 16px ${accentColor}`,
            textAlign: 'center',
          }}
        >
          {title}
        </h2>

        {/* Star display */}
        <div style={{ display: 'flex', gap: 16 }} aria-label={`${stars} out of 3 stars`}>
          {[1, 2, 3].map(n => (
            <div
              key={n}
              aria-hidden="true"
              style={{
                fontSize: 40,
                transform: visibleStars >= n ? 'scale(1)' : 'scale(0.4)',
                transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                color: visibleStars >= n ? '#FFD700' : '#2a3340',
                textShadow: visibleStars >= n ? '0 0 18px #FFD700' : 'none',
              }}
            >
              ★
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', alignItems: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            Daughter Cell Health:{' '}
            <span style={{ color: '#ffffff', fontWeight: 700 }}>{hpLeft}%</span>
          </div>

          {mutations && mutations.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', marginTop: 4 }}>
              <div style={{ color: '#EF4444', fontSize: 11, letterSpacing: '0.08em' }}>
                MUTATIONS ACQUIRED
              </div>
              {mutations.map((m, i) => (
                <div key={i} style={{ color: '#FF8080', fontSize: 11 }}>
                  {m?.name ?? m}
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              marginTop: 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 20px',
              borderRadius: 999,
              border: '1.5px solid #3BAFA9',
              background: 'rgba(59,175,169,0.12)',
              color: '#3BAFA9',
              fontSize: 16,
              fontWeight: 700,
              boxShadow: '0 0 14px rgba(59,175,169,0.3)',
            }}
          >
            +{xpEarned} XP
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
          <button
            onClick={onReplay}
            style={{
              padding: '10px 28px',
              borderRadius: 999,
              border: '1.5px solid #F97316',
              background: 'rgba(249,115,22,0.14)',
              color: '#F97316',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: MONO,
              minHeight: 44,
              letterSpacing: '0.1em',
            }}
          >
            REPLAY
          </button>
          <button
            onClick={onExit}
            style={{
              padding: '10px 28px',
              borderRadius: 999,
              border: '1.5px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.65)',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: MONO,
              minHeight: 44,
            }}
          >
            EXIT TO HUB
          </button>
        </div>
      </div>
    </div>
  );
}
