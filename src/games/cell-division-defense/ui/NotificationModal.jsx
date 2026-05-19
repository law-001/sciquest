import { useEffect, useRef } from 'react';

const MONO = '"Courier New", Courier, monospace';

export function NotificationModal({ message, subtext, duration = 3000, onDone }) {
  const doneRef = useRef(false);

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

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 25,
      background: 'rgba(0,0,0,0.78)',
      backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: MONO,
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
        borderRadius: 20,
        padding: 'clamp(28px,5vh,48px) clamp(32px,6vw,72px)',
        textAlign: 'center',
        animation: 'cdd-notif-in 0.3s cubic-bezier(0.34,1.56,0.64,1), cdd-notif-glow 2s ease-in-out infinite',
        maxWidth: 'min(500px, calc(100vw - 40px))',
      }}>
        <div style={{
          fontSize: 'clamp(18px,3.5vw,28px)',
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
            fontSize: 'clamp(11px,1.8vw,14px)',
            color: 'rgba(255,255,255,0.55)',
            marginTop: 14,
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
