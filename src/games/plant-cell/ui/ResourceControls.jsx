// Player controls. Native range inputs and real buttons, so keyboard, screen
// readers and touch all work without extra handling.

export function ResourceSlider({ id, label, icon, value, onChange, hint, accent, disabled = false }) {
  return (
    <div className="pc-slider">
      <label className="pc-slider__head" htmlFor={id}>
        <span className="pc-slider__label">
          <span aria-hidden="true">{icon}</span> {label}
        </span>
        <span className="pc-slider__value" style={{ color: accent }}>{Math.round(value)}%</span>
      </label>
      <input
        id={id}
        className="pc-range"
        type="range"
        min="0"
        max="100"
        step="1"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ '--pc-range-accent': accent }}
      />
      {hint && <p className="pc-slider__hint">{hint}</p>}
    </div>
  );
}

// Held down (mouse, touch or keyboard) for as long as the player wants the
// transfer to run; releasing stops it.
export function HoldButton({ label, icon, active, onHoldChange, disabled = false, tone = 'teal' }) {
  const stop = () => onHoldChange(false);
  return (
    <button
      type="button"
      className={`pc-hold pc-hold--${tone}${active ? ' is-active' : ''}`}
      disabled={disabled}
      aria-pressed={active}
      onPointerDown={(e) => { e.preventDefault(); onHoldChange(true); }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onHoldChange(true); } }}
      onKeyUp={(e) => { if (e.key === 'Enter' || e.key === ' ') stop(); }}
      onBlur={stop}
    >
      <span aria-hidden="true">{icon}</span> {label}
    </button>
  );
}
