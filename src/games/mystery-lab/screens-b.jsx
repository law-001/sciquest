/* ============================================================
   Mystery Lab — Screens part 2
   ============================================================ */
import React, { useState, useCallback } from "react";
import { DetectiveHoot, Lucide, NotebookBadge } from "./shared.jsx";
import { Pond, Factory, Reed, Tree, Cloud } from "./world.jsx";

/* ===== Screen 3: Observation Scene ===== */
const POND_A_CLUES = [
  { id: "deadFish",    label: "Dead Fish",      icon: "fish",        x: 38, y: 60, obs: "Several fish are floating belly-up. They look untouched.",  xp: 8 },
  { id: "murky",       label: "Murky Water",    icon: "droplet",     x: 56, y: 52, obs: "The water is brown and cloudy. Hard to see the bottom.",     xp: 6 },
  { id: "temp",        label: "Temperature",    icon: "thermometer", x: 70, y: 70, obs: "Thermometer reads 34°C. Unusually warm for this season.",   xp: 6 },
  { id: "smell",       label: "Strange Smell",  icon: "sparkles",    x: 26, y: 78, obs: "A sharp, chemical smell hangs over the pond.",               xp: 6 },
  { id: "factoryPipe", label: "Drainage Pipe",  icon: "factory",     x: 84, y: 22, obs: "A pipe from the factory drips a grey-brown liquid into the soil.", xp: 10 },
];
const POND_B_CLUES = [
  { id: "healthyFish", label: "Healthy Fish",   icon: "fish",        x: 50, y: 60, obs: "Fish swim actively. Bright orange scales — all looks normal.", xp: 4, control: true },
  { id: "clearWater",  label: "Clear Water",    icon: "droplet",     x: 30, y: 70, obs: "You can see right to the bottom. No discoloration.",          xp: 4, control: true },
  { id: "tempB",       label: "Temperature B",  icon: "thermometer", x: 72, y: 76, obs: "Thermometer reads 22°C. Normal seasonal value.",              xp: 4, control: true },
];

function ObservationScreen({ go, pond, setPond, observations, addObservation }) {
  const clues = pond === "A" ? POND_A_CLUES : POND_B_CLUES;
  const sick = pond === "A";
  const [popText, setPopText] = useState(null);
  const [ripples, setRipples] = useState([]);

  const onClickClue = useCallback((c) => {
    if (observations.find(o => o.id === c.id)) return;
    addObservation({ ...c, pond });
    setPopText(c);
    setTimeout(() => setPopText(p => (p && p.id === c.id ? null : p)), 2400);
    const id = Date.now();
    setRipples(r => [...r, { id, x: c.x, y: c.y }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700);
  }, [pond, observations, addObservation]);

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
          <button className="btn teal" onClick={() => go(observations.length >= 4 ? "question" : "map")}>
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

          {/* Pond hero */}
          <div style={{ position: "absolute", left: "50%", bottom: 60, transform: "translateX(-50%) scale(1.8)" }}>
            <Pond sick={sick} dead={sick ? 5 : 0} size={260} />
          </div>

          {/* Reeds */}
          <Reed x={20} y={350} size={40} />
          <Reed x={70} y={400} size={50} />
          <Reed x={680} y={380} size={45} />

          {/* factory in distance if sick */}
          {sick && (
            <div style={{ position: "absolute", top: 60, right: 30, transform: "scale(0.6)" }}>
              <Factory />
            </div>
          )}
          {/* tree */}
          {!sick && (
            <div style={{ position: "absolute", top: 30, right: 70 }}>
              <Tree size={70} variant={1} />
            </div>
          )}

          {/* clue hotspots */}
          {clues.map(c => {
            const found = observations.find(o => o.id === c.id);
            return (
              <button
                key={c.id}
                onClick={(e) => onClickClue(c, e)}
                style={{
                  position: "absolute",
                  left: `${c.x}%`, top: `${c.y}%`,
                  transform: "translate(-50%, -50%)",
                  background: found ? "var(--teal-500)" : "rgba(255,255,255,0.92)",
                  color: found ? "white" : "var(--ink-900)",
                  border: "3px solid #fdf6e3",
                  borderRadius: 999,
                  width: 50, height: 50,
                  cursor: found ? "default" : "pointer",
                  boxShadow: "0 4px 0 rgba(0,0,0,0.25), 0 12px 22px -4px rgba(0,0,0,0.3)",
                  display: "grid", placeItems: "center",
                  zIndex: 4,
                }}
                title={found ? "Already noted" : c.label}
              >
                {!found && (
                  <span style={{
                    position: "absolute", inset: -6, borderRadius: 999,
                    border: "3px solid white", opacity: 0.6,
                    animation: "ml-pulse-ring 1.8s ease-out infinite",
                  }} />
                )}
                <Lucide name={found ? "check" : c.icon} size={22} />
              </button>
            );
          })}

          {/* ripples */}
          {ripples.map(r => (
            <span key={r.id} className="ripple-fx" style={{ left: `${r.x}%`, top: `${r.y}%`, width: 40, height: 40, transform: "translate(-50%, -50%)" }} />
          ))}

          {/* observation popup */}
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

          <div className="card" style={{ padding: 14, background: "var(--orange-50)", borderColor: "var(--orange-200)" }}>
            <div className="row gap-3" style={{ alignItems: "flex-start" }}>
              <DetectiveHoot size={56} />
              <div>
                <div className="uppercase-eyebrow" style={{ color: "var(--orange-700)" }}>Hoot says</div>
                <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 600, lineHeight: 1.45 }}>
                  {sick
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
          onClick={() => go("lab")}
          style={{ opacity: hypotheses.length === 0 || !question ? 0.5 : 1 }}
        >
          To the Lab Tent
          <Lucide name="flask" size={18} />
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
