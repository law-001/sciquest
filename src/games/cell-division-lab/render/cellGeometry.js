// The coordinate space every procedure plays in.
//
// The cell is not a backdrop behind a panel any more — it is the board. Each
// procedure draws its chromosomes, spindle and DNA straight into this space,
// so a chromosome at CELL.cx really is sitting on the cell's centre line.

export const STAGE_W = 1000;
export const STAGE_H = 620;

// Whole-cell framing: the membrane fits the stage with room for the asters.
export const CELL = { cx: 500, cy: 312, r: 252 };

// Nucleus framing. The envelope is a circle far larger than the stage, so the
// nucleoplasm fills the frame and the envelope reads as a curved wall behind
// which the chromosome's DNA keeps going.
export const NUCLEUS = { cx: 500, cy: 312, r: 520 };

function easeInOut(t) {
  const c = Math.max(0, Math.min(1, t));
  return c < 0.5 ? 2 * c * c : -1 + (4 - 2 * c) * c;
}

// ── Shapes ───────────────────────────────────────────────────────────────

export function circleShape(r = CELL.r) {
  return { mode: 'circle', r };
}

export function ellipseShape(r = CELL.r, stretch = 0.14) {
  return { mode: 'ellipse', rx: r, ry: r * (1 + stretch) };
}

// `p` 0 → round, 1 → severed. Drives the interactive cleavage furrow, and it
// hands over to splitShape at exactly the waist it ends on so the membrane
// does not jump when the two cells finally come apart.
export function pinchShape(p, r = CELL.r) {
  const e = easeInOut(p);
  if (e >= 1) return splitShape(r, 0.55);
  return { mode: 'pinch', rx: r, lobeR: r * (1 - 0.38 * e), splitY: r * (0.05 + 0.5 * e) };
}

export function splitShape(r = CELL.r, spread = 0.64) {
  return { mode: 'split', daughterR: r * 0.62, daughterOffsetY: r * spread };
}

// Cytokinesis as one continuous parameter. 0–1 is the furrow closing under
// the student's hands; 1–2 is the membrane giving way and the two daughters
// recoiling apart, which is why it overshoots slightly before settling.
export function cytokinesisShape(p, r = CELL.r) {
  if (p <= 1) return pinchShape(p, r);
  const t = Math.min(1, p - 1);
  // easeOutBack — the daughters overshoot slightly and settle, the way two
  // things that were being stretched apart actually recoil.
  const back = 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;
  return splitShape(r, 0.55 + 0.15 * back);
}

// The last thread of membrane still joining the two lobes, and how thin it
// has been stretched. Returns null once it has broken.
export function severThread(p, r = CELL.r) {
  if (p <= 1) return null;
  const t = Math.min(1, p - 1);
  if (t > 0.42) return null;
  const k = t / 0.42;
  const shape = cytokinesisShape(p, r);
  // Clamped: while the lobes still overlap the thread is simply short.
  const gap = Math.max(7, shape.daughterOffsetY - shape.daughterR);
  return { gap, width: 14 * (1 - k) ** 2, opacity: 1 - k };
}

// The bodies making up the cell right now — one, or two once it has split.
// Used for per-body sphere shading.
export function cellBodies(shape, cx = CELL.cx, cy = CELL.cy) {
  if (shape.mode === 'split') {
    return [
      { cx, cy: cy - shape.daughterOffsetY, r: shape.daughterR },
      { cx, cy: cy + shape.daughterOffsetY, r: shape.daughterR },
    ];
  }
  if (shape.mode === 'ellipse') return [{ cx, cy, r: shape.rx, ry: shape.ry }];
  if (shape.mode === 'pinch') return [{ cx, cy, r: shape.rx }];
  return [{ cx, cy, r: shape.r }];
}

// The six renderer stages the phase data refers to, for the ambient cell.
export function shapeForStage(idx, t = 1, r = CELL.r) {
  if (idx <= 2) return circleShape(r);
  if (idx === 3) return ellipseShape(r, 0.14 * easeInOut(t));
  if (idx === 4) return ellipseShape(r, 0.14);
  return pinchShape(t, r);
}

// ── Sampling ─────────────────────────────────────────────────────────────

export function cellPointAt(angle, shape, cx = CELL.cx, cy = CELL.cy) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  if (shape.mode === 'circle') return { x: cx + c * shape.r, y: cy + s * shape.r };
  if (shape.mode === 'ellipse') return { x: cx + c * shape.rx, y: cy + s * shape.ry };

  if (shape.mode === 'pinch') {
    const { rx, lobeR, splitY } = shape;
    // Distance to whichever lobe the ray leaves through — this is what gives
    // the waist its hourglass pinch instead of a plain ellipse.
    const dForLobe = (off) => {
      const A = (c * c) / (rx * rx) + (s * s) / (lobeR * lobeR);
      const B = (-2 * s * off) / (lobeR * lobeR);
      const C = (off * off) / (lobeR * lobeR) - 1;
      const disc = B * B - 4 * A * C;
      if (disc < 0) return 0;
      return Math.max(0, (-B + Math.sqrt(disc)) / (2 * A));
    };
    const d = Math.max(dForLobe(-splitY), dForLobe(splitY));
    return { x: cx + c * d, y: cy + s * d };
  }

  const sgn = s < 0 ? -1 : 1;
  return { x: cx + c * shape.daughterR, y: cy + sgn * shape.daughterOffsetY + s * shape.daughterR };
}

export function outerRadius(shape) {
  if (shape.mode === 'circle') return shape.r;
  if (shape.mode === 'ellipse') return Math.max(shape.rx, shape.ry);
  if (shape.mode === 'pinch') return shape.rx;
  return shape.daughterR + shape.daughterOffsetY;
}

// ── Paths ────────────────────────────────────────────────────────────────

const fmt = (v) => Math.round(v * 100) / 100;

export function circlePath(cx, cy, r) {
  return `M ${fmt(cx - r)} ${fmt(cy)} a ${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(r * 2)} 0 a ${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(-r * 2)} 0 Z`;
}

// One `d` string per closed body: one for a whole cell, two once it splits.
export function membranePaths(shape, cx = CELL.cx, cy = CELL.cy, samples = 128) {
  if (shape.mode === 'split') {
    return [
      circlePath(cx, cy - shape.daughterOffsetY, shape.daughterR),
      circlePath(cx, cy + shape.daughterOffsetY, shape.daughterR),
    ];
  }

  let d = '';
  for (let i = 0; i <= samples; i++) {
    const a = (i / samples) * Math.PI * 2;
    const p = cellPointAt(a, shape, cx, cy);
    d += `${i === 0 ? 'M' : 'L'} ${fmt(p.x)} ${fmt(p.y)} `;
  }
  return [`${d}Z`];
}

// Phospholipid heads studding the membrane. `offset` pushes the row out from
// the path, so a second row at a negative offset gives the inner leaflet of
// the bilayer.
export function membraneDots(shape, cx = CELL.cx, cy = CELL.cy, count = 72, offset = 3) {
  const dots = [];
  const bodies = shape.mode === 'split'
    ? [{ cy: cy - shape.daughterOffsetY, r: shape.daughterR }, { cy: cy + shape.daughterOffsetY, r: shape.daughterR }]
    : null;

  if (bodies) {
    for (const b of bodies) {
      for (let i = 0; i < count / 2; i++) {
        const a = (i / (count / 2)) * Math.PI * 2;
        dots.push({ x: cx + Math.cos(a) * (b.r + offset), y: b.cy + Math.sin(a) * (b.r + offset) });
      }
    }
    return dots;
  }

  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const p = cellPointAt(a, shape, cx, cy);
    dots.push({ x: p.x + Math.cos(a) * offset, y: p.y + Math.sin(a) * offset });
  }
  return dots;
}

// Mitochondria and vesicles drifting in the cytoplasm. Deterministic so they
// do not jump every render.
export function organelles(shape, cx = CELL.cx, cy = CELL.cy, count = 9) {
  const r = outerRadius(shape);
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + i * 0.37;
    const rr = r * (0.5 + 0.28 * ((i * 7) % 5) / 5);
    return {
      x: cx + Math.cos(a) * rr,
      y: cy + Math.sin(a) * rr * 0.92,
      rot: (a * 180) / Math.PI + 20,
      rx: r * 0.062,
      ry: r * 0.032,
      delay: i * 0.7,
    };
  });
}

// ── Pointer conversion ───────────────────────────────────────────────────

// getScreenCTM honours preserveAspectRatio, so this stays correct whatever
// letterboxing the stage ends up with.
export function stagePoint(event) {
  const el = event.currentTarget;
  return toStagePoint(event, el.ownerSVGElement ?? el);
}

export function toStagePoint(event, svg) {
  if (!svg) return { x: 0, y: 0 };
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const inv = ctm.inverse();
  return {
    x: event.clientX * inv.a + event.clientY * inv.c + inv.e,
    y: event.clientX * inv.b + event.clientY * inv.d + inv.f,
  };
}
