/* ============================================================
   Mystery Lab — Screens part 1
   0. Cinematic Intro
   1. Opening Story
   2. Investigation Map
   ============================================================ */
import React, { useState, useEffect, useRef } from "react";
import { mlAudio } from "./audio.js";
import { DetectiveHoot, Lucide, NotebookBadge, CrimeTape } from "./shared.jsx";
import {
  Pond, Tree, DeadTree, Factory, LabTent, Rock, Bush, GrassPatch, Signpost, Cloud,
  BackdropLayer, Butterfly, Dragonfly, Flower, DeadFlower, DeadShrub, Cattail, MudPatch, Footprints,
  BulletinBoard, Bird, AnimatedCloud,
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

function PanelScenePeaceful() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #7dd3fc 0%, #b8f0a0 55%, #84cc16 100%)", overflow: "hidden" }}>
      {/* sun */}
      <div style={{ position: "absolute", top: 16, right: 80, width: 68, height: 68, borderRadius: 999, background: "radial-gradient(circle, #fef9c3, #facc15)", boxShadow: "0 0 60px 22px rgba(250,204,21,0.5)" }} />
      <Cloud style={{ top: 26, left: 36 }} />
      <Cloud style={{ top: 48, left: 230, transform: "scale(0.72)" }} />
      <Cloud style={{ top: 20, right: 150, transform: "scale(0.82)" }} />
      <AnimatedCloud x={-200} y={30} scale={0.9} duration={26} delay={-6} />
      <Bird x={-100} y={35} size={16} duration={13} delay={-4} />
      <Bird x={-100} y={55} size={12} duration={18} delay={-10} />
      <Butterfly x={260} y={100} size={22} color="#fb923c" />
      <Butterfly x={380} y={80} size={18} color="#f472b6" />
      {/* background row — small, high up */}
      <div style={{ position: "absolute", bottom: 60, left: "8%"  }}><Tree size={38} variant={2} /></div>
      <div style={{ position: "absolute", bottom: 55, left: "22%" }}><Tree size={34} variant={0} /></div>
      <div style={{ position: "absolute", bottom: 58, left: "37%" }}><Tree size={36} variant={1} /></div>
      <div style={{ position: "absolute", bottom: 52, left: "62%" }}><Tree size={34} variant={2} /></div>
      <div style={{ position: "absolute", bottom: 60, right: "14%"}}><Tree size={38} variant={0} /></div>
      {/* midground row */}
      <div style={{ position: "absolute", bottom: 28, left: "4%"  }}><Tree size={56} variant={0} /></div>
      <div style={{ position: "absolute", bottom: 22, left: "17%" }}><Tree size={52} variant={2} /></div>
      <div style={{ position: "absolute", bottom: 30, left: "33%" }}><Tree size={50} variant={1} /></div>
      <div style={{ position: "absolute", bottom: 20, right: "18%"}}><Tree size={54} variant={0} /></div>
      <div style={{ position: "absolute", bottom: 26, right: "5%" }}><Tree size={58} variant={2} /></div>
      {/* foreground row — large */}
      <div style={{ position: "absolute", bottom: 0,  left: "0%"  }}><Tree size={82} variant={1} /></div>
      <div style={{ position: "absolute", bottom: 0,  left: "11%" }}><Tree size={74} variant={0} /></div>
      <div style={{ position: "absolute", bottom: 0,  right: "9%" }}><Tree size={78} variant={2} /></div>
      <div style={{ position: "absolute", bottom: 0,  right: "0%" }}><Tree size={86} variant={1} /></div>
      {/* pond */}
      <div style={{ position: "absolute", bottom: 8, left: "46%", transform: "translateX(-50%) scale(0.68)" }}>
        <Pond size={200} />
      </div>
    </div>
  );
}

function PanelSceneAlarm() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0f0200 0%, #5c1005 28%, #8b2410 55%, #4a1a06 100%)", overflow: "hidden" }}>
      {/* red glow from above */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 400, height: 140, background: "radial-gradient(ellipse, rgba(220,38,38,0.30) 0%, transparent 70%)", pointerEvents: "none" }} />
      {/* background dead trees */}
      <div style={{ position: "absolute", bottom: 48, left: "6%"  }}><DeadTree size={46} /></div>
      <div style={{ position: "absolute", bottom: 44, left: "20%" }}><DeadTree size={40} /></div>
      <div style={{ position: "absolute", bottom: 50, left: "35%" }}><DeadTree size={38} /></div>
      <div style={{ position: "absolute", bottom: 46, right: "20%"}}><DeadTree size={42} /></div>
      <div style={{ position: "absolute", bottom: 48, right: "6%" }}><DeadTree size={44} /></div>
      {/* midground */}
      <div style={{ position: "absolute", bottom: 20, left: "2%"  }}><DeadTree size={68} /></div>
      <div style={{ position: "absolute", bottom: 16, left: "16%" }}><DeadTree size={60} /></div>
      <div style={{ position: "absolute", bottom: 22, right: "15%"}}><DeadTree size={64} /></div>
      <div style={{ position: "absolute", bottom: 18, right: "2%" }}><DeadTree size={70} /></div>
      {/* foreground */}
      <div style={{ position: "absolute", bottom: 0, left: "0%"  }}><DeadTree size={92} /></div>
      <div style={{ position: "absolute", bottom: 0, right: "0%" }}><DeadTree size={88} /></div>
      {/* ground debris */}
      <div style={{ position: "absolute", bottom: 0, left: "30%", transform: "translateX(-50%)" }}><DeadShrub x={0} y={0} size={36} /></div>
      <div style={{ position: "absolute", bottom: 0, right: "28%", transform: "translateX(50%)" }}><DeadShrub x={0} y={0} size={30} /></div>
      {/* sick pond centred */}
      <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%) scale(0.88)" }}>
        <Pond sick size={270} dead={5} />
      </div>
    </div>
  );
}

function PanelSceneCompare() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, right: "50%", background: "linear-gradient(180deg, #7dd3fc 0%, #bbf7d0 52%, #84cc16 100%)" }} />
      <div style={{ position: "absolute", inset: 0, left: "50%",  background: "linear-gradient(180deg, #0f0200 0%, #5c1005 30%, #4a1a06 100%)" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 3, background: "rgba(28,20,16,0.55)", transform: "translateX(-50%)", zIndex: 2 }} />
      {/* healthy left — trees */}
      <div style={{ position: "absolute", bottom: 40, left: "3%"  }}><Tree size={44} variant={2} /></div>
      <div style={{ position: "absolute", bottom: 36, left: "14%" }}><Tree size={38} variant={0} /></div>
      <div style={{ position: "absolute", bottom: 14, left: "1%"  }}><Tree size={68} variant={1} /></div>
      <div style={{ position: "absolute", bottom: 10, left: "13%" }}><Tree size={58} variant={2} /></div>
      <div style={{ position: "absolute", bottom: 0,  left: "0%"  }}><Tree size={84} variant={0} /></div>
      <div style={{ position: "absolute", bottom: 6,  left: "28%", transform: "translateX(-50%) scale(0.6)" }}>
        <Pond size={190} label="B" />
      </div>
      {/* dead right — trees */}
      <div style={{ position: "absolute", bottom: 38, right: "3%"  }}><DeadTree size={46} /></div>
      <div style={{ position: "absolute", bottom: 34, right: "15%" }}><DeadTree size={40} /></div>
      <div style={{ position: "absolute", bottom: 12, right: "2%"  }}><DeadTree size={72} /></div>
      <div style={{ position: "absolute", bottom: 8,  right: "14%" }}><DeadTree size={60} /></div>
      <div style={{ position: "absolute", bottom: 0,  right: "0%"  }}><DeadTree size={88} /></div>
      <div style={{ position: "absolute", bottom: 4,  left: "74%", transform: "translateX(-50%) scale(0.6)" }}>
        <Pond sick size={190} label="A" dead={4} />
      </div>
      {/* question mark centred */}
      <div style={{
        position: "absolute", top: "36%", left: "50%", transform: "translate(-50%, -50%)",
        fontFamily: "Nunito", fontWeight: 900, fontSize: 80, lineHeight: 1,
        color: "#fef9c3", textShadow: "0 0 30px rgba(0,0,0,0.9), 0 4px 12px rgba(0,0,0,0.6)",
        pointerEvents: "none", zIndex: 3,
      }}>?</div>
    </div>
  );
}

function PanelSceneMission() {
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #7dd3fc 0%, #fef3c7 30%, #fed7aa 60%, #84cc16 100%)", overflow: "hidden" }}>
      <Cloud style={{ top: 18, left: 30 }} />
      <Cloud style={{ top: 40, right: 70, transform: "scale(0.78)" }} />
      <Cloud style={{ top: 12, left: "40%", transform: "scale(0.65)" }} />
      <AnimatedCloud x={-200} y={22} scale={0.85} duration={30} delay={-10} />
      <Bird x={-100} y={28} size={14} duration={15} delay={-5} />
      <Bird x={-100} y={48} size={11} duration={20} delay={-12} />
      {/* background row */}
      <div style={{ position: "absolute", bottom: 64, left: "3%"  }}><Tree size={36} variant={2} /></div>
      <div style={{ position: "absolute", bottom: 60, left: "14%" }}><Tree size={32} variant={0} /></div>
      <div style={{ position: "absolute", bottom: 66, left: "25%" }}><Tree size={34} variant={1} /></div>
      <div style={{ position: "absolute", bottom: 62, right: "24%"}}><Tree size={34} variant={2} /></div>
      <div style={{ position: "absolute", bottom: 60, right: "13%"}}><Tree size={32} variant={0} /></div>
      <div style={{ position: "absolute", bottom: 64, right: "3%" }}><Tree size={36} variant={1} /></div>
      {/* midground row */}
      <div style={{ position: "absolute", bottom: 30, left: "1%"  }}><Tree size={58} variant={1} /></div>
      <div style={{ position: "absolute", bottom: 26, left: "10%" }}><Tree size={52} variant={0} /></div>
      <div style={{ position: "absolute", bottom: 32, left: "20%" }}><Tree size={48} variant={2} /></div>
      <div style={{ position: "absolute", bottom: 28, right: "19%"}}><Tree size={50} variant={1} /></div>
      <div style={{ position: "absolute", bottom: 24, right: "9%" }}><Tree size={54} variant={2} /></div>
      <div style={{ position: "absolute", bottom: 28, right: "0%" }}><Tree size={60} variant={0} /></div>
      {/* foreground row */}
      <div style={{ position: "absolute", bottom: 0, left: "0%"  }}><Tree size={86} variant={0} /></div>
      <div style={{ position: "absolute", bottom: 0, left: "8%"  }}><Tree size={76} variant={2} /></div>
      <div style={{ position: "absolute", bottom: 0, right: "7%" }}><Tree size={80} variant={1} /></div>
      <div style={{ position: "absolute", bottom: 0, right: "0%" }}><Tree size={90} variant={0} /></div>
      {/* Hoot centred, floats */}
      <div className="float" style={{ position: "absolute", top: "48%", left: "50%", transform: "translate(-50%, -54%)", zIndex: 4 }}>
        <DetectiveHoot size={150} mood="happy" />
      </div>
      {/* investigation props */}
      <svg style={{ position: "absolute", bottom: 22, left: "28%", opacity: 0.75, zIndex: 3 }} width="44" height="44" viewBox="0 0 48 48" fill="none">
        <circle cx="20" cy="20" r="12" stroke="#1c1410" strokeWidth="3" />
        <line x1="29" y1="29" x2="42" y2="42" stroke="#1c1410" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
      <svg style={{ position: "absolute", bottom: 18, right: "27%", opacity: 0.70, zIndex: 3 }} width="38" height="42" viewBox="0 0 42 42" fill="none">
        <rect x="6" y="4" width="30" height="36" rx="4" fill="#fdf6e3" stroke="#1c1410" strokeWidth="2.5" />
        <line x1="12" y1="14" x2="30" y2="14" stroke="#1c1410" strokeWidth="2" />
        <line x1="12" y1="21" x2="30" y2="21" stroke="#1c1410" strokeWidth="2" />
        <line x1="12" y1="28" x2="22" y2="28" stroke="#1c1410" strokeWidth="2" />
      </svg>
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
        borderRadius: 20, overflow: "hidden",
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
          fontFamily: "Nunito", fontWeight: 800, fontSize: 13,
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
          fontFamily: "Nunito", fontWeight: 800, fontSize: 11,
          letterSpacing: "0.08em",
        }}>
          {panel + 1} / {PANELS.length}
        </div>

        {/* skip button */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); go("map"); }}
          style={{
            position: "absolute", top: 14, left: 18,
            background: "rgba(28,20,16,0.65)",
            color: "rgba(253,246,227,0.75)",
            border: "none", padding: "5px 12px",
            borderRadius: 999,
            fontFamily: "Nunito", fontWeight: 800, fontSize: 11,
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
              fontFamily: "Nunito", marginBottom: 4,
            }}>
              Hoot says
            </div>
            <p style={{
              margin: 0,
              fontFamily: "Nunito", fontWeight: 600,
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
                fontFamily: "Nunito", letterSpacing: "0.06em",
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
                  fontFamily: "Nunito", fontWeight: 900, fontSize: 14,
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
function OpeningScreen({ go }) {
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

function MissionPill({ icon, text }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "rgba(28,20,16,0.85)",
      color: "#fef9c3",
      padding: "8px 14px",
      borderRadius: 999,
      fontFamily: "Nunito",
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
        <div style={{ fontWeight: 700, fontFamily: "Nunito" }}>{value}</div>
      </div>
    </div>);

}

/* ===== Screen 2: Investigation Map ===== */
const MAP_STARS = [
  { x: 4,  y: 2,  s: 2, d: 2.1, o: 0   },
  { x: 12, y: 5,  s: 3, d: 3.2, o: 0.5 },
  { x: 22, y: 3,  s: 2, d: 1.8, o: 1.1 },
  { x: 31, y: 7,  s: 2, d: 2.5, o: 0.3 },
  { x: 43, y: 4,  s: 3, d: 3.0, o: 0.8 },
  { x: 53, y: 2,  s: 2, d: 2.3, o: 1.4 },
  { x: 62, y: 6,  s: 2, d: 1.9, o: 0.2 },
  { x: 71, y: 3,  s: 3, d: 2.7, o: 0.9 },
  { x: 82, y: 5,  s: 2, d: 2.4, o: 1.6 },
  { x: 91, y: 2,  s: 3, d: 3.1, o: 0.4 },
  { x: 7,  y: 11, s: 2, d: 1.7, o: 1.2 },
  { x: 18, y: 13, s: 2, d: 2.8, o: 0.6 },
  { x: 36, y: 9,  s: 3, d: 3.3, o: 1.0 },
  { x: 49, y: 14, s: 2, d: 2.1, o: 0.7 },
  { x: 58, y: 11, s: 2, d: 1.8, o: 1.5 },
  { x: 74, y: 14, s: 3, d: 2.6, o: 0.1 },
  { x: 86, y: 12, s: 2, d: 3.0, o: 1.3 },
  { x: 94, y: 9,  s: 2, d: 2.2, o: 0.8 },
  { x: 26, y: 16, s: 2, d: 1.9, o: 1.7 },
  { x: 67, y: 18, s: 3, d: 2.5, o: 0.5 },
  { x: 8,  y: 8,  s: 4, d: 4.0, o: 0   },
  { x: 47, y: 6,  s: 4, d: 3.5, o: 1.0 },
  { x: 78, y: 9,  s: 4, d: 4.2, o: 0.5 },
];

const MAP_FIREFLIES = [
  { x: 95,  y: 215, d: 2.1, o: 0   },
  { x: 162, y: 272, d: 1.8, o: 0.7 },
  { x: 128, y: 334, d: 2.5, o: 1.3 },
  { x: 62,  y: 358, d: 1.9, o: 0.4 },
  { x: 204, y: 304, d: 2.3, o: 1.0 },
  { x: 244, y: 346, d: 2.8, o: 0.6 },
  { x: 108, y: 436, d: 2.0, o: 1.5 },
  { x: 178, y: 482, d: 1.7, o: 0.2 },
  { x: 292, y: 406, d: 2.4, o: 0.9 },
  { x: 268, y: 464, d: 2.2, o: 1.4 },
];

function MapScreen({ go, setPond, mapStyle = "illustrated", visited, observations, hypotheses = [], experiments = [], pulse, isDark = false }) {
  const prevPulseRef = useRef(pulse);
  useEffect(() => {
    if (pulse && pulse !== prevPulseRef.current) mlAudio.mapPulse();
    prevPulseRef.current = pulse;
  }, [pulse]);

  useEffect(() => {
    mlAudio.startAmbient();
    return () => mlAudio.stopAmbient();
  }, []);

  const stylePreset = {
    illustrated: { bg: "linear-gradient(180deg, #fef9c3 0%, #fbeaa3 50%, #d9f99d 100%)", paper: false, iso: false },
    paper: { bg: "#f8efd1", paper: true, iso: false },
    isometric: { bg: "linear-gradient(180deg, #ecfeff 0%, #a7f3d0 100%)", paper: false, iso: true }
  }[mapStyle];

  const locs = [
  { id: "pondB",    label: "Pond B",         x: 10, y: 45, icon: "droplet",   hot: false, desc: "Healthy control" },
  { id: "factory",  label: "Maple Factory",  x: 80, y: 22, icon: "factory",   hot: false, desc: "Out of bounds for now" },
  { id: "evidence", label: "Evidence Board", x: 36, y: 77, icon: "clipboard", hot: false, desc: "Mission HQ" },
  { id: "lab",      label: "Lab Tent",       x: 50, y: 50, icon: "flask",     hot: false, desc: "Run scientific tests" },
  { id: "pondA",    label: "Pond A",         x: 76, y: 72, icon: "droplet",   hot: true,  desc: "Sick pond — 5 clues" }];


  return (
    <div data-screen-label="02 Map" className="ml-map-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, alignItems: "stretch", height: "100%", minHeight: 0 }}>
      <div className="card ml-map-card" style={{
        padding: 0,
        overflow: "hidden",
        borderRadius: 20,
        position: "relative",
        height: "100%",
        minHeight: 0,
        background: isDark ? "#060d1e" : stylePreset.bg,
        transition: "background 0.9s ease",
      }}>
        {stylePreset.paper &&
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(91,69,48,0.18) 1px, transparent 1.5px)", backgroundSize: "16px 16px", opacity: 0.6, pointerEvents: "none" }} />
        }
        {/* Map content */}
        <div style={{ position: "absolute", inset: 0 }}>
          {/* Backdrop — crossfade day ↔ night */}
          {!stylePreset.paper && !stylePreset.iso && BackdropLayer && (
            <>
              <BackdropLayer isDark={false} style={{ opacity: isDark ? 0 : 1, transition: "opacity 0.9s ease" }} />
              <BackdropLayer isDark={true}  style={{ opacity: isDark ? 1 : 0, transition: "opacity 0.9s ease" }} />
            </>
          )}

          {/* River — handled inside BackdropLayer for non-paper styles. Paper/iso get a flat river. */}
          {(stylePreset.paper || stylePreset.iso) && (
            <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
              <path d="M -30 240 Q 80 270 170 280 Q 260 290 280 360 Q 280 460 210 520 Q 140 560 -20 580"
                    stroke={stylePreset.paper ? "#92c5fc" : "#5eead4"} strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.85" />
              <path d="M -30 240 Q 80 270 170 280 Q 260 290 280 360 Q 280 460 210 520 Q 140 560 -20 580"
                    stroke={stylePreset.paper ? "#bfdbfe" : "#99f6e4"} strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.9" />
            </svg>
          )}

          {/* ===== SKY — animated birds + clouds (hidden at night) ===== */}
          <div style={{ opacity: isDark ? 0 : 1, transition: "opacity 0.7s ease" }}>
            <AnimatedCloud x={-200} y={30} scale={1}    duration={26} delay={-8}  />
            <AnimatedCloud x={-200} y={52} scale={0.7}  duration={34} delay={-22} />
            <AnimatedCloud x={-200} y={38} scale={0.55} duration={20} delay={-5}  />
            <Bird x={-100} y={42} size={18} duration={10} delay={-2}  />
            <Bird x={-100} y={58} size={14} duration={14} delay={-7}  />
            <Bird x={-100} y={48} size={16} duration={12} delay={-5}  />
            <Bird x={-100} y={74} size={20} duration={18} delay={-12} />
          </div>

          {/* ===== TERRAIN OBJECTS — darken for night mode ===== */}
          <div style={{ filter: isDark ? "brightness(0.38) saturate(0.68)" : "none", transition: "filter 0.9s ease" }}>

          {/* ===== HEALTHY MEADOW — left side, around Pond B ===== */}
          <div style={{ position: "absolute", top: 120, left: 28  }}><Tree size={50} variant={1} /></div>
          <div style={{ position: "absolute", top: 152, left: 102 }}><Tree size={40} variant={0} /></div>
          <div style={{ position: "absolute", top: 268, left: 44  }}><Tree size={44} variant={2} /></div>
          <div style={{ position: "absolute", top: 305, left: 172 }}><Tree size={36} variant={0} /></div>
          {/* far left column */}
          <div style={{ position: "absolute", top: 394, left: 2   }}><Tree size={42} variant={0} /></div>
          <div style={{ position: "absolute", top: 468, left: 12  }}><Tree size={38} variant={2} /></div>
          <div style={{ position: "absolute", top: 538, left: 4   }}><Tree size={34} variant={1} /></div>
          {/* below/around evidence board */}
          <div style={{ position: "absolute", top: 408, left: 254 }}><Tree size={34} variant={2} /></div>
          <div style={{ position: "absolute", top: 466, left: 312 }}><Tree size={30} variant={0} /></div>
          <div style={{ position: "absolute", top: 528, left: 268 }}><Tree size={28} variant={1} /></div>
          {/* bottom center-left */}
          <div style={{ position: "absolute", top: 546, left: 88  }}><Tree size={32} variant={0} /></div>
          <div style={{ position: "absolute", top: 528, left: 152 }}><Tree size={28} variant={2} /></div>
          <Bush x={122} y={198} size={36} variant={0} />
          <Bush x={220} y={232} size={30} variant={1} />
          <Bush x={266} y={460} size={26} variant={1} />
          <GrassPatch x={74}  y={256} size={28} />
          <GrassPatch x={190} y={282} size={24} />
          <GrassPatch x={32}  y={180} size={24} />
          <GrassPatch x={8}   y={430} size={30} />
          <GrassPatch x={20}  y={510} size={26} />
          <GrassPatch x={6}   y={568} size={24} />
          <GrassPatch x={290} y={432} size={24} />
          <GrassPatch x={322} y={498} size={22} />
          <GrassPatch x={120} y={562} size={22} />
          <Flower x={106} y={190} size={14} color="#f472b6" />
          <Flower x={198} y={216} size={14} color="#a855f7" />
          <Flower x={60}  y={280} size={13} color="#fbbf24" />
          <Flower x={38}  y={230} size={13} color="#fb923c" />
          <Flower x={24}  y={294} size={12} color="#fbbf24" />
          <Flower x={42}  y={422} size={13} color="#f472b6" />
          <Flower x={58}  y={492} size={12} color="#fbbf24" />
          <Flower x={28}  y={548} size={13} color="#a855f7" />
          <Flower x={312} y={412} size={13} color="#fb923c" />
          <Flower x={280} y={514} size={12} color="#f472b6" />
          <Flower x={338} y={454} size={12} color="#fbbf24" />
          <Flower x={168} y={548} size={11} color="#fbbf24" />
          <Flower x={102} y={570} size={11} color="#f472b6" />
          <Butterfly x={140} y={142} size={18} color="#f472b6" />
          <Butterfly x={207} y={164} size={16} color="#fb923c" />
          <Butterfly x={326} y={422} size={16} color="#a855f7" />
          <Dragonfly x={86}  y={298} size={22} />
          <Cattail x={150} y={146} size={18} />
          <Rock x={72}  y={448} size={18} />
          <Rock x={84}  y={530} size={16} />
          <Rock x={344} y={472} size={16} />

          {/* ===== BELOW POND B — mid-left strip, y 290-520 ===== */}
          <div style={{ position: "absolute", top: 338, left: 50  }}><Tree size={36} variant={1} /></div>
          <div style={{ position: "absolute", top: 352, left: 128 }}><Tree size={32} variant={0} /></div>
          <div style={{ position: "absolute", top: 388, left: 190 }}><Tree size={30} variant={2} /></div>
          <div style={{ position: "absolute", top: 446, left: 66  }}><Tree size={28} variant={0} /></div>
          <div style={{ position: "absolute", top: 456, left: 198 }}><Tree size={26} variant={1} /></div>
          <GrassPatch x={100} y={358} size={24} />
          <GrassPatch x={158} y={394} size={22} />
          <GrassPatch x={62}  y={472} size={22} />
          <GrassPatch x={206} y={482} size={20} />
          <Flower x={118} y={346} size={13} color="#f472b6" />
          <Flower x={166} y={380} size={12} color="#fb923c" />
          <Flower x={78}  y={462} size={12} color="#fbbf24" />
          <Flower x={212} y={468} size={12} color="#a855f7" />
          <Bush x={144} y={420} size={30} variant={0} />
          <Butterfly x={180} y={344} size={16} color="#f472b6" />
          <Dragonfly x={220} y={414} size={20} />
          <Rock x={108} y={434} size={18} />

          {/* ===== ABOVE LAB TENT — transition/healthy border, y 170-275 ===== */}
          <div style={{ position: "absolute", top: 178, left: 290 }}><Tree size={36} variant={1} /></div>
          <div style={{ position: "absolute", top: 192, left: 354 }}><Tree size={32} variant={0} /></div>
          <div style={{ position: "absolute", top: 242, left: 312 }}><Tree size={30} variant={2} /></div>
          <div style={{ position: "absolute", top: 218, left: 380 }}><Tree size={28} variant={1} /></div>
          <GrassPatch x={318} y={196} size={24} />
          <GrassPatch x={368} y={228} size={22} />
          <GrassPatch x={298} y={262} size={26} />
          <Flower x={336} y={188} size={13} color="#f472b6" />
          <Flower x={378} y={222} size={12} color="#fbbf24" />
          <Flower x={314} y={268} size={12} color="#a855f7" />
          <Bush x={390} y={250} size={26} variant={0} />
          <Rock x={426} y={238} size={18} />
          <Rock x={460} y={216} size={16} />

          {/* ===== TRANSITION ZONE — center knoll, around Lab Tent ===== */}
          <div style={{ position: "absolute", top: 300, left: 350 }}><Tree size={30} variant={1} /></div>
          <div style={{ position: "absolute", top: 320, left: 444 }}><Tree size={26} variant={0} /></div>
          <GrassPatch x={322} y={330} size={26} />
          <GrassPatch x={330} y={296} size={22} />
          <Bush x={280} y={340} size={26} variant={0} />
          <Rock x={488} y={318} size={20} />
          <Rock x={366} y={354} size={16} />
          <Footprints x={232} y={352} size={50} rot={10} />
          <Footprints x={465} y={404} size={50} rot={-22} />

          {/* ===== INDUSTRIAL RIDGE — upper right, near Factory ===== */}
          <div style={{ position: "absolute", top: 162, left: 548 }}><DeadTree size={44} /></div>
          <div style={{ position: "absolute", top: 174, left: 622 }}><DeadTree size={40} /></div>
          <div style={{ position: "absolute", top: 162, left: 716 }}><DeadTree size={46} /></div>
          <div style={{ position: "absolute", top: 192, left: 762 }}><DeadTree size={36} /></div>
          <DeadShrub x={502} y={150} size={26} />
          <DeadShrub x={648} y={194} size={20} />
          <DeadShrub x={724} y={228} size={24} />
          <DeadShrub x={490} y={256} size={24} />
          <DeadFlower x={748} y={302} size={13} />
          <DeadFlower x={636} y={318} size={12} />
          <Rock x={478} y={172} size={22} />
          <Rock x={590} y={196} size={20} />
          <Rock x={736} y={194} size={22} />
          <Rock x={528} y={268} size={18} />
          <Rock x={666} y={288} size={18} />
          <Rock x={760} y={318} size={16} />
          <Signpost x={472} y={122} label="!" />

          {/* ===== DEAD/POLLUTED ZONE — lower right, around Pond A ===== */}
          <div style={{ position: "absolute", top: 352, left: 424 }}><DeadTree size={42} /></div>
          <div style={{ position: "absolute", top: 432, left: 494 }}><DeadTree size={36} /></div>
          <div style={{ position: "absolute", top: 458, left: 576 }}><DeadTree size={38} /></div>
          <div style={{ position: "absolute", top: 394, left: 682 }}><DeadTree size={36} /></div>
          <div style={{ position: "absolute", top: 434, left: 744 }}><DeadTree size={34} /></div>
          <div style={{ position: "absolute", top: 520, left: 778 }}><DeadTree size={32} /></div>
          <div style={{ position: "absolute", top: 508, left: 438 }}><DeadTree size={30} /></div>
          <div style={{ position: "absolute", top: 518, left: 560 }}><DeadTree size={32} /></div>
          <div style={{ position: "absolute", top: 504, left: 724 }}><DeadTree size={30} /></div>
          <DeadFlower x={468} y={370} size={16} />
          <DeadFlower x={512} y={450} size={14} />
          <DeadFlower x={554} y={488} size={16} />
          <DeadFlower x={612} y={404} size={14} />
          <DeadFlower x={698} y={446} size={15} />
          <DeadFlower x={752} y={388} size={13} />
          <DeadFlower x={426} y={480} size={14} />
          <DeadFlower x={488} y={514} size={14} />
          <DeadFlower x={678} y={480} size={14} />
          <DeadFlower x={740} y={476} size={13} />
          <DeadFlower x={784} y={444} size={13} />
          <DeadFlower x={508} y={546} size={12} />
          <DeadFlower x={628} y={498} size={13} />
          <DeadShrub x={464} y={355} size={28} />
          <DeadShrub x={530} y={412} size={26} />
          <DeadShrub x={700} y={428} size={28} />
          <DeadShrub x={578} y={360} size={22} />
          <DeadShrub x={706} y={354} size={24} />
          <DeadShrub x={768} y={468} size={20} />
          <DeadShrub x={416} y={456} size={22} />
          <DeadShrub x={490} y={550} size={20} />
          <DeadShrub x={620} y={512} size={22} />
          <MudPatch x={452} y={420} size={56} />
          <MudPatch x={598} y={436} size={68} />
          <MudPatch x={674} y={394} size={50} />
          <Rock x={504} y={398} size={22} />
          <Rock x={660} y={378} size={18} />
          <Rock x={442} y={384} size={20} />
          <Rock x={548} y={438} size={18} />
          <Rock x={618} y={460} size={20} />
          <Rock x={726} y={414} size={18} />
          <Rock x={762} y={478} size={16} />
          <Rock x={416} y={548} size={18} />
          <Rock x={496} y={560} size={14} />
          <Rock x={574} y={534} size={16} />
          <Rock x={648} y={522} size={14} />
          <Rock x={792} y={502} size={16} />
          <Cattail x={537} y={344} size={16} />
          <Cattail x={668} y={410} size={14} />

          </div>{/* end terrain filter wrapper */}

          {/* Compass */}
          <div style={{
            position: "absolute", top: 18, right: 18,
            width: 64, height: 64,
            borderRadius: 999,
            background: isDark ? "rgba(14,22,38,0.95)" : "rgba(255,255,255,0.92)",
            border: isDark ? "2px solid #2a3e54" : "2px solid #1c1410",
            display: "grid", placeItems: "center",
            fontFamily: "Nunito", fontWeight: 900,
            boxShadow: "var(--shadow-card)",
            zIndex: 5,
            transition: "background 0.9s ease, border-color 0.9s ease",
          }}>
            <svg width="50" height="50" viewBox="0 0 50 50">
              <text x="25" y="11" textAnchor="middle" fontSize="9" fontWeight="900" fill={isDark ? "#8ab0d0" : "#1c1410"}>N</text>
              <text x="25" y="46" textAnchor="middle" fontSize="9" fontWeight="900" fill={isDark ? "#8ab0d0" : "#1c1410"}>S</text>
              <text x="6" y="28" textAnchor="middle" fontSize="9" fontWeight="900" fill={isDark ? "#8ab0d0" : "#1c1410"}>W</text>
              <text x="44" y="28" textAnchor="middle" fontSize="9" fontWeight="900" fill={isDark ? "#8ab0d0" : "#1c1410"}>E</text>
              <path d="M25 14 L29 28 L25 24 L21 28 Z" fill="#dc2626" />
              <path d="M25 36 L21 24 L25 28 L29 24 Z" fill={isDark ? "#4a6a8a" : "#1c1410"} />
            </svg>
          </div>

          {/* Stars */}
          <div style={{ position: "absolute", inset: 0, opacity: isDark ? 1 : 0, transition: "opacity 1.1s ease", pointerEvents: "none" }}>
            {MAP_STARS.map((s, i) => (
              <div key={i} style={{
                position: "absolute",
                left: `${s.x}%`, top: `${s.y}%`,
                width: s.s, height: s.s,
                borderRadius: 999,
                background: "#ffffff",
                boxShadow: `0 0 ${s.s * 2}px rgba(255,255,255,0.9)`,
                animation: `ml-twinkle ${s.d}s ease-in-out ${s.o}s infinite`,
              }} />
            ))}
          </div>

          {/* Moon */}
          <div style={{
            position: "absolute", top: 16, right: 98,
            width: 52, height: 52,
            borderRadius: 999,
            background: "radial-gradient(circle at 38% 36%, #fef9c3 0%, #f5e08c 60%, #e8c96a 100%)",
            boxShadow: "0 0 36px 14px rgba(253,246,227,0.22), 0 0 80px 32px rgba(253,246,227,0.08)",
            opacity: isDark ? 1 : 0,
            transition: "opacity 0.9s ease",
            pointerEvents: "none",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -6, right: -6,
              width: 46, height: 46,
              borderRadius: 999,
              background: "rgba(3,8,24,0.58)",
            }} />
          </div>

          {/* Fireflies — healthy meadow, left side */}
          <div style={{ position: "absolute", inset: 0, opacity: isDark ? 1 : 0, transition: "opacity 1.3s ease", pointerEvents: "none" }}>
            {MAP_FIREFLIES.map((f, i) => (
              <div key={i} style={{
                position: "absolute",
                left: f.x, top: f.y,
                width: 5, height: 5,
                borderRadius: 999,
                background: "#d9f99d",
                boxShadow: "0 0 8px 3px rgba(163,230,53,0.65)",
                animation: `ml-shimmer ${f.d}s ease-in-out ${f.o}s infinite`,
              }} />
            ))}
          </div>
        </div>

        {/* Location pins */}
        {locs.map((l) =>
        <button
          key={l.id}
          onClick={() => { mlAudio.mapPin(l.id); if (l.id === "pondA") { setPond("A"); go("observe"); } else if (l.id === "pondB") { setPond("B"); go("observe"); } else if (l.id === "lab") { go("lab"); } else if (l.id === "evidence") { go("evidence"); } }}
          disabled={l.id === "factory"}
          style={{
            position: "absolute",
            left: `${l.x}%`, top: `${l.y}%`,
            transform: "translate(-50%, -50%)",
            background: "transparent",
            border: 0,
            padding: 0,
            cursor: l.id === "factory" ? "not-allowed" : "pointer",
            opacity: l.id === "factory" ? 0.85 : 1,
            ...(l.id === "evidence" ? { width: 100, height: 95 } : {}),
          }}>
          
            <MapPin
            label={l.label}
            icon={l.icon}
            hot={l.hot}
            pulse={pulse === l.id}
            completed={visited && visited.includes(l.id)}
            desc={l.desc}
            locked={l.id === "factory"}
            isDark={isDark} />
          
          </button>
        )}

        {/* Ambient environment glow — dark mode only, tied to each location's character */}
        <div style={{ position: "absolute", inset: 0, opacity: isDark ? 1 : 0, transition: "opacity 0.9s ease", pointerEvents: "none" }}>
          {/* Lab Tent — soft lantern warmth */}
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,198,90,0.09) 0%, transparent 68%)" }} />
          {/* Factory — warm window light from industrial ridge */}
          <div style={{ position: "absolute", left: "80%", top: "22%", transform: "translate(-50%, -50%)", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,178,60,0.08) 0%, transparent 68%)" }} />
          {/* Pond A — faint contamination reflection, sickly green-amber */}
          <div style={{ position: "absolute", left: "76%", top: "72%", transform: "translate(-50%, -50%)", width: 190, height: 190, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(130,195,70,0.07) 0%, transparent 68%)" }} />
          {/* Evidence Board — small investigation lamp */}
          <div style={{ position: "absolute", left: "36%", top: "77%", transform: "translate(-50%, -50%)", width: 165, height: 165, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,218,120,0.08) 0%, transparent 68%)" }} />
          {/* Pond B — cool moonlit water reflection */}
          <div style={{ position: "absolute", left: "10%", top: "45%", transform: "translate(-50%, -50%)", width: 175, height: 175, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(100,175,220,0.07) 0%, transparent 68%)" }} />
        </div>

        {/* Illustration overlays — positions match pin coords in locs[] */}
        {/* Pond B — healthy, cool blue; slightly brighter than terrain to stand out */}
        <div style={{ position: "absolute", left: "10%", top: "45%", transform: "translate(-50%, -55%) scale(0.55)", pointerEvents: "none", filter: isDark ? "brightness(0.46) saturate(0.84)" : "none", transition: "filter 0.9s ease" }}>
          <Pond size={210} />
        </div>
        {/* Maple Factory — warm sepia from glowing windows */}
        <div style={{ position: "absolute", left: "80%", top: "22%", transform: "translate(-50%, -55%) scale(0.55)", pointerEvents: "none", filter: isDark ? "brightness(0.52) saturate(0.82) sepia(0.12)" : "none", transition: "filter 0.9s ease" }}>
          <Factory />
        </div>
        {/* Lab Tent — most visible; lantern warmth lifts it above terrain */}
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -55%) scale(0.6)", pointerEvents: "none", filter: isDark ? "brightness(0.58) saturate(0.86) sepia(0.10)" : "none", transition: "filter 0.9s ease" }}>
          <LabTent />
        </div>
        {/* Evidence Board — investigation lamp glow, warm neutral */}
        <div style={{ position: "absolute", left: "36%", top: "77%", transform: "translate(-50%, -55%) scale(0.7)", pointerEvents: "none", filter: isDark ? "brightness(0.52) saturate(0.82)" : "none", transition: "filter 0.9s ease" }}>
          {BulletinBoard && <BulletinBoard size={180} />}
        </div>
        {/* Pond A — contamination keeps its sickly color; slight saturation boost */}
        <div style={{ position: "absolute", left: "76%", top: "72%", transform: "translate(-50%, -50%) scale(0.55)", pointerEvents: "none", filter: isDark ? "brightness(0.44) saturate(1.08)" : "none", transition: "filter 0.9s ease" }}>
          <Pond sick size={210} dead={4} />
        </div>
      </div>

      {/* Objectives panel */}
      <div className="col gap-3 ml-map-sidebar" style={{ minHeight: 0, overflow: "hidden" }}>
        <div className="card" style={{ padding: 14 }}>
          <div className="row between" style={{ alignItems: "center" }}>
            <h3 className="title-lg" style={{ fontSize: 16 }}>Current Mission</h3>
            <span className="chip orange">Phase 1</span>
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

function MapPin({ label, icon, hot, pulse, completed, desc, locked, isDark = false }) {
  const tagBg   = isDark ? "linear-gradient(180deg, #243650, #162234)" : "linear-gradient(180deg, #f5e1b8, #d4ad6b)";
  const tagText = isDark ? "#cce5fa" : "#3d2e22";
  const tagBdr  = isDark ? "#365472" : "#5b3a1f";
  const tagBdrT = isDark ? "#4a6e90" : "#7a5230";
  const tagSub  = isDark ? "#7898ba" : "#7a5230";
  const nailClr = isDark ? "#365472" : "#5b3a1f";
  return (
    <div style={{ position: "relative" }}>
      {pulse &&
      <div style={{
        position: "absolute", inset: -10,
        borderRadius: 999,
        border: "3px solid var(--primary)",
        animation: "ml-pulse-ring 1.8s ease-out infinite"
      }} />
      }
      <div style={{
        width: 56, height: 56,
        borderRadius: 999,
        background: completed ? "var(--teal-500)" : hot ? "var(--orange-500)" : "var(--ink-900)",
        color: "white",
        display: "grid", placeItems: "center",
        boxShadow: "0 4px 0 rgba(0,0,0,0.25), 0 12px 24px -4px rgba(0,0,0,0.35)",
        border: "3px solid #fdf6e3",
        margin: "0 auto",
        opacity: 0
      }}>
        {locked ? <Lucide name="x" size={22} /> : completed ? <Lucide name="check" size={24} /> : <Lucide name={icon} size={24} />}
      </div>
      <div style={{
        position: "absolute", top: 64, left: "50%", transform: "translateX(-50%)",
        background: tagBg,
        color: tagText,
        padding: "5px 12px 7px",
        borderRadius: 4,
        border: `2px solid ${tagBdr}`,
        borderTop: `2px solid ${tagBdrT}`,
        whiteSpace: "nowrap",
        fontWeight: 900,
        fontSize: 12,
        fontFamily: "Nunito",
        boxShadow: isDark
          ? "0 4px 0 rgba(6,12,22,0.92), 0 8px 22px -4px rgba(0,0,0,0.75), 0 0 0 1px rgba(74,110,144,0.25)"
          : "0 4px 0 rgba(91,58,31,0.6), 0 8px 18px -4px rgba(0,0,0,0.4)",
        textShadow: isDark ? "none" : "0 1px 0 rgba(255,255,255,0.4)",
        transition: "background 0.9s ease, color 0.9s ease, border-color 0.9s ease",
      }}>
        <span style={{ position: "absolute", left: 4, top: 3, width: 4, height: 4, borderRadius: 999, background: nailClr, boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.3)" }} />
        <span style={{ position: "absolute", right: 4, top: 3, width: 4, height: 4, borderRadius: 999, background: nailClr, boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.3)" }} />
        {label}
        <div style={{ fontSize: 9, fontWeight: 700, color: tagSub, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 1 }}>{desc}</div>
      </div>
    </div>);

}

function Objective({ done, text }) {
  return (
    <li style={{ display: "flex", gap: 10, alignItems: "center", fontFamily: "Nunito", fontWeight: 700, fontSize: 14 }}>
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