import { useEffect, useRef } from 'react';

export function SuccessModal({ challenge, onClose, onNextChallenge, nextChallenge }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current?.querySelector('button')?.focus();
  }, []);

  function handleKeyDown(e) {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab') return;
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])') ?? [],
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(43,36,23,0.4)', zIndex: 100, display: 'grid', placeItems: 'center', padding: 24, backdropFilter: 'blur(2px)' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="success-heading"
    >
      <div
        ref={dialogRef}
        style={{ background: 'var(--sq-surface)', borderRadius: 'var(--sq-radius-lg)', padding: 28, maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.22)', display: 'flex', flexDirection: 'column', gap: 16 }}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div>
          <p id="success-heading" style={{ fontFamily: 'var(--sq-font-display)', fontSize: 22, fontWeight: 700, color: 'var(--sq-orange)', margin: '0 0 4px' }}>
            Challenge Complete!
          </p>
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--sq-ink-1)', margin: 0 }}>{challenge.title}</p>
        </div>

        {challenge.educationalNote && (
          <div style={{ background: 'var(--sq-teal-soft)', border: '1.5px solid rgba(29,133,128,0.25)', borderRadius: 'var(--sq-radius)', padding: '12px 14px' }}>
            <p style={{ fontSize: 13, color: 'var(--sq-teal-deep)', lineHeight: 1.55, margin: 0 }}>{challenge.educationalNote}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '10px 0', borderRadius: 999, border: 'var(--sq-border-strong)', background: 'var(--sq-surface)', color: 'var(--sq-ink-2)', fontWeight: 600, fontSize: 14, cursor: 'pointer', minHeight: 44, transition: 'background 0.15s' }}
            onMouseOver={e => { e.currentTarget.style.background = 'var(--sq-cream-1)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'var(--sq-surface)'; }}
          >
            Keep Exploring
          </button>
          {nextChallenge && (
            <button
              onClick={onNextChallenge}
              style={{ flex: 1, padding: '10px 0', borderRadius: 999, border: '1.5px solid var(--sq-orange-deep)', background: 'var(--sq-orange)', color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer', minHeight: 44, transition: 'opacity 0.15s' }}
              onMouseOver={e => { e.currentTarget.style.opacity = '0.88'; }}
              onMouseOut={e => { e.currentTarget.style.opacity = '1'; }}
            >
              Next Challenge →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
