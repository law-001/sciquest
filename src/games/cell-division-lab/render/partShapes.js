// Shape maths shared by the SVG parts and by the procedures that position
// them. Kept out of parts.jsx so that file exports components only.

// A loose chromatin thread. `coil` 0 → sprawling fibre, 1 → tightly wound,
// which is what condensation physically does to it.
export function chromatinPath(seed, spread, coil) {
  const loops = 3 + (seed % 3);
  const tight = 1 - 0.72 * coil;
  const step = (Math.PI * 2 * loops) / 46;
  let d = '';
  for (let i = 0; i <= 46; i++) {
    const a = i * step + seed;
    const rr = spread * tight * (0.45 + 0.55 * Math.sin(i * 0.42 + seed));
    const px = Math.cos(a) * rr * (1 + 0.5 * (1 - coil));
    const py = Math.sin(a * 0.75 + seed) * rr * 0.7;
    d += `${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  return d;
}

export const BASE_TINT = { A: '#C0392B', T: '#1E8449', G: '#B9770E', C: '#2874A6' };
export const PARTNER = { A: 'T', T: 'A', G: 'C', C: 'G' };
// A–T is held by two hydrogen bonds, G–C by three.
export const H_BONDS = { A: 2, T: 2, G: 3, C: 3 };

export const isPurine = (b) => b === 'A' || b === 'G';
export const baseHeight = (b) => (isPurine(b) ? 34 : 26);
const baseHalfWidth = (b) => (isPurine(b) ? 26 : 19);

// The pairing edge sits on y = 0 and the body hangs to +y. A purine carries a
// tab, its pyrimidine partner the matching socket — so A only fits T and G
// only fits C, by shape and not just by colour.
export function basePath(base) {
  const w = baseHalfWidth(base);
  const h = baseHeight(base);
  const round = base === 'G' || base === 'C';
  const key = isPurine(base)
    ? (round ? 'L -9 0 A 9 9 0 0 0 9 0' : 'L -9 0 L 0 -13 L 9 0')
    : (round ? 'L -9 0 A 9 9 0 0 1 9 0' : 'L -9 0 L 0 13 L 9 0');

  return [
    `M ${-w} 0`,
    key,
    `L ${w} 0`,
    `L ${w} ${h - 7}`,
    `Q ${w} ${h} ${w - 7} ${h}`,
    `L ${-w + 7} ${h}`,
    `Q ${-w} ${h} ${-w} ${h - 7}`,
    'Z',
  ].join(' ');
}

