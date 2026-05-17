// Exact port of the entity drawing functions from the reference game.js.
// Signature: (ctx, cx, cy, r, time, [extra]) — ctx and time are explicit params.
// r = body radius (equivalent to game.js R for each entity).

const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));

// =========================================================
//  TOWER: LYSOSOME  (orange blob with two eyes + enzyme bubbles)
// =========================================================
export function drawLysosome(ctx, cx, cy, r, time, opts = {}) {
  const R = r;
  const s = r / 38;
  ctx.save();
  ctx.translate(cx, cy);

  // Outer glow
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.8);
  glow.addColorStop(0, 'rgba(255,107,53,0.35)');
  glow.addColorStop(1, 'rgba(255,107,53,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, R * 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Body — bumpy blob
  const N = 16;
  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const a   = (i / N) * Math.PI * 2;
    const wob = Math.sin(a * 5 + time * 0.04) * (R * 0.08);
    const rr  = R + wob;
    const px  = Math.cos(a) * rr, py = Math.sin(a) * rr;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  const grad = ctx.createRadialGradient(-R*0.3, -R*0.3, 0, 0, 0, R);
  grad.addColorStop(0,    '#FF8A55');
  grad.addColorStop(0.55, '#E84C1E');
  grad.addColorStop(1,    '#8B1A00');
  ctx.fillStyle   = grad;
  ctx.shadowBlur  = 16 * s;
  ctx.shadowColor = '#FF6B35';
  ctx.fill();
  ctx.shadowBlur  = 0;

  // Inner stroke
  ctx.beginPath();
  ctx.arc(0, 0, R * 0.85, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,180,120,0.3)';
  ctx.lineWidth   = 1.4 * s;
  ctx.stroke();

  // Highlight
  ctx.beginPath();
  ctx.ellipse(-R*0.35, -R*0.4, R*0.25, R*0.14, -0.4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,230,200,0.45)';
  ctx.fill();

  // Eyes
  const ey = -R*0.1, eyeR = R*0.22, irisR = R*0.13;
  [[-R*0.28, ey], [R*0.28, ey]].forEach(([ex, eey]) => {
    ctx.beginPath();
    ctx.arc(ex, eey, eyeR, 0, Math.PI * 2);
    ctx.fillStyle = '#F0E8D0'; ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + Math.sin(time*0.008)*1.5, eey, irisR, 0, Math.PI * 2);
    ctx.fillStyle = '#2B1200'; ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 2, eey - 2, irisR*0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
  });

  // Smile
  ctx.beginPath();
  ctx.moveTo(-R*0.32, R*0.2);
  ctx.quadraticCurveTo(0, R*0.42, R*0.32, R*0.2);
  ctx.strokeStyle = '#5C2200';
  ctx.lineWidth   = 3 * s;
  ctx.lineCap     = 'round';
  ctx.stroke();

  ctx.restore();

  // Enzyme bubbles orbiting
  if (!opts.noBubbles) {
    const NB = 6;
    for (let i = 0; i < NB; i++) {
      const ang = (i / NB) * Math.PI * 2 + time * 0.012 * (i % 2 === 0 ? 1 : -1);
      const rad = R * (1.25 + 0.15 * Math.sin(time * 0.02 + i));
      const bx  = cx + Math.cos(ang) * rad;
      const by  = cy + Math.sin(ang) * rad;
      const br  = R * 0.13;
      ctx.save();
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fillStyle   = 'rgba(255,220,100,0.55)';
      ctx.shadowBlur  = 8;
      ctx.shadowColor = '#FFDD00';
      ctx.fill();
      ctx.restore();
    }
  }
}

// =========================================================
//  TOWER: PROTEIN KINASE  (blue bilobal + phosphate orbs)
// =========================================================
export function drawProteinKinase(ctx, cx, cy, r, time) {
  const s    = r / 36;
  const bigR = 36 * s;   // = r
  const smR  = 22 * s;
  ctx.save();
  ctx.translate(cx, cy);

  // Outer glow
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, bigR * 2);
  glow.addColorStop(0, 'rgba(26,110,255,0.3)');
  glow.addColorStop(1, 'rgba(26,110,255,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, bigR * 2, 0, Math.PI * 2);
  ctx.fill();

  const hingeX = bigR * 0.95;
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, bigR * 1.6);
  grad.addColorStop(0,    '#4A90FF');
  grad.addColorStop(0.55, '#1A4FCC');
  grad.addColorStop(1,    '#091A6E');

  ctx.shadowBlur  = 18 * s;
  ctx.shadowColor = '#1A6EFF';
  ctx.beginPath();
  ctx.ellipse(0, 0, bigR, bigR * 0.95, 0, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(hingeX + smR * 0.8, smR * 0.6, smR, smR * 0.9, 0, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Hinge highlight
  ctx.beginPath();
  ctx.arc(hingeX * 0.7, smR * 0.15, bigR * 0.18, -Math.PI*0.6, Math.PI*0.3);
  ctx.strokeStyle = 'rgba(180,220,255,0.4)';
  ctx.lineWidth   = 2.5 * s;
  ctx.stroke();

  // Inner stroke
  ctx.beginPath();
  ctx.ellipse(0, 0, bigR * 0.85, bigR * 0.8, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(120,180,255,0.25)';
  ctx.lineWidth   = 1.4 * s;
  ctx.stroke();

  // Eyes
  const ey = -bigR*0.1, eyeR = bigR*0.18;
  [[-bigR*0.32, ey], [-bigR*0.05, ey]].forEach(([ex, eey]) => {
    ctx.beginPath();
    ctx.arc(ex, eey, eyeR, 0, Math.PI * 2);
    ctx.fillStyle = '#E8F0FF'; ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 1, eey, eyeR*0.6, 0, Math.PI * 2);
    ctx.fillStyle = '#0033CC'; ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 1, eey, eyeR*0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#000820'; ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 1 + eyeR*0.3, eey - eyeR*0.3, eyeR*0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
  });

  // Determined flat mouth
  ctx.beginPath();
  ctx.moveTo(-bigR*0.25, bigR*0.25);
  ctx.lineTo( bigR*0.05, bigR*0.25);
  ctx.strokeStyle = '#002299';
  ctx.lineWidth   = 3 * s;
  ctx.lineCap     = 'round';
  ctx.stroke();

  // ~P stamp rotating on small lobe
  ctx.save();
  ctx.translate(hingeX + smR * 0.8, smR * 0.6);
  ctx.rotate(time * 0.006);
  ctx.beginPath();
  ctx.arc(0, 0, smR * 0.5, 0, Math.PI * 2);
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth   = 1.5 * s;
  ctx.shadowBlur  = 10;
  ctx.shadowColor = '#FFD700';
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.font        = `bold ${10*s}px 'Courier New'`;
  ctx.fillStyle   = '#FFD700';
  ctx.textAlign   = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('~P', 0, 0);
  ctx.restore();

  ctx.restore();

  // Phosphate orbs orbiting
  const NO = 5;
  for (let i = 0; i < NO; i++) {
    const ang  = (i / NO) * Math.PI * 2 + time * 0.014;
    const orbR = bigR * (1.55 + 0.1 * Math.sin(time*0.02 + i));
    const ox   = cx + Math.cos(ang) * orbR;
    const oy   = cy + Math.sin(ang) * orbR * 0.85;
    ctx.save();
    ctx.beginPath();
    ctx.arc(ox, oy, bigR * 0.1, 0, Math.PI * 2);
    ctx.fillStyle   = '#FFD700';
    ctx.shadowBlur  = 10;
    ctx.shadowColor = '#FFD700';
    ctx.fill();
    ctx.restore();
  }
}

// =========================================================
//  TOWER: REPAIR ENZYME  (green C-clamp + scrolling DNA)
// =========================================================
export function drawRepairEnzyme(ctx, cx, cy, r, time) {
  const s  = r / 40;
  const OR = 40 * s;   // = r
  const IR = 22 * s;
  ctx.save();
  ctx.translate(cx, cy);

  // Outer glow
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, OR * 1.8);
  glow.addColorStop(0, 'rgba(46,204,113,0.32)');
  glow.addColorStop(1, 'rgba(46,204,113,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, OR * 1.8, 0, Math.PI * 2);
  ctx.fill();

  // C-clamp — opens to the right
  const gap  = 0.7;
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, OR);
  grad.addColorStop(0,    '#3FDB7E');
  grad.addColorStop(0.55, '#1A8A4A');
  grad.addColorStop(1,    '#0A3D22');

  ctx.beginPath();
  ctx.arc(0, 0, OR, -gap, gap, true);
  ctx.lineTo(Math.cos(gap) * IR, Math.sin(gap) * IR);
  ctx.arc(0, 0, IR, gap, -gap, false);
  ctx.closePath();
  ctx.fillStyle   = grad;
  ctx.shadowBlur  = 18 * s;
  ctx.shadowColor = '#2ECC71';
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(80,200,120,0.3)';
  ctx.lineWidth   = 1.4 * s;
  ctx.stroke();

  // DNA scrolling through inner channel
  ctx.save();
  ctx.beginPath();
  ctx.rect(IR * 0.6, -IR * 0.7, OR - IR * 0.6 + 4, IR * 1.4);
  ctx.clip();
  const dnaOff = (time * 0.6) % 24;
  const count  = 8;
  for (let w = 0; w < 2; w++) {
    const color = w === 0 ? '#FF99AA' : '#99AAFF';
    for (let i = 0; i < count; i++) {
      const xb    = IR * 0.6 + i * (8 * s) - dnaOff;
      const phase = (xb + dnaOff) / (28 * s) * Math.PI * 2;
      const y     = Math.sin(phase + w * Math.PI) * (IR * 0.35);
      ctx.beginPath();
      ctx.arc(xb, y, 2.2 * s, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }
  for (let i = 0; i < 4; i++) {
    const xb = IR * 0.6 + i * (16 * s) - dnaOff * 0.7;
    ctx.beginPath();
    ctx.moveTo(xb, -IR * 0.45);
    ctx.lineTo(xb,  IR * 0.45);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();

  // Repair sparks circling inner ring
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * (Math.PI*2 - gap*2) + gap + Math.PI + time * 0.015;
    if (a > -gap && a < gap) continue;
    const sx = Math.cos(a) * IR;
    const sy = Math.sin(a) * IR;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.fillStyle   = '#AAFFCC';
    ctx.shadowBlur  = 8;
    ctx.shadowColor = '#2ECC71';
    ctx.beginPath();
    for (let j = 0; j < 8; j++) {
      const aa = (j / 8) * Math.PI * 2;
      const rr = j % 2 === 0 ? 3.5 * s : 1.5 * s;
      const px = Math.cos(aa) * rr, py = Math.sin(aa) * rr;
      j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Eyes on the left lobe
  const ey = -OR*0.22, eyeR = OR*0.16;
  [[-OR*0.48, ey], [-OR*0.18, ey]].forEach(([ex, eey]) => {
    ctx.beginPath();
    ctx.arc(ex, eey, eyeR, 0, Math.PI * 2);
    ctx.fillStyle = '#F5FFF8'; ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 1.5, eey, eyeR*0.6, 0, Math.PI * 2);
    ctx.fillStyle = '#0A5C36'; ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 1.5, eey, eyeR*0.25, 0, Math.PI * 2);
    ctx.fillStyle = '#001A0A'; ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 1.5 + eyeR*0.35, eey - eyeR*0.35, eyeR*0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
  });

  // Mouth
  ctx.beginPath();
  ctx.ellipse(-OR*0.33, OR*0.12, OR*0.16, OR*0.06, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#001A0A'; ctx.fill();

  // Medical cross badge
  ctx.save();
  ctx.translate(-OR*0.33, OR*0.45);
  ctx.fillStyle   = '#AAFFCC';
  ctx.shadowBlur  = 6;
  ctx.shadowColor = '#2ECC71';
  ctx.fillRect(-6*s, -2*s, 12*s, 4*s);
  ctx.fillRect(-2*s, -6*s,  4*s, 12*s);
  ctx.restore();

  ctx.restore();
}

// =========================================================
//  ENEMY: VIRAL HIJACKER  (purple hex, 6 legs)
// =========================================================
export function drawViralHijacker(ctx, cx, cy, r, time, walkCycle = 0) {
  const s = r / 30;
  const R = 30 * s;   // = r
  function hexV(i, radius) {
    const a = (i*60 - 90) * Math.PI / 180;
    return { x: Math.cos(a)*radius, y: Math.sin(a)*radius };
  }
  const verts    = Array.from({ length: 6 }, (_, i) => hexV(i, R));
  const lerpPt   = (a, b, t) => ({ x: a.x + (b.x-a.x)*t, y: a.y + (b.y-a.y)*t });
  const attachPts = [
    lerpPt(verts[2], verts[3], 0.3),
    lerpPt(verts[2], verts[3], 0.7),
    lerpPt(verts[3], verts[4], 0.25),
    lerpPt(verts[3], verts[4], 0.75),
    lerpPt(verts[4], verts[5], 0.3),
    lerpPt(verts[4], verts[5], 0.7),
  ];

  ctx.save();
  ctx.translate(cx, cy);
  const tilt = -0.05 + Math.sin(walkCycle * 0.5) * 0.04;
  ctx.rotate(tilt);

  // Legs
  for (let i = 0; i < 6; i++) {
    const phaseOff = (i / 6) * Math.PI * 2;
    const cycle    = (walkCycle + phaseOff) % (Math.PI * 2);
    const norm     = cycle / (Math.PI * 2);
    const UL = 16 * s, LL = 13 * s;
    let upper, lower, lift;
    if (norm < 0.4) {
      const p = norm / 0.4;
      upper = lerp(0.3, -0.6, p);
      lower = lerp(0.4, -0.3, p);
      lift  = Math.sin(p * Math.PI) * 14 * s;
    } else if (norm < 0.6) {
      const p = (norm - 0.4) / 0.2;
      upper = lerp(-0.6,  0.05, p);
      lower = lerp(-0.3,  0.15, p);
      lift  = lerp(14 * s, 0, p);
    } else {
      const p = (norm - 0.6) / 0.4;
      upper = lerp(0.05, 0.3,  p);
      lower = lerp(0.15, 0.05, p);
      lift  = 0;
    }
    const att = attachPts[i];
    const kx  = att.x + Math.sin(upper) * UL;
    const ky  = att.y + Math.cos(upper) * UL;
    const fx  = kx + Math.sin(upper + lower) * LL;
    const fy  = ky + Math.cos(upper + lower) * LL - lift;
    ctx.beginPath();
    ctx.moveTo(att.x, att.y);
    ctx.lineTo(kx, ky);
    ctx.strokeStyle = '#6A00CC';
    ctx.lineWidth   = 3 * s;
    ctx.lineCap     = 'round';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(kx, ky);
    ctx.lineTo(fx, fy);
    ctx.strokeStyle = '#3D0073';
    ctx.lineWidth   = 2.4 * s;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(fx, fy, 3 * s, 0, Math.PI * 2);
    ctx.fillStyle   = '#39FF14';
    ctx.shadowBlur  = 6;
    ctx.shadowColor = '#39FF14';
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Hex body
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
  g.addColorStop(0,   '#6A00CC');
  g.addColorStop(0.5, '#3D0073');
  g.addColorStop(1,   '#1A0033');
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a  = (i*60 - 90) * Math.PI / 180;
    const px = Math.cos(a)*R, py = Math.sin(a)*R;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle   = g;
  ctx.shadowBlur  = 14 * s;
  ctx.shadowColor = '#8B00FF';
  ctx.fill();
  ctx.strokeStyle = '#8B00FF';
  ctx.lineWidth   = 2 * s;
  ctx.stroke();
  ctx.shadowBlur  = 0;

  // Inner counter-rotating hex
  ctx.save();
  ctx.rotate(-time * 0.006);
  const ir = R * 0.55;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a  = (i*60 - 60) * Math.PI / 180;
    const px = Math.cos(a)*ir, py = Math.sin(a)*ir;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = 'rgba(57,255,20,0.5)';
  ctx.lineWidth   = 1.4 * s;
  ctx.stroke();
  ctx.restore();

  // Slash marks
  ctx.strokeStyle = 'rgba(57,255,20,0.55)';
  ctx.lineWidth   = 1.6 * s;
  ctx.lineCap     = 'round';
  [[10,-10,18,-2],[18,2,26,10],[8,8,16,16]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath();
    ctx.moveTo(x1*s, y1*s); ctx.lineTo(x2*s, y2*s); ctx.stroke();
  });

  // Face — big left eye (yellow sclera, red iris)
  const lex = -7*s, ley = -3*s;
  ctx.beginPath();
  ctx.arc(lex, ley, 9*s, 0, Math.PI*2);
  ctx.fillStyle   = '#FFE566';
  ctx.shadowBlur  = 5;
  ctx.shadowColor = '#FFE566';
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(lex, ley, 5.5*s, 0, Math.PI*2);
  ctx.fillStyle = '#CC0000'; ctx.fill();
  ctx.beginPath();
  ctx.ellipse(lex, ley, 2*s, 5*s, 0, 0, Math.PI*2);
  ctx.fillStyle = '#000'; ctx.fill();

  // Right squinting eye
  const rex = 7*s, rey = -4*s;
  ctx.save();
  ctx.beginPath();
  ctx.rect(rex - 7*s, rey, 14*s, 14*s);
  ctx.clip();
  ctx.beginPath();
  ctx.arc(rex, rey, 6*s, 0, Math.PI*2);
  ctx.fillStyle = '#FFE566'; ctx.fill();
  ctx.beginPath();
  ctx.arc(rex, rey, 3.5*s, 0, Math.PI*2);
  ctx.fillStyle = '#CC0000'; ctx.fill();
  ctx.restore();

  // Neon green smirk
  ctx.beginPath();
  ctx.moveTo(-12*s, 9*s);
  ctx.quadraticCurveTo(-3*s, 15*s, 9*s, 8*s);
  ctx.strokeStyle = '#39FF14';
  ctx.lineWidth   = 2.4 * s;
  ctx.lineCap     = 'round';
  ctx.shadowBlur  = 6;
  ctx.shadowColor = '#39FF14';
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.restore();
}

// =========================================================
//  ENEMY: TOXIN DROPLET  (green frowning droplet)
// =========================================================
export function drawToxinDroplet(ctx, cx, cy, r, time, bouncePhase = 0) {
  const s        = r / 34;
  const rawBounce = Math.sin(bouncePhase);
  const squash   = Math.max(0, -rawBounce) * 10 * s;
  const slosh    = Math.sin(bouncePhase * 2 + 0.3) * 4 * s;

  ctx.save();
  ctx.translate(cx, cy + (rawBounce > 0 ? rawBounce * 4 * s : 0));
  const lean = rawBounce > 0.3 ? -0.06 : 0.02;
  ctx.rotate(lean);

  const base = [
    [0,-34],[-14,-24],[-23,-5],[-25,14],[-19,26],
    [-8,32],[8,32],[19,26],[25,14],[23,-5],[14,-24],[5,-32.5],
  ].map(([x, y]) => ({ x: x*s, y: y*s }));
  const NN = base.length;

  ctx.beginPath();
  for (let i = 0; i < NN; i++) {
    const p   = base[i];
    const nxt = base[(i+1) % NN];
    let dy = 0, dx = 0;
    if (p.y > 0) dy += squash * (p.y / (32*s));
    if (p.y < -20*s) dy -= squash * 0.3 * (-p.y / (34*s));
    if (Math.abs(p.x) > 10*s) dx += Math.sign(p.x) * squash * 0.3;
    if (p.x < 0) dx -= slosh * 0.6;
    if (p.x > 0) dx += slosh * 0.6;
    const cur  = { x: p.x + dx, y: p.y + dy };
    const ndy  = nxt.y > 0 ? squash * (nxt.y / (32*s)) : 0;
    const next = { x: nxt.x + Math.sign(nxt.x)*slosh*0.6, y: nxt.y + ndy };
    const cpx  = (cur.x + next.x) / 2;
    const cpy  = (cur.y + next.y) / 2;
    if (i === 0) ctx.moveTo(cur.x, cur.y);
    ctx.quadraticCurveTo(cur.x, cur.y, cpx, cpy);
  }
  ctx.closePath();
  const grad = ctx.createRadialGradient(0, -5*s, 0, 0, -5*s, 38*s);
  grad.addColorStop(0,   '#B8FF4A');
  grad.addColorStop(0.3, '#7FFF00');
  grad.addColorStop(0.6, '#3A8C00');
  grad.addColorStop(1,   '#0A1F00');
  ctx.fillStyle   = grad;
  ctx.shadowBlur  = 14 * s;
  ctx.shadowColor = '#7FFF00';
  ctx.fill();
  ctx.shadowBlur = 0;

  // Highlight
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.translate(-8*s, -18*s);
  ctx.rotate(-0.5);
  ctx.beginPath();
  ctx.ellipse(0, 0, 12*s, 7*s, 0, 0, Math.PI*2);
  ctx.fillStyle = '#fff'; ctx.fill();
  ctx.restore();

  // Eyes — heavy-lidded
  [[-10*s, -11*s], [6*s, -11*s]].forEach(([ex, ey]) => {
    const SR = 7 * s;
    ctx.beginPath();
    ctx.arc(ex, ey, SR, 0, Math.PI*2);
    ctx.fillStyle = '#D4FF80'; ctx.fill();
    ctx.beginPath();
    ctx.arc(ex, ey + 2, SR*0.55, 0, Math.PI*2);
    ctx.fillStyle = '#1A5C00'; ctx.fill();
    ctx.beginPath();
    ctx.arc(ex, ey + 2, SR*0.28, 0, Math.PI*2);
    ctx.fillStyle = '#050F00'; ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.rect(ex - SR - 1, ey - SR - 1, SR*2+2, SR+1);
    ctx.clip();
    ctx.beginPath();
    ctx.rect(ex - SR - 1, ey - SR - 1, SR*2+2, SR*0.6);
    ctx.fillStyle = '#2a6800'; ctx.fill();
    ctx.beginPath();
    ctx.moveTo(ex - SR, ey - SR*0.4);
    ctx.quadraticCurveTo(ex, ey - SR*0.2, ex + SR, ey - SR*0.4);
    ctx.strokeStyle = '#1a4500';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  });

  // Angry brows
  [[-10*s, -19*s, -0.38], [6*s, -19*s, 0.38]].forEach(([bx, by, rot]) => {
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(-8*s, -2); ctx.lineTo(8*s, -2);
    ctx.lineTo(6*s, 2);   ctx.lineTo(-6*s, 2);
    ctx.closePath();
    ctx.fillStyle = '#0A2800'; ctx.fill();
    ctx.restore();
  });

  // Frown
  ctx.beginPath();
  ctx.moveTo(-14*s, 4*s);
  ctx.quadraticCurveTo(-2*s, 9*s, 12*s, 4*s);
  ctx.strokeStyle = '#0A2800';
  ctx.lineWidth   = 3 * s;
  ctx.lineCap     = 'round';
  ctx.stroke();

  // Drips
  [-9*s, 0, 9*s].forEach((dx, idx) => {
    const len = (3 + idx*2 + Math.sin(time*0.04 + idx)*2) * s;
    const ax  = dx, ay = 32 * s;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.quadraticCurveTo(ax + 2, ay + len*0.5, ax, ay + len);
    ctx.quadraticCurveTo(ax - 2, ay + len*0.5, ax, ay);
    ctx.fillStyle = 'rgba(127,255,0,0.6)';
    ctx.fill();
  });

  ctx.restore();
}

// =========================================================
//  ENEMY: RADIATION PULSE  (amber blob with fins, hovering)
// =========================================================
export function drawRadiationPulse(ctx, cx, cy, r, time) {
  const s  = r / 26;
  const CR = 26 * s;   // = r
  ctx.save();
  ctx.translate(cx, cy);

  // Expanding rings
  for (let ri = 0; ri < 3; ri++) {
    const phase = ((time * 0.6 + ri * 30) % 90) / 90;
    const rad   = CR * 1.1 + (CR * 2.4 - CR * 1.1) * phase;
    const op    = 0.45 * (1 - phase);
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, rad, 0, Math.PI*2);
    ctx.strokeStyle = `rgba(255,179,0,${op})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 7]);
    ctx.stroke();
    ctx.restore();
  }
  ctx.setLineDash([]);

  // 8 pulsing fins
  for (let i = 0; i < 8; i++) {
    const baseAng    = (i / 8) * Math.PI * 2;
    const finLen     = (16 + Math.sin(time * 0.06 + i) * 9) * s;
    const halfSpread = 9 * Math.PI / 180;
    const la  = baseAng - halfSpread, ra = baseAng + halfSpread;
    const bl  = { x: Math.cos(la)*CR, y: Math.sin(la)*CR };
    const br  = { x: Math.cos(ra)*CR, y: Math.sin(ra)*CR };
    const tip = { x: Math.cos(baseAng)*(CR + finLen), y: Math.sin(baseAng)*(CR + finLen) };
    const perpX   = -Math.sin(baseAng), perpY = Math.cos(baseAng);
    const midDist = finLen * 0.7;
    const midX = Math.cos(baseAng)*(CR + midDist);
    const midY = Math.sin(baseAng)*(CR + midDist);
    const cpL  = { x: midX + perpX*8*s, y: midY + perpY*8*s };
    const cpR  = { x: midX - perpX*8*s, y: midY - perpY*8*s };
    const finGrad = ctx.createLinearGradient(
      (bl.x+br.x)/2, (bl.y+br.y)/2, tip.x, tip.y);
    finGrad.addColorStop(0, 'rgba(255,150,0,0.75)');
    finGrad.addColorStop(1, 'rgba(255,253,224,0)');
    ctx.beginPath();
    ctx.moveTo(bl.x, bl.y);
    ctx.bezierCurveTo(cpL.x, cpL.y, tip.x, tip.y, tip.x, tip.y);
    ctx.bezierCurveTo(tip.x, tip.y, cpR.x, cpR.y, br.x, br.y);
    ctx.closePath();
    ctx.fillStyle   = finGrad;
    ctx.shadowBlur  = 8;
    ctx.shadowColor = '#FFB300';
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Irregular core blob
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a   = (i / 10) * Math.PI * 2;
    const off = Math.sin(time * 0.05 + i) * 3 * s;
    pts.push({ x: Math.cos(a)*(CR + off), y: Math.sin(a)*(CR + off) });
  }
  const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, CR + 6*s);
  coreGrad.addColorStop(0,    '#FFFDE0');
  coreGrad.addColorStop(0.3,  '#FFD700');
  coreGrad.addColorStop(0.65, '#FF6600');
  coreGrad.addColorStop(1,    '#7A1500');
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 0; i < 10; i++) {
    const next = pts[(i+1) % 10];
    const cpx  = (pts[i].x + next.x) / 2;
    const cpy  = (pts[i].y + next.y) / 2;
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, cpx, cpy);
  }
  ctx.closePath();
  ctx.fillStyle   = coreGrad;
  ctx.shadowBlur  = 24;
  ctx.shadowColor = '#FFB300';
  ctx.fill();
  ctx.shadowBlur = 0;

  // Inner rotating rings
  ctx.save();
  ctx.rotate(time * 0.04);
  ctx.beginPath();
  ctx.arc(0, 0, CR * 0.45, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(255,253,224,0.5)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.rotate(-time * 0.03);
  ctx.beginPath();
  ctx.arc(0, 0, CR * 0.7, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(255,200,50,0.35)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 5]);
  ctx.stroke();
  ctx.restore();
  ctx.setLineDash([]);

  // Radiating cracks
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    let lx = 0, ly = 0;
    for (let p = 1; p <= 4; p++) {
      const t   = p / 4;
      const bx  = Math.cos(a) * CR * t;
      const by  = Math.sin(a) * CR * t;
      const pxP = -Math.sin(a), pyP = Math.cos(a);
      const shift = Math.sin(time * 0.08 + i * p) * 4 * s;
      lx = bx + pxP * shift;
      ly = by + pyP * shift;
      ctx.lineTo(lx, ly);
    }
    ctx.strokeStyle = 'rgba(255,253,224,0.6)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  // Ring-eyes
  [[-CR*0.35, -CR*0.1], [CR*0.35, -CR*0.1]].forEach(([ex, ey], i) => {
    const outR = (5 + Math.sin(time * 0.1 + i)*0.8) * s;
    ctx.beginPath();
    ctx.arc(ex, ey, outR, 0, Math.PI*2);
    ctx.strokeStyle = '#FF6600';
    ctx.lineWidth = 1.8;
    ctx.shadowBlur  = 10;
    ctx.shadowColor = '#FFB300';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ex, ey, outR * 0.5, 0, Math.PI*2);
    ctx.strokeStyle = '#FFFDE0';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(ex, ey, 1.5*s, 0, Math.PI*2);
    ctx.fillStyle = '#FFFFFF'; ctx.fill();
  });

  // Stress-fracture brows
  [[-CR*0.35, -CR*0.35], [CR*0.35, -CR*0.35]].forEach(([bx, by]) => {
    ctx.beginPath();
    ctx.moveTo(bx - 5*s, by);
    ctx.lineTo(bx,       by - 3*s);
    ctx.lineTo(bx + 5*s, by);
    ctx.strokeStyle = 'rgba(255,200,50,0.8)';
    ctx.lineWidth = 1.8;
    ctx.lineCap   = 'round';
    ctx.stroke();
  });

  ctx.restore();
}
