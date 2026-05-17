const MONO = '"Courier New", Courier, monospace';

const TOWER_ACCENTS = {
  lysosome:     '#FF6B35',
  proteinKinase:'#1A6EFF',
  repairEnzyme: '#2ECC71',
};

// ── Wood-grain bark texture ──────────────────────────────────────────────────
// Approximated in CSS with layered gradients + SVG data-URI streaks.
// Matches the game.js drawShopPanel() aesthetic.
const BARK_BACKGROUND = `
  linear-gradient(
    175deg,
    rgba(30,45,30,0.7) 0%,
    rgba(10,20,10,0.4) 40%,
    rgba(25,38,20,0.6) 70%,
    rgba(15,25,15,0.5) 100%
  ),
  linear-gradient(
    to right,
    #0F2010 0%,
    #1A2E1A 50%,
    #142519 100%
  )
`.trim();

// ── Tower icon SVGs (faithful to handoff character art) ─────────────────────

function LysosomeIcon() {
  // Orange blob with two white eyes + smile curve
  return (
    <svg viewBox="0 0 60 60" width="52" height="52" aria-hidden="true">
      <defs>
        <radialGradient id="lys-g" cx="35%" cy="35%" r="60%">
          <stop offset="0%"  stopColor="#FF8A55" />
          <stop offset="55%" stopColor="#E84C1E" />
          <stop offset="100%" stopColor="#8B1A00" />
        </radialGradient>
        <filter id="lys-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Outer glow ring */}
      <circle cx="30" cy="30" r="28" fill="rgba(255,107,53,0.18)" />
      {/* Body blob (bumpy approximated with path) */}
      <path
        d="M30 8 C42 6 52 14 54 25 C57 37 50 50 38 54 C26 57 14 52 9 40 C4 28 10 14 20 9 C23 8 27 8.5 30 8Z"
        fill="url(#lys-g)"
        filter="url(#lys-glow)"
      />
      {/* Inner membrane ring */}
      <circle cx="30" cy="30" r="22" fill="none" stroke="rgba(255,180,120,0.25)" strokeWidth="1.5" />
      {/* Highlight ellipse */}
      <ellipse cx="22" cy="20" rx="9" ry="5" fill="rgba(255,230,200,0.4)" transform="rotate(-20 22 20)" />
      {/* Left eye */}
      <circle cx="22" cy="27" r="8" fill="#F0E8D0" />
      <circle cx="22" cy="27" r="5" fill="#2B1200" />
      <circle cx="24" cy="25" r="2" fill="white" />
      {/* Right eye */}
      <circle cx="38" cy="27" r="8" fill="#F0E8D0" />
      <circle cx="38" cy="27" r="5" fill="#2B1200" />
      <circle cx="40" cy="25" r="2" fill="white" />
      {/* Smile */}
      <path d="M22 38 Q30 45 38 38" stroke="#5C2200" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ProteinKinaseIcon() {
  return (
    <svg viewBox="0 0 60 60" width="52" height="52" aria-hidden="true">
      <defs>
        <radialGradient id="pk-g" cx="30%" cy="30%" r="70%">
          <stop offset="0%"  stopColor="#4A90FF" />
          <stop offset="55%" stopColor="#1A4FCC" />
          <stop offset="100%" stopColor="#091A6E" />
        </radialGradient>
        <filter id="pk-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Glow */}
      <circle cx="26" cy="30" r="28" fill="rgba(26,110,255,0.18)" />
      {/* Big lobe */}
      <ellipse cx="24" cy="30" rx="22" ry="21" fill="url(#pk-g)" filter="url(#pk-glow)" />
      {/* Small lobe (kinase domain) */}
      <ellipse cx="48" cy="22" rx="13" ry="12" fill="url(#pk-g)" />
      {/* Inner ring */}
      <ellipse cx="24" cy="30" rx="18" ry="17" fill="none" stroke="rgba(120,180,255,0.22)" strokeWidth="1.5" />
      {/* Left eye */}
      <circle cx="18" cy="27" r="7" fill="#E8F0FF" />
      <circle cx="18" cy="27" r="4" fill="#0033CC" />
      <circle cx="19" cy="27" r="2" fill="#000820" />
      <circle cx="21" cy="25" r="2" fill="white" />
      {/* Right eye */}
      <circle cx="30" cy="27" r="7" fill="#E8F0FF" />
      <circle cx="30" cy="27" r="4" fill="#0033CC" />
      <circle cx="31" cy="27" r="2" fill="#000820" />
      <circle cx="33" cy="25" r="2" fill="white" />
      {/* Flat determined mouth */}
      <line x1="16" y1="36" x2="32" y2="36" stroke="#002299" strokeWidth="2.5" strokeLinecap="round" />
      {/* ~P badge on small lobe */}
      <circle cx="48" cy="22" r="8" fill="none" stroke="#FFD700" strokeWidth="1.5" />
      <text x="48" y="26" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#FFD700" fontFamily={MONO}>~P</text>
    </svg>
  );
}

function RepairEnzymeIcon() {
  return (
    <svg viewBox="0 0 60 60" width="52" height="52" aria-hidden="true">
      <defs>
        <radialGradient id="re-g" cx="30%" cy="30%" r="70%">
          <stop offset="0%"  stopColor="#3FDB7E" />
          <stop offset="55%" stopColor="#1A8A4A" />
          <stop offset="100%" stopColor="#0A3D22" />
        </radialGradient>
        <filter id="re-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Glow */}
      <circle cx="22" cy="30" r="28" fill="rgba(46,204,113,0.18)" />
      {/* C-clamp body — arc opening to the right */}
      <path
        d="M22 8 C8 8 2 18 2 30 C2 42 8 52 22 52 L22 44 C13 44 10 38 10 30 C10 22 13 16 22 16 Z"
        fill="url(#re-g)"
        filter="url(#re-glow)"
      />
      {/* Outer membrane highlight */}
      <path
        d="M22 10 C10 10 4 19 4 30 C4 41 10 50 22 50"
        fill="none" stroke="rgba(80,200,120,0.28)" strokeWidth="1.5"
      />
      {/* DNA scrolling through channel */}
      <circle cx="28" cy="24" r="2.5" fill="#FF99AA" />
      <circle cx="35" cy="28" r="2.5" fill="#99AAFF" />
      <circle cx="42" cy="24" r="2.5" fill="#FF99AA" />
      <circle cx="49" cy="28" r="2.5" fill="#99AAFF" />
      {/* Cross-link */}
      <line x1="35" y1="22" x2="35" y2="34" stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="2 2" />
      {/* Eyes on the left body */}
      <circle cx="12" cy="24" r="6" fill="#F5FFF8" />
      <circle cx="12" cy="24" r="3.5" fill="#0A5C36" />
      <circle cx="12" cy="24" r="1.8" fill="#001A0A" />
      <circle cx="14" cy="22" r="1.8" fill="white" />
      <circle cx="20" cy="24" r="6" fill="#F5FFF8" />
      <circle cx="20" cy="24" r="3.5" fill="#0A5C36" />
      <circle cx="20" cy="24" r="1.8" fill="#001A0A" />
      <circle cx="22" cy="22" r="1.8" fill="white" />
      {/* Medical cross */}
      <rect x="13" y="36" width="10" height="3" rx="1" fill="#AAFFCC" />
      <rect x="16" y="33" width="3" height="9" rx="1" fill="#AAFFCC" />
    </svg>
  );
}

const ICON_COMPONENTS = {
  lysosome:      LysosomeIcon,
  proteinKinase: ProteinKinaseIcon,
  repairEnzyme:  RepairEnzymeIcon,
};

// ── Component ────────────────────────────────────────────────────────────────

export function TowerPanel({ towers, selectedTower, onSelect, atp }) {
  return (
    <aside
      aria-label="Tower selection panel"
      style={{
        width: 160,
        height: '100%',
        background: BARK_BACKGROUND,
        borderRight: '1px solid rgba(59,175,169,0.20)',
        // Right-edge bevel + inner glow (from handoff)
        boxShadow: 'inset -6px 0 12px rgba(0,0,0,0.55), inset -1px 0 0 rgba(80,160,90,0.18)',
        padding: '0 8px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flexShrink: 0,
        overflowY: 'auto',
        fontFamily: MONO,
        position: 'relative',
      }}
    >
      {/* ── Header ────────────────────────────────────────────── */}
      <div
        style={{
          color: '#9BD49F',
          fontSize: 14,
          fontWeight: 700,
          textAlign: 'center',
          padding: '14px 0 10px',
          letterSpacing: '0.04em',
        }}
      >
        ▼ DEFENDERS ▼
      </div>

      {/* ── Tower cards ───────────────────────────────────────── */}
      {Object.values(towers).map((tower) => {
        const accent    = TOWER_ACCENTS[tower.id] ?? '#3BAFA9';
        const canAfford = atp >= tower.cost;
        const isSelected = selectedTower === tower.id;
        const IconComp  = ICON_COMPONENTS[tower.id];

        return (
          <button
            key={tower.id}
            onClick={() => canAfford && onSelect(tower.id)}
            disabled={!canAfford}
            aria-label={`${tower.displayName}, costs ${tower.cost} ATP${!canAfford ? ', insufficient ATP' : ''}`}
            aria-pressed={isSelected}
            style={{
              borderRadius: 10,
              // Hand-painted card background (from handoff gradient)
              background: `linear-gradient(to bottom, #1F3520, #0F1F10)`,
              border: `2.5px solid ${accent}`,
              padding: '8px 6px',
              cursor: canAfford ? 'pointer' : 'not-allowed',
              opacity: canAfford ? 1 : 0.45,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              textAlign: 'center',
              // Glowing border matching handoff
              boxShadow: isSelected
                ? `0 0 14px 3px ${accent}88, 0 0 0 1px ${accent}44 inset`
                : `0 0 14px 2px ${accent}55`,
              transition: 'box-shadow 0.2s, opacity 0.2s',
              position: 'relative',
              width: '100%',
            }}
          >
            {/* Inner painted line (matches handoff's inner border) */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 5,
                borderRadius: 6,
                border: `1px solid ${accent}44`,
                pointerEvents: 'none',
              }}
            />

            {/* Tower icon */}
            <div
              aria-hidden="true"
              style={{
                position: 'relative',
                marginTop: 6,
                // Pedestal shadow (from handoff)
                filter: `drop-shadow(0 3px 6px rgba(0,0,0,0.5))`,
              }}
            >
              {/* Pedestal circle */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 48,
                  height: 10,
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.4)',
                  filter: 'blur(2px)',
                }}
              />
              {IconComp ? (
                <IconComp accent={accent} />
              ) : (
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 38% 35%, ${accent}cc, ${accent}55)`,
                    boxShadow: `0 0 12px ${accent}55`,
                  }}
                />
              )}
            </div>

            {/* Tower name */}
            <span
              style={{
                color: accent,
                fontWeight: 700,
                fontSize: 12,
                lineHeight: 1.2,
                marginTop: 4,
              }}
            >
              {tower.displayName.toUpperCase()}
            </span>

            {/* Cost */}
            <span style={{ color: '#FFD700', fontSize: 11, fontWeight: 700 }}>
              ⚡ {tower.cost} ATP
            </span>

            {/* Description */}
            <span
              style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: 9,
                lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {tower.description}
            </span>
          </button>
        );
      })}

      {/* Bottom hint */}
      <div
        style={{
          marginTop: 'auto',
          color: 'rgba(80,160,90,0.5)',
          fontSize: 9,
          textAlign: 'center',
          lineHeight: 1.5,
          paddingTop: 8,
          borderTop: '1px solid rgba(59,175,169,0.12)',
        }}
      >
        Select a tower then click a slot on the membrane
      </div>
    </aside>
  );
}
