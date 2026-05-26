/* ============================================================
   Mystery Lab — Screens part 3 (Lab Tent)
   ============================================================ */
import React, { useState, useEffect, useRef } from "react";
import { DetectiveHoot, Lucide, NotebookBadge } from "./shared.jsx";
import { HYPOTHESES } from "./screens-b.jsx";

/* ===== Screen 6: Lab Tent ===== */
const TESTS = [
  {
    id: "ph",
    label: "pH Test",
    icon: "droplet",
    desc: "Dip the strip — measure acidity.",
    cost: 1,
    color: "#a855f7",
    resultA: "pH 4.5 · acidic",
    resultB: "pH 7.0 · neutral",
    verdict: "support",
    method: "Litmus strip dipped 5 cm",
  },
  {
    id: "oxygen",
    label: "Oxygen Test",
    icon: "sparkles",
    desc: "Time the bubbles. Steady hand!",
    cost: 1,
    color: "#0ea5e9",
    resultA: "3.1 mg/L · LOW",
    resultB: "8.4 mg/L · normal",
    verdict: "support",
    method: "Dissolved O₂ probe, 30 s read",
  },
  {
    id: "temp",
    label: "Temperature",
    icon: "thermometer",
    desc: "Drag the thermometer.",
    cost: 1,
    color: "#ef4444",
    resultA: "34 °C · HOT",
    resultB: "22 °C · normal",
    verdict: "partial",
    method: "Digital probe at 30 cm depth",
  },
  {
    id: "pollution",
    label: "Pollution",
    icon: "factory",
    desc: "Match the chemical signature.",
    cost: 1,
    color: "#f97316",
    resultA: "Industrial waste detected",
    resultB: "Clean",
    verdict: "support",
    method: "Spectro test, 3 trials",
  },
  {
    id: "micro",
    label: "Microscope",
    icon: "micro",
    desc: "Find contaminants. Hidden objects!",
    cost: 1,
    color: "#14b8a6",
    resultA: "Heavy metal particles seen",
    resultB: "None",
    verdict: "support",
    method: "400× magnification, 5 samples",
  },
];

function LabScreen({ go, energy, setEnergy, experiments, addExperiment, hypotheses, observations = [] }) {
  if (observations.length === 0) {
    return (
      <div data-screen-label="06 Lab Tent" className="col gap-4">
        <div className="row between head" style={{ alignItems: "center" }}>
          <div>
            <div className="uppercase-eyebrow">Phase 4 · Experiment</div>
            <h2 className="title-xl">Lab Tent · run your tests</h2>
          </div>
        </div>
        <div className="col gap-4" style={{ alignItems: "center", justifyContent: "center", minHeight: 340, textAlign: "center" }}>
          <div className="card" style={{ maxWidth: 480, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <DetectiveHoot size={80} mood="stern" />
            <div>
              <div className="uppercase-eyebrow" style={{ color: "var(--orange-700)" }}>Not so fast, detective!</div>
              <h3 style={{ margin: "8px 0 6px", fontSize: 20, fontFamily: "Nunito", fontWeight: 900, color: "var(--text)" }}>
                You haven't visited the ponds yet
              </h3>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.5, color: "var(--text-muted)" }}>
                Head to the map and observe the ponds first. Gather clues from the field — then come back to run your lab tests.
              </p>
            </div>
            <button className="btn" onClick={() => go("map")} style={{ marginTop: 4 }}>
              <Lucide name="map" size={16} /> Back to the map
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [active, setActive] = useState(null);   // currently-running test
  const [phase, setPhase] = useState("idle");   // idle | running | done

  const startTest = (test) => {
    if (energy < test.cost) return;
    if (experiments.find(e => e.id === test.id)) return;
    setActive(test);
    setPhase("running");
  };

  const completeTest = () => {
    if (!active) return;
    setEnergy(e => e - active.cost);
    addExperiment(active);
    setPhase("done");
  };

  const closePopup = () => {
    setActive(null);
    setPhase("idle");
  };

  return (
    <div data-screen-label="06 Lab Tent" className="col gap-4">
      <div className="row between head" style={{ alignItems: "center" }}>
        <div>
          <div className="uppercase-eyebrow">Phase 4 · Experiment</div>
          <h2 className="title-xl">Lab Tent · run your tests</h2>
        </div>
        <div className="row gap-2">
          <span className="chip teal"><Lucide name="battery" size={12} /> {energy} test point{energy === 1 ? "" : "s"} left</span>
          <button className="btn" disabled={experiments.length < 2} onClick={() => go("map")} style={{ opacity: experiments.length < 2 ? 0.5 : 1 }}>
            Back to map <Lucide name="map" size={16} />
          </button>
        </div>
      </div>

      <div className="ml-2col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* Lab bench */}
        <div className="card ml-scene-card" style={{
          padding: 0,
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(180deg, #fef3c7 0%, #fed7aa 70%, #f97316 100%)",
          minHeight: 460,
        }}>
          {/* Tent stripes background */}
          <svg style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 80 }} viewBox="0 0 800 80" preserveAspectRatio="none">
            <path d="M0 0 L800 0 L800 50 L0 80 Z" fill="#f97316" />
            <path d="M0 0 L100 0 L80 70 L0 80 Z M150 0 L250 0 L230 60 L130 75 Z M300 0 L400 0 L380 55 L280 70 Z M450 0 L550 0 L530 50 L430 65 Z M600 0 L700 0 L680 45 L580 60 Z" fill="#fde047" />
          </svg>

          {/* Bench surface */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, background: "linear-gradient(180deg, #f8efd1 0%, #e6d6b9 100%)", borderTop: "4px solid #5b4530" }}>
            {/* wood plank lines */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.3, background: "repeating-linear-gradient(0deg, #846346 0 1px, transparent 1px 80px)" }} />
          </div>

          {/* Title above tools */}
          <div style={{ position: "absolute", top: 24, left: 32, right: 32, zIndex: 2 }}>
            <div className="tag" style={{ background: "#1c1410", color: "#fde047" }}>
              <Lucide name="flask" size={12} /> 5 tests available
            </div>
            <h3 className="h-display" style={{ fontSize: 28, marginTop: 8, color: "#1c1410" }}>Pick a test.</h3>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--ink-700)" }}>
              Each costs 1 test point. Pond A vs Pond B comparison runs automatically.
            </p>
          </div>

          {/* Tools row */}
          <div style={{ position: "absolute", left: 32, right: 32, bottom: 32, top: 180, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, alignItems: "end" }}>
            {TESTS.map(t => {
              const done = experiments.find(e => e.id === t.id);
              const can = energy >= t.cost && !done;
              return (
                <button
                  key={t.id}
                  onClick={() => can && startTest(t)}
                  disabled={!can}
                  className="card"
                  style={{
                    background: done ? "var(--teal-50, #f0fdfa)" : "var(--bg-elev)",
                    border: done ? "2px solid var(--teal-500)" : "1.5px solid var(--line)",
                    padding: 14,
                    cursor: can ? "pointer" : "not-allowed",
                    opacity: !can && !done ? 0.5 : 1,
                    transition: "transform .15s, box-shadow .15s",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={e => can && (e.currentTarget.style.transform = "translateY(-4px)")}
                  onMouseLeave={e => can && (e.currentTarget.style.transform = "")}
                >
                  <LabTool test={t} />
                  <div style={{ marginTop: 12, fontFamily: "Nunito", fontWeight: 900, fontSize: 14, color: done ? "var(--teal-700)" : "var(--text)" }}>
                    {t.label}
                  </div>
                  <div className="text-soft" style={{ fontSize: 11, fontWeight: 600 }}>{done ? "✓ completed" : t.desc}</div>
                  <div style={{
                    position: "absolute", top: 8, right: 8,
                    fontSize: 10, fontWeight: 800, padding: "2px 7px",
                    borderRadius: 999,
                    background: done ? "var(--teal-500)" : "var(--ink-900)",
                    color: done ? "white" : "var(--yellow-300)",
                    fontFamily: "Nunito",
                  }}>
                    {done ? "DONE" : `–${t.cost}⚡`}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bubbling beaker decoration */}
          <div style={{ position: "absolute", left: 24, top: 130, zIndex: 1 }}>
            <Beaker color="#14b8a6" />
          </div>
          <div style={{ position: "absolute", right: 24, top: 110, zIndex: 1 }}>
            <Beaker color="#f97316" small />
          </div>
        </div>

        {/* Side: live results + hypotheses verdict */}
        <div className="col gap-3 ml-game-sidebar">
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 16 }}>Hypothesis verdict</h3>
            <p className="text-soft" style={{ fontSize: 12, fontWeight: 600, margin: "4px 0 12px" }}>Updates as you test.</p>
            <div className="col gap-2">
              {hypotheses.length === 0 && <div className="text-muted" style={{ fontSize: 13, fontStyle: "italic" }}>No hypotheses picked.</div>}
              {hypotheses.map(hid => {
                const h = HYPOTHESES.find(x => x.id === hid);
                const verdict = verdictForHyp(h, experiments);
                return (
                  <div key={hid} className="row gap-2" style={{ alignItems: "flex-start", padding: 10, background: "var(--bg)", borderRadius: 10 }}>
                    <span className={`chip ${verdict === "support" ? "green" : verdict === "contradict" ? "red" : "yellow"}`} style={{ flexShrink: 0 }}>
                      {verdict === "support" ? "✓" : verdict === "contradict" ? "✗" : "⚠"}
                    </span>
                    <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{h.text}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ padding: 14, background: "var(--orange-50)", borderColor: "var(--orange-200)" }}>
            <div className="row gap-3" style={{ alignItems: "flex-start" }}>
              <DetectiveHoot size={56} mood="thinking" />
              <div>
                <div className="uppercase-eyebrow" style={{ color: "var(--orange-700)" }}>Hoot's lab tip</div>
                <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 600, lineHeight: 1.45 }}>
                  Tests are like questions to nature. <b>Compare Pond A to Pond B</b> — that's your variable.
                </p>
              </div>
            </div>
          </div>

          <NotebookBadge count={experiments.length} onClick={() => go("notebook")} />
        </div>
      </div>

      {/* Mini-game popup */}
      {active && <TestMiniGame test={active} phase={phase} onComplete={completeTest} onClose={closePopup} />}
    </div>
  );
}

function verdictForHyp(h, experiments) {
  if (!h) return "partial";
  // map hypothesis to test verdicts
  const map = {
    h1: ["temp"],         // high temp
    h2: ["oxygen"],       // low oxygen
    h3: ["pollution","ph","micro"], // pollution
  };
  const relevant = (map[h.id] || []).map(id => experiments.find(e => e.id === id)).filter(Boolean);
  if (relevant.length === 0) return "partial";
  if (h.id === "h1" && relevant[0]?.verdict === "partial") return "partial";
  if (relevant.some(e => e.verdict === "support")) return "support";
  return "partial";
}

function Beaker({ color = "#14b8a6", small = false }) {
  const w = small ? 40 : 56;
  const h = small ? 60 : 80;
  return (
    <svg width={w} height={h + 10} viewBox="0 0 60 90" style={{ filter: "drop-shadow(0 6px 0 rgba(0,0,0,0.15))" }}>
      {/* bubbles */}
      <circle cx="22" cy="20" r="3" fill={color} opacity="0.6">
        <animate attributeName="cy" values="40;10" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="35" cy="30" r="2" fill={color} opacity="0.6">
        <animate attributeName="cy" values="50;15" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* beaker shape */}
      <path d="M14 30 L14 80 Q14 86 20 86 L40 86 Q46 86 46 80 L46 30 L50 28 L50 24 L10 24 L10 28 Z"
            fill="#fdf6e3" stroke="#1c1410" strokeWidth="2" />
      {/* liquid */}
      <path d="M16 50 L16 78 Q16 84 21 84 L39 84 Q44 84 44 78 L44 50 Z" fill={color} opacity="0.8" />
      <path d="M16 50 Q24 46 30 52 Q38 56 44 50 L44 54 Q38 58 30 54 Q24 50 16 54 Z" fill="white" opacity="0.4" />
      {/* graduations */}
      <line x1="16" y1="60" x2="22" y2="60" stroke="#1c1410" strokeWidth="1" />
      <line x1="16" y1="70" x2="22" y2="70" stroke="#1c1410" strokeWidth="1" />
    </svg>
  );
}

function LabToolWrap({ children }) {
  return <div style={{ height: 90, display: "grid", placeItems: "center", position: "relative" }}>{children}</div>;
}

function LabTool({ test }) {
  if (test.id === "ph") return <LabToolWrap><PHStrip color={test.color} /></LabToolWrap>;
  if (test.id === "oxygen") return <LabToolWrap><OxygenProbe /></LabToolWrap>;
  if (test.id === "temp") return <LabToolWrap><Thermometer /></LabToolWrap>;
  if (test.id === "pollution") return <LabToolWrap><PollutionTube /></LabToolWrap>;
  if (test.id === "micro") return <LabToolWrap><Microscope /></LabToolWrap>;
  return null;
}

function PHStrip({ color }) {
  return (
    <svg width="60" height="84" viewBox="0 0 60 84">
      <rect x="22" y="6" width="14" height="60" rx="2" fill="#fdf6e3" stroke="#1c1410" strokeWidth="2" />
      <rect x="24" y="40" width="10" height="24" fill={color} />
      <rect x="24" y="58" width="10" height="6" fill="#dc2626" />
      <rect x="24" y="52" width="10" height="6" fill="#f97316" />
      <rect x="24" y="46" width="10" height="6" fill="#facc15" />
      <text x="29" y="22" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="9" fill="#1c1410">pH</text>
    </svg>
  );
}
function OxygenProbe() {
  return (
    <svg width="60" height="84" viewBox="0 0 60 84">
      <rect x="22" y="40" width="16" height="38" rx="3" fill="#1c1410" />
      <rect x="24" y="44" width="12" height="14" fill="#0ea5e9" />
      <text x="30" y="54" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="7" fill="white">O₂</text>
      <line x1="30" y1="40" x2="30" y2="14" stroke="#5b4530" strokeWidth="2" />
      <circle cx="30" cy="10" r="6" fill="#0ea5e9" stroke="#1c1410" strokeWidth="2" />
    </svg>
  );
}
function Thermometer() {
  return (
    <svg width="60" height="84" viewBox="0 0 60 84">
      <rect x="26" y="8" width="8" height="56" rx="4" fill="#fdf6e3" stroke="#1c1410" strokeWidth="2" />
      <rect x="28" y="36" width="4" height="28" fill="#ef4444" />
      <circle cx="30" cy="68" r="10" fill="#ef4444" stroke="#1c1410" strokeWidth="2" />
      {[16, 26, 36, 46, 56].map(y => (
        <line key={y} x1="34" y1={y} x2="38" y2={y} stroke="#1c1410" strokeWidth="1.5" />
      ))}
    </svg>
  );
}
function PollutionTube({ color = "#f97316" }) {
  return (
    <svg width="60" height="84" viewBox="0 0 60 84">
      <rect x="22" y="8" width="16" height="60" rx="8" fill="#fdf6e3" stroke="#1c1410" strokeWidth="2" />
      <rect x="24" y="38" width="12" height="28" rx="6" style={{ fill: color, transition: "fill 0.6s ease" }} />
      <rect x="20" y="6" width="20" height="6" rx="2" fill="#5b4530" />
      <circle cx="30" cy="52" r="2" fill="#1c1410" opacity="0.4" />
      <circle cx="32" cy="60" r="1.5" fill="#1c1410" opacity="0.4" />
    </svg>
  );
}
function Microscope() {
  return (
    <svg width="60" height="84" viewBox="0 0 60 84">
      <rect x="14" y="64" width="32" height="6" rx="1" fill="#1c1410" />
      <rect x="22" y="40" width="16" height="24" fill="#3d2e22" />
      <rect x="20" y="38" width="20" height="6" fill="#1c1410" />
      <rect x="26" y="14" width="8" height="26" fill="#1c1410" />
      <rect x="20" y="10" width="20" height="6" rx="2" fill="#14b8a6" />
      <circle cx="30" cy="12" r="3" fill="#fdf6e3" stroke="#1c1410" strokeWidth="1" />
      <rect x="18" y="50" width="24" height="3" fill="#fdf6e3" stroke="#1c1410" strokeWidth="1" />
    </svg>
  );
}

/* Mini-game popup */
function TestMiniGame({ test, phase, onComplete, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(28,20,16,0.7)",
      backdropFilter: "blur(6px)",
      display: "grid", placeItems: "center",
      zIndex: 100,
      padding: 20,
    }}>
      <div className="card bounce-in" style={{ width: "min(640px, 100%)", padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", background: test.color, color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.85 }}>Mini-game</div>
            <h3 style={{ fontSize: 22 }}>{test.label}</h3>
          </div>
          <button onClick={onClose} className="btn icon ghost" style={{ background: "rgba(255,255,255,0.15)", border: 0, color: "white" }}>
            <Lucide name="x" size={18} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {phase === "running" && <MiniGameRunner test={test} onComplete={onComplete} />}
          {phase === "done" && <MiniGameResults test={test} onClose={onClose} />}
        </div>
      </div>
    </div>
  );
}

function MiniGameRunner({ test, onComplete }) {
  if (test.id === "ph") return <PHMiniGame onDone={onComplete} />;
  if (test.id === "oxygen") return <OxygenMiniGame onDone={onComplete} />;
  if (test.id === "temp") return <TempMiniGame onDone={onComplete} />;
  if (test.id === "pollution") return <PollutionMiniGame onDone={onComplete} />;
  if (test.id === "micro") return <MicroMiniGame onDone={onComplete} />;
  return null;
}

/* pH: beaker illustration */
function PHBeakerSVG() {
  return (
    <svg width="110" height="140" viewBox="0 0 110 140" style={{ filter: "drop-shadow(0 6px 0 rgba(0,0,0,0.15))", overflow: "visible" }}>
      <text x="55" y="14" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="11" fill="#7c5a30">POND A</text>
      <rect x="14" y="20" width="82" height="12" rx="6" fill="#5b4530" stroke="#1c1410" strokeWidth="1.5" />
      <path d="M22 32 L22 124 Q22 134 32 134 L78 134 Q88 134 88 124 L88 32 Z" fill="#fdf6e3" stroke="#1c1410" strokeWidth="2" />
      <path d="M24 62 L24 122 Q24 132 33 132 L77 132 Q86 132 86 122 L86 62 Z" fill="#7c5a30" opacity="0.72" />
      <path d="M24 62 Q38 56 55 62 Q72 56 86 62 L86 67 Q72 72 55 67 Q38 72 24 67 Z" fill="#a87c4d" opacity="0.55" />
      <line x1="24" y1="84"  x2="34" y2="84"  stroke="#1c1410" strokeWidth="1" opacity="0.35" />
      <line x1="24" y1="100" x2="34" y2="100" stroke="#1c1410" strokeWidth="1" opacity="0.35" />
      <line x1="24" y1="116" x2="34" y2="116" stroke="#1c1410" strokeWidth="1" opacity="0.35" />
      <circle cx="42" cy="90" r="4" fill="rgba(210,160,80,0.45)" stroke="rgba(210,160,80,0.7)" strokeWidth="1.2">
        <animate attributeName="cy" values="122;58" dur="1.9s" repeatCount="indefinite" begin="0s" />
        <animate attributeName="opacity" values="0.7;0" dur="1.9s" repeatCount="indefinite" begin="0s" />
      </circle>
      <circle cx="62" cy="105" r="3" fill="rgba(210,160,80,0.45)" stroke="rgba(210,160,80,0.7)" strokeWidth="1">
        <animate attributeName="cy" values="128;64" dur="2.4s" repeatCount="indefinite" begin="0.8s" />
        <animate attributeName="opacity" values="0.7;0" dur="2.4s" repeatCount="indefinite" begin="0.8s" />
      </circle>
      <circle cx="76" cy="98" r="2.5" fill="rgba(210,160,80,0.4)" stroke="rgba(210,160,80,0.65)" strokeWidth="1">
        <animate attributeName="cy" values="120;60" dur="2.1s" repeatCount="indefinite" begin="1.4s" />
        <animate attributeName="opacity" values="0.6;0" dur="2.1s" repeatCount="indefinite" begin="1.4s" />
      </circle>
    </svg>
  );
}

/* pH: 2-phase — Dip the strip → Match the pH value */
function PHMiniGame({ onDone }) {
  const [phase, setPhase]             = useState("dip");
  const [dipProgress, setDipProgress] = useState(0);
  const [isDipping, setIsDipping]     = useState(false);
  const [selected, setSelected]       = useState(null);
  const [isCorrect, setIsCorrect]     = useState(null);
  const intervalRef                   = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const PH_OPTIONS = [
    { value: 2,   label: "pH 2",   color: "#dc2626", desc: "Very acidic", correct: false },
    { value: 4.5, label: "pH 4.5", color: "#f97316", desc: "Acidic",      correct: true  },
    { value: 7.0, label: "pH 7.0", color: "#22c55e", desc: "Neutral",     correct: false },
    { value: 10,  label: "pH 10",  color: "#3b82f6", desc: "Basic",       correct: false },
  ];

  const startDip = () => {
    if (isDipping) return;
    setIsDipping(true);
    intervalRef.current = setInterval(() => {
      setDipProgress(prev => {
        const next = prev + 2.5;
        if (next >= 100) {
          clearInterval(intervalRef.current);
          setTimeout(() => setPhase("read"), 600);
          return 100;
        }
        return next;
      });
    }, 30);
  };

  const pickAnswer = (opt) => {
    if (selected !== null) return;
    setSelected(opt.value);
    setIsCorrect(opt.correct);
    if (opt.correct) {
      setTimeout(onDone, 1000);
    } else {
      setTimeout(() => { setSelected(null); setIsCorrect(null); }, 1000);
    }
  };

  const stripColor = dipProgress < 30 ? "#e2e8f0" : dipProgress < 70 ? "#fbbf24" : "#f97316";
  const stripTopPx = dipProgress * 1.15;

  /* ── PHASE 1: DIP ── */
  if (phase === "dip") {
    return (
      <div style={{ padding: "8px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontFamily: "Nunito", fontWeight: 900, color: "var(--text)" }}>
            Dip the pH strip into Pond A water!
          </div>
          <div style={{ fontSize: 13, color: "var(--text-soft)", fontWeight: 600, marginTop: 4 }}>
            A pH strip changes color based on how acidic the water is.
          </div>
        </div>

        <div style={{ position: "relative", height: 270, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)" }}>
            <PHBeakerSVG />
          </div>
          <div style={{
            position: "absolute",
            left: "50%",
            top: `${stripTopPx}px`,
            transform: "translateX(-50%)",
            zIndex: 10,
            pointerEvents: "none",
          }}>
            <svg width="28" height="88" viewBox="0 0 28 88">
              <rect x="8" y="0" width="12" height="66" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="10" y="42" width="8" height="22" style={{ fill: stripColor, transition: "fill 0.4s ease" }} />
              <text x="14" y="16" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="7" fill="#475569">pH</text>
              {[22, 30, 38].map(y => (
                <line key={y} x1="20" y1={y} x2="24" y2={y} stroke="#94a3b8" strokeWidth="1" />
              ))}
            </svg>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
          <button
            className="btn lg"
            onClick={startDip}
            disabled={isDipping}
            style={{
              fontSize: 17,
              padding: "13px 34px",
              animation: !isDipping ? "ml-btn-glow 1.4s ease-in-out infinite" : undefined,
            }}
          >
            {isDipping
              ? (dipProgress < 100 ? "Dipping… 🔬" : "Reading… ⏳")
              : "Dip the strip! 🧪"}
          </button>
        </div>

        {isDipping && dipProgress < 100 && (
          <div style={{ textAlign: "center", marginTop: 10, fontFamily: "Nunito", fontWeight: 700, fontSize: 13, color: "var(--text-soft)" }}>
            {dipProgress < 50 ? "Going in…" : "The color is changing! 🎨"}
          </div>
        )}
      </div>
    );
  }

  /* ── PHASE 2: READ ── */
  return (
    <div style={{ padding: "8px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 18, fontFamily: "Nunito", fontWeight: 900 }}>
          What pH does the strip show?
        </div>
        <div style={{ fontSize: 13, color: "var(--text-soft)", fontWeight: 600, marginTop: 4 }}>
          Match the color of your strip to the right pH value!
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <svg width="32" height="84" viewBox="0 0 32 84">
            <rect x="9"  y="0"  width="14" height="62" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="11" y="38" width="10" height="22" fill="#f97316" />
            <rect x="11" y="50" width="10" height="8"  fill="#ef4444" />
            <text x="16" y="14" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="7" fill="#475569">pH</text>
          </svg>
          <span style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 11, color: "#f97316" }}>Your strip</span>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ height: 18, borderRadius: 9, background: "linear-gradient(90deg, #dc2626 0%, #f97316 18%, #facc15 34%, #22c55e 50%, #3b82f6 68%, #8b5cf6 100%)", border: "1.5px solid var(--line)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontFamily: "Nunito", fontWeight: 700, fontSize: 10, color: "var(--text-soft)" }}>
            <span>1 · Very acidic</span>
            <span>7 · Neutral</span>
            <span>14 · Very basic</span>
          </div>
        </div>
      </div>

      {isCorrect === false && (
        <div style={{ marginBottom: 12, padding: "9px 14px", borderRadius: 10, background: "#fee2e2", color: "#991b1b", fontFamily: "Nunito", fontWeight: 800, fontSize: 14, textAlign: "center" }}>
          Not quite! Orange-red color = acidic. Look at the left side of the scale! 🔴
        </div>
      )}
      {isCorrect === true && (
        <div style={{ marginBottom: 12, padding: "9px 14px", borderRadius: 10, background: "#dcfce7", color: "#166534", fontFamily: "Nunito", fontWeight: 800, fontSize: 14, textAlign: "center" }}>
          Correct! 🎉 pH 4.5 = ACIDIC — that's bad for fish!
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {PH_OPTIONS.map(opt => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => pickAnswer(opt)}
              disabled={selected !== null}
              className="card"
              style={{
                padding: "14px 10px",
                textAlign: "center",
                cursor: selected !== null ? "default" : "pointer",
                border: isSelected
                  ? `3px solid ${isCorrect ? "#22c55e" : "#ef4444"}`
                  : `2px solid ${opt.color}33`,
                background: isSelected ? (isCorrect ? "#dcfce7" : "#fef2f2") : "var(--bg-elev)",
                transition: "all .15s",
              }}
              onMouseEnter={e => selected === null && (e.currentTarget.style.transform = "translateY(-3px)")}
              onMouseLeave={e => selected === null && (e.currentTarget.style.transform = "")}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, background: opt.color, margin: "0 auto 8px" }} />
              <div style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 16, color: opt.color }}>{opt.label}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-soft)", marginTop: 2 }}>{opt.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Oxygen: 3-level timing bar */
const OXYGEN_LEVELS = [
  { greenStart: 35, greenEnd: 65, speed: 2,    label: "Level 1" },
  { greenStart: 40, greenEnd: 60, speed: 2.5,  label: "Level 2" },
  { greenStart: 44, greenEnd: 56, speed: 2.75, label: "Level 3" },
];

function OxygenMiniGame({ onDone }) {
  const [level, setLevel] = useState(0);
  const [pos, setPos] = useState(0);
  const [paused, setPaused] = useState(false);
  const [flash, setFlash] = useState(null); // "hit" | "miss" | null
  const posRef = useRef(0);

  useEffect(() => {
    if (paused) return;
    const cfg = OXYGEN_LEVELS[level];
    let dir = 1;
    let p = 0;
    const id = setInterval(() => {
      p += dir * cfg.speed;
      if (p >= 100) { p = 100; dir = -1; }
      if (p <= 0)   { p = 0;   dir =  1; }
      posRef.current = p;
      setPos(p);
    }, 30);
    return () => clearInterval(id);
  }, [paused, level]);

  const tap = () => {
    if (paused) return;
    const p = posRef.current;
    const cfg = OXYGEN_LEVELS[level];
    const inZone = p > cfg.greenStart && p < cfg.greenEnd;
    setPaused(true);
    if (inZone) {
      setFlash("hit");
      setTimeout(() => {
        if (level < OXYGEN_LEVELS.length - 1) {
          posRef.current = 0;
          setPos(0);
          setFlash(null);
          setLevel(l => l + 1);
          setPaused(false);
        } else {
          onDone();
        }
      }, 700);
    } else {
      setFlash("miss");
      setTimeout(() => {
        posRef.current = 0;
        setPos(0);
        setFlash(null);
        setLevel(0);
        setPaused(false);
      }, 900);
    }
  };

  const cfg = OXYGEN_LEVELS[level];

  return (
    <div style={{ padding: "20px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p style={{ margin: 0, fontWeight: 600, color: "var(--text-soft)" }}>
          Tap when the needle lands in the green zone.
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          {OXYGEN_LEVELS.map((_, i) => (
            <span key={i} style={{
              width: 26, height: 26, borderRadius: 999,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Nunito", fontWeight: 900, fontSize: 12,
              background: i < level ? "#34d399" : i === level ? "#0ea5e9" : "#e5e7eb",
              color: i <= level ? "white" : "#9ca3af",
              border: i === level ? "2px solid #1c1410" : "2px solid transparent",
            }}>
              {i < level ? "✓" : i + 1}
            </span>
          ))}
        </div>
      </div>
      {flash && (
        <div style={{
          marginBottom: 12, padding: "8px 14px", borderRadius: 10,
          background: flash === "hit" ? "#dcfce7" : "#fee2e2",
          color: flash === "hit" ? "#166534" : "#991b1b",
          fontFamily: "Nunito", fontWeight: 800, fontSize: 14, textAlign: "center",
        }}>
          {flash === "hit"
            ? (level < OXYGEN_LEVELS.length - 1 ? "Nice! Next level!" : "Perfect!")
            : "Missed — back to level 1!"}
        </div>
      )}
      <div style={{
        height: 28, borderRadius: 999,
        background: `linear-gradient(90deg, #f87171 0%, #f87171 ${cfg.greenStart}%, #34d399 ${cfg.greenStart}%, #34d399 ${cfg.greenEnd}%, #f87171 ${cfg.greenEnd}%, #f87171 100%)`,
        position: "relative", overflow: "hidden",
        border: "2px solid #1c1410",
        transition: "background 0.4s ease",
      }}>
        <div style={{
          position: "absolute", left: `${pos}%`, top: -4,
          transform: "translateX(-50%)",
          width: 6, height: 36,
          background: "#1c1410", borderRadius: 3,
        }} />
      </div>
      <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, color: "var(--text-soft)", fontFamily: "Nunito", textAlign: "right" }}>
        {cfg.label} · green shrinks, bar speeds up each round
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <button className="btn lg" onClick={tap} disabled={paused}>
          {paused ? (flash === "hit" ? "Level up!" : "Try again…") : "Tap NOW"}
        </button>
      </div>
    </div>
  );
}

/* Temperature: drag thermometer into water samples */
const TEMP_CONTAINERS = [
  { id: "river", label: "River",  temp: 18, waterColor: "#67e8f9", labelColor: "#0891b2" },
  { id: "pondA", label: "Pond A", temp: 34, waterColor: "#fb923c", labelColor: "#c2410c" },
  { id: "pondB", label: "Pond B", temp: 22, waterColor: "#7dd3fc", labelColor: "#0369a1" },
];

function DragThermometer() {
  return (
    <svg width="32" height="106" viewBox="0 0 32 106" style={{ display: "block" }}>
      <rect x="10" y="0" width="12" height="70" rx="6" fill="#fef9f0" stroke="#1c1410" strokeWidth="2" />
      <rect x="13" y="28" width="6" height="42" fill="#ef4444" />
      {[6, 14, 22].map(y => (
        <line key={y} x1="22" y1={y + 6} x2="27" y2={y + 6} stroke="#9ca3af" strokeWidth="1.5" />
      ))}
      {[14, 24, 34, 44, 54, 64].map(y => (
        <line key={y} x1="22" y1={y} x2="28" y2={y} stroke="#1c1410" strokeWidth="1.2" />
      ))}
      <circle cx="16" cy="82" r="13" fill="#ef4444" stroke="#1c1410" strokeWidth="2" />
      <ellipse cx="11" cy="77" rx="4" ry="3" fill="rgba(255,255,255,0.38)" transform="rotate(-20 11 77)" />
    </svg>
  );
}

function ContainerBeaker({ id, waterColor, dipping, isDone }) {
  return (
    <svg width="90" height="122" viewBox="0 0 90 122" style={{ overflow: "visible", display: "block" }}>
      <defs>
        <clipPath id={`bc2-${id}`}>
          <rect x="12" y="28" width="66" height="82" rx="4" />
        </clipPath>
      </defs>
      {/* water fill */}
      <rect x="12" y="52" width="66" height="58" fill={waterColor} opacity="0.85" clipPath={`url(#bc2-${id})`} />
      {/* thermometer — stem overflows above SVG bounds; rim is drawn after to mask the insertion gap */}
      {dipping && (
        <>
          <rect x="41" y="-38" width="8" height="100" rx="4" fill="#fef9f0" stroke="#1c1410" strokeWidth="1.5" />
          <rect x="43" y="-20" width="4" height="82" fill="#ef4444" />
          <circle cx="45" cy="72" r="11" fill="#ef4444" stroke="#1c1410" strokeWidth="1.5" />
          <ellipse cx="40" cy="67" rx="4" ry="3" fill="rgba(255,255,255,0.35)" transform="rotate(-20 40 67)" />
          <ellipse cx="45" cy="52" rx="28" ry="5" fill="white" opacity="0.4">
            <animate attributeName="rx" values="28;36;28" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.07;0.4" dur="1s" repeatCount="indefinite" />
          </ellipse>
        </>
      )}
      {/* beaker body outline */}
      <rect x="12" y="28" width="66" height="82" rx="8" fill="none" stroke="#1c1410" strokeWidth="2.5" />
      {/* rim — drawn last so it covers the thermometer at the insertion point */}
      <rect x="8" y="18" width="74" height="14" rx="6" fill="#5b4530" stroke="#1c1410" strokeWidth="1.5" />
      <line x1="12" y1="66" x2="26" y2="66" stroke="#1c1410" strokeWidth="1" opacity="0.4" />
      <line x1="12" y1="82" x2="26" y2="82" stroke="#1c1410" strokeWidth="1" opacity="0.4" />
      <line x1="12" y1="98" x2="26" y2="98" stroke="#1c1410" strokeWidth="1" opacity="0.4" />
      {isDone && (
        <>
          <circle cx="74" cy="34" r="13" fill="#22c55e" stroke="white" strokeWidth="2" />
          <text x="74" y="39" textAnchor="middle" fill="white" fontSize="15" fontWeight="900">✓</text>
        </>
      )}
    </svg>
  );
}

function TempMiniGame({ onDone }) {
  const [measured, setMeasured] = useState({});
  const [pos, setPos] = useState({ x: 200, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const [dipping, setDipping] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [phase, setPhase] = useState("measure");
  const [answer, setAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const areaRef = useRef(null);
  const containerRefs = useRef({});
  const timerRef = useRef(null);
  const draggingRef = useRef(false);
  const dippingRef = useRef(null);
  const measuredRef = useRef({});

  const allMeasured = TEMP_CONTAINERS.every(c => measured[c.id] !== undefined);

  useEffect(() => { measuredRef.current = measured; }, [measured]);

  useEffect(() => {
    if (areaRef.current) {
      const w = areaRef.current.offsetWidth;
      setPos({ x: w / 2, y: 16 });
    }
  }, []);

  useEffect(() => {
    if (allMeasured && phase === "measure") {
      const t = setTimeout(() => setPhase("question"), 800);
      return () => clearTimeout(t);
    }
  }, [allMeasured, phase]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const getHome = () => ({
    x: areaRef.current ? areaRef.current.offsetWidth / 2 : 200,
    y: 16,
  });

  const startDip = (container) => {
    if (dippingRef.current || measuredRef.current[container.id] !== undefined) return;
    const areaRect = areaRef.current?.getBoundingClientRect();
    const cEl = containerRefs.current[container.id];
    if (!areaRect || !cEl) return;
    const cRect = cEl.getBoundingClientRect();
    setPos({ x: cRect.left - areaRect.left + cRect.width / 2, y: cRect.top - areaRect.top - 28 });
    setDipping(container.id);
    dippingRef.current = container.id;
    setCountdown(3);
    let count = 3;
    timerRef.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(timerRef.current);
        const next = { ...measuredRef.current, [container.id]: container.temp };
        setMeasured(next);
        measuredRef.current = next;
        setDipping(null);
        dippingRef.current = null;
        setCountdown(3);
        setPos(getHome());
      }
    }, 1000);
  };

  const onPointerDown = (e) => {
    if (dippingRef.current) return;
    draggingRef.current = true;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const onPointerUp = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    let dropped = false;
    for (const c of TEMP_CONTAINERS) {
      if (measuredRef.current[c.id] !== undefined) continue;
      const el = containerRefs.current[c.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        startDip(c);
        dropped = true;
        break;
      }
    }
    if (!dropped) setPos(getHome());
  };

  const pickAnswer = (id) => {
    if (answer) return;
    setAnswer(id);
    const correct = id === "pondA";
    setIsCorrect(correct);
    if (correct) setTimeout(onDone, 900);
    else setTimeout(() => { setAnswer(null); setIsCorrect(null); }, 1000);
  };

  if (phase === "question") {
    return (
      <div style={{ padding: "20px 0" }}>
        <p style={{ margin: "0 0 20px", fontFamily: "Nunito", fontWeight: 800, fontSize: 17, textAlign: "center" }}>
          Which sample was the hottest?
        </p>
        {answer && (
          <div style={{
            marginBottom: 14, padding: "10px 16px", borderRadius: 10, textAlign: "center",
            background: isCorrect ? "#dcfce7" : "#fee2e2",
            color: isCorrect ? "#166534" : "#991b1b",
            fontFamily: "Nunito", fontWeight: 800, fontSize: 14,
          }}>
            {isCorrect
              ? `Correct! Pond A is hottest at ${measured.pondA}°C — dangerously warm.`
              : "Not the hottest — look at those numbers again!"}
          </div>
        )}
        <div style={{ display: "flex", gap: 14 }}>
          {TEMP_CONTAINERS.map(c => {
            const isSelected = answer === c.id;
            return (
              <button
                key={c.id}
                onClick={() => pickAnswer(c.id)}
                disabled={!!answer}
                className="card"
                style={{
                  flex: 1, padding: "18px 10px", textAlign: "center",
                  cursor: answer ? "default" : "pointer",
                  border: isSelected
                    ? `2.5px solid ${isCorrect ? "#22c55e" : "#ef4444"}`
                    : "1.5px solid var(--line)",
                  background: isSelected ? (isCorrect ? "#dcfce7" : "#fef2f2") : "var(--bg-elev)",
                  transition: "all .2s",
                }}
                onMouseEnter={e => !answer && (e.currentTarget.style.transform = "translateY(-4px)")}
                onMouseLeave={e => !answer && (e.currentTarget.style.transform = "")}
              >
                <div style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 14, color: c.labelColor, marginBottom: 8 }}>
                  {c.label}
                </div>
                <div style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 26, color: "#ef4444" }}>
                  {measured[c.id]}°C
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 0 4px" }}>
      <p style={{ margin: "0 0 8px", fontWeight: 600, color: "var(--text-soft)", fontSize: 13 }}>
        Grab the thermometer and drag it into a container. Hold 3 s for a reading.
      </p>
      <div
        ref={areaRef}
        style={{
          position: "relative", height: 316,
          background: "linear-gradient(180deg, #fef9c3 0%, #fde68a 100%)",
          borderRadius: 14, border: "2px solid var(--line)",
          touchAction: "none", userSelect: "none", overflow: "visible",
        }}
      >
        {/* containers row */}
        <div style={{
          position: "absolute", bottom: 14, left: 0, right: 0,
          display: "flex", justifyContent: "space-around", alignItems: "flex-end",
          padding: "0 12px",
        }}>
          {TEMP_CONTAINERS.map(c => {
            const isDone = measured[c.id] !== undefined;
            const isCurrentDip = dipping === c.id;
            return (
              <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ height: 120, display: "flex", alignItems: "center" }}>
                  {isCurrentDip && (
                    <div style={{
                      fontFamily: "Nunito", fontWeight: 900, fontSize: 22, color: "#ef4444",
                      background: "white", borderRadius: 999, padding: "2px 12px",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
                    }}>
                      {countdown}s
                    </div>
                  )}
                </div>
                <div ref={el => containerRefs.current[c.id] = el}>
                  <ContainerBeaker id={c.id} waterColor={c.waterColor} dipping={isCurrentDip} isDone={isDone} />
                </div>
                <div style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 13, color: c.labelColor }}>
                  {c.label}
                </div>
                <div style={{
                  fontFamily: "Nunito", fontWeight: 900, fontSize: 17,
                  color: isDone ? "#ef4444" : "var(--text-muted)", minHeight: 24,
                }}>
                  {isDone ? `${measured[c.id]}°C` : "—"}
                </div>
              </div>
            );
          })}
        </div>

        {/* draggable thermometer — hidden while dipping (beaker shows it submerged) */}
        {!dipping && (
          <div
            style={{
              position: "absolute",
              left: pos.x, top: pos.y,
              transform: "translate(-50%, 0)",
              cursor: isDragging ? "grabbing" : "grab",
              transition: isDragging ? "none" : "left .38s cubic-bezier(.34,1.56,.64,1), top .38s cubic-bezier(.34,1.56,.64,1)",
              zIndex: 20,
              filter: isDragging
                ? "drop-shadow(0 10px 18px rgba(0,0,0,0.3))"
                : "drop-shadow(0 4px 6px rgba(0,0,0,0.18))",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <DragThermometer />
          </div>
        )}

        {/* hint */}
        {!isDragging && !dipping && Object.keys(measured).length === 0 && (
          <div style={{
            position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
            background: "rgba(28,20,16,0.72)", color: "#fde047",
            padding: "4px 14px", borderRadius: 999,
            fontFamily: "Nunito", fontWeight: 800, fontSize: 12,
            whiteSpace: "nowrap", pointerEvents: "none",
          }}>
            ☝ Grab & drag into a container
          </div>
        )}

        <div style={{
          position: "absolute", top: 12, right: 14,
          fontFamily: "Nunito", fontWeight: 800, fontSize: 12,
          color: "rgba(28,20,16,0.5)",
        }}>
          {Object.keys(measured).length}/{TEMP_CONTAINERS.length}
        </div>
      </div>
    </div>
  );
}

/* Pollution: 3-level match chemical signature — 1 vial, grows harder each level */
const POLLUTION_LEVELS = [
  {
    label: "Level 1",
    sequence: [
      { vialColor: "#f97316", correct: "metal" },
    ],
    options: [
      { id: "organic", label: "Organic matter",   color: "#22c55e" },
      { id: "metal",   label: "Industrial waste", color: "#f97316" },
      { id: "salt",    label: "Salt run-off",     color: "#3b82f6" },
    ],
  },
  {
    label: "Level 2",
    sequence: [
      { vialColor: "#f97316", correct: "metal" },
      { vialColor: "#8b5cf6", correct: "acid" },
    ],
    options: [
      { id: "organic", label: "Organic matter",   color: "#22c55e" },
      { id: "metal",   label: "Industrial waste", color: "#f97316" },
      { id: "salt",    label: "Salt run-off",     color: "#3b82f6" },
      { id: "acid",    label: "Acid discharge",   color: "#8b5cf6" },
    ],
  },
  {
    label: "Level 3",
    sequence: [
      { vialColor: "#f97316", correct: "metal" },
      { vialColor: "#8b5cf6", correct: "acid" },
      { vialColor: "#dc2626", correct: "thermal" },
    ],
    options: [
      { id: "organic", label: "Organic matter",   color: "#22c55e" },
      { id: "metal",   label: "Industrial waste", color: "#f97316" },
      { id: "salt",    label: "Salt run-off",     color: "#3b82f6" },
      { id: "acid",    label: "Acid discharge",   color: "#8b5cf6" },
      { id: "thermal", label: "Thermal effluent", color: "#dc2626" },
    ],
  },
];

const shuffleArr = (arr) => [...arr].sort(() => Math.random() - 0.5);

function PollutionMiniGame({ onDone }) {
  const [level, setLevel] = useState(0);
  const [seqIdx, setSeqIdx] = useState(0);
  const [flash, setFlash] = useState(null); // "hit" | "miss" | null
  const [pickedWrong, setPickedWrong] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState(
    () => shuffleArr(POLLUTION_LEVELS[0].options),
  );

  const cfg = POLLUTION_LEVELS[level];
  const currentStep = cfg.sequence[seqIdx];

  const pick = (optId) => {
    if (flash) return;
    if (optId === currentStep.correct) {
      const isLastSeq = seqIdx >= cfg.sequence.length - 1;
      const isLastLevel = level >= POLLUTION_LEVELS.length - 1;
      setFlash("hit");
      setTimeout(() => {
        setFlash(null);
        if (!isLastSeq) {
          setSeqIdx(s => s + 1);
          setShuffledOptions(shuffleArr(cfg.options));
        } else if (!isLastLevel) {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          setSeqIdx(0);
          setShuffledOptions(shuffleArr(POLLUTION_LEVELS[nextLevel].options));
        } else {
          onDone();
        }
      }, 700);
    } else {
      setPickedWrong(optId);
      setFlash("miss");
      setTimeout(() => {
        setFlash(null);
        setPickedWrong(null);
        setLevel(0);
        setSeqIdx(0);
        setShuffledOptions(shuffleArr(POLLUTION_LEVELS[0].options));
      }, 900);
    }
  };

  return (
    <div style={{ padding: "20px 0" }}>
      {/* Top row: instruction + level dots */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p style={{ margin: 0, fontWeight: 600, color: "var(--text-soft)" }}>
          Match the vial to its chemical source.
        </p>
        <div style={{ display: "flex", gap: 6 }}>
          {POLLUTION_LEVELS.map((_, i) => (
            <span key={i} style={{
              width: 26, height: 26, borderRadius: 999,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Nunito", fontWeight: 900, fontSize: 12,
              background: i < level ? "#34d399" : i === level ? currentStep.vialColor : "#e5e7eb",
              color: i <= level ? "white" : "#9ca3af",
              border: i === level ? "2px solid #1c1410" : "2px solid transparent",
            }}>
              {i < level ? "✓" : i + 1}
            </span>
          ))}
        </div>
      </div>

      {/* Vial progress dots within the current level */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {cfg.sequence.map((step, i) => (
          <span key={i} style={{
            width: 10, height: 10, borderRadius: 999,
            background: i < seqIdx ? "#34d399" : i === seqIdx ? step.vialColor : "#e5e7eb",
            border: i === seqIdx ? "2px solid #1c1410" : "2px solid transparent",
            transition: "background 0.4s ease",
          }} />
        ))}
      </div>

      {/* Flash banner */}
      {flash && (
        <div style={{
          marginBottom: 12, padding: "8px 14px", borderRadius: 10,
          background: flash === "miss" ? "#fee2e2" : "#dcfce7",
          color: flash === "miss" ? "#991b1b" : "#166534",
          fontFamily: "Nunito", fontWeight: 800, fontSize: 14, textAlign: "center",
        }}>
          {flash === "hit" && seqIdx < cfg.sequence.length - 1 && "Correct! Vial changing…"}
          {flash === "hit" && seqIdx === cfg.sequence.length - 1 && level < POLLUTION_LEVELS.length - 1 && "Level up!"}
          {flash === "hit" && seqIdx === cfg.sequence.length - 1 && level === POLLUTION_LEVELS.length - 1 && "All identified!"}
          {flash === "miss" && "Wrong — back to level 1!"}
        </div>
      )}

      {/* Main: single vial (left) + options (right) */}
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          padding: 10, borderRadius: 12,
          border: "2px solid #1c1410",
          background: "#fef3c7",
          animation: "ml-btn-glow 1.4s ease-in-out infinite",
          flexShrink: 0,
        }}>
          <PollutionTube color={currentStep.vialColor} />
          <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "Nunito", color: "var(--text-soft)" }}>
            Pond A
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {shuffledOptions.map(o => {
            const isWrong = pickedWrong === o.id;
            return (
              <button key={o.id} onClick={() => pick(o.id)}
                className="card lift"
                style={{
                  padding: "9px 14px", display: "flex", gap: 10, alignItems: "center",
                  cursor: flash ? "default" : "pointer",
                  border: isWrong ? "2px solid #ef4444" : "1.5px solid var(--line)",
                  background: isWrong ? "#fef2f2" : "var(--bg-elev)",
                  transition: "border .15s, background .15s",
                }}>
                <span style={{ width: 18, height: 18, background: o.color, borderRadius: 4, flexShrink: 0 }} />
                <span style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 14 }}>{o.label}</span>
                {isWrong && <Lucide name="x" size={15} color="#ef4444" />}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: "var(--text-soft)", fontFamily: "Nunito", textAlign: "right" }}>
        {cfg.label} · vial {seqIdx + 1}/{cfg.sequence.length} · more choices each round
      </div>
    </div>
  );
}

/* Microscope: find hidden metallic virus particles */
const MICRO_TARGETS = [
  { x: 25, y: 35, vx:  0.38, vy:  0.26 },
  { x: 62, y: 52, vx: -0.58, vy:  0.44 },
  { x: 72, y: 22, vx:  0.24, vy: -0.65 },
  { x: 38, y: 68, vx: -0.46, vy: -0.32 },
];

function MetallicVirus({ uid }) {
  const bodyR = 11, spikeLen = 7, tipR = 2.5, numSpikes = 10;
  const cx = 22, dim = 44;
  return (
    <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} style={{ display: "block" }}>
      <defs>
        <radialGradient id={`mvb-${uid}`} cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#d0e4ee" />
          <stop offset="50%" stopColor="#6a90a4" />
          <stop offset="100%" stopColor="#243c4e" />
        </radialGradient>
        <radialGradient id={`mvs-${uid}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#b8d0de" />
          <stop offset="100%" stopColor="#2e5060" />
        </radialGradient>
      </defs>
      {Array.from({ length: numSpikes }, (_, i) => {
        const a = (i / numSpikes) * Math.PI * 2 - Math.PI / 2;
        const x1 = cx + Math.cos(a) * bodyR * 0.9;
        const y1 = cx + Math.sin(a) * bodyR * 0.9;
        const x2 = cx + Math.cos(a) * (bodyR + spikeLen);
        const y2 = cx + Math.sin(a) * (bodyR + spikeLen);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={`url(#mvs-${uid})`} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={x2} cy={y2} r={tipR} fill={`url(#mvs-${uid})`} stroke="#182e3a" strokeWidth="0.8" />
          </g>
        );
      })}
      <circle cx={cx} cy={cx} r={bodyR} fill={`url(#mvb-${uid})`} stroke="#182e3a" strokeWidth="1.8" />
      <ellipse cx={cx - 3.5} cy={cx - 3.5} rx={3.5} ry={2} fill="rgba(255,255,255,0.5)" transform={`rotate(-35 ${cx - 3.5} ${cx - 3.5})`} />
    </svg>
  );
}

function MicroMiniGame({ onDone }) {
  const [found, setFound] = useState([]);
  const stateRef = useRef(MICRO_TARGETS.map(t => ({ x: t.x, y: t.y, vx: t.vx, vy: t.vy })));
  const [positions, setPositions] = useState(MICRO_TARGETS.map(t => ({ x: t.x, y: t.y })));

  useEffect(() => {
    if (found.length === MICRO_TARGETS.length) {
      const t = setTimeout(onDone, 800);
      return () => clearTimeout(t);
    }
  }, [found, onDone]);

  useEffect(() => {
    const id = setInterval(() => {
      stateRef.current = stateRef.current.map((s, i) => {
        if (found.includes(i)) return s;
        let { x, y, vx, vy } = s;
        x += vx; y += vy;
        const m = 13;
        if (x < m)       { x = m;       vx =  Math.abs(vx); }
        if (x > 100 - m) { x = 100 - m; vx = -Math.abs(vx); }
        if (y < m)       { y = m;       vy =  Math.abs(vy); }
        if (y > 100 - m) { y = 100 - m; vy = -Math.abs(vy); }
        return { x, y, vx, vy };
      });
      setPositions(stateRef.current.map(s => ({ x: s.x, y: s.y })));
    }, 30);
    return () => clearInterval(id);
  }, [found]);

  return (
    <div style={{ padding: "20px 0" }}>
      <p style={{ marginTop: 0, fontWeight: 600, color: "var(--text-soft)" }}>
        Click all {MICRO_TARGETS.length} metallic contaminants. Found: {found.length}/{MICRO_TARGETS.length}
      </p>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1.6",
        borderRadius: 999,
        background: "radial-gradient(circle, rgba(20,184,166,0.3), rgba(20,184,166,0.05))",
        border: "8px solid #1c1410",
        overflow: "hidden",
      }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} style={{
            position: "absolute",
            left: `${(i * 37) % 95}%`,
            top: `${(i * 53) % 90}%`,
            width: 12, height: 12,
            borderRadius: 999,
            background: "rgba(20,184,166,0.4)",
            border: "1px solid rgba(20,184,166,0.6)",
          }} />
        ))}
        {MICRO_TARGETS.map((_, i) => {
          const got = found.includes(i);
          const pos = positions[i];
          return (
            <button
              key={i}
              onClick={() => !got && setFound(f => [...f, i])}
              style={{
                position: "absolute",
                left: `${pos.x}%`, top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
                width: 44, height: 44,
                background: "none", border: "none", padding: 0,
                cursor: got ? "default" : "pointer",
                display: "grid", placeItems: "center",
              }}
            >
              {got ? (
                <div style={{
                  width: 30, height: 30, borderRadius: 999,
                  background: "var(--teal-500)",
                  display: "grid", placeItems: "center",
                  border: "2.5px solid white",
                  boxShadow: "0 0 0 3px rgba(20,184,166,0.4)",
                }}>
                  <Lucide name="check" size={14} strokeWidth={3} color="white" />
                </div>
              ) : (
                <MetallicVirus uid={i} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MiniGameResults({ test, onClose }) {
  return (
    <div className="bounce-in">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <ResultCard pond="A" value={test.resultA} sick />
        <ResultCard pond="B" value={test.resultB} />
      </div>
      <div className="card" style={{ background: "var(--orange-50)", padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
        <DetectiveHoot size={48} />
        <div style={{ flex: 1, fontFamily: "Kalam", fontSize: 16, fontWeight: 600 }}>
          {test.verdict === "support" && `Big difference between ponds! Strong evidence.`}
          {test.verdict === "partial" && `There's a difference, but it might not be the whole story.`}
        </div>
        <button className="btn" onClick={onClose}>Got it <Lucide name="check" size={14} /></button>
      </div>
    </div>
  );
}

function ResultCard({ pond, value, sick }) {
  return (
    <div className="card" style={{ padding: 14, borderColor: sick ? "#fca5a5" : "#86efac", background: sick ? "#fef2f2" : "#f0fdf4" }}>
      <div className="uppercase-eyebrow" style={{ color: sick ? "#b91c1c" : "#166534" }}>Pond {pond}</div>
      <div className="text-mono" style={{ fontSize: 18, fontWeight: 700, marginTop: 6, color: sick ? "#7f1d1d" : "#14532d" }}>{value}</div>
    </div>
  );
}

export { LabScreen };
