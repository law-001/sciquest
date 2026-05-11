import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowRight,
  Trophy,
  Zap,
  CheckCircle2,
  XCircle,
  Atom,
  Dna,
  Globe2,
  Flame,
  Crown,
  Shield,
  BookOpen,
  RotateCcw,
  ChevronDown,
  Target,
  Star,
} from "lucide-react";
import Button from "../components/Button";
import { useTheme } from "../context/ThemeContext";
import mclassroom from "../assets/modernclassroom.jpg";
import labBg from "../assets/classroom.webp";

/* ─── Hero scene colour tokens ─────────────────────────────── */
const SCENE_CFG = {
  earth: {
    light: {
      top: "#fff4e8",
      bot: "#ffe7d3",
      c: ["#ffe2cc", "#fbb98a", "#fb923c", "#ef6f3a", "#d94f2a"],
    },
    dark: {
      top: "#0d1830",
      bot: "#142142",
      c: ["#2b5fbe", "#2a78d6", "#4a98e8", "#79b6f0", "#a8d2f7"],
    },
  },
  biology: {
    light: {
      top: "#e8f7e6",
      bot: "#cdebc7",
      c: ["#cce8b7", "#94c97a", "#5fa752", "#3a7c3a", "#1e5631"],
    },
    dark: {
      top: "#0b1a14",
      bot: "#0f2620",
      c: ["#1a3a2a", "#22513a", "#306d4d", "#4a8e6a", "#7ab98e"],
    },
  },
  physics: {
    light: {
      top: "#f2eefb",
      bot: "#e3dbf6",
      rings: ["#b39ddb", "#7e57c2", "#512da8"],
    },
    dark: {
      top: "#0a0822",
      bot: "#120b35",
      rings: ["#2f2266", "#3f2d85", "#5b41b4"],
    },
  },
};

const EARTH_PATHS = [
  "M0,180 C80,110 180,230 260,170 C360,100 440,240 540,180 C660,110 740,240 860,180 C980,130 1080,230 1180,170 C1280,110 1380,220 1440,180 L1440,600 L0,600 Z",
  "M0,280 C100,200 200,310 320,250 C460,190 540,310 660,260 C800,210 900,320 1040,270 C1180,230 1280,310 1440,260 L1440,600 L0,600 Z",
  "M0,370 C140,300 240,390 380,340 C520,280 620,390 760,340 C900,300 1020,395 1180,345 C1320,310 1400,390 1440,360 L1440,600 L0,600 Z",
  "M0,450 C140,400 280,470 440,435 C580,410 720,475 860,440 C1020,410 1180,475 1440,435 L1440,600 L0,600 Z",
  "M0,520 C160,490 320,535 500,515 C660,500 820,540 980,515 C1140,495 1280,535 1440,510 L1440,600 L0,600 Z",
];
const BIO_PATHS = [
  "M0,200 L120,40 L240,180 L380,30 L520,170 L660,20 L820,160 L980,40 L1140,180 L1280,50 L1440,170 L1440,600 L0,600 Z",
  "M0,300 L100,110 L220,280 L340,90 L480,260 L620,70 L760,260 L900,90 L1060,250 L1200,100 L1340,260 L1440,200 L1440,600 L0,600 Z",
  "M0,400 L160,200 L300,380 L460,220 L620,380 L780,210 L940,380 L1100,230 L1280,380 L1440,300 L1440,600 L0,600 Z",
  "M0,480 L40,450 L70,475 L100,440 L130,475 L170,445 L210,478 L260,448 L310,476 L360,442 L420,478 L470,448 L530,478 L590,446 L650,478 L710,446 L770,478 L830,446 L890,478 L950,442 L1010,478 L1070,446 L1130,478 L1190,448 L1260,478 L1330,446 L1400,478 L1440,460 L1440,600 L0,600 Z",
  "M0,540 C200,510 360,550 540,535 C720,520 880,555 1060,535 C1240,520 1360,545 1440,530 L1440,600 L0,600 Z",
];
const LAYER_HEIGHTS_EARTH = ["82%", "68%", "52%", "34%", "20%"];
const LAYER_HEIGHTS_BIO = ["92%", "78%", "60%", "32%", "20%"];

const HERO_ORB_CFG = [
  {
    scene: "biology",
    label: "Biology",
    sub: "Cells · Plants · People",
    IconComp: Dna,
    lightColor: "#2f7a3a",
    darkColor: "#9bd9a4",
    lightActiveBg: "linear-gradient(160deg,#e8f7e6,#cdebc7)",
    darkActiveBg: "linear-gradient(160deg,#1e3a2a,#0f2620)",
    borderColor: "#5fa752",
    shadow: "rgba(47,122,58,0.45)",
  },
  {
    scene: "earth",
    label: "Earth Science",
    sub: "Weather · Rocks · Sky",
    IconComp: Globe2,
    lightColor: "#ea580c",
    darkColor: "#fdba74",
    lightActiveBg: "linear-gradient(160deg,#fff4e8,#ffe7d3)",
    darkActiveBg: "linear-gradient(160deg,#1c2a3e,#142142)",
    borderColor: "#f97316",
    shadow: "rgba(234,88,12,0.35)",
  },
  {
    scene: "physics",
    label: "Physics",
    sub: "Forces · Energy · Motion",
    IconComp: Atom,
    lightColor: "#5b3fbf",
    darkColor: "#c4b5fd",
    lightActiveBg: "linear-gradient(160deg,#f2eefb,#e3dbf6)",
    darkActiveBg: "linear-gradient(160deg,#1a1340,#120b35)",
    borderColor: "#7c3aed",
    shadow: "rgba(124,58,237,0.35)",
  },
];

const PHYS_ATOMS = [
  {
    style: {
      width: "62vmin",
      height: "62vmin",
      bottom: "-10vmin",
      right: "-12vmin",
    },
    electrons: [
      { anim: "sq-ao1 7s linear infinite" },
      { anim: "sq-ao2 9s linear infinite" },
      { anim: "sq-ao3 11s linear infinite" },
    ],
  },
  {
    style: {
      width: "30vmin",
      height: "30vmin",
      bottom: "6vmin",
      left: "-4vmin",
      opacity: 0.85,
    },
    electrons: [
      { anim: "sq-bo1 5s linear infinite" },
      { anim: "sq-bo2 7s linear infinite" },
    ],
  },
  {
    style: {
      width: "36vmin",
      height: "36vmin",
      top: "-8vmin",
      right: "6vmin",
      opacity: 0.75,
    },
    electrons: [
      { anim: "sq-co1 8s linear infinite" },
      { anim: "sq-co2 6s linear infinite" },
    ],
  },
  {
    style: {
      width: "22vmin",
      height: "22vmin",
      top: "-2vmin",
      left: "8vmin",
      opacity: 0.8,
    },
    electrons: [
      { anim: "sq-do1 5.5s linear infinite" },
      { anim: "sq-do2 8s linear infinite" },
    ],
  },
];

/* ─────────────────────────────────────────────────────────── */
/*  Subject themes                                              */
/* ─────────────────────────────────────────────────────────── */
const SUBJECTS = [
  {
    key: "biology",
    label: "Biology",
    icon: Dna,
    accent: "#22c55e",
    accentSoft: "rgba(34, 197, 94, 0.18)",
    tagline: "Dive into living systems",
  },
  {
    key: "physics",
    label: "Physics",
    icon: Atom,
    accent: "#38bdf8",
    accentSoft: "rgba(56, 189, 248, 0.20)",
    tagline: "Bend space, time, and motion",
  },
  {
    key: "earth",
    label: "Earth Science",
    icon: Globe2,
    accent: "#f59e0b",
    accentSoft: "rgba(245, 158, 11, 0.20)",
    tagline: "Explore our planet and beyond",
  },
];

const STATS = [
  { target: 200, suffix: "+", label: "Students" },
  { target: 160, suffix: "+", label: "Lessons" },
  { target: 160, suffix: "+", label: "Quizzes" },
  { target: 1.2, suffix: "k", label: "XP Earned", decimals: 1 },
];

const LEADERBOARD = [
  {
    rank: 1,
    name: "Mia Santos",
    xp: 8420,
    subject: "Bio",
    color: "#22c55e",
    isUser: false,
  },
  {
    rank: 2,
    name: "Carlo Reyes",
    xp: 7890,
    subject: "Phys",
    color: "#38bdf8",
    isUser: false,
  },
  {
    rank: 3,
    name: "You",
    xp: 6750,
    subject: "Earth",
    color: "#f97316",
    isUser: true,
  },
  {
    rank: 4,
    name: "Ana Cruz",
    xp: 5340,
    subject: "Bio",
    color: "#22c55e",
    isUser: false,
  },
  {
    rank: 5,
    name: "Luis Torres",
    xp: 4920,
    subject: "Phys",
    color: "#38bdf8",
    isUser: false,
  },
];

const BADGES = [
  {
    Icon: Trophy,
    label: "First Quiz",
    bg: "bg-amber-500/20",
    color: "text-amber-400",
  },
  {
    Icon: Flame,
    label: "7-Day Streak",
    bg: "bg-orange-500/20",
    color: "text-orange-400",
  },
  {
    Icon: Shield,
    label: "Science Nerd",
    bg: "bg-teal-500/20",
    color: "text-teal-400",
  },
  {
    Icon: Zap,
    label: "Speed Learner",
    bg: "bg-yellow-400/20",
    color: "text-yellow-300",
  },
];

/* ─────────────────────────────────────────────────────────── */
/*  Helpers                                                     */
/* ─────────────────────────────────────────────────────────── */
function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function useScrollTrigger(threshold = 0.25) {
  const ref = useRef(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, triggered];
}

/* ─────────────────────────────────────────────────────────── */
/*  TypewriterText                                              */
/* ─────────────────────────────────────────────────────────── */
function TypewriterText({ text, speed = 38, className = "" }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const rm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (rm) {
      setDisplayed(text);
      setDone(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let i = 0;
          const id = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) {
              clearInterval(id);
              setDone(true);
            }
          }, speed);
          obs.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [text, speed]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      <span
        className={`inline-block w-0.5 bg-current ml-0.5 align-middle transition-opacity duration-300 ${done ? "opacity-0" : "opacity-100 animate-pulse"}`}
        style={{ height: "0.85em" }}
      />
    </span>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  ParticleField                                               */
/* ─────────────────────────────────────────────────────────── */
function ParticleField({ accentColor, active }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const rafRef = useRef(null);
  const colorRef = useRef(accentColor);

  useEffect(() => {
    colorRef.current = accentColor;
  }, [accentColor]);

  useEffect(() => {
    const rm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (rm || !active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = 0,
      height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(110, Math.floor((width * height) / 14000));
      const arr = particlesRef.current;
      if (arr.length === 0) {
        for (let i = 0; i < target; i++) arr.push(makeParticle(width, height));
      }
    };

    const makeParticle = (w, h) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6,
      offset: Math.random() * 0.4 + 0.6,
    });

    const handlePointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      pointerRef.current.x = t.clientX - rect.left;
      pointerRef.current.y = t.clientY - rect.top;
      pointerRef.current.active = true;
    };
    const handleLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.x = -9999;
      pointerRef.current.y = -9999;
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      const particles = particlesRef.current;
      const { x: px, y: py, active: pActive } = pointerRef.current;
      const repelRadius = 130,
        repelRadiusSq = repelRadius * repelRadius;
      const linkDist = 110,
        linkDistSq = linkDist * linkDist;
      const color = colorRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (pActive) {
          const dx = p.x - px,
            dy = p.y - py;
          const distSq = dx * dx + dy * dy;
          if (distSq < repelRadiusSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / repelRadius) * 0.9;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.vx += (Math.random() - 0.5) * 0.01;
        p.vy += (Math.random() - 0.5) * 0.01;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
        ctx.beginPath();
        ctx.fillStyle = hexToRgba(color, 0.9 * p.offset);
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < linkDistSq) {
            const alpha = (1 - distSq / linkDistSq) * 0.35;
            ctx.strokeStyle = hexToRgba(color, alpha);
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handlePointer);
    canvas.addEventListener("touchmove", handlePointer, { passive: true });
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("touchend", handleLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handlePointer);
      canvas.removeEventListener("touchmove", handlePointer);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("touchend", handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      aria-hidden="true"
    />
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  AchievementToast                                            */
/* ─────────────────────────────────────────────────────────── */
function AchievementToast({ show }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed z-50 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 bottom-6 transition-all duration-700 ease-out ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3 bg-stone-900/95 backdrop-blur-xl border border-amber-400/40 rounded-2xl shadow-2xl px-4 py-3 max-w-sm">
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -inset-1 rounded-full border-2 border-amber-400/50 animate-ping" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-widest uppercase text-amber-400">
            Achievement Unlocked
          </p>
          <p className="text-sm font-bold text-white leading-tight">
            Curious Explorer
          </p>
          <p className="text-xs text-stone-300 font-medium">+50 XP earned</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  CountUp                                                     */
/* ─────────────────────────────────────────────────────────── */
function CountUp({
  target,
  suffix = "",
  decimals = 0,
  duration = 1600,
  triggered,
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!triggered) return;
    const start = Date.now();
    const animate = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setVal(eased * target);
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [triggered, target, duration]);

  const display =
    decimals > 0
      ? (
          Math.round(val * Math.pow(10, decimals)) / Math.pow(10, decimals)
        ).toFixed(decimals)
      : Math.round(val).toLocaleString();

  return (
    <>
      {display}
      {suffix}
    </>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  LandingPage                                                 */
/* ─────────────────────────────────────────────────────────── */
export function LandingPage({ onStartLearning, onAdminPortal, onNavigate }) {
  const [heroScrollY, setHeroScrollY] = useState(0);
  const [activeSubjectIdx, setActiveSubjectIdx] = useState(0);
  const [hoveredSubjectIdx, setHoveredSubjectIdx] = useState(null);
  const [achievementShown, setAchievementShown] = useState(false);
  const [achievementVisible, setAchievementVisible] = useState(false);
  const [activePanel, setActivePanel] = useState("quiz");
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [teaserAnswer, setTeaserAnswer] = useState(null);
  const [teaserKey, setTeaserKey] = useState(0);
  const [xpWidth, setXpWidth] = useState(0);

  const { isDark } = useTheme();
  const heroRef = useRef(null);

  const [statsRef, statsTriggered] = useScrollTrigger(0.3);
  const [gamifRef, gamifTriggered] = useScrollTrigger(0.2);
  const [featurePanelsRef, featurePanelsTriggered] = useScrollTrigger(0.1);
  const [splitRef, splitTriggered] = useScrollTrigger(0.15);
  const [ctaRef, ctaTriggered] = useScrollTrigger(0.2);

  const rafRef = useRef(null);
  const cycleRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const displayedSubjectIdx =
    hoveredSubjectIdx !== null ? hoveredSubjectIdx : activeSubjectIdx;
  const subject = SUBJECTS[displayedSubjectIdx];

  const sceneKey = subject.key;
  const sceneCfg = (SCENE_CFG[sceneKey] ?? SCENE_CFG.earth)[
    isDark ? "dark" : "light"
  ];

  const heroStars = useMemo(
    () =>
      Array.from({ length: 60 }, () => ({
        l: Math.random() * 100 + "%",
        t: Math.random() * 60 + "%",
        delay: +(Math.random() * 3).toFixed(2),
        dur: +(2 + Math.random() * 2).toFixed(1),
        scale: +(0.5 + Math.random() * 1.2).toFixed(2),
      })),
    [],
  );

  const physParticles = useMemo(
    () =>
      Array.from({ length: 30 }, () => ({
        l: Math.random() * 100 + "%",
        t: Math.random() * 100 + "%",
        delay: +(Math.random() * 8).toFixed(2),
        dur: +(5 + Math.random() * 6).toFixed(1),
        op: +(0.3 + Math.random() * 0.5).toFixed(2),
      })),
    [],
  );

  /* XP bar animation */
  useEffect(() => {
    if (!gamifTriggered) return;
    if (prefersReducedMotion) {
      setXpWidth(73);
      return;
    }
    const id = setTimeout(() => {
      const start = Date.now();
      const run = () => {
        const t = Math.min((Date.now() - start) / 1200, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setXpWidth(Math.round(eased * 73));
        if (t < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    }, 300);
    return () => clearTimeout(id);
  }, [gamifTriggered, prefersReducedMotion]);

  /* Scroll handler */
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        setHeroScrollY(y);
        const vh = window.innerHeight;
        if (!achievementShown && y > vh * 0.85) {
          setAchievementShown(true);
          setAchievementVisible(true);
          window.setTimeout(() => setAchievementVisible(false), 4500);
        }
        rafRef.current = null;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [achievementShown]);

  /* Subject cycling */
  useEffect(() => {
    if (prefersReducedMotion || hoveredSubjectIdx !== null) return;
    cycleRef.current = window.setInterval(() => {
      setActiveSubjectIdx((i) => (i + 1) % SUBJECTS.length);
    }, 3500);
    return () => {
      if (cycleRef.current) window.clearInterval(cycleRef.current);
    };
  }, [hoveredSubjectIdx, prefersReducedMotion]);

  /* Hero mouse parallax */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    let tX = 0,
      tY = 0,
      cX = 0,
      cY = 0,
      raf;
    const t0 = performance.now();
    const depths = [6, 12, 20, 30, 44];
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      tX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      tY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      tX = 0;
      tY = 0;
    };
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      cX += (tX - cX) * 0.06;
      cY += (tY - cY) * 0.06;
      hero.querySelectorAll(".sq-parallax-layer").forEach((el, i) => {
        const d = depths[i % depths.length];
        const bob = Math.sin(t * 0.55 + i * 0.7) * (2 + i * 1.1);
        const drift = Math.sin(t * 0.22 + i * 0.9) * (3 + i * 1.2);
        el.style.transform = `translate3d(${cX * d + drift}px,${cY * d * 0.4 + bob}px,0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleOrbEnter = useCallback((idx) => setHoveredSubjectIdx(idx), []);
  const handleOrbLeave = useCallback(() => setHoveredSubjectIdx(null), []);
  const handleOrbClick = useCallback(
    (idx) => {
      onStartLearning?.(SUBJECTS[idx].key);
    },
    [onStartLearning],
  );

  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const rm = prefersReducedMotion;
  const imgParallax = rm ? 0 : Math.min(heroScrollY * 0.3, vh * 0.35);
  const imgOpacity = rm ? 1 : Math.max(0.15, 1 - (heroScrollY / vh) * 0.85);
  const textParallax = rm ? 0 : Math.min(heroScrollY * 0.55, vh * 0.55);
  const textOpacity = rm ? 1 : Math.max(0, 1 - (heroScrollY / vh) * 1.3);
  const heroOnScreen = heroScrollY < vh;

  const togglePanel = (id) =>
    setActivePanel((prev) => (prev === id ? null : id));

  const handleQuizAnswer = (answer) => {
    if (quizAnswer !== null) return;
    setQuizAnswer(answer === "true" ? "correct" : "wrong");
  };
  const resetQuiz = () => setQuizAnswer(null);
  const handleTeaserAnswer = (answer) => {
    if (teaserAnswer !== null) return;
    setTeaserAnswer(answer === "true" ? "correct" : "wrong");
  };
  const resetTeaser = () => {
    setTeaserAnswer(null);
    setTeaserKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-950">
      <AchievementToast show={achievementVisible} />

      {/* ════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden"
        style={{
          paddingTop: 80,
          background: `linear-gradient(180deg, ${sceneCfg.top} 0%, ${sceneCfg.bot} 100%)`,
          transition: "background 1.2s ease",
        }}
      >
        {/* Stars — visible in dark mode */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: isDark ? 1 : 0, transition: "opacity 1s ease" }}
          aria-hidden="true"
        >
          {heroStars.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: 3,
                height: 3,
                left: s.l,
                top: s.t,
                opacity: 0.6,
                animation: `sq-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
                transform: `scale(${s.scale})`,
              }}
            />
          ))}
        </div>

        {/* Celestial body (sun / crescent moon) */}
        <div
          className="absolute pointer-events-none"
          aria-hidden="true"
          style={{
            top: isDark ? 70 : 110,
            right: isDark ? "14%" : "8%",
            width: 130,
            height: 130,
            zIndex: 6,
            opacity: sceneKey === "physics" ? 0 : 1,
            transition: "top 1s ease, right 1s ease, opacity 1s ease",
          }}
        >
          <span
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px dashed rgba(250,204,21,0.45)",
              animation: "sq-spin 22s linear infinite",
            }}
          />
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: isDark
                ? "radial-gradient(circle at 60% 40%, #fff8c4, #fde047 70%)"
                : "radial-gradient(circle at 35% 35%, #fff4a3, #facc15 65%)",
              boxShadow:
                "0 0 90px 30px rgba(253,224,71,0.5), 0 0 30px 8px rgba(253,224,71,0.5)",
              clipPath: isDark
                ? "circle(45% at 65% 50%)"
                : "circle(50% at 50% 50%)",
              transition: "clip-path 1s ease, background 1s ease",
            }}
          />
        </div>

        {/* Hero text */}
        <div
          className="relative max-w-4xl mx-auto px-6 pt-14 pb-6 text-center"
          style={{ zIndex: 25 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-bold tracking-widest uppercase mb-5"
            style={{
              background: isDark
                ? "rgba(26,36,64,0.85)"
                : "rgba(255,255,255,0.9)",
              borderColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(28,25,23,0.08)",
              color: isDark ? "#b8b4ad" : "#57534e",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#f97316",
                animation: "sq-pulse 2s ease-in-out infinite",
              }}
            />
            Grade 7 · Interactive Science
          </div>

          <h1
            className="font-black leading-none tracking-tighter mb-3.5 font-heading"
            style={{
              fontSize: "clamp(42px,7vw,88px)",
              letterSpacing: "-0.03em",
              color: isDark ? "#f5f5f4" : "#292524",
            }}
          >
            Pick a world. Start an{" "}
            <span
              style={{
                color:
                  sceneKey === "biology"
                    ? isDark
                      ? "#9bd9a4"
                      : "#2f7a3a"
                    : sceneKey === "physics"
                      ? isDark
                        ? "#c4b5fd"
                        : "#5b3fbf"
                      : isDark
                        ? "#fdba74"
                        : "#ea580c",
                transition: "color 1s ease",
              }}
            >
              adventure
            </span>
            .
          </h1>

          <p
            className="max-w-lg mx-auto"
            style={{
              fontSize: "clamp(15px,1.4vw,18px)",
              color: isDark ? "#b8b4ad" : "#57534e",
              lineHeight: 1.55,
            }}
          >
            Three big subjects, one playful place to explore them hello world
            hello world.
          </p>
        </div>

        {/* Orbs */}
        <div
          className="relative flex flex-wrap justify-center items-end gap-6 sm:gap-10 px-6"
          style={{
            zIndex: 25,
            maxWidth: 1100,
            margin: "0 auto",
            paddingBottom: 40,
          }}
        >
          {HERO_ORB_CFG.map((orb) => {
            const isActive = sceneKey === orb.scene;
            const orbIdx = SUBJECTS.findIndex((s) => s.key === orb.scene);
            return (
              <button
                key={orb.scene}
                onClick={() => {
                  setActiveSubjectIdx(orbIdx);
                  setHoveredSubjectIdx(null);
                }}
                onMouseEnter={() => handleOrbEnter(orbIdx)}
                onMouseLeave={handleOrbLeave}
                className="relative flex flex-col items-center mb-10 sm:mb-16"
                aria-label={orb.label}
              >
                <span
                  className="relative flex items-center justify-center rounded-full border"
                  style={{
                    width: "clamp(78px,9vw,110px)",
                    height: "clamp(78px,9vw,110px)",
                    background: isActive
                      ? isDark
                        ? orb.darkActiveBg
                        : orb.lightActiveBg
                      : isDark
                        ? "#1a2440"
                        : "#ffffff",
                    borderColor: isActive
                      ? orb.borderColor
                      : isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(28,25,23,0.08)",
                    boxShadow: isActive
                      ? `0 30px 60px -22px ${orb.shadow}`
                      : "0 14px 30px -16px rgba(28,25,23,0.25)",
                    transform: isActive
                      ? "translateY(-10px) scale(1.04)"
                      : "translateY(0) scale(1)",
                    transition:
                      "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease, background 0.6s ease, border-color 0.4s ease",
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      border: isActive
                        ? `2px solid ${orb.borderColor}`
                        : "1px dashed rgba(0,0,0,0.10)",
                      animation: "sq-spin 28s linear infinite",
                      opacity: isActive ? 1 : 0.55,
                    }}
                  />
                  <orb.IconComp
                    strokeWidth={1.6}
                    style={{
                      width: "50%",
                      height: "50%",
                      color: isDark ? orb.darkColor : orb.lightColor,
                      transition: "color 0.4s ease",
                    }}
                  />
                </span>
                {/* Label */}
                <span
                  className="absolute font-black text-sm sm:text-base whitespace-nowrap font-heading"
                  style={{
                    bottom: -30,
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: isDark ? "#f5f5f4" : "#292524",
                  }}
                >
                  {orb.label}
                </span>
                {/* Sub-label */}
                <span
                  className="absolute text-[11px] font-medium uppercase tracking-widest whitespace-nowrap"
                  style={{
                    bottom: -50,
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: isDark ? "#b8b4ad" : "#57534e",
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  {orb.sub}
                </span>
              </button>
            );
          })}
          <div className="w-full flex justify-center pt-4">
            <Button
              size="md"
              onClick={() => onStartLearning?.(sceneKey)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Enter{" "}
              {HERO_ORB_CFG.find((o) => o.scene === sceneKey)?.label ??
                "Science"}
            </Button>
          </div>
        </div>

        {/* Scene layers */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ height: "62vh", minHeight: 420, zIndex: 10 }}
          aria-hidden="true"
        >
          {/* Earth clouds */}
          <div
            className="absolute inset-0"
            style={{
              opacity: sceneKey === "earth" ? 1 : 0,
              transition: "opacity 1s ease",
            }}
          >
            {EARTH_PATHS.map((d, i) => (
              <div
                key={i}
                className="sq-parallax-layer absolute inset-x-0 bottom-0"
                style={{
                  height: LAYER_HEIGHTS_EARTH[i],
                  willChange: "transform",
                }}
              >
                <svg
                  viewBox="0 0 1440 600"
                  preserveAspectRatio="none"
                  style={{
                    display: "block",
                    width: "120%",
                    marginLeft: "-10%",
                  }}
                >
                  <path
                    fill={SCENE_CFG.earth[isDark ? "dark" : "light"].c[i]}
                    d={d}
                  />
                </svg>
              </div>
            ))}
          </div>

          {/* Biology mountains */}
          <div
            className="absolute inset-0"
            style={{
              opacity: sceneKey === "biology" ? 1 : 0,
              transition: "opacity 1s ease",
            }}
          >
            {BIO_PATHS.map((d, i) => (
              <div
                key={i}
                className="sq-parallax-layer absolute inset-x-0 bottom-0"
                style={{
                  height: LAYER_HEIGHTS_BIO[i],
                  willChange: "transform",
                }}
              >
                <svg
                  viewBox="0 0 1440 600"
                  preserveAspectRatio="none"
                  style={{
                    display: "block",
                    width: "120%",
                    marginLeft: "-10%",
                  }}
                >
                  <path
                    fill={SCENE_CFG.biology[isDark ? "dark" : "light"].c[i]}
                    d={d}
                  />
                </svg>
              </div>
            ))}
          </div>

          {/* Physics atoms */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              opacity: sceneKey === "physics" ? 1 : 0,
              transition: "opacity 1s ease",
            }}
          >
            {physParticles.map((p, i) => (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 5,
                  height: 5,
                  left: p.l,
                  top: p.t,
                  background: isDark ? "#fde047" : "#7c3aed",
                  boxShadow: `0 0 8px 1px ${isDark ? "rgba(253,224,71,0.4)" : "rgba(124,58,237,0.4)"}`,
                  opacity: p.op,
                  animation: `sq-ptFloat ${p.dur}s ease-in-out ${p.delay}s infinite`,
                }}
              />
            ))}
            {PHYS_ATOMS.map((atom, ai) => {
              const rings = isDark
                ? SCENE_CFG.physics.dark.rings
                : SCENE_CFG.physics.light.rings;
              return (
                <div
                  key={ai}
                  className="absolute rounded-full"
                  style={{ ...atom.style }}
                >
                  {rings.map((rc, ri) => (
                    <span
                      key={ri}
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: `2px solid ${rc}`,
                        opacity: 0.55,
                        transform: `rotate(${ri * 60}deg)`,
                      }}
                    />
                  ))}
                  <span
                    className="absolute rounded-full"
                    style={{
                      width: 14,
                      height: 14,
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%,-50%)",
                      background:
                        "radial-gradient(circle at 30% 30%, #fff7c4, #facc15 65%)",
                      boxShadow: "0 0 30px 8px rgba(253,224,71,0.4)",
                    }}
                  />
                  {atom.electrons.map((e, ei) => (
                    <span
                      key={ei}
                      className="absolute rounded-full"
                      style={{
                        width: 14,
                        height: 14,
                        top: "50%",
                        left: "50%",
                        marginTop: -7,
                        marginLeft: -7,
                        background: `radial-gradient(circle at 30% 30%, #fff, ${isDark ? "#a8d2f7" : "#8a6dde"})`,
                        boxShadow: "0 0 14px 2px rgba(167,139,250,0.5)",
                        animation: e.anim,
                      }}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
          @keyframes sq-spin    { to { transform: rotate(360deg); } }
          @keyframes sq-pulse   { 0%,100%{opacity:.5;transform:scale(.85)} 50%{opacity:1;transform:scale(1.15)} }
          @keyframes sq-twinkle { 0%,100%{opacity:.3;transform:scale(.6)} 50%{opacity:1;transform:scale(1)} }
          @keyframes sq-ptFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)} }
          @keyframes sq-ao1 { from{transform:rotate(0) translateX(31vmin) rotate(0)} to{transform:rotate(360deg) translateX(31vmin) rotate(-360deg)} }
          @keyframes sq-ao2 { from{transform:rotate(60deg) translateX(31vmin) rotate(-60deg)} to{transform:rotate(420deg) translateX(31vmin) rotate(-420deg)} }
          @keyframes sq-ao3 { from{transform:rotate(-60deg) translateX(31vmin) rotate(60deg)} to{transform:rotate(300deg) translateX(31vmin) rotate(-300deg)} }
          @keyframes sq-bo1 { from{transform:rotate(0) translateX(15vmin) rotate(0)} to{transform:rotate(360deg) translateX(15vmin) rotate(-360deg)} }
          @keyframes sq-bo2 { from{transform:rotate(60deg) translateX(15vmin) rotate(-60deg)} to{transform:rotate(420deg) translateX(15vmin) rotate(-420deg)} }
          @keyframes sq-co1 { from{transform:rotate(30deg) translateX(18vmin) rotate(-30deg)} to{transform:rotate(390deg) translateX(18vmin) rotate(-390deg)} }
          @keyframes sq-co2 { from{transform:rotate(-30deg) translateX(18vmin) rotate(30deg)} to{transform:rotate(330deg) translateX(18vmin) rotate(-330deg)} }
          @keyframes sq-do1 { from{transform:rotate(15deg) translateX(11vmin) rotate(-15deg)} to{transform:rotate(375deg) translateX(11vmin) rotate(-375deg)} }
          @keyframes sq-do2 { from{transform:rotate(-45deg) translateX(11vmin) rotate(45deg)} to{transform:rotate(315deg) translateX(11vmin) rotate(-315deg)} }
        `}</style>
      </section>

      {/* ════════════════════════════════════════════════
          STATS STRIP
      ════════════════════════════════════════════════ */}
      <section
        ref={statsRef}
        className="relative z-10 py-8 bg-stone-950 overflow-hidden"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-stone-800">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className={`flex flex-col items-center lg:items-start lg:px-8 gap-0.5 transition-[opacity,transform] duration-700 ease-out ${
                  statsTriggered
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  transitionDelay: statsTriggered ? `${i * 120}ms` : "0ms",
                }}
              >
                <span className="text-3xl sm:text-4xl font-black text-white font-heading tabular-nums">
                  {statsTriggered ? (
                    <CountUp
                      target={stat.target}
                      suffix={stat.suffix}
                      decimals={stat.decimals || 0}
                      triggered={statsTriggered}
                      duration={1400 + i * 150}
                    />
                  ) : (
                    <span className="opacity-0">0</span>
                  )}
                </span>
                <span className="text-xs font-bold text-stone-400 tracking-widest uppercase font-heading">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          LEVEL UP — FEATURE PANELS
      ════════════════════════════════════════════════ */}
      <section
        id="feature-panels"
        ref={featurePanelsRef}
        className="relative z-10 py-24 bg-amber-50 dark:bg-stone-900 overflow-hidden"
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div
            className={`text-center mb-14 transition-[opacity,transform] duration-700 ease-out ${
              featurePanelsTriggered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl md:text-5xl font-black text-stone-900 dark:text-white mb-3 font-heading">
              <TypewriterText text="What you'll actually do" />
            </h2>
            <p className="text-lg text-stone-500 dark:text-stone-400 max-w-lg mx-auto">
              Not just reading. Answering, exploring, and competing.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Panel: Quiz Mode */}
            <div
              className={`rounded-2xl border overflow-hidden transition-[opacity,transform,border-color,background-color] duration-700 ease-out ${activePanel === "quiz" ? "border-primary-300 bg-white dark:bg-stone-800 shadow-lg" : "border-stone-200 dark:border-stone-700 bg-white/60 dark:bg-stone-800/60"} ${
                featurePanelsTriggered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12"
              }`}
              style={{
                transitionDelay: featurePanelsTriggered ? "100ms" : "0ms",
              }}
            >
              <button
                className="w-full flex items-center gap-4 p-5 text-left"
                onClick={() => togglePanel("quiz")}
                aria-expanded={activePanel === "quiz"}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${activePanel === "quiz" ? "bg-primary-500" : "bg-stone-100"}`}
                >
                  <Target
                    className={`w-6 h-6 ${activePanel === "quiz" ? "text-white" : "text-stone-500"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-lg font-black font-heading transition-colors duration-300 ${activePanel === "quiz" ? "text-primary-600" : "text-stone-800"} dark:text-primary-300`}
                  >
                    Quiz Mode
                  </h3>
                  <p className="text-sm text-stone-500 dark:text-accent-50">
                    Answer questions. Earn XP. Level up.
                  </p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-300 ${activePanel === "quiz" ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={activePanel === "quiz" ? "" : "h-0 overflow-hidden"}
              >
                <div
                  className={`px-5 pb-6 transition-[opacity,transform] duration-300 ease-out ${activePanel === "quiz" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
                >
                  <div className="bg-stone-50 dark:bg-stone-700/50 rounded-xl p-5">
                    <p className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-3">
                      True or False
                    </p>
                    <p className="text-lg font-bold text-stone-900 mb-5 leading-snug dark:text-white">
                      The mitochondria is the powerhouse of the cell.
                    </p>
                    {quizAnswer === null ? (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleQuizAnswer("true")}
                          className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors active:scale-95"
                        >
                          True
                        </button>
                        <button
                          onClick={() => handleQuizAnswer("false")}
                          className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors active:scale-95"
                        >
                          False
                        </button>
                      </div>
                    ) : quizAnswer === "correct" ? (
                      <div className="flex items-center justify-between animate-[fadeSwap_0.4s_ease-out]">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                          <div>
                            <p className="font-bold text-emerald-700">
                              That's correct!
                            </p>
                            <p className="text-sm text-stone-500">
                              Mitochondria produces ATP energy.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <span className="text-xl font-black text-amber-500 font-heading">
                            +10 XP
                          </span>
                          <button
                            onClick={resetQuiz}
                            className="p-1.5 text-stone-400 hover:text-stone-600 transition-colors"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between animate-[fadeSwap_0.4s_ease-out]">
                        <div className="flex items-center gap-3">
                          <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                          <div>
                            <p className="font-bold text-rose-700">
                              Not quite!
                            </p>
                            <p className="text-sm text-stone-500">
                              It IS true — mitochondria = energy factory.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={resetQuiz}
                          className="p-1.5 text-stone-400 hover:text-stone-600 transition-colors ml-3"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Panel: Explore */}
            <div
              className={`rounded-2xl border overflow-hidden transition-[opacity,transform,border-color,background-color] duration-700 ease-out ${activePanel === "explore" ? "border-secondary-300 bg-white dark:bg-stone-800 shadow-lg" : "border-stone-200 dark:border-stone-700 bg-white/60 dark:bg-stone-800/60"} ${
                featurePanelsTriggered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12"
              }`}
              style={{
                transitionDelay: featurePanelsTriggered ? "220ms" : "0ms",
              }}
            >
              <button
                className="w-full flex items-center gap-4 p-5 text-left"
                onClick={() => togglePanel("explore")}
                aria-expanded={activePanel === "explore"}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${activePanel === "explore" ? "bg-secondary-500" : "bg-stone-100"}`}
                >
                  <BookOpen
                    className={`w-6 h-6 ${activePanel === "explore" ? "text-white" : "text-stone-500"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-lg font-black font-heading transition-colors duration-300 ${activePanel === "explore" ? "text-secondary-600" : "text-stone-800"} dark:text-secondary-300`}
                  >
                    Explore Lessons
                  </h3>
                  <p className="text-sm text-stone-500 dark:text-white">
                    Flip cards, diagrams, and key concepts.
                  </p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-300 ${activePanel === "explore" ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={
                  activePanel === "explore" ? "" : "h-0 overflow-hidden"
                }
              >
                <div
                  className={`px-5 pb-6 transition-[opacity,transform] duration-300 ease-out ${activePanel === "explore" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-stone-500">
                      Tap the card to flip it
                    </p>
                    <div
                      className="w-full max-w-sm h-40 cursor-pointer"
                      style={{ perspective: "1000px" }}
                      onClick={() => setCardFlipped((f) => !f)}
                      role="button"
                      aria-label="Flip card"
                    >
                      <div
                        className="relative w-full h-full transition-transform duration-500"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: cardFlipped
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                        }}
                      >
                        <div
                          className="absolute inset-0 rounded-2xl bg-secondary-500 flex flex-col items-center justify-center gap-2 p-6"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <BookOpen className="w-8 h-8 text-white/60" />
                          <p className="text-xs font-bold text-white/60 tracking-widest uppercase">
                            Key Term
                          </p>
                          <p className="text-2xl font-black text-white font-heading">
                            Photosynthesis
                          </p>
                        </div>
                        <div
                          className="absolute inset-0 rounded-2xl bg-secondary-700 flex items-center justify-center p-6"
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <p className="text-sm font-semibold text-white text-center leading-relaxed">
                            The process by which plants convert sunlight, CO₂,
                            and water into glucose and oxygen.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel: Compete */}
            <div
              className={`rounded-2xl border overflow-hidden transition-[opacity,transform,border-color,background-color] duration-700 ease-out ${activePanel === "compete" ? "border-accent-300 bg-white dark:bg-stone-800 shadow-lg" : "border-stone-200 dark:border-stone-700 bg-white/60 dark:bg-stone-800/60"} ${
                featurePanelsTriggered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-12"
              }`}
              style={{
                transitionDelay: featurePanelsTriggered ? "340ms" : "0ms",
              }}
            >
              <button
                className="w-full flex items-center gap-4 p-5 text-left"
                onClick={() => togglePanel("compete")}
                aria-expanded={activePanel === "compete"}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${activePanel === "compete" ? "bg-accent-500" : "bg-stone-100"}`}
                >
                  <Trophy
                    className={`w-6 h-6 ${activePanel === "compete" ? "text-white" : "text-stone-500"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-lg font-black font-heading transition-colors duration-300 ${activePanel === "compete" ? "text-accent-600" : "text-stone-800"} dark:text-accent-200`}
                  >
                    Compete
                  </h3>
                  <p className="text-sm text-stone-500 dark:text-white">
                    See where you rank against your class.
                  </p>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-300 ${activePanel === "compete" ? "rotate-180" : ""}`}
                />
              </button>

              <div
                className={
                  activePanel === "compete" ? "" : "h-0 overflow-hidden"
                }
              >
                <div
                  className={`px-5 pb-6 transition-[opacity,transform] duration-300 ease-out ${activePanel === "compete" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
                >
                  <div className="space-y-2 ">
                    {LEADERBOARD.map((entry) => (
                      <div
                        key={entry.rank}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl ${entry.isUser ? "border border-orange-400" : "bg-stone-50 dark:bg-stone-700/50"}`}
                      >
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${entry.rank === 1 ? "bg-amber-400 text-white" : "bg-stone-200 text-stone-600"}`}
                        >
                          {entry.rank === 1 ? (
                            <Crown className="w-3.5 h-3.5" />
                          ) : (
                            entry.rank
                          )}
                        </span>
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 "
                          style={{ backgroundColor: entry.color }}
                        >
                          {entry.name[0]}
                        </span>
                        <span
                          className={`flex-1 text-sm font-bold ${entry.isUser ? "text-primary-700" : "text-stone-700"}dark:text-white`}
                        >
                          {entry.name}
                        </span>
                        <span className="text-xs text-stone-400 font-medium">
                          {entry.subject}
                        </span>
                        <span className="text-sm font-black text-stone-800 font-heading tabular-nums dark:text-white">
                          {entry.xp.toLocaleString()} XP
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          GAMIFICATION SHOWCASE
      ════════════════════════════════════════════════ */}
      <section
        ref={gamifRef}
        className="relative z-10 py-24 bg-stone-950 overflow-hidden"
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div
            className={`text-center mb-14 transition-[opacity,transform] duration-700 ease-out ${
              gamifTriggered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl md:text-5xl font-black text-white mb-3 font-heading">
              Your profile. Your progress.
            </h2>
            <p className="text-lg text-stone-400 max-w-xl mx-auto">
              Every quiz, every lesson, every day you show up — it counts.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Player card */}
            <div
              className={`rounded-2xl bg-stone-900 border border-stone-800 p-6 transition-[opacity,transform] duration-700 ease-out ${
                gamifTriggered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-2xl font-black text-white font-heading shrink-0">
                  Y
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xl font-black text-white font-heading">
                      You
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold">
                      LVL 12
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-bold text-stone-400">
                      7-day streak
                    </span>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-black text-white font-heading tabular-nums">
                    2,840
                  </p>
                  <p className="text-xs text-stone-500 font-medium">
                    / 3,900 XP
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-xs text-stone-500 font-medium mb-2">
                  <span>Progress to Level 13</span>
                  <span>{xpWidth}%</span>
                </div>
                <div className="h-3 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-500 origin-left transition-[transform] duration-1200 ease-out"
                    style={{ transform: `scaleX(${xpWidth / 100})` }}
                  />
                </div>
              </div>

              <p className="text-xs font-bold text-stone-500 tracking-widest uppercase mb-3">
                Achievements
              </p>
              <div className="grid grid-cols-4 gap-3">
                {BADGES.map(({ Icon, label, bg, color }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                    <span className="text-[10px] text-stone-500 text-center font-medium leading-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div
              className={`rounded-2xl bg-stone-900 border border-stone-800 p-6 transition-[opacity,transform] duration-700 ease-out delay-150 ${
                gamifTriggered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black text-white font-heading">
                  Leaderboard
                </h3>
                <span className="text-xs text-stone-500 font-medium">
                  This Week
                </span>
              </div>
              <div className="space-y-2">
                {LEADERBOARD.map((entry, i) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-[opacity,transform] duration-500 ease-out ${
                      gamifTriggered
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4"
                    } ${entry.isUser ? "bg-primary-500/10 border border-primary-500/30" : "bg-stone-800/60"}`}
                    style={{
                      transitionDelay: gamifTriggered
                        ? `${200 + i * 80}ms`
                        : "0ms",
                    }}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        entry.rank === 1
                          ? "bg-amber-400 text-stone-900"
                          : entry.rank === 2
                            ? "bg-stone-400 text-stone-900"
                            : entry.rank === 3
                              ? "bg-amber-700 text-white"
                              : "bg-stone-700 text-stone-300"
                      }`}
                    >
                      {entry.rank === 1 ? (
                        <Crown className="w-4 h-4" />
                      ) : (
                        entry.rank
                      )}
                    </span>
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                      style={{ backgroundColor: entry.color }}
                    >
                      {entry.name[0]}
                    </span>
                    <span
                      className={`flex-1 text-sm font-bold truncate ${entry.isUser ? "text-primary-300" : "text-stone-200"}`}
                    >
                      {entry.name}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: `${entry.color}22`,
                        color: entry.color,
                      }}
                    >
                      {entry.subject}
                    </span>
                    <span className="text-sm font-black text-white font-heading tabular-nums shrink-0">
                      {entry.xp.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          SPLIT SECTION
      ════════════════════════════════════════════════ */}
      <section
        ref={splitRef}
        className="relative z-10 py-24 bg-primary-50 dark:bg-stone-900 overflow-hidden"
      >
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-primary-300/25 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div
              className={`order-2 lg:order-1 relative group transition-[opacity,transform] duration-700 ease-out ${
                splitTriggered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-14"
              }`}
            >
              <div className="absolute inset-0 bg-primary-500 rounded-[3rem] transform -rotate-3 scale-105 transition-transform duration-500 group-hover:-rotate-1" />
              <img
                src={mclassroom}
                alt="Students collaborating"
                className="relative rounded-[3rem] shadow-xl w-full object-cover aspect-square lg:aspect-4/5 transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            <div
              className={`order-1 lg:order-2 transition-[opacity,transform] duration-700 ease-out delay-150 ${
                splitTriggered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-14"
              }`}
            >
              <p className="text-sm font-bold text-primary-600 tracking-widest uppercase mb-3 font-heading">
                Built for Grade 7
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-stone-900 dark:text-white mb-4 font-heading">
                <TypewriterText
                  text="Science class, but make it a game."
                  speed={32}
                />
              </h2>
              <p className="text-lg text-stone-600 mb-2 leading-relaxed dark:text-white">
                SciQuest turns the curriculum into challenges you actually want
                to finish. No textbook walls, no boring slides.
              </p>
              <p className="text-sm font-bold text-primary-600 mb-8">
                Join 2,400+ students already on the platform.
              </p>

              <ul className="space-y-5">
                {[
                  {
                    Icon: Atom,
                    text: "Curriculum-aligned content for Grade 7 Science",
                    color: "text-sky-500",
                    bg: "bg-sky-50",
                  },
                  {
                    Icon: Target,
                    text: "Adaptive difficulty that adjusts to your level",
                    color: "text-primary-500",
                    bg: "bg-primary-50",
                  },
                  {
                    Icon: Trophy,
                    text: "XP, badges, and real leaderboard rankings",
                    color: "text-amber-500",
                    bg: "bg-amber-50",
                  },
                  {
                    Icon: Globe2,
                    text: "Works on any device, anywhere you are",
                    color: "text-teal-500",
                    bg: "bg-teal-50",
                  },
                ].map(({ Icon, text, color, bg }, i) => (
                  <li
                    key={i}
                    className="group/item flex items-center gap-4 cursor-default"
                  >
                    <div
                      className={`shrink-0 w-10 h-10 rounded-xl ${bg} flex items-center justify-center transition-transform duration-300 group-hover/item:scale-110`}
                    >
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <span className="text-base text-stone-700 font-medium transition-transform duration-300 group-hover/item:translate-x-1 dark:text-white">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Button size="lg" onClick={onStartLearning}>
                  Join the Platform
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          QUICK QUIZ TEASER
      ════════════════════════════════════════════════ */}
      {/* <section className="relative z-10 py-24 bg-amber-50 overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-3 font-heading">
            Think you know science?
          </h2>
          <p className="text-stone-500 mb-10">One question. No pressure. Let's see what you've got.</p>

          <div key={teaserKey} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 text-left">
            <p className="text-xs font-bold text-stone-400 tracking-widest uppercase mb-3">True or False</p>
            <p className="text-xl font-bold text-stone-900 mb-6 leading-snug">
              Sound travels faster in water than in air.
            </p>

            {teaserAnswer === null ? (
              <div className="flex gap-3">
                <button onClick={() => handleTeaserAnswer("true")}  className="flex-1 py-4 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors active:scale-95 text-lg">True</button>
                <button onClick={() => handleTeaserAnswer("false")} className="flex-1 py-4 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors active:scale-95 text-lg">False</button>
              </div>
            ) : (
              <div className="animate-[fadeSwap_0.4s_ease-out]">
                {teaserAnswer === "correct" ? (
                  <div className="flex items-start gap-3 mb-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-emerald-700">You got it right!</p>
                      <p className="text-sm text-stone-600 mt-1">Sound travels about 4x faster in water (1,480 m/s) than in air (343 m/s).</p>
                    </div>
                    <span className="text-2xl font-black text-amber-500 font-heading shrink-0">+25 XP</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 mb-4 p-4 bg-rose-50 rounded-xl border border-rose-200">
                    <XCircle className="w-6 h-6 text-rose-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold text-rose-700">Not this time!</p>
                      <p className="text-sm text-stone-600 mt-1">That's actually TRUE. Sound travels about 4x faster in water than in air.</p>
                    </div>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={resetTeaser}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-stone-100 text-stone-700 font-bold hover:bg-stone-200 transition-colors text-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </button>
                  <Button onClick={onStartLearning} className="flex-1">Play the Full Quiz</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section> */}

      {/* ════════════════════════════════════════════════
          CTA SECTION
      ════════════════════════════════════════════════ */}
      <section
        ref={ctaRef}
        className="relative z-10 py-28 bg-stone-950 overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(249,115,22,0.10) 0%, transparent 60%)",
          }}
        />
        <div
          className={`max-w-3xl mx-auto px-4 sm:px-6 text-center transition-[opacity,transform] duration-700 ease-out ${
            ctaTriggered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-xs font-bold text-primary-500 tracking-widest uppercase mb-4 font-heading">
            Grade 7 Science
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 font-heading leading-tight">
            Ready to level up?
          </h2>
          <p className="text-lg text-stone-400 mb-10 max-w-xl mx-auto">
            Thousands of students are already making science something they look
            forward to.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onStartLearning}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════ */}
      <footer
        className="relative z-10 py-10 border-t border-stone-800 bg-stone-950 animate-[fadeInUp_0.6s_ease-out_both]"
        style={{ animationDelay: "0.2s" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-500/20 rounded-lg text-primary-500">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <span className="font-heading font-black text-white">
                SciQuest
              </span>
            </div>
            <p className="text-sm text-stone-500">
              2026 SciQuest. An interactive learning platform for Grade 7
              Science.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeSwap {
          0%   { opacity: 0; transform: translateY(8px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0);   filter: blur(0); }
        }
        @keyframes fadeInUp {
          0%   { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
