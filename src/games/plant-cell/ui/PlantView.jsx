// The object view — the whole plant in a pot by a window, so the three sliders
// have a visible consequence outside the microscope: the beam brightens, water
// climbs the stem, the stomata open, and a starved plant droops.
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

const LANES = {
  // Straight up the stem, which plant-*.png draws at x 205 from the soil to y 68.
  sap: ['M 205 154 L 205 70'],
  // Carbon dioxide arriving at the two right-hand leaf tips through open stomata.
  co2: ['M 330 74 L 236 90', 'M 330 142 L 236 128'],
  // Water vapour leaving those same leaves.
  vapour: ['M 236 88 L 270 34', 'M 170 118 L 140 46'],
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
  // 'rain' | 'drought' | 'salty' | null — level 2's weather, drawn on the scene.
  weather = null,
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

  const sky = mix('#8ea8bd', '#bfe3f7', lightF);
  const sunR = 8 + lightF * 6;

  const animate = !reducedMotion;
  const count = (amount) => Math.min(particleBudget, Math.round(amount * particleBudget));
  // Open stomata and strong light are what drive water out of the leaf.
  const vapourRate = clamp01(co2F * 0.65 + lightF * 0.35);
  const stoma = co2 < 12
    ? { asset: 'stoma-shut.png', label: 'STOMA SHUT' }
    : co2 < 55
      ? { asset: 'stoma-part-open.png', label: 'PART OPEN' }
      : { asset: 'stoma-wide-open.png', label: 'WIDE OPEN' };
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

  const label = `${title}.${weatherWord} Sunlight ${Math.round(light)} percent, water uptake ${Math.round(water)} percent, `
    + `stomata ${Math.round(co2)} percent open. The plant looks ${droop > 0.55 ? 'wilted' : droop > 0.25 ? 'slightly limp' : 'firm and upright'}.`;

  return (
    <svg
      className="pc-cell pc-plant"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{label}</title>

      <defs>
        <clipPath id="pc-plant-glass">
          <rect x={GLASS.x} y={GLASS.y} width={GLASS.w} height={GLASS.h} />
        </clipPath>
        <marker id="pc-stoma-callout-arrow" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#3b7d49" />
        </marker>
      </defs>

      <g>

      <image
        href="/games/plant-cell/art/room-wall.png"
        x="0" y="0" width={VIEW_W} height={VIEW_H}
        preserveAspectRatio="none"
      />

      {/* Window — the light source the sunlight slider controls. */}
      <g>
        <rect x={GLASS.x} y={GLASS.y} width={GLASS.w} height={GLASS.h} fill={sky} />
        <image
          href="/games/plant-cell/art/sun.png"
          x={SUN_X - sunR * 1.1} y={SUN_Y - sunR * 1.1}
          width={sunR * 2.2} height={sunR * 2.2}
          opacity={0.25 + lightF * 0.75}
        />
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

      {/* A small leaf detail is magnified in the stoma close-up on the right. */}
      <g aria-hidden="true">
        <circle cx="229" cy="130" r="10" fill="#f8f2d9" opacity="0.75" />
        <circle cx="229" cy="130" r="7" fill="none" stroke="#3b7d49" strokeWidth="1.5" />
        <path
          d="M 236 136 C 242 141 246 147 251 152"
          fill="none"
          stroke="#3b7d49"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="3 2"
          markerEnd="url(#pc-stoma-callout-arrow)"
        />
        <path d="M 225 130 H 233 M 229 126 V 134" stroke="#3b7d49" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
      </g>

      </g>

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
      <Flow
        id="vapour" lanes={LANES.vapour} count={count(vapourRate)} color="#bcd7e8"
        duration={3} radius={6} animate={animate}
        sprite="/games/plant-cell/art/particle-vapour.png"
      />

      {/* Stomata close-up — the mouth on the underside of a leaf. */}
      <g>
        <image
          href={`/games/plant-cell/art/${stoma.asset}`}
          x="252" y="140" width="52" height="52"
          preserveAspectRatio="xMidYMid meet"
        />
        <rect x="254" y="194" width="48" height="13" rx="6.5" fill="#fbf5e7" opacity="0.9" />
        <text x="278" y="203" textAnchor="middle" fontSize="7.2" fontWeight="700" fill="#4a4231">
          {stoma.label}
        </text>
      </g>
    </svg>
  );
}
