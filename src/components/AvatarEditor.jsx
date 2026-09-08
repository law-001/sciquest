import { useRef, useState } from 'react';
import { Avatar, AvatarSticker } from './Avatar';
import { AVATARS } from '../lib/avatars';
import { AVATAR_BACKGROUNDS, AVATAR_STICKERS, MAX_STICKERS, constrainSticker, normalizeAvatarStyle } from '../lib/avatar-personalization';

const PREVIEW_SIZE = 224;
const CONTROL = 'min-h-11 rounded-xl border border-stone-300 dark:border-stone-600 px-3 py-2 text-sm font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-primary-500 disabled:opacity-40';
const CATEGORIES = [{ id: 'character', label: 'Characters' }, { id: 'svg', label: 'Science' }, { id: 'image', label: 'Pictures' }];

export function AvatarEditor({ avatarId, onAvatarChange, avatarStyle, onStyleChange, name }) {
  const [category, setCategory] = useState(AVATARS.find((a) => a.id === avatarId)?.kind ?? 'character');
  const [selectedId, setSelectedId] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const previewRef = useRef(null);
  const dragRef = useRef(null);
  const style = normalizeAvatarStyle(avatarStyle);
  const selected = style.stickers.find((s) => s.id === selectedId);
  const selectedLabel = AVATAR_STICKERS.find((s) => s.id === selected?.stickerId)?.label;
  const updateSticker = (id, patch) => onStyleChange({ ...style, stickers: style.stickers.map((s) => s.id === id ? constrainSticker({ ...s, ...patch }) : s) });

  function addSticker(stickerId) {
    if (style.stickers.length >= MAX_STICKERS) return;
    const id = crypto.randomUUID();
    const angle = style.stickers.length * Math.PI / 3;
    const sticker = { id, stickerId, x: 50 + Math.cos(angle) * 22, y: 50 + Math.sin(angle) * 22, size: 26, rotation: 0 };
    onStyleChange({ ...style, stickers: [...style.stickers, sticker] });
    setSelectedId(id);
    setAnnouncement('Sticker added. Drag it on the preview or use the position controls.');
  }

  function movePointer(event) {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const rect = previewRef.current.getBoundingClientRect();
    updateSticker(drag.id, { x: drag.x + (event.clientX - drag.clientX) / rect.width * 100, y: drag.y + (event.clientY - drag.clientY) / rect.height * 100 });
  }

  return <section aria-label="Personalize your profile picture" className="space-y-5">
    <div className="grid md:grid-cols-[248px_1fr] gap-6">
      <div className="sticky top-0 z-10 self-start bg-white dark:bg-stone-900 rounded-xl py-2 flex flex-col items-center gap-3">
        <div ref={previewRef} className="relative rounded-full" style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}>
          <Avatar avatarId={avatarId} avatarStyle={style} name={name} size={PREVIEW_SIZE} />
          {style.stickers.map((s, i) => <button key={s.id} type="button"
            aria-label={`Move ${AVATAR_STICKERS.find((item) => item.id === s.stickerId)?.label} sticker ${i + 1}. Use arrow keys to move.`}
            aria-pressed={s.id === selectedId}
            className={`absolute rounded-lg touch-none cursor-move focus-visible:outline-2 focus-visible:outline-primary-500 ${s.id === selectedId ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${s.size}%`, height: `${s.size}%`, transform: `translate(-50%, -50%) rotate(${s.rotation}deg)` }}
            onClick={() => setSelectedId(s.id)}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setSelectedId(s.id);
              dragRef.current = { id: s.id, pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY, x: s.x, y: s.y };
            }}
            onPointerMove={movePointer}
            onPointerUp={() => { dragRef.current = null; }}
            onPointerCancel={() => { dragRef.current = null; }}
            onKeyDown={(event) => {
              const movement = { ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -2], ArrowDown: [0, 2] }[event.key];
              if (!movement) return;
              event.preventDefault();
              updateSticker(s.id, { x: s.x + movement[0], y: s.y + movement[1] });
            }}><span className="sr-only">Sticker {i + 1}</span></button>)}
        </div>
        <p className="text-xs text-center text-stone-600 dark:text-stone-300">Your live preview. Drag stickers to move them.</p>
        <div className="flex items-center gap-3"><Avatar avatarId={avatarId} avatarStyle={style} name={name} size={36} /><span className="text-xs text-stone-500 dark:text-stone-400">How you’ll look beside your name</span></div>
      </div>

      <div className="min-w-0 space-y-3">
        <h3 className="font-bold text-stone-900 dark:text-white">1. Pick your picture</h3>
        <div className="flex flex-wrap gap-2" aria-label="Picture categories">
          {CATEGORIES.map((c) => <button type="button" key={c.id} aria-pressed={category === c.id} className={`${CONTROL} ${category === c.id ? 'ring-2 ring-primary-500' : ''}`} onClick={() => setCategory(c.id)}>{c.label}{category === c.id ? " (selected)" : ""}</button>)}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          <button type="button" aria-pressed={!avatarId} onClick={() => onAvatarChange(null)} className={`${CONTROL} flex flex-col items-center gap-1 px-1 ${!avatarId ? 'ring-2 ring-primary-500' : ''}`}><Avatar name={name} size={44} /><span className="text-xs">My initial{!avatarId ? " (selected)" : ""}</span></button>
          {AVATARS.filter((a) => a.kind === category).map((a) => <button type="button" key={a.id} aria-pressed={avatarId === a.id} onClick={() => onAvatarChange(a.id)} className={`${CONTROL} flex flex-col items-center gap-1 px-1 ${avatarId === a.id ? 'ring-2 ring-primary-500' : ''}`}><Avatar avatarId={a.id} size={44} /><span className="text-xs">{a.label}{avatarId === a.id ? " (selected)" : ""}</span></button>)}
        </div>
        <h3 className="font-bold text-stone-900 dark:text-white">2. Choose a background</h3>
        <div className="flex flex-wrap gap-2">
          {AVATAR_BACKGROUNDS.map((b) => <button type="button" key={b.id} aria-pressed={style.background === b.id} onClick={() => onStyleChange({ ...style, background: b.id })} className={`${CONTROL} flex items-center gap-2 ${style.background === b.id ? 'ring-2 ring-primary-500' : ''}`}><span className={`w-5 h-5 rounded-full ${b.className}`} aria-hidden="true" />{b.label}{style.background === b.id ? " (selected)" : ""}</button>)}
        </div>
        {category === 'image' && <p className="text-xs text-stone-600 dark:text-stone-300">Background colors frame your picture.</p>}

    <div className="border-t border-stone-200 dark:border-stone-700 pt-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold text-stone-900 dark:text-white">3. Make it yours with stickers</h3><span className="text-xs text-stone-600 dark:text-stone-300">{style.stickers.length} / {MAX_STICKERS} stickers</span></div>
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
        {AVATAR_STICKERS.map((s) => <button type="button" key={s.id} disabled={style.stickers.length >= MAX_STICKERS} onClick={() => addSticker(s.id)} className={`${CONTROL} flex flex-col items-center`} aria-label={`Add ${s.label} sticker`}><span className="w-9 h-9"><AvatarSticker stickerId={s.id} /></span><span className="text-xs">{s.label}</span></button>)}
      </div>
      {style.stickers.length >= MAX_STICKERS && <p className="text-sm text-stone-600 dark:text-stone-300">Your sticker space is full. Remove one to try another.</p>}
      {style.stickers.length > 0 && <div className="flex flex-wrap gap-2" aria-label="Select a sticker to edit">
        {style.stickers.map((s, i) => <button type="button" key={s.id} aria-pressed={s.id === selectedId} className={`${CONTROL} ${s.id === selectedId ? 'ring-2 ring-primary-500' : ''}`} onClick={() => setSelectedId(s.id)}>{AVATAR_STICKERS.find((item) => item.id === s.stickerId)?.label} {i + 1}</button>)}
      </div>}
      {selected && <div className="rounded-xl bg-stone-100 dark:bg-stone-800 p-4 space-y-3">
        <p className="text-sm font-bold text-stone-900 dark:text-white">Editing {selectedLabel}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[['size', 'Size', 20, 38], ['rotation', 'Rotation', -180, 180], ['x', 'Left / right', 0, 100], ['y', 'Up / down', 0, 100]].map(([key, label, min, max]) => <label key={key} className="text-xs font-bold text-stone-700 dark:text-stone-200">{label}: {Math.round(selected[key])}{key === 'rotation' ? '°' : '%'}<input aria-label={`${selectedLabel} ${label}`} type="range" min={min} max={max} step="1" value={selected[key]} onChange={(e) => updateSticker(selected.id, { [key]: Number(e.target.value) })} className="block w-full h-11 accent-orange-500" /></label>)}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={CONTROL} onClick={() => onStyleChange({ ...style, stickers: [...style.stickers.filter((s) => s.id !== selectedId), selected] })}>Bring to front</button>
          <button type="button" className={CONTROL} onClick={() => { onStyleChange({ ...style, stickers: style.stickers.filter((s) => s.id !== selectedId) }); setSelectedId(null); setAnnouncement('Sticker removed.'); }}>Remove sticker</button>
        </div>
      </div>}
      <div className="flex flex-wrap items-center gap-3"><button type="button" className={CONTROL} disabled={!style.stickers.length} onClick={() => { onStyleChange({ ...style, stickers: [] }); setSelectedId(null); setAnnouncement('All stickers removed.'); }}>Clear stickers</button><p className="text-xs text-stone-600 dark:text-stone-300">Nothing changes on your profile until you save.</p></div>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    </div>
      </div>
    </div>
  </section>;
}
