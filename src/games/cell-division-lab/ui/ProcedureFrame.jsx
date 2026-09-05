import { useCallback, useEffect, useRef, useState } from 'react';
import { PROCEDURES } from '../procedures';
import { MAX_ZOOM, MIN_ZOOM, StageZoomContext, clampZoom } from './stage-zoom';

const NUDGE_PX = 16;

// 1 is the framing every procedure is laid out for. Above it magnifies what
// you are handling; below it widens the window on the cell.
const DEFAULT_ZOOM = 1;
const ZOOM_BUTTON_STEP = 0.25;
const WHEEL_ZOOM_RATIO = 1.1;

// Chrome around a single procedure. The procedure itself owns the whole stage
// — it draws into the cell — so everything here floats over the cell rather
// than sitting in a panel on top of it.
export function ProcedureFrame({ phase, procedure, procedureProps, durationSec, paused, onComplete }) {
  const [secondsLeft, setSecondsLeft] = useState(durationSec);
  const [stars, setStars] = useState(3);
  const [status, setStatus] = useState({ hint: '', tone: 'info', submit: null });
  // The instruction sits under the readouts to begin with; from there it can be
  // dragged anywhere on the stage, so it never has to cover the part of the
  // cell it is talking about.
  const [hintOffset, setHintOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const frameRef = useRef(null);
  const hintRef = useRef(null);
  const dragRef = useRef(null);
  const pinchRef = useRef(null);
  const zoomRef = useRef(DEFAULT_ZOOM);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const remainingRef = useRef(durationSec);

  // Kept in a ref so the countdown effect does not restart when the parent
  // hands down a fresh callback identity.
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => {
      remainingRef.current = Math.max(0, remainingRef.current - 1);
      setSecondsLeft(remainingRef.current);
      if (remainingRef.current > 0) return;
      clearInterval(id);
      if (doneRef.current) return;
      doneRef.current = true;
      onCompleteRef.current({ stars: 0, timedOut: true });
    }, 1000);
    return () => clearInterval(id);
  }, [paused]);

  const handleStatus = useCallback((next) => setStatus(next), []);

  // Wheel and two-finger pinch, wired by hand because both have to be able to
  // preventDefault — React registers wheel and touch listeners as passive.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    function handleWheel(e) {
      e.preventDefault();
      setZoom((z) => clampZoom(e.deltaY > 0 ? z / WHEEL_ZOOM_RATIO : z * WHEEL_ZOOM_RATIO));
    }

    const spread = (touches) => Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY,
    );

    function handleTouchStart(e) {
      if (e.touches.length !== 2) return;
      pinchRef.current = { spread: spread(e.touches), zoom: zoomRef.current };
    }

    function handleTouchMove(e) {
      const pinch = pinchRef.current;
      if (!pinch || e.touches.length !== 2) return;
      e.preventDefault();
      setZoom(clampZoom(pinch.zoom * (spread(e.touches) / pinch.spread)));
    }

    function handleTouchEnd(e) {
      if (e.touches.length < 2) pinchRef.current = null;
    }

    frame.addEventListener('wheel', handleWheel, { passive: false });
    frame.addEventListener('touchstart', handleTouchStart, { passive: false });
    frame.addEventListener('touchmove', handleTouchMove, { passive: false });
    frame.addEventListener('touchend', handleTouchEnd);
    frame.addEventListener('touchcancel', handleTouchEnd);
    return () => {
      frame.removeEventListener('wheel', handleWheel);
      frame.removeEventListener('touchstart', handleTouchStart);
      frame.removeEventListener('touchmove', handleTouchMove);
      frame.removeEventListener('touchend', handleTouchEnd);
      frame.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  useEffect(() => { zoomRef.current = zoom; }, [zoom]);

  // Holds the instruction inside the stage however it is moved. Measured from
  // its layout position, which the drag transform leaves untouched.
  const clampOffset = useCallback((next) => {
    const hint = hintRef.current;
    const frame = hint?.offsetParent;
    if (!frame) return next;
    return {
      x: Math.min(Math.max(next.x, -hint.offsetLeft), frame.clientWidth - hint.offsetWidth - hint.offsetLeft),
      y: Math.min(Math.max(next.y, -hint.offsetTop), frame.clientHeight - hint.offsetHeight - hint.offsetTop),
    };
  }, []);

  function handleDragStart(e) {
    if (e.button > 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { pointerX: e.clientX, pointerY: e.clientY, ...hintOffset };
  }

  function handleDragMove(e) {
    const start = dragRef.current;
    if (!start) return;
    setHintOffset(clampOffset({
      x: start.x + (e.clientX - start.pointerX),
      y: start.y + (e.clientY - start.pointerY),
    }));
  }

  function handleDragEnd(e) {
    dragRef.current = null;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  }

  // Arrow keys move it too, so it is not a mouse-only affordance.
  function handleHintKeyDown(e) {
    const step = {
      ArrowUp: { x: 0, y: -NUDGE_PX },
      ArrowDown: { x: 0, y: NUDGE_PX },
      ArrowLeft: { x: -NUDGE_PX, y: 0 },
      ArrowRight: { x: NUDGE_PX, y: 0 },
    }[e.key];
    if (!step) return;
    e.preventDefault();
    setHintOffset((prev) => clampOffset({ x: prev.x + step.x, y: prev.y + step.y }));
  }

  function zoomBy(delta) {
    setZoom((z) => clampZoom(z + delta));
  }

  function handleComplete(result) {
    if (doneRef.current) return;
    doneRef.current = true;
    onCompleteRef.current({ stars: result?.stars ?? 0, ...result });
  }

  const Component = PROCEDURES[procedure];
  const pct = (secondsLeft / durationSec) * 100;
  const urgent = secondsLeft <= 5;
  const timerColor = urgent
    ? 'var(--cdl-bad)'
    : secondsLeft <= 12 ? 'var(--cdl-warn)' : 'var(--cdl-teal-deep)';

  return (
    <div className="cdl-proc" ref={frameRef}>
      <div className="cdl-proc__stage">
        <StageZoomContext.Provider value={zoom}>
          {Component
            ? (
              <Component
                {...procedureProps}
                onComplete={handleComplete}
                onStarsUpdate={setStars}
                onStatus={handleStatus}
              />
            )
            : <p className="cdl-hint cdl-hint--bad">No procedure registered for “{procedure}”.</p>}
        </StageZoomContext.Provider>
      </div>

      <div className="cdl-overlay">
        <div className="cdl-tag">
          <span className="cdl-eyebrow" style={{ color: phase.color }}>Procedure</span>
          <h2 className="cdl-title" style={{ fontSize: 17, lineHeight: 1.2 }}>{phase.displayName}</h2>
        </div>

        <div className="cdl-tag cdl-tag--row">
          <div className="cdl-stars" aria-label={`${stars} of 3 stars`}>
            {[1, 2, 3].map((n) => (
              <span key={n} aria-hidden="true" className={`cdl-star${stars >= n ? ' cdl-star--on' : ''}`}>★</span>
            ))}
          </div>
          <div className="cdl-timer">
            <span className="cdl-timer__num" style={{ color: timerColor }}>
              {String(secondsLeft).padStart(2, '0')}
            </span>
            <div className="cdl-timer__bar">
              <div className="cdl-timer__fill" style={{ width: `${pct}%`, background: timerColor }} />
            </div>
          </div>
          <span aria-live="polite" className="cdl-sr">{urgent ? `${secondsLeft} seconds remaining` : ''}</span>
        </div>
      </div>

      <div className="cdl-zoom" title="Scroll or pinch to zoom">
        <button
          type="button"
          className="cdl-icon-btn cdl-icon-btn--sm"
          onClick={() => zoomBy(ZOOM_BUTTON_STEP)}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          className="cdl-zoom__level cdl-mono"
          onClick={() => setZoom(DEFAULT_ZOOM)}
          aria-label={`Zoom ${Math.round(zoom * 100)} percent — reset to fit`}
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          className="cdl-icon-btn cdl-icon-btn--sm"
          onClick={() => zoomBy(-ZOOM_BUTTON_STEP)}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Zoom out"
        >
          −
        </button>
      </div>

      <div className="cdl-hint-layer">
        <div
          ref={hintRef}
          className="cdl-hint-dock"
          style={{ transform: `translate(${hintOffset.x}px, ${hintOffset.y}px)` }}
        >
          <p
            className={`cdl-hint cdl-hint--float cdl-hint--${status.tone ?? 'info'}`}
            aria-live="polite"
            tabIndex={0}
            title="Drag, or use the arrow keys, to move this out of the way"
            onPointerDown={handleDragStart}
            onPointerMove={handleDragMove}
            onPointerUp={handleDragEnd}
            onPointerCancel={handleDragEnd}
            onKeyDown={handleHintKeyDown}
          >
            {status.hint && <span className="cdl-hint__grip" aria-hidden="true">⠿</span>}
            {status.hint}
          </p>
          {status.submit && (
            <button type="button" className="cdl-btn" onClick={status.submit.onSubmit}>
              {status.submit.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
