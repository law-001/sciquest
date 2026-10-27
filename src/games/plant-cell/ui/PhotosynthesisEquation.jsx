// The equation under the plant. An ingredient at 0 and the products of a
// stopped reaction are struck out, so what changed shows in text as well as
// colour.
function Term({ isOff, color, children }) {
  return <b className={isOff ? 'pc-equation__off' : undefined} style={{ color }}>{children}</b>;
}

export function PhotosynthesisEquation({ light, water, co2, isStopped }) {
  return (
    <div className="pc-equation" aria-label="The photosynthesis equation">
      <span className="pc-equation__side">
        <Term isOff={light === 0} color="#d9a824">sunlight</Term>
        {' + '}
        <Term isOff={water === 0} color="#3f7fb5">water</Term>
        {' + '}
        <Term isOff={co2 === 0} color="#6f6553">carbon dioxide</Term>
      </span>
      <span className="pc-equation__arrow" aria-hidden="true">→</span>
      <span className="pc-equation__mid">chloroplast</span>
      <span className="pc-equation__arrow" aria-hidden="true">→</span>
      <span className="pc-equation__side">
        <Term isOff={isStopped} color="#d76d2e">glucose</Term>
        {' + '}
        <Term isOff={isStopped} color="#1d8580">oxygen</Term>
      </span>
    </div>
  );
}
