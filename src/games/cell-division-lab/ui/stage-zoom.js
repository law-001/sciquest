import { createContext, useContext } from 'react';

import { STAGE_H, STAGE_W } from '../render/cellGeometry';

// How much of the stage a procedure's <svg> shows, and where that window sits
// over it. Both are applied to the viewBox rather than as a CSS transform on
// the element, so zooming out widens the window on the cell instead of
// shrinking a rectangular crop of it — and getScreenCTM keeps every
// procedure's pointer maths correct without either of them knowing.
//
// baseW is how much of the stage's width the window shows at zoom 1. On a wide
// frame it is the whole stage; on a narrow (portrait phone) frame it closes in
// on the cell instead, so the cell fills the frame rather than being drawn
// across its width with empty bands above and below. Every procedure keeps
// its play inside the cell, and the rest of the stage is a pan away.
export const DEFAULT_STAGE_VIEW = { zoom: 1, panX: 0, panY: 0, baseW: STAGE_W };

// The cell's diameter (504) plus a little breathing room on each side.
const FOCUS_W = 560;

export const StageViewContext = createContext(DEFAULT_STAGE_VIEW);

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 2.5;

export function clampZoom(zoom) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

// Panning only has anywhere to go once part of the stage is outside the window
// (zoomed in, or a narrow frame closing in on the cell), so the offset is
// capped at the strip left outside. When the whole stage fits that strip is
// empty and the pan snaps back to centre, which is what makes zooming back out
// reset the framing for free.
export function clampStageView({ zoom, panX, panY, baseW = STAGE_W }) {
  const { limitX, limitY } = panLimits({ zoom, baseW });
  return {
    zoom,
    baseW,
    panX: Math.min(limitX, Math.max(-limitX, panX)),
    panY: Math.min(limitY, Math.max(-limitY, panY)),
  };
}

export function canPanStageView(view) {
  const { limitX, limitY } = panLimits(view);
  return limitX > 0 || limitY > 0;
}

// The window's width at zoom 1 for a frame of this shape: as wide as the
// frame's aspect asks for, but never narrower than the cell nor wider than
// the stage.
export function baseWidthFor(frameW, frameH) {
  if (!(frameW > 0 && frameH > 0)) return STAGE_W;
  return Math.min(STAGE_W, Math.max(FOCUS_W, (STAGE_H * frameW) / frameH));
}

// The part of the stage the window shows, in stage units.
export function stageWindow({ zoom, baseW = STAGE_W }) {
  return { w: baseW / zoom, h: STAGE_H / zoom };
}

function panLimits(view) {
  const { w, h } = stageWindow(view);
  return {
    limitX: Math.max(0, (STAGE_W - w) / 2),
    limitY: Math.max(0, (STAGE_H - h) / 2),
  };
}

// Where the stage is actually painted inside the frame at a given zoom.
// preserveAspectRatio is "xMidYMid meet", so the smaller of the two ratios is
// the scale and whatever is left over is split evenly as letterboxing.
function paintedStage(frame, view) {
  const { w, h } = stageWindow(view);
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
export function stageUnitsPerPixel(frame, view) {
  if (!frame) return 0;
  const { scale } = paintedStage(frame, view);
  return scale > 0 ? 1 / scale : 0;
}

// Zoom about a fixed point: whatever is under `client` before the change is
// still under it after. That is what makes a pinch feel like it is stretching
// the cell rather than swapping the framing out from under two fingers.
export function zoomAt(frame, view, nextZoom, client) {
  const zoom = clampZoom(nextZoom);
  if (!frame) return clampStageView({ ...view, zoom });

  const from = paintedStage(frame, view);
  if (!(from.scale > 0)) return clampStageView({ ...view, zoom });
  const anchorX = (STAGE_W - from.w) / 2 + view.panX + (client.x - from.left) / from.scale;
  const anchorY = (STAGE_H - from.h) / 2 + view.panY + (client.y - from.top) / from.scale;

  const to = paintedStage(frame, { ...view, zoom });
  return clampStageView({
    zoom,
    baseW: view.baseW,
    panX: anchorX - (client.x - to.left) / to.scale - (STAGE_W - to.w) / 2,
    panY: anchorY - (client.y - to.top) / to.scale - (STAGE_H - to.h) / 2,
  });
}

export function useStageView() {
  return useContext(StageViewContext);
}
