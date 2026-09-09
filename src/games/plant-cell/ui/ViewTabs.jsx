// Switches the stage between the object view (the whole plant) and the cell
// view (inside one of its cells). Every level shows the same pair.

export function ViewTabs({ view, onChange }) {
  return (
    <div className="pc-viewtabs" role="group" aria-label="Choose what to look at">
      <button
        type="button"
        className="pc-btn pc-btn--small"
        aria-pressed={view === 'plant'}
        onClick={() => onChange('plant')}
      >
        <span aria-hidden="true">🪴</span> Whole plant
      </button>
      <button
        type="button"
        className="pc-btn pc-btn--small"
        aria-pressed={view === 'cell'}
        onClick={() => onChange('cell')}
      >
        <span aria-hidden="true">🔬</span> Inside a cell
      </button>
    </div>
  );
}
