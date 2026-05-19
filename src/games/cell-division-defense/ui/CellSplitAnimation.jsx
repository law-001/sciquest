import { useEffect } from 'react';

const MONO = '"Courier New", Courier, monospace';

export function CellSplitAnimation({ onComplete }) {
  useEffect(() => {
    const id = setTimeout(() => onComplete?.(), 2200);
    return () => clearTimeout(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 28,
      background: '#0A1520',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: MONO, overflow: 'hidden',
    }}>
      <style>{`
        @keyframes cdd-sp-bg {
          0%   { opacity: 0.4; transform: scale(1); }
          100% { opacity: 0;   transform: scale(2.2); }
        }
        @keyframes cdd-sp-left {
          0%,25% { transform: translateX(0)    scale(1);    opacity: 1; }
          100%   { transform: translateX(-110px) scale(0.82); opacity: 1; }
        }
        @keyframes cdd-sp-right {
          0%,25% { transform: translateX(0)     scale(1);    opacity: 1; }
          100%   { transform: translateX(110px)  scale(0.82); opacity: 1; }
        }
        @keyframes cdd-sp-bridge {
          0%,20% { transform: scaleX(1); opacity: 0.7; }
          75%    { transform: scaleX(0.05); opacity: 0.3; }
          100%   { transform: scaleX(0); opacity: 0; }
        }
        @keyframes cdd-sp-title {
          0%    { opacity: 0; transform: translateY(16px); }
          25%   { opacity: 0; transform: translateY(16px); }
          50%   { opacity: 1; transform: translateY(0); }
          85%   { opacity: 1; }
          100%  { opacity: 0; }
        }
        @keyframes cdd-sp-sub {
          0%,35% { opacity: 0; }
          60%    { opacity: 0.7; }
          85%    { opacity: 0.7; }
          100%   { opacity: 0; }
        }
        @keyframes cdd-sp-pulse {
          0%,100% { box-shadow: 0 0 20px rgba(59,175,169,0.45); }
          50%     { box-shadow: 0 0 36px rgba(59,175,169,0.75); }
        }
      `}</style>

      {/* Radial burst behind cells */}
      <div style={{
        position: 'absolute',
        width: 320, height: 320,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,175,169,0.25) 0%, transparent 70%)',
        animation: 'cdd-sp-bg 2.2s ease-out forwards',
      }} />

      {/* Cell pair container */}
      <div style={{
        position: 'relative',
        width: 'min(320px, 80vw)',
        height: 'clamp(130px,20vh,160px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Pinch bridge */}
        <div style={{
          position: 'absolute',
          width: '54%', height: 14,
          background: 'linear-gradient(to right, rgba(59,175,169,0.55), rgba(59,175,169,0.15), rgba(59,175,169,0.55))',
          borderRadius: 7,
          animation: 'cdd-sp-bridge 2.2s cubic-bezier(0.4,0,0.2,1) forwards',
          transformOrigin: 'center',
        }} />

        {/* Left daughter cell */}
        <div style={{
          position: 'absolute',
          left: 0,
          width: 'clamp(100px,22vw,130px)',
          height: 'clamp(100px,22vw,130px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 36% 34%, rgba(90,210,210,0.28), rgba(12,55,65,0.72))',
          border: '2.5px solid #3BAFA9',
          animation: 'cdd-sp-left 2.2s cubic-bezier(0.4,0,0.2,1) forwards, cdd-sp-pulse 2s ease-in-out infinite',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: '28%', height: '28%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 36% 32%, #D6E5F8, #5B8FD4)',
            boxShadow: '0 0 10px rgba(168,200,240,0.7)',
          }} />
        </div>

        {/* Right daughter cell */}
        <div style={{
          position: 'absolute',
          right: 0,
          width: 'clamp(100px,22vw,130px)',
          height: 'clamp(100px,22vw,130px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 36% 34%, rgba(90,210,210,0.28), rgba(12,55,65,0.72))',
          border: '2.5px solid #3BAFA9',
          animation: 'cdd-sp-right 2.2s cubic-bezier(0.4,0,0.2,1) forwards, cdd-sp-pulse 2s ease-in-out 0.4s infinite',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: '28%', height: '28%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 36% 32%, #D6E5F8, #5B8FD4)',
            boxShadow: '0 0 10px rgba(168,200,240,0.7)',
          }} />
        </div>
      </div>

      <div style={{
        marginTop: 32,
        fontSize: 'clamp(16px,3vw,24px)',
        fontWeight: 700,
        color: '#3BAFA9',
        letterSpacing: '0.14em',
        textShadow: '0 0 18px rgba(59,175,169,0.8)',
        animation: 'cdd-sp-title 2.2s ease-in-out forwards',
      }}>
        CELL DIVISION COMPLETE
      </div>

      <div style={{
        marginTop: 10,
        fontSize: 'clamp(10px,1.6vw,13px)',
        color: 'rgba(255,255,255,0.45)',
        letterSpacing: '0.12em',
        animation: 'cdd-sp-sub 2.2s ease-in-out forwards',
      }}>
        Two daughter cells successfully created
      </div>
    </div>
  );
}
