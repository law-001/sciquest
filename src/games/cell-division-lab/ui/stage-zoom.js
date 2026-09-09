import { createContext, useContext } from 'react';

import { STAGE_H, STAGE_W } from '../render/cellGeometry';

// How much of the stage a procedure's <svg> shows, and where that window sits
// over it. Both are applied to the viewBox rather than as a CSS transform on
// the element, so zooming out widens the window on the cell instead of
// shrinking a rectangular crop of it — and getScreenCTM keeps every
// procedure's pointer maths correct without either of them knowing.
export const DEFAULT_STAGE_VIEW = { zoom: 1, panX: 0, panY: 0 };

export const StageViewContext = createContext(DEFAULT_STAGE_VIEW);

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 2.5;

export function clampZoom(zoom) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

// Panning only has anywhere to go once the zoom has pushed part of the stage
// outside the window, so the offset is capped at the strip it pushed out. At
// or below the fitted framing that strip is empty and the pan snaps back to
// centre, which is what makes zooming back out reset the framing for free.
export function clampStageView({ zoom, panX, panY }) {
  const limitX = Math.max(0, (STAGE_W - STAGE_W / zoom) / 2);
  const limitY = Math.max(0, (STAGE_H - STAGE_H / zoom) / 2);
  return {
    zoom,
    panX: Math.min(limitX, Math.max(-limitX, panX)),
    panY: Math.min(limitY, Math.max(-limitY, panY)),
  };
}

// Where the stage is actually painted inside the frame at a given zoom.
// preserveAspectRatio is "xMidYMid meet", so the smaller of the two ratios is
// the scale and whatever is left over is split evenly as letterboxing.
function paintedStage(frame, zoom) {
  const w = STAGE_W / zoom;
  const h = STAGE_H / zoom;
  const box = frame.getBoundingClientRect();
  const scale = Math.min(box.width / w, box.height / h);
  return {
    w,
    h,
    scale,
    left: box.left + (box.width - w * scale) / 2,
    top: box.top + (box.height - h * scale) / 2,
  };
}

// Stage units per screen pixel, for turning a drag in pointer space into a pan
// in stage space.
export function stageUnitsPerPixel(frame, zoom) {
  if (!frame) return 0;
  const { scale } = paintedStage(frame, zoom);
  return scale > 0 ? 1 / scale : 0;
}

// Zoom about a fixed point: whatever is under `client` before the change is
// still under it after. That is what makes a pinch feel like it is stretching
// the cell rather than swapping the framing out from under two fingers.
export function zoomAt(frame, view, nextZoom, client) {
  const zoom = clampZoom(nextZoom);
  if (!frame) return clampStageView({ ...view, zoom });

  const from = paintedStage(frame, view.zoom);
  if (!(from.scale > 0)) return clampStageView({ ...view, zoom });
  const anchorX = (STAGE_W - from.w) / 2 + view.panX + (client.x - from.left) / from.scale;
  const anchorY = (STAGE_H - from.h) / 2 + view.panY + (client.y - from.top) / from.scale;

  const to = paintedStage(frame, zoom);
  return clampStageView({
    zoom,
    panX: anchorX - (client.x - to.left) / to.scale - (STAGE_W - to.w) / 2,
    panY: anchorY - (client.y - to.top) / to.scale - (STAGE_H - to.h) / 2,
  });
}

export function useStageView() {
  return useContext(StageViewContext);
}
