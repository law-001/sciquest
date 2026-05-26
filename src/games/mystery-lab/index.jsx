/* ============================================================
   Mystery Lab — Episode 1: The Dying Pond Mystery
   GameComponent entry. Pure-React (no Phaser).
   ============================================================ */
import { useCallback, useEffect, useMemo, useState } from "react";
import "./styles.css";
import { HUD, Lucide } from "./shared.jsx";
import { useTheme } from "../../context/ThemeContext";
import { IntroScreen, OpeningScreen, MapScreen } from "./screens-a.jsx";
import { ObservationScreen, QuestionScreen, NotebookScreen } from "./screens-b.jsx";
import { LabScreen } from "./screens-c.jsx";
import { EvidenceScreen, ConclusionScreen, VictoryScreen } from "./screens-d.jsx";

export default function MysteryLab({
  user: _user,
  profile: _profile,
  onExit,
  onProgressUpdate,
  initialChallengeId: _initialChallengeId,
  reducedMotion: _reducedMotion,
  deviceTier: _deviceTier,
}) {
  const [screen, setScreen] = useState("opening");
  const [observations, setObservations] = useState([]);
  const [pond, setPond] = useState("A");
  const [question, setQuestion] = useState(null);
  const [hypotheses, setHypotheses] = useState([]);
  const [experiments, setExperiments] = useState([]);
  const [energy, setEnergy] = useState(5);
  const [evidenceLinks, setEvidenceLinks] = useState([]);
  const [cause, setCause] = useState(null);
  const [supports, setSupports] = useState([]);
  const [written, setWritten] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [victory, setVictory] = useState(null);

  const { isDark, toggle: toggleTheme } = useTheme();

  const [isPortrait, setIsPortrait] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768 && window.innerHeight > window.innerWidth;
  });

  useEffect(() => {
    const check = () => {
      setIsPortrait(window.innerWidth < 768 && window.innerHeight > window.innerWidth);
    };
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const visited = useMemo(() => {
    const seen = new Set();
    observations.forEach(o => seen.add(o.pond === "A" ? "pondA" : "pondB"));
    if (experiments.length > 0) seen.add("lab");
    if (evidenceLinks.length > 0) seen.add("evidence");
    return [...seen];
  }, [observations, experiments, evidenceLinks]);

  const xpEarned = useMemo(
    () => observations.reduce((s, o) => s + (o.xp || 0), 0) + experiments.length * 6,
    [observations, experiments]
  );

  const progress = useMemo(() => {
    let p = 0;
    if (observations.length > 0) p += 0.15;
    if (observations.length >= 4) p += 0.1;
    if (question === "q1") p += 0.1;
    if (hypotheses.length > 0) p += 0.1;
    if (experiments.length > 0) p += 0.15;
    if (experiments.length >= 3) p += 0.1;
    if (evidenceLinks.length > 0) p += 0.1;
    if (cause) p += 0.1;
    if (written.length > 12) p += 0.1;
    return Math.min(1, p);
  }, [observations, question, hypotheses, experiments, evidenceLinks, cause, written]);

  const addObservation = useCallback((o) => {
    setObservations(prev => prev.find(p => p.id === o.id) ? prev : [...prev, o]);
  }, []);
  const addExperiment = useCallback((e) => {
    setExperiments(prev => prev.find(p => p.id === e.id) ? prev : [...prev, e]);
  }, []);

  const restart = useCallback(() => {
    setObservations([]);
    setHypotheses([]);
    setExperiments([]);
    setEnergy(5);
    setEvidenceLinks([]);
    setCause(null);
    setSupports([]);
    setWritten("");
    setConclusion("");
    setVictory(null);
    setQuestion(null);
    setScreen("opening");
  }, []);

  const go = useCallback((id) => {
    setScreen(id);
  }, []);

  // Report progress when player reaches victory
  useEffect(() => {
    if (screen === "victory" && victory && onProgressUpdate) {
      onProgressUpdate({
        gameId: "mystery-lab",
        challengeId: "ep01-dying-pond",
        completed: true,
        xp: xpEarned,
        stars: victory.stars ?? 0,
      });
    }
  }, [screen, victory, xpEarned, onProgressUpdate]);

  return (
    <div
      className="mystery-lab-root"
      data-theme={isDark ? "dark" : "light"}
      data-palette="orange-heavy"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        touchAction: "manipulation",
      }}
    >
      {isPortrait && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 9999,
          background: "#1c1410",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 20, padding: 32, textAlign: "center",
        }}>
          <div className="bounce-in">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="22" y="10" width="36" height="60" rx="7" stroke="#fdf6e3" strokeWidth="2.5" />
              <rect x="28" y="18" width="24" height="38" rx="3" fill="#f97316" opacity="0.2" />
              <circle cx="40" cy="60" r="3" fill="#fdf6e3" />
              <path d="M62 20 Q74 40 62 60" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <polyline points="57 56 62 60 66 55" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontFamily: "Nunito, sans-serif", fontWeight: 900, fontSize: 22, color: "#fdf6e3", margin: 0, letterSpacing: "-0.01em" }}>
              Rotate your device
            </h2>
            <p style={{ color: "#a6896c", fontWeight: 600, fontSize: 15, margin: "10px 0 0", lineHeight: 1.5 }}>
              Mystery Lab plays best in landscape.<br />Turn your phone sideways to continue.
            </p>
          </div>
          {onExit && (
            <button type="button" onClick={onExit} style={{
              marginTop: 8, padding: "10px 24px", borderRadius: 999,
              border: "1.5px solid rgba(253,246,227,0.2)",
              background: "rgba(255,255,255,0.08)", color: "#fdf6e3",
              fontFamily: "Nunito, sans-serif", fontWeight: 800, fontSize: 14,
              cursor: "pointer",
            }}>
              Exit Game
            </button>
          )}
        </div>
      )}
      <div className="app">
        {screen !== "opening" && screen !== "intro" && (
          <HUD
            xp={xpEarned}
            energy={energy}
            energyMax={5}
            progress={progress}
            onJump={go}
            onExit={onExit}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />
        )}

        {screen === "opening" && (
          <div style={{
            position: "absolute", top: 14, right: 16, zIndex: 60,
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 36, height: 36,
                borderRadius: 999,
                border: "1.5px solid rgba(28,20,16,0.15)",
                background: "rgba(255,255,255,0.94)",
                color: "#1c1410",
                boxShadow: "0 6px 18px -8px rgba(28,20,16,0.35)",
                cursor: "pointer",
              }}
            >
              <Lucide name={isDark ? "sun" : "moon"} size={16} />
            </button>
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
                }}
              >
                <Lucide name="x" size={14} />
                Exit
              </button>
            )}
          </div>
        )}

        <main className={`screen${screen === "opening" || screen === "map" || screen === "intro" ? " no-scroll" : ""}`}>
          {screen === "opening"  && <OpeningScreen go={go} />}
          {screen === "intro"    && <IntroScreen go={go} />}
          {screen === "map"      && (
            <MapScreen
              go={go}
              setPond={setPond}
              mapStyle="illustrated"
              visited={visited}
              observations={observations}
              hypotheses={hypotheses}
              experiments={experiments}
              pulse={
                hypotheses.length > 0 && experiments.length > 0 ? "evidence"
                : hypotheses.length > 0 ? "lab"
                : "pondA"
              }
            />
          )}
          {screen === "observe"  && (
            <ObservationScreen
              go={go}
              pond={pond}
              setPond={setPond}
              observations={observations}
              addObservation={addObservation}
            />
          )}
          {screen === "question" && (
            <QuestionScreen
              go={go}
              observations={observations}
              question={question}
              setQuestion={setQuestion}
              hypotheses={hypotheses}
              setHypotheses={setHypotheses}
            />
          )}
          {screen === "notebook" && (
            <NotebookScreen
              go={go}
              observations={observations}
              question={question}
              hypotheses={hypotheses}
              experiments={experiments}
              conclusion={conclusion}
            />
          )}
          {screen === "lab"      && (
            <LabScreen
              go={go}
              energy={energy}
              setEnergy={setEnergy}
              experiments={experiments}
              addExperiment={addExperiment}
              hypotheses={hypotheses}
              observations={observations}
            />
          )}
          {screen === "evidence" && (
            <EvidenceScreen
              go={go}
              boardStyle="corkboard"
              evidenceLinks={evidenceLinks}
              setEvidenceLinks={setEvidenceLinks}
              observations={observations}
              experiments={experiments}
            />
          )}
          {screen === "conclude" && (
            <ConclusionScreen
              go={go}
              cause={cause}
              setCause={setCause}
              supports={supports}
              setSupports={setSupports}
              written={written}
              setWritten={setWritten}
              setConclusion={setConclusion}
              setVictory={setVictory}
            />
          )}
          {screen === "victory"  && (
            <VictoryScreen
              go={go}
              victory={victory}
              observations={observations}
              experiments={experiments}
              evidenceLinks={evidenceLinks}
              restart={restart}
            />
          )}
        </main>
      </div>
    </div>
  );
}
