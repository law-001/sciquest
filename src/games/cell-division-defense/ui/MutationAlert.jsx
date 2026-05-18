import { useEffect } from 'react';

const MONO = '"Courier New", Courier, monospace';

export function MutationAlert({ mutation, onDismiss }) {
  useEffect(() => {
    if (!mutation) return;
    const id = setTimeout(onDismiss, 3000);
    return () => clearTimeout(id);
  }, [mutation, onDismiss]);

  if (!mutation) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'absolute',
        top: 64,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 25,
        background: 'rgba(127,0,0,0.92)',
        border: '1.5px solid #EF4444',
        borderRadius: 8,
        padding: '12px 20px',
        fontFamily: MONO,
        maxWidth: 320,
        textAlign: 'center',
        boxShadow: '0 0 24px rgba(239,68,68,0.4)',
        pointerEvents: 'none',
      }}
    >
      <div style={{ color: '#ffffff', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
        ⚠ {mutation.name}
      </div>
      {mutation.biologyNote && (
        <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, fontStyle: 'italic', lineHeight: 1.5 }}>
          {mutation.biologyNote}
        </div>
      )}
    </div>
  );
}
