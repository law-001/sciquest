// Shared sizing for the SVG or canvas inside a simulation Stage.
//
// `maxHeight: 100%` is what lets the picture shrink to the height the grid row
// hands it while keeping its proportions; on a phone the row has no fixed
// height, so the cap does nothing and the natural aspect ratio wins.
//
// `object-fit: contain` matters for the canvas widgets: when the height clamps,
// the bitmap letterboxes instead of stretching. SVG does the same thing on its
// own through preserveAspectRatio.
export const STAGE_MEDIA = {
  width: '100%',
  height: 'auto',
  maxHeight: '100%',
  objectFit: 'contain',
  display: 'block',
}
