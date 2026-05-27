/* ============================================================
   Mystery Lab — shared components
   ============================================================ */
import React, { useState, useEffect, useRef } from "react";

/* ----- Detective Hoot the owl mascot ----- */
function DetectiveHoot({ size = 96, mood = "happy", speech, speechSide = "right", style }) {
  const eyeY = mood === "thinking" ? 38 : 36;
  const browAngle = mood === "thinking" ? -8 : mood === "stern" ? -14 : -4;
  return (
    <div className={`mascot ${speechSide === "left" ? "speech-left" : ""}`} style={style}>
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        {/* body */}
        <ellipse cx="60" cy="78" rx="38" ry="36" fill="#3d2e22" />
        <ellipse cx="60" cy="80" rx="30" ry="28" fill="#5b4530" />
        {/* belly */}
        <ellipse cx="60" cy="86" rx="20" ry="20" fill="#f1e4cc" />
        {/* feet */}
        <ellipse cx="48" cy="112" rx="6" ry="3" fill="#eab308" />
        <ellipse cx="72" cy="112" rx="6" ry="3" fill="#eab308" />
        {/* wings */}
        <ellipse cx="26" cy="78" rx="9" ry="18" fill="#2a1f17" transform="rotate(-12 26 78)" />
        <ellipse cx="94" cy="78" rx="9" ry="18" fill="#2a1f17" transform="rotate(12 94 78)" />
        {/* head */}
        <ellipse cx="60" cy="44" rx="34" ry="32" fill="#5b4530" />
        {/* ear tufts */}
        <path d="M30 24 L36 14 L42 28 Z" fill="#3d2e22" />
        <path d="M90 24 L84 14 L78 28 Z" fill="#3d2e22" />
        {/* detective hat */}
        <ellipse cx="60" cy="22" rx="40" ry="6" fill="#1c1410" />
        <path d="M28 22 Q60 -6 92 22 Z" fill="#2a1f17" />
        <rect x="32" y="20" width="56" height="4" fill="#1c1410" />
        <rect x="50" y="6" width="20" height="10" rx="2" fill="#0f766e" />
        {/* eye discs */}
        <circle cx="46" cy={eyeY} r="11" fill="#fdf6e3" />
        <circle cx="74" cy={eyeY} r="11" fill="#fdf6e3" />
        {/* pupils */}
        <g className="owl-eye"><circle cx="46" cy={eyeY} r="5" fill="#1c1410" /></g>
        <g className="owl-eye delay"><circle cx="74" cy={eyeY} r="5" fill="#1c1410" /></g>
        <circle cx="48" cy={eyeY - 2} r="1.6" fill="white" />
        <circle cx="76" cy={eyeY - 2} r="1.6" fill="white" />
        {/* brows */}
        <path d={`M36 ${eyeY - 14} L56 ${eyeY - 14 + browAngle}`} stroke="#1c1410" strokeWidth="3" strokeLinecap="round" />
        <path d={`M84 ${eyeY - 14} L64 ${eyeY - 14 + browAngle}`} stroke="#1c1410" strokeWidth="3" strokeLinecap="round" />
        {/* beak */}
        <path d="M56 50 L64 50 L60 58 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.2" />
        {/* magnifying glass */}
        <g transform="translate(82 60) rotate(20)">
          <circle r="10" fill="rgba(20,184,166,0.2)" stroke="#0f766e" strokeWidth="2.5" />
          <line x1="7" y1="7" x2="16" y2="16" stroke="#3d2e22" strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* collar bow */}
        <path d="M50 70 L60 66 L70 70 L60 74 Z" fill="#f97316" />
        <circle cx="60" cy="70" r="2" fill="#c2410c" />
      </svg>
      {speech && <div className="speech">{speech}</div>}
    </div>
  );
}

/* ----- HUD: top bar ----- */
function HUD({ xp = 60, energy = 4, energyMax = 5, progress = 0.2, onExit, isDark = false, onToggleTheme, isMuted = false, onToggleMute }) {
  return (
    <div className="hud">
      <div className="brand">
        <div className="logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
        </div>
        <div className="col" style={{ lineHeight: 1.1 }}>
          <div style={{ fontSize: 14 }}>Mystery Lab</div>
          <div className="text-muted" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' }}>EP 01 · Dying Pond</div>
        </div>
      </div>
      <div className="grow" />
      <div className="stat" title="Test points remaining">
        <div className="pip energy"><Lucide name="battery" size={13} /></div>
        <span>{energy}<span className="text-muted" style={{ fontWeight: 500 }}>/{energyMax}</span></span>
        <span className="text-muted" style={{ fontSize: 11, fontWeight: 600, marginLeft: 2 }}>tests</span>
      </div>
      <div className="stat" title="Experience">
        <div className="pip xp">★</div>
        <span>{xp}</span>
        <span className="text-muted" style={{ fontSize: 11, fontWeight: 600, marginLeft: 2 }}>XP</span>
      </div>
      <div className="stat" title="Case progress">
        <div className="pip progress">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
        </div>
        <div className="bar" style={{ width: 80 }}><span style={{ width: `${progress * 100}%` }} /></div>
      </div>
      {onToggleMute && (
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
          aria-pressed={isMuted}
          className="btn icon ghost"
          title={isMuted ? "Unmute" : "Mute"}
        >
          <Lucide name={isMuted ? "volumeX" : "volume2"} size={16} />
        </button>
      )}
      {onToggleTheme && (
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="btn icon ghost"
          title={isDark ? "Light mode" : "Dark mode"}
        >
          <Lucide name={isDark ? "sun" : "moon"} size={16} />
        </button>
      )}
      {onExit && (
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit Mystery Lab"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 999,
            border: "1.5px solid rgba(28,20,16,0.15)",
            background: "rgba(255,255,255,0.94)",
            fontFamily: "Nunito, system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 13,
            color: "#1c1410",
            boxShadow: "0 6px 18px -8px rgba(28,20,16,0.35)",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Lucide name="x" size={14} />
          Exit
        </button>
      )}
    </div>
  );
}

/* ----- Lucide-ish inline icons ----- */
function Lucide({ name, size = 16, color = "currentColor", strokeWidth = 2 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></>,
    map: <><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></>,
    flask: <><path d="M9 2v6L4 20a1 1 0 001 1h14a1 1 0 001-1L15 8V2" /><line x1="9" y1="2" x2="15" y2="2" /><line x1="6.5" y1="14" x2="17.5" y2="14" /></>,
    droplet: <><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></>,
    thermometer: <><path d="M14 4v10.54a4 4 0 11-4 0V4a2 2 0 014 0z" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    factory: <><path d="M2 20h20" /><path d="M17 20V8l-5 4V8l-5 4V4H4v16" /><circle cx="8" cy="14" r=".5" fill="currentColor" /></>,
    fish: <><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6z" /><path d="M18 12v.5" /><path d="M3 12c1-2 4-4 4-4l-2 4 2 4s-3-2-4-4z" /></>,
    battery: <><rect x="2" y="7" width="16" height="10" rx="2" /><line x1="22" y1="11" x2="22" y2="13" /><rect x="4" y="9" width="9" height="6" fill="currentColor" stroke="none" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    check: <polyline points="20 6 9 17 4 12" />,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    chevronRight: <polyline points="9 18 15 12 9 6" />,
    chevronLeft: <polyline points="15 18 9 12 15 6" />,
    sparkles: <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" /><path d="M19 14l.6 1.8L21.5 16.5l-1.9.7L19 19l-.6-1.8L16.5 16.5l1.9-.7z" /></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    arrowDown: <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>,
    pin: <><path d="M12 22s-8-9-8-13a8 8 0 0116 0c0 4-8 13-8 13z" /><circle cx="12" cy="9" r="3" /></>,
    star: <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2" />,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
    award: <><circle cx="12" cy="8" r="6" /><polyline points="8.21 13.89 7 22 12 19 17 22 15.79 13.88" /></>,
    micro: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" /></>,
    helix: <><path d="M4 4c4 0 4 16 16 16" /><path d="M4 20c4 0 4-16 16-16" /></>,
    clipboard: <><rect x="6" y="4" width="12" height="18" rx="2" /><rect x="9" y="2" width="6" height="4" rx="1" /></>,
    lightbulb: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M6 12a6 6 0 1112 0c0 2.5-1.5 4-3 5v1H9v-1c-1.5-1-3-2.5-3-5z" /></>,
    volume2: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" /></>,
    volumeX: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>,
    moon: <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />,
    sun: <><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" /><line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" /><line x1="4.93" y1="4.93" x2="6.34" y2="6.34" /><line x1="17.66" y1="17.66" x2="19.07" y2="19.07" /><line x1="4.93" y1="19.07" x2="6.34" y2="17.66" /><line x1="17.66" y1="6.34" x2="19.07" y2="4.93" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 005 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 005 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 5a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019 9c.36.15.69.36 1 .6" /></>,
    refresh: <><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></>,
    play: <polygon points="6 4 20 12 6 20 6 4" />,
    note: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" /></>,
    home: <><path d="M3 12l9-9 9 9" /><path d="M5 10v10h14V10" /></>,
    leaf: <><path d="M11 20A7 7 0 014 13V8a5 5 0 015-5h6v5a7 7 0 01-7 7" /><line x1="6" y1="21" x2="14" y2="13" /></>,
    bug: <><rect x="8" y="6" width="8" height="14" rx="4" /><path d="M3 12h5M16 12h5M3 6l3 3M21 6l-3 3M3 18l3-3M21 18l-3-3M8 2l2 2M14 2l-2 2" /></>,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6m5 0V4a2 2 0 012-2h0a2 2 0 012 2v2" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

/* ----- Notebook badge that pops when observations are added ----- */
function NotebookBadge({ count = 0, onClick }) {
  const [bump, setBump] = useState(false);
  const prev = useRef(count);
  useEffect(() => {
    if (count <= prev.current) {
      prev.current = count;
      return;
    }
    prev.current = count;
    const t = setTimeout(() => setBump(false), 450);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBump(true);
    return () => clearTimeout(t);
  }, [count]);
  return (
    <button
      onClick={onClick}
      className={`card lift ${bump ? "bounce-in" : ""}`}
      style={{
        position: "relative",
        padding: "10px 14px",
        display: "flex", gap: 8, alignItems: "center",
        background: "var(--bg-elev)",
        border: "1.5px solid var(--line)",
        borderRadius: 14,
        cursor: "pointer",
        fontFamily: "Nunito",
        fontWeight: 800,
      }}
    >
      <Lucide name="book" size={18} />
      <span>Notebook</span>
      <span style={{
        background: "var(--primary)", color: "white",
        fontSize: 11, fontWeight: 800,
        padding: "2px 7px", borderRadius: 999,
      }}>{count}</span>
    </button>
  );
}

/* ----- Crime-tape decoration ----- */
function CrimeTape({ angle = -2, top = 16, text = "MYSTERY · IN PROGRESS · MYSTERY · IN PROGRESS · " }) {
  return (
    <div style={{
      position: "absolute", left: -40, right: -40, top,
      background: "repeating-linear-gradient(90deg, #facc15 0 24px, #1c1410 24px 28px)",
      padding: "8px 0",
      transform: `rotate(${angle}deg)`,
      fontFamily: "Nunito",
      fontWeight: 900,
      letterSpacing: "0.15em",
      color: "#1c1410",
      fontSize: 14,
      whiteSpace: "nowrap",
      overflow: "hidden",
      boxShadow: "0 4px 14px -4px rgba(0,0,0,0.3)",
      zIndex: 1,
      pointerEvents: "none",
    }}>
      <div style={{ background: "#facc15", padding: "0 12px", display: "inline-block" }}>{text.repeat(4)}</div>
    </div>
  );
}

export { DetectiveHoot, HUD, Lucide, NotebookBadge, CrimeTape };
