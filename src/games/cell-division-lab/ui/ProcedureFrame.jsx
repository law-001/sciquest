import { useEffect, useRef, useState } from 'react';
import { PROCEDURES } from '../procedures';
import {
  DEFAULT_STAGE_VIEW, MAX_ZOOM, MIN_ZOOM, StageViewContext,
  clampStageView, clampZoom, stageUnitsPerPixel, zoomAt,
} from './stage-zoom';

// DEFAULT_STAGE_VIEW is the framing every procedure is laid out for. Zooming
// above it magnifies what you are handling; below it widens the window on the
// cell. On a phone the stage is drawn small enough that zooming in is the
// normal way to work, so the zoom carries a pan with it.
const ZOOM_BUTTON_STEP = 0.25;
const WHEEL_ZOOM_RATIO = 1.1;
// A trackpad pinch arrives as a ctrl-held wheel with a fine-grained delta, so
// it gets a continuous curve rather than the notch a mouse wheel wants.
const TRACKPAD_PINCH_DIVISOR = 100;

// Chrome around a single procedure. The procedure itself owns the whole stage
// — it draws into the cell — so the only things floating over the cell are the
// readouts. The instruction is the notebook's, not the stage's.
export function ProcedureFrame({
  phase, procedure, procedureProps, durationSec, paused, onStatus, onComplete,
}) {
  const [secondsLeft, setSecondsLeft] = useState(durationSec);
  const [stars, setStars] = useState(3);
  const [view, setView] = useState(DEFAULT_STAGE_VIEW);

  const frameRef = useRef(null);
  const pinchRef = useRef(null);
  const viewRef = useRef(DEFAULT_STAGE_VIEW);
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

  // Wheel and two-finger pinch, wired by hand because both have to be able to
  // preventDefault — React registers wheel and touch listeners as passive.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    function handleWheel(e) {
      e.preventDefault();
      const factor = e.ctrlKey
        ? Math.exp(-e.deltaY / TRACKPAD_PINCH_DIVISOR)
        : e.deltaY > 0 ? 1 / WHEEL_ZOOM_RATIO : WHEEL_ZOOM_RATIO;
      setView((v) => zoomAt(frame, v, v.zoom * factor, { x: e.clientX, y: e.clientY }));
    }

    const spread = (touches) => Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY,
    );

    const midpoint = (touches) => ({
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    });

    function handleTouchStart(e) {
      if (e.touches.length !== 2) return;
      pinchRef.current = {
        spread: spread(e.touches),
        mid: midpoint(e.touches),
        view: viewRef.current,
      };
    }

    // Two fingers zoom and pan in one gesture: the spread magnifies about the
    // point the pinch started on, and the midpoint then drags that point
    // wherever the fingers take it.
    function handleTouchMove(e) {
      const pinch = pinchRef.current;
      if (!pinch || e.touches.length !== 2) return;
      e.preventDefault();

      const zoomed = zoomAt(
        frame,
        pinch.view,
        pinch.view.zoom * (spread(e.touches) / pinch.spread),
        pinch.mid,
      );
      const mid = midpoint(e.touches);
      const units = stageUnitsPerPixel(frame, zoomed.zoom);
      setView(clampStageView({
        zoom: zoomed.zoom,
        panX: zoomed.panX - (mid.x - pinch.mid.x) * units,
        panY: zoomed.panY - (mid.y - pinch.mid.y) * units,
      }));
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

  useEffect(() => { viewRef.current = view; }, [view]);

  // The buttons have no pointer to zoom about, so they use the middle of the
  // frame — which is what the reader is looking at.
  function zoomBy(delta) {
    const frame = frameRef.current;
    const box = frame?.getBoundingClientRect();
    const centre = box
      ? { x: box.left + box.width / 2, y: box.top + box.height / 2 }
      : { x: 0, y: 0 };
    setView((v) => zoomAt(frame, v, clampZoom(v.zoom + delta), centre));
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
        <StageViewContext.Provider value={view}>
          {Component
            ? (
              <Component
                {...procedureProps}
                onComplete={handleComplete}
                onStarsUpdate={setStars}
                onStatus={onStatus}
              />
            )
            : <p className="cdl-hint cdl-hint--bad">No procedure registered for “{procedure}”.</p>}
        </StageViewContext.Provider>
      </div>

      <div className="cdl-overlay">
        <div className="cdl-tag">
          <span className="cdl-eyebrow" style={{ color: phase.color }}>Step</span>
          <h2 className="cdl-title cdl-tag__title">{phase.displayName}</h2>
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

      <div className="cdl-zoom" title="Scroll or pinch to zoom — two fingers also pan">
        <button
          type="button"
          className="cdl-icon-btn cdl-icon-btn--sm"
          onClick={() => zoomBy(ZOOM_BUTTON_STEP)}
          disabled={view.zoom >= MAX_ZOOM}
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          className="cdl-zoom__level cdl-mono"
          onClick={() => setView(DEFAULT_STAGE_VIEW)}
          aria-label={`Zoom ${Math.round(view.zoom * 100)} percent — reset to fit`}
        >
          {Math.round(view.zoom * 100)}%
        </button>
        <button
          type="button"
          className="cdl-icon-btn cdl-icon-btn--sm"
          onClick={() => zoomBy(-ZOOM_BUTTON_STEP)}
          disabled={view.zoom <= MIN_ZOOM}
          aria-label="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  );
}
