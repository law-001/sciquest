// The pre-level briefing. Short, and always dismissable with one button.

export function EducationalModal({ level, onStart, onExit }) {
  const { briefing } = level;
  return (
    <div className="pc-modal" role="dialog" aria-modal="true" aria-labelledby="pc-brief-title">
      <div className="pc-card pc-brief">
        <div className="pc-eyebrow">
          <span aria-hidden="true">{level.icon}</span> Level {level.number} · {level.name}
        </div>
        <h2 id="pc-brief-title" className="pc-brief__title">{briefing.title}</h2>
        <p className="pc-brief__lead">{briefing.lead}</p>

        <ul className="pc-brief__list">
          {briefing.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <div className="pc-brief__goal">
          <strong>Your goal:</strong> {level.objective}
        </div>

        <div className="pc-brief__actions">
          <button type="button" className="pc-btn" onClick={onExit}>Back to levels</button>
          <button type="button" className="pc-btn pc-btn--primary" onClick={onStart} autoFocus>
            {briefing.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
