import { useRef, useState } from 'react';
import { Check, Image as ImageIcon, Maximize2, MoveHorizontal, MoveVertical, RotateCw, Smile, Sparkles, X } from 'lucide-react';
import { Avatar, AvatarBackgroundPreview, AvatarSticker } from './Avatar';
import { CHARACTER_AVATARS } from '../lib/avatars';
import { AVATAR_BACKGROUNDS, AVATAR_STICKERS, MAX_STICKERS, STICKER_MAX, STICKER_MIN, constrainSticker, normalizeAvatarStyle, wrapDegrees } from '../lib/avatar-personalization';

const PREVIEW_SIZE = 208;
const CONTROL = 'min-h-11 rounded-xl border border-stone-300 dark:border-stone-600 px-3 py-2 text-sm font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-primary-500 disabled:opacity-40';
const TILE = 'relative min-h-11 flex flex-col items-center gap-1.5 rounded-xl border p-2 text-xs font-bold text-stone-700 dark:text-stone-200 focus-visible:outline-2 focus-visible:outline-primary-500';
const TILE_ON = 'border-primary-500 bg-primary-50 dark:bg-primary-500/15 text-stone-900 dark:text-white';
const TILE_OFF = 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800';

// On desktop the active panel is the scroll container, so the tab bar and the
// preview never move. Stacked on mobile it grows and the modal body scrolls.
const PANEL = 'space-y-3 md:flex-1 md:min-h-0 md:overflow-y-auto md:overflow-x-hidden md:pr-1 focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2 rounded-lg';

const HANDLE = 'absolute w-6 h-6 grid place-items-center rounded-full bg-primary-500 text-white border-2 border-white shadow-md touch-none focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2';

const TABS = [
  { id: 'character', label: 'Character', Icon: Smile },
  { id: 'background', label: 'Background', Icon: ImageIcon },
  { id: 'stickers', label: 'Stickers', Icon: Sparkles },
];

// One tile shape for characters, backgrounds and stickers so the three panels
// read as the same control. Selection is shown by border, tint and a check
// badge — never by colour alone.
function Tile({ isSelected, label, onClick, children, ...props }) {
  return <button type="button" aria-pressed={isSelected} onClick={onClick}
    className={`${TILE} ${isSelected ? TILE_ON : TILE_OFF}`} {...props}>
    {children}
    <span className="leading-tight text-center">{label}</span>
    {isSelected && <>
      <span aria-hidden="true" className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary-500 text-white grid place-items-center"><Check className="w-3 h-3" strokeWidth={3} /></span>
      <span className="sr-only">(selected)</span>
    </>}
  </button>;
}

export function AvatarEditor({ avatarId, onAvatarChange, avatarStyle, onStyleChange, name }) {
  const [tab, setTab] = useState('character');
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
    const sticker = { id, stickerId, x: 50 + Math.cos(angle) * 22, y: 50 + Math.sin(angle) * 22, width: 26, height: 26, rotation: 0 };
    onStyleChange({ ...style, stickers: [...style.stickers, sticker] });
    setSelectedId(id);
    setAnnouncement('Sticker added. Drag it on the preview, or use the handles around it to resize, stretch and rotate.');
  }

  // One pointer handler for every grab on a sticker. Stretching projects the
  // pointer onto the sticker's own axes, so a rotated sticker still widens
  // along the direction the handle is pointing rather than along the screen.
  function startDrag(event, sticker, mode) {
    if (!event.isPrimary || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedId(sticker.id);
    setTab('stickers');
    dragRef.current = { mode, id: sticker.id, pointerId: event.pointerId, clientX: event.clientX, clientY: event.clientY, start: sticker };
  }

  function handleDrag(event) {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const rect = previewRef.current.getBoundingClientRect();
    const start = drag.start;

    if (drag.mode === 'move') {
      updateSticker(drag.id, {
        x: start.x + (event.clientX - drag.clientX) / rect.width * 100,
        y: start.y + (event.clientY - drag.clientY) / rect.height * 100,
      });
      return;
    }

    const dx = (event.clientX - rect.left) / rect.width * 100 - start.x;
    const dy = (event.clientY - rect.top) / rect.height * 100 - start.y;
    const initialX = (drag.clientX - rect.left) / rect.width * 100 - start.x;
    const initialY = (drag.clientY - rect.top) / rect.height * 100 - start.y;
    if (drag.mode === 'rotate') {
      updateSticker(drag.id, { rotation: wrapDegrees(start.rotation + (Math.atan2(dy, dx) - Math.atan2(initialY, initialX)) * 180 / Math.PI) });
      return;
    }

    const radians = -start.rotation * Math.PI / 180;
    const localX = dx * Math.cos(radians) - dy * Math.sin(radians);
    const localY = dx * Math.sin(radians) + dy * Math.cos(radians);
    const initialLocalX = initialX * Math.cos(radians) - initialY * Math.sin(radians);
    const initialLocalY = initialX * Math.sin(radians) + initialY * Math.cos(radians);
    if (drag.mode === 'width') updateSticker(drag.id, { width: start.width + (localX - initialLocalX) * 2 });
    else if (drag.mode === 'height') updateSticker(drag.id, { height: start.height + (localY - initialLocalY) * 2 });
    else if (drag.mode === 'zoom') {
      const ratio = Math.min(STICKER_MAX / Math.max(start.width, start.height), Math.max(STICKER_MIN / Math.min(start.width, start.height), Math.hypot(localX, localY) / Math.max(0.001, Math.hypot(initialLocalX, initialLocalY))));
      updateSticker(drag.id, { width: start.width * ratio, height: start.height * ratio });
    }
  }

  const endDrag = () => { dragRef.current = null; };

  function removeSticker(id) {
    onStyleChange({ ...style, stickers: style.stickers.filter((s) => s.id !== id) });
    setSelectedId(null);
    setAnnouncement('Sticker removed.');
  }

  function moveTabFocus(event) {
    const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = TABS[(TABS.findIndex((t) => t.id === tab) + step + TABS.length) % TABS.length];
    setTab(next.id);
    event.currentTarget.parentElement.querySelector(`#avatar-tab-${next.id}`)?.focus();
  }

  return <section aria-label="Personalize your profile picture" className="grid md:grid-cols-[228px_1fr] gap-6 md:h-full md:min-h-0">
    <div className="self-start flex flex-col items-center gap-3">
      <div ref={previewRef} className="relative rounded-full" style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}>
        <Avatar avatarId={avatarId} avatarStyle={style} name={name} size={PREVIEW_SIZE} />
        {style.stickers.map((s, i) => {
          const label = `${AVATAR_STICKERS.find((item) => item.id === s.stickerId)?.label} sticker ${i + 1}`;
          const isActive = s.id === selectedId;
          // The frame sits exactly where <Avatar> paints the sticker, so the
          // handles rotate with the art instead of staying screen-aligned.
          return <div key={s.id} className="absolute" style={{ zIndex: isActive ? MAX_STICKERS + 1 : i + 1, left: `${s.x}%`, top: `${s.y}%`, width: `${s.width}%`, height: `${s.height}%`, transform: `translate(-50%, -50%) rotate(${s.rotation}deg)` }}>
            <button type="button"
              aria-label={`${label}. Drag to move, or use arrow keys.`}
              aria-pressed={isActive}
              className={`absolute inset-0 rounded-md touch-none cursor-move focus-visible:outline-2 focus-visible:outline-primary-500 ${isActive ? 'outline-2 outline-dashed outline-primary-500' : ''}`}
              onClick={() => { setSelectedId(s.id); setTab('stickers'); }}
              onPointerDown={(event) => startDrag(event, s, 'move')}
              onPointerMove={handleDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onLostPointerCapture={endDrag}
              onKeyDown={(event) => {
                const movement = { ArrowLeft: [-2, 0], ArrowRight: [2, 0], ArrowUp: [0, -2], ArrowDown: [0, 2] }[event.key];
                if (!movement) return;
                event.preventDefault();
                updateSticker(s.id, { x: s.x + movement[0], y: s.y + movement[1] });
              }}><span className="sr-only">Sticker {i + 1}</span></button>

            {isActive && [
              { mode: 'rotate', Icon: RotateCw, title: 'Rotate', cursor: 'cursor-grab', position: 'left-1/2 -top-8 -translate-x-1/2' },
              { mode: 'width', Icon: MoveHorizontal, title: 'Stretch sideways', cursor: 'cursor-ew-resize', position: '-right-3 top-1/2 -translate-y-1/2' },
              { mode: 'height', Icon: MoveVertical, title: 'Stretch up and down', cursor: 'cursor-ns-resize', position: 'left-1/2 -bottom-3 -translate-x-1/2' },
              { mode: 'zoom', Icon: Maximize2, title: 'Zoom', cursor: 'cursor-nwse-resize', position: '-right-3 -bottom-3' },
            ].map(({ mode, Icon, title, cursor, position }) => <button type="button" key={mode}
              aria-label={`${title} ${label}`} title={title}
              className={`${HANDLE} ${position} ${cursor}`}
              onPointerDown={(event) => startDrag(event, s, mode)}
              onPointerMove={handleDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onLostPointerCapture={endDrag}><Icon className="w-3.5 h-3.5" aria-hidden="true" /></button>)}

            {isActive && <button type="button" title="Remove"
              aria-label={`Remove ${label}`}
              className={`${HANDLE} -left-3 -top-3 bg-rose-500`}
              onClick={() => removeSticker(s.id)}><X className="w-3.5 h-3.5" strokeWidth={3} aria-hidden="true" /></button>}
          </div>;
        })}
      </div>
      <p className="text-xs text-center text-stone-600 dark:text-stone-300">Live preview{style.stickers.length ? ' — drag stickers to move them' : ''}</p>
      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400"><Avatar avatarId={avatarId} avatarStyle={style} name={name} size={32} />Beside your name</div>
    </div>

    <div className="min-w-0 flex flex-col gap-4 md:min-h-0">
      <div role="tablist" aria-label="What to change" className="shrink-0 flex gap-1 p-1 rounded-xl bg-stone-100 dark:bg-stone-800">
        {TABS.map(({ id, label, Icon }) => <button type="button" key={id} role="tab" id={`avatar-tab-${id}`}
          aria-selected={tab === id} aria-controls={`avatar-panel-${id}`} tabIndex={tab === id ? 0 : -1}
          onClick={() => setTab(id)} onKeyDown={moveTabFocus}
          className={`flex-1 min-h-11 flex items-center justify-center gap-2 rounded-lg px-2 text-sm font-bold focus-visible:outline-2 focus-visible:outline-primary-500 ${tab === id ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-sm' : 'text-stone-600 dark:text-stone-300'}`}>
          <Icon className="w-4 h-4" aria-hidden="true" />{label}
          {id === 'stickers' && style.stickers.length > 0 && <span className="rounded-full bg-primary-500 text-white px-1.5 text-xs">{style.stickers.length}</span>}
        </button>)}
      </div>

      {tab === 'character' && <div role="tabpanel" id="avatar-panel-character" aria-labelledby="avatar-tab-character" tabIndex={0} className={PANEL}>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          <Tile isSelected={!avatarId} label="My initial" onClick={() => onAvatarChange(null)}><Avatar name={name} avatarStyle={style} size={56} /></Tile>
          {CHARACTER_AVATARS.map((a) => <Tile key={a.id} isSelected={avatarId === a.id} label={a.label} onClick={() => onAvatarChange(a.id)}>
            <Avatar avatarId={a.id} avatarStyle={style} size={56} />
          </Tile>)}
        </div>
      </div>}

      {tab === 'background' && <div role="tabpanel" id="avatar-panel-background" aria-labelledby="avatar-tab-background" tabIndex={0} className={PANEL}>
        <p className="text-xs text-stone-600 dark:text-stone-300">Any character works with any background.</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {AVATAR_BACKGROUNDS.map((b) => <Tile key={b.id} isSelected={style.background === b.id} label={b.label} onClick={() => onStyleChange({ ...style, background: b.id })}>
            <AvatarBackgroundPreview background={b} className="w-14 h-14" />
          </Tile>)}
        </div>
      </div>}

      {tab === 'stickers' && <div role="tabpanel" id="avatar-panel-stickers" aria-labelledby="avatar-tab-stickers" tabIndex={0} className={PANEL}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-stone-600 dark:text-stone-300">Tap to add. Then drag it on the preview, or use the handles around it.</p>
          <span className="text-xs font-bold text-stone-600 dark:text-stone-300">{style.stickers.length} / {MAX_STICKERS}</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {/* Adding a sticker is an action, not a selection, so these are plain
              buttons rather than the pressed-state Tile used elsewhere. */}
          {AVATAR_STICKERS.map((s) => <button type="button" key={s.id} onClick={() => addSticker(s.id)}
            disabled={style.stickers.length >= MAX_STICKERS} aria-label={`Add ${s.label} sticker`}
            className={`${TILE} ${TILE_OFF} disabled:opacity-40`}>
            <span className="w-9 h-9" aria-hidden="true"><AvatarSticker stickerId={s.id} /></span>
            <span className="leading-tight text-center">{s.label}</span>
          </button>)}
        </div>
        {style.stickers.length >= MAX_STICKERS && <p className="text-sm text-stone-600 dark:text-stone-300">Your sticker space is full. Remove one to try another.</p>}

        {style.stickers.length > 0 && <div className="space-y-3 border-t border-stone-200 dark:border-stone-700 pt-3">
          <div className="flex flex-wrap gap-2" aria-label="Select a sticker to edit">
            {style.stickers.map((s, i) => <button type="button" key={s.id} aria-pressed={s.id === selectedId} onClick={() => setSelectedId(s.id)}
              className={`${CONTROL} flex items-center gap-2 ${s.id === selectedId ? 'ring-2 ring-primary-500' : ''}`}>
              <span className="w-5 h-5" aria-hidden="true"><AvatarSticker stickerId={s.stickerId} /></span>
              {AVATAR_STICKERS.find((item) => item.id === s.stickerId)?.label} {i + 1}
            </button>)}
          </div>
          {selected && <div className="rounded-xl bg-stone-100 dark:bg-stone-800 p-4 space-y-3">
            <p className="text-sm font-bold text-stone-900 dark:text-white">Editing {selectedLabel}</p>
            <p className="text-xs text-stone-600 dark:text-stone-300">On the preview: drag the middle to move, the round handles to rotate, stretch or zoom, and the red X to remove.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[['width', 'Width', STICKER_MIN, STICKER_MAX], ['height', 'Height', STICKER_MIN, STICKER_MAX], ['rotation', 'Rotation', -180, 180], ['x', 'Left / right', 0, 100], ['y', 'Up / down', 0, 100]].map(([key, label, min, max]) => <label key={key} className="text-xs font-bold text-stone-700 dark:text-stone-200">{label}: {Math.round(selected[key])}{key === 'rotation' ? '°' : '%'}<input aria-label={`${selectedLabel} ${label}`} type="range" min={min} max={max} step="1" value={selected[key]} onChange={(e) => updateSticker(selected.id, { [key]: Number(e.target.value) })} className="block w-full h-11 accent-orange-500" /></label>)}
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={CONTROL} onClick={() => onStyleChange({ ...style, stickers: [...style.stickers.filter((s) => s.id !== selectedId), selected] })}>Bring to front</button>
              <button type="button" className={CONTROL} onClick={() => removeSticker(selectedId)}>Remove sticker</button>
            </div>
          </div>}
          <button type="button" className={CONTROL} onClick={() => { onStyleChange({ ...style, stickers: [] }); setSelectedId(null); setAnnouncement('All stickers removed.'); }}>Clear all stickers</button>
        </div>}
      </div>}

      <p className="shrink-0 text-xs text-stone-500 dark:text-stone-400">Nothing changes on your profile until you save.</p>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
    </div>
  </section>;
}
