// Level 1's object view — the whole dog in the same room as plant-cell's plant,
// so the sliders show outside the microscope: the bowl fills with Glucose, the
// dog breathes faster with Oxygen, and it slows, sits and collapses as its
// cells run out of energy.
//
// Same 320 x 220 viewBox as the cell view, bottom-anchored like PlantView so
// the dog stays on the room art's floor (LabFrame draws the room behind it).

const ART = '/games/animal-cell/art';
const FLOOR_Y = 205;
// Screen units per sprite pixel. Sprites are cropped to their content, so
// each one is placed by its own size and stood on the floor.
const SCALE = 0.31;
const DOG_X = 190;

// Cropped pixel size of each sprite in public/games/animal-cell/art.
const DOG = {
  active: { w: 434, h: 368, word: 'trotting about, full of energy' },
  idle: { w: 452, h: 349, word: 'standing calmly' },
  tired: { w: 430, h: 338, word: 'sitting down, tired' },
  collapsed: { w: 437, h: 155, word: 'lying down, out of energy' },
};
const BOWL = { empty: 92, half: 92, full: 124 };
const BOWL_W = 183;
const BOWL_X = 292;

// Kibble rises from the bowl to the dog's mouth; breath puffs leave its nose.
const FOOD_LANE = 'M 292 186 Q 284 150 262 128';
const BREATH_LANE = 'M 266 116 L 312 78';

function dogStateFor({ health, energy, rate }) {
  if (health < 12) return 'collapsed';
  if (health < 40 || energy < 12) return 'tired';
  if (rate >= 0.9 && energy > 40) return 'active';
  return 'idle';
}

function Particles({ sprite, w, h, lane, count, duration, animate, opacity = 1 }) {
  if (!animate || count <= 0) return null;
  return (
    <g aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <image key={i} href={sprite} x={-w / 2} y={-h / 2} width={w} height={h} opacity={opacity}>
          <animateMotion path={lane} dur={`${duration}s`} begin={`${-(i * duration) / count}s`} repeatCount="indefinite" />
        </image>
      ))}
    </g>
  );
}

export function AnimalView({
  glucose,
  oxygen,
  rate,
  energy,
  health,
  reducedMotion = false,
  particleBudget = 2,
  title = 'The dog in the room',
}) {
  const animate = !reducedMotion;
  const count = (amount) => Math.min(particleBudget, Math.round(amount * particleBudget));

  const state = dogStateFor({ health, energy, rate });
  const dog = DOG[state];
  const dogW = dog.w * SCALE;
  const dogH = dog.h * SCALE;

  const bowl = glucose < 15 ? 'empty' : glucose < 60 ? 'half' : 'full';
  const bowlW = BOWL_W * SCALE * 0.9;
  const bowlH = BOWL[bowl] * SCALE * 0.9;

  const label = `${title}. The food bowl is ${bowl}. The dog is ${dog.word}, breathing ${oxygen < 15 ? 'barely at all' : oxygen < 60 ? 'gently' : 'deeply'}.`;

  return (
    <svg
      className="pc-cell pc-plant"
      viewBox="0 0 320 220"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMax meet"
    >
      <title>{label}</title>

      {/* Same window as PlantView at full daylight: sky fills the glass box
          measured off window.png, the sun sits in the top-left pane. */}
      <rect x="33" y="32" width="70" height="91" fill="#bfe3f7" />
      <image href="/games/plant-cell/art/sun.png" x="34.3" y="38.6" width="30.8" height="30.8" />
      <image href="/games/plant-cell/art/window.png" x="16" y="16" width="104" height="122" preserveAspectRatio="none" />

      <image
        key={bowl}
        href={`${ART}/bowl-${bowl}.png`}
        x={BOWL_X - bowlW / 2} y={FLOOR_Y - bowlH} width={bowlW} height={bowlH}
      />

      <g>
        <image
          key={state}
          href={`${ART}/dog-${state}.png`}
          x={DOG_X - dogW / 2} y={FLOOR_Y - dogH} width={dogW} height={dogH}
        />
        {/* A small hop while trotting — transform only, and off with reduced motion. */}
        {animate && state === 'active' && (
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -4; 0 0" dur="0.5s" repeatCount="indefinite" />
        )}
      </g>

      {state !== 'collapsed' && (
        <>
          <Particles sprite={`${ART}/particle-food.png`} w={7} h={7} lane={FOOD_LANE} count={count((glucose / 100) * rate)} duration={1.8} animate={animate} />
          {/* More oxygen = faster breathing, so the puffs speed up with the slider. */}
          <Particles sprite={`${ART}/particle-breath.png`} w={13} h={9} lane={BREATH_LANE} count={count(oxygen / 100)} duration={2.8 - 1.6 * (oxygen / 100)} animate={animate} opacity={0.65} />
        </>
      )}
    </svg>
  );
}
