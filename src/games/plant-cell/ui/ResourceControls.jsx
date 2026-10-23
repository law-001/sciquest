// Held down (mouse, touch or keyboard) for as long as the player wants the
// action to run; releasing stops it. A real button, so keyboard, screen
// readers and touch all work without extra handling.
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
