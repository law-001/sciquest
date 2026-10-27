// Story text that rises from the floor of the stage like subtitles. Each new
// line comes in at the bottom and the older one leans back, shrinks and fades
// (data-age, styled as .pc-subs__line in styles.css). `children` (a button)
// rises in under the lines.

// Only the newest two lines are visible. The one before them stays mounted at
// age 2 (fully faded in CSS) so it fades out instead of vanishing.
const MAX_SUB_AGE = 2;

// lines: [{ key, text, tag?, tone?: 'is-right' | 'is-wrong' }]
export function Subtitles({ lines, children = null }) {
  return (
    <div className="pc-subs">
      <div className="pc-subs__lines" aria-live="polite">
        {lines.slice(-(MAX_SUB_AGE + 1)).map((line, i, shown) => (
          <p key={line.key} className="pc-subs__line" data-age={shown.length - 1 - i}>
            {line.tag && <span className={`pc-subs__tag ${line.tone}`}>{line.tag} — </span>}
            {line.text}
          </p>
        ))}
      </div>
      {children}
    </div>
  );
}
