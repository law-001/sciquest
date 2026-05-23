/* ============================================================
   Mystery Lab — Screens part 1
   1. Opening Story
   2. Investigation Map
   ============================================================ */
import React from "react";
import { DetectiveHoot, Lucide, NotebookBadge, CrimeTape } from "./shared.jsx";
import {
  Pond, Tree, Factory, LabTent, Rock, Bush, GrassPatch, Signpost, Cloud,
  BackdropLayer, Butterfly, Dragonfly, Flower, DeadShrub, Cattail, MudPatch, Footprints,
  BulletinBoard,
} from "./world.jsx";

/* ===== Screen 1: Opening Story ===== */
function OpeningScreen({ go }) {
  return (
    <div data-screen-label="01 Opening" style={{ position: "relative" }}>
      {/* hero scene */}
      <div className="card" style={{
        position: "relative",
        padding: 0,
        overflow: "hidden",
        borderRadius: 28,
        marginTop: 12
      }}>
        {/* sky gradient */}
        <div style={{
          position: "relative",
          minHeight: 540,
          background: "linear-gradient(180deg, #fef3c7 0%, #fed7aa 40%, #fcd34d 70%, #84cc16 100%)",
          padding: "40px 56px",
          overflow: "hidden"
        }}>
          {/* sun */}
          <div style={{
            position: "absolute", top: 36, right: 60,
            width: 90, height: 90, borderRadius: 999,
            background: "radial-gradient(circle, #fef9c3, #facc15)",
            boxShadow: "0 0 60px 20px rgba(250,204,21,0.4)"
          }} />
          {/* clouds */}
          <Cloud style={{ top: 60, left: 40 }} />
          <Cloud style={{ top: 100, left: 280, transform: "scale(0.8)" }} />

          {/* crime tape */}
          <CrimeTape angle={-3} top={150} text="CASE #001 · POND CONTAMINATION · " />

          <div style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: 40,
            alignItems: "center",
            minHeight: 460,
            position: "relative",
            zIndex: 2
          }}>
            <div>
              <div className="tag" style={{ background: "#1c1410", color: "#fde047" }}>
                <Lucide name="sparkles" size={12} />
                Episode 01 · Grade 7 Science
              </div>
              <h1 className="title-xxl" style={{
                marginTop: 18,
                color: "rgb(28, 20, 16)",
                position: "relative",
                zIndex: 3,
                textShadow: [
                  "4px 0 0 #fffaee", "-4px 0 0 #fffaee",
                  "0 4px 0 #fffaee", "0 -4px 0 #fffaee",
                  "3px 3px 0 #fffaee", "-3px 3px 0 #fffaee",
                  "3px -3px 0 #fffaee", "-3px -3px 0 #fffaee",
                  "0 10px 24px rgba(28,20,16,0.18)"
                ].join(",")
              }}>
                The Dying<br />
                Pond Mystery
              </h1>
              <p style={{ fontSize: 18, color: "#3d2e22", maxWidth: 480, marginTop: 14, lineHeight: 1.5, fontWeight: 500 }}>
                Something's wrong at Maple Creek. The fish in <b>Pond A</b> are dying.
                The fish in <b>Pond B</b>, just 200 metres away, are fine.
                The Mayor needs a junior science detective. You in?
              </p>
              <div className="row gap-3" style={{ marginTop: 28, alignItems: "center" }}>
                <button className="btn lg" onClick={() => go("map")}>
                  <Lucide name="search" size={20} />
                  Start Investigation
                </button>
                <button className="btn ghost" onClick={() => go("notebook")}>
                  <Lucide name="book" size={16} />
                  Case briefing
                </button>
              </div>
              <div className="row gap-3" style={{ marginTop: 24, flexWrap: "wrap" }}>
                <MissionPill icon="search" text="Observe" />
                <MissionPill icon="lightbulb" text="Hypothesise" />
                <MissionPill icon="flask" text="Test" />
                <MissionPill icon="clipboard" text="Conclude" />
              </div>
            </div>

            {/* right: scene illustration */}
            <div style={{ position: "relative", height: 460 }}>
              {/* mentor mascot */}
              <div className="float" style={{ position: "absolute", top: 20, right: 40, zIndex: 4 }}>
                <DetectiveHoot size={130} speechSide="left" speech="Welcome, detective! Bring your magnifying glass — and your curiosity." />
              </div>
              {/* ponds composition */}
              <div style={{ position: "absolute", bottom: -10, left: -30, transform: "rotate(-4deg)" }}>
                <Pond sick label="A" dead={4} />
              </div>
              <div style={{ position: "absolute", bottom: 80, right: -40, transform: "scale(0.7) rotate(6deg)" }}>
                <Pond label="B" />
              </div>
              {/* factory in distance */}
              <div style={{ position: "absolute", top: 100, left: -10, transform: "scale(0.55)" }}>
                <Factory />
              </div>
              {/* tree */}
              <div style={{ position: "absolute", bottom: 30, right: 130 }}>
                <Tree size={50} variant={1} />
              </div>
            </div>
          </div>

          {/* paper torn bottom */}
          <svg style={{ position: "absolute", left: 0, right: 0, bottom: -1, width: "100%" }} viewBox="0 0 1200 32" preserveAspectRatio="none">
            <path d="M0 32 L0 14 Q60 4 120 14 T240 14 T360 14 T480 14 T600 14 T720 14 T840 14 T960 14 T1080 14 T1200 14 L1200 32 Z" fill="var(--bg-elev)" />
          </svg>
        </div>

        {/* case file footer */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 18,
          padding: "30px 56px 40px",
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
function MapScreen({ go, mapStyle = "illustrated", visited, observations, pulse }) {
  const stylePreset = {
    illustrated: { bg: "linear-gradient(180deg, #fef9c3 0%, #fbeaa3 50%, #d9f99d 100%)", paper: false, iso: false },
    paper: { bg: "#f8efd1", paper: true, iso: false },
    isometric: { bg: "linear-gradient(180deg, #ecfeff 0%, #a7f3d0 100%)", paper: false, iso: true }
  }[mapStyle];

  const locs = [
  { id: "pondB",    label: "Pond B",         x: 22, y: 38, icon: "droplet",   hot: false, desc: "Healthy control" },
  { id: "factory",  label: "Maple Factory",  x: 80, y: 32, icon: "factory",   hot: false, desc: "Out of bounds for now" },
  { id: "evidence", label: "Evidence Board", x: 22, y: 64, icon: "clipboard", hot: false, desc: "Mission HQ" },
  { id: "lab",      label: "Lab Tent",       x: 50, y: 54, icon: "flask",     hot: false, desc: "Run scientific tests" },
  { id: "pondA",    label: "Pond A",         x: 78, y: 78, icon: "droplet",   hot: true,  desc: "Sick pond — 5 clues" }];


  return (
    <div data-screen-label="02 Map" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
      <div className="card" style={{
        padding: 0,
        overflow: "hidden",
        borderRadius: 24,
        position: "relative",
        minHeight: 600,
        background: stylePreset.bg
      }}>
        {stylePreset.paper &&
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(91,69,48,0.18) 1px, transparent 1.5px)", backgroundSize: "16px 16px", opacity: 0.6, pointerEvents: "none" }} />
        }
        {/* Map content */}
        <div style={{ position: "absolute", inset: 0 }}>
          {/* Parallax backdrop layers — only in illustrated mode */}
          {!stylePreset.paper && !stylePreset.iso && BackdropLayer && <BackdropLayer />}

          {/* River — handled inside BackdropLayer for non-paper styles. Paper/iso get a flat river. */}
          {(stylePreset.paper || stylePreset.iso) && (
            <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
              <path d="M -30 240 Q 80 270 170 280 Q 260 290 280 360 Q 280 460 210 520 Q 140 560 -20 580"
                    stroke={stylePreset.paper ? "#92c5fc" : "#5eead4"} strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.85" />
              <path d="M -30 240 Q 80 270 170 280 Q 260 290 280 360 Q 280 460 210 520 Q 140 560 -20 580"
                    stroke={stylePreset.paper ? "#bfdbfe" : "#99f6e4"} strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.9" />
            </svg>
          )}

          {/* ===== HEALTHY MEADOW ZONE — surrounds Pond B (mid-left) ===== */}
          {/* Trees rooted in grass — y coords keep them on ground */}
          <div style={{ position: "absolute", top: 270, left: 36 }}><Tree size={48} variant={1} /></div>
          <div style={{ position: "absolute", top: 300, left: 110 }}><Tree size={38} variant={0} /></div>
          <div style={{ position: "absolute", top: 320, left: 270 }}><Tree size={42} variant={2} /></div>
          <div style={{ position: "absolute", top: 350, left: 60 }}><Tree size={36} variant={0} /></div>
          {Bush && <Bush x={140} y={310} size={36} variant={0} />}
          {Bush && <Bush x={280} y={320} size={32} variant={1} />}
          {GrassPatch && <GrassPatch x={90}  y={350} size={28} />}
          {GrassPatch && <GrassPatch x={200} y={335} size={26} />}
          {Flower && <Flower x={120} y={290} size={14} color="#f472b6" />}
          {Flower && <Flower x={230} y={310} size={14} color="#a855f7" />}
          {Flower && <Flower x={260} y={340} size={13} color="#fbbf24" />}
          {Flower && <Flower x={70}  y={310} size={14} color="#f97316" />}
          {Butterfly && <Butterfly x={180} y={260} size={18} color="#f472b6" />}
          {Butterfly && <Butterfly x={250} y={245} size={16} color="#fb923c" />}
          {Dragonfly && <Dragonfly x={120} y={350} size={22} />}
          {Cattail && <Cattail x={172} y={246} size={18} />}
          {Cattail && <Cattail x={92}  y={278} size={16} />}

          {/* ===== CENTRAL LAB ZONE — neutral grass, connecting hub ===== */}
          <div style={{ position: "absolute", top: 400, left: 360 }}><Tree size={32} variant={1} /></div>
          <div style={{ position: "absolute", top: 430, left: 460 }}><Tree size={28} variant={0} /></div>
          {GrassPatch && <GrassPatch x={340} y={420} size={28} />}
          {GrassPatch && <GrassPatch x={500} y={440} size={26} />}
          {Bush && <Bush x={300} y={440} size={30} variant={0} />}
          {Bush && <Bush x={540} y={420} size={28} variant={1} />}
          <Rock x={336} y={436} size={20} />
          <Rock x={524} y={408} size={18} />
          {/* footprints leading toward lab */}
          {Footprints && <Footprints x={260} y={450} size={50} rot={5} />}
          {Footprints && <Footprints x={500} y={520} size={50} rot={-30} />}

          {/* ===== INDUSTRIAL RIDGE ZONE — sparse, dead/struggling vegetation around factory ===== */}
          {DeadShrub && <DeadShrub x={560} y={310} size={26} />}
          {DeadShrub && <DeadShrub x={500} y={350} size={22} />}
          <Rock x={540} y={360} size={22} />
          <Rock x={460} y={340} size={18} />
          {/* "no entry" sign on path toward factory */}
          {Signpost && <Signpost x={520} y={276} label="!" />}

          {/* ===== DEAD ZONE — around Pond A (bottom-right), tied to runoff stream ===== */}
          {DeadShrub && <DeadShrub x={460} y={480} size={30} />}
          {DeadShrub && <DeadShrub x={530} y={540} size={26} />}
          {DeadShrub && <DeadShrub x={700} y={550} size={28} />}
          {DeadShrub && <DeadShrub x={580} y={420} size={24} />}
          {MudPatch && <MudPatch x={480} y={540} size={56} />}
          {MudPatch && <MudPatch x={620} y={560} size={68} />}
          {MudPatch && <MudPatch x={700} y={500} size={50} />}
          <Rock x={520} y={510} size={22} />
          <Rock x={690} y={480} size={18} />
          {Cattail && <Cattail x={560} y={470} size={16} />}
          {Cattail && <Cattail x={700} y={520} size={14} />}

          {/* Compass */}
          <div style={{
            position: "absolute", top: 18, right: 18,
            width: 64, height: 64,
            borderRadius: 999,
            background: "rgba(255,255,255,0.92)",
            border: "2px solid #1c1410",
            display: "grid", placeItems: "center",
            fontFamily: "Nunito", fontWeight: 900,
            boxShadow: "var(--shadow-card)",
            zIndex: 5,
          }}>
            <svg width="50" height="50" viewBox="0 0 50 50">
              <text x="25" y="11" textAnchor="middle" fontSize="9" fontWeight="900">N</text>
              <text x="25" y="46" textAnchor="middle" fontSize="9" fontWeight="900">S</text>
              <text x="6" y="28" textAnchor="middle" fontSize="9" fontWeight="900">W</text>
              <text x="44" y="28" textAnchor="middle" fontSize="9" fontWeight="900">E</text>
              <path d="M25 14 L29 28 L25 24 L21 28 Z" fill="#dc2626" />
              <path d="M25 36 L21 24 L25 28 L29 24 Z" fill="#1c1410" />
            </svg>
          </div>
        </div>

        {/* Location pins */}
        {locs.map((l) =>
        <button
          key={l.id}
          onClick={() => l.id === "pondA" || l.id === "pondB" ? go("observe") : l.id === "lab" ? go("lab") : l.id === "evidence" ? go("evidence") : null}
          disabled={l.id === "factory"}
          style={{
            position: "absolute",
            left: `${l.x}%`, top: `${l.y}%`,
            transform: "translate(-50%, -50%)",
            background: "transparent",
            border: 0,
            padding: 0,
            cursor: l.id === "factory" ? "not-allowed" : "pointer",
            opacity: l.id === "factory" ? 0.85 : 1
          }}>
          
            <MapPin
            label={l.label}
            icon={l.icon}
            hot={l.hot}
            pulse={pulse === l.id}
            completed={visited && visited.includes(l.id)}
            desc={l.desc}
            locked={l.id === "factory"} />
          
          </button>
        )}

        {/* Big illustration overlays per location — kept in lockstep with pin coords */}
        <div style={{ position: "absolute", left: "22%", top: "38%", transform: "translate(-50%, -55%) scale(0.55)", pointerEvents: "none" }}>
          <Pond size={210} />
        </div>
        <div style={{ position: "absolute", left: "80%", top: "32%", transform: "translate(-50%, -55%) scale(0.55)", pointerEvents: "none" }}>
          <Factory />
        </div>
        <div style={{ position: "absolute", left: "50%", top: "54%", transform: "translate(-50%, -55%) scale(0.6)", pointerEvents: "none" }}>
          <LabTent />
        </div>
        <div style={{ position: "absolute", left: "22%", top: "64%", transform: "translate(-50%, -55%) scale(0.7)", pointerEvents: "none" }}>
          {BulletinBoard && <BulletinBoard size={180} />}
        </div>
        <div style={{ position: "absolute", left: "78%", top: "78%", transform: "translate(-50%, -50%) scale(0.55)", pointerEvents: "none" }}>
          <Pond sick size={210} dead={4} />
        </div>
      </div>

      {/* Objectives panel */}
      <div className="col gap-4">
        <div className="card" style={{ padding: 18 }}>
          <div className="row between" style={{ alignItems: "center" }}>
            <h3 className="title-lg">Current Mission</h3>
            <span className="chip orange">Phase 1</span>
          </div>
          <div className="divider-dot" />
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
            <Objective done={visited.includes("pondA")} text="Investigate Pond A" />
            <Objective done={visited.includes("pondB")} text="Compare with Pond B" />
            <Objective done={false} text="Form 1–2 hypotheses" />
            <Objective done={false} text="Run experiments in the lab" />
            <Objective done={false} text="Connect evidence + submit report" />
          </ul>
        </div>

        <div className="card" style={{ padding: 18, background: "var(--orange-50)", borderColor: "var(--orange-200)" }}>
          <div className="row gap-3" style={{ alignItems: "flex-start" }}>
            <DetectiveHoot size={64} />
            <div>
              <div className="uppercase-eyebrow" style={{ color: "var(--orange-700)" }}>Mentor tip</div>
              <p style={{ margin: "4px 0 0", fontWeight: 600, fontSize: 14, lineHeight: 1.45 }}>
                Start with <b>Pond A</b> — observe what's different. Don't ignore Pond B; healthy controls give you the comparison.
              </p>
            </div>
          </div>
        </div>

        <NotebookBadge count={observations.length} onClick={() => go("notebook")} />
      </div>
    </div>);

}

function MapPin({ label, icon, hot, pulse, completed, desc, locked }) {
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
        margin: "0 auto"
      }}>
        {locked ? <Lucide name="x" size={22} /> : completed ? <Lucide name="check" size={24} /> : <Lucide name={icon} size={24} />}
      </div>
      <div style={{
        position: "absolute", top: 64, left: "50%", transform: "translateX(-50%)",
        background: "linear-gradient(180deg, #f5e1b8, #d4ad6b)",
        color: "#3d2e22",
        padding: "5px 12px 7px",
        borderRadius: 4,
        border: "2px solid #5b3a1f",
        borderTop: "2px solid #7a5230",
        whiteSpace: "nowrap",
        fontWeight: 900,
        fontSize: 12,
        fontFamily: "Nunito",
        boxShadow: "0 4px 0 rgba(91,58,31,0.6), 0 8px 18px -4px rgba(0,0,0,0.4)",
        textShadow: "0 1px 0 rgba(255,255,255,0.4)",
      }}>
        {/* nail heads */}
        <span style={{ position: "absolute", left: 4, top: 3, width: 4, height: 4, borderRadius: 999, background: "#5b3a1f", boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.3)" }} />
        <span style={{ position: "absolute", right: 4, top: 3, width: 4, height: 4, borderRadius: 999, background: "#5b3a1f", boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.3)" }} />
        {label}
        <div style={{ fontSize: 9, fontWeight: 700, color: "#7a5230", letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 1 }}>{desc}</div>
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

export { OpeningScreen, MapScreen };