/* ============================================================
   Mystery Lab — Screens part 1
   1. Opening Story
   2. Investigation Map
   ============================================================ */
import React from "react";
import { DetectiveHoot, Lucide, NotebookBadge, CrimeTape } from "./shared.jsx";
import {
  Pond, Tree, DeadTree, Factory, LabTent, Rock, Bush, GrassPatch, Signpost, Cloud,
  BackdropLayer, Butterfly, Dragonfly, Flower, DeadFlower, DeadShrub, Cattail, MudPatch, Footprints,
  BulletinBoard, Bird, AnimatedCloud,
} from "./world.jsx";

/* ===== Screen 1: Opening Story ===== */
function OpeningScreen({ go }) {
  return (
    <div data-screen-label="01 Opening" style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* hero scene */}
      <div className="card" style={{
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
        <div style={{
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

          <div style={{
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
              <p style={{ fontSize: 15, color: "#3d2e22", maxWidth: 460, marginTop: 10, lineHeight: 1.45, fontWeight: 500 }}>
                Something's wrong at Maple Creek. The fish in <b>Pond A</b> are dying.
                The fish in <b>Pond B</b>, just 200 metres away, are fine.
                The Mayor needs a junior science detective. You in?
              </p>
              <div className="row gap-3" style={{ marginTop: 18, alignItems: "center" }}>
                <button className="btn lg" onClick={() => go("map")}>
                  <Lucide name="search" size={18} />
                  Start Investigation
                </button>
                <button className="btn ghost" onClick={() => go("notebook")}>
                  <Lucide name="book" size={14} />
                  Case briefing
                </button>
              </div>
              <div className="row gap-2" style={{ marginTop: 16, flexWrap: "wrap" }}>
                <MissionPill icon="search" text="Observe" />
                <MissionPill icon="lightbulb" text="Hypothesise" />
                <MissionPill icon="flask" text="Test" />
                <MissionPill icon="clipboard" text="Conclude" />
              </div>
            </div>

            {/* right: scene illustration */}
            <div style={{ position: "relative", height: "100%", minHeight: 280 }}>
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
        <div style={{
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
function MapScreen({ go, setPond, mapStyle = "illustrated", visited, observations, hypotheses = [], experiments = [], pulse }) {
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
    <div data-screen-label="02 Map" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, alignItems: "stretch", height: "100%", minHeight: 0 }}>
      <div className="card" style={{
        padding: 0,
        overflow: "hidden",
        borderRadius: 20,
        position: "relative",
        height: "100%",
        minHeight: 0,
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

          {/* ===== SKY — animated birds + clouds ===== */}
          <AnimatedCloud x={-200} y={30} scale={1}    duration={26} delay={-8}  />
          <AnimatedCloud x={-200} y={52} scale={0.7}  duration={34} delay={-22} />
          <AnimatedCloud x={-200} y={38} scale={0.55} duration={20} delay={-5}  />
          <Bird x={-100} y={42} size={18} duration={10} delay={-2}  />
          <Bird x={-100} y={58} size={14} duration={14} delay={-7}  />
          <Bird x={-100} y={48} size={16} duration={12} delay={-5}  />
          <Bird x={-100} y={74} size={20} duration={18} delay={-12} />

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
          onClick={() => { if (l.id === "pondA") { setPond("A"); go("observe"); } else if (l.id === "pondB") { setPond("B"); go("observe"); } else if (l.id === "lab") { go("lab"); } else if (l.id === "evidence") { go("evidence"); } }}
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
            locked={l.id === "factory"} />
          
          </button>
        )}

        {/* Illustration overlays — positions match pin coords in locs[] */}
        {/* Pond B — left side, mid-height */}
        <div style={{ position: "absolute", left: "10%", top: "45%", transform: "translate(-50%, -55%) scale(0.55)", pointerEvents: "none" }}>
          <Pond size={210} />
        </div>
        {/* Maple Factory — upper-right, industrial ridge */}
        <div style={{ position: "absolute", left: "80%", top: "22%", transform: "translate(-50%, -55%) scale(0.55)", pointerEvents: "none" }}>
          <Factory />
        </div>
        {/* Lab Tent — center, transition zone */}
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -55%) scale(0.6)", pointerEvents: "none" }}>
          <LabTent />
        </div>
        {/* Evidence Board — lower center */}
        <div style={{ position: "absolute", left: "36%", top: "77%", transform: "translate(-50%, -55%) scale(0.7)", pointerEvents: "none" }}>
          {BulletinBoard && <BulletinBoard size={180} />}
        </div>
        {/* Pond A — lower-right, downstream from factory drain */}
        <div style={{ position: "absolute", left: "76%", top: "72%", transform: "translate(-50%, -50%) scale(0.55)", pointerEvents: "none" }}>
          <Pond sick size={210} dead={4} />
        </div>
      </div>

      {/* Objectives panel */}
      <div className="col gap-3" style={{ minHeight: 0, overflow: "hidden" }}>
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
        margin: "0 auto",
        opacity: 0
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