import { createContext, useContext } from 'react';

// How much of the stage a procedure's <svg> shows. The zoom is applied to the
// viewBox rather than as a CSS transform on the element, so zooming out widens
// the window on the cell instead of shrinking a rectangular crop of it.
export const StageZoomContext = createContext(1);

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 2.5;

export function clampZoom(zoom) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

export function useStageZoom() {
  return useContext(StageZoomContext);
}
