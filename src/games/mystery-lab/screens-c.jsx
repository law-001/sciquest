/* ============================================================
   Mystery Lab — Screens part 3 (Lab Tent)
   ============================================================ */
import React, { useState, useEffect } from "react";
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

function LabScreen({ go, energy, setEnergy, experiments, addExperiment, hypotheses }) {
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
          <button className="btn" disabled={experiments.length < 2} onClick={() => go("evidence")} style={{ opacity: experiments.length < 2 ? 0.5 : 1 }}>
            To Evidence Board <Lucide name="chevronRight" size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* Lab bench */}
        <div className="card" style={{
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
        <div className="col gap-3">
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
function PollutionTube() {
  return (
    <svg width="60" height="84" viewBox="0 0 60 84">
      <rect x="22" y="8" width="16" height="60" rx="8" fill="#fdf6e3" stroke="#1c1410" strokeWidth="2" />
      <rect x="24" y="38" width="12" height="28" rx="6" fill="#f97316" />
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

/* pH: drag strip into water */
function PHMiniGame({ onDone }) {
  const [pos, setPos] = useState(0); // 0–100
  const [done, setDone] = useState(false);
  const onMove = (e) => {
    if (done) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = ((e.clientY ?? e.touches?.[0]?.clientY) - rect.top) / rect.height;
    setPos(Math.min(1, Math.max(0, y)) * 100);
    if (y > 0.7) {
      setDone(true);
      setTimeout(onDone, 800);
    }
  };
  return (
    <div onMouseMove={onMove} onTouchMove={onMove} style={{ height: 280, position: "relative", borderRadius: 14, background: "linear-gradient(180deg, #fef3c7 40%, #92400e 60%, #5b4530 100%)", overflow: "hidden", cursor: "ns-resize" }}>
      <div style={{ position: "absolute", left: "50%", top: `${pos}%`, transform: "translate(-50%, 0)", transition: done ? "top .4s" : "none" }}>
        <PHStrip color={done ? "#dc2626" : "#5eead4"} />
      </div>
      <div style={{ position: "absolute", left: 16, bottom: 16, color: "white", fontWeight: 700, fontFamily: "Nunito" }}>
        {done ? "Reading…" : "Drag the strip DOWN into Pond A water."}
      </div>
    </div>
  );
}

/* Oxygen: timing bar */
function OxygenMiniGame({ onDone }) {
  const [pos, setPos] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (done) return;
    let dir = 1;
    let p = 0;
    const id = setInterval(() => {
      p += dir * 3;
      if (p >= 100) dir = -1;
      if (p <= 0) dir = 1;
      setPos(p);
    }, 30);
    return () => clearInterval(id);
  }, [done]);
  const tap = () => {
    if (done) return;
    setDone(true);
    setTimeout(onDone, 800);
  };
  const inZone = pos > 40 && pos < 60;
  return (
    <div style={{ padding: "20px 0" }}>
      <p style={{ marginTop: 0, fontWeight: 600, color: "var(--text-soft)" }}>Tap when the needle is in the green zone.</p>
      <div style={{ height: 28, borderRadius: 999, background: "linear-gradient(90deg, #f87171, #f87171 38%, #34d399 38%, #34d399 62%, #f87171 62%, #f87171)", position: "relative", overflow: "hidden", border: "2px solid #1c1410" }}>
        <div style={{ position: "absolute", left: `${pos}%`, top: -4, transform: "translateX(-50%)", width: 6, height: 36, background: "#1c1410", borderRadius: 3 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
        <button className="btn lg" onClick={tap}>{done ? (inZone ? "Locked in!" : "Locked in!") : "Tap NOW"}</button>
      </div>
    </div>
  );
}

/* Temperature: drag thermometer */
function TempMiniGame({ onDone }) {
  const [val, setVal] = useState(22);
  const [done, setDone] = useState(false);
  return (
    <div style={{ padding: "20px 0" }}>
      <p style={{ marginTop: 0, fontWeight: 600, color: "var(--text-soft)" }}>Drag the slider to plunge the thermometer into the water. Hold for 3 seconds.</p>
      <div style={{ display: "flex", gap: 24, alignItems: "center", padding: 20 }}>
        <Thermometer />
        <input type="range" min="0" max="40" value={val} onChange={e => setVal(+e.target.value)}
          style={{ flex: 1, accentColor: "var(--primary)" }} />
        <div style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 36, color: "#ef4444", minWidth: 80 }}>{val}°C</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="btn lg" onClick={() => { setDone(true); setTimeout(onDone, 600); }}>{done ? "Reading…" : "Record reading"}</button>
      </div>
    </div>
  );
}

/* Pollution: match chemical signature */
function PollutionMiniGame({ onDone }) {
  const [picked, setPicked] = useState(null);
  const correct = "metal";
  const opts = [
    { id: "organic", label: "Organic matter",   color: "#22c55e" },
    { id: "metal",   label: "Industrial waste", color: "#f97316" },
    { id: "salt",    label: "Salt run-off",     color: "#3b82f6" },
  ];
  return (
    <div style={{ padding: "20px 0" }}>
      <p style={{ marginTop: 0, fontWeight: 600, color: "var(--text-soft)" }}>Match the colour reaction to its source.</p>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", padding: "20px 0" }}>
        <div className="card" style={{ padding: 16, textAlign: "center", width: 120 }}>
          <PollutionTube />
          <div style={{ fontSize: 12, marginTop: 6, fontWeight: 700 }}>Pond A sample</div>
        </div>
        <Lucide name="arrow" size={20} color="var(--muted)" />
        <div className="col gap-2">
          {opts.map(o => (
            <button key={o.id} onClick={() => { setPicked(o.id); setTimeout(onDone, 800); }}
              className="card lift" style={{
                padding: "8px 14px", display: "flex", gap: 8, alignItems: "center",
                cursor: "pointer",
                border: picked === o.id ? `2px solid ${o.id === correct ? "var(--teal-500)" : "#ef4444"}` : "1.5px solid var(--line)",
              }}>
              <span style={{ width: 18, height: 18, background: o.color, borderRadius: 4 }} />
              <span style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 14 }}>{o.label}</span>
              {picked === o.id && <Lucide name={o.id === correct ? "check" : "x"} size={16} color={o.id === correct ? "var(--teal-600)" : "#ef4444"} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Microscope: find hidden particles */
const MICRO_TARGETS = [
  { x: 22, y: 30 }, { x: 60, y: 50 }, { x: 75, y: 20 }, { x: 40, y: 70 },
];
function MicroMiniGame({ onDone }) {
  const targets = MICRO_TARGETS;
  const [found, setFound] = useState([]);
  useEffect(() => {
    if (found.length === targets.length) {
      const t = setTimeout(onDone, 800);
      return () => clearTimeout(t);
    }
  }, [found, targets.length, onDone]);
  return (
    <div style={{ padding: "20px 0" }}>
      <p style={{ marginTop: 0, fontWeight: 600, color: "var(--text-soft)" }}>Click all {targets.length} contaminants in the sample. Found: {found.length}/{targets.length}</p>
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1.6",
        borderRadius: 999,
        background: "radial-gradient(circle, rgba(20,184,166,0.3), rgba(20,184,166,0.05))",
        border: "8px solid #1c1410",
        overflow: "hidden",
      }}>
        {/* random cells */}
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
        {targets.map((t, i) => {
          const got = found.includes(i);
          return (
            <button key={i} onClick={() => !got && setFound(f => [...f, i])}
              style={{
                position: "absolute",
                left: `${t.x}%`, top: `${t.y}%`,
                transform: "translate(-50%, -50%)",
                width: 24, height: 24,
                borderRadius: 4,
                background: got ? "var(--teal-500)" : "#1c1410",
                border: got ? "0" : "2px solid #f97316",
                cursor: got ? "default" : "pointer",
                color: "white",
                display: "grid", placeItems: "center",
                fontSize: 12,
              }}>
              {got ? <Lucide name="check" size={14} strokeWidth={3} /> : "✦"}
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
