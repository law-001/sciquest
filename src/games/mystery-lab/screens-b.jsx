/* ============================================================
   Mystery Lab — Screens part 2
   ============================================================ */
import React, { useState, useCallback } from "react";
import { DetectiveHoot, Lucide, NotebookBadge } from "./shared.jsx";
import { Pond, Factory, Reed, Tree, Cloud, Thermometer, SmellVapor } from "./world.jsx";

/* ===== Screen 3: Observation Scene ===== */

function ClueWrapper({ found, onClick, style, children, anim }) {
  return (
    <div style={{ position: "absolute", ...style }}>
      <button
        onClick={found ? undefined : onClick}
        style={{
          background: "none", border: "none", padding: 0,
          cursor: found ? "default" : "pointer",
          display: "block", position: "relative",
          opacity: found ? 0.4 : 1,
          transition: "opacity .3s ease",
        }}
      >
        <div style={!found && anim ? { animation: anim } : undefined}>
          {children}
        </div>
        {found && (
          <div style={{
            position: "absolute", top: -6, right: -6,
            width: 22, height: 22,
            background: "var(--teal-500)", borderRadius: "50%",
            display: "grid", placeItems: "center",
            border: "2.5px solid white", zIndex: 10,
          }}>
            <Lucide name="check" size={12} color="white" />
          </div>
        )}
      </button>
    </div>
  );
}

function StandaloneDeadFish({ rot = 0, scale = 1 }) {
  const w = Math.round(30 * scale);
  const h = Math.round(10 * scale);
  return (
    <svg width={w} height={h} viewBox="-15 -5 30 10" fill="none" style={{ display: "block", transform: `rotate(${rot}deg)` }}>
      <ellipse cx="0" cy="2"  rx="8"  ry="1.5" fill="rgba(0,0,0,0.28)" />
      <ellipse cx="0" cy="0"  rx="9"  ry="3.5" fill="#cbb999" />
      <ellipse cx="0" cy="-1" rx="9"  ry="1.5" fill="#e6d6b9" />
      <path d="M-9 0 L-13 -3 L-13 3 Z" fill="#cbb999" />
      <line x1="3"  y1="-1.5" x2="5"  y2="0.5"  stroke="#1c1410" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="5"  y1="-1.5" x2="3"  y2="0.5"  stroke="#1c1410" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function StandaloneFishie({ rot = 0, color = "#f97316", stroke = "#c2410c", scale = 1 }) {
  const w = Math.round(34 * scale);
  const h = Math.round(14 * scale);
  return (
    <svg width={w} height={h} viewBox="-17 -7 34 14" fill="none" style={{ display: "block", transform: `rotate(${rot}deg)` }}>
      <ellipse cx="0"   cy="2"    rx="10" ry="2"   fill="rgba(0,0,0,0.28)" />
      <ellipse cx="0"   cy="0"    rx="11" ry="5"   fill={color} />
      <ellipse cx="0"   cy="-1.5" rx="11" ry="2.5" fill="#fff7ed" opacity="0.35" />
      <path d="M-10 0 L-16 -5 L-16 5 Z" fill={color} />
      <path d="M-10 0 L-14 -3 L-14 3 Z" fill={stroke} opacity="0.5" />
      <circle cx="6"   cy="-1" r="1.6" fill="white" />
      <circle cx="6.5" cy="-1" r="0.9" fill="#1c1410" />
    </svg>
  );
}

function MurkyPatch() {
  return (
    <svg width={120} height={52} viewBox="0 0 120 52" fill="none" overflow="visible" style={{ display: "block" }}>
      <ellipse cx="60" cy="36" rx="56" ry="15" fill="#2a1e0e" opacity="0.58" />
      <ellipse cx="42" cy="30" rx="22" ry="8"  fill="#4a3520" opacity="0.48" />
      <ellipse cx="78" cy="32" rx="18" ry="6"  fill="#5b4530" opacity="0.42" />
      <path d="M18 34 Q60 22 102 34" stroke="#7c5a30" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />
      <path d="M28 42 Q60 34 92 42" stroke="#7c5a30" strokeWidth="1"   fill="none" opacity="0.5" strokeLinecap="round" />
      <circle cx="44" cy="26" r="2.5" fill="#a87c4d" opacity="0.55" />
      <circle cx="68" cy="28" r="2"   fill="#a87c4d" opacity="0.45" />
      <circle cx="82" cy="40" r="1.5" fill="#a87c4d" opacity="0.4" />
      <circle cx="35" cy="46" r="6" fill="rgba(210,160,80,0.25)" stroke="rgba(220,170,90,0.95)" strokeWidth="1.8">
        <animateTransform attributeName="transform" type="translate" values="0,0; -4,-110" dur="2.4s" repeatCount="indefinite" begin="0s" />
        <animate attributeName="opacity" values="1; 0.6; 0" dur="2.4s" repeatCount="indefinite" begin="0s" />
      </circle>
      <circle cx="61" cy="49" r="4.5" fill="rgba(210,160,80,0.2)" stroke="rgba(220,170,90,0.9)" strokeWidth="1.5">
        <animateTransform attributeName="transform" type="translate" values="0,0; 5,-115" dur="2s" repeatCount="indefinite" begin="0.85s" />
        <animate attributeName="opacity" values="1; 0.5; 0" dur="2s" repeatCount="indefinite" begin="0.85s" />
      </circle>
      <circle cx="84" cy="46" r="5.5" fill="rgba(210,160,80,0.22)" stroke="rgba(220,170,90,0.9)" strokeWidth="1.6">
        <animateTransform attributeName="transform" type="translate" values="0,0; -2,-108" dur="2.8s" repeatCount="indefinite" begin="1.5s" />
        <animate attributeName="opacity" values="1; 0.55; 0" dur="2.8s" repeatCount="indefinite" begin="1.5s" />
      </circle>
    </svg>
  );
}

function ClearWaterRipple() {
  return (
    <svg width={100} height={44} viewBox="0 0 100 44" fill="none" overflow="visible" style={{ display: "block" }}>
      <ellipse cx="50" cy="30" rx="46" ry="13" fill="#22d3ee" opacity="0.22" />
      <path d="M12 26 Q50 16 88 26" stroke="rgba(255,255,255,0.75)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M20 34 Q50 26 80 34" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <ellipse cx="62" cy="36" rx="7"  ry="1.8" fill="rgba(255,255,255,0.65)" />
      <ellipse cx="36" cy="30" rx="4.5" ry="1.2" fill="rgba(255,255,255,0.55)" />
      <ellipse cx="74" cy="22" rx="3"   ry="0.9" fill="rgba(255,255,255,0.5)" />
      <circle cx="28" cy="40" r="6" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.95)" strokeWidth="1.8">
        <animateTransform attributeName="transform" type="translate" values="0,0; -3,-100" dur="2.2s" repeatCount="indefinite" begin="0s" />
        <animate attributeName="opacity" values="1; 0.55; 0" dur="2.2s" repeatCount="indefinite" begin="0s" />
      </circle>
      <circle cx="52" cy="42" r="4.5" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5">
        <animateTransform attributeName="transform" type="translate" values="0,0; 4,-105" dur="1.9s" repeatCount="indefinite" begin="0.7s" />
        <animate attributeName="opacity" values="1; 0.5; 0" dur="1.9s" repeatCount="indefinite" begin="0.7s" />
      </circle>
      <circle cx="72" cy="39" r="5" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6">
        <animateTransform attributeName="transform" type="translate" values="0,0; -2,-102" dur="2.5s" repeatCount="indefinite" begin="1.4s" />
        <animate attributeName="opacity" values="1; 0.5; 0" dur="2.5s" repeatCount="indefinite" begin="1.4s" />
      </circle>
    </svg>
  );
}

const POND_A_CLUES = [
  { id: "deadFish",    label: "Dead Fish",      icon: "fish",        x: 37, y: 44, obs: "Several fish are floating belly-up. They look untouched.",  xp: 8,  hint: "The animals here seem like they're not moving..." },
  { id: "murky",       label: "Murky Water",    icon: "droplet",     x: 56, y: 52, obs: "The water is brown and cloudy. Hard to see the bottom.",     xp: 6,  hint: "The water looks... strange. Almost like chocolate milk." },
  { id: "temp",        label: "Temperature",    icon: "thermometer", x: 74, y: 60, obs: "Thermometer reads 34°C. Unusually warm for this season.",   xp: 6,  hint: "It feels warmer out here than it should be..." },
  { id: "smell",       label: "Strange Smell",  icon: "sparkles",    x: 32, y: 20, obs: "A sharp, chemical smell hangs over the pond.",               xp: 6,  hint: "What was that smell? Something sharp is in the air." },
  { id: "factoryPipe", label: "Drainage Pipe",  icon: "factory",     x: 84, y: 28, obs: "A pipe from the factory drips a grey-brown liquid into the soil.", xp: 10, hint: "Something over there seems to be dripping..." },
];
const POND_B_CLUES = [
  { id: "healthyFish", label: "Healthy Fish",   icon: "fish",        x: 44, y: 50, obs: "Fish swim actively. Bright orange scales — all looks normal.", xp: 4, control: true, hint: "How are the animals here doing?" },
  { id: "clearWater",  label: "Clear Water",    icon: "droplet",     x: 60, y: 42, obs: "You can see right to the bottom. No discoloration.",          xp: 4, control: true, hint: "Notice anything about the water itself?" },
  { id: "tempB",       label: "Temperature B",  icon: "thermometer", x: 74, y: 60, obs: "Thermometer reads 22°C. Normal seasonal value.",              xp: 4, control: true, hint: "Have you checked the temperature yet?" },
];

// ─── Clue element positions ──────────────────────────────────────────────────
// Edit left/top (% of scene) and transform to reposition any clue element.
// factoryPipe uses top/right pixel offsets because it anchors to the corner.
// rx/ry = ripple center in scene % — keep in sync with left/top when you move things.
const CLUE_POS = {
  // Pond A
  deadFish:    { left: "60%", top: "70%", transform: "translate(-50%, -50%)", rx: 60, ry: 70 },
  murky:       { left: "56%", top: "49%", transform: "translate(-50%, -50%)", rx: 56, ry: 49 },
  temp:        { left: "74%", top: "54%", transform: "translate(-50%, -50%)", rx: 74, ry: 54 },
  smell:       { left: "35%", top: "45%", transform: "translate(-50%, 0)",    rx: 35, ry: 45 },
  factoryPipe: { top: 60,     right: 30,                                       rx: 92, ry: 14 },
  // Pond B
  healthyFish: { left: "60%", top: "70%", transform: "translate(-50%, -50%)", rx: 60, ry: 70 },
  clearWater:  { left: "40%", top: "70%", transform: "translate(-50%, -50%)", rx: 40, ry: 70 },
  tempB:       { left: "74%", top: "54%", transform: "translate(-50%, -50%)", rx: 74, ry: 54 },
};
// Strips rx/ry before spreading to style — they're not valid CSS props
function cluePos(id) {
  const { rx: _rx, ry: _ry, ...s } = CLUE_POS[id] ?? {};
  return s;
}

function ObservationScreen({ go, pond, setPond, observations, addObservation }) {
  const clues = pond === "A" ? POND_A_CLUES : POND_B_CLUES;
  const sick = pond === "A";
  const allPondCluesDone = clues.every(c => observations.find(o => o.id === c.id));
  const readyForHypothesis = allPondCluesDone && observations.length >= 4;
  const [popText, setPopText] = useState(null);
  const [ripples, setRipples] = useState([]);
  const [hintActive, setHintActive] = useState(false);

  const showHint = () => {
    const unfound = clues.filter(c => !observations.find(o => o.id === c.id));
    if (unfound.length === 0) return;
    const pick = unfound[Math.floor(Math.random() * unfound.length)];
    setHintActive(true);
    setPopText({ ...pick, isHint: true });
    setTimeout(() => {
      setPopText(p => (p && p.id === pick.id ? null : p));
      setHintActive(false);
    }, 3000);
  };

  const onClickClue = useCallback((c) => {
    if (observations.find(o => o.id === c.id)) return;
    addObservation({ ...c, pond });
    setPopText(c);
    setTimeout(() => setPopText(p => (p && p.id === c.id ? null : p)), 2400);
    const id = Date.now();
    setRipples(r => [...r, { id, x: c.x, y: c.y }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
  }, [pond, observations, addObservation]);

  const obs = (id) => observations.find(o => o.id === id);
  const clue = (id) => clues.find(c => c.id === id);
  const handleClue = (id) => () => {
    const c = clue(id);
    if (!c) return;
    const { rx = c.x, ry = c.y } = CLUE_POS[id] ?? {};
    onClickClue({ ...c, x: rx, y: ry });
  };

  return (
    <div data-screen-label="03 Observation" className="col gap-4">
      <div className="row between head" style={{ alignItems: "center" }}>
        <div>
          <div className="uppercase-eyebrow">Phase 1 · Observe</div>
          <h2 className="title-xl">{sick ? "Pond A — what's wrong here?" : "Pond B — the healthy control"}</h2>
        </div>
        <div className="row gap-2">
          <button className="btn ghost" onClick={() => setPond(pond === "A" ? "B" : "A")}>
            <Lucide name="refresh" size={14} />
            Switch to Pond {pond === "A" ? "B" : "A"}
          </button>
          <button className="btn ghost" onClick={showHint} disabled={hintActive}>
            <Lucide name="lightbulb" size={14} />
            Hint
          </button>
          <button
            className="btn teal"
            onClick={() => go(observations.length >= 4 ? "question" : "map")}
            style={readyForHypothesis ? { animation: "ml-btn-glow 1.4s ease-in-out infinite" } : undefined}
          >
            {observations.length >= 4 ? "Form hypothesis" : "Back to map"}
            <Lucide name="chevronRight" size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "stretch" }}>
        {/* Scene viewport */}
        <div className="card" style={{
          padding: 0, position: "relative", overflow: "hidden",
          height: 460,
          background: sick
            ? "linear-gradient(180deg, #fcd6a3 0%, #f4a261 35%, #7c5a30 60%, #3d2e1a 100%)"
            : "linear-gradient(180deg, #d1fae5 0%, #6ee7b7 35%, #14b8a6 60%, #0d9488 100%)",
        }}>
          {/* sky scatter */}
          <div style={{ position: "absolute", top: 18, left: 30 }}><Cloud /></div>
          <div style={{ position: "absolute", top: 36, right: 60, transform: "scale(0.7)" }}><Cloud /></div>

          {/* Pond — fish suppressed so interactive versions below are the only ones */}
          <div style={{ position: "absolute", left: "50%", bottom: 60, transform: "translateX(-50%) scale(1.8)" }}>
            <Pond sick={sick} dead={sick ? 5 : 0} size={260} hideFish />
          </div>

          {/* Reeds */}
          <Reed x={20} y={350} size={40} />
          <Reed x={70} y={400} size={50} />
          <Reed x={680} y={380} size={45} />

          {/* ── POND A: factory as clickable clue ── */}
          {sick && (
            <ClueWrapper
              found={!!obs("factoryPipe")}
              onClick={handleClue("factoryPipe")}
              style={cluePos("factoryPipe")}
              anim="ml-shimmer 2.2s ease-in-out infinite"
            >
              <div style={{ transform: "scale(0.6)", transformOrigin: "top right" }}>
                <Factory />
              </div>
            </ClueWrapper>
          )}

          {/* ── POND B: tree (decoration, not a clue) ── */}
          {!sick && (
            <div style={{ position: "absolute", top: 30, right: 70 }}>
              <Tree size={70} variant={1} />
            </div>
          )}

          {/* ── POND A: environmental clues ── */}
          {sick && (
            <>
              {/* SMELL — green-yellow vapor rising above the pond */}
              <ClueWrapper found={!!obs("smell")} onClick={handleClue("smell")} style={cluePos("smell")} anim="ml-shimmer 3s ease-in-out infinite">
                <SmellVapor width={120} height={86} />
              </ClueWrapper>

              {/* DEAD FISH — three fish floating belly-up */}
              <ClueWrapper found={!!obs("deadFish")} onClick={handleClue("deadFish")} style={cluePos("deadFish")} anim="ml-float-y 2.8s ease-in-out infinite">
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                  <StandaloneDeadFish rot={-28} scale={1.5} />
                  <div style={{ marginLeft: 22 }}><StandaloneDeadFish rot={18} scale={1.25} /></div>
                  <div style={{ marginLeft: 10 }}><StandaloneDeadFish rot={-8} scale={1.1} /></div>
                </div>
              </ClueWrapper>

              {/* MURKY WATER — dark pollution patch in the water */}
              <ClueWrapper found={!!obs("murky")} onClick={handleClue("murky")} style={cluePos("murky")} anim="ml-shimmer 3.5s ease-in-out infinite">
                <MurkyPatch />
              </ClueWrapper>

              {/* THERMOMETER — hot reading stuck in pond bank */}
              <ClueWrapper found={!!obs("temp")} onClick={handleClue("temp")} style={cluePos("temp")} anim="ml-shimmer 2.5s ease-in-out infinite">
                <Thermometer hot size={80} />
              </ClueWrapper>
            </>
          )}

          {/* ── POND B: environmental clues ── */}
          {!sick && (
            <>
              {/* HEALTHY FISH — two fish swimming actively */}
              <ClueWrapper found={!!obs("healthyFish")} onClick={handleClue("healthyFish")} style={cluePos("healthyFish")} anim="ml-float-y 2.2s ease-in-out infinite">
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                  <StandaloneFishie rot={-8} color="#f97316" stroke="#c2410c" scale={1.5} />
                  <div style={{ marginLeft: 28 }}><StandaloneFishie rot={14} color="#fb923c" stroke="#c2410c" scale={1.2} /></div>
                </div>
              </ClueWrapper>

              {/* CLEAR WATER — light ripple patch in the water */}
              <ClueWrapper found={!!obs("clearWater")} onClick={handleClue("clearWater")} style={cluePos("clearWater")} anim="ml-shimmer 3s ease-in-out infinite">
                <ClearWaterRipple />
              </ClueWrapper>

              {/* THERMOMETER B — normal reading */}
              <ClueWrapper found={!!obs("tempB")} onClick={handleClue("tempB")} style={cluePos("tempB")} anim="ml-shimmer 2.5s ease-in-out infinite">
                <Thermometer hot={false} size={80} />
              </ClueWrapper>
            </>
          )}

          {/* ripples */}
          {ripples.map(r => (
            <span key={r.id} className="ripple-fx" style={{ left: `${r.x}%`, top: `${r.y}%`, width: 40, height: 40, transform: "translate(-50%, -50%)" }} />
          ))}

          {/* observation / hint popup */}
          {popText && (
            <div className="bounce-in" style={{
              position: "absolute",
              top: 20, left: 20, right: 20,
              maxWidth: 520, margin: "0 auto",
              padding: "14px 18px",
              background: "rgba(28,20,16,0.95)",
              color: "#fdf6e3",
              borderRadius: 14,
              display: "flex", alignItems: "center", gap: 14,
              boxShadow: "var(--shadow-pop)",
              zIndex: 6,
            }}>
              {popText.isHint ? (
                <>
                  <DetectiveHoot size={40} />
                  <div className="grow" style={{ fontFamily: "Kalam", fontSize: 15, fontWeight: 700, fontStyle: "italic", opacity: 0.95 }}>
                    "{popText.hint}"
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: "var(--orange-500)",
                    display: "grid", placeItems: "center", flexShrink: 0,
                  }}>
                    <Lucide name={popText.icon} size={20} color="white" />
                  </div>
                  <div className="grow">
                    <div style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 15 }}>{popText.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.9, fontFamily: "Kalam" }}>"{popText.obs}"</div>
                  </div>
                  <div style={{
                    background: "var(--yellow-400)", color: "#1c1410",
                    padding: "4px 10px", borderRadius: 999,
                    fontFamily: "Nunito", fontWeight: 900, fontSize: 13,
                  }}>+{popText.xp} XP</div>
                </>
              )}
            </div>
          )}

          {/* pond switcher tabs */}
          <div style={{
            position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)",
            background: "rgba(28,20,16,0.92)", borderRadius: 999, padding: 4,
            display: "flex", gap: 4,
          }}>
            {["A","B"].map(p => (
              <button key={p} onClick={() => setPond(p)} style={{
                border: 0, padding: "8px 18px", borderRadius: 999,
                background: pond === p ? "var(--primary)" : "transparent",
                color: pond === p ? "white" : "rgba(253,246,227,0.7)",
                fontFamily: "Nunito", fontWeight: 800, fontSize: 13,
              }}>
                Pond {p} {p === "A" ? "🔴" : "✅"}
              </button>
            ))}
          </div>
        </div>

        {/* Side: clue list + mentor */}
        <div className="col gap-3">
          <div className="card" style={{ padding: 16 }}>
            <div className="row between" style={{ alignItems: "center" }}>
              <h3 style={{ fontSize: 16 }}>Clues found</h3>
              <span className="chip orange">{observations.filter(o => o.pond === pond).length}/{clues.length}</span>
            </div>
            <div className="divider-dot" style={{ margin: "10px 0" }} />
            <div className="col gap-2">
              {clues.map(c => {
                const found = observations.find(o => o.id === c.id);
                return (
                  <div key={c.id} style={{
                    display: "flex", gap: 10, alignItems: "center",
                    padding: "8px 10px",
                    borderRadius: 10,
                    background: found ? "var(--teal-50, #f0fdfa)" : "transparent",
                    border: "1.5px dashed var(--line)",
                    opacity: found ? 1 : 0.55,
                    transition: "all .3s",
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: found ? "var(--teal-500)" : "var(--bg)",
                      color: found ? "white" : "var(--text-soft)",
                      display: "grid", placeItems: "center",
                    }}>
                      <Lucide name={found ? "check" : c.icon} size={15} />
                    </div>
                    <div className="grow" style={{ fontSize: 13, fontFamily: "Nunito", fontWeight: 700 }}>
                      {found ? c.label : "??? ??? ???"}
                    </div>
                    {found && <span style={{ fontSize: 11, fontWeight: 800, color: "var(--orange-700)" }}>+{c.xp}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card" style={{
            padding: 14,
            background: readyForHypothesis ? "var(--teal-50, #f0fdfa)" : "var(--orange-50)",
            borderColor: readyForHypothesis ? "var(--teal-300, #5eead4)" : "var(--orange-200)",
            transition: "background .4s, border-color .4s",
          }}>
            <div className="row gap-3" style={{ alignItems: "flex-start" }}>
              <DetectiveHoot size={56} mood={readyForHypothesis ? "happy" : undefined} />
              <div>
                <div className="uppercase-eyebrow" style={{ color: readyForHypothesis ? "var(--teal-700, #0f766e)" : "var(--orange-700)" }}>
                  {readyForHypothesis ? "Nice work!" : "Hoot says"}
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 600, lineHeight: 1.45 }}>
                  {readyForHypothesis
                    ? "You found every clue here! Hit \"Form hypothesis\" to make your educated guess about what's killing the fish."
                    : allPondCluesDone
                      ? "Good job on Pond B! Head to Pond A next — the sick pond has more to tell you."
                      : sick
                        ? observations.filter(o => o.pond === "A").length < 3
                          ? "Click everything that looks odd. Don't filter — observe first, think later."
                          : "Now compare with Pond B. What's different? That gap is your evidence."
                        : "Healthy ponds are your reference. Note what's normal so the weird stuff stands out."}
                </p>
              </div>
            </div>
          </div>

          <NotebookBadge count={observations.length} onClick={() => go("notebook")} />
        </div>
      </div>
    </div>
  );
}


/* ===== Screen 4: Question & Hypothesis ===== */
const QUESTIONS = [
  { id: "q1", text: "Why are fish dying in Pond A but not Pond B?", correct: true,  hint: "Tied to your observations." },
  { id: "q2", text: "Who owns the ponds?",                          correct: false, hint: "Interesting — but not a science question." },
  { id: "q3", text: "Why is the sky blue?",                         correct: false, hint: "Great question, wrong case." },
];

const HYPOTHESES = [
  { id: "h1", text: "Fish died because water temperature is too high",  good: true,  warn: false, evidence: ["temp"], color: "orange" },
  { id: "h2", text: "Fish died because oxygen levels are too low",      good: true,  warn: false, evidence: ["deadFish"], color: "teal" },
  { id: "h3", text: "Fish died because of pollution from the factory",  good: true,  warn: false, evidence: ["smell","factoryPipe","murky"], color: "yellow" },
  { id: "h4", text: "Fish died because aliens poisoned the pond",       good: false, warn: true,  evidence: [], color: "pink" },
];

function QuestionScreen({ go, observations, question, setQuestion, hypotheses, setHypotheses }) {
  const [hoverHyp, setHoverHyp] = useState(null);

  const toggleHyp = (id) => {
    setHypotheses(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  return (
    <div data-screen-label="04 Hypothesis" className="col gap-4">
      <div>
        <div className="uppercase-eyebrow">Phase 2 + 3 · Ask · Hypothesise</div>
        <h2 className="title-xl">Build your case</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 20 }}>
        {/* Step 1: Question */}
        <div className="card" style={{ padding: 22 }}>
          <div className="row between" style={{ alignItems: "center" }}>
            <h3 className="title-lg">1 · Pick a question</h3>
            <span className="chip teal"><Lucide name="lightbulb" size={12} /> Required</span>
          </div>
          <p className="text-soft" style={{ margin: "6px 0 16px", fontSize: 14 }}>
            Good scientists ask questions tied to their observations. Wrong picks are okay — try them.
          </p>
          <div className="col gap-2">
            {QUESTIONS.map(q => {
              const active = question === q.id;
              const showFeedback = active;
              return (
                <button
                  key={q.id}
                  onClick={() => setQuestion(q.id)}
                  className="card lift"
                  style={{
                    padding: 14,
                    textAlign: "left",
                    cursor: "pointer",
                    borderColor: active ? (q.correct ? "var(--teal-500)" : "#fbbf24") : "var(--line)",
                    background: active ? (q.correct ? "var(--teal-50, #f0fdfa)" : "#fef3c7") : "var(--bg-elev)",
                    borderWidth: 2,
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 999,
                      border: active ? "0" : "2px solid var(--line)",
                      background: active ? (q.correct ? "var(--teal-500)" : "#fbbf24") : "transparent",
                      color: "white",
                      display: "grid", placeItems: "center",
                      flexShrink: 0,
                    }}>
                      {active && <Lucide name={q.correct ? "check" : "x"} size={16} strokeWidth={3} />}
                    </div>
                    <div className="grow">
                      <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 15 }}>{q.text}</div>
                      {showFeedback && (
                        <div style={{ marginTop: 8, fontSize: 13, color: "var(--text-soft)", display: "flex", gap: 6, alignItems: "center" }}>
                          <DetectiveHoot size={28} />
                          <span style={{ fontFamily: "Kalam", fontWeight: 700 }}>"{q.hint}"</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Hypotheses */}
        <div className="card" style={{ padding: 22, background: "var(--bg-paper)" }}>
          <div className="row between" style={{ alignItems: "center" }}>
            <h3 className="title-lg">2 · Pick hypotheses</h3>
            <span className="chip orange">{hypotheses.length}/2</span>
          </div>
          <p className="text-soft" style={{ margin: "6px 0 16px", fontSize: 14 }}>
            A hypothesis is an <i>educated guess</i> you can test. Multiple can be reasonable.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {HYPOTHESES.map(h => {
              const picked = hypotheses.includes(h.id);
              return (
                <button
                  key={h.id}
                  onClick={() => toggleHyp(h.id)}
                  onMouseEnter={() => setHoverHyp(h.id)}
                  onMouseLeave={() => setHoverHyp(null)}
                  className={`sticky ${h.color}`}
                  style={{
                    position: "relative",
                    textAlign: "left",
                    border: 0,
                    cursor: "pointer",
                    transform: picked ? "rotate(-1deg) scale(1.03)" : "rotate(-1deg)",
                    transition: "all .2s",
                    boxShadow: picked
                      ? "0 8px 0 rgba(28,20,16,0.15), 0 16px 32px -8px rgba(28,20,16,0.4)"
                      : "4px 6px 14px -6px rgba(28,20,16,0.4)",
                    minHeight: 110,
                    fontSize: 14,
                  }}
                >
                  <div style={{ fontSize: 13, lineHeight: 1.4 }}>{h.text}</div>
                  {picked && (
                    <div style={{
                      position: "absolute", top: -10, right: -10,
                      width: 30, height: 30,
                      background: "var(--orange-500)",
                      borderRadius: 999,
                      border: "3px solid var(--bg-paper)",
                      color: "white",
                      display: "grid", placeItems: "center",
                      boxShadow: "0 4px 10px -2px rgba(0,0,0,0.3)",
                    }}>
                      <Lucide name="check" size={16} strokeWidth={3} />
                    </div>
                  )}
                  {h.warn && picked && (
                    <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: "#b91c1c", display: "flex", gap: 4, alignItems: "center", fontFamily: "Inter" }}>
                      <Lucide name="x" size={12} /> No evidence for this one!
                    </div>
                  )}
                  {hoverHyp === h.id && h.evidence.length > 0 && (
                    <div style={{
                      position: "absolute", bottom: 6, left: 8, right: 8,
                      fontSize: 10, fontFamily: "Inter", fontWeight: 700,
                      color: "var(--ink-700)", opacity: 0.8,
                    }}>
                      Linked clues: {h.evidence.length}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Evidence preview */}
          <div style={{ marginTop: 18, padding: 14, background: "var(--bg-elev)", borderRadius: 12, border: "1.5px solid var(--line)" }}>
            <div className="uppercase-eyebrow">Linked evidence from your notebook</div>
            <div className="row gap-2 wrap" style={{ marginTop: 10 }}>
              {observations.length === 0 && <span className="text-muted" style={{ fontSize: 13 }}>Observe more clues first.</span>}
              {observations.map(o => (
                <span key={o.id} className="chip" style={{ background: "var(--orange-100)", color: "var(--orange-800)", borderColor: "var(--orange-300)" }}>
                  <Lucide name={o.icon} size={11} /> {o.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mentor + CTA */}
      <div className="card" style={{ padding: 18, background: "var(--teal-50, #f0fdfa)", borderColor: "var(--teal-200)", display: "flex", gap: 18, alignItems: "center" }}>
        <DetectiveHoot size={84} />
        <div className="grow">
          <div className="uppercase-eyebrow" style={{ color: "var(--teal-800)" }}>Hoot, scientific mentor</div>
          <p style={{ margin: "4px 0 0", fontFamily: "Nunito", fontWeight: 700, fontSize: 15 }}>
            {hypotheses.length === 0
              ? "Pick at least one hypothesis. Best detectives test more than one to be safe."
              : hypotheses.includes("h4")
                ? "Hmm — \"aliens\" isn't testable. Replace it with something measurable."
                : "Nice picks. Let's go to the lab and gather evidence. Tests cost energy — choose wisely."}
          </p>
        </div>
        <button
          className="btn lg"
          disabled={hypotheses.length === 0 || !question}
          onClick={() => go("map")}
          style={{ opacity: hypotheses.length === 0 || !question ? 0.5 : 1 }}
        >
          Back to map
          <Lucide name="map" size={18} />
        </button>
      </div>
    </div>
  );
}


/* ===== Screen 5: Notebook ===== */
const NOTEBOOK_TABS = [
  { id: "obs",   label: "Observations", icon: "eye" },
  { id: "ques",  label: "Questions",    icon: "lightbulb" },
  { id: "hyp",   label: "Hypotheses",   icon: "helix" },
  { id: "exp",   label: "Experiments",  icon: "flask" },
  { id: "res",   label: "Results",      icon: "clipboard" },
  { id: "conc",  label: "Conclusion",   icon: "target" },
];

function NotebookScreen({ go, observations, question, hypotheses, experiments, conclusion }) {
  const [tab, setTab] = useState("obs");

  return (
    <div data-screen-label="05 Notebook" className="col gap-4">
      <div className="row between head" style={{ alignItems: "center" }}>
        <div>
          <div className="uppercase-eyebrow">Case Notebook</div>
          <h2 className="title-xl">Detective's journal</h2>
        </div>
        <button className="btn ghost" onClick={() => go("map")}>
          <Lucide name="chevronLeft" size={16} />
          Back to map
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, alignItems: "stretch" }}>
        {/* Tabs */}
        <div className="col gap-2">
          {NOTEBOOK_TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                border: 0,
                background: active ? "var(--bg-elev)" : "transparent",
                padding: "12px 14px",
                borderRadius: 12,
                textAlign: "left",
                display: "flex", gap: 10, alignItems: "center",
                fontFamily: "Nunito",
                fontWeight: 800,
                color: active ? "var(--primary)" : "var(--text-soft)",
                boxShadow: active ? "var(--shadow-card)" : "none",
                borderLeft: active ? "4px solid var(--primary)" : "4px solid transparent",
                cursor: "pointer",
              }}>
                <Lucide name={t.icon} size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Notebook page */}
        <div className="notebook" style={{ padding: "24px 28px 24px 52px", minHeight: 440 }}>
          {/* Spiral binding decorative */}
          <div style={{ position: "absolute", left: 12, top: 0, bottom: 0, width: 4, display: "flex", flexDirection: "column", justifyContent: "space-around", padding: "20px 0" }}>
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} style={{ width: 4, height: 4, borderRadius: 999, background: "var(--ink-400)" }} />
            ))}
          </div>

          {tab === "obs" && <ObsPage observations={observations} />}
          {tab === "ques" && <QuesPage question={question} />}
          {tab === "hyp" && <HypPage hypotheses={hypotheses} observations={observations} />}
          {tab === "exp" && <ExpPage experiments={experiments} />}
          {tab === "res" && <ResPage experiments={experiments} hypotheses={hypotheses} />}
          {tab === "conc" && <ConcPage conclusion={conclusion} />}
        </div>
      </div>
    </div>
  );
}

function ObsPage({ observations }) {
  const a = observations.filter(o => o.pond === "A");
  const b = observations.filter(o => o.pond === "B");
  return (
    <div className="bounce-in">
      <h3 className="h-hand" style={{ fontSize: 36, color: "var(--orange-700)" }}>Observations</h3>
      <div className="text-soft" style={{ fontFamily: "Kalam", fontSize: 14 }}>Maple Creek · Day 1 · cloudy</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
        <div>
          <div style={{ display: "inline-block", background: "#fee2e2", color: "#991b1b", padding: "4px 12px", borderRadius: 999, fontFamily: "Nunito", fontWeight: 800, fontSize: 13, marginBottom: 12 }}>POND A · SICK</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6, fontFamily: "Kalam", fontSize: 17 }}>
            {a.length === 0 && <li style={{ color: "var(--muted)", fontStyle: "italic" }}>No observations yet.</li>}
            {a.map(o => (
              <li key={o.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "var(--teal-600)", fontWeight: 900 }}>✓</span>
                <span><b>{o.label}.</b> {o.obs}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div style={{ display: "inline-block", background: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: 999, fontFamily: "Nunito", fontWeight: 800, fontSize: 13, marginBottom: 12 }}>POND B · HEALTHY</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6, fontFamily: "Kalam", fontSize: 17 }}>
            {b.length === 0 && <li style={{ color: "var(--muted)", fontStyle: "italic" }}>No observations yet.</li>}
            {b.map(o => (
              <li key={o.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "var(--teal-600)", fontWeight: 900 }}>✓</span>
                <span><b>{o.label}.</b> {o.obs}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* sketches */}
      <div style={{ position: "absolute", right: 24, top: 24, transform: "rotate(4deg)" }}>
        <div className="sticky orange" style={{ width: 160, fontSize: 14 }}>
          Pond A looks BROWN — Pond B is clear. Why?? 🤔
        </div>
      </div>
    </div>
  );
}

function QuesPage({ question }) {
  return (
    <div className="bounce-in">
      <h3 className="h-hand" style={{ fontSize: 36, color: "var(--orange-700)" }}>Questions</h3>
      <div style={{ marginTop: 18, padding: 16, border: "2px dashed var(--orange-400)", borderRadius: 12, background: "var(--orange-50)", fontFamily: "Kalam", fontSize: 22, fontWeight: 700, color: "var(--ink-900)" }}>
        {question === "q1" ? "Why are fish dying in Pond A but not Pond B?" : "[ Pick a question first — go back to the Question screen. ]"}
      </div>
      <div className="text-soft" style={{ marginTop: 18, fontFamily: "Kalam", fontSize: 16, lineHeight: 1.5 }}>
        A good scientific question is <b>specific</b>, <b>testable</b>, and <b>tied to what you observed</b>. 
        It points you somewhere — not just curiosity in the air.
      </div>
    </div>
  );
}

function HypPage({ hypotheses }) {
  const picks = HYPOTHESES.filter(h => hypotheses.includes(h.id));
  return (
    <div className="bounce-in">
      <h3 className="h-hand" style={{ fontSize: 36, color: "var(--orange-700)" }}>Hypotheses</h3>
      <p style={{ fontFamily: "Kalam", fontSize: 16, margin: "6px 0 18px" }}>An <b>educated guess</b> we can test.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {picks.length === 0 && <div className="text-muted" style={{ fontStyle: "italic", fontFamily: "Kalam", fontSize: 18 }}>No hypotheses yet.</div>}
        {picks.map((h, i) => (
          <div key={h.id} className={`sticky ${h.color}`} style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)`, fontSize: 15 }}>
            <div style={{ fontSize: 11, fontFamily: "Nunito", fontWeight: 800, opacity: 0.7, marginBottom: 4 }}>H{i + 1}</div>
            {h.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpPage({ experiments }) {
  return (
    <div className="bounce-in">
      <h3 className="h-hand" style={{ fontSize: 36, color: "var(--orange-700)" }}>Experiments</h3>
      <p style={{ fontFamily: "Kalam", fontSize: 16, margin: "6px 0 18px" }}>What I tested · and how.</p>
      {experiments.length === 0 && <div className="text-muted" style={{ fontStyle: "italic", fontFamily: "Kalam", fontSize: 18 }}>Run tests in the Lab Tent.</div>}
      <div className="col gap-3">
        {experiments.map(e => (
          <div key={e.id} style={{ padding: 14, background: "var(--bg-elev)", borderRadius: 10, border: "1.5px solid var(--line)", fontFamily: "Kalam", fontSize: 16 }}>
            <b>{e.label}.</b> Method: {e.method}.
          </div>
        ))}
      </div>
    </div>
  );
}

function ResPage({ experiments }) {
  return (
    <div className="bounce-in">
      <h3 className="h-hand" style={{ fontSize: 36, color: "var(--orange-700)" }}>Results</h3>
      <p style={{ fontFamily: "Kalam", fontSize: 16, margin: "6px 0 18px" }}>Numbers don't lie.</p>
      {experiments.length === 0 && <div className="text-muted" style={{ fontStyle: "italic", fontFamily: "Kalam", fontSize: 18 }}>No results yet.</div>}
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Inter", fontSize: 14 }}>
        {experiments.length > 0 && (
          <thead>
            <tr style={{ textAlign: "left", color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <th style={{ padding: "8px 0" }}>Test</th>
              <th>Pond A</th>
              <th>Pond B</th>
              <th>Verdict</th>
            </tr>
          </thead>
        )}
        <tbody>
          {experiments.map(e => (
            <tr key={e.id} style={{ borderTop: "1.5px dashed var(--line)" }}>
              <td style={{ padding: "10px 0", fontWeight: 700 }}>{e.label}</td>
              <td style={{ color: "var(--orange-700)", fontWeight: 700 }}>{e.resultA}</td>
              <td style={{ color: "var(--teal-700)", fontWeight: 700 }}>{e.resultB}</td>
              <td><span className={`chip ${e.verdict === "support" ? "green" : e.verdict === "contradict" ? "red" : "yellow"}`}>
                {e.verdict === "support" ? "✓ supports" : e.verdict === "contradict" ? "✗ no support" : "⚠ partial"}
              </span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConcPage({ conclusion }) {
  return (
    <div className="bounce-in">
      <h3 className="h-hand" style={{ fontSize: 36, color: "var(--orange-700)" }}>Conclusion</h3>
      <p style={{ fontFamily: "Kalam", fontSize: 16, margin: "6px 0 18px" }}>Closing the case.</p>
      <div style={{ padding: 16, border: "2px dashed var(--orange-400)", borderRadius: 12, background: "var(--orange-50)", fontFamily: "Kalam", fontSize: 18, lineHeight: 1.5 }}>
        {conclusion || "Submit your final report from the Conclusion screen."}
      </div>
    </div>
  );
}

export { ObservationScreen, QuestionScreen, NotebookScreen, HYPOTHESES };
