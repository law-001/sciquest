/* ============================================================
   Mystery Lab — Illustrated world art
   ============================================================ */
import React from "react";

function Cloud({ style }) {
  return (
    <svg width="80" height="40" viewBox="0 0 80 40" style={{ position: "absolute", ...style }}>
      <ellipse cx="20" cy="26" rx="18" ry="10" fill="#fffdf5" />
      <ellipse cx="40" cy="20" rx="22" ry="14" fill="#fffdf5" />
      <ellipse cx="60" cy="26" rx="16" ry="10" fill="#fffdf5" />
    </svg>
  );
}

/* ---------- Healthy / sick pond ---------- */
function Pond({ sick = false, size = 240, label, dead = 0, hideFish = false }) {
  const w = size;
  const h = size * 0.78;
  return (
    <svg width={w} height={h} viewBox="0 0 240 188" fill="none" style={{ display: "block" }}>
      <defs>
        {/* Healthy pond gradients */}
        <radialGradient id="pondHealth" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0%"  stopColor="#7dd3fc" />
          <stop offset="55%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0e7490" />
        </radialGradient>
        <linearGradient id="bankH" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#a3d977" />
          <stop offset="100%" stopColor="#65a30d" />
        </linearGradient>
        <linearGradient id="bankS" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#a87c4d" />
          <stop offset="100%" stopColor="#5b4530" />
        </linearGradient>
        {/* Sick pond gradients */}
        <radialGradient id="pondSick" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#7a6238" />
          <stop offset="50%" stopColor="#4a3a22" />
          <stop offset="100%" stopColor="#1f1810" />
        </radialGradient>
        <pattern id="oily" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(15)">
          <ellipse cx="10" cy="10" rx="8" ry="3" fill="#7c5a30" opacity="0.4" />
          <ellipse cx="28" cy="22" rx="6" ry="2" fill="#3d2e22" opacity="0.5" />
          <ellipse cx="14" cy="30" rx="5" ry="2" fill="#5b4530" opacity="0.3" />
        </pattern>
        <filter id="pondShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* Outer grass/mud bank */}
      <ellipse cx="120" cy="92" rx="112" ry="70" fill={sick ? "url(#bankS)" : "url(#bankH)"} />
      <ellipse cx="120" cy="90" rx="106" ry="64" fill={sick ? "#7c5a30" : "#84cc16"} />
      {/* dirt edge */}
      <ellipse cx="120" cy="92" rx="98" ry="58" fill={sick ? "#5b4530" : "#65a30d"} opacity="0.6" />

      {/* Bank decoration — grass blades or mud cracks */}
      {!sick && (
        <g>
          {[[40,52],[70,42],[170,40],[200,52],[28,120],[214,130]].map(([cx,cy], i) => (
            <g key={i} transform={`translate(${cx} ${cy})`}>
              <path d="M0 0 Q-2 -8 0 -14 Q2 -8 0 0" fill="#4d7c0f" />
              <path d="M-4 0 Q-5 -6 -3 -11 Q-2 -6 -4 0" fill="#65a30d" />
              <path d="M4 0 Q5 -6 3 -11 Q2 -6 4 0" fill="#65a30d" />
            </g>
          ))}
        </g>
      )}
      {sick && (
        <g opacity="0.5">
          {[[42,58],[200,60],[36,124],[210,128]].map(([cx,cy], i) => (
            <g key={i}>
              <path d={`M${cx} ${cy} l4 -2 l-2 4`} stroke="#3d2e22" strokeWidth="1.5" fill="none" />
              <path d={`M${cx-6} ${cy+4} l3 -2 l-1 3`} stroke="#3d2e22" strokeWidth="1" fill="none" />
            </g>
          ))}
        </g>
      )}

      {/* Pond stones around rim */}
      <g>
        {[[36,76],[60,52],[180,50],[208,80],[210,114],[180,138],[60,138],[34,114]].map(([cx,cy], i) => (
          <g key={i}>
            <ellipse cx={cx} cy={cy+4} rx="9" ry="3" fill="rgba(0,0,0,0.25)" />
            <ellipse cx={cx} cy={cy} rx="9" ry="6" fill="#a89579" />
            <ellipse cx={cx-2} cy={cy-2} rx="5" ry="3" fill="#d4c5a8" opacity="0.7" />
          </g>
        ))}
      </g>

      {/* Water */}
      <ellipse cx="120" cy="94" rx="86" ry="48" fill={sick ? "url(#pondSick)" : "url(#pondHealth)"} />
      {sick && <ellipse cx="120" cy="94" rx="86" ry="48" fill="url(#oily)" />}

      {/* Water highlights (clean ripples or sickly sheen) */}
      {!sick ? (
        <g>
          <path d="M70 76 Q100 70 130 76" stroke="rgba(255,255,255,0.55)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M88 84 Q110 80 134 84" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M132 108 Q156 104 174 108" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <ellipse cx="156" cy="118" rx="6" ry="1.2" fill="rgba(255,255,255,0.55)" />
        </g>
      ) : (
        <g>
          {/* algae blooms */}
          <circle cx="78" cy="86" r="9" fill="#4a6a2f" opacity="0.45" />
          <circle cx="86" cy="92" r="6" fill="#3d4f24" opacity="0.5" />
          <circle cx="162" cy="100" r="10" fill="#4a6a2f" opacity="0.4" />
          <circle cx="170" cy="106" r="6" fill="#3d4f24" opacity="0.5" />
          {/* bubble cluster */}
          <circle cx="100" cy="120" r="2" fill="rgba(200,180,140,0.6)" />
          <circle cx="106" cy="124" r="1.4" fill="rgba(200,180,140,0.5)" />
          <circle cx="112" cy="119" r="2.2" fill="rgba(200,180,140,0.6)" />
        </g>
      )}

      {/* Aquatic life — lily pads on healthy pond, debris on sick */}
      {!sick && (
        <g>
          {/* Lily pads */}
          <g transform="translate(64 88)">
            <ellipse cx="0" cy="2" rx="14" ry="3" fill="rgba(0,0,0,0.2)" />
            <path d="M-14 0 A14 12 0 1 1 13 0 L 8 -2 A1 1 0 0 0 6 -2 Z" fill="#16a34a" />
            <ellipse cx="-3" cy="-3" rx="6" ry="3" fill="#22c55e" opacity="0.7" />
            <circle cx="2" cy="-2" r="2.5" fill="#fff7ed" />
            <circle cx="2" cy="-2" r="1.5" fill="#fde047" />
          </g>
          <g transform="translate(174 80)">
            <ellipse cx="0" cy="2" rx="11" ry="3" fill="rgba(0,0,0,0.2)" />
            <path d="M-10 0 A10 9 0 1 1 9 0 L 5 -2 A1 1 0 0 0 3 -2 Z" fill="#15803d" />
            <ellipse cx="-2" cy="-2" rx="4" ry="2" fill="#22c55e" opacity="0.6" />
          </g>
          {/* small reed */}
          <g transform="translate(196 96)">
            <line x1="0" y1="0" x2="-2" y2="-14" stroke="#65a30d" strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="-3" cy="-15" rx="1.4" ry="3.5" fill="#7c2d12" />
          </g>
        </g>
      )}
      {sick && (
        <g>
          {/* floating debris */}
          <g transform="translate(72 78) rotate(-20)">
            <rect x="-8" y="-1" width="16" height="2" fill="#3d2e22" />
            <circle cx="-6" cy="0" r="1" fill="#5b4530" />
          </g>
          <g transform="translate(180 92) rotate(30)">
            <rect x="-5" y="-1" width="10" height="2" fill="#3d2e22" />
          </g>
          {/* trash */}
          <g transform="translate(146 76)">
            <rect x="-2" y="-3" width="4" height="2" fill="#5b4530" />
          </g>
        </g>
      )}

      {/* Fish — suppressed when hideFish=true so caller can render interactive fish */}
      {!hideFish && !sick && (
        <g>
          <Fishie x={108} y={96} rot={-6} color="#f97316" stroke="#c2410c" />
          <Fishie x={146} y={108} rot={12} color="#fb923c" stroke="#c2410c" size={0.85} />
          <Fishie x={132} y={82}  rot={-18} color="#f59e0b" stroke="#92400e" size={0.7} />
        </g>
      )}
      {!hideFish && sick && Array.from({ length: dead || 4 }).map((_, i) => {
        const positions = [[80, 86], [104, 110], [142, 92], [162, 116], [124, 78]];
        const [x, y] = positions[i % positions.length];
        return <DeadFish key={i} x={x + (i * 4 % 12) - 6} y={y + (i % 2 ? 2 : -2)} rot={i * 47 - 30} />;
      })}

      {/* Label sign */}
      {label && (
        <g transform="translate(98 152)">
          {/* stake */}
          <rect x="20" y="22" width="3" height="14" fill="#5b4530" rx="1" />
          {/* sign */}
          <rect x="-6" y="0" width="56" height="22" rx="4" fill="#fdf6e3" stroke="#1c1410" strokeWidth="2" />
          <rect x="-6" y="0" width="56" height="6" rx="4" fill={sick ? "#dc2626" : "#14b8a6"} />
          <text x="22" y="17" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="13" fill="#1c1410">
            POND {label}
          </text>
          {/* warning/check on sign */}
          <circle cx="46" cy="14" r="3" fill={sick ? "#dc2626" : "#14b8a6"} />
        </g>
      )}
    </svg>
  );
}

function Fishie({ x, y, rot = 0, color = "#f97316", stroke = "#c2410c", size = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${size})`}>
      <ellipse cx="0" cy="2" rx="10" ry="2" fill="rgba(0,0,0,0.3)" />
      <ellipse cx="0" cy="0" rx="11" ry="5" fill={color} />
      <ellipse cx="0" cy="-1.5" rx="11" ry="2.5" fill="#fff7ed" opacity="0.35" />
      <path d="M-10 0 L-16 -5 L-16 5 Z" fill={color} />
      <path d="M-10 0 L-14 -3 L-14 3 Z" fill={stroke} opacity="0.5" />
      <circle cx="6" cy="-1" r="1.6" fill="white" />
      <circle cx="6.5" cy="-1" r="0.9" fill="#1c1410" />
      <path d="M-2 -3 L4 -4" stroke={stroke} strokeWidth="0.6" opacity="0.6" />
    </g>
  );
}

function DeadFish({ x, y, rot = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <ellipse cx="0" cy="2" rx="8" ry="1.5" fill="rgba(0,0,0,0.3)" />
      <ellipse cx="0" cy="0" rx="9" ry="3.5" fill="#cbb999" />
      <ellipse cx="0" cy="-1" rx="9" ry="1.5" fill="#e6d6b9" />
      <path d="M-9 0 L-13 -3 L-13 3 Z" fill="#cbb999" />
      <line x1="3" y1="-1.5" x2="5" y2="0.5" stroke="#1c1410" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="5" y1="-1.5" x2="3" y2="0.5" stroke="#1c1410" strokeWidth="1.1" strokeLinecap="round" />
    </g>
  );
}

/* ---------- Tree ---------- */
function Tree({ size = 60, variant = 0 }) {
  const palettes = [
    { trunk: "#5b3a1f", trunkH: "#7a5230", leafA: "#22c55e", leafB: "#15803d", leafHi: "#86efac" },
    { trunk: "#6b3a1a", trunkH: "#8b5230", leafA: "#4ade80", leafB: "#16a34a", leafHi: "#bbf7d0" },
    { trunk: "#3d2e22", trunkH: "#5b4530", leafA: "#16a34a", leafB: "#14532d", leafHi: "#86efac" },
  ];
  const p = palettes[variant % 3];
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 60 66" style={{ display: "block" }}>
      {/* shadow */}
      <ellipse cx="30" cy="62" rx="18" ry="3.5" fill="rgba(0,0,0,0.28)" />
      {/* trunk */}
      <path d="M25 60 Q24 48 26 36 L34 36 Q36 48 35 60 Z" fill={p.trunk} />
      <path d="M27 56 Q28 48 28 40" stroke={p.trunkH} strokeWidth="1.5" fill="none" />
      <path d="M33 56 Q32 48 32 40" stroke={p.trunkH} strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* foliage layers — back to front */}
      <circle cx="18" cy="28" r="13" fill={p.leafB} />
      <circle cx="42" cy="26" r="14" fill={p.leafB} />
      <circle cx="30" cy="18" r="14" fill={p.leafA} />
      <circle cx="22" cy="22" r="11" fill={p.leafA} />
      <circle cx="40" cy="22" r="11" fill={p.leafA} />
      {/* highlight */}
      <circle cx="27" cy="12" r="6" fill={p.leafHi} opacity="0.7" />
      <circle cx="22" cy="16" r="3" fill={p.leafHi} opacity="0.5" />
      {/* detail dots */}
      <circle cx="20" cy="30" r="1.2" fill={p.leafB} />
      <circle cx="44" cy="30" r="1.2" fill={p.leafB} />
      <circle cx="36" cy="24" r="1.2" fill={p.leafB} />
    </svg>
  );
}

/* ---------- Factory ---------- */
function Factory({ size = 220, smoking = true }) {
  return (
    <svg width={size} height={size * 0.95} viewBox="0 0 220 210" fill="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id="smokeG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(91,69,48,0.85)" />
          <stop offset="100%" stopColor="rgba(91,69,48,0)" />
        </linearGradient>
        <linearGradient id="bldgG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a5230" />
          <stop offset="100%" stopColor="#4a3520" />
        </linearGradient>
        <linearGradient id="roofG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d2e22" />
          <stop offset="100%" stopColor="#1c1410" />
        </linearGradient>
        <linearGradient id="winG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Smoke plumes */}
      {smoking && (
        <g>
          <circle cx="60" cy="38" r="22" fill="url(#smokeG)" />
          <circle cx="82" cy="20" r="18" fill="url(#smokeG)" />
          <circle cx="44" cy="20" r="14" fill="url(#smokeG)" />
          <circle cx="100" cy="32" r="12" fill="url(#smokeG)" opacity="0.5" />
        </g>
      )}

      {/* Ground shadow */}
      <ellipse cx="110" cy="195" rx="110" ry="9" fill="rgba(28,20,16,0.22)" />

      {/* Back small wing */}
      <rect x="156" y="120" width="44" height="78" fill="#3d2e22" />
      <rect x="156" y="118" width="44" height="6" fill="#1c1410" />
      <rect x="162" y="130" width="8" height="10" fill="#fbbf24" opacity="0.7" />
      <rect x="178" y="130" width="8" height="10" fill="#fbbf24" opacity="0.7" />
      <rect x="162" y="148" width="8" height="10" fill="#fbbf24" opacity="0.6" />
      <rect x="178" y="148" width="8" height="10" fill="#fbbf24" opacity="0.6" />

      {/* Main building */}
      <rect x="22" y="100" width="148" height="98" fill="url(#bldgG)" />
      {/* sawtooth roof */}
      <path d="M22 100 L46 78 L70 100 L94 78 L118 100 L142 78 L166 100 Z" fill="url(#roofG)" />
      <path d="M22 100 L46 78 L46 100 M70 100 L94 78 L94 100 M118 100 L142 78 L142 100"
            stroke="#1c1410" strokeWidth="0.5" />
      {/* roof skylights */}
      <path d="M46 78 L70 100 L46 100 Z M94 78 L118 100 L94 100 Z M142 78 L166 100 L142 100 Z" fill="#a89579" opacity="0.3" />

      {/* Main chimney */}
      <rect x="46" y="42" width="22" height="60" fill="#3d2e22" />
      <rect x="44" y="40" width="26" height="6" fill="#1c1410" />
      <rect x="46" y="58" width="22" height="3" fill="#fbbf24" opacity="0.6" />
      <rect x="46" y="78" width="22" height="3" fill="#fbbf24" opacity="0.4" />
      {/* red warning ring */}
      <rect x="44" y="46" width="26" height="4" fill="#dc2626" />

      {/* Window rows — glowing */}
      <g>
        {[120, 144, 168].map(y => (
          <g key={y}>
            {[36, 60, 84, 108, 132].map(x => (
              <g key={x}>
                <rect x={x} y={y} width="14" height="14" fill="url(#winG)" />
                <rect x={x} y={y} width="14" height="2" fill="#fef9c3" opacity="0.8" />
                <line x1={x+7} y1={y} x2={x+7} y2={y+14} stroke="#92400e" strokeWidth="0.6" />
                <line x1={x} y1={y+7} x2={x+14} y2={y+7} stroke="#92400e" strokeWidth="0.6" />
              </g>
            ))}
          </g>
        ))}
      </g>

      {/* Door */}
      <rect x="78" y="166" width="20" height="32" fill="#1c1410" />
      <rect x="78" y="166" width="20" height="4" fill="#dc2626" />
      <circle cx="93" cy="184" r="1.2" fill="#fde047" />

      {/* Logo plate */}
      <rect x="120" y="172" width="34" height="22" rx="3" fill="#1c1410" />
      <text x="137" y="187" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="13" fill="#f97316">F-2</text>

      {/* Drainage pipe */}
      <rect x="170" y="166" width="48" height="14" fill="#3d2e22" />
      <rect x="170" y="166" width="48" height="3" fill="#5b4530" />
      <ellipse cx="216" cy="173" rx="5" ry="7" fill="#1c1410" />
      {/* dripping waste */}
      <path d="M216 180 Q213 188 212 196 Q216 200 220 196 Q219 188 216 180 Z" fill="#7a6238" />
      <ellipse cx="216" cy="200" rx="8" ry="2" fill="#5b4530" opacity="0.7" />
      <circle cx="220" cy="186" r="1.4" fill="#a87c4d" />

      {/* Caution sign at base */}
      <g transform="translate(34 178)">
        <rect x="0" y="0" width="14" height="14" fill="#fde047" stroke="#1c1410" strokeWidth="1.5" />
        <text x="7" y="11" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="11" fill="#1c1410">!</text>
      </g>
    </svg>
  );
}

/* ---------- Lab Tent ---------- */
function LabTent({ size = 200 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id="tentG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="tentGdark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
      </defs>

      <ellipse cx="100" cy="186" rx="84" ry="8" fill="rgba(28,20,16,0.22)" />

      {/* Tent body — front */}
      <path d="M28 178 L100 36 L172 178 Z" fill="url(#tentG)" />
      {/* Shadow side */}
      <path d="M28 178 L100 36 L100 178 Z" fill="url(#tentGdark)" opacity="0.85" />

      {/* Diagonal stripes */}
      <path d="M60 116 L140 116 L132 132 L68 132 Z" fill="#fef08a" />
      <path d="M70 90 L130 90 L124 102 L76 102 Z" fill="#fef08a" />
      <path d="M50 142 L150 142 L144 156 L56 156 Z" fill="#fef08a" />

      {/* Subtle stripe shadows from front fold */}
      <path d="M60 116 L100 116 L100 132 L68 132 Z" fill="#facc15" opacity="0.6" />
      <path d="M70 90 L100 90 L100 102 L76 102 Z" fill="#facc15" opacity="0.5" />

      {/* Tent opening with rolled flap */}
      <path d="M82 178 L100 80 L118 178 Z" fill="#1c1410" />
      <path d="M82 178 L92 110 L100 178 Z" fill="#3d2e22" />
      {/* Inner glow showing equipment */}
      <ellipse cx="100" cy="155" rx="9" ry="14" fill="#14b8a6" opacity="0.35" />

      {/* Rolled flap fabric */}
      <path d="M82 178 Q70 168 78 158 L94 168 Z" fill="#c2410c" />
      <path d="M118 178 Q130 168 122 158 L106 168 Z" fill="#c2410c" />

      {/* Tent pole with flag */}
      <line x1="100" y1="36" x2="100" y2="14" stroke="#3d2e22" strokeWidth="2.5" />
      <circle cx="100" cy="14" r="2" fill="#1c1410" />
      <path d="M100 16 L122 22 L100 28 Z" fill="#14b8a6" />
      <path d="M100 16 L114 19 L100 22 Z" fill="#0f766e" />
      <text x="108" y="24" fontFamily="Nunito" fontWeight="900" fontSize="6" fill="#fdf6e3">LAB</text>

      {/* Tent rope/guy lines */}
      <line x1="28" y1="178" x2="14" y2="186" stroke="#1c1410" strokeWidth="1.2" />
      <line x1="172" y1="178" x2="186" y2="186" stroke="#1c1410" strokeWidth="1.2" />
      {/* Stakes */}
      <rect x="12" y="184" width="4" height="6" fill="#5b4530" />
      <rect x="184" y="184" width="4" height="6" fill="#5b4530" />

      {/* Equipment crate beside tent */}
      <g transform="translate(140 158)">
        <ellipse cx="14" cy="22" rx="16" ry="3" fill="rgba(28,20,16,0.3)" />
        <rect x="0" y="2" width="28" height="20" fill="#5b4530" stroke="#3d2e22" strokeWidth="1.5" />
        <rect x="0" y="2" width="28" height="6" fill="#7a5230" />
        <line x1="0" y1="12" x2="28" y2="12" stroke="#3d2e22" strokeWidth="0.8" />
        <line x1="14" y1="2" x2="14" y2="22" stroke="#3d2e22" strokeWidth="0.8" />
        {/* beaker peeking */}
        <rect x="3" y="-6" width="6" height="10" fill="#fdf6e3" stroke="#1c1410" strokeWidth="1" />
        <rect x="3.5" y="-2" width="5" height="6" fill="#14b8a6" />
        {/* test tube */}
        <rect x="14" y="-8" width="3.5" height="12" rx="1.5" fill="#fdf6e3" stroke="#1c1410" strokeWidth="0.8" />
        <rect x="14.5" y="-2" width="2.5" height="6" fill="#f97316" />
      </g>

      {/* Sign on stake */}
      <g transform="translate(40 152)">
        <rect x="4" y="14" width="2" height="14" fill="#5b4530" />
        <rect x="-12" y="0" width="34" height="16" rx="2" fill="#fdf6e3" stroke="#1c1410" strokeWidth="1.5" />
        <text x="5" y="11" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="9" fill="#1c1410">LAB</text>
      </g>

      {/* Hanging lantern */}
      <g transform="translate(74 60)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#3d2e22" strokeWidth="1" />
        <rect x="-4" y="6" width="8" height="10" fill="#fde047" stroke="#1c1410" strokeWidth="1" />
        <rect x="-3" y="7" width="6" height="2" fill="#fef9c3" />
      </g>
    </svg>
  );
}

/* ---------- Animated sky elements ---------- */
function Bird({ x = -100, y = 40, size = 20, duration = 10, delay = 0 }) {
  return (
    <svg
      width={size * 1.2} height={size * 0.6}
      viewBox="0 0 24 12"
      style={{
        position: "absolute", left: x, top: y, pointerEvents: "none",
        animation: `ml-fly-across ${duration}s ${delay}s linear infinite`,
        opacity: 0.65,
      }}
    >
      <path d="M1 7 Q6 2 12 6 Q18 2 23 7"
            stroke="#2a1f17" strokeWidth="1.5" fill="none"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AnimatedCloud({ x = -200, y = 40, scale = 1, duration = 24, delay = 0 }) {
  const w = Math.round(80 * scale);
  const h = Math.round(40 * scale);
  return (
    <div style={{
      position: "absolute", left: x, top: y, pointerEvents: "none",
      animation: `ml-cloud-drift ${duration}s ${delay}s linear infinite`,
    }}>
      <svg width={w} height={h} viewBox="0 0 80 40">
        <ellipse cx="20" cy="26" rx="18" ry="10" fill="rgba(255,253,245,0.88)" />
        <ellipse cx="40" cy="20" rx="22" ry="14" fill="rgba(255,253,245,0.88)" />
        <ellipse cx="60" cy="26" rx="16" ry="10" fill="rgba(255,253,245,0.88)" />
      </svg>
    </div>
  );
}

/* ---------- Decorative props ---------- */
function Rock({ x, y, size = 30 }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 30 21" style={{ position: "absolute", left: x, top: y }}>
      <ellipse cx="15" cy="18" rx="14" ry="3" fill="rgba(0,0,0,0.25)" />
      <path d="M2 14 Q6 4 14 4 Q22 4 28 14 Q22 16 14 16 Q6 16 2 14" fill="#a89579" stroke="#5b4530" strokeWidth="1.5" />
      <path d="M6 11 Q12 6 18 9" stroke="#d4c5a8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Bush({ x, y, size = 50, variant = 0 }) {
  const greens = [["#16a34a","#22c55e","#86efac"], ["#15803d","#16a34a","#4ade80"]][variant % 2];
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 50 35" style={{ position: "absolute", left: x, top: y }}>
      <ellipse cx="25" cy="33" rx="22" ry="3" fill="rgba(0,0,0,0.2)" />
      <circle cx="14" cy="22" r="10" fill={greens[1]} />
      <circle cx="36" cy="22" r="10" fill={greens[1]} />
      <circle cx="25" cy="14" r="11" fill={greens[0]} />
      <circle cx="20" cy="18" r="3" fill={greens[2]} opacity="0.7" />
      <circle cx="30" cy="16" r="2.5" fill={greens[2]} opacity="0.6" />
    </svg>
  );
}

function GrassPatch({ x, y, size = 36 }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 36 18" style={{ position: "absolute", left: x, top: y }}>
      <path d="M4 18 Q6 8 8 18 Z" fill="#65a30d" />
      <path d="M8 18 Q10 4 12 18 Z" fill="#4d7c0f" />
      <path d="M14 18 Q16 6 18 18 Z" fill="#65a30d" />
      <path d="M20 18 Q22 8 24 18 Z" fill="#4d7c0f" />
      <path d="M26 18 Q28 5 30 18 Z" fill="#65a30d" />
    </svg>
  );
}

function Signpost({ x, y, label = "?" }) {
  return (
    <svg width="46" height="64" viewBox="0 0 46 64" style={{ position: "absolute", left: x, top: y }}>
      <ellipse cx="23" cy="62" rx="10" ry="2" fill="rgba(0,0,0,0.3)" />
      <rect x="21" y="22" width="4" height="40" fill="#5b4530" />
      <path d="M2 8 L34 8 L42 16 L34 24 L2 24 Z" fill="#fdf6e3" stroke="#1c1410" strokeWidth="1.8" />
      <text x="18" y="20" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="11" fill="#1c1410">{label}</text>
    </svg>
  );
}

/* ---------- Reeds ---------- */
function Reed({ size = 50, x = 0, y = 0 }) {
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 30 45" style={{ position: "absolute", left: x, top: y }}>
      <line x1="10" y1="44" x2="14" y2="6"  stroke="#65a30d" strokeWidth="2"   strokeLinecap="round" />
      <line x1="20" y1="44" x2="18" y2="10" stroke="#65a30d" strokeWidth="2"   strokeLinecap="round" />
      <line x1="14" y1="44" x2="16" y2="14" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="14" cy="5"  rx="2" ry="6" fill="#7c2d12" />
      <ellipse cx="18" cy="9"  rx="2" ry="5" fill="#7c2d12" />
    </svg>
  );
}

/* ---------- Evidence-board icon (used elsewhere) ---------- */
function EvidenceBoardIcon({ size = 200 }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 200 160" fill="none">
      <ellipse cx="100" cy="150" rx="80" ry="6" fill="rgba(0,0,0,0.2)" />
      <line x1="40" y1="150" x2="60" y2="40"  stroke="#5b4530" strokeWidth="5" strokeLinecap="round" />
      <line x1="160" y1="150" x2="140" y2="40" stroke="#5b4530" strokeWidth="5" strokeLinecap="round" />
      <rect x="40" y="20" width="120" height="100" rx="4" fill="#7c5a30" stroke="#3d2e22" strokeWidth="3" />
      <rect x="44" y="24" width="112" height="92" rx="2" fill="#a6896c" />
      <rect x="54" y="36" width="28" height="22" fill="#fde047" transform="rotate(-4 68 47)" />
      <rect x="92" y="32" width="28" height="22" fill="#fdf6e3" transform="rotate(3 106 43)" />
      <rect x="124" y="40" width="26" height="22" fill="#5eead4" transform="rotate(-6 137 51)" />
      <rect x="60" y="76" width="32" height="22" fill="#fbcfe8" transform="rotate(2 76 87)" />
      <rect x="108" y="78" width="28" height="22" fill="#fde047" transform="rotate(5 122 89)" />
      <line x1="68" y1="58"  x2="106" y2="76" stroke="#dc2626" strokeWidth="1.5" />
      <line x1="106" y1="54" x2="122" y2="89" stroke="#dc2626" strokeWidth="1.5" />
      <line x1="137" y1="62" x2="122" y2="89" stroke="#dc2626" strokeWidth="1.5" />
    </svg>
  );
}

/* ---------- World terrain
   800×600 viewBox · geographic zones:
   Left:         Healthy meadow — Pond B + Evidence Board (clean river feeds Pond B)
   Upper-right:  Industrial Ridge — Maple Factory (smoke, rock, dead soil)
   Right column: Pollution runoff channel — Factory drain → Pond A
   Lower-right:  Dead/polluted marsh — Pond A (downstream contamination)
   Center:       Transition knoll — Lab Tent (investigation checkpoint)
   Paths:        One main dirt road: Evidence Board → Pond B → Lab Tent → Pond A
*/
function BackdropLayer({ isDark = false, style: extraStyle }) {
  const n = isDark;
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="none"
         style={{ position: "absolute", inset: 0, pointerEvents: "none", ...extraStyle }}>
      <defs>
        <linearGradient id={n ? "t-sky-d" : "t-sky"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={n ? "#030610" : "#cfe8ff"} />
          <stop offset="55%"  stopColor={n ? "#07112a" : "#fef3c7"} />
          <stop offset="100%" stopColor={n ? "#0d1a36" : "#fef9c3"} />
        </linearGradient>
        <linearGradient id={n ? "t-meadow-d" : "t-meadow"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor={n ? "#182606" : "#a3d977"} />
          <stop offset="100%" stopColor={n ? "#0d1804" : "#65a30d"} />
        </linearGradient>
        <linearGradient id={n ? "t-ridge-d" : "t-ridge"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={n ? "#14100a" : "#9a8870"} />
          <stop offset="100%" stopColor={n ? "#0a0806" : "#5b4530"} />
        </linearGradient>
        <linearGradient id={n ? "t-dead-d" : "t-dead"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor={n ? "#120e06" : "#9a8050"} />
          <stop offset="100%" stopColor={n ? "#0a0804" : "#5b4530"} />
        </linearGradient>
        <linearGradient id={n ? "t-river-d" : "t-river"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor={n ? "#0c2640" : "#7dd3fc"} />
          <stop offset="100%" stopColor={n ? "#0e2e50" : "#22d3ee"} />
        </linearGradient>
        <linearGradient id={n ? "t-runoff-d" : "t-runoff"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={n ? "#100c06" : "#6b5228"} />
          <stop offset="100%" stopColor={n ? "#080604" : "#3d2e1a"} />
        </linearGradient>
        <linearGradient id={n ? "t-path-d" : "t-path"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={n ? "#28200e" : "#d6c08a"} />
          <stop offset="100%" stopColor={n ? "#1a1408" : "#b8994e"} />
        </linearGradient>
        <linearGradient id={n ? "t-mt-d" : "t-mt"} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={n ? "#182410" : "#9eb38d"} />
          <stop offset="100%" stopColor={n ? "#0c1408" : "#6a8056"} />
        </linearGradient>
        <radialGradient id={n ? "t-haze-d" : "t-haze"} cx="0.82" cy="0.2" r="0.35">
          <stop offset="0%"   stopColor={n ? "rgba(20,14,6,0.65)"  : "rgba(70,48,22,0.55)"} />
          <stop offset="65%"  stopColor={n ? "rgba(10,8,4,0.2)"    : "rgba(110,80,50,0.18)"} />
          <stop offset="100%" stopColor={n ? "rgba(10,8,4,0)"      : "rgba(110,80,50,0)"} />
        </radialGradient>
        <radialGradient id={n ? "t-glow-d" : "t-sun"} cx={n ? "0.84" : "0.16"} cy="0.1" r="0.28">
          <stop offset="0%"   stopColor={n ? "rgba(180,200,240,0.14)" : "rgba(255,242,180,0.8)"} />
          <stop offset="100%" stopColor={n ? "rgba(180,200,240,0)"    : "rgba(255,242,180,0)"} />
        </radialGradient>
        <pattern id={n ? "t-grassTex-d" : "t-grassTex"} patternUnits="userSpaceOnUse" width="22" height="22">
          <circle cx="4"  cy="8"  r="0.9" fill="rgba(0,0,0,0.05)" />
          <circle cx="14" cy="14" r="0.7" fill="rgba(0,0,0,0.05)" />
          <circle cx="18" cy="4"  r="0.6" fill="rgba(0,0,0,0.05)" />
        </pattern>
        <pattern id={n ? "t-mudTex-d" : "t-mudTex"} patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(15)">
          <ellipse cx="6"  cy="6"  rx="2"   ry="0.8" fill="rgba(40,28,16,0.18)" />
          <ellipse cx="14" cy="13" rx="1.5" ry="0.6" fill="rgba(40,28,16,0.15)" />
          <circle  cx="3"  cy="14" r="0.6"           fill="rgba(40,28,16,0.2)"  />
        </pattern>
      </defs>

      {/* SKY */}
      <rect width="800" height="600" fill={`url(#${n ? "t-sky-d" : "t-sky"})`} />
      <rect width="800" height="600" fill={`url(#${n ? "t-glow-d" : "t-sun"})`} />

      {/* Mountains */}
      <path d="M0 148 L70 108 L148 138 L218 94 L296 128 L388 108 L478 138 L565 108 L660 134 L752 110 L800 124 L800 192 L0 192 Z"
            fill={`url(#${n ? "t-mt-d" : "t-mt"})`} opacity="0.52" />
      <path d="M0 178 L100 148 L200 178 L318 150 L438 182 L555 158 L674 184 L800 166 L800 210 L0 210 Z"
            fill={`url(#${n ? "t-mt-d" : "t-mt"})`} opacity="0.74" />

      {/* Clouds — hidden at night */}
      <g opacity={n ? 0.06 : 0.88}>
        <ellipse cx="118" cy="56" rx="40" ry="9"  fill={n ? "#3a4a60" : "white"} />
        <ellipse cx="138" cy="49" rx="22" ry="10" fill={n ? "#3a4a60" : "white"} />
        <ellipse cx="96"  cy="62" rx="17" ry="7"  fill={n ? "#2e3e54" : "white"} />
        <ellipse cx="310" cy="52" rx="26" ry="7"  fill={n ? "#3a4a60" : "white"} />
        <ellipse cx="328" cy="47" rx="14" ry="8"  fill={n ? "#2e3e54" : "white"} />
      </g>

      {/* GROUND — full healthy meadow base */}
      <path d="M0 162 Q200 146 400 162 T800 162 L800 600 L0 600 Z" fill={`url(#${n ? "t-meadow-d" : "t-meadow"})`} />
      <rect x="0" y="162" width="800" height="438" fill={`url(#${n ? "t-grassTex-d" : "t-grassTex"})`} opacity="0.35" />

      {/* HEALTHY ZONE */}
      <path d="M0 162 Q80 155 200 168 Q305 185 340 285 Q335 405 272 472 Q178 542 0 562 Z"
            fill={n ? "#142206" : "#a3d977"} opacity={n ? 0.5 : 0.6} />
      <path d="M0 162 Q60 158 140 172 Q205 192 225 285 Q215 385 165 452 Q82 512 0 532 Z"
            fill={n ? "#0e1a04" : "#b8e87a"} opacity={n ? 0.3 : 0.38} />
      <ellipse cx="176" cy="218" rx="112" ry="22" fill={n ? "#182206" : "#7aa54a"} opacity={n ? 0.45 : 0.52} />
      <ellipse cx="176" cy="210" rx="102" ry="17" fill={n ? "#142206" : "#a3d977"} opacity={n ? 0.5 : 0.58} />

      {/* INDUSTRIAL RIDGE */}
      <path d="M438 162 Q538 155 678 158 Q768 162 800 186 L800 322 Q738 308 668 320 Q592 330 532 292 Q478 260 462 202 Q450 174 438 162 Z"
            fill={`url(#${n ? "t-ridge-d" : "t-ridge"})`} />
      <path d="M452 178 Q558 168 698 170 Q758 174 800 186"
            stroke={n ? "rgba(180,200,220,0.14)" : "rgba(255,255,255,0.22)"} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M468 222 Q568 237 678 230 Q738 226 800 218"
            stroke={n ? "rgba(6,4,2,0.4)" : "rgba(28,20,16,0.28)"} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* DEAD / POLLUTED ZONE */}
      <path d="M446 320 Q538 300 658 324 Q758 344 800 382 L800 600 L398 600 Q382 522 416 430 Q430 372 446 320 Z"
            fill={`url(#${n ? "t-dead-d" : "t-dead"})`} />
      <path d="M446 320 Q538 300 658 324 Q758 344 800 382 L800 600 L398 600 Q382 522 416 430 Q430 372 446 320 Z"
            fill={`url(#${n ? "t-mudTex-d" : "t-mudTex"})`} opacity="0.65" />
      <path d="M446 320 Q418 368 410 430 Q402 502 414 572"
            stroke={n ? "rgba(20,14,8,0.25)" : "rgba(91,69,48,0.28)"} strokeWidth="58" fill="none" opacity="0.3" />

      {/* POLLUTION RUNOFF */}
      <path d="M643 196 Q658 282 656 368 Q653 408 628 442"
            stroke={n ? "#1a1008" : "#2a1e0e"} strokeWidth="34" fill="none" strokeLinecap="round" opacity="0.72" />
      <path d="M643 196 Q658 282 656 368 Q653 408 628 442"
            stroke={`url(#${n ? "t-runoff-d" : "t-runoff"})`} strokeWidth="24" fill="none" strokeLinecap="round" opacity="0.96" />
      <path d="M646 196 Q660 280 658 366 Q655 406 630 440"
            stroke={n ? "#1a1408" : "#7a6038"} strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.5" />
      <circle cx="652" cy="238" r="3"   fill={n ? "#2a1e0e" : "#a87c4d"} opacity="0.8" />
      <circle cx="658" cy="298" r="2.5" fill={n ? "#2a1e0e" : "#a87c4d"} opacity="0.72" />
      <circle cx="656" cy="354" r="3"   fill={n ? "#2a1e0e" : "#a87c4d"} opacity="0.78" />
      <circle cx="646" cy="402" r="2.5" fill={n ? "#2a1e0e" : "#a87c4d"} opacity="0.7" />
      <ellipse cx="622" cy="444" rx="24" ry="11" fill={n ? "#16100a" : "#3d2e1a"} opacity="0.62" />
      <ellipse cx="618" cy="442" rx="15" ry="7"  fill={n ? "#1c1408" : "#7a6038"} opacity="0.5"  />

      {/* RIVER */}
      <path d="M-22 188 Q58 180 136 192 Q162 202 180 218 Q202 240 216 314 Q228 394 196 460 Q156 520 -18 546"
            stroke={n ? "#071828" : "#0e7490"} strokeWidth="36" fill="none" strokeLinecap="round" opacity="0.82" />
      <path d="M-22 188 Q58 180 136 192 Q162 202 180 218 Q202 240 216 314 Q228 394 196 460 Q156 520 -18 546"
            stroke={`url(#${n ? "t-river-d" : "t-river"})`} strokeWidth="28" fill="none" strokeLinecap="round" />
      <path d="M-22 188 Q58 180 136 192 Q162 202 180 218 Q202 240 216 314 Q228 394 196 460 Q156 520 -18 546"
            stroke={n ? "rgba(120,160,200,0.35)" : "#bae6fd"} strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.62" />
      <path d="M32 185 Q86 179 128 186" stroke={n ? "rgba(160,200,240,0.45)" : "rgba(255,255,255,0.72)"} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M198 264 Q216 308 224 355"  stroke={n ? "rgba(160,200,240,0.38)" : "rgba(255,255,255,0.62)"} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M220 412 Q206 450 186 474"  stroke={n ? "rgba(160,200,240,0.38)" : "rgba(255,255,255,0.62)"} strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Bridge */}
      <g transform="translate(196 275) rotate(5)">
        <rect x="-52" y="-5" width="18" height="10" rx="1" fill={n ? "#1c1208" : "#7a5230"} />
        <rect x="34"  y="-5" width="18" height="10" rx="1" fill={n ? "#1c1208" : "#7a5230"} />
        <rect x="-34" y="-7" width="68" height="14" rx="2" fill={n ? "#1c1208" : "#7a5230"} stroke={n ? "#0e0a06" : "#3d2e22"} strokeWidth="1.5" />
        <rect x="-34" y="-5" width="68" height="2"  fill={n ? "#16100a" : "#a88a4a"} />
        <line x1="-28" y1="-7" x2="-28" y2="7" stroke={n ? "#0e0a06" : "#3d2e22"} strokeWidth="0.8" />
        <line x1="-16" y1="-7" x2="-16" y2="7" stroke={n ? "#0e0a06" : "#3d2e22"} strokeWidth="0.8" />
        <line x1="-4"  y1="-7" x2="-4"  y2="7" stroke={n ? "#0e0a06" : "#3d2e22"} strokeWidth="0.8" />
        <line x1="8"   y1="-7" x2="8"   y2="7" stroke={n ? "#0e0a06" : "#3d2e22"} strokeWidth="0.8" />
        <line x1="20"  y1="-7" x2="20"  y2="7" stroke={n ? "#0e0a06" : "#3d2e22"} strokeWidth="0.8" />
        <line x1="32"  y1="-7" x2="32"  y2="7" stroke={n ? "#0e0a06" : "#3d2e22"} strokeWidth="0.8" />
        <rect x="-34" y="-12" width="4" height="6" fill={n ? "#0e0a06" : "#3d2e22"} />
        <rect x="30"  y="-12" width="4" height="6" fill={n ? "#0e0a06" : "#3d2e22"} />
        <line x1="-32" y1="-9" x2="32" y2="-9" stroke={n ? "#0e0a06" : "#3d2e22"} strokeWidth="1" opacity="0.6" />
      </g>

      {/* MAIN INVESTIGATION PATH */}
      <path d="M412 306 Q476 352 542 392 Q578 414 606 430"
            stroke={`url(#${n ? "t-path-d" : "t-path"})`} strokeWidth="16" fill="none" strokeLinecap="round" opacity="0.88" />
      <path d="M408 294 Q490 248 576 198 Q610 178 636 154"
            stroke={n ? "#1a1408" : "#5b4530"} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="3 9" opacity="0.4" />

      {/* Lab knoll */}
      <ellipse cx="400" cy="318" rx="110" ry="20" fill="rgba(28,20,16,0.1)"  />
      <ellipse cx="400" cy="312" rx="106" ry="17" fill={n ? "#142006" : "#86b94d"} opacity={n ? 0.5 : 0.58} />

      {/* Pollution haze */}
      <rect width="800" height="600" fill={`url(#${n ? "t-haze-d" : "t-haze"})`} />

      {/* Cartographic zone labels */}
      <g opacity={n ? 0.28 : 0.44} style={{ fontFamily: "Caveat, cursive", fontWeight: 700 }}>
        <text x="38"  y="338" fontSize="13" fill={n ? "#1a2e10" : "#365e22"} transform="rotate(-5 38 338)">~ Wildflower Meadow ~</text>
        <text x="546" y="232" fontSize="13" fill={n ? "#1c1410" : "#3d2e22"} transform="rotate(-4 546 232)">~ Industrial Ridge ~</text>
        <text x="464" y="550" fontSize="13" fill={n ? "#241a10" : "#5b4530"} transform="rotate(-3 464 550)">~ Polluted Marsh ~</text>
      </g>
    </svg>
  );
}

/* ---------- Tiny lifeforms ---------- */
function Butterfly({ x, y, size = 18, color = "#f97316" }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 20 16"
         style={{ position: "absolute", left: x, top: y, animation: "ml-float-y 3s ease-in-out infinite" }}>
      <ellipse cx="10" cy="8" rx="0.8" ry="3.5" fill="#1c1410" />
      <path d="M9 8 Q4 2 2 6 Q1 9 9 9 Z" fill={color} />
      <path d="M11 8 Q16 2 18 6 Q19 9 11 9 Z" fill={color} />
      <path d="M9 9 Q5 12 4 14 Q1 12 9 10 Z" fill={color} opacity="0.85" />
      <path d="M11 9 Q15 12 16 14 Q19 12 11 10 Z" fill={color} opacity="0.85" />
      <circle cx="5" cy="6" r="0.9" fill="#fdf6e3" />
      <circle cx="15" cy="6" r="0.9" fill="#fdf6e3" />
      <line x1="10" y1="7" x2="10" y2="4" stroke="#1c1410" strokeWidth="0.5" />
      <line x1="10" y1="4" x2="8" y2="3"  stroke="#1c1410" strokeWidth="0.4" />
      <line x1="10" y1="4" x2="12" y2="3" stroke="#1c1410" strokeWidth="0.4" />
    </svg>
  );
}

function Dragonfly({ x, y, size = 24 }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 24 12"
         style={{ position: "absolute", left: x, top: y, animation: "ml-float-y 2.4s ease-in-out infinite" }}>
      <ellipse cx="12" cy="6" rx="0.7" ry="5" fill="#14b8a6" transform="rotate(90 12 6)" />
      <ellipse cx="8"  cy="3" rx="4" ry="1.2" fill="rgba(125,211,252,0.65)" stroke="#0e7490" strokeWidth="0.3" />
      <ellipse cx="16" cy="3" rx="4" ry="1.2" fill="rgba(125,211,252,0.65)" stroke="#0e7490" strokeWidth="0.3" />
      <ellipse cx="8"  cy="9" rx="3.5" ry="1.1" fill="rgba(125,211,252,0.55)" stroke="#0e7490" strokeWidth="0.3" />
      <ellipse cx="16" cy="9" rx="3.5" ry="1.1" fill="rgba(125,211,252,0.55)" stroke="#0e7490" strokeWidth="0.3" />
      <circle cx="22" cy="6" r="1.4" fill="#0f766e" />
    </svg>
  );
}

function Flower({ x, y, size = 18, color = "#f472b6" }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 18 26" style={{ position: "absolute", left: x, top: y }}>
      <line x1="9" y1="26" x2="9" y2="12" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M5 18 Q3 14 6 12 Q8 16 5 18 Z" fill="#16a34a" />
      <circle cx="6"  cy="7"  r="3" fill={color} />
      <circle cx="12" cy="7"  r="3" fill={color} />
      <circle cx="9"  cy="3"  r="3" fill={color} />
      <circle cx="6"  cy="12" r="3" fill={color} />
      <circle cx="12" cy="12" r="3" fill={color} />
      <circle cx="9"  cy="8"  r="2" fill="#fde047" />
    </svg>
  );
}

function DeadTree({ size = 56 }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 56 62" style={{ display: "block" }}>
      <ellipse cx="28" cy="59" rx="16" ry="3" fill="rgba(0,0,0,0.22)" />
      <path d="M24 56 Q23 44 25 34 L31 34 Q33 44 32 56 Z" fill="#5b4530" />
      <path d="M26 36 Q18 26 10 18" stroke="#5b4530" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M30 36 Q38 24 46 14" stroke="#5b4530" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M26 40 Q18 34 12 30" stroke="#5b4530" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M30 40 Q38 32 44 28" stroke="#5b4530" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M10 18 Q6 12 8 10" stroke="#3d2e22" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M10 18 Q14 12 12 8" stroke="#3d2e22" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M46 14 Q44 8 46 6" stroke="#3d2e22" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M46 14 Q50 10 48 6" stroke="#3d2e22" strokeWidth="1" fill="none" strokeLinecap="round" />
      <path d="M12 30 Q9 25 10 23" stroke="#3d2e22" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M12 30 Q14 24 12 22" stroke="#3d2e22" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M44 28 Q47 23 46 21" stroke="#3d2e22" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      <path d="M44 28 Q42 23 44 21" stroke="#3d2e22" strokeWidth="0.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function DeadFlower({ x, y, size = 18 }) {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 18 26" style={{ position: "absolute", left: x, top: y }}>
      <path d="M9 26 Q9 18 7 14 Q5 10 4 7" stroke="#7c5a30" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M7 18 Q4 16 5 14" stroke="#5b4530" strokeWidth="1" fill="none" strokeLinecap="round" />
      <ellipse cx="4" cy="6" rx="4" ry="3" fill="#a87c4d" opacity="0.85" transform="rotate(-20 4 6)" />
      <ellipse cx="6" cy="4" rx="3" ry="2" fill="#8a6040" opacity="0.7" transform="rotate(10 6 4)" />
      <circle cx="5" cy="6" r="1.5" fill="#5b4530" />
    </svg>
  );
}

function DeadShrub({ x, y, size = 36 }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 36 28" style={{ position: "absolute", left: x, top: y }}>
      <ellipse cx="18" cy="26" rx="14" ry="2" fill="rgba(28,20,16,0.3)" />
      <path d="M18 26 L14 12 L10 16 L12 4" stroke="#5b4530" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M18 26 L22 14 L26 18 L24 6"  stroke="#5b4530" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M18 26 L18 8 L16 10 L20 2"   stroke="#3d2e22" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M14 12 L11 9 M22 14 L25 11 M18 14 L21 12" stroke="#5b4530" strokeWidth="1" />
    </svg>
  );
}

function Cattail({ x, y, size = 24 }) {
  return (
    <svg width={size} height={size * 2} viewBox="0 0 24 48" style={{ position: "absolute", left: x, top: y }}>
      <line x1="9"  y1="46" x2="10" y2="12" stroke="#65a30d" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="46" x2="14" y2="16" stroke="#4d7c0f" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="10" cy="10" rx="2"   ry="6" fill="#7c2d12" />
      <ellipse cx="10" cy="5"  rx="0.6" ry="2" fill="#3d2e22" />
      <ellipse cx="14" cy="14" rx="1.8" ry="5" fill="#7c2d12" />
      <path d="M8 24 Q4 22 5 18" stroke="#65a30d" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M16 28 Q20 26 19 22" stroke="#4d7c0f" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function MudPatch({ x, y, size = 60 }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 60 30" style={{ position: "absolute", left: x, top: y }}>
      <path d="M2 14 Q10 4 22 8 Q38 4 52 12 Q58 22 44 26 Q24 30 8 24 Q-2 20 2 14"
            fill="#7c5a30" stroke="#5b4530" strokeWidth="1" />
      <path d="M10 14 Q18 10 28 14" stroke="#5b4530" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="18" cy="18" r="1" fill="#3d2e22" opacity="0.5" />
      <circle cx="38" cy="20" r="1.2" fill="#3d2e22" opacity="0.5" />
    </svg>
  );
}

function Footprints({ x, y, size = 80, rot = 0 }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 80 40"
         style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)` }}>
      <g fill="#5b4530" opacity="0.45">
        <ellipse cx="10" cy="14" rx="4" ry="6" />
        <ellipse cx="26" cy="22" rx="4" ry="6" />
        <ellipse cx="42" cy="14" rx="4" ry="6" />
        <ellipse cx="58" cy="22" rx="4" ry="6" />
      </g>
    </svg>
  );
}

/* ---------- Bulletin Board (used as map marker for the evidence location) ---------- */
function BulletinBoard({ size = 180 }) {
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 180 162" fill="none" style={{ display: "block" }}>
      <defs>
        <pattern id="cork" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(20)">
          <rect width="6" height="6" fill="#a87b56" />
          <circle cx="2" cy="2" r="0.6" fill="#7a5230" opacity="0.5" />
          <circle cx="5" cy="4" r="0.4" fill="#5b4530" opacity="0.4" />
        </pattern>
      </defs>
      {/* shadow */}
      <ellipse cx="90" cy="152" rx="74" ry="6" fill="rgba(28,20,16,0.3)" />
      {/* posts */}
      <rect x="20" y="60" width="6" height="92" fill="#5b4530" rx="2" />
      <rect x="154" y="60" width="6" height="92" fill="#5b4530" rx="2" />
      <rect x="18" y="148" width="10" height="4" fill="#3d2e22" />
      <rect x="152" y="148" width="10" height="4" fill="#3d2e22" />
      {/* board frame */}
      <rect x="14" y="20" width="152" height="80" rx="4" fill="#5b3a1f" />
      {/* cork surface */}
      <rect x="20" y="26" width="140" height="68" rx="2" fill="url(#cork)" />
      {/* darken edges */}
      <rect x="20" y="26" width="140" height="68" rx="2" fill="rgba(0,0,0,0)" stroke="rgba(0,0,0,0.2)" strokeWidth="3" />
      {/* notes */}
      <g transform="rotate(-4 44 44)">
        <rect x="28" y="32" width="32" height="24" fill="#fef9c3" />
        <line x1="32" y1="38" x2="56" y2="38" stroke="#1c1410" strokeWidth="0.6" opacity="0.4" />
        <line x1="32" y1="44" x2="52" y2="44" stroke="#1c1410" strokeWidth="0.6" opacity="0.4" />
        <line x1="32" y1="50" x2="50" y2="50" stroke="#1c1410" strokeWidth="0.6" opacity="0.4" />
        <circle cx="44" cy="32" r="2" fill="#dc2626" />
      </g>
      <g transform="rotate(3 76 56)">
        <rect x="62" y="44" width="28" height="22" fill="#fdf6e3" />
        <path d="M66 48 L84 48 M66 54 L82 54 M66 60 L80 60" stroke="#1c1410" strokeWidth="0.6" opacity="0.4" />
        <circle cx="76" cy="44" r="2" fill="#f97316" />
      </g>
      <g transform="rotate(-3 110 40)">
        <rect x="96" y="30" width="30" height="22" fill="#fbcfe8" />
        <circle cx="111" cy="40" r="5" fill="#9d174d" opacity="0.3" />
        <text x="111" y="42" textAnchor="middle" fontFamily="Caveat" fontWeight="700" fontSize="9" fill="#9d174d">?</text>
        <circle cx="111" cy="30" r="2" fill="#fbbf24" />
      </g>
      <g transform="rotate(5 132 64)">
        <rect x="118" y="54" width="30" height="22" fill="#5eead4" />
        <path d="M122 60 L144 60 M122 66 L140 66" stroke="#1c1410" strokeWidth="0.6" opacity="0.4" />
        <circle cx="132" cy="54" r="2" fill="#0f766e" />
      </g>
      {/* photo polaroid */}
      <g transform="rotate(-6 60 76)">
        <rect x="48" y="62" width="24" height="22" fill="#fdf6e3" stroke="#1c1410" strokeWidth="0.5" />
        <rect x="50" y="64" width="20" height="14" fill="#7c5a30" />
        <ellipse cx="60" cy="74" rx="8" ry="3" fill="#5b4530" />
        <circle cx="60" cy="62" r="2" fill="#dc2626" />
      </g>
      {/* red string */}
      <path d="M44 44 Q72 62 76 56 Q98 50 111 42 Q120 58 132 62"
            stroke="#dc2626" strokeWidth="1.4" fill="none" opacity="0.85" strokeLinecap="round" />
      {/* top banner */}
      <g transform="rotate(-2 90 12)">
        <rect x="60" y="2" width="60" height="14" rx="2" fill="#1c1410" />
        <text x="90" y="12" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="8" fill="#fde047" letterSpacing="2">CASE #001</text>
      </g>
    </svg>
  );
}

function Thermometer({ size = 70, hot = false }) {
  const mercury = hot ? "#dc2626" : "#3b82f6";
  const tempLabel = hot ? "34°C" : "22°C";
  const fillTop = hot ? 12 : 22;
  const fillH = hot ? 22 : 12;
  return (
    <svg width={Math.round(size * 0.4)} height={size} viewBox="0 0 18 58" style={{ display: "block" }}>
      {/* temp badge */}
      <rect x="0" y="0" width="18" height="9" rx="3" fill={mercury} />
      <text x="9" y="6.5" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="5.5" fill="white">{tempLabel}</text>
      {/* tube */}
      <rect x="5" y="7" width="8" height="34" rx="4" fill="#fdf6e3" stroke="#a89579" strokeWidth="1.4" />
      {/* mercury fill */}
      <rect x="7.2" y={fillTop} width="3.6" height={fillH} rx="1.5" fill={mercury} />
      {/* scale marks */}
      {[13, 19, 25, 31].map(y => (
        <line key={y} x1="13.5" y1={y} x2="15.5" y2={y} stroke="#a89579" strokeWidth="0.8" />
      ))}
      {/* bulb */}
      <circle cx="9" cy="43" r="6" fill={mercury} stroke="#a89579" strokeWidth="1.4" />
      <circle cx="7" cy="41" r="1.8" fill="rgba(255,255,255,0.45)" />
      {/* ground stake */}
      <rect x="8.2" y="48" width="1.6" height="10" fill="#5b4530" />
    </svg>
  );
}

function SmellVapor({ width = 110, height = 80 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 110 80" fill="none" style={{ display: "block" }}>
      {[
        { d: "M18 78 Q24 60 16 44 Q8 28 16 10",  color: "#a3e635", dur: "2.1s", delay: "0s"   },
        { d: "M40 80 Q50 62 42 46 Q34 30 44 12",  color: "#84cc16", dur: "2.5s", delay: "0.3s" },
        { d: "M64 78 Q74 60 66 44 Q58 28 68 10",  color: "#bef264", dur: "2.3s", delay: "0.6s" },
        { d: "M88 76 Q96 58 88 42 Q80 26 90 8",   color: "#a3e635", dur: "2.7s", delay: "0.15s"},
      ].map((s, i) => (
        <path key={i} d={s.d} stroke={s.color} strokeWidth="3" strokeLinecap="round" opacity="0.8"
          style={{ animation: `ml-float-y ${s.dur} ${s.delay} ease-in-out infinite` }} />
      ))}
      <circle cx="30" cy="36" r="4"   fill="#a3e635" opacity="0.4" style={{ animation: "ml-float-y 2.8s 0.1s ease-in-out infinite" }} />
      <circle cx="76" cy="30" r="3"   fill="#bef264" opacity="0.35" style={{ animation: "ml-float-y 3.0s 0.5s ease-in-out infinite" }} />
      <circle cx="52" cy="22" r="2.5" fill="#84cc16" opacity="0.3"  style={{ animation: "ml-float-y 2.4s 0.8s ease-in-out infinite" }} />
    </svg>
  );
}

export {
  Pond, Tree, DeadTree, Factory, LabTent, EvidenceBoardIcon, Reed,
  Rock, Bush, GrassPatch, Signpost, Cloud,
  BackdropLayer, Butterfly, Dragonfly, Flower, DeadFlower, DeadShrub, Cattail, MudPatch, Footprints,
  BulletinBoard, Bird, AnimatedCloud,
  Thermometer, SmellVapor,
};
