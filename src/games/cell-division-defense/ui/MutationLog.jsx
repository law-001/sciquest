import { useEffect, useState } from 'react';
import { MUTATIONS } from '../data/mutations';

const MONO = '"Courier New", Courier, monospace';

export function MutationLog({ mutations }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setPulse(p => !p), 1200);
    return () => clearInterval(id);
  }, []);

  if (!mutations || mutations.length === 0) return null;

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.65)',
        border: '1px solid rgba(239,68,68,0.35)',
        borderRadius: 10,
        padding: 10,
        fontFamily: MONO,
        width: '100%',
      }}
    >
      <div style={{ color: '#EF4444', fontSize: 10, letterSpacing: '0.12em', marginBottom: 6 }}>
        ⚠ MUTATIONS
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {mutations.slice(0, 4).map((m, i) => {
          const def = typeof m === 'string' ? (MUTATIONS[m] ?? { name: m }) : m;
          return (
            <div
              key={i}
              title={def.biologyNote}
              style={{
                background: 'rgba(127,0,0,0.7)',
                border: '1px solid #EF4444',
                borderRadius: 999,
                padding: '3px 8px',
                fontSize: 9,
                color: '#ffffff',
                fontFamily: MONO,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                boxShadow: pulse ? '0 0 8px #EF4444' : 'none',
                transition: 'box-shadow 0.3s',
              }}
            >
              {def.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
