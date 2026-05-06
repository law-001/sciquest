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
import mclassroom from "../assets/modernclassroom.jpg";
import labBg from "../assets/classroom.webp";

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
export function LandingPage({
  onStartLearning,
  onTeacherPortal,
  onAdminPortal,
  onNavigate,
}) {
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
      <section className="sticky top-0 min-h-screen overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: "calc(100% + 240px)",
            transform: `translateY(-${imgParallax}px)`,
            opacity: imgOpacity,
            willChange: "transform, opacity",
          }}
        >
          <img
            src={labBg}
            alt="Science laboratory"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-b from-stone-900/60 via-stone-900/70 to-stone-900/92 pointer-events-none" />

        <div className="absolute inset-0">
          <ParticleField accentColor={subject.accent} active={heroOnScreen} />
        </div>

        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-700"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${subject.accentSoft} 0%, transparent 55%)`,
          }}
        />

        <div
          className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 text-center pointer-events-none"
          style={{
            transform: `translateY(-${textParallax}px)`,
            opacity: textOpacity,
            willChange: "transform, opacity",
          }}
        >
          {/* LIVE badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-slide-up pointer-events-auto">
            <Star className="w-5 h-5 text-accent-400 fill-accent-400" />
            <span className="text-sm font-bold text-white font-heading">
              Grade 7 Science Curriculum
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tighter animate-slide-up max-w-4xl leading-none"
            style={{ animationDelay: "0.1s" }}
          >
            Learn{" "}
            <span
              key={subject.key}
              className="inline-block animate-[fadeSwap_0.6s_ease-out]"
              style={{ color: subject.accent }}
            >
              {subject.label}
            </span>
            <br />
            the Fun Way.
          </h1>

          <p
            key={`tag-${subject.key}`}
            className="text-base sm:text-lg text-stone-200 mb-8 font-medium leading-relaxed max-w-xl animate-[fadeSwap_0.5s_ease-out]"
          >
            {subject.tagline}. Grade 7 Science, built like a game. Earn XP,
            unlock badges, top the leaderboard.
          </p>

          {/* Subject orbs */}
          <div
            className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8 pointer-events-auto"
            role="tablist"
            aria-label="Choose your subject"
          >
            {SUBJECTS.map((s, idx) => {
              const Icon = s.icon;
              const isActive = displayedSubjectIdx === idx;
              return (
                <button
                  key={s.key}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Explore ${s.label}`}
                  onMouseEnter={() => handleOrbEnter(idx)}
                  onMouseLeave={handleOrbLeave}
                  onFocus={() => handleOrbEnter(idx)}
                  onBlur={handleOrbLeave}
                  onClick={() => handleOrbClick(idx)}
                  className={`group relative flex flex-col items-center gap-2.5 transition-transform duration-500 ${
                    isActive ? "scale-110" : "scale-100 hover:scale-105"
                  }`}
                >
                  <span
                    className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-500 ${isActive ? "opacity-80" : "opacity-25"}`}
                    style={{ backgroundColor: s.accent }}
                    aria-hidden="true"
                  />
                  <span
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-2 backdrop-blur-md transition-all duration-500"
                    style={{
                      borderColor: isActive
                        ? s.accent
                        : "rgba(255,255,255,0.25)",
                      background: isActive
                        ? `radial-gradient(circle at 30% 30%, ${s.accentSoft}, rgba(15,23,42,0.6))`
                        : "rgba(15,23,42,0.45)",
                      boxShadow: isActive
                        ? `0 0 40px ${s.accent}55, inset 0 0 24px ${s.accent}33`
                        : "none",
                    }}
                  >
                    <span
                      className={`absolute inset-1 rounded-full border border-dashed transition-opacity duration-500 ${isActive ? "opacity-60" : "opacity-0"}`}
                      style={{
                        borderColor: s.accent,
                        animation: isActive
                          ? "spin 6s linear infinite"
                          : "none",
                      }}
                      aria-hidden="true"
                    />
                    <Icon
                      className="w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-500"
                      style={{
                        color: isActive ? s.accent : "rgba(255,255,255,0.85)",
                      }}
                    />
                  </span>
                  <span
                    className={`relative text-xs sm:text-sm font-bold tracking-wide font-heading transition-colors duration-500 ${
                      isActive ? "text-white" : "text-white/70"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="flex flex-col sm:flex-row gap-3 animate-slide-up pointer-events-auto"
            style={{ animationDelay: "0.3s" }}
          >
            <Button
              size="md"
              onClick={() => onStartLearning?.(subject.key)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Learning {subject.label}
            </Button>
          </div>

          <p className="mt-6 text-xs text-white/40 font-medium tracking-wide hidden sm:block">
            Move your cursor through the particles · Tap an orb to switch
            subject
          </p>
        </div>
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
              I'm a Student
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onTeacherPortal}
              className="border-stone-600 text-stone-300 hover:bg-stone-800 hover:border-stone-500"
            >
              I'm a Teacher
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
            <div className="flex items-center gap-4">
              <button
                onClick={onTeacherPortal}
                className="text-sm font-bold text-stone-500 hover:text-secondary-400 transition-colors"
              >
                Teacher Portal
              </button>
              <span className="text-stone-700">|</span>
              <button
                onClick={onAdminPortal}
                className="text-sm font-bold text-stone-500 hover:text-primary-400 transition-colors"
              >
                Admin Portal
              </button>
            </div>
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
