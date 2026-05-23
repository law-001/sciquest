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
function Pond({ sick = false, size = 240, label, dead = 0 }) {
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

      {/* Drop shadow under pond */}
      <ellipse cx="120" cy="170" rx="106" ry="12" fill="rgba(28,20,16,0.22)" filter="url(#pondShadow)" />

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
          {/* dirty foam */}
          <ellipse cx="120" cy="76" rx="34" ry="3" fill="#a8966a" opacity="0.4" />
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
            <rect x="-3" y="-2" width="6" height="4" fill="#a89579" />
            <rect x="-2" y="-3" width="4" height="2" fill="#5b4530" />
          </g>
        </g>
      )}

      {/* Fish */}
      {!sick && (
        <g>
          <Fishie x={108} y={96} rot={-6} color="#f97316" stroke="#c2410c" />
          <Fishie x={146} y={108} rot={12} color="#fb923c" stroke="#c2410c" size={0.85} />
          <Fishie x={132} y={82}  rot={-18} color="#f59e0b" stroke="#92400e" size={0.7} />
        </g>
      )}
      {sick && Array.from({ length: dead || 4 }).map((_, i) => {
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

/* ---------- World terrain (geographically coherent) ----------
   800×600 viewBox · zones laid out for narrative clarity:
   - Top-left:    Pond B in lush meadow (fed by clean river)
   - Top-right:   Factory perched on industrial ridge
   - Right side:  Polluted drainage stream from factory down
   - Bottom-right: Pond A in dead zone (downstream of factory)
   - Center:      Lab Tent on a low knoll, packed dirt path
   - Mid-left:    Evidence Board (mission HQ) near the lab
   - River:       Top-left → past Pond B → curves to exit bottom-left
*/
function BackdropLayer() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        {/* sky */}
        <linearGradient id="t-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#cfe8ff" />
          <stop offset="55%"  stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fef9c3" />
        </linearGradient>
        {/* healthy meadow (top-left → center) */}
        <linearGradient id="t-meadow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#a3d977" />
          <stop offset="100%" stopColor="#65a30d" />
        </linearGradient>
        {/* mid neutral grass (near lab) */}
        <linearGradient id="t-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#86b94d" />
          <stop offset="100%" stopColor="#5c8a31" />
        </linearGradient>
        {/* dead zone (right side / pond A area) */}
        <linearGradient id="t-dead" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#9a8050" />
          <stop offset="100%" stopColor="#5b4530" />
        </linearGradient>
        {/* industrial ridge (under factory) */}
        <linearGradient id="t-ridge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#a89579" />
          <stop offset="100%" stopColor="#5b4530" />
        </linearGradient>
        {/* river water */}
        <linearGradient id="t-river" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        {/* polluted runoff */}
        <linearGradient id="t-runoff" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#7a6238" />
          <stop offset="100%" stopColor="#3d2e1a" />
        </linearGradient>
        {/* path */}
        <linearGradient id="t-path" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#d6c08a" />
          <stop offset="100%" stopColor="#a88a4a" />
        </linearGradient>
        {/* distant mountains */}
        <linearGradient id="t-mt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#9eb38d" />
          <stop offset="100%" stopColor="#6a8056" />
        </linearGradient>
        {/* pollution haze */}
        <radialGradient id="t-haze" cx="0.82" cy="0.22" r="0.35">
          <stop offset="0%"   stopColor="rgba(80,55,30,0.45)" />
          <stop offset="60%"  stopColor="rgba(120,90,60,0.18)" />
          <stop offset="100%" stopColor="rgba(120,90,60,0)" />
        </radialGradient>
        {/* sun glow */}
        <radialGradient id="t-sun" cx="0.18" cy="0.12" r="0.25">
          <stop offset="0%"   stopColor="rgba(255,242,180,0.85)" />
          <stop offset="100%" stopColor="rgba(255,242,180,0)" />
        </radialGradient>
        {/* grass speckle */}
        <pattern id="t-grassTex" patternUnits="userSpaceOnUse" width="22" height="22">
          <circle cx="4"  cy="8"  r="0.9" fill="rgba(0,0,0,0.05)" />
          <circle cx="14" cy="14" r="0.7" fill="rgba(0,0,0,0.05)" />
          <circle cx="18" cy="4"  r="0.6" fill="rgba(0,0,0,0.05)" />
        </pattern>
        {/* mud speckle */}
        <pattern id="t-mudTex" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(15)">
          <ellipse cx="6"  cy="6"  rx="2" ry="0.8" fill="rgba(40,28,16,0.18)" />
          <ellipse cx="14" cy="13" rx="1.5" ry="0.6" fill="rgba(40,28,16,0.15)" />
          <circle  cx="3"  cy="14" r="0.6" fill="rgba(40,28,16,0.2)" />
        </pattern>
      </defs>

      {/* ===== SKY ===== */}
      <rect width="800" height="180" fill="url(#t-sky)" />
      <rect width="800" height="600" fill="url(#t-sun)" />

      {/* distant mountain range — pushed up, smaller */}
      <path d="M0 140 L80 100 L160 130 L230 90 L310 125 L400 100 L490 135 L580 100 L680 130 L800 110 L800 190 L0 190 Z"
            fill="url(#t-mt)" opacity="0.55" />
      <path d="M0 175 L100 140 L200 175 L320 145 L440 180 L560 155 L680 185 L800 165 L800 215 L0 215 Z"
            fill="url(#t-mt)" opacity="0.75" />
      {/* clouds */}
      <g opacity="0.85">
        <ellipse cx="120" cy="55"  rx="40" ry="9" fill="white" />
        <ellipse cx="140" cy="49"  rx="22" ry="10" fill="white" />
        <ellipse cx="560" cy="44"  rx="32" ry="8" fill="white" />
        <ellipse cx="580" cy="39"  rx="18" ry="9" fill="white" />
      </g>

      {/* ===== GROUND BASE — healthy meadow (raised horizon) ===== */}
      <path d="M0 160 Q200 140 400 160 T800 160 L800 600 L0 600 Z" fill="url(#t-meadow)" />
      <rect x="0" y="160" width="800" height="440" fill="url(#t-grassTex)" />

      {/* ===== INDUSTRIAL RIDGE (under factory, now larger & lower so factory sits on it) ===== */}
      <path d="M460 280 Q560 200 720 195 Q800 200 800 240 L800 380 L520 380 Q470 340 460 280 Z"
            fill="url(#t-ridge)" />
      {/* ridge highlight */}
      <path d="M480 270 Q580 220 720 215" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* ridge dark crevice */}
      <path d="M480 300 Q540 320 600 320 Q680 330 770 312" stroke="rgba(28,20,16,0.35)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* small mound supporting Pond B (so it visually rests on terrain, not floats) */}
      <ellipse cx="176" cy="240" rx="120" ry="22" fill="#7aa54a" opacity="0.55" />
      <ellipse cx="176" cy="232" rx="110" ry="18" fill="#a3d977" opacity="0.6" />
      {/* ===== DEAD ZONE — bottom-right around Pond A (lowered) ===== */}
      <path d="M460 380 Q540 360 640 380 Q740 390 800 400 L800 600 L420 600 Q400 510 460 380 Z"
            fill="url(#t-dead)" />
      <path d="M460 380 Q540 360 640 380 Q740 390 800 400 L800 600 L420 600 Q400 510 460 380 Z"
            fill="url(#t-mudTex)" />
      {/* dead-zone transition feathering */}
      <path d="M460 380 Q420 420 410 470 Q420 540 430 600" stroke="rgba(91,69,48,0.4)" strokeWidth="40" fill="none" opacity="0.4" />

      {/* ===== POLLUTED RUNOFF — from factory drain down to Pond A ===== */}
      <path d="M700 280 Q720 340 700 400 Q680 460 640 490"
            stroke="url(#t-runoff)" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.95" />
      <path d="M700 280 Q720 340 700 400 Q680 460 640 490"
            stroke="#3d2e1a" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* foam bubbles on runoff */}
      <circle cx="708" cy="320" r="2.5" fill="#a87c4d" opacity="0.7" />
      <circle cx="716" cy="360" r="2"   fill="#a87c4d" opacity="0.6" />
      <circle cx="700" cy="400" r="2.2" fill="#a87c4d" opacity="0.7" />
      <circle cx="680" cy="450" r="2.5" fill="#a87c4d" opacity="0.6" />

      {/* ===== RIVER — clean, top-left arc → past Pond B → exits bottom-left (lowered) ===== */}
      <path d="M-30 270 Q 80 260 170 268 Q 250 280 280 360 Q 280 460 210 520 Q 140 560 -20 580"
            stroke="#0e7490" strokeWidth="36" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M-30 270 Q 80 260 170 268 Q 250 280 280 360 Q 280 460 210 520 Q 140 560 -20 580"
            stroke="url(#t-river)" strokeWidth="28" fill="none" strokeLinecap="round" />
      <path d="M-30 270 Q 80 260 170 268 Q 250 280 280 360 Q 280 460 210 520 Q 140 560 -20 580"
            stroke="#bae6fd" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* river sparkle highlights */}
      <path d="M40 264 Q90 260 130 262" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M210 296 Q240 332 264 372" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M268 440 Q252 490 218 510" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* small wooden bridge where path crosses river */}
      <g transform="translate(255 470) rotate(-22)">
        <rect x="-32" y="-7" width="64" height="14" rx="2" fill="#7a5230" stroke="#3d2e22" strokeWidth="1.5" />
        <rect x="-32" y="-5" width="64" height="2"  fill="#a88a4a" />
        <line x1="-26" y1="-7" x2="-26" y2="7" stroke="#3d2e22" strokeWidth="0.8" />
        <line x1="-14" y1="-7" x2="-14" y2="7" stroke="#3d2e22" strokeWidth="0.8" />
        <line x1="0"   y1="-7" x2="0"   y2="7" stroke="#3d2e22" strokeWidth="0.8" />
        <line x1="14"  y1="-7" x2="14"  y2="7" stroke="#3d2e22" strokeWidth="0.8" />
        <line x1="26"  y1="-7" x2="26"  y2="7" stroke="#3d2e22" strokeWidth="0.8" />
        <rect x="-30" y="-12" width="3" height="5" fill="#3d2e22" />
        <rect x="27"  y="-12" width="3" height="5" fill="#3d2e22" />
      </g>

      {/* ===== DIRT PATHS connecting locations (updated for new coords) ===== */}
      {/* Lab(400,324) → Bulletin Board (176,384) */}
      <path d="M380 340 Q300 360 196 380" stroke="url(#t-path)" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.9" />
      {/* Lab → Pond B (176,228) */}
      <path d="M390 306 Q290 270 196 244" stroke="url(#t-path)" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.9" />
      {/* Lab → Pond A (624,468) */}
      <path d="M420 340 Q500 400 604 456" stroke="url(#t-path)" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.9" />
      {/* footprint dotted path Lab → Factory */}
      <path d="M420 304 Q520 280 620 240" stroke="#5b4530" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="2 8" opacity="0.5" />

      {/* lab knoll: subtle bump under lab tent */}
      <ellipse cx="400" cy="344" rx="120" ry="22" fill="rgba(28,20,16,0.12)" />
      <ellipse cx="400" cy="340" rx="116" ry="20" fill="#86b94d" opacity="0.6" />

      {/* pollution haze over factory */}
      <rect width="800" height="600" fill="url(#t-haze)" />

      {/* zone labels — etched into land like map cartography */}
      <g opacity="0.5" style={{ fontFamily: "Caveat", fontWeight: 700 }}>
        <text x="80"  y="320" fontSize="14" fill="#365e22" transform="rotate(-4 80 320)">~ Wildflower Meadow ~</text>
        <text x="540" y="260" fontSize="14" fill="#3d2e22" transform="rotate(-5 540 260)">~ Industrial Ridge ~</text>
        <text x="500" y="560" fontSize="14" fill="#5b4530" transform="rotate(-3 500 560)">~ Polluted Marsh ~</text>
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

export {
  Pond, Tree, Factory, LabTent, EvidenceBoardIcon, Reed,
  Rock, Bush, GrassPatch, Signpost, Cloud,
  BackdropLayer, Butterfly, Dragonfly, Flower, DeadShrub, Cattail, MudPatch, Footprints,
  BulletinBoard,
};
