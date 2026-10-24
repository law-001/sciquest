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

// A scene authored to FILL its Stage instead of letterboxing inside it.
//
// The stage column is about 16:10 and its exact shape moves with the viewport,
// so a scene drawn at any other ratio gets bars of empty gradient above and
// below it. Paired with preserveAspectRatio="xMidYMid slice" this covers the
// box the way `background-size: cover` does: the scene scales up and the
// leftover overflow is cropped.
//
// Two things that requires of the artwork: draw it at roughly the stage's own
// ratio (about 16:10) so the crop stays small, and let the ground, sky and
// water bleed past the viewBox so a cropped edge never shows a seam.
//
// `aspectRatio` is what keeps this safe on a phone: there the row has no fixed
// height, `height: 100%` resolves to auto, and the ratio gives the SVG its
// height instead of collapsing it.
// `objectFit` is the canvas half of this: a <canvas> is a replaced element, so
// cover crops it the same way slice crops an inline SVG. It is inert on inline
// SVG, so one helper covers both kinds of scene.
export const stageFill = (w, h) => ({
  width: '100%',
  height: '100%',
  display: 'block',
  objectFit: 'cover',
  aspectRatio: `${w} / ${h}`,
})
