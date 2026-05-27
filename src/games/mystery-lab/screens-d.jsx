/* ============================================================
   Mystery Lab — Screens part 4 (Evidence / Conclusion / Victory)
   ============================================================ */
import React, { useState, useEffect } from "react";
import { mlAudio } from "./audio.js";
import { DetectiveHoot, Lucide, CrimeTape } from "./shared.jsx";
import { Pond } from "./world.jsx";

/* ===== Screen 7: Evidence Board · STORY MODE =====
   Reconstruct the case as a 5-panel comic strip. Each panel asks
   what happened next; player picks the right clue. Wrong picks
   trigger mentor commentary explaining why they don't fit. */

const STORY_STEPS = [
  {
    id: "source",
    title: "The Source",
    prompt: "Where did the trouble begin?",
    placeholder: "What's upstream of the pond?",
    caption: "It all started at the factory beside Maple Creek.",
    correctClueId: "factory",
    scene: "factory",
  },
  {
    id: "leak",
    title: "The Leak",
    prompt: "What did the factory release into the water?",
    placeholder: "Look at the drainage pipe.",
    caption: "A drainage pipe leaked industrial waste straight into Pond A.",
    correctClueId: "pollution",
    scene: "leak",
  },
  {
    id: "poison",
    title: "The Poison",
    prompt: "How did Pond A's water change?",
    placeholder: "Your pH and microscope tests told you something.",
    caption: "The waste left heavy metals behind and turned the water acidic — pH 4.5.",
    correctClueId: "contaminants",
    scene: "contamination",
  },
  {
    id: "effect",
    title: "The Effect",
    prompt: "What happened next, inside the polluted water?",
    placeholder: "Your oxygen probe gave you the answer.",
    caption: "Dissolved oxygen plummeted — the water couldn't hold enough for fish to breathe.",
    correctClueId: "oxygen",
    scene: "lowoxygen",
  },
  {
    id: "tragedy",
    title: "The Tragedy",
    prompt: "And the final result?",
    placeholder: "You saw this on day one.",
    caption: "Without oxygen, the fish in Pond A couldn't breathe. They died.",
    correctClueId: "deadfish",
    scene: "deadfish",
  },
];

const STORY_CLUES = [
  { id: "factory",      label: "Factory drainage pipe",       icon: "factory",     forStep: "source" },
  { id: "pollution",    label: "Industrial waste in water",   icon: "droplet",     forStep: "leak" },
  { id: "contaminants", label: "Heavy metals · acidic water", icon: "flask",       forStep: "poison" },
  { id: "oxygen",       label: "Dangerously low oxygen",      icon: "sparkles",    forStep: "effect" },
  { id: "deadfish",     label: "Dead fish floating",          icon: "fish",        forStep: "tragedy" },
  // distractors
  { id: "warmth",       label: "Warm afternoon weather",      icon: "thermometer", forStep: null,
    hint: "Heat can make low-oxygen worse — but Pond B was also warm and its fish are fine. Heat isn't your chain." },
  { id: "pondB",        label: "Pond B fish are healthy",     icon: "leaf",        forStep: null,
    hint: "Pond B is your CONTROL — it shows what the story would be WITHOUT the factory. It's not part of the chain itself." },
];

function EvidenceScreen({ go, evidenceLinks, setEvidenceLinks, observations = [], experiments = [] }) {
  const visitedPondA = observations.some(o => o.pond === "A");
  const visitedPondB = observations.some(o => o.pond === "B");
  const hasInvestigated = visitedPondA && visitedPondB && experiments.length > 0;

  const [shake, setShake] = useState(null);
  const [hint, setHint] = useState(null);
  const [justPlaced, setJustPlaced] = useState(null);

  if (!hasInvestigated) {
    return (
      <div data-screen-label="07 Evidence Board" className="col gap-4">
        <div className="row between head" style={{ alignItems: "center" }}>
          <div>
            <div className="uppercase-eyebrow">Phase 5 · Reconstruct the case</div>
            <h2 className="title-xl">Tell the story of what happened</h2>
          </div>
        </div>
        <div className="col gap-4" style={{ alignItems: "center", justifyContent: "center", minHeight: 340, textAlign: "center" }}>
          <div className="card" style={{ maxWidth: 480, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <DetectiveHoot size={80} mood="stern" />
            <div>
              <div className="uppercase-eyebrow" style={{ color: "var(--orange-700)" }}>Not so fast, detective!</div>
              <h3 style={{ margin: "8px 0 6px", fontSize: 20, fontFamily: "Nunito", fontWeight: 900, color: "var(--text)" }}>
                {!visitedPondA || !visitedPondB ? "Visit both ponds first" : "Run your lab tests first"}
              </h3>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.5, color: "var(--text-muted)" }}>
                {!visitedPondA || !visitedPondB
                  ? "You need clues from both Pond A and Pond B before the evidence board unlocks."
                  : "Head to the Lab Tent and run your experiments — then come back to piece the story together."}
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

  // evidenceLinks acts as ordered list of placed clue ids
  const placed = Array.isArray(evidenceLinks) ? evidenceLinks.filter(x => typeof x === "string") : [];
  const currentStepIdx = placed.length;
  const isComplete = currentStepIdx >= STORY_STEPS.length;
  const currentStep = STORY_STEPS[currentStepIdx];

  const onPickClue = (clue) => {
    if (isComplete) return;
    if (clue.forStep === currentStep.id) {
      mlAudio.correct();
      setEvidenceLinks([...placed, clue.id]);
      setJustPlaced(clue.id);
      setHint(null);
      setTimeout(() => setJustPlaced(null), 800);
    } else {
      mlAudio.wrong();
      setShake(clue.id);
      setHint(clue.hint || "That clue doesn't fit this part of the story. Re-read the panel prompt.");
      setTimeout(() => setShake(null), 400);
    }
  };

  const reset = () => { setEvidenceLinks([]); setHint(null); };

  return (
    <div data-screen-label="07 Evidence Board" className="col gap-4">
      <div className="row between head" style={{ alignItems: "center" }}>
        <div>
          <div className="uppercase-eyebrow">Phase 5 · Reconstruct the case</div>
          <h2 className="title-xl">Tell the story of what happened</h2>
        </div>
        <div className="row gap-2">
          <button className="btn ghost" onClick={reset}>
            <Lucide name="refresh" size={14} /> Restart story
          </button>
          <button className="btn" disabled={!isComplete} onClick={() => go("conclude")}
            style={{ opacity: isComplete ? 1 : 0.5 }}>
            Submit conclusion <Lucide name="chevronRight" size={16} />
          </button>
        </div>
      </div>

      {/* Comic strip across the top */}
      <ComicStrip steps={STORY_STEPS} placed={placed} currentStepIdx={currentStepIdx} justPlaced={justPlaced} />

      <div className="ml-2col-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* clue pile + prompt */}
        <div className="card" style={{ padding: 18, minHeight: 240 }}>
          {!isComplete ? (
            <>
              <div className="row gap-3" style={{ alignItems: "center", flexWrap: "wrap" }}>
                <span className="chip orange" style={{ fontSize: 12 }}>Panel {currentStepIdx + 1} · {currentStep.title}</span>
                <span className="text-muted" style={{ fontSize: 12, fontWeight: 700 }}>{currentStep.placeholder}</span>
              </div>
              <h3 style={{ marginTop: 14, fontSize: 22, fontFamily: "Caveat", fontWeight: 700, color: "var(--text)" }}>
                "{currentStep.prompt}"
              </h3>
              <div className="text-soft" style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>
                Pick the clue that fits this panel.
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
                {STORY_CLUES.filter(c => !placed.includes(c.id)).map(c => (
                  <ClueCard key={c.id} clue={c} shaking={shake === c.id} onClick={() => onPickClue(c)} />
                ))}
              </div>
            </>
          ) : (
            <CompletedStory steps={STORY_STEPS} />
          )}
        </div>

        {/* mentor + progress */}
        <div className="col gap-3 ml-game-sidebar">
          <div className="card" style={{
            padding: 14,
            background: hint ? "var(--yellow-100)" : (isComplete ? "var(--teal-50)" : "var(--orange-50)"),
            borderColor: hint ? "var(--yellow-400)" : (isComplete ? "var(--teal-300)" : "var(--orange-200)"),
            transition: "background .3s",
          }}>
            <div className="row gap-3" style={{ alignItems: "flex-start" }}>
              <DetectiveHoot size={60} mood={hint ? "stern" : "thinking"} />
              <div>
                <div className="uppercase-eyebrow" style={{ color: hint ? "#92400e" : (isComplete ? "#166534" : "var(--orange-700)") }}>
                  {hint ? "Not quite!" : isComplete ? "Case solved" : "Hoot says"}
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 600, lineHeight: 1.45 }}>
                  {hint
                    ? hint
                    : isComplete
                      ? "Beautiful. You've reconstructed the full chain. Read it back — every step has evidence to back it up."
                      : currentStepIdx === 0
                        ? "Start at the beginning. What's the SOURCE of all the trouble?"
                        : `You've nailed panels 1–${currentStepIdx}. What happened next?`}
                </p>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <div className="uppercase-eyebrow">Story progress</div>
            <div style={{ fontSize: 26, fontFamily: "Nunito", fontWeight: 900, marginTop: 4 }}>
              {placed.length} <span className="text-muted" style={{ fontWeight: 700, fontSize: 14 }}>of 5 panels</span>
            </div>
            <div className="bar" style={{ marginTop: 8 }}>
              <span style={{ width: `${(placed.length / 5) * 100}%` }} />
            </div>
            <div className="text-muted" style={{ fontSize: 11, marginTop: 8, fontWeight: 600 }}>
              Wrong picks: no penalty. Try until it fits.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----- Comic strip of 5 panels ----- */
function ComicStrip({ steps, placed, currentStepIdx, justPlaced }) {
  return (
    <div style={{
      position: "relative",
      padding: "20px 16px",
      background: "var(--ink-900)",
      borderRadius: 16,
      boxShadow: "var(--shadow-card)",
      overflow: "hidden",
    }}>
      {/* film sprocket strips top/bottom */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 4, height: 12, display: "flex", justifyContent: "space-around", pointerEvents: "none" }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} style={{ width: 14, height: 8, background: "var(--ink-700)", borderRadius: 2 }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 4, height: 12, display: "flex", justifyContent: "space-around", pointerEvents: "none" }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} style={{ width: 14, height: 8, background: "var(--ink-700)", borderRadius: 2 }} />
        ))}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr) ",
        gap: 10,
        margin: "16px 0",
        position: "relative",
      }}>
        {steps.map((s, i) => {
          const filled = i < placed.length;
          const isCurrent = i === currentStepIdx;
          const isJustPlaced = filled && placed[i] === justPlaced;
          return (
            <ComicPanel
              key={s.id}
              step={s}
              idx={i}
              filled={filled}
              isCurrent={isCurrent}
              isJustPlaced={isJustPlaced}
              nextFilled={i + 1 < placed.length}
            />
          );
        })}
      </div>
    </div>
  );
}

function ComicPanel({ step, idx, filled, isCurrent, isJustPlaced, nextFilled }) {
  return (
    <div style={{ position: "relative" }}>
      <div className={isJustPlaced ? "bounce-in" : ""} style={{
        position: "relative",
        aspectRatio: "4 / 3.4",
        background: filled ? "#fffaee" : "#2a1f17",
        border: isCurrent ? "3px solid var(--accent)" : "3px solid var(--ink-700)",
        borderRadius: 10,
        overflow: "hidden",
        transition: "all .3s",
        boxShadow: isCurrent ? "0 0 0 4px rgba(250,204,21,0.25)" : "none",
      }}>
        {/* Panel number badge */}
        <div style={{
          position: "absolute", top: 6, left: 6, zIndex: 3,
          background: filled ? "#1c1410" : "var(--ink-700)",
          color: filled ? "#fde047" : "#a89579",
          padding: "2px 8px",
          borderRadius: 4,
          fontFamily: "Nunito",
          fontWeight: 900,
          fontSize: 11,
          letterSpacing: "0.06em",
        }}>
          {idx + 1}
        </div>

        {/* current marker */}
        {isCurrent && !filled && (
          <div style={{
            position: "absolute", inset: 0, display: "grid", placeItems: "center",
            color: "var(--accent)",
            fontFamily: "Caveat", fontWeight: 700, fontSize: 28,
            textAlign: "center", padding: 12,
          }}>
            <div>
              <div style={{ fontSize: 36, opacity: 0.8 }}>?</div>
              <div style={{ fontSize: 11, fontFamily: "Nunito", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.85 }}>Solve me</div>
            </div>
          </div>
        )}

        {/* future panel */}
        {!isCurrent && !filled && (
          <div style={{
            position: "absolute", inset: 0, display: "grid", placeItems: "center",
            color: "rgba(253,246,227,0.25)",
            fontFamily: "Nunito", fontWeight: 900, fontSize: 40,
          }}>
            ·
          </div>
        )}

        {/* Filled panel — scene illustration */}
        {filled && (
          <>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", padding: 10 }}>
              <SceneIllustration name={step.scene} />
            </div>
            {/* caption ribbon at bottom */}
            <div style={{
              position: "absolute", left: 6, right: 6, bottom: 6,
              background: "rgba(28,20,16,0.92)",
              color: "#fdf6e3",
              padding: "5px 8px",
              borderRadius: 4,
              fontFamily: "Caveat",
              fontWeight: 700,
              fontSize: 12,
              lineHeight: 1.2,
              textAlign: "center",
            }}>
              {step.caption}
            </div>
          </>
        )}

        {/* Panel title (small) on bottom-left when not filled */}
        {!filled && (
          <div style={{
            position: "absolute", left: 6, right: 6, bottom: 6,
            color: isCurrent ? "var(--accent)" : "#a89579",
            fontFamily: "Nunito",
            fontWeight: 800,
            fontSize: 11,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            textAlign: "center",
          }}>
            {step.title}
          </div>
        )}
      </div>

      {/* connector arrow */}
      {idx < 4 && (
        <div style={{
          position: "absolute",
          right: -10, top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          width: 18, height: 18,
          background: nextFilled ? "var(--orange-500)" : "var(--ink-700)",
          color: "white",
          borderRadius: 999,
          display: "grid", placeItems: "center",
          border: "2px solid var(--ink-900)",
          transition: "background .3s",
        }}>
          <Lucide name="chevronRight" size={11} strokeWidth={3} />
        </div>
      )}
    </div>
  );
}

/* ----- Scene illustrations for each panel ----- */
function SceneIllustration({ name }) {
  const colors = {
    factory:       { bg: "#fef3c7", accent: "#5b4530", icon: "factory",     label: "FACTORY" },
    leak:          { bg: "#fef9c3", accent: "#7c5a30", icon: "droplet",     label: "LEAK" },
    contamination: { bg: "#fce7f3", accent: "#9a3412", icon: "flask",       label: "TOXIC" },
    lowoxygen:     { bg: "#3d2e22", accent: "#dc2626", icon: "sparkles",    label: "LOW O2" },
    deadfish:      { bg: "#fcd6a3", accent: "#7c5a30", icon: "fish",        label: "DIED" },
  };
  const c = colors[name] || colors.factory;
  const dark = name === "lowoxygen";
  return (
    <div style={{
      width: "100%", height: "100%",
      background: c.bg,
      display: "grid", placeItems: "center",
      position: "relative",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: c.accent,
        display: "grid", placeItems: "center",
        color: dark ? "#fde047" : "white",
        boxShadow: "0 4px 0 rgba(0,0,0,0.15)",
      }}>
        <Lucide name={c.icon} size={28} strokeWidth={2.2} />
      </div>
      <div style={{
        position: "absolute", top: 6, right: 6,
        background: dark ? "#dc2626" : c.accent,
        color: dark ? "white" : "#fdf6e3",
        padding: "2px 7px",
        borderRadius: 4,
        fontFamily: "Nunito",
        fontWeight: 900,
        fontSize: 9,
        letterSpacing: "0.06em",
      }}>{c.label}</div>
    </div>
  );
}

/* ----- Clue card ----- */
function ClueCard({ clue, shaking, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`card lift ${shaking ? "shake" : ""}`}
      style={{
        padding: "14px 14px",
        textAlign: "left",
        background: "var(--bg-elev)",
        border: "1.5px solid var(--line)",
        display: "flex",
        gap: 12,
        alignItems: "center",
        cursor: "pointer",
        fontFamily: "Nunito",
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: "var(--orange-100)", color: "var(--orange-700)",
        display: "grid", placeItems: "center",
        border: "1.5px solid var(--orange-200)",
        flexShrink: 0,
      }}>
        <Lucide name={clue.icon} size={20} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>{clue.label}</div>
        <div className="text-muted" style={{ fontSize: 11, fontWeight: 700, marginTop: 2, letterSpacing: "0.04em" }}>
          Drop on a panel
        </div>
      </div>
    </button>
  );
}

/* ----- Completed story view ----- */
function CompletedStory({ steps }) {
  return (
    <div className="bounce-in">
      <div className="row gap-2" style={{ alignItems: "center", flexWrap: "wrap" }}>
        <span className="chip green"><Lucide name="check" size={12} strokeWidth={3} /> Story complete</span>
        <span className="text-muted" style={{ fontSize: 12, fontWeight: 700 }}>5 of 5 panels filled</span>
      </div>
      <h3 style={{ marginTop: 14, fontSize: 22, fontFamily: "Nunito", fontWeight: 900 }}>
        The case of Pond A, in five panels.
      </h3>
      <div style={{
        marginTop: 18,
        padding: "18px 22px",
        background: "var(--bg-paper)",
        backgroundImage: "linear-gradient(rgba(28,20,16,0.06) 1px, transparent 1px)",
        backgroundSize: "100% 28px",
        backgroundPosition: "0 24px",
        border: "1.5px solid var(--line)",
        borderRadius: 12,
        fontFamily: "Kalam",
        fontSize: 18,
        lineHeight: 1.55,
        color: "var(--text)",
      }}>
        {steps.map((s, i) => (
          <span key={s.id}>
            <b style={{ color: "var(--orange-700)" }}>{i + 1}.</b> {s.caption}{" "}
          </span>
        ))}
      </div>
      <div className="text-soft" style={{ marginTop: 14, fontSize: 13, fontFamily: "Inter", fontWeight: 600 }}>
        Take this story to the conclusion screen and submit your report. The Mayor's waiting.
      </div>
    </div>
  );
}



/* ===== Screen 8: Final Conclusion ===== */
const CAUSES = [
  { id: "temp",     text: "High water temperature",          correct: false },
  { id: "pollution", text: "Pollution from factory waste",   correct: true  },
  { id: "alien",    text: "Aliens poisoned the pond",        correct: false },
  { id: "magic",    text: "Unknown magic",                   correct: false },
];

const SUPPORTS = [
  { id: "pollutionDet", text: "Pollution detected in pond water",    good: true },
  { id: "lowO2",        text: "Low oxygen levels in Pond A",         good: true },
  { id: "factoryDrain", text: "Factory drainage pipe nearby",        good: true },
  { id: "metals",       text: "Heavy metal particles under microscope", good: true },
  { id: "skyColor",     text: "Sky is currently blue",               good: false },
  { id: "fishCount",    text: "Fish were not counted last week",     good: false },
];

function ConclusionScreen({ cause, setCause, supports, setSupports, written, setWritten, setConclusion, onVictory }) {
  const toggleSupport = (id) => {
    setSupports(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const submit = () => {
    const causeRight = CAUSES.find(c => c.id === cause)?.correct;
    const goodSupports = supports.filter(id => SUPPORTS.find(s => s.id === id)?.good).length;
    const wrongSupports = supports.filter(id => !SUPPORTS.find(s => s.id === id)?.good).length;
    const wordCount = written.trim().split(/\s+/).filter(Boolean).length;
    const stars = {
      accuracy: causeRight ? 3 : 1,
      evidence: Math.min(3, Math.max(1, goodSupports - wrongSupports + 1)),
      thinking: wordCount >= 30 ? 3 : wordCount >= 12 ? 2 : 1,
    };
    setConclusion(written);
    onVictory({ stars, causeRight });
  };

  return (
    <div data-screen-label="08 Conclusion" className="col gap-4">
      <div>
        <div className="uppercase-eyebrow">Phase 6 · Conclude</div>
        <h2 className="title-xl">Submit your final report</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        {/* report form */}
        <div className="card" style={{ padding: 24, background: "var(--bg-paper)" }}>
          {/* Letterhead */}
          <div className="row between" style={{ alignItems: "center", borderBottom: "2px solid var(--ink-300)", paddingBottom: 12, marginBottom: 20 }}>
            <div>
              <div className="uppercase-eyebrow">SciQuest · Field Report</div>
              <h3 className="h-display" style={{ fontSize: 22, marginTop: 4 }}>Case #001 — The Dying Pond Mystery</h3>
            </div>
            <div className="tag">Confidential</div>
          </div>

          {/* Q1 — main cause */}
          <div>
            <div className="uppercase-eyebrow">Q1 · Main cause</div>
            <h4 style={{ fontSize: 16, margin: "4px 0 12px" }}>What MOST likely caused the fish deaths?</h4>
            <div className="col gap-2">
              {CAUSES.map(c => {
                const active = cause === c.id;
                return (
                  <button key={c.id} onClick={() => setCause(c.id)} style={{
                    border: 0,
                    background: active ? "var(--orange-100)" : "var(--bg-elev)",
                    padding: "12px 14px",
                    borderRadius: 12,
                    textAlign: "left",
                    display: "flex", gap: 12, alignItems: "center",
                    cursor: "pointer",
                    boxShadow: active ? "0 0 0 2px var(--primary)" : "var(--shadow-card)",
                    fontFamily: "Nunito",
                    fontWeight: 700,
                    fontSize: 14,
                  }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: 999,
                      border: active ? "0" : "2px solid var(--line)",
                      background: active ? "var(--primary)" : "transparent",
                      display: "grid", placeItems: "center", color: "white",
                    }}>
                      {active && <span style={{ width: 10, height: 10, borderRadius: 999, background: "white" }} />}
                    </span>
                    {c.text}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="divider-dot" style={{ margin: "20px 0" }} />

          {/* Q2 — supports */}
          <div>
            <div className="uppercase-eyebrow">Q2 · Supporting evidence</div>
            <h4 style={{ fontSize: 16, margin: "4px 0 12px" }}>Which evidence supports your answer? (pick all that apply)</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {SUPPORTS.map(s => {
                const checked = supports.includes(s.id);
                return (
                  <button key={s.id} onClick={() => toggleSupport(s.id)} style={{
                    border: checked ? "2px solid var(--teal-500)" : "1.5px solid var(--line)",
                    background: checked ? "var(--teal-50, #f0fdfa)" : "var(--bg-elev)",
                    padding: "10px 12px",
                    borderRadius: 10,
                    textAlign: "left",
                    display: "flex", gap: 10, alignItems: "center",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                  }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: 4,
                      border: checked ? "0" : "2px solid var(--line)",
                      background: checked ? "var(--teal-500)" : "transparent",
                      display: "grid", placeItems: "center", color: "white", flexShrink: 0,
                    }}>
                      {checked && <Lucide name="check" size={12} strokeWidth={3} />}
                    </span>
                    {s.text}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="divider-dot" style={{ margin: "20px 0" }} />

          {/* Q3 — written explanation */}
          <div>
            <div className="uppercase-eyebrow">Q3 · Explain in your own words</div>
            <h4 style={{ fontSize: 16, margin: "4px 0 12px" }}>Why is your answer correct? Use your evidence.</h4>
            <textarea
              value={written}
              onChange={e => setWritten(e.target.value)}
              placeholder="Start with: I think the fish in Pond A died because…"
              style={{
                width: "100%",
                minHeight: 90,
                padding: 14,
                fontFamily: "Kalam",
                fontSize: 17,
                lineHeight: 1.5,
                background: "var(--bg-paper)",
                backgroundImage: "linear-gradient(rgba(28,20,16,0.08) 1px, transparent 1px)",
                backgroundSize: "100% 28px",
                backgroundPosition: "0 24px",
                border: "1.5px solid var(--line)",
                borderRadius: 12,
                resize: "vertical",
                outline: "none",
              }}
            />
            <div className="text-muted" style={{ fontSize: 11, marginTop: 6 }}>
              {written.trim().split(/\s+/).filter(Boolean).length} words · aim for 30+ for full marks
            </div>
          </div>
        </div>

        {/* mentor sidebar */}
        <div className="col gap-3" style={{ position: "sticky", top: 80, alignSelf: "start" }}>
          <div className="card" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
            <CrimeTape text="SUBMITTING · " angle={-3} top={20} />
            <div style={{ marginTop: 60 }}>
              <DetectiveHoot size={120} mood="stern" />
            </div>
            <div className="uppercase-eyebrow" style={{ marginTop: 12 }}>Detective Hoot</div>
            <p style={{ margin: "4px 0 0", fontFamily: "Kalam", fontSize: 17, fontWeight: 700, lineHeight: 1.4 }}>
              "Pick one cause. List the evidence that proves it. Explain like you're telling another detective. <b>Then submit.</b>"
            </p>
          </div>

          <button
            className="btn lg"
            disabled={!cause || supports.length < 2 || written.trim().length < 12}
            onClick={submit}
            style={{
              opacity: !cause || supports.length < 2 || written.trim().length < 12 ? 0.5 : 1,
              width: "100%", justifyContent: "center",
            }}
          >
            <Lucide name="award" size={20} />
            Close the Case
          </button>

          <div className="text-muted" style={{ fontSize: 12, textAlign: "center" }}>
            Required: 1 cause · 2+ evidence · 12+ words
          </div>
        </div>
      </div>
    </div>
  );
}


/* ===== Screen 9: Victory / Case Closed ===== */
function VictoryScreen({ victory, observations, experiments, evidenceLinks, restart }) {
  const v = victory || { stars: { accuracy: 1, evidence: 1, thinking: 1 }, causeRight: false };
  const totalStars = v.stars.accuracy + v.stars.evidence + v.stars.thinking;

  useEffect(() => { mlAudio.victory(); }, []);
  const xpAward = totalStars * 25 + observations.length * 4;

  return (
    <div data-screen-label="09 Victory" className="col gap-4" style={{ position: "relative" }}>
      {/* confetti */}
      <Confetti />

      {/* Newspaper */}
      <div className="card bounce-in" style={{
        padding: 0, overflow: "hidden", borderRadius: 4,
        background: "var(--bg-paper)",
        backgroundImage: "radial-gradient(var(--line-soft) 1px, transparent 1.5px)",
        backgroundSize: "10px 10px",
        border: "2px solid var(--text)",
        position: "relative",
        zIndex: 2,
      }}>
        <div style={{ padding: "20px 32px 18px" }}>
          {/* Masthead */}
          <div style={{ borderBottom: "4px double var(--text)", paddingBottom: 12, marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
              <div style={{ fontFamily: "Caveat", fontSize: 16, fontWeight: 700 }}>Vol. I · No. 001</div>
              <h1 className="h-display" style={{ fontSize: 34, fontFamily: "serif", fontWeight: 900, letterSpacing: "-0.01em" }}>
                THE MAPLE TIMES
              </h1>
              <div style={{ fontFamily: "Caveat", fontSize: 16, fontWeight: 700 }}>Friday · 50¢</div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textAlign: "center", marginTop: 4 }}>
              EST. 1928 · "ALL THE SCIENCE THAT FITS"
            </div>
          </div>

          {/* Headline */}
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", color: "var(--orange-500)" }}>
              ★ BREAKING ★ ★ BREAKING ★
            </div>
            <h2 style={{
              fontFamily: "Nunito",
              fontWeight: 900,
              fontSize: 46,
              lineHeight: 1,
              marginTop: 6,
              color: "var(--text)",
              letterSpacing: "-0.02em",
            }}>
              MYSTERY SOLVED!
            </h2>
            <div style={{ fontFamily: "Caveat", fontSize: 26, fontWeight: 700, marginTop: 6, color: "var(--orange-500)" }}>
              {v.causeRight
                ? "Junior detective traces fish deaths to factory waste."
                : "Detective files theory · town still investigating."}
            </div>
          </div>

          {/* 2-col body */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 18, borderTop: "2px solid var(--text)", paddingTop: 18 }}>
            <div>
              <div style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                Case at a glance
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.55, margin: 0, fontWeight: 500, color: "var(--text)", columnFill: "balance" }}>
                MAPLE CREEK — After a thorough investigation
                of two adjacent ponds, junior detective <b>YOU</b>
                identified <b>industrial pollution</b> from the
                neighbouring factory as the likely cause of
                Pond A's fish die-off. The evidence chain
                tracks <i>factory drainage → contamination →
                low oxygen → fish death</i>. The Mayor&#39;s office
                has been notified.
              </p>
              <div style={{ marginTop: 14, padding: 12, border: "2px dashed var(--line)", fontFamily: "Caveat", fontSize: 19, fontWeight: 700, lineHeight: 1.3, color: "var(--text)" }}>
                "I checked the temperature, the smell, the colour —
                then I tested everything in the lab. Pond B was the
                control. Science works."
                <div style={{ fontSize: 13, fontWeight: 800, marginTop: 6, fontFamily: "Nunito", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  — Junior Detective, age 12
                </div>
              </div>
            </div>

            <div>
              {/* polaroid */}
              <div style={{
                background: "var(--bg-paper)",
                border: "1px solid var(--line)",
                padding: 10,
                paddingBottom: 36,
                transform: "rotate(2deg)",
                boxShadow: "var(--shadow-pop)",
                position: "relative",
                width: "fit-content",
                margin: "0 auto 16px",
              }}>
                <div style={{
                  width: 220, height: 160,
                  background: "linear-gradient(180deg, #fcd6a3 0%, #f4a261 60%, #7c5a30 100%)",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", left: "50%", bottom: -10, transform: "translateX(-50%) scale(1.2)" }}>
                    <Pond sick size={200} />
                  </div>
                </div>
                <div style={{ fontFamily: "Caveat", fontSize: 16, textAlign: "center", marginTop: 4 }}>
                  Pond A — the scene of the crime
                </div>
              </div>

              <div style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                By the numbers
              </div>
              <ul style={{ paddingLeft: 18, margin: "8px 0 0", fontSize: 13, lineHeight: 1.7 }}>
                <li><b>{observations.length}</b> observations gathered</li>
                <li><b>{experiments.length}</b> lab tests run</li>
                <li><b>{evidenceLinks.length}</b> story panels reconstructed</li>
                <li><b>+{xpAward}</b> XP earned this case</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        <div className="card" style={{ padding: 22 }}>
          <h3 className="title-lg">Your investigation rating</h3>
          <p className="text-soft" style={{ fontSize: 13, fontWeight: 600, margin: "6px 0 16px" }}>How you scored against detective standards.</p>
          <div className="col gap-3">
            <StarRow label="Accuracy"            icon="target"    stars={v.stars.accuracy}    sub="Picked the right cause." />
            <StarRow label="Evidence Use"        icon="clipboard" stars={v.stars.evidence}    sub="Selected supporting evidence well." />
            <StarRow label="Scientific Thinking" icon="lightbulb" stars={v.stars.thinking}    sub="Reasoning quality in your write-up." />
          </div>
        </div>

        {/* badge */}
        <div className="card bounce-in" style={{
          padding: 22,
          textAlign: "center",
          background: "linear-gradient(135deg, var(--orange-50) 0%, var(--yellow-100) 100%)",
          borderColor: "var(--orange-300)",
        }}>
          <div className="uppercase-eyebrow" style={{ color: "var(--orange-700)" }}>Unlocked</div>
          <h3 className="title-lg" style={{ marginTop: 4 }}>Scientific Method Badge</h3>
          <div style={{ position: "relative", marginTop: 20, marginBottom: 12, display: "inline-block" }}>
            <ScientificMethodBadge />
          </div>
          <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 14, color: "var(--text)" }}>
            +{xpAward} XP · Level 4 → Level 5
          </div>
        </div>
      </div>

      {/* Next case */}
      <div className="card" style={{ padding: 20, display: "flex", gap: 20, alignItems: "center", background: "var(--ink-900)", color: "#fdf6e3", borderColor: "var(--ink-700)" }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: "var(--teal-600)",
          display: "grid", placeItems: "center",
          flexShrink: 0,
        }}>
          <Lucide name="leaf" size={28} color="white" />
        </div>
        <div className="grow">
          <div className="uppercase-eyebrow" style={{ color: "var(--yellow-300)" }}>Up next · Episode 2</div>
          <h3 className="title-lg" style={{ color: "white", marginTop: 4 }}>The Wilting Plant Lab</h3>
          <p className="text-soft" style={{ margin: "4px 0 0", color: "#d8c9a8", fontSize: 14 }}>
            The school greenhouse is in trouble. Same scientific method · new variables.
          </p>
        </div>
        <button className="btn lg teal" onClick={restart}>
          <Lucide name="play" size={18} />
          Continue
        </button>
      </div>
    </div>
  );
}

function StarRow({ label, icon, stars, sub }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "40px 1fr auto", gap: 12, alignItems: "center" }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--bg)", display: "grid", placeItems: "center", color: "var(--primary)" }}>
        <Lucide name={icon} size={18} />
      </div>
      <div>
        <div style={{ fontFamily: "Nunito", fontWeight: 900 }}>{label}</div>
        <div className="text-soft" style={{ fontSize: 12 }}>{sub}</div>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[1, 2, 3].map(n => (
          <span key={n} style={{
            width: 28, height: 28, borderRadius: 8,
            background: n <= stars ? "var(--yellow-400)" : "var(--bg)",
            display: "grid", placeItems: "center",
            color: n <= stars ? "#1c1410" : "var(--muted)",
            boxShadow: n <= stars ? "0 2px 0 var(--yellow-600)" : "none",
          }}>
            <Lucide name="star" size={14} color={n <= stars ? "#1c1410" : "currentColor"} />
          </span>
        ))}
      </div>
    </div>
  );
}

function ScientificMethodBadge() {
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" style={{ filter: "drop-shadow(0 8px 24px rgba(249,115,22,0.4))" }}>
      <defs>
        <linearGradient id="badgeg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      {/* ribbon */}
      <path d="M50 130 L40 158 L62 148 L78 158 L86 130 Z" fill="#dc2626" />
      <path d="M110 130 L120 158 L98 148 L82 158 L74 130 Z" fill="#b91c1c" />
      {/* outer ring */}
      <circle cx="80" cy="78" r="62" fill="url(#badgeg)" stroke="#1c1410" strokeWidth="3" />
      {/* gear teeth */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const x = 80 + Math.cos(a) * 62;
        const y = 78 + Math.sin(a) * 62;
        return <circle key={i} cx={x} cy={y} r="7" fill="#facc15" stroke="#1c1410" strokeWidth="2" />;
      })}
      {/* inner */}
      <circle cx="80" cy="78" r="44" fill="#fdf6e3" stroke="#1c1410" strokeWidth="2" />
      {/* flask icon center */}
      <g transform="translate(80 78)">
        <path d="M-12 -16 L-12 -10 L-20 14 Q-22 22 -12 22 L12 22 Q22 22 20 14 L12 -10 L12 -16 Z" fill="#14b8a6" stroke="#1c1410" strokeWidth="2.5" />
        <path d="M-12 -16 L12 -16" stroke="#1c1410" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M-15 4 L15 4" stroke="#1c1410" strokeWidth="1.5" />
        <circle cx="-4" cy="10" r="2.5" fill="#fdf6e3" opacity="0.8" />
        <circle cx="6" cy="14" r="2" fill="#fdf6e3" opacity="0.8" />
      </g>
      {/* banner text */}
      <path d="M30 100 L130 100 L120 116 L40 116 Z" fill="#1c1410" />
      <text x="80" y="112" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="11" fill="#fde047" letterSpacing="2">DETECTIVE</text>
    </svg>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 40 });
  const colors = ["#f97316", "#14b8a6", "#facc15", "#dc2626", "#a855f7"];
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 1 }}>
      {pieces.map((_, i) => {
        const left = (i * 53) % 100;
        const delay = (i * 0.13) % 3;
        const color = colors[i % colors.length];
        const rot = (i * 47) % 360;
        return (
          <span key={i} style={{
            position: "absolute",
            left: `${left}%`,
            top: -20,
            width: 10, height: 14,
            background: color,
            transform: `rotate(${rot}deg)`,
            animation: `confetti-fall 4s linear infinite`,
            animationDelay: `${delay}s`,
            opacity: 0.85,
          }} />
        );
      })}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export { EvidenceScreen, ConclusionScreen, VictoryScreen };
