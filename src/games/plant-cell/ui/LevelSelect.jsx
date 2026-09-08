import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { LEVELS, isLevelUnlocked } from '../data/levels';
import { useTheme } from '../../../context/ThemeContext';

function StarIcon({ filled }) {
  return (
    <svg className={filled ? '' : 'off'} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3l2.6 5.4 6 .9-4.3 4.2 1 5.9L12 16.8 6.7 19.4l1-5.9L3.4 9.3l6-.9z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

const TOTAL_STARS = 3;

export function LevelSelect({ progressByLevel, onSelect, onExit }) {
  const { isDark, toggle } = useTheme();
  const headerRef = useRef(null);
  const cardsRef = useRef(null);
  const hasAnimated = useRef(false);

  const completedIds = LEVELS.filter((l) => progressByLevel[l.id]?.completed).map((l) => l.id);

  useEffect(() => {
    if (hasAnimated.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    hasAnimated.current = true;
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, { y: -16, opacity: 0, duration: 0.45, ease: 'power2.out' });
      if (cardsRef.current) {
        gsap.from(cardsRef.current.querySelectorAll('article'), {
          y: 28, opacity: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1, delay: 0.2,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  function prereqLevelNumber(level) {
    if (!level.unlocksAfter) return null;
    const prereq = LEVELS.find((l) => l.id === level.unlocksAfter);
    return prereq?.number ?? null;
  }

  return (
    <div
      className="sq-stage-bg"
      style={{
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        ref={headerRef}
        style={{
          flexShrink: 0,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 32px',
          borderBottom: 'var(--sq-border)',
          background: 'var(--sq-surface)',
        }}
      >
        <div
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#ea580c' }}
          aria-hidden="true"
        />

        <button
          onClick={onExit}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 500, color: 'var(--sq-ink-3)',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 10px', minHeight: 44, borderRadius: 8,
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--sq-cream-1)'; e.currentTarget.style.color = 'var(--sq-ink-1)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--sq-ink-3)'; }}
          aria-label="Back to games"
        >
          <svg width="20" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontFamily: 'var(--sq-font-display)', fontWeight: 700, fontSize: 34, color: 'var(--sq-ink-1)', lineHeight: 1 }}>
              Choose a level
            </div>
          </div>
          <p style={{ color: 'var(--sq-ink-3)', marginTop: 0, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'var(--sq-orange)', flexShrink: 0 }} aria-hidden="true" />
            Keep the plant cell alive, one system at a time.
            <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'var(--sq-teal)', flexShrink: 0 }} aria-hidden="true" />
          </p>
        </div>

        <button
          onClick={toggle}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 38, height: 38, borderRadius: 999,
            background: 'var(--sq-cream-1)', border: 'var(--sq-border)',
            cursor: 'pointer', color: 'var(--sq-ink-2)', transition: 'background 0.15s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--sq-cream-2)'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'var(--sq-cream-1)'; }}
        >
          {isDark ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '36px 48px' }}>
        <div ref={cardsRef} className="sq-level-grid">
          {LEVELS.map((level) => {
            const prog = progressByLevel[level.id] || {};
            const unlocked = isLevelUnlocked(level, completedIds);
            const done = !!prog.completed;
            const earned = prog.stars ?? 0;
            const prereqNum = prereqLevelNumber(level);
            const accent = level.accent;

            return (
              <article
                key={level.id}
                className={`sq-level-card${unlocked ? '' : ' sq-level-card--locked'}`}
                onClick={() => unlocked && onSelect(level)}
                aria-disabled={!unlocked}
                onMouseEnter={(e) => {
                  if (!unlocked) return;
                  gsap.to(e.currentTarget, { y: -6, scale: 1.02, duration: 0.2, ease: 'power2.out' });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.25, ease: 'power2.inOut' });
                }}
              >
                <div className="sq-level-card__accent" style={{ background: accent }} />

                <div style={{ position: 'absolute', top: 18, right: 18 }}>
                  {!unlocked ? (
                    <span className="sq-pill">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="4" y="11" width="16" height="10" rx="2" />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                      </svg>
                      Locked
                    </span>
                  ) : done ? (
                    <span className="sq-pill sq-pill--teal">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 12l5 5L20 6" />
                      </svg>
                      Cleared
                    </span>
                  ) : earned > 0 ? (
                    <span className="sq-pill sq-pill--yellow">In progress</span>
                  ) : (
                    <span className="sq-pill sq-pill--orange">New</span>
                  )}
                </div>

                <div className="sq-level-card__num" style={{ color: unlocked ? accent : 'var(--sq-ink-4)' }}>
                  <small>Level {String(level.number).padStart(2, '0')}</small>
                  {String(level.number).padStart(2, '0')}
                </div>

                <div>
                  <div className="sq-level-card__name" style={{ color: unlocked ? 'var(--sq-ink-1)' : 'var(--sq-ink-4)' }}>
                    {level.name}
                  </div>
                </div>

                <div className="sq-level-card__goal">{level.goal}</div>

                <div className="sq-level-card__foot">
                  <span className="sq-stars" aria-label={`${earned} of ${TOTAL_STARS} stars`}>
                    {Array.from({ length: TOTAL_STARS }, (_, i) => (
                      <StarIcon key={i} filled={i < earned} />
                    ))}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--sq-ink-3)' }}>
                    {earned} / {TOTAL_STARS} stars
                  </span>
                </div>

                {!unlocked && prereqNum !== null && (
                  <p style={{ fontSize: 12, color: 'var(--sq-ink-4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                    Complete Level {prereqNum} first
                  </p>
                )}

                {unlocked && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelect(level); }}
                    style={{
                      alignSelf: 'flex-start',
                      background: accent,
                      border: `1.5px solid ${accent}`,
                      color: 'white',
                      borderRadius: 999,
                      padding: '10px 20px',
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      minHeight: 44,
                      marginTop: 4,
                      transition: 'opacity 0.15s',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                    onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; }}
                  >
                    {done ? 'Continue' : 'Start'}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
