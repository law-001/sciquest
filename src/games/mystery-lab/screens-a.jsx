/* ============================================================
   Mystery Lab — Screens part 1
   0. Cinematic Intro
   1. Opening Story
   2. Investigation Map
   ============================================================ */
import React, { useState, useEffect, useRef } from "react";
import { mlAudio } from "./audio.js";
import ExpeditionMap from "./ExpeditionMap.jsx";
import { DetectiveHoot, Lucide, NotebookBadge, CrimeTape } from "./shared.jsx";
import {
  Pond, Tree, Factory, Cloud,
  Butterfly,
  Bird,
} from "./world.jsx";

/* ===== Screen 0: Cinematic Intro ===== */
const PANELS = [
  {
    id: "peaceful",
    label: "Maple Creek",
    time: "Tuesday · 7:00 AM",
    mood: "happy",
    accent: "#f97316",
    speech: "Ahh, Maple Creek. Normally the most peaceful spot in the county. Two ponds, clean water, happy fish. The kind of place where nothing ever goes wrong...",
  },
  {
    id: "alarm",
    label: "Pond A — Emergency",
    time: "Friday · 6:45 AM",
    mood: "stern",
    accent: "#dc2626",
    speech: "Until three days ago. Dozens of fish found belly-up, overnight. Dead. Mayor Lin called me in a complete panic. I've investigated a lot of cases — but I've never seen anything like this.",
  },
  {
    id: "compare",
    label: "Pond B — 200 Metres Away",
    time: "Same day · 9:15 AM",
    mood: "thinking",
    accent: "#0d9488",
    speech: "Then I checked Pond B. Two hundred metres down the creek. Completely fine — healthy fish, clear water. Same source. Same rain. Same season. If everything is the same... why is only ONE pond dying?",
  },
  {
    id: "mission",
    label: "Investigation HQ",
    time: "Right now",
    mood: "happy",
    accent: "#f97316",
    speech: "That mystery is exactly why I need YOU, detective. Observe both ponds. Run experiments in the lab. Pin the evidence. Then write the case report for the Mayor. Science is the only way to crack this. Are you ready?",
  },
];

const CUTSCENE_ART = "/games/mystery-lab/cutscene/";

function CutsceneArt({ file, className }) {
  return <img className={`ml-cutscene-art ${className}`} src={`${CUTSCENE_ART}${file}`} alt="" aria-hidden="true" draggable="false" />;
}

function PanelScenePeaceful() {
  return (
    <div className="ml-cinematic-scene ml-scene-peaceful" style={{ position: "absolute", inset: 0, background: "#b8e9f0", overflow: "hidden" }}>
      <CutsceneArt file="backdrop-peaceful.png" className="ml-cutscene-backdrop" />
      <Bird x={-100} y={60} size={16} duration={13} delay={-4} />
      <Bird x={-100} y={94} size={12} duration={18} delay={-10} />
      <Butterfly x={380} y={362} size={24} color="#fb923c" />
      <Butterfly x={760} y={392} size={20} color="#f472b6" />
      <CutsceneArt file="pond-healthy.png" className="ml-cutscene-pond ml-cutscene-pond-peaceful" />
      <CutsceneArt file="foreground-grove.png" className="ml-cutscene-grove" />
    </div>
  );
}

function PanelSceneAlarm() {
  return (
    <div className="ml-cinematic-scene ml-scene-alarm" style={{ position: "absolute", inset: 0, background: "#332526", overflow: "hidden" }}>
      <CutsceneArt file="backdrop-alarm.png" className="ml-cutscene-backdrop" />
      <div className="ml-scene-haze" aria-hidden="true" />
      <div className="ml-scene-embers" aria-hidden="true" />
      <CutsceneArt file="pollution-plume.png" className="ml-cutscene-smoke" />
      <CutsceneArt file="pond-polluted.png" className="ml-cutscene-pond ml-cutscene-pond-alarm" />
      <CutsceneArt file="alarm-marsh-frame.png" className="ml-cutscene-alarm-frame" />
    </div>
  );
}

function PanelSceneCompare() {
  return (
    <div className="ml-cinematic-scene ml-scene-compare" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <CutsceneArt file="backdrop-compare-healthy.png" className="ml-cutscene-compare-backdrop ml-cutscene-compare-backdrop-healthy" />
      <CutsceneArt file="backdrop-compare-polluted.png" className="ml-cutscene-compare-backdrop ml-cutscene-compare-backdrop-polluted" />
      <div className="ml-compare-seam" aria-hidden="true" />
      <div className="ml-compare-vignette" aria-hidden="true" />
      <CutsceneArt file="compare-healthy-bank.png" className="ml-cutscene-compare-bank ml-cutscene-compare-healthy" />
      <CutsceneArt file="compare-polluted-bank.png" className="ml-cutscene-compare-bank ml-cutscene-compare-polluted" />
      <CutsceneArt file="pond-healthy.png" className="ml-cutscene-pond ml-cutscene-pond-compare-healthy" />
      <CutsceneArt file="pond-polluted.png" className="ml-cutscene-pond ml-cutscene-pond-compare-polluted" />
      <div className="ml-compare-question" aria-hidden="true">?</div>
    </div>
  );
}

function PanelSceneMission() {
  return (
    <div className="ml-cinematic-scene ml-scene-mission" style={{ position: "absolute", inset: 0, background: "#b8e9f0", overflow: "hidden" }}>
      <CutsceneArt file="backdrop-mission.png" className="ml-cutscene-backdrop" />
      <div className="ml-mission-rays" aria-hidden="true" />
      <Bird x={-100} y={52} size={14} duration={15} delay={-5} />
      <Bird x={-100} y={88} size={11} duration={20} delay={-12} />
      {/* Hoot centred, floats */}
      <div className="float ml-hoot-hero-wrap" style={{ position: "absolute", top: "46%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 4 }}>
        <img className="ml-hoot-hero" src="/games/mystery-lab/detective-hoot.png" alt="Detective Hoot holding a magnifying glass" draggable="false" />
      </div>
    </div>
  );
}

function IntroScreen({ go }) {
  const [panel, setPanel] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  const current = PANELS[panel];
  const isLast = panel === PANELS.length - 1;

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    clearInterval(timerRef.current);
    let i = 0;
    const full = current.speech;
    timerRef.current = setInterval(() => {
      i++;
      setDisplayed(full.slice(0, i));
      if (i % 5 === 0) mlAudio.tick();
      if (i >= full.length) {
        clearInterval(timerRef.current);
        setDone(true);
      }
    }, 22);
    return () => clearInterval(timerRef.current);
  }, [panel]);

  const advance = () => {
    mlAudio.click();
    if (!done) {
      clearInterval(timerRef.current);
      setDisplayed(current.speech);
      setDone(true);
    } else if (!isLast) {
      setPanel(p => p + 1);
    } else {
      go("map");
    }
  };

  const sceneMap = {
    peaceful: <PanelScenePeaceful />,
    alarm:    <PanelSceneAlarm />,
    compare:  <PanelSceneCompare />,
    mission:  <PanelSceneMission />,
  };

  return (
    <div
      data-screen-label="00 Intro"
      onClick={advance}
      style={{
        position: "relative", height: "100%",
        display: "flex", flexDirection: "column",
        cursor: "pointer", userSelect: "none",
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      {/* ── Scene illustration ── */}
      <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden" }}>
        {sceneMap[current.id]}

        {/* location caption box — bottom-left of scene */}
        <div style={{
          position: "absolute", bottom: 14, left: 18,
          background: "rgba(28,20,16,0.82)",
          color: "#fef9c3",
          padding: "5px 14px 6px",
          borderRadius: 6,
          fontFamily: "Trebuchet MS, system-ui, sans-serif", fontWeight: 800, fontSize: 13,
          letterSpacing: "0.04em",
          backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}>
          <Lucide name="pin" size={12} color={current.accent} />
          {current.label}
          <span style={{ fontWeight: 500, opacity: 0.65, fontSize: 11, marginLeft: 4 }}>{current.time}</span>
        </div>

        {/* panel counter top-right */}
        <div style={{
          position: "absolute", top: 14, right: 18,
          background: "rgba(28,20,16,0.75)",
          color: "rgba(253,246,227,0.75)",
          padding: "4px 10px",
          borderRadius: 999,
          fontFamily: "Trebuchet MS, system-ui, sans-serif", fontWeight: 800, fontSize: 11,
          letterSpacing: "0.08em",
        }}>
          {panel + 1} / {PANELS.length}
        </div>

        {/* skip button — bottom-right so it clears the shell's overlay Back pill (top-left) */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); go("map"); }}
          style={{
            position: "absolute", bottom: 14, right: 18,
            background: "rgba(28,20,16,0.65)",
            color: "rgba(253,246,227,0.75)",
            border: "none", padding: "5px 12px",
            borderRadius: 999,
            fontFamily: "Trebuchet MS, system-ui, sans-serif", fontWeight: 800, fontSize: 11,
            cursor: "pointer", letterSpacing: "0.06em",
          }}
        >
          Skip intro
        </button>
      </div>

      {/* ── Speech strip ── */}
      <div style={{
        flexShrink: 0,
        background: "var(--bg-elev)",
        borderTop: "2px solid var(--line)",
        display: "flex", flexDirection: "column",
        padding: "12px 20px 12px",
        gap: 8,
      }}>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          {/* Hoot */}
          <div style={{ flexShrink: 0 }}>
            <DetectiveHoot size={58} mood={current.mood} />
          </div>

          {/* typewriter text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 9, fontWeight: 800, letterSpacing: "0.12em",
              textTransform: "uppercase", color: current.accent,
              fontFamily: "Trebuchet MS, system-ui, sans-serif", marginBottom: 4,
            }}>
              Hoot says
            </div>
            <p style={{
              margin: 0,
              fontFamily: "Trebuchet MS, system-ui, sans-serif", fontWeight: 600,
              fontSize: "clamp(12px, 1.4vw, 14px)",
              lineHeight: 1.5,
              color: "var(--text)",
            }}>
              {displayed}
              {!done && (
                <span style={{
                  display: "inline-block", width: 2, height: "1em",
                  background: current.accent,
                  marginLeft: 2, verticalAlign: "text-bottom",
                  animation: "ml-shimmer 0.7s ease-in-out infinite",
                }} />
              )}
            </p>
          </div>
        </div>

        {/* bottom row: dots + action */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* step dots */}
          <div style={{ display: "flex", gap: 7 }}>
            {PANELS.map((_, i) => (
              <div key={i} style={{
                width: i === panel ? 22 : 8, height: 8, borderRadius: 999,
                background: i === panel ? current.accent : "var(--line)",
                transition: "all .25s",
              }} />
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {!done && (
              <span style={{
                fontSize: 11, fontWeight: 700, color: "var(--muted)",
                fontFamily: "Trebuchet MS, system-ui, sans-serif", letterSpacing: "0.06em",
                animation: "ml-shimmer 1.4s ease-in-out infinite",
              }}>
                tap to skip text
              </span>
            )}
            {done && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); advance(); }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "9px 20px",
                  borderRadius: 999,
                  border: "none",
                  background: current.accent,
                  color: "#fff",
                  fontFamily: "Trebuchet MS, system-ui, sans-serif", fontWeight: 900, fontSize: 14,
                  cursor: "pointer",
                  boxShadow: `0 4px 0 rgba(0,0,0,0.22), 0 0 0 3px ${current.accent}33`,
                  animation: "ml-btn-glow 2s ease-in-out infinite",
                }}
              >
                {isLast ? (
                  <><Lucide name="search" size={16} color="#fff" /> Start Investigating</>
                ) : (
                  <>Next <Lucide name="chevronRight" size={16} color="#fff" /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Screen 1: Opening Story ===== */
function LegacyOpeningScreen({ go }) {
  useEffect(() => { mlAudio.startAmbient(); }, []);
  return (
    <div data-screen-label="01 Opening" style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* hero scene */}
      <div className="card ml-opening-card" style={{
        position: "relative",
        padding: 0,
        overflow: "hidden",
        borderRadius: 24,
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}>
        {/* sky gradient */}
        <div className="ml-opening-hero" style={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          background: "linear-gradient(180deg, #fef3c7 0%, #fed7aa 40%, #fcd34d 70%, #84cc16 100%)",
          padding: "24px 40px",
          overflow: "hidden",
        }}>
          {/* sun */}
          <div style={{
            position: "absolute", top: 20, right: 44,
            width: 64, height: 64, borderRadius: 999,
            background: "radial-gradient(circle, #fef9c3, #facc15)",
            boxShadow: "0 0 50px 16px rgba(250,204,21,0.4)"
          }} />
          {/* clouds */}
          <Cloud style={{ top: 40, left: 30 }} />
          <Cloud style={{ top: 80, left: 240, transform: "scale(0.75)" }} />

          {/* crime tape */}
          <CrimeTape angle={-3} top={110} text="CASE #001 · POND CONTAMINATION · " />

          <div className="ml-opening-grid" style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 28,
            alignItems: "center",
            height: "100%",
            position: "relative",
            zIndex: 2,
          }}>
            <div>
              <div className="tag" style={{ background: "#1c1410", color: "#fde047" }}>
                <Lucide name="sparkles" size={12} />
                Episode 01 · Grade 7 Science
              </div>
              <h1 style={{
                fontFamily: "Nunito, sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                fontSize: "clamp(26px, 4vw, 44px)",
                lineHeight: 1.02,
                marginTop: 12,
                color: "rgb(28, 20, 16)",
                position: "relative",
                zIndex: 3,
                textShadow: [
                  "3px 0 0 #fffaee", "-3px 0 0 #fffaee",
                  "0 3px 0 #fffaee", "0 -3px 0 #fffaee",
                  "2px 2px 0 #fffaee", "-2px 2px 0 #fffaee",
                  "2px -2px 0 #fffaee", "-2px -2px 0 #fffaee",
                  "0 8px 20px rgba(28,20,16,0.18)"
                ].join(",")
              }}>
                The Dying<br />
                Pond Mystery
              </h1>
              <p className="ml-opening-desc" style={{ fontSize: 15, color: "#3d2e22", maxWidth: 460, marginTop: 10, lineHeight: 1.45, fontWeight: 500 }}>
                Something's wrong at Maple Creek. The fish in <b>Pond A</b> are dying.
                The fish in <b>Pond B</b>, just 200 metres away, are fine.
                The Mayor needs a junior science detective. You in?
              </p>
              <div className="row gap-3 ml-opening-btns" style={{ marginTop: 18, alignItems: "center" }}>
                <button className="btn lg" onClick={() => go("intro")}>
                  <Lucide name="search" size={18} />
                  Start Investigation
                </button>
                <button className="btn ghost" onClick={() => go("notebook")}>
                  <Lucide name="book" size={14} />
                  Case briefing
                </button>
              </div>
              <div className="row gap-2 ml-opening-pills" style={{ marginTop: 16, flexWrap: "wrap" }}>
                <MissionPill icon="search" text="Observe" />
                <MissionPill icon="lightbulb" text="Hypothesise" />
                <MissionPill icon="flask" text="Test" />
                <MissionPill icon="clipboard" text="Conclude" />
              </div>
            </div>

            {/* right: scene illustration */}
            <div className="ml-opening-scene" style={{ position: "relative", height: "100%", minHeight: 280 }}>
              {/* mentor mascot */}
              <div className="float" style={{ position: "absolute", top: 10, right: 30, zIndex: 4 }}>
                <DetectiveHoot size={110} speechSide="left" speech="Welcome, detective! Bring your magnifying glass — and your curiosity." />
              </div>
              {/* ponds composition */}
              <div style={{ position: "absolute", bottom: -10, left: -20, transform: "rotate(-4deg) scale(0.85)", transformOrigin: "bottom left" }}>
                <Pond sick label="A" dead={4} />
              </div>
              <div style={{ position: "absolute", bottom: 60, right: -30, transform: "scale(0.6) rotate(6deg)", transformOrigin: "bottom right" }}>
                <Pond label="B" />
              </div>
              {/* factory in distance */}
              <div style={{ position: "absolute", top: 70, left: -10, transform: "scale(0.48)", transformOrigin: "top left" }}>
                <Factory />
              </div>
              {/* tree */}
              <div style={{ position: "absolute", bottom: 20, right: 110 }}>
                <Tree size={42} variant={1} />
              </div>
            </div>
          </div>

          {/* paper torn bottom */}
          <svg style={{ position: "absolute", left: 0, right: 0, bottom: -1, width: "100%" }} viewBox="0 0 1200 32" preserveAspectRatio="none">
            <path d="M0 32 L0 14 Q60 4 120 14 T240 14 T360 14 T480 14 T600 14 T720 14 T840 14 T960 14 T1080 14 T1200 14 L1200 32 Z" fill="var(--bg-elev)" />
          </svg>
        </div>

        {/* case file footer */}
        <div className="ml-opening-footer" style={{
          flexShrink: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 14,
          padding: "16px 40px 18px",
          background: "var(--bg-elev)"
        }}>
          <CaseFileRow label="Location" value="Maple Creek, Outskirts" icon="pin" />
          <CaseFileRow label="Reported by" value="Mayor Lin · 7 May 2026" icon="note" />
          <CaseFileRow label="Mentor" value="Detective Hoot · Field Sci." icon="sparkles" />
        </div>
      </div>
    </div>);

}

function OpeningScreen({ go }) {
  useEffect(() => { mlAudio.startAmbient(); }, []);
  return (
    <div data-screen-label="01 Opening" className="ml-opening" style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="card ml-opening-card" style={{ position: "relative", padding: 0, overflow: "hidden", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div
          className="ml-opening-hero"
        >
          <img
            className="ml-opening-map-art"
            src={`${import.meta.env.BASE_URL}games/mystery-lab/art/opening-map-v4.png`}
            alt=""
            aria-hidden="true"
          />
          <div className="ml-opening-map-wash" aria-hidden="true" />
          <div className="ml-opening-grid">
            <section className="ml-opening-copy" aria-labelledby="ml-opening-title">
              <h1 id="ml-opening-title" className="ml-opening-title">
                <img className="float" src={`${import.meta.env.BASE_URL}games/mystery-lab/art/dying-pond-title-lockup-v1.png`} alt="The Dying Pond Mystery" />
              </h1>
              {/*
              <p className="ml-opening-hoot-line"><strong>Detective Hoot:</strong> “Bring your magnifying glass — and your curiosity.”</p>
              */}
              <div className="row gap-3 ml-opening-btns">
                <button className="btn lg" onClick={() => go("intro")}>
                  <img className="ml-opening-button-art" src={`${import.meta.env.BASE_URL}games/mystery-lab/art/button-investigate-v1.png`} alt="" />
                  Start Investigation
                </button>
                <button className="btn ghost" onClick={() => go("notebook")}>
                  <img className="ml-opening-button-art" src={`${import.meta.env.BASE_URL}games/mystery-lab/art/button-briefing-v1.png`} alt="" />
                  Case briefing
                </button>
              </div>
            </section>
          </div>
        </div>
        <div className="ml-opening-footer">
          <CaseFileRow label="Location" value="Maple Creek, Outskirts" icon="pin" />
          <CaseFileRow label="Reported by" value="Mayor Lin · 7 May 2026" icon="note" />
          <CaseFileRow label="Mentor" value="Detective Hoot · Field Sci." icon="sparkles" />
        </div>
      </div>
    </div>
  );
}

function MissionPill({ icon, text }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "rgba(28,20,16,0.85)",
      color: "#fef9c3",
      padding: "8px 14px",
      borderRadius: 999,
      fontFamily: "Trebuchet MS, system-ui, sans-serif",
      fontWeight: 800,
      fontSize: 13,
      letterSpacing: "0.04em"
    }}>
      <Lucide name={icon} size={14} />
      {text}
    </div>);

}

function CaseFileRow({ label, value, icon }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: "var(--bg)", display: "grid", placeItems: "center",
        border: "1.5px solid var(--line)",
        color: "var(--primary)"
      }}>
        <Lucide name={icon} size={18} />
      </div>
      <div>
        <div className="uppercase-eyebrow">{label}</div>
        <div style={{ fontWeight: 700, fontFamily: "Trebuchet MS, system-ui, sans-serif" }}>{value}</div>
      </div>
    </div>);

}

/* ===== Screen 2: Investigation Map ===== */
function MapScreen({ go, setPond, visited, observations, hypotheses = [], experiments = [], pulse, isDark = false }) {
  const prevPulseRef = useRef(pulse);
  useEffect(() => {
    if (pulse && pulse !== prevPulseRef.current) mlAudio.mapPulse();
    prevPulseRef.current = pulse;
  }, [pulse]);

  useEffect(() => {
    mlAudio.startAmbient();
    return () => mlAudio.stopAmbient();
  }, []);

  return (
    <div data-screen-label="02 Map" className="ml-map-grid">
      <div className="card ml-map-card">
        <ExpeditionMap go={go} setPond={setPond} visited={visited} pulse={pulse} isDark={isDark} />
      </div>

      {/* Objectives panel */}
      <div className="col gap-3 ml-map-sidebar" style={{ minHeight: 0, overflow: "hidden" }}>
        <div className="card ml-mission-journal" style={{ padding: 20 }}>
          <div className="ml-journal-eyebrow">YOUR INVESTIGATION</div>
          <div className="row between" style={{ alignItems: "center" }}>
            <h3 className="title-lg" style={{ fontSize: 19 }}>Field journal</h3>
            <span className="chip teal">Case 001</span>
          </div>
          <div className="divider-dot" style={{ margin: "10px 0" }} />
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 7 }}>
            <Objective done={visited.includes("pondA")} text="Investigate Pond A" />
            <Objective done={visited.includes("pondB")} text="Compare with Pond B" />
            <Objective done={hypotheses.length > 0} text="Form 1–2 hypotheses" />
            <Objective done={visited.includes("lab")} text="Run experiments in the lab" />
            <Objective done={visited.includes("evidence")} text="Connect evidence + submit report" />
          </ul>
        </div>

        <div className="card" style={{
          padding: 12,
          background: hypotheses.length > 0 ? "var(--teal-50, #f0fdfa)" : "var(--orange-50)",
          borderColor: hypotheses.length > 0 ? "var(--teal-300, #5eead4)" : "var(--orange-200)",
          transition: "background .4s, border-color .4s",
        }}>
          <div className="row gap-2" style={{ alignItems: "flex-start" }}>
            <DetectiveHoot size={52} mood={hypotheses.length > 0 ? "happy" : undefined} />
            <div>
              <div className="uppercase-eyebrow" style={{ color: hypotheses.length > 0 ? "var(--teal-700, #0f766e)" : "var(--orange-700)" }}>
                {hypotheses.length > 0 ? "Hoot says" : "Mentor tip"}
              </div>
              <p style={{ margin: "4px 0 0", fontWeight: 600, fontSize: 12.5, lineHeight: 1.4 }}>
                {experiments.length > 0
                  ? <>Great lab work! Head to the <b>Evidence Board</b> and reconstruct the full story.</>
                  : hypotheses.length > 0
                    ? <>Good hypotheses! Now head to the <b>Lab Tent</b> to test them with real experiments.</>
                    : <>Start with <b>Pond A</b> — observe what's different. Healthy controls give you the comparison.</>}
              </p>
            </div>
          </div>
        </div>

        <NotebookBadge count={observations.length} onClick={() => go("notebook")} />
      </div>
    </div>);

}

function Objective({ done, text }) {
  return (
    <li style={{ display: "flex", gap: 10, alignItems: "center", fontFamily: "Trebuchet MS, system-ui, sans-serif", fontWeight: 700, fontSize: 14 }}>
      <span style={{
        width: 22, height: 22, borderRadius: 6,
        background: done ? "var(--teal-500)" : "transparent",
        border: done ? "0" : "2px solid var(--line)",
        display: "grid", placeItems: "center",
        color: "white"
      }}>
        {done && <Lucide name="check" size={14} strokeWidth={3} />}
      </span>
      <span style={{ textDecoration: done ? "line-through" : "none", color: done ? "var(--muted)" : "var(--text)" }}>{text}</span>
    </li>);

}

export { IntroScreen, OpeningScreen, MapScreen };
