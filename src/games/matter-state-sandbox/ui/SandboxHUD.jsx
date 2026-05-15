import { useState, useEffect } from 'react';
import { StateBadge } from './StateBadge';

export function SandboxHUD({ bus, level, activeChallenge, holdProgress = 0, reducedMotion }) {
  const [info, setInfo] = useState({ state: 'solid', substance: null, temp: -10, pressure: 1 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fromState, setFromState] = useState('solid');
  const [toState, setToState] = useState('liquid');
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    function onStateChanged(data) {
      setInfo(data);
      setIsTransitioning(false);
    }
    function onTransitionStart({ fromState: f, toState: t }) {
      setIsTransitioning(true);
      setFromState(f);
      setToState(t);
    }
    bus.on('stateChanged', onStateChanged);
    bus.on('transitionStart', onTransitionStart);
    return () => {
      bus.off('stateChanged', onStateChanged);
      bus.off('transitionStart', onTransitionStart);
    };
  }, [bus]);

  const tempC = Math.round(info.temp);
  const tempK = (info.temp + 273.15).toFixed(0);
  const pressureStr = `${Number(info.pressure ?? 1).toFixed(2)} atm`;
  const pressureLocked = level.number < 3;

  return (
    <>
      <aside className="sq-hud" aria-label="Sandbox info panel">
        {/* Active challenge */}
        {activeChallenge ? (
          <div className="sq-challenge-card">
            <div className="sq-challenge-card__label">Active challenge</div>
            <div className="sq-challenge-card__title">{activeChallenge.title}</div>
            <div className="sq-challenge-card__goal">{activeChallenge.description}</div>
            {holdProgress > 0 && (
              <div className="sq-challenge-card__progress">
                <div className="sq-progress-bar">
                  <div
                    className="sq-progress-bar__fill"
                    style={{ width: `${holdProgress * 100}%` }}
                    role="progressbar"
                    aria-valuenow={Math.round(holdProgress * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Hold progress"
                  />
                </div>
                <span>{Math.round(holdProgress * 100)}%</span>
              </div>
            )}
          </div>
        ) : (
          <div className="sq-challenge-card">
            <div className="sq-challenge-card__label">No active challenge</div>
            <div className="sq-challenge-card__goal" style={{ color: 'var(--sq-ink-3)' }}>
              Explore freely — use the controls below to change temperature and pressure.
            </div>
          </div>
        )}

        {/* State badge */}
        <StateBadge
          state={info.state}
          substance={info.substance}
          isTransitioning={isTransitioning}
          fromState={fromState}
          toState={toState}
          reducedMotion={reducedMotion}
        />

        {/* Live stats */}
        <div className="sq-stats" aria-label="Live stats">
          <div className="sq-stats-row">
            <span className="k">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="3.5"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-60 12 12)"/>
              </svg>
              Temperature
            </span>
            <span className="v">
              {tempC > 0 ? '+' : ''}{tempC}°C
              <span style={{ color: 'var(--sq-ink-4)', marginLeft: 5, fontWeight: 400, fontSize: 11 }}>· {tempK} K</span>
            </span>
          </div>
          <div className={`sq-stats-row${pressureLocked ? ' locked' : ''}`}>
            <span className="k">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 13a9 9 0 1 1 18 0"/><path d="M12 13l4-3"/>
              </svg>
              Pressure
            </span>
            <span className="v">{pressureLocked ? '— atm' : pressureStr}</span>
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button
            className="sq-helplink"
            onClick={() => setHelpOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5"/>
            </svg>
            How real is this?
          </button>
        </div>
      </aside>

      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </>
  );
}

function HelpModal({ onClose }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(43,36,23,0.4)', zIndex: 100, display: 'grid', placeItems: 'center', padding: 24, backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-heading"
        style={{ background: 'white', borderRadius: 'var(--sq-radius-lg)', padding: 28, maxWidth: 460, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.22)' }}
        onClick={e => e.stopPropagation()}
      >
        <h2 id="help-heading" style={{ fontFamily: 'var(--sq-font-display)', fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--sq-ink-1)' }}>
          How real is this?
        </h2>
        <p style={{ color: 'var(--sq-ink-2)', lineHeight: 1.55, fontSize: 14, marginBottom: 10 }}>
          This sandbox shows the <strong>idea</strong> of states of matter — not chemically-accurate physics. Three things are simplified on purpose:
        </p>
        <ul style={{ paddingLeft: 20, margin: '10px 0', fontSize: 14, color: 'var(--sq-ink-2)', lineHeight: 1.7 }}>
          <li><strong>Particle count.</strong> A real drop of water has ~10²² molecules. We show far fewer so you can see each one.</li>
          <li><strong>Bond strength.</strong> Solid particles snap to a lattice instantly; in reality bonds form over picoseconds.</li>
          <li><strong>Pressure response.</strong> We use a simple proportional shift, not the full Clausius–Clapeyron curve.</li>
        </ul>
        <p style={{ color: 'var(--sq-ink-2)', lineHeight: 1.55, fontSize: 14 }}>
          The trends are real — particles vibrate in solids, flow in liquids, fly apart in gases. The exact numbers are stylised for learning.
        </p>
        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ background: 'var(--sq-orange)', border: '1.5px solid var(--sq-orange-deep)', color: 'white', borderRadius: 999, padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer', minHeight: 44 }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
