const ENEMY_COLORS = {
  viralHijacker: '#8B00FF',
  radiationPulse: '#FFB300',
  toxinDroplet: '#7FFF00',
};

const ENEMY_LABELS = {
  viralHijacker: 'Viral Hijacker',
  radiationPulse: 'Radiation Pulse',
  toxinDroplet: 'Toxin Droplet',
};

const MONO = '"Courier New", Courier, monospace';

export function WaveQueue({ nextWaveEnemies, waveCountdown, waveCountdownMax, currentWave, totalWaves }) {
  if (!nextWaveEnemies || nextWaveEnemies.length === 0) return null;

  const elapsed = waveCountdownMax - waveCountdown;
  const fillPct = waveCountdownMax > 0 ? Math.min(100, (elapsed / waveCountdownMax) * 100) : 0;

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.65)',
        border: '1px solid rgba(59,175,169,0.2)',
        borderRadius: 10,
        padding: 10,
        fontFamily: MONO,
        width: '100%',
      }}
    >
      <div style={{ color: '#3BAFA9', fontSize: 10, letterSpacing: '0.15em', marginBottom: 6 }}>
        WAVE IN PROGRESS
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={elapsed}
        aria-valuemin={0}
        aria-valuemax={waveCountdownMax}
        aria-label="Wave timer"
        style={{
          height: 3,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 2,
          marginBottom: 8,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${fillPct}%`,
            background: '#F97316',
            borderRadius: 2,
            transition: 'width 1s linear',
          }}
        />
      </div>

      {/* Enemy list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
        {nextWaveEnemies.map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              aria-hidden="true"
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: ENEMY_COLORS[e.type] ?? '#aaa',
                flexShrink: 0,
                boxShadow: `0 0 4px ${ENEMY_COLORS[e.type] ?? '#aaa'}`,
              }}
            />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9, flex: 1 }}>
              {ENEMY_LABELS[e.type] ?? e.type}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700 }}>
              ×{e.count}
            </span>
          </div>
        ))}
      </div>

      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>
        Wave {currentWave} / {totalWaves}
      </div>
    </div>
  );
}
