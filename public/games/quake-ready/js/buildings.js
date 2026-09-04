/* ===========================================================================
   Buildings — loads pre-sliced, transparent building frames (6 per type:
   1 normal · 2 shaking · 3 light · 4 medium · 5 heavy · 6 collapsed) and draws
   the frame matching a building's damage state. Each frame is anchored by its
   base-centre so the building stays put as the frame (and its width) changes.
   =========================================================================== */
(function (global) {
  'use strict';
  const G = global.Game;
  // type -> [prefix, frameCount]; files are prefix1.png … prefixN.png (relative to index.html)
  const SETS = {
    shack: ['Building%20Assets/WOODEN_SHACK/WOODEN_SHACK_', 6],
    small: ['Building%20Assets/SMALL_HOUSE/SMALL%20HOUSE_', 6],
    house: ['Building%20Assets/HOUSE/HOUSE_', 6],
    school: ['Building%20Assets/SCHOOL/SCHOOL_', 6],
    apartment: ['Building%20Assets/APARTMENT/APARTMENT_', 6],
    office: ['Building%20Assets/OFFICE/OFFICE_', 6],
    road: ['Building%20Assets/ROADS/ROAD_', 4],
    sand: ['Building%20Assets/ROADS/SAND', 1],   // single frame → SAND.png
    boat: ['Building%20Assets/BOATNOBG', 1],     // single frame → BOATNOBG.png
  };
  const store = {};   // type -> { frames:[{img,cx,by}|null], loaded:int }

  // base-centre anchor: centroid-x of opaque pixels in the bottom band + lowest
  // opaque row. Falls back to frame centre if the canvas is tainted (file://).
  function anchor(img) {
    const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
    const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
    let d;
    try { d = cx.getImageData(0, 0, img.width, img.height).data; }
    catch (e) { return { cx: img.width / 2, by: img.height - 1 }; }
    const W = img.width, H = img.height, band = Math.max(3, Math.round(H * 0.16));
    let sx = 0, n = 0, by = H - 1;
    for (let y = H - band; y < H; y++)
      for (let x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3] > 40) { sx += x; n++; }
    for (let y = H - 1; y >= 0; y--) {
      let hit = false;
      for (let x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3] > 40) { hit = true; break; }
      if (hit) { by = y; break; }
    }
    return { cx: n ? sx / n : W / 2, by };
  }

  function load(type, prefix, n) {
    const rec = store[type] = { frames: new Array(n), loaded: 0, n };
    for (let f = 0; f < n; f++) {
      const img = new Image();
      img.onload = () => { rec.frames[f] = Object.assign({ img }, anchor(img)); rec.loaded++; };
      img.src = (n === 1 ? prefix : prefix + (f + 1)) + '.png';   // single-frame sets have no index
    }
  }
  for (const t in SETS) load(t, SETS[t][0], SETS[t][1]);

  G.Buildings = {
    ready: (type) => store[type] && store[type].loaded === store[type].n,
    // draw `frame` (0-5) of `type` with its base-centre at (x, groundY), scaled
    // to `targetH` px tall; `sway` nudges it horizontally.
    draw(ctx, type, frame, x, groundY, targetH, sway) {
      const rec = store[type]; if (!rec) return false;
      const fr = rec.frames[frame] || rec.frames[0]; if (!fr) return false;
      const scale = targetH / fr.img.height;
      ctx.drawImage(fr.img, x - fr.cx * scale + (sway || 0), groundY - fr.by * scale,
        fr.img.width * scale, fr.img.height * scale);
      return true;
    },
    // stretch `frame` of `type` into rect (x,y,w,h) — for tiled sections (roads)
    drawTile(ctx, type, frame, x, y, w, h) {
      const rec = store[type]; if (!rec) return false;
      const fr = rec.frames[frame] || rec.frames[0]; if (!fr) return false;
      ctx.drawImage(fr.img, x, y, w, h);
      return true;
    },
  };
})(window);
