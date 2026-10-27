// The object view — the whole plant in a pot by a window, so the sliders have a
// visible consequence outside the microscope: the beam brightens, water climbs
// the stem, carbon dioxide drifts in, and a starved or dry plant droops.
//
// Same 320 x 220 viewBox as CellView so the two views swap without the stage
// resizing. Plain shapes on purpose — artwork replaces them later.

const VIEW_W = 320;
const VIEW_H = 220;

const clamp01 = (n) => Math.min(1, Math.max(0, n));

// Blends two #rrggbb colours. Used for the soil darkening as it wets and the
// leaves fading as the plant starves.
function mix(from, to, t) {
  const a = parseInt(from.slice(1), 16);
  const b = parseInt(to.slice(1), 16);
  const k = clamp01(t);
  const ch = (shift) => {
    const av = (a >> shift) & 255;
    const bv = (b >> shift) & 255;
    return Math.round(av + (bv - av) * k);
  };
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}

// The glass opening inside window.png's frame, measured off the artwork. The sky
// and the rain both fill exactly this box so no blue leaks past the frame.
const GLASS = { x: 33, y: 32, w: 70, h: 91 };

// Centre of the top-left pane — where the sun sits and where the beam starts.
const SUN_X = 49.7;
const SUN_Y = 54;

// Rain drop starts inside the window glass; the group slides down and repeats,
// clipped so nothing falls into the room. Three bands 32 apart, which is the
// slide distance, so the panes stay evenly wet through the loop.
const RAIN = [[44, 32], [68, 38], [90, 32], [52, 64], [76, 70], [98, 64], [60, 96], [84, 102], [100, 94]];

// Salt left on the soil surface when the ground turns salty.
const SALT = [[184, 155], [195, 153], [206, 156], [216, 153], [226, 155], [190, 157], [220, 157]];

// Stars in the night sky behind the moon, inside the glass.
const NIGHT_STARS = [[70, 42], [88, 58], [62, 74], [94, 96], [44, 104], [78, 112]];

const LANES = {
  // Straight up the stem, which plant-*.png draws at x 205 from the soil to y 68.
  sap: ['M 205 154 L 205 70'],
  // Carbon dioxide arriving at the two right-hand leaf tips.
  co2: ['M 330 74 L 236 90', 'M 330 142 L 236 128'],
  // Oxygen leaving the leaves into the room.
  oxygen: ['M 192 72 L 150 8', 'M 222 62 L 262 4'],
  // Glucose carried from the leaves down the stem to the roots.
  glucose: ['M 194 96 L 203 116 L 203 160'],
};

function Flow({ id, lanes, count, color, duration, radius, animate, sprite = null }) {
  if (count <= 0) return null;
  return (
    <g aria-hidden="true">
      {lanes.map((d, laneIndex) => (
        <g key={`${id}-${laneIndex}`}>
          <path d={d} fill="none" stroke={color} strokeWidth="1.1" strokeDasharray="3 5" opacity="0.3" />
          {animate
            && Array.from({ length: count }, (_, i) => (
              sprite ? (
                <image key={i} href={sprite} x={-radius} y={-radius} width={radius * 2} height={radius * 2} opacity="0.9">
                  <animateMotion
                    path={d}
                    dur={`${duration}s`}
                    begin={`${-(i * duration) / count}s`}
                    repeatCount="indefinite"
                  />
                </image>
              ) : (
                <circle key={i} r={radius} fill={color} opacity="0.85">
                  <animateMotion
                    path={d}
                    dur={`${duration}s`}
                    begin={`${-(i * duration) / count}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )
            ))}
        </g>
      ))}
    </g>
  );
}

export function PlantView({
  // All 0–100, straight off the sliders.
  light = 50,
  water = 50,
  co2 = 50,
  // 0–100 simulation readings.
  soil = 60,
  health = 100,
  turgor = 70,
  // 0–1 photosynthesis rate. Null hides the glucose and oxygen outputs, which
  // only level 2 asks for.
  rate = null,
  // 'drought' | 'salty' | null — level 2's surroundings, drawn on the scene.
  weather = null,
  // Level 3's clues, each drawn into the room: curtains closed over the
  // window, night outside it, or a plastic bag tied over the plant.
  curtain = false,
  night = false,
  bag = false,
  reducedMotion = false,
  particleBudget = 2,
  title = 'The whole plant by the window',
}) {
  const lightF = clamp01(light / 100);
  const waterF = clamp01(water / 100);
  const co2F = clamp01(co2 / 100);

  // A plant droops when it is short of water pressure or short of food.
  const vigour = clamp01(Math.min(turgor / 70, health / 70));
  const droop = 1 - vigour;

  const sky = night ? '#1f2a44' : mix('#8ea8bd', '#bfe3f7', lightF);
  const sunR = 8 + lightF * 6;

  const animate = !reducedMotion;
  const count = (amount) => Math.min(particleBudget, Math.round(amount * particleBudget));
  // Five sprite stages, upright to fully wilted. Blending them across a whole
  // stage each way left two half-transparent sprites on screen nearly always,
  // so the window showed straight through the plant. Instead a sprite holds
  // solid and only dissolves inside a short eased band at the boundary.
  const FADE_BAND = 0.3;
  const plantStage = droop * 4;
  const stageIndex = Math.min(3, Math.floor(plantStage));
  const fade = clamp01((plantStage - stageIndex - (1 - FADE_BAND)) / FADE_BAND);
  const blend = fade * fade * (3 - 2 * fade);
  const plantWeight = (index) => (
    index === stageIndex ? 1 - blend : index === stageIndex + 1 ? blend : 0
  );

  const weatherWord = weather === 'rain' ? ' It is raining.'
    : weather === 'drought' ? ' The soil is cracked and dry.'
      : weather === 'salty' ? ' There is salt on the soil.' : '';
  const clueWords = `${curtain ? ' The curtains are closed.' : ''}${night ? ' It is night outside.' : ''}`
    + `${bag ? ' A plastic bag is tied over the plant.' : ''}`;

  const label = `${title}.${weatherWord}${clueWords} Sunlight ${Math.round(light)} percent, water ${Math.round(water)} percent, `
    + `carbon dioxide ${Math.round(co2)} percent. The plant looks ${droop > 0.55 ? 'wilted' : droop > 0.25 ? 'slightly limp' : 'firm and upright'}.`;

  return (
    <svg
      className="pc-cell pc-plant"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={label}
      // Bottom-anchored like the room art behind it, so the pot stays on the floor.
      preserveAspectRatio="xMidYMax meet"
    >
      <title>{label}</title>

      <defs>
        <clipPath id="pc-plant-glass">
          <rect x={GLASS.x} y={GLASS.y} width={GLASS.w} height={GLASS.h} />
        </clipPath>
        <clipPath id="pc-pot-front-rim">
          <rect x="165" y="154" width="80" height="10" />
        </clipPath>
      </defs>

      <g>

      {/* Window — the light source the sunlight slider controls. */}
      <g>
        <rect x={GLASS.x} y={GLASS.y} width={GLASS.w} height={GLASS.h} fill={sky} />
        {night ? (
          <g aria-hidden="true">
            {/* A crescent: the moon with a sky-coloured disc bitten out of it. */}
            <circle cx={SUN_X} cy={SUN_Y} r="9" fill="#f3ecd2" />
            <circle cx={SUN_X + 4} cy={SUN_Y - 3} r="8" fill={sky} />
            {NIGHT_STARS.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" fill="#f3ecd2" />)}
          </g>
        ) : (
          <image
            href="/games/plant-cell/art/sun.png"
            x={SUN_X - sunR * 1.1} y={SUN_Y - sunR * 1.1}
            width={sunR * 2.2} height={sunR * 2.2}
            opacity={0.25 + lightF * 0.75}
          />
        )}
        {weather === 'rain' && (
          <g clipPath="url(#pc-plant-glass)" aria-hidden="true">
            <g>
              {RAIN.map(([x, y]) => (
                <path key={`${x}-${y}`} d={`M ${x} ${y} l -5 13`} stroke="#5aa9e6" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
              ))}
              {animate && (
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0 0"
                  to="-12 32"
                  dur="0.85s"
                  repeatCount="indefinite"
                />
              )}
            </g>
          </g>
        )}
        <image
          href="/games/plant-cell/art/window.png"
          x="16" y="16" width="104" height="122"
          preserveAspectRatio="none"
        />
        {curtain && (
          <g aria-hidden="true">
            <rect x="18" y="18" width="100" height="3" rx="1.5" fill="#6b4a2b" />
            <path d="M 22 20 L 68 20 L 68 134 C 56 136 34 136 22 134 Z" fill="#b5523b" />
            <path d="M 68 20 L 114 20 L 114 134 C 102 136 80 136 68 134 Z" fill="#a8472f" />
            <g stroke="#8a3524" strokeWidth="1" opacity="0.6">
              <path d="M 34 22 L 33 133 M 46 22 L 46 134 M 58 22 L 59 133" />
              <path d="M 80 22 L 79 133 M 92 22 L 92 134 M 104 22 L 105 133" />
            </g>
          </g>
        )}
      </g>

      {/* The beam itself — brightness is the sunlight reading. sunbeam.png is a
          wedge with its apex in its own top-left corner, so the box is pinned to
          the sun and the light spreads from the pane onto the plant. The wide box
          flattens the wedge and the rotation tips it up, so the shaft crosses the
          leaves instead of pooling on the floor beside the pot. */}
      <g transform={`rotate(-14 ${SUN_X} ${SUN_Y})`} aria-hidden="true">
        <image
          href="/games/plant-cell/art/sunbeam.png"
          x={SUN_X - 2} y={SUN_Y - 2} width="300" height="150"
          preserveAspectRatio="none"
          opacity={0.15 + lightF * 0.7}
        />
      </g>

      {/* One coherent plant sprite keeps the botanical proportions intact. */}
      <g className="pc-plant__whole" transform={`translate(0 ${(droop * 2).toFixed(2)})`}>
        <image
          href="/games/plant-cell/art/plant-healthy.png"
          x="160" y="25" width="88" height="132"
          preserveAspectRatio="xMidYMax meet"
          opacity={plantWeight(0)}
        />
        <image
          href="/games/plant-cell/art/plant-slightly-thirsty.png"
          x="160" y="25" width="88" height="132"
          preserveAspectRatio="xMidYMax meet"
          opacity={plantWeight(1)}
        />
        <image
          href="/games/plant-cell/art/plant-stressed.png"
          x="160" y="25" width="88" height="132"
          preserveAspectRatio="xMidYMax meet"
          opacity={plantWeight(2)}
        />
        <image
          href="/games/plant-cell/art/plant-severely-wilted.png"
          x="160" y="25" width="88" height="132"
          preserveAspectRatio="xMidYMax meet"
          opacity={plantWeight(3)}
        />
        <image
          href="/games/plant-cell/art/plant-wilted.png"
          x="160" y="25" width="88" height="132"
          preserveAspectRatio="xMidYMax meet"
          opacity={plantWeight(4)}
        />
      </g>

      {/* Pot and soil. Wet soil is darker — that is the water reading. */}
      <g>
        <image
          href="/games/plant-cell/art/pot.png"
          x="165" y="143" width="80" height="60"
          preserveAspectRatio="none"
        />
        <image
          href="/games/plant-cell/art/soil-dry.png"
          x="175" y="144.5" width="60" height="18"
          preserveAspectRatio="none"
          opacity={1 - clamp01(soil / 100)}
        />
        <image
          href="/games/plant-cell/art/soil-wet.png"
          x="175" y="144.5" width="60" height="18"
          preserveAspectRatio="none"
          opacity={clamp01(soil / 100)}
        />
        {/* Continue the stem into the soil, then redraw the front lip over it.
            That overlap makes the plant read as planted inside the pot. */}
        <path
          d="M 205 137 C 205 144 205 151 205 159"
          fill="none"
          stroke="#398f3e"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <image
          href="/games/plant-cell/art/pot.png"
          x="165" y="143" width="80" height="60"
          preserveAspectRatio="none"
          clipPath="url(#pc-pot-front-rim)"
        />
        {weather === 'drought' && (
          <g stroke="#8a6a3f" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" aria-hidden="true">
            <path d="M 188 152 L 190 157 M 205 152 L 203 157 M 221 152 L 224 157" />
          </g>
        )}
        {weather === 'salty' && (
          <g fill="#ffffff" opacity="0.85" aria-hidden="true">
            {SALT.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.1" />)}
          </g>
        )}
      </g>

      </g>

      {bag && (
        <g aria-hidden="true">
          <path
            d="M 166 150 C 146 104 152 24 205 18 C 258 24 264 104 244 150 Z"
            fill="#dcebf5"
            fillOpacity="0.3"
            stroke="#8ca0af"
            strokeWidth="1.4"
          />
          <path d="M 176 120 C 168 92 172 52 190 36" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          {/* The tie, cinched round the pot rim. */}
          <path d="M 166 150 C 186 156 224 156 244 150" fill="none" stroke="#8ca0af" strokeWidth="2.4" />
          <path d="M 205 154 l -5 7 M 205 154 l 5 7" stroke="#8ca0af" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}

      <Flow
        id="sap"
        lanes={LANES.sap}
        count={count(waterF * clamp01(soil / 25))}
        color="#5aa9e6"
        duration={2.4}
        radius={15}
        animate={animate}
        sprite="/games/plant-cell/art/particle-water.png"
      />
      <Flow
        id="co2" lanes={LANES.co2} count={count(co2F)} color="#9aa0a6"
        duration={2.6} radius={9} animate={animate}
        sprite="/games/plant-cell/art/particle-co2.png"
      />
      {/* Even a slow rate keeps one particle moving, so "slower" never looks like "stopped". */}
      {rate !== null && (
        <>
          <Flow
            id="oxygen" lanes={LANES.oxygen} count={rate > 0 ? Math.max(1, count(rate)) : 0} color="#1d8580"
            duration={2.8} radius={8} animate={animate}
            sprite="/games/plant-cell/art/particle-oxygen.png"
          />
          <Flow
            id="glucose" lanes={LANES.glucose} count={rate > 0 ? Math.max(1, count(rate)) : 0} color="#d76d2e"
            duration={2.6} radius={8} animate={animate}
            sprite="/games/plant-cell/art/particle-glucose.png"
          />
        </>
      )}
    </svg>
  );
}
