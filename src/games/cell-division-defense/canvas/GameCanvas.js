// =========================================================
// Cell Division: Divide & Defend — canvas renderer
// Ported from design prototype. All rendering is 2D canvas.
// =========================================================

const MITOSIS_NAMES  = ['INTERPHASE','PROPHASE','METAPHASE','ANAPHASE','TELOPHASE','CYTOKINESIS'];
const MITOSIS_COLORS = ['#3BAFA9','#9B59B6','#00FFCC','#FFD700','#A8C8F0','#FF6B6B'];
const MITOSIS_DURS   = [4.0, 3.5, 3.5, 3.5, 3.5, 5.5];
const MITOSIS_TOTAL  = MITOSIS_DURS.reduce((a,b) => a + b, 0);

// 12 slots at 30-degree intervals around the membrane
const SLOT_ANGLES = Array.from({ length: 12 }, (_, i) => i * 30);

const TOWER_DEFS = {
  lysosome:      { name: 'LYSOSOME',    cost: 80,  color: '#FF6B35', costLabel: '80 ATP'  },
  proteinKinase: { name: 'PROTEIN KIN', cost: 120, color: '#1A6EFF', costLabel: '120 ATP' },
  repairEnzyme:  { name: 'REPAIR ENZ',  cost: 100, color: '#2ECC71', costLabel: '100 ATP' },
};
const TOWER_KEYS = ['lysosome', 'proteinKinase', 'repairEnzyme'];

export function createGame(container, callbacks = {}) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;position:absolute;inset:0;cursor:crosshair;user-select:none;';
  container.style.position = 'relative';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, dpr = 1;
  let time = 0;
  let mitosisT = 4.0;
  let lastFrameMs = performance.now();
  let currentPhase = { idx: 0, t: 0 };
  let currentShape = { mode: 'circle', r: 100 };
  let rafId = null;

  const L = {};
  const atpPickups = [];

  // External game state (fed from React)
  let st = {
    hp: 100, maxHp: 100, atp: 300,
    wave: 1, totalWaves: 5,
    mutations: [],
    nextWaveEnemies: [],
    waveCountdown: 0, waveCountdownMax: 30,
    selectedTower: null,
    slots: {}, // { [slotIndex]: towerId }
    paused: false,
  };

  // ── Math helpers ───────────────────────────────────────
  const lerp = (a,b,t) => a + (b-a) * Math.max(0, Math.min(1, t));
  const rng  = (lo, hi) => lo + Math.random() * (hi - lo);
  function easeInOut(t) { t = Math.max(0, Math.min(1, t)); return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

  function getPhase(seconds) {
    let s = ((seconds % MITOSIS_TOTAL) + MITOSIS_TOTAL) % MITOSIS_TOTAL;
    for (let i = 0; i < 6; i++) {
      if (s < MITOSIS_DURS[i]) return { idx: i, t: Math.max(0, Math.min(1, s / MITOSIS_DURS[i])) };
      s -= MITOSIS_DURS[i];
    }
    return { idx: 5, t: 1 };
  }

  function cellShapeForPhase(phase, r) {
    if (phase.idx <= 2) return { mode: 'circle', r };
    if (phase.idx === 3) {
      const stretch = easeInOut(phase.t);
      return { mode: 'ellipse', rx: r, ry: r * (1 + 0.14 * stretch) };
    }
    if (phase.idx === 4) return { mode: 'ellipse', rx: r, ry: r * 1.14 };
    if (phase.t < 0.85) {
      const pp = phase.t / 0.85, p = easeInOut(pp);
      return { mode: 'pinch', rx: r, lobeR: r * (1 - 0.38*p), splitY: r * (0.05 + 0.5*p) };
    }
    const pp = (phase.t - 0.85) / 0.15;
    return { mode: 'split', daughterR: r * 0.6, daughterOffsetY: r * (0.6 + 0.04*pp) };
  }

  function cellPointAt(angle, shape, cx, cy) {
    const c = Math.cos(angle), s = Math.sin(angle);
    if (shape.mode === 'circle')  return { x: cx + c * shape.r,  y: cy + s * shape.r  };
    if (shape.mode === 'ellipse') return { x: cx + c * shape.rx, y: cy + s * shape.ry };
    if (shape.mode === 'pinch') {
      const { rx, lobeR, splitY } = shape;
      function dForLobe(off) {
        const A = (c*c)/(rx*rx) + (s*s)/(lobeR*lobeR);
        const B = -2*s*off/(lobeR*lobeR);
        const C = (off*off)/(lobeR*lobeR) - 1;
        const disc = B*B - 4*A*C;
        if (disc < 0) return 0;
        return Math.max(0, (-B + Math.sqrt(disc)) / (2*A));
      }
      const d = Math.max(dForLobe(-splitY), dForLobe(+splitY));
      return { x: cx + c * d, y: cy + s * d };
    }
    if (shape.mode === 'split') {
      const sgn = s < 0 ? -1 : 1;
      return { x: cx + c * shape.daughterR, y: cy + sgn * shape.daughterOffsetY + s * shape.daughterR };
    }
    return { x: cx, y: cy };
  }

  function getTowerAnchor(angleDeg, shape) {
    const cx = L.cellX, cy = L.cellY;
    const a = angleDeg * Math.PI / 180;
    const pt = cellPointAt(a, shape, cx, cy);
    let scale = 1;
    if (shape.mode === 'pinch')  scale = 1 - 0.22 * Math.min(shape.splitY / (L.cellR * 0.7), 1);
    else if (shape.mode === 'split') scale = 0.74;
    return { x: pt.x, y: pt.y, scale };
  }

  // ── Resize ─────────────────────────────────────────────
  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    W = container.clientWidth  || window.innerWidth;
    H = container.clientHeight || window.innerHeight;
    canvas.width  = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    L.hudH  = 56;
    L.shopW = Math.max(200, Math.round(W * 0.18));
    L.shopX = 0; L.shopY = L.hudH; L.shopH = H - L.hudH;
    L.arenaX = L.shopW; L.arenaY = L.hudH;
    L.arenaW = W - L.shopW; L.arenaH = H - L.hudH;
    const maxR = (L.arenaH - 130) / 2.44;
    L.cellR = Math.max(120, Math.min(Math.round(H * 0.34), Math.round(maxR)));
    L.cellX = L.arenaX + L.arenaW / 2;
    L.cellY = L.arenaY + L.arenaH / 2 + 4;

    // Shop card rects for hit-testing
    const cardW = L.shopW - 28, cardX = L.shopX + 14;
    const startY = L.shopY + 40, cardH = (L.shopH - 70) / 3, gap = 10;
    L.shopCards = TOWER_KEYS.map((k, i) => ({
      id: k, x: cardX, y: startY + i * (cardH + gap), w: cardW, h: cardH - gap,
    }));

    initATP();
  }

  // ── Hex grid ───────────────────────────────────────────
  function drawHexGrid() {
    const size = 36, w = size*2, h = Math.sqrt(3)*size;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.045)';
    ctx.lineWidth = 0.8;
    const cols = Math.ceil(W/(w*0.75))+2, rows = Math.ceil(H/h)+2;
    for (let row=-1; row<rows; row++) {
      for (let col=-1; col<cols; col++) {
        const cx = col*w*0.75, cy = row*h + (col%2===0?0:h/2);
        ctx.beginPath();
        for (let i=0; i<6; i++) {
          const a = (Math.PI/180)*(60*i);
          const px = cx+size*Math.cos(a), py = cy+size*Math.sin(a);
          i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
        }
        ctx.closePath(); ctx.stroke();
      }
    }
    const vg = ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.3,W/2,H/2,Math.max(W,H)*0.7);
    vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.55)');
    ctx.fillStyle = vg; ctx.fillRect(0,0,W,H);
    ctx.restore();
  }

  // ── Cell membrane ──────────────────────────────────────
  function drawMitosisMembrane(cx, cy, shape) {
    const pulse = Math.sin(time*0.018);
    const maxR = shape.r || shape.rx || (shape.daughterR + Math.abs(shape.daughterOffsetY)) || 100;
    ctx.save();
    const aura = ctx.createRadialGradient(cx,cy,maxR*0.45,cx,cy,maxR*1.45);
    aura.addColorStop(0,'rgba(59,175,169,0.10)'); aura.addColorStop(1,'rgba(59,175,169,0)');
    ctx.fillStyle = aura; ctx.beginPath(); ctx.arc(cx,cy,maxR*1.45,0,Math.PI*2); ctx.fill();
    ctx.restore();

    if (shape.mode === 'split') {
      drawSimpleCellMembrane(cx, cy - shape.daughterOffsetY, shape.daughterR);
      drawSimpleCellMembrane(cx, cy + shape.daughterOffsetY, shape.daughterR);
      return;
    }
    ctx.save();
    ctx.beginPath();
    const N = 110;
    for (let i=0; i<=N; i++) {
      const a = (i/N)*Math.PI*2;
      const pt = cellPointAt(a,shape,cx,cy);
      const dist = Math.hypot(pt.x-cx,pt.y-cy);
      const bump = Math.sin(a*7+time*0.012)*(dist*0.012)+Math.sin(a*13-time*0.018)*(dist*0.008);
      const px = pt.x+Math.cos(a)*bump, py = pt.y+Math.sin(a)*bump;
      i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
    }
    ctx.closePath();
    const rxF = shape.r || shape.rx || 100;
    const fill = ctx.createRadialGradient(cx-rxF*0.25,cy-rxF*0.25,0,cx,cy,rxF*1.2);
    fill.addColorStop(0,'rgba(80,200,200,0.20)');
    fill.addColorStop(0.55,'rgba(59,175,169,0.16)');
    fill.addColorStop(1,'rgba(15,60,70,0.45)');
    ctx.fillStyle = fill; ctx.fill();
    ctx.shadowBlur = 28+pulse*6; ctx.shadowColor = '#3BAFA9';
    ctx.strokeStyle = '#3BAFA9'; ctx.lineWidth = 3.5+pulse*1; ctx.stroke();
    ctx.restore();
  }

  function drawSimpleCellMembrane(cx, cy, r) {
    const pulse = Math.sin(time*0.018);
    ctx.save(); ctx.beginPath();
    for (let i=0; i<=64; i++) {
      const a=(i/64)*Math.PI*2, bump=Math.sin(a*7+time*0.012)*(r*0.014);
      const px=cx+Math.cos(a)*(r+bump), py=cy+Math.sin(a)*(r+bump);
      i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
    }
    ctx.closePath();
    const fill=ctx.createRadialGradient(cx-r*0.25,cy-r*0.25,0,cx,cy,r*1.2);
    fill.addColorStop(0,'rgba(80,200,200,0.22)');
    fill.addColorStop(0.55,'rgba(59,175,169,0.18)');
    fill.addColorStop(1,'rgba(15,60,70,0.5)');
    ctx.fillStyle=fill; ctx.fill();
    ctx.shadowBlur=22+pulse*5; ctx.shadowColor='#3BAFA9';
    ctx.strokeStyle='#3BAFA9'; ctx.lineWidth=3+pulse*1; ctx.stroke();
    ctx.restore();
  }

  function drawNucleus(cx,cy,nr,alpha,dashedEnvelope) {
    if(alpha<=0) return;
    ctx.save(); ctx.globalAlpha=alpha;
    const aura=ctx.createRadialGradient(cx,cy,0,cx,cy,nr*2.2);
    aura.addColorStop(0,'rgba(168,200,240,0.30)'); aura.addColorStop(1,'rgba(168,200,240,0)');
    ctx.fillStyle=aura; ctx.beginPath(); ctx.arc(cx,cy,nr*2.2,0,Math.PI*2); ctx.fill();
    const ng=ctx.createRadialGradient(cx-nr*0.3,cy-nr*0.3,0,cx,cy,nr);
    ng.addColorStop(0,'#D6E5F8'); ng.addColorStop(0.55,'#A8C8F0'); ng.addColorStop(1,'#5B8FD4');
    ctx.beginPath(); ctx.arc(cx,cy,nr,0,Math.PI*2); ctx.fillStyle=ng;
    ctx.shadowBlur=24; ctx.shadowColor='#A8C8F0'; ctx.fill(); ctx.shadowBlur=0;
    ctx.beginPath(); ctx.ellipse(cx-nr*0.35,cy-nr*0.4,nr*0.35,nr*0.18,-0.5,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.fill();
    ctx.beginPath(); ctx.arc(cx+nr*0.15,cy+nr*0.18,nr*0.22,0,Math.PI*2);
    ctx.fillStyle='rgba(91,143,212,0.55)'; ctx.fill();
    if(dashedEnvelope) {
      ctx.beginPath(); ctx.arc(cx,cy,nr*1.18,0,Math.PI*2);
      ctx.strokeStyle=`rgba(168,200,240,${0.5*alpha})`; ctx.lineWidth=1.5;
      ctx.setLineDash([6,4]); ctx.lineDashOffset=-time*0.3; ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
  }

  function drawXChromosome(x,y,alpha,glow) {
    if(alpha<=0) return;
    ctx.save(); ctx.translate(x,y); ctx.globalAlpha=alpha;
    ctx.shadowBlur=glow?16:8; ctx.shadowColor=glow||'#9B59B6';
    const lg=ctx.createLinearGradient(0,-10,0,10);
    lg.addColorStop(0,'#B469C9'); lg.addColorStop(1,'#6C3483');
    [Math.PI/4,-Math.PI/4].forEach(rot=>{
      ctx.save(); ctx.rotate(rot); ctx.beginPath();
      ctx.roundRect(-12,-4,24,8,4); ctx.fillStyle=lg; ctx.fill(); ctx.restore();
    });
    ctx.beginPath(); ctx.ellipse(0,0,5,3,0,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.fill();
    ctx.restore();
  }

  function drawChromatinStrand(ox,oy,phaseOff,ampX,ampY,alpha) {
    if(alpha<=0) return;
    const t0=time*0.007+phaseOff, t1=time*0.009+phaseOff+1;
    ctx.save(); ctx.globalAlpha=alpha;
    ctx.strokeStyle='#B07AD0'; ctx.lineWidth=2.4; ctx.lineCap='round'; ctx.beginPath();
    ctx.moveTo(ox+Math.sin(t0)*ampX,oy+Math.cos(t1)*ampY);
    ctx.bezierCurveTo(ox+Math.sin(t0+1)*ampX,oy+Math.cos(t1+0.5)*ampY,
      ox+Math.sin(t0+2)*ampX*0.7,oy+Math.cos(t1+1)*ampY,
      ox+Math.sin(t0+3)*ampX*0.5,oy+Math.cos(t1+2)*ampY*0.7);
    ctx.stroke(); ctx.restore();
  }

  function drawSpindleFiber(pole,x,y,alpha,idx) {
    if(alpha<=0) return;
    const osc=0.25+0.15*Math.sin(time*0.03+idx);
    ctx.save(); ctx.beginPath(); ctx.moveTo(pole.x,pole.y);
    const cpx=(pole.x+x)/2+(pole.y<y?-15:15);
    ctx.quadraticCurveTo(cpx,(pole.y+y)/2,x,y);
    ctx.strokeStyle=`rgba(100,200,255,${osc*alpha})`; ctx.lineWidth=1.2; ctx.stroke(); ctx.restore();
  }

  function drawOrganelles(cx,cy,r) {
    for(let i=0;i<8;i++){
      const a=(i/8)*Math.PI*2+time*0.003;
      const rr=r*(0.55+0.08*Math.sin(time*0.01+i));
      const ox=cx+Math.cos(a)*rr, oy=cy+Math.sin(a)*rr;
      ctx.save(); ctx.translate(ox,oy); ctx.rotate(a+time*0.002);
      ctx.beginPath(); ctx.ellipse(0,0,r*0.06,r*0.035,0,0,Math.PI*2);
      ctx.fillStyle='rgba(180,150,90,0.28)'; ctx.fill();
      ctx.strokeStyle='rgba(255,210,140,0.3)'; ctx.lineWidth=1; ctx.stroke();
      ctx.restore();
    }
  }

  const CHROM_SCATTER = [{x:-0.30,y:-0.28},{x:0.32,y:-0.34},{x:-0.33,y:0.24},{x:0.28,y:0.30}];
  const CHROM_EQUATOR_X = [-0.36,-0.12,0.12,0.36];

  function drawCellContents(cx,cy,r,phase,shape) {
    const ph=phase.idx;
    if(ph===0) {
      const nr=r*0.25+Math.sin(time*0.022)*3;
      drawNucleus(cx,cy,nr,1);
      for(let i=0;i<5;i++){
        const a=(i/5)*Math.PI*2+time*0.005;
        drawChromatinStrand(cx+Math.cos(a)*nr*0.5,cy+Math.sin(a)*nr*0.5,i*1.3,nr*0.35,nr*0.28,0.55);
      }
      drawOrganelles(cx,cy,r);
    } else if(ph===1) {
      const t=easeInOut(phase.t), nucA=1-t;
      if(nucA>0) drawNucleus(cx,cy,r*0.25,nucA,true);
      CHROM_SCATTER.forEach((p,i)=>{
        const px=cx+p.x*r, py=cy+p.y*r;
        const delay=i*0.12, lp=Math.max(0,Math.min(1,(t-delay)/(1-delay)));
        drawChromatinStrand(px,py,i*1.5,r*0.11,r*0.09,1-lp);
        drawXChromosome(px,py,lp);
      });
    } else if(ph===2) {
      const t=easeInOut(phase.t);
      ctx.save();
      ctx.strokeStyle=`rgba(255,255,255,${0.05+0.18*t})`; ctx.lineWidth=1.5;
      ctx.setLineDash([6,4]); ctx.beginPath();
      ctx.moveTo(cx-r*0.92,cy); ctx.lineTo(cx+r*0.92,cy); ctx.stroke(); ctx.setLineDash([]);
      ctx.restore();
      const poles=[{x:cx,y:cy-r*0.95},{x:cx,y:cy+r*0.95}];
      CHROM_SCATTER.forEach((p,i)=>{
        const x0=cx+p.x*r,y0=cy+p.y*r,xT=cx+CHROM_EQUATOR_X[i]*r,yT=cy;
        const ax=x0+(xT-x0)*t, ay=y0+(yT-y0)*t;
        if(t>0.3) poles.forEach((pole,pi)=>drawSpindleFiber(pole,ax,ay,t,i+pi*4));
        drawXChromosome(ax,ay,1,t>0.85?'#00FFCC':null);
      });
    } else if(ph===3) {
      const t=easeInOut(phase.t), ry=r*(1+0.14*t);
      const poles=[{x:cx,y:cy-ry*0.95},{x:cx,y:cy+ry*0.95}];
      if(phase.t<0.18) {
        const la=1-phase.t/0.18; ctx.save();
        for(let i=0;i<6;i++){
          const angle=(i/6)*Math.PI*2;
          ctx.globalAlpha=la; ctx.strokeStyle='#FFD700'; ctx.lineWidth=2; ctx.beginPath();
          let px=cx,py=cy; ctx.moveTo(px,py);
          for(let s=0;s<4;s++){
            px+=Math.cos(angle+Math.sin(s*47+i*13)*0.7)*22;
            py+=Math.sin(angle+Math.sin(s*47+i*13)*0.7)*22;
            ctx.lineTo(px,py);
          }
          ctx.stroke();
        }
        ctx.restore();
      }
      CHROM_EQUATOR_X.forEach((ox,i)=>{
        const topY=cy+(cy-ry*0.78-cy)*t, botY=cy+(cy+ry*0.78-cy)*t;
        poles.forEach((pole,pi)=>drawSpindleFiber(pole,cx+ox*r,pi===0?topY:botY,1-t*0.5,i+pi*4));
        for(let tr=1;tr<=3;tr++){
          const gy1=cy+(topY-cy)*(1-tr*0.22), gy2=cy+(botY-cy)*(1-tr*0.22);
          const ga=Math.max(0,(0.16-tr*0.04)*t);
          drawXChromosome(cx+ox*r,gy1,ga); drawXChromosome(cx+ox*r,gy2,ga);
        }
        drawXChromosome(cx+ox*r,topY,1); drawXChromosome(cx+ox*r,botY,1);
      });
    } else if(ph===4) {
      const t=easeInOut(phase.t), ry=r*1.14;
      const topCY=cy-ry*0.5, botCY=cy+ry*0.5, nucR=r*(0.08+0.16*t);
      drawNucleus(cx,topCY,nucR,t,t<0.85); drawNucleus(cx,botCY,nucR,t,t<0.85);
      if(t<0.7) {
        const poles=[{x:cx,y:cy-ry*0.95},{x:cx,y:cy+ry*0.95}];
        CHROM_EQUATOR_X.forEach((ox,i)=>poles.forEach((pole,pi)=>
          drawSpindleFiber(pole,cx+ox*r,pi===0?topCY:botCY,0.45*(1-t/0.7),i+pi*4)));
      }
      CHROM_EQUATOR_X.forEach((ox,i)=>{
        const ca=1-t, sa=t*0.7;
        if(ca>0){drawXChromosome(cx+ox*r*0.6,topCY,ca);drawXChromosome(cx+ox*r*0.6,botCY,ca);}
        if(sa>0){
          drawChromatinStrand(cx+ox*r*0.5,topCY,i*1.2,r*0.08,r*0.06,sa);
          drawChromatinStrand(cx+ox*r*0.5,botCY,i*1.2+2,r*0.08,r*0.06,sa);
        }
      });
    } else if(ph===5) {
      if(shape.mode==='pinch') {
        const topCY=cy-shape.splitY*0.62, botCY=cy+shape.splitY*0.62, nucR=r*0.22;
        drawNucleus(cx,topCY,nucR,1); drawNucleus(cx,botCY,nucR,1);
        for(let i=0;i<4;i++){
          const a=(i/4)*Math.PI*2;
          drawChromatinStrand(cx+Math.cos(a)*nucR*0.5,topCY+Math.sin(a)*nucR*0.5,i*1.2,nucR*0.35,nucR*0.28,0.5);
          drawChromatinStrand(cx+Math.cos(a)*nucR*0.5,botCY+Math.sin(a)*nucR*0.5,i*1.2+1,nucR*0.35,nucR*0.28,0.5);
        }
        ctx.save();
        const pinchProg=Math.min(shape.splitY/(r*0.7),1);
        ctx.strokeStyle=`rgba(0,255,200,${0.35+0.3*Math.sin(time*0.08)})`; ctx.lineWidth=1.8;
        ctx.setLineDash([5,4]); ctx.beginPath();
        ctx.moveTo(cx-r*(0.7-pinchProg*0.5),cy); ctx.lineTo(cx+r*(0.7-pinchProg*0.5),cy);
        ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      } else if(shape.mode==='split') {
        const topCY=cy-shape.daughterOffsetY, botCY=cy+shape.daughterOffsetY, nucR=shape.daughterR*0.32;
        drawNucleus(cx,topCY,nucR,1); drawNucleus(cx,botCY,nucR,1);
        drawOrganelles(cx,topCY,shape.daughterR); drawOrganelles(cx,botCY,shape.daughterR);
        const ct=(phase.t-0.85)/0.15;
        if(ct>0&&ct<1){
          for(let i=0;i<22;i++){
            const a=(i/22)*Math.PI*2+i*0.28, rad=(40+i*6)*ct;
            const px=cx+Math.cos(a)*rad, py=cy+Math.sin(a)*rad*0.85;
            const pa=Math.max(0,1-rad/(r*1.1))*ct;
            if(pa<=0) continue;
            ctx.save(); ctx.globalAlpha=pa; ctx.beginPath();
            ctx.arc(px,py,3,0,Math.PI*2);
            ctx.fillStyle=i%2===0?'#3BAFA9':'#FFD700';
            ctx.shadowBlur=6; ctx.shadowColor=i%2===0?'#3BAFA9':'#FFD700'; ctx.fill(); ctx.restore();
          }
        }
      }
    }
  }

  function drawCell() {
    const cx=L.cellX, cy=L.cellY, r=L.cellR;
    drawMitosisMembrane(cx,cy,currentShape);
    if(currentShape.mode!=='split'){
      ctx.save();
      for(let i=0;i<56;i++){
        const a=(i/56)*Math.PI*2+time*0.001;
        const pt=cellPointAt(a,currentShape,cx,cy);
        ctx.beginPath(); ctx.arc(pt.x+Math.cos(a)*3,pt.y+Math.sin(a)*3,1.3,0,Math.PI*2);
        ctx.fillStyle='rgba(120,220,210,0.45)'; ctx.fill();
      }
      ctx.restore();
    } else {
      [-1,1].forEach(sgn=>{
        const ccy=cy+sgn*currentShape.daughterOffsetY, dr=currentShape.daughterR;
        for(let i=0;i<36;i++){
          const a=(i/36)*Math.PI*2;
          ctx.beginPath(); ctx.arc(cx+Math.cos(a)*(dr+3),ccy+Math.sin(a)*(dr+3),1.3,0,Math.PI*2);
          ctx.fillStyle='rgba(120,220,210,0.45)'; ctx.fill();
        }
      });
    }
    drawCellContents(cx,cy,r,currentPhase,currentShape);
  }

  // ── Tower drawings ─────────────────────────────────────
  function drawLysosome(cx,cy,scale,opts={}) {
    const s=scale, R=38*s;
    ctx.save(); ctx.translate(cx,cy);
    const glow=ctx.createRadialGradient(0,0,0,0,0,R*1.8);
    glow.addColorStop(0,'rgba(255,107,53,0.35)'); glow.addColorStop(1,'rgba(255,107,53,0)');
    ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(0,0,R*1.8,0,Math.PI*2); ctx.fill();
    const N=16; ctx.beginPath();
    for(let i=0;i<N;i++){
      const a=(i/N)*Math.PI*2, wob=Math.sin(a*5+time*0.04)*(R*0.08), rr=R+wob;
      const px=Math.cos(a)*rr, py=Math.sin(a)*rr;
      i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
    }
    ctx.closePath();
    const grad=ctx.createRadialGradient(-R*0.3,-R*0.3,0,0,0,R);
    grad.addColorStop(0,'#FF8A55'); grad.addColorStop(0.55,'#E84C1E'); grad.addColorStop(1,'#8B1A00');
    ctx.fillStyle=grad; ctx.shadowBlur=16*s; ctx.shadowColor='#FF6B35'; ctx.fill(); ctx.shadowBlur=0;
    ctx.beginPath(); ctx.arc(0,0,R*0.85,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,180,120,0.3)'; ctx.lineWidth=1.4*s; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(-R*0.35,-R*0.4,R*0.25,R*0.14,-0.4,0,Math.PI*2);
    ctx.fillStyle='rgba(255,230,200,0.45)'; ctx.fill();
    const ey=-R*0.1, eyeR=R*0.22, irisR=R*0.13;
    [[-R*0.28,ey],[R*0.28,ey]].forEach(([ex,eey])=>{
      ctx.beginPath(); ctx.arc(ex,eey,eyeR,0,Math.PI*2); ctx.fillStyle='#F0E8D0'; ctx.fill();
      ctx.beginPath(); ctx.arc(ex+Math.sin(time*0.008)*1.5,eey,irisR,0,Math.PI*2); ctx.fillStyle='#2B1200'; ctx.fill();
      ctx.beginPath(); ctx.arc(ex+2,eey-2,irisR*0.4,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
    });
    ctx.beginPath(); ctx.moveTo(-R*0.32,R*0.2); ctx.quadraticCurveTo(0,R*0.42,R*0.32,R*0.2);
    ctx.strokeStyle='#5C2200'; ctx.lineWidth=3*s; ctx.lineCap='round'; ctx.stroke();
    ctx.restore();
    if(!opts.noBubbles){
      for(let i=0;i<6;i++){
        const ang=(i/6)*Math.PI*2+time*0.012*(i%2===0?1:-1);
        const rad=R*(1.25+0.15*Math.sin(time*0.02+i));
        const bx=cx+Math.cos(ang)*rad, by=cy+Math.sin(ang)*rad;
        ctx.save(); ctx.beginPath(); ctx.arc(bx,by,R*0.13,0,Math.PI*2);
        ctx.fillStyle='rgba(255,220,100,0.55)'; ctx.shadowBlur=8; ctx.shadowColor='#FFDD00';
        ctx.fill(); ctx.restore();
      }
    }
  }

  function drawProteinKinase(cx,cy,scale) {
    const s=scale, bigR=36*s, smR=22*s;
    ctx.save(); ctx.translate(cx,cy);
    const glow=ctx.createRadialGradient(0,0,0,0,0,bigR*2);
    glow.addColorStop(0,'rgba(26,110,255,0.3)'); glow.addColorStop(1,'rgba(26,110,255,0)');
    ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(0,0,bigR*2,0,Math.PI*2); ctx.fill();
    const hingeX=bigR*0.95;
    const grad=ctx.createRadialGradient(0,0,0,0,0,bigR*1.6);
    grad.addColorStop(0,'#4A90FF'); grad.addColorStop(0.55,'#1A4FCC'); grad.addColorStop(1,'#091A6E');
    ctx.shadowBlur=18*s; ctx.shadowColor='#1A6EFF';
    ctx.beginPath(); ctx.ellipse(0,0,bigR,bigR*0.95,0,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill();
    ctx.beginPath(); ctx.ellipse(hingeX+smR*0.8,smR*0.6,smR,smR*0.9,0,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill();
    ctx.shadowBlur=0;
    ctx.beginPath(); ctx.arc(hingeX*0.7,smR*0.15,bigR*0.18,-Math.PI*0.6,Math.PI*0.3);
    ctx.strokeStyle='rgba(180,220,255,0.4)'; ctx.lineWidth=2.5*s; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0,0,bigR*0.85,bigR*0.8,0,0,Math.PI*2);
    ctx.strokeStyle='rgba(120,180,255,0.25)'; ctx.lineWidth=1.4*s; ctx.stroke();
    const ey=-bigR*0.1, eyeR=bigR*0.18;
    [[-bigR*0.32,ey],[-bigR*0.05,ey]].forEach(([ex,eey])=>{
      ctx.beginPath(); ctx.arc(ex,eey,eyeR,0,Math.PI*2); ctx.fillStyle='#E8F0FF'; ctx.fill();
      ctx.beginPath(); ctx.arc(ex+1,eey,eyeR*0.6,0,Math.PI*2); ctx.fillStyle='#0033CC'; ctx.fill();
      ctx.beginPath(); ctx.arc(ex+1,eey,eyeR*0.25,0,Math.PI*2); ctx.fillStyle='#000820'; ctx.fill();
      ctx.beginPath(); ctx.arc(ex+1+eyeR*0.3,eey-eyeR*0.3,eyeR*0.25,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
    });
    ctx.beginPath(); ctx.moveTo(-bigR*0.25,bigR*0.25); ctx.lineTo(bigR*0.05,bigR*0.25);
    ctx.strokeStyle='#002299'; ctx.lineWidth=3*s; ctx.lineCap='round'; ctx.stroke();
    ctx.save(); ctx.translate(hingeX+smR*0.8,smR*0.6); ctx.rotate(time*0.006);
    ctx.beginPath(); ctx.arc(0,0,smR*0.5,0,Math.PI*2);
    ctx.strokeStyle='#FFD700'; ctx.lineWidth=1.5*s; ctx.shadowBlur=10; ctx.shadowColor='#FFD700'; ctx.stroke();
    ctx.shadowBlur=0; ctx.font=`bold ${10*s}px 'Courier New'`; ctx.fillStyle='#FFD700';
    ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('~P',0,0); ctx.restore();
    ctx.restore();
    for(let i=0;i<5;i++){
      const ang=(i/5)*Math.PI*2+time*0.014;
      const orbR=bigR*(1.55+0.1*Math.sin(time*0.02+i));
      const ox=cx+Math.cos(ang)*orbR, oy=cy+Math.sin(ang)*orbR*0.85;
      ctx.save(); ctx.beginPath(); ctx.arc(ox,oy,bigR*0.1,0,Math.PI*2);
      ctx.fillStyle='#FFD700'; ctx.shadowBlur=10; ctx.shadowColor='#FFD700'; ctx.fill(); ctx.restore();
    }
  }

  function drawRepairEnzyme(cx,cy,scale) {
    const s=scale, OR=40*s, IR=22*s;
    ctx.save(); ctx.translate(cx,cy);
    const glow=ctx.createRadialGradient(0,0,0,0,0,OR*1.8);
    glow.addColorStop(0,'rgba(46,204,113,0.32)'); glow.addColorStop(1,'rgba(46,204,113,0)');
    ctx.fillStyle=glow; ctx.beginPath(); ctx.arc(0,0,OR*1.8,0,Math.PI*2); ctx.fill();
    const gap=0.7;
    const grad=ctx.createRadialGradient(0,0,0,0,0,OR);
    grad.addColorStop(0,'#3FDB7E'); grad.addColorStop(0.55,'#1A8A4A'); grad.addColorStop(1,'#0A3D22');
    ctx.beginPath();
    ctx.arc(0,0,OR,-gap,gap,true);
    ctx.lineTo(Math.cos(gap)*IR,Math.sin(gap)*IR);
    ctx.arc(0,0,IR,gap,-gap,false);
    ctx.closePath(); ctx.fillStyle=grad; ctx.shadowBlur=18*s; ctx.shadowColor='#2ECC71'; ctx.fill();
    ctx.shadowBlur=0; ctx.strokeStyle='rgba(80,200,120,0.3)'; ctx.lineWidth=1.4*s; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.rect(IR*0.6,-IR*0.7,OR-IR*0.6+4,IR*1.4); ctx.clip();
    const dnaOff=(time*0.6)%24;
    for(let w=0;w<2;w++){
      const color=w===0?'#FF99AA':'#99AAFF';
      for(let i=0;i<8;i++){
        const xb=IR*0.6+i*(8*s)-dnaOff, phase=(xb+dnaOff)/(28*s)*Math.PI*2;
        ctx.beginPath(); ctx.arc(xb,Math.sin(phase+w*Math.PI)*(IR*0.35),2.2*s,0,Math.PI*2);
        ctx.fillStyle=color; ctx.fill();
      }
    }
    for(let i=0;i<4;i++){
      const xb=IR*0.6+i*(16*s)-dnaOff*0.7;
      ctx.beginPath(); ctx.moveTo(xb,-IR*0.45); ctx.lineTo(xb,IR*0.45);
      ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1; ctx.stroke();
    }
    ctx.restore();
    for(let i=0;i<4;i++){
      const a=(i/4)*(Math.PI*2-gap*2)+gap+Math.PI+time*0.015;
      if(a>-gap&&a<gap) continue;
      const sx=Math.cos(a)*IR, sy=Math.sin(a)*IR;
      ctx.save(); ctx.translate(sx,sy); ctx.fillStyle='#AAFFCC'; ctx.shadowBlur=8; ctx.shadowColor='#2ECC71';
      ctx.beginPath();
      for(let j=0;j<8;j++){
        const aa=(j/8)*Math.PI*2, r=j%2===0?3.5*s:1.5*s;
        j===0?ctx.moveTo(Math.cos(aa)*r,Math.sin(aa)*r):ctx.lineTo(Math.cos(aa)*r,Math.sin(aa)*r);
      }
      ctx.closePath(); ctx.fill(); ctx.restore();
    }
    const ey=-OR*0.22, eyeR=OR*0.16;
    [[-OR*0.48,ey],[-OR*0.18,ey]].forEach(([ex,eey])=>{
      ctx.beginPath(); ctx.arc(ex,eey,eyeR,0,Math.PI*2); ctx.fillStyle='#F5FFF8'; ctx.fill();
      ctx.beginPath(); ctx.arc(ex+1.5,eey,eyeR*0.6,0,Math.PI*2); ctx.fillStyle='#0A5C36'; ctx.fill();
      ctx.beginPath(); ctx.arc(ex+1.5,eey,eyeR*0.25,0,Math.PI*2); ctx.fillStyle='#001A0A'; ctx.fill();
      ctx.beginPath(); ctx.arc(ex+1.5+eyeR*0.35,eey-eyeR*0.35,eyeR*0.3,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
    });
    ctx.beginPath(); ctx.ellipse(-OR*0.33,OR*0.12,OR*0.16,OR*0.06,0,0,Math.PI*2);
    ctx.fillStyle='#001A0A'; ctx.fill();
    ctx.save(); ctx.translate(-OR*0.33,OR*0.45); ctx.fillStyle='#AAFFCC';
    ctx.shadowBlur=6; ctx.shadowColor='#2ECC71';
    ctx.fillRect(-6*s,-2*s,12*s,4*s); ctx.fillRect(-2*s,-6*s,4*s,12*s); ctx.restore();
    ctx.restore();
  }

  // ── Enemy drawings ─────────────────────────────────────
  function drawViralHijacker(cx,cy,scale,walkCycle) {
    const s=scale, R=30*s;
    function hexV(i,r){const a=(i*60-90)*Math.PI/180;return{x:Math.cos(a)*r,y:Math.sin(a)*r};}
    const verts=Array.from({length:6},(_,i)=>hexV(i,R));
    const lerpPt=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
    const attachPts=[
      lerpPt(verts[2],verts[3],0.3),lerpPt(verts[2],verts[3],0.7),
      lerpPt(verts[3],verts[4],0.25),lerpPt(verts[3],verts[4],0.75),
      lerpPt(verts[4],verts[5],0.3),lerpPt(verts[4],verts[5],0.7),
    ];
    ctx.save(); ctx.translate(cx,cy);
    const tilt=-0.05+Math.sin(walkCycle*0.5)*0.04; ctx.rotate(tilt);
    for(let i=0;i<6;i++){
      const phaseOff=(i/6)*Math.PI*2, cycle=(walkCycle+phaseOff)%(Math.PI*2), norm=cycle/(Math.PI*2);
      const UL=16*s, LL=13*s;
      let upper,lower,lift;
      if(norm<0.4){const p=norm/0.4;upper=lerp(0.3,-0.6,p);lower=lerp(0.4,-0.3,p);lift=Math.sin(p*Math.PI)*14*s;}
      else if(norm<0.6){const p=(norm-0.4)/0.2;upper=lerp(-0.6,0.05,p);lower=lerp(-0.3,0.15,p);lift=lerp(14*s,0,p);}
      else{const p=(norm-0.6)/0.4;upper=lerp(0.05,0.3,p);lower=lerp(0.15,0.05,p);lift=0;}
      const att=attachPts[i];
      const kx=att.x+Math.sin(upper)*UL, ky=att.y+Math.cos(upper)*UL;
      const fx=kx+Math.sin(upper+lower)*LL, fy=ky+Math.cos(upper+lower)*LL-lift;
      ctx.beginPath(); ctx.moveTo(att.x,att.y); ctx.lineTo(kx,ky);
      ctx.strokeStyle='#6A00CC'; ctx.lineWidth=3*s; ctx.lineCap='round'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(kx,ky); ctx.lineTo(fx,fy);
      ctx.strokeStyle='#3D0073'; ctx.lineWidth=2.4*s; ctx.stroke();
      ctx.beginPath(); ctx.arc(fx,fy,3*s,0,Math.PI*2);
      ctx.fillStyle='#39FF14'; ctx.shadowBlur=6; ctx.shadowColor='#39FF14'; ctx.fill(); ctx.shadowBlur=0;
    }
    const g=ctx.createRadialGradient(0,0,0,0,0,R);
    g.addColorStop(0,'#6A00CC'); g.addColorStop(0.5,'#3D0073'); g.addColorStop(1,'#1A0033');
    ctx.beginPath();
    for(let i=0;i<6;i++){const a=(i*60-90)*Math.PI/180;i===0?ctx.moveTo(Math.cos(a)*R,Math.sin(a)*R):ctx.lineTo(Math.cos(a)*R,Math.sin(a)*R);}
    ctx.closePath(); ctx.fillStyle=g; ctx.shadowBlur=14*s; ctx.shadowColor='#8B00FF'; ctx.fill();
    ctx.strokeStyle='#8B00FF'; ctx.lineWidth=2*s; ctx.stroke(); ctx.shadowBlur=0;
    ctx.save(); ctx.rotate(-time*0.006);
    const ir=R*0.55; ctx.beginPath();
    for(let i=0;i<6;i++){const a=(i*60-60)*Math.PI/180;i===0?ctx.moveTo(Math.cos(a)*ir,Math.sin(a)*ir):ctx.lineTo(Math.cos(a)*ir,Math.sin(a)*ir);}
    ctx.closePath(); ctx.strokeStyle='rgba(57,255,20,0.5)'; ctx.lineWidth=1.4*s; ctx.stroke(); ctx.restore();
    ctx.strokeStyle='rgba(57,255,20,0.55)'; ctx.lineWidth=1.6*s; ctx.lineCap='round';
    [[10,-10,18,-2],[18,2,26,10],[8,8,16,16]].forEach(([x1,y1,x2,y2])=>{
      ctx.beginPath(); ctx.moveTo(x1*s,y1*s); ctx.lineTo(x2*s,y2*s); ctx.stroke();
    });
    const lex=-7*s, ley=-3*s;
    ctx.beginPath(); ctx.arc(lex,ley,9*s,0,Math.PI*2); ctx.fillStyle='#FFE566';
    ctx.shadowBlur=5; ctx.shadowColor='#FFE566'; ctx.fill(); ctx.shadowBlur=0;
    ctx.beginPath(); ctx.arc(lex,ley,5.5*s,0,Math.PI*2); ctx.fillStyle='#CC0000'; ctx.fill();
    ctx.beginPath(); ctx.ellipse(lex,ley,2*s,5*s,0,0,Math.PI*2); ctx.fillStyle='#000'; ctx.fill();
    const rex=7*s, rey=-4*s;
    ctx.save(); ctx.beginPath(); ctx.rect(rex-7*s,rey,14*s,14*s); ctx.clip();
    ctx.beginPath(); ctx.arc(rex,rey,6*s,0,Math.PI*2); ctx.fillStyle='#FFE566'; ctx.fill();
    ctx.beginPath(); ctx.arc(rex,rey,3.5*s,0,Math.PI*2); ctx.fillStyle='#CC0000'; ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(-12*s,9*s); ctx.quadraticCurveTo(-3*s,15*s,9*s,8*s);
    ctx.strokeStyle='#39FF14'; ctx.lineWidth=2.4*s; ctx.lineCap='round';
    ctx.shadowBlur=6; ctx.shadowColor='#39FF14'; ctx.stroke(); ctx.shadowBlur=0;
    ctx.restore();
  }

  function drawToxinDroplet(cx,cy,scale,bouncePhase) {
    const s=scale, rawBounce=Math.sin(bouncePhase);
    const squash=Math.max(0,-rawBounce)*10*s, slosh=Math.sin(bouncePhase*2+0.3)*4*s;
    ctx.save(); ctx.translate(cx,cy+(rawBounce>0?rawBounce*4*s:0));
    ctx.rotate(rawBounce>0.3?-0.06:0.02);
    const base=[[0,-34],[-14,-24],[-23,-5],[-25,14],[-19,26],[-8,32],[8,32],[19,26],[25,14],[23,-5],[14,-24],[5,-32.5]].map(([x,y])=>({x:x*s,y:y*s}));
    const N=base.length; ctx.beginPath();
    for(let i=0;i<N;i++){
      const p=base[i], nxt=base[(i+1)%N];
      let dy=0,dx=0;
      if(p.y>0) dy+=squash*(p.y/(32*s));
      if(p.y<-20*s) dy-=squash*0.3*(-p.y/(34*s));
      if(Math.abs(p.x)>10*s) dx+=Math.sign(p.x)*squash*0.3;
      if(p.x<0) dx-=slosh*0.6; if(p.x>0) dx+=slosh*0.6;
      const cur={x:p.x+dx,y:p.y+dy};
      const ndy=nxt.y>0?squash*(nxt.y/(32*s)):0;
      const next={x:nxt.x+Math.sign(nxt.x)*slosh*0.6,y:nxt.y+ndy};
      const cpx=(cur.x+next.x)/2, cpy=(cur.y+next.y)/2;
      i===0?ctx.moveTo(cur.x,cur.y):null;
      ctx.quadraticCurveTo(cur.x,cur.y,cpx,cpy);
    }
    ctx.closePath();
    const grad=ctx.createRadialGradient(0,-5*s,0,0,-5*s,38*s);
    grad.addColorStop(0,'#B8FF4A'); grad.addColorStop(0.3,'#7FFF00'); grad.addColorStop(0.6,'#3A8C00'); grad.addColorStop(1,'#0A1F00');
    ctx.fillStyle=grad; ctx.shadowBlur=14*s; ctx.shadowColor='#7FFF00'; ctx.fill(); ctx.shadowBlur=0;
    ctx.save(); ctx.globalAlpha=0.22; ctx.translate(-8*s,-18*s); ctx.rotate(-0.5);
    ctx.beginPath(); ctx.ellipse(0,0,12*s,7*s,0,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill(); ctx.restore();
    [[-10*s,-11*s],[6*s,-11*s]].forEach(([ex,ey])=>{
      const SR=7*s;
      ctx.beginPath(); ctx.arc(ex,ey,SR,0,Math.PI*2); ctx.fillStyle='#D4FF80'; ctx.fill();
      ctx.beginPath(); ctx.arc(ex,ey+2,SR*0.55,0,Math.PI*2); ctx.fillStyle='#1A5C00'; ctx.fill();
      ctx.beginPath(); ctx.arc(ex,ey+2,SR*0.28,0,Math.PI*2); ctx.fillStyle='#050F00'; ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.rect(ex-SR-1,ey-SR-1,SR*2+2,SR+1); ctx.clip();
      ctx.beginPath(); ctx.rect(ex-SR-1,ey-SR-1,SR*2+2,SR*0.6); ctx.fillStyle='#2a6800'; ctx.fill();
      ctx.beginPath(); ctx.moveTo(ex-SR,ey-SR*0.4); ctx.quadraticCurveTo(ex,ey-SR*0.2,ex+SR,ey-SR*0.4);
      ctx.strokeStyle='#1a4500'; ctx.lineWidth=1.5; ctx.stroke(); ctx.restore();
    });
    [[-10*s,-19*s,-0.38],[6*s,-19*s,0.38]].forEach(([bx,by,rot])=>{
      ctx.save(); ctx.translate(bx,by); ctx.rotate(rot); ctx.beginPath();
      ctx.moveTo(-8*s,-2); ctx.lineTo(8*s,-2); ctx.lineTo(6*s,2); ctx.lineTo(-6*s,2); ctx.closePath();
      ctx.fillStyle='#0A2800'; ctx.fill(); ctx.restore();
    });
    ctx.beginPath(); ctx.moveTo(-14*s,4*s); ctx.quadraticCurveTo(-2*s,9*s,12*s,4*s);
    ctx.strokeStyle='#0A2800'; ctx.lineWidth=3*s; ctx.lineCap='round'; ctx.stroke();
    [-9*s,0,9*s].forEach((dx,idx)=>{
      const len=(3+idx*2+Math.sin(time*0.04+idx)*2)*s;
      const ax=dx, ay=32*s;
      ctx.beginPath(); ctx.moveTo(ax,ay);
      ctx.quadraticCurveTo(ax+2,ay+len*0.5,ax,ay+len);
      ctx.quadraticCurveTo(ax-2,ay+len*0.5,ax,ay);
      ctx.fillStyle='rgba(127,255,0,0.6)'; ctx.fill();
    });
    ctx.restore();
  }

  function drawRadiationPulse(cx,cy,scale) {
    const s=scale, CR=26*s;
    ctx.save(); ctx.translate(cx,cy);
    for(let r=0;r<3;r++){
      const phase=((time*0.6+r*30)%90)/90;
      const rad=lerp(CR*1.1,CR*2.4,phase), op=lerp(0.45,0,phase);
      ctx.save(); ctx.beginPath(); ctx.arc(0,0,rad,0,Math.PI*2);
      ctx.strokeStyle=`rgba(255,179,0,${op})`; ctx.lineWidth=1.5; ctx.setLineDash([5,7]); ctx.stroke(); ctx.restore();
    }
    for(let i=0;i<8;i++){
      const baseAng=(i/8)*Math.PI*2, finLen=(16+Math.sin(time*0.06+i)*9)*s;
      const halfSpread=9*Math.PI/180, la=baseAng-halfSpread, ra=baseAng+halfSpread;
      const bl={x:Math.cos(la)*CR,y:Math.sin(la)*CR}, br={x:Math.cos(ra)*CR,y:Math.sin(ra)*CR};
      const tip={x:Math.cos(baseAng)*(CR+finLen),y:Math.sin(baseAng)*(CR+finLen)};
      const perpX=-Math.sin(baseAng), perpY=Math.cos(baseAng);
      const midDist=finLen*0.7, midX=Math.cos(baseAng)*(CR+midDist), midY=Math.sin(baseAng)*(CR+midDist);
      const cpL={x:midX+perpX*8*s,y:midY+perpY*8*s}, cpR={x:midX-perpX*8*s,y:midY-perpY*8*s};
      const grad=ctx.createLinearGradient((bl.x+br.x)/2,(bl.y+br.y)/2,tip.x,tip.y);
      grad.addColorStop(0,'rgba(255,150,0,0.75)'); grad.addColorStop(1,'rgba(255,253,224,0)');
      ctx.beginPath(); ctx.moveTo(bl.x,bl.y);
      ctx.bezierCurveTo(cpL.x,cpL.y,tip.x,tip.y,tip.x,tip.y);
      ctx.bezierCurveTo(tip.x,tip.y,cpR.x,cpR.y,br.x,br.y);
      ctx.closePath(); ctx.fillStyle=grad; ctx.shadowBlur=8; ctx.shadowColor='#FFB300'; ctx.fill(); ctx.shadowBlur=0;
    }
    const pts=[];
    for(let i=0;i<10;i++){const a=(i/10)*Math.PI*2,off=Math.sin(time*0.05+i)*3*s;pts.push({x:Math.cos(a)*(CR+off),y:Math.sin(a)*(CR+off)});}
    const grad=ctx.createRadialGradient(0,0,0,0,0,CR+6*s);
    grad.addColorStop(0,'#FFFDE0'); grad.addColorStop(0.3,'#FFD700'); grad.addColorStop(0.65,'#FF6600'); grad.addColorStop(1,'#7A1500');
    ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y);
    for(let i=0;i<10;i++){const next=pts[(i+1)%10];ctx.quadraticCurveTo(pts[i].x,pts[i].y,(pts[i].x+next.x)/2,(pts[i].y+next.y)/2);}
    ctx.closePath(); ctx.fillStyle=grad; ctx.shadowBlur=24; ctx.shadowColor='#FFB300'; ctx.fill(); ctx.shadowBlur=0;
    ctx.save(); ctx.rotate(time*0.04); ctx.beginPath(); ctx.arc(0,0,CR*0.45,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,253,224,0.5)'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.rotate(-time*0.03); ctx.beginPath(); ctx.arc(0,0,CR*0.7,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,200,50,0.35)'; ctx.lineWidth=1.5; ctx.setLineDash([3,5]); ctx.stroke(); ctx.restore();
    ctx.setLineDash([]);
    [[-CR*0.35,-CR*0.1],[CR*0.35,-CR*0.1]].forEach(([ex,ey],i)=>{
      const outR=(5+Math.sin(time*0.1+i)*0.8)*s;
      ctx.beginPath(); ctx.arc(ex,ey,outR,0,Math.PI*2);
      ctx.strokeStyle='#FF6600'; ctx.lineWidth=1.8; ctx.shadowBlur=10; ctx.shadowColor='#FFB300'; ctx.stroke();
      ctx.beginPath(); ctx.arc(ex,ey,outR*0.5,0,Math.PI*2);
      ctx.strokeStyle='#FFFDE0'; ctx.lineWidth=1.2; ctx.stroke(); ctx.shadowBlur=0;
      ctx.beginPath(); ctx.arc(ex,ey,1.5*s,0,Math.PI*2); ctx.fillStyle='#FFFFFF'; ctx.fill();
    });
    [[-CR*0.35,-CR*0.35],[CR*0.35,-CR*0.35]].forEach(([bx,by])=>{
      ctx.beginPath(); ctx.moveTo(bx-5*s,by); ctx.lineTo(bx,by-3*s); ctx.lineTo(bx+5*s,by);
      ctx.strokeStyle='rgba(255,200,50,0.8)'; ctx.lineWidth=1.8; ctx.lineCap='round'; ctx.stroke();
    });
    ctx.restore();
  }

  // ── Utility ────────────────────────────────────────────
  function roundRect(x,y,w,h,r) {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
  }

  // ── Shop panel ─────────────────────────────────────────
  function drawShopPanel() {
    const x=L.shopX, y=L.shopY, w=L.shopW, h=L.shopH;
    ctx.save();
    const bg=ctx.createLinearGradient(x,y,x+w,y);
    bg.addColorStop(0,'#0F2010'); bg.addColorStop(0.5,'#1A2E1A'); bg.addColorStop(1,'#142519');
    ctx.fillStyle=bg; ctx.fillRect(x,y,w,h);
    for(let i=0;i<22;i++){
      const sy=y+(i/22)*h+Math.sin(i*1.3)*8;
      ctx.beginPath(); ctx.moveTo(x,sy);
      ctx.bezierCurveTo(x+w*0.3,sy+Math.sin(i*0.7)*6,x+w*0.7,sy+Math.cos(i*0.9)*8,x+w,sy+Math.sin(i*0.5)*5);
      ctx.strokeStyle=`rgba(${30+(i%3)*8},${50+(i%5)*6},${30+(i%3)*5},${0.25+(i%4)*0.04})`;
      ctx.lineWidth=0.8+(i%3)*0.3; ctx.stroke();
    }
    for(let i=0;i<5;i++){
      const kx=x+20+(i*47)%(w-40), ky=y+40+(i*113)%(h-80), kr=4+(i%3);
      ctx.beginPath(); ctx.arc(kx,ky,kr,0,Math.PI*2); ctx.fillStyle='rgba(20,40,20,0.5)'; ctx.fill();
    }
    const bevel=ctx.createLinearGradient(x+w-6,y,x+w,y);
    bevel.addColorStop(0,'rgba(0,0,0,0)'); bevel.addColorStop(1,'rgba(0,0,0,0.6)');
    ctx.fillStyle=bevel; ctx.fillRect(x+w-6,y,6,h);
    ctx.strokeStyle='rgba(80,160,90,0.18)'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(x+w-1,y); ctx.lineTo(x+w-1,y+h); ctx.stroke();
    ctx.restore();

    ctx.save(); ctx.font=`bold 14px 'Courier New', monospace`;
    ctx.fillStyle='#9BD49F'; ctx.textAlign='center'; ctx.fillText('▼ DEFENDERS ▼',x+w/2,y+22);
    ctx.restore();

    const cardW=w-28, cardX=x+14, startY=y+40, cardH=(h-70)/3, gap=10;
    const towers=[
      {id:'lysosome',     name:'LYSOSOME',    cost:'80 ATP',  color:'#FF6B35', drawFn:drawLysosome},
      {id:'proteinKinase',name:'PROTEIN KIN',cost:'120 ATP', color:'#1A6EFF', drawFn:drawProteinKinase},
      {id:'repairEnzyme', name:'REPAIR ENZ',  cost:'100 ATP', color:'#2ECC71', drawFn:drawRepairEnzyme},
    ];
    towers.forEach((t,i)=>{
      const cy=startY+i*(cardH+gap);
      drawTowerCard(cardX,cy,cardW,cardH-gap,t,st.selectedTower===t.id);
    });
  }

  function drawTowerCard(x,y,w,h,t,selected) {
    ctx.save();
    const bg=ctx.createLinearGradient(x,y,x,y+h);
    bg.addColorStop(0,selected?'#2a4a2a':'#1F3520');
    bg.addColorStop(1,selected?'#162216':'#0F1F10');
    ctx.fillStyle=bg; roundRect(x,y,w,h,10); ctx.fill();
    ctx.strokeStyle=t.color; ctx.lineWidth=selected?3.5:2.5;
    ctx.shadowBlur=selected?22:14; ctx.shadowColor=t.color;
    roundRect(x+1,y+1,w-2,h-2,10); ctx.stroke(); ctx.shadowBlur=0;
    ctx.strokeStyle=`${t.color}55`; ctx.lineWidth=1;
    roundRect(x+6,y+6,w-12,h-12,7); ctx.stroke();
    const iconSize=Math.min(w*0.6,h*0.55);
    const ix=x+w/2, iy=y+iconSize*0.55+4, sc=iconSize/110;
    ctx.beginPath(); ctx.arc(ix,iy+iconSize*0.18,iconSize*0.18,0,Math.PI*2);
    ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.fill();
    t.drawFn(ix,iy,sc,{noBubbles:true});
    ctx.fillStyle=t.color; ctx.font=`bold 12px 'Courier New', monospace`;
    ctx.textAlign='center'; ctx.fillText(t.name,ix,y+h-26);
    ctx.fillStyle='#FFD700'; ctx.font=`bold 11px 'Courier New', monospace`;
    ctx.fillText('⚡ '+t.cost,ix,y+h-10);
    ctx.restore();
  }

  // ── HUD ───────────────────────────────────────────────
  function drawHUD() {
    const h=L.hudH, phaseIdx=currentPhase.idx;
    ctx.save();
    ctx.fillStyle='rgba(0,0,0,0.68)'; ctx.fillRect(0,0,W,h);
    const grad=ctx.createLinearGradient(0,h-2,0,h);
    grad.addColorStop(0,'rgba(59,175,169,0)'); grad.addColorStop(1,'rgba(59,175,169,0.5)');
    ctx.fillStyle=grad; ctx.fillRect(0,h-2,W,2);
    const dotsStart=20;
    for(let i=0;i<6;i++){
      const dx=dotsStart+i*22, dy=h/2;
      ctx.beginPath(); ctx.arc(dx,dy,7,0,Math.PI*2);
      if(i===phaseIdx){
        const pulse=0.6+0.4*Math.abs(Math.sin(time*0.06));
        ctx.shadowBlur=14*pulse; ctx.shadowColor=MITOSIS_COLORS[i];
        ctx.fillStyle=MITOSIS_COLORS[i];
      } else if(i<phaseIdx){
        ctx.shadowBlur=0; ctx.fillStyle=MITOSIS_COLORS[i];
      } else {
        ctx.shadowBlur=0; ctx.fillStyle='#2a3340'; ctx.strokeStyle='#3a4350';
      }
      ctx.fill(); if(i>phaseIdx) ctx.stroke(); ctx.shadowBlur=0;
    }
    {
      const dx=dotsStart+phaseIdx*22, dy=h/2+12;
      ctx.fillStyle='rgba(255,255,255,0.18)'; roundRect(dx-8,dy,16,2,1); ctx.fill();
      ctx.fillStyle=MITOSIS_COLORS[phaseIdx]; roundRect(dx-8,dy,16*currentPhase.t,2,1); ctx.fill();
    }
    ctx.font=`bold 18px 'Courier New', monospace`; ctx.textBaseline='middle'; ctx.textAlign='left';
    ctx.fillStyle=MITOSIS_COLORS[phaseIdx]; ctx.shadowBlur=8; ctx.shadowColor=MITOSIS_COLORS[phaseIdx];
    ctx.fillText(MITOSIS_NAMES[phaseIdx],dotsStart+6*22+14,h/2); ctx.shadowBlur=0;
    const mid=W*0.5, hpX=mid-60;
    ctx.fillStyle='#FF6B6B'; ctx.font=`bold 16px 'Courier New', monospace`;
    ctx.fillText('❤',hpX,h/2); ctx.fillStyle='#ffffff'; ctx.fillText(' HP:',hpX+16,h/2);
    const barX=hpX+60, barY=h/2-7, barW=110, barH=14;
    ctx.fillStyle='rgba(0,0,0,0.5)'; roundRect(barX,barY,barW,barH,4); ctx.fill();
    const hpVal=Math.max(0,Math.min(100,st.hp));
    const fillW=(hpVal/st.maxHp)*(barW-2);
    const hpGrad=ctx.createLinearGradient(barX,0,barX+barW,0);
    hpGrad.addColorStop(0,'#FF8080'); hpGrad.addColorStop(1,'#CC2020');
    ctx.fillStyle=hpGrad; roundRect(barX+1,barY+1,fillW,barH-2,3); ctx.fill();
    ctx.fillStyle='#fff'; ctx.font=`bold 11px 'Courier New', monospace`;
    ctx.textAlign='center'; ctx.shadowBlur=3; ctx.shadowColor='rgba(0,0,0,0.9)';
    ctx.fillText(`${st.hp} / ${st.maxHp}`,barX+barW/2,h/2); ctx.shadowBlur=0;
    const atpX=barX+barW+28;
    ctx.font=`bold 16px 'Courier New', monospace`; ctx.fillStyle='#FFD700'; ctx.textAlign='left';
    ctx.shadowBlur=8; ctx.shadowColor='#FFD700'; ctx.fillText('⚡',atpX,h/2); ctx.shadowBlur=0;
    ctx.fillStyle='#ffffff'; ctx.fillText(' ATP:',atpX+16,h/2);
    ctx.fillStyle='#FFD700'; ctx.fillText(`${st.atp}`,atpX+70,h/2);
    ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font=`12px 'Courier New', monospace`;
    ctx.fillText(`WAVE ${String(st.wave).padStart(2,'0')} / ${st.totalWaves}`,atpX+130,h/2);
    // Pause button
    const pbX=W-56, pbY=h/2-18;
    L.pauseBtn={x:pbX,y:pbY,w:36,h:36};
    ctx.strokeStyle='#FF8C42'; ctx.lineWidth=1.5; ctx.shadowBlur=8; ctx.shadowColor='#FF8C42';
    roundRect(pbX,pbY,36,36,8); ctx.stroke(); ctx.shadowBlur=0;
    ctx.fillStyle='#FF8C42'; ctx.fillRect(pbX+11,pbY+10,4,16); ctx.fillRect(pbX+21,pbY+10,4,16);
    ctx.fillStyle='rgba(255,255,255,0.45)'; ctx.font=`10px 'Courier New', monospace`;
    ctx.textAlign='right'; ctx.fillText('● LIVE',pbX-14,h/2);
    ctx.restore();
  }

  // ── Wave queue ─────────────────────────────────────────
  function drawWaveQueue() {
    const pad=16, w=250, hh=90;
    const x=L.arenaX+L.arenaW-w-pad, y=L.arenaY+L.arenaH-hh-pad;
    ctx.save();
    roundRect(x,y,w,hh,10); ctx.fillStyle='rgba(0,0,0,0.72)'; ctx.fill();
    ctx.strokeStyle='rgba(59,175,169,0.5)'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.fillStyle='#3BAFA9'; ctx.font=`bold 11px 'Courier New', monospace`;
    ctx.textAlign='left'; ctx.textBaseline='top'; ctx.fillText('NEXT WAVE',x+14,y+10);
    const iconY=y+38;
    let ix=x+14;
    const enemies=st.nextWaveEnemies.length>0?st.nextWaveEnemies:[{type:'viral',count:3},{type:'toxin',count:1}];
    enemies.forEach(e=>{
      for(let i=0;i<e.count;i++){
        ctx.save(); ctx.translate(ix+11,iconY);
        if(e.type==='viral'||e.type==='viralHijacker'){
          ctx.fillStyle='#8B00FF'; ctx.beginPath();
          for(let k=0;k<6;k++){const a=(k*60-90)*Math.PI/180;k===0?ctx.moveTo(Math.cos(a)*9,Math.sin(a)*9):ctx.lineTo(Math.cos(a)*9,Math.sin(a)*9);}
          ctx.closePath(); ctx.fill(); ctx.strokeStyle='#BB66FF'; ctx.lineWidth=1; ctx.stroke();
        } else {
          ctx.fillStyle='#7FFF00'; ctx.beginPath(); ctx.ellipse(0,2,8,11,0,0,Math.PI*2);
          ctx.fill(); ctx.strokeStyle='#B8FF4A'; ctx.lineWidth=1; ctx.stroke();
        }
        ctx.restore(); ix+=26;
      }
    });
    const cbX=x+14, cbY=y+hh-22, cbW=w-28, cbH=10;
    ctx.fillStyle='rgba(0,0,0,0.5)'; roundRect(cbX,cbY,cbW,cbH,5); ctx.fill();
    const fillPct=st.waveCountdownMax>0?1-(st.waveCountdown/st.waveCountdownMax):0.62+0.05*Math.sin(time*0.04);
    const fillGrad=ctx.createLinearGradient(cbX,0,cbX+cbW,0);
    fillGrad.addColorStop(0,'#FFB300'); fillGrad.addColorStop(1,'#FF6B35');
    ctx.fillStyle=fillGrad; roundRect(cbX+1,cbY+1,(cbW-2)*fillPct,cbH-2,4); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font=`9px 'Courier New', monospace`;
    ctx.textAlign='right';
    const sec=st.waveCountdown;
    ctx.fillText(`00:${String(sec).padStart(2,'0')}`,cbX+cbW,cbY-4);
    ctx.restore();
  }

  // ── Mutation log ───────────────────────────────────────
  function drawMutationLog() {
    const pad=16, x=L.arenaX+pad, y=L.arenaY+L.arenaH-80;
    const chipW=190, chipH=28, gap=6;
    const chips=st.mutations.length>0?st.mutations.map(m=>`⚠ ${m.toUpperCase()}`):['⚠ POINT MUTATION','⚠ CHROMATIN BRIDGE'];
    if(st.mutations.length===0&&!L._debugMutations) return; // only show if real mutations
    chips.slice(0,4).forEach((label,i)=>{
      const cy=y+i*(chipH+gap), pulseAlpha=0.5+0.35*Math.sin(time*0.06+i*1.3);
      ctx.save(); ctx.shadowBlur=14; ctx.shadowColor=`rgba(255,40,40,${pulseAlpha})`;
      roundRect(x,cy,chipW,chipH,6); ctx.fillStyle='rgba(80,10,10,0.78)'; ctx.fill();
      ctx.shadowBlur=0; ctx.strokeStyle=`rgba(255,80,80,${pulseAlpha})`; ctx.lineWidth=1.4; ctx.stroke();
      ctx.fillStyle='#FF9090'; ctx.font=`bold 11px 'Courier New', monospace`;
      ctx.textAlign='left'; ctx.textBaseline='middle'; ctx.fillText(label,x+12,cy+chipH/2);
      ctx.restore();
    });
    if(chips.length>0){
      ctx.save(); ctx.fillStyle='rgba(255,120,120,0.7)'; ctx.font=`bold 10px 'Courier New', monospace`;
      ctx.textAlign='left'; ctx.fillText('MUTATION LOG',x,y-8); ctx.restore();
    }
  }

  // ── ATP pickups ────────────────────────────────────────
  function initATP() {
    atpPickups.length=0;
    const baseX=L.arenaX+L.arenaW*0.55, baseY=L.arenaY+L.arenaH*0.78;
    [[baseX-30,baseY+8],[baseX+22,baseY-12],[baseX-8,baseY+28],[baseX+40,baseY+18]].forEach(([px,py],i)=>{
      atpPickups.push({x:px,y:py,phase:i*0.7,bob:rng(0.04,0.06)});
    });
  }

  function drawATP() {
    atpPickups.forEach(p=>{
      const bob=Math.sin(time*p.bob+p.phase)*3, pulse=0.7+0.3*Math.sin(time*0.08+p.phase);
      ctx.save(); ctx.translate(p.x,p.y+bob);
      const g=ctx.createRadialGradient(0,0,0,0,0,18);
      g.addColorStop(0,`rgba(220,255,80,${0.4*pulse})`); g.addColorStop(1,'rgba(220,255,80,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(0,0,18,0,Math.PI*2); ctx.fill();
      const cg=ctx.createRadialGradient(-2,-2,0,0,0,7);
      cg.addColorStop(0,'#FFFFEE'); cg.addColorStop(0.4,'#E5FF66'); cg.addColorStop(1,'#88B500');
      ctx.beginPath(); ctx.arc(0,0,6.5,0,Math.PI*2); ctx.fillStyle=cg;
      ctx.shadowBlur=10; ctx.shadowColor='#DDFF66'; ctx.fill(); ctx.shadowBlur=0;
      ctx.fillStyle='rgba(80,100,0,0.6)'; ctx.font=`bold 7px 'Courier New', monospace`;
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('⚡',0,0.5);
      ctx.restore();
    });
  }

  // ── Enemy paths ────────────────────────────────────────
  function bezPt(a,b,c,t){const it=1-t;return{x:it*it*a.x+2*it*t*b.x+t*t*c.x,y:it*it*a.y+2*it*t*b.y+t*t*c.y};}

  function drawPath(a,b,c,color){
    ctx.save();
    ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.quadraticCurveTo(b.x,b.y,c.x,c.y);
    ctx.strokeStyle=`${color}22`; ctx.lineWidth=22; ctx.lineCap='round'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.quadraticCurveTo(b.x,b.y,c.x,c.y);
    ctx.strokeStyle=`${color}66`; ctx.lineWidth=1.5; ctx.setLineDash([6,10]);
    ctx.lineDashOffset=-time*0.5; ctx.stroke(); ctx.setLineDash([]); ctx.restore();
  }

  function drawEnemyPaths(){
    const cx=L.cellX, cy=L.cellY, shape=currentShape;
    const p1EndPt=cellPointAt(200*Math.PI/180,shape,cx,cy);
    const p2EndPt=cellPointAt(25*Math.PI/180,shape,cx,cy);
    const path1={a:{x:L.arenaX+60,y:L.arenaY+80},b:{x:L.arenaX+L.arenaW*0.25,y:L.arenaY+L.arenaH*0.18},c:{x:p1EndPt.x-18,y:p1EndPt.y-12}};
    const path2={a:{x:L.arenaX+L.arenaW-90,y:L.arenaY+L.arenaH-90},b:{x:L.arenaX+L.arenaW*0.85,y:L.arenaY+L.arenaH*0.7},c:{x:p2EndPt.x+18,y:p2EndPt.y+12}};
    drawPath(path1.a,path1.b,path1.c,'#8B00FF');
    drawPath(path2.a,path2.b,path2.c,'#7FFF00');
    return{p1:bezPt(path1.a,path1.b,path1.c,0.55),p2:bezPt(path2.a,path2.b,path2.c,0.55),path1,path2};
  }

  // ── Tower pedestal ─────────────────────────────────────
  function drawTowerPedestal(x,y,color){
    ctx.save();
    ctx.beginPath(); ctx.ellipse(x,y+18,38,8,0,0,Math.PI*2);
    ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.fill();
    ctx.beginPath(); ctx.arc(x,y,44,0,Math.PI*2);
    ctx.strokeStyle=`${color}44`; ctx.lineWidth=2; ctx.stroke();
    ctx.beginPath(); ctx.arc(x,y,44,0,Math.PI*2);
    ctx.strokeStyle=`${color}22`; ctx.lineWidth=6; ctx.stroke();
    ctx.restore();
  }

  // ── Tower slots on membrane ────────────────────────────
  function drawTowerSlots(){
    const baseTowerScale=Math.max(0.7,L.cellR/220);

    // Draw slot indicators for empty slots
    SLOT_ANGLES.forEach((deg,idx)=>{
      const towerId=st.slots[idx];
      if(!towerId){
        // Empty slot: small dim ring on membrane
        const a=deg*Math.PI/180;
        const pt=cellPointAt(a,currentShape,L.cellX,L.cellY);
        ctx.save();
        ctx.beginPath(); ctx.arc(pt.x,pt.y,9,0,Math.PI*2);
        ctx.strokeStyle='rgba(59,175,169,0.35)'; ctx.lineWidth=1.5;
        const sel=st.selectedTower;
        if(sel){
          const atpOk=st.atp>=(TOWER_DEFS[sel]?.cost||0);
          ctx.strokeStyle=atpOk?'rgba(59,175,169,0.7)':'rgba(255,80,80,0.4)';
          ctx.lineWidth=2;
          ctx.shadowBlur=8; ctx.shadowColor='rgba(59,175,169,0.5)';
        }
        ctx.stroke(); ctx.shadowBlur=0; ctx.restore();
      }
    });

    // Draw occupied tower slots
    const lysSlot=Object.entries(st.slots).find(([,v])=>v==='lysosome');
    const pkSlot =Object.entries(st.slots).find(([,v])=>v==='proteinKinase');
    const reSlot =Object.entries(st.slots).find(([,v])=>v==='repairEnzyme');

    // Defaults from the design if no slots defined yet — show 3 demo towers
    if(Object.keys(st.slots).length===0){
      const lysA=getTowerAnchor(210,currentShape);
      drawTowerPedestal(lysA.x,lysA.y,'#FF6B35'); drawLysosome(lysA.x,lysA.y,baseTowerScale*lysA.scale);
      const pkA=getTowerAnchor(330,currentShape);
      drawTowerPedestal(pkA.x,pkA.y,'#1A6EFF'); drawProteinKinase(pkA.x,pkA.y,baseTowerScale*pkA.scale);
      const reA=getTowerAnchor(90,currentShape);
      drawTowerPedestal(reA.x,reA.y,'#2ECC71'); drawRepairEnzyme(reA.x,reA.y,baseTowerScale*reA.scale);
    } else {
      if(lysSlot){const a=getTowerAnchor(SLOT_ANGLES[+lysSlot[0]],currentShape);drawTowerPedestal(a.x,a.y,'#FF6B35');drawLysosome(a.x,a.y,baseTowerScale*a.scale);}
      if(pkSlot) {const a=getTowerAnchor(SLOT_ANGLES[+pkSlot[0]] ,currentShape);drawTowerPedestal(a.x,a.y,'#1A6EFF');drawProteinKinase(a.x,a.y,baseTowerScale*a.scale);}
      if(reSlot) {const a=getTowerAnchor(SLOT_ANGLES[+reSlot[0]] ,currentShape);drawTowerPedestal(a.x,a.y,'#2ECC71');drawRepairEnzyme(a.x,a.y,baseTowerScale*a.scale);}
    }
  }

  // ── Main render loop ────────────────────────────────────
  function frame(){
    const now=performance.now(), dt=Math.min(0.1,(now-lastFrameMs)/1000);
    lastFrameMs=now; time++; mitosisT+=dt;
    currentPhase=getPhase(mitosisT);
    currentShape=cellShapeForPhase(currentPhase,L.cellR);

    ctx.fillStyle='#0D1B2A'; ctx.fillRect(0,0,W,H);
    drawHexGrid();
    drawCell();
    const paths=drawEnemyPaths();
    drawATP();
    drawTowerSlots();

    // Enemies
    const vhScale=Math.max(0.9,L.cellR/240);
    for(let i=1;i<=4;i++){
      const t=i/5, back=bezPt(paths.path1.a,paths.path1.b,paths.path1.c,0.55-t*0.06), alpha=(1-t)*0.18;
      ctx.save(); ctx.beginPath(); ctx.arc(back.x,back.y,26*vhScale-i*4,0,Math.PI*2);
      ctx.strokeStyle=`rgba(138,0,255,${alpha})`; ctx.lineWidth=1.4; ctx.stroke(); ctx.restore();
    }
    drawViralHijacker(paths.p1.x,paths.p1.y,vhScale,time*0.045);
    const tdScale=Math.max(0.9,L.cellR/240);
    for(let i=1;i<=5;i++){
      const t=i/6, back=bezPt(paths.path2.a,paths.path2.b,paths.path2.c,0.55+t*0.08), alpha=(1-t)*0.28;
      ctx.save(); ctx.beginPath(); ctx.ellipse(back.x,back.y+18*tdScale,22*tdScale-i*2,5,0,0,Math.PI*2);
      ctx.fillStyle=`rgba(100,200,0,${alpha})`; ctx.fill(); ctx.restore();
    }
    drawToxinDroplet(paths.p2.x,paths.p2.y,tdScale,time*0.05);
    const rpScale=Math.max(0.9,L.cellR/260);
    const rpX=L.arenaX+L.arenaW-90, rpY=L.arenaY+L.arenaH*0.42+Math.sin(time*0.025)*8;
    drawRadiationPulse(rpX,rpY,rpScale);
    ctx.save(); ctx.beginPath(); ctx.arc(rpX,rpY+50*rpScale,14,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,179,0,0.4)'; ctx.lineWidth=1.5; ctx.setLineDash([3,4]); ctx.stroke();
    ctx.setLineDash([]); ctx.fillStyle='rgba(255,179,0,0.7)'; ctx.font=`bold 9px 'Courier New', monospace`;
    ctx.textAlign='center'; ctx.fillText('NEXT',rpX,rpY+70*rpScale); ctx.restore();

    // Overlays (drawn last — on top of everything)
    if(st.mutations.length>0) drawMutationLog();
    drawWaveQueue();
    drawShopPanel();
    drawHUD();

    rafId=requestAnimationFrame(frame);
  }

  // ── Input ──────────────────────────────────────────────
  function hitTest(mx,my,x,y,w,h){return mx>=x&&mx<=x+w&&my>=y&&my<=y+h;}

  canvas.addEventListener('click',e=>{
    const rect=canvas.getBoundingClientRect();
    const scaleX=W/rect.width, scaleY=H/rect.height;
    const mx=(e.clientX-rect.left)*scaleX, my=(e.clientY-rect.top)*scaleY;

    // Pause button
    if(L.pauseBtn&&hitTest(mx,my,L.pauseBtn.x,L.pauseBtn.y,L.pauseBtn.w,L.pauseBtn.h)){
      callbacks.onPause?.(); return;
    }
    // Shop cards
    for(const card of (L.shopCards||[])){
      if(hitTest(mx,my,card.x,card.y,card.w,card.h)){
        callbacks.onTowerSelect?.(card.id); return;
      }
    }
    // Tower slots on membrane
    const cx=L.cellX, cy=L.cellY;
    for(let idx=0;idx<SLOT_ANGLES.length;idx++){
      const a=SLOT_ANGLES[idx]*Math.PI/180;
      const pt=cellPointAt(a,currentShape,cx,cy);
      const dist=Math.hypot(mx-pt.x,my-pt.y);
      if(dist<22){
        const towerId=st.slots[idx];
        callbacks.onSlotClick?.({slotIndex:idx,isEmpty:!towerId,towerId:towerId||null,canvasX:pt.x,canvasY:pt.y});
        return;
      }
    }
  });

  // ── Init ───────────────────────────────────────────────
  resize();
  const _resizeObs=new ResizeObserver(resize);
  _resizeObs.observe(container);
  frame();

  return {
    setState(newState){ st={...st,...newState}; },
    destroy(){
      cancelAnimationFrame(rafId);
      _resizeObs.disconnect();
      canvas.remove();
    },
  };
}
