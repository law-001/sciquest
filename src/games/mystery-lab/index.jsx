/* ============================================================
   Mystery Lab — Episode 1: The Dying Pond Mystery
   GameComponent entry. Pure-React (no Phaser).
   ============================================================ */
import { useCallback, useEffect, useMemo, useState } from "react";
import "./styles.css";
import { HUD, Lucide } from "./shared.jsx";
import { OpeningScreen, MapScreen } from "./screens-a.jsx";
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
      data-theme="light"
      data-palette="orange-heavy"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        touchAction: "manipulation",
      }}
    >
      <div className="app">
        {screen !== "opening" && (
          <HUD
            xp={xpEarned}
            energy={energy}
            energyMax={5}
            progress={progress}
            onJump={go}
            onExit={onExit}
          />
        )}

        {screen === "opening" && onExit && (
          <button
            type="button"
            onClick={onExit}
            aria-label="Exit Mystery Lab"
            style={{
              position: "absolute",
              top: 14,
              right: 16,
              zIndex: 60,
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

        <main className={`screen${screen === "opening" || screen === "map" ? " no-scroll" : ""}`}>
          {screen === "opening"  && <OpeningScreen go={go} />}
          {screen === "map"      && (
            <MapScreen
              go={go}
              mapStyle="illustrated"
              visited={visited}
              observations={observations}
              pulse="pondA"
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
            />
          )}
          {screen === "evidence" && (
            <EvidenceScreen
              go={go}
              boardStyle="corkboard"
              evidenceLinks={evidenceLinks}
              setEvidenceLinks={setEvidenceLinks}
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
