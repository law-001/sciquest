import { useState, useEffect } from 'react';
import { getProgress } from '../../../lib/games/progress';

const GAME_ID = 'matter-state-sandbox';

const LEVEL_ACCENT = {
  l1: { color: 'var(--sq-solid-1)', soft: 'var(--sq-solid-bg)', ink: 'var(--sq-solid-ink)' },
  l2: { color: 'var(--sq-liquid-1)', soft: 'var(--sq-liquid-bg)', ink: 'var(--sq-liquid-ink)' },
  l3: { color: 'var(--sq-gas-1)', soft: 'var(--sq-gas-bg)', ink: 'var(--sq-gas-ink)' },
};

function StarIcon({ filled }) {
  return (
    <svg className={filled ? '' : 'off'} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l2.6 5.4 6 .9-4.3 4.2 1 5.9L12 16.8 6.7 19.4l1-5.9L3.4 9.3l6-.9z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LevelSelect({ supabase, user, levels, challenges, onSelectLevel, onBack }) {
  const [progressRows, setProgressRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.id) { setLoading(false); return; }
      try {
        const rows = await getProgress(supabase, { studentId: user.id, gameId: GAME_ID });
        setProgressRows(rows);
      } catch {
        // Guest / offline — only L1 playable
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.id]);

  const completedSet = new Set(
    progressRows.filter(r => r.completed).map(r => r.challenge_id),
  );

  function isUnlocked(lvl) {
    return lvl.unlocksAfter === null || completedSet.has(lvl.unlocksAfter);
  }

  function prereqLevelNumber(lvl) {
    const prereq = levels.find(l => l.challengeIds.includes(lvl.unlocksAfter));
    return prereq?.number ?? null;
  }

  function challengesForLevel(lvl) {
    return challenges.filter(c => lvl.challengeIds.includes(c.id));
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--sq-cream-0)', display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', ui-sans-serif, system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ shrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 32px', borderBottom: 'var(--sq-border)', background: 'white' }}>
        <button
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--sq-ink-3)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', minHeight: 44 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6"/>
          </svg>
          Science Games
        </button>

        <div>
          <div style={{ fontFamily: 'var(--sq-font-display)', fontWeight: 700, fontSize: 34, color: 'var(--sq-ink-1)', lineHeight: 1 }}>
            Choose a level
          </div>
          <p style={{ color: 'var(--sq-ink-3)', marginTop: 4, fontSize: 14 }}>
            Beat one challenge per level to unlock the next.
          </p>
        </div>

        <div style={{ width: 100 }} aria-hidden="true" />
      </div>

      {/* Level cards */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '36px 48px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="animate-spin" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--sq-orange-soft)', borderTopColor: 'var(--sq-orange)' }} aria-label="Loading progress" />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, maxWidth: 1100, margin: '0 auto', width: '100%' }}>
            {levels.map(lvl => {
              const accent = LEVEL_ACCENT[lvl.id] ?? LEVEL_ACCENT.l1;
              const unlocked = isUnlocked(lvl);
              const lvlChallenges = challengesForLevel(lvl);
              const doneCount = lvlChallenges.filter(c => completedSet.has(c.id)).length;
              const totalCount = lvlChallenges.length;
              const prereqNum = prereqLevelNumber(lvl);

              return (
                <article
                  key={lvl.id}
                  className={`sq-level-card${!unlocked ? ' sq-level-card--locked' : ''}`}
                  onClick={() => unlocked && onSelectLevel(lvl)}
                  aria-disabled={!unlocked}
                >
                  {/* Accent strip */}
                  <div className="sq-level-card__accent" style={{ background: accent.color }} />

                  {/* Corner badge */}
                  <div style={{ position: 'absolute', top: 18, right: 18 }}>
                    {!unlocked
                      ? <span className="sq-pill">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                          Locked
                        </span>
                      : doneCount === totalCount && totalCount > 0
                        ? <span className="sq-pill sq-pill--teal">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6"/></svg>
                            Cleared
                          </span>
                        : doneCount > 0
                          ? <span className="sq-pill sq-pill--yellow">In progress</span>
                          : <span className="sq-pill sq-pill--orange">New</span>
                    }
                  </div>

                  {/* Level number */}
                  <div className="sq-level-card__num" style={{ color: unlocked ? accent.color : 'var(--sq-ink-4)' }}>
                    <small>Level {String(lvl.number).padStart(2, '0')}</small>
                    {String(lvl.number).padStart(2, '0')}
                  </div>

                  <div>
                    <div className="sq-level-card__name" style={{ color: unlocked ? 'var(--sq-ink-1)' : 'var(--sq-ink-4)' }}>{lvl.name}</div>
                  </div>

                  <div className="sq-level-card__goal">{lvl.description}</div>

                  {/* Stars + progress */}
                  <div className="sq-level-card__foot">
                    <span className="sq-stars" aria-label={`${doneCount} of ${totalCount} challenges done`}>
                      {Array.from({ length: totalCount }, (_, i) => (
                        <StarIcon key={i} filled={i < doneCount} />
                      ))}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--sq-ink-3)' }}>{doneCount} / {totalCount} challenges</span>
                  </div>

                  {/* Lock message */}
                  {!unlocked && prereqNum !== null && (
                    <p style={{ fontSize: 12, color: 'var(--sq-ink-4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                      Complete Level {prereqNum} first
                    </p>
                  )}

                  {/* Play button */}
                  {unlocked && (
                    <button
                      onClick={e => { e.stopPropagation(); onSelectLevel(lvl); }}
                      style={{ alignSelf: 'flex-start', background: accent.color, border: `1.5px solid ${accent.color}`, color: 'white', borderRadius: 999, padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, marginTop: 4, transition: 'opacity 0.15s' }}
                      onMouseOver={e => { e.currentTarget.style.opacity = '0.85'; }}
                      onMouseOut={e => { e.currentTarget.style.opacity = '1'; }}
                    >
                      {doneCount > 0 ? 'Continue' : 'Start'}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
