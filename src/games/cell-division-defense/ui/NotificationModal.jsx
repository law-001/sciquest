import { useEffect, useRef, useState } from 'react';

const MONO = '"Courier New", Courier, monospace';

function useViewportBreakpoint() {
  const [bp, setBp] = useState(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w < 560 || h < 380) return 'xs';
    if (w < 768 || h < 460) return 'sm';
    return 'md';
  });
  useEffect(() => {
    const sync = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setBp(w < 560 || h < 380 ? 'xs' : w < 768 || h < 460 ? 'sm' : 'md');
    };
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);
  return bp;
}

export function NotificationModal({ message, subtext, duration = 3000, onDone }) {
  const doneRef = useRef(false);
  const bp = useViewportBreakpoint();

  useEffect(() => {
    doneRef.current = false;
    const id = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
    }, duration);
    return () => clearTimeout(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const padding = bp === 'xs' ? '14px 18px' : bp === 'sm' ? '20px 28px' : 'clamp(28px,5vh,48px) clamp(32px,6vw,72px)';
  const messageFont = bp === 'xs' ? 14 : bp === 'sm' ? 18 : 'clamp(18px,3.5vw,28px)';
  const subtextFont = bp === 'xs' ? 10 : bp === 'sm' ? 11 : 'clamp(11px,1.8vw,14px)';
  const subtextGap = bp === 'xs' ? 6 : bp === 'sm' ? 10 : 14;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 25,
      background: 'rgba(0,0,0,0.78)',
      backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: MONO,
      padding: 12,
    }}>
      <style>{`
        @keyframes cdd-notif-in {
          from { opacity: 0; transform: scale(0.88) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes cdd-notif-glow {
          0%,100% { box-shadow: 0 0 28px rgba(59,175,169,0.25), inset 0 0 0 1px rgba(59,175,169,0.3); }
          50%      { box-shadow: 0 0 52px rgba(59,175,169,0.55), inset 0 0 0 1px rgba(59,175,169,0.6); }
        }
      `}</style>
      <div style={{
        background: 'rgba(8,20,34,0.96)',
        border: '1.5px solid rgba(59,175,169,0.5)',
        borderRadius: bp === 'xs' ? 12 : 20,
        padding,
        textAlign: 'center',
        animation: 'cdd-notif-in 0.3s cubic-bezier(0.34,1.56,0.64,1), cdd-notif-glow 2s ease-in-out infinite',
        maxWidth: bp === 'xs' ? 'calc(100vw - 24px)' : 'min(500px, calc(100vw - 40px))',
      }}>
        <div style={{
          fontSize: messageFont,
          fontWeight: 700,
          color: '#3BAFA9',
          letterSpacing: '0.06em',
          lineHeight: 1.25,
          textShadow: '0 0 22px rgba(59,175,169,0.8)',
        }}>
          {message}
        </div>
        {subtext && (
          <div style={{
            fontSize: subtextFont,
            color: 'rgba(255,255,255,0.55)',
            marginTop: subtextGap,
            letterSpacing: '0.1em',
            lineHeight: 1.5,
          }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
}
