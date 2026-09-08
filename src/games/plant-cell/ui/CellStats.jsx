// Read-outs for the live cell. Every meter states its value in words as well
// as in colour, so nothing depends on being able to tell green from red.

import { TONE_COLOR } from './tone';

export function Meter({ label, value, readout, tone = 'info', band = null, icon = null }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="pc-meter">
      <div className="pc-meter__head">
        <span className="pc-meter__label">
          {icon && <span aria-hidden="true">{icon} </span>}
          {label}
        </span>
        <span className="pc-meter__value" style={{ color: TONE_COLOR[tone] }}>{readout}</span>
      </div>
      <div
        className="pc-meter__track"
        role="meter"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${readout}`}
      >
        {band && (
          <span
            className="pc-meter__band"
            style={{ left: `${band.low}%`, width: `${band.high - band.low}%` }}
            aria-hidden="true"
          />
        )}
        <span className="pc-meter__fill" style={{ width: `${pct}%`, background: TONE_COLOR[tone] }} />
      </div>
    </div>
  );
}

export function StatChip({ label, value, tone = 'normal' }) {
  return (
    <div className="pc-chip">
      <span className="pc-chip__label">{label}</span>
      <span className="pc-chip__value" style={{ color: TONE_COLOR[tone] }}>{value}</span>
    </div>
  );
}

export function StatusLine({ tone = 'info', children }) {
  return (
    <p className="pc-status" style={{ borderColor: TONE_COLOR[tone], color: TONE_COLOR[tone] }}>
      <span aria-hidden="true" className="pc-status__dot" style={{ background: TONE_COLOR[tone] }} />
      <span className="pc-status__text">{children}</span>
    </p>
  );
}
