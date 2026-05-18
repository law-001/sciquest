// Canvas overlay that renders the shop panel, HUD, wave queue, and mutation log
// exactly as in the design — on top of the Phaser game canvas.
// The Phaser game canvas handles the game world; this handles all UI chrome.

import { useEffect, useRef } from 'react';
import {
  drawLysosome,
  drawProteinKinase,
  drawRepairEnzyme,
} from '../systems/EntityDraw';

const MONO = '"Courier New", Courier, monospace';

const MITOSIS_NAMES  = ['INTERPHASE','PROPHASE','METAPHASE','ANAPHASE','TELOPHASE','CYTOKINESIS'];
const MITOSIS_COLORS = ['#3BAFA9','#9B59B6','#00FFCC','#FFD700','#A8C8F0','#FF6B6B'];

const PHASE_IDX = {
  interphase: 0, prophase: 1, metaphase: 2,
  anaphase: 3, telophase: 4, cytokinesis: 5,
};

const TOWER_DEFS_UI = {
  lysosome:      { name: 'LYSOSOME',    cost: 80,  costLabel: '80 ATP',  color: '#FF6B35', drawFn: drawLysosome },
  proteinKinase: { name: 'PROTEIN KIN', cost: 120, costLabel: '120 ATP', color: '#1A6EFF', drawFn: drawProteinKinase },
  repairEnzyme:  { name: 'REPAIR ENZ',  cost: 100, costLabel: '100 ATP', color: '#2ECC71', drawFn: drawRepairEnzyme },
};
const TOWER_KEYS = ['lysosome', 'proteinKinase', 'repairEnzyme'];

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function UICanvas({
  hp, maxHp, atp, phase, wave, totalWaves,
  mutations, nextWaveEnemies, waveCountdown, waveCountdownMax,
  selectedTower, paused,
  onTowerSelect, onPause, onExit: _onExit,
  phaserCanvasRef,
}) {
  const canvasRef = useRef(null);
  const stRef     = useRef({});
  const layoutRef = useRef({});
  const rafRef    = useRef(null);
  const timeRef   = useRef(0);

  // Sync latest props into ref after render so the canvas loop always reads fresh values
  useEffect(() => {
    stRef.current = {
      hp: hp ?? 100,
      maxHp: maxHp ?? 100,
      atp: atp ?? 300,
      phase: phase ?? 'interphase',
      wave: wave ?? 0,
      totalWaves: totalWaves ?? 5,
      mutations: mutations ?? [],
      nextWaveEnemies: nextWaveEnemies ?? [],
      waveCountdown: waveCountdown ?? 0,
      waveCountdownMax: waveCountdownMax ?? 30,
      selectedTower: selectedTower ?? null,
      paused: paused ?? false,
    };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = 0, H = 0, dpr = 1;

    function resize() {
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const L = layoutRef.current;
      L.hudH  = 56;
      L.shopW = Math.max(200, Math.round(W * 0.18));
      L.shopX = 0;
      L.shopY = L.hudH;
      L.shopH = H - L.hudH;

      // Shop card rects for hit testing
      const cardW  = L.shopW - 28;
      const cardX  = L.shopX + 14;
      const startY = L.shopY + 40;
      const cardH  = (L.shopH - 70) / 3;
      const gap    = 10;
      L.shopCards = TOWER_KEYS.map((k, i) => ({
        id: k,
        x: cardX,
        y: startY + i * (cardH + gap),
        w: cardW,
        h: cardH - gap,
      }));
      L.pauseBtn = { x: W - 56, y: L.hudH / 2 - 18, w: 36, h: 36 };
    }

    // ── Drawing helpers ────────────────────────────────────
    function drawShopPanel(t) {
      const { shopX: x, shopY: y, shopW: w, shopH: h, shopCards } = layoutRef.current;
      const st = stRef.current;

      ctx.save();
      // Background gradient
      const bg = ctx.createLinearGradient(x, y, x + w, y);
      bg.addColorStop(0, '#0F2010');
      bg.addColorStop(0.5, '#1A2E1A');
      bg.addColorStop(1, '#142519');
      ctx.fillStyle = bg;
      ctx.fillRect(x, y, w, h);

      // Bark streaks
      for (let i = 0; i < 22; i++) {
        const sy = y + (i / 22) * h + Math.sin(i * 1.3) * 8;
        ctx.beginPath();
        ctx.moveTo(x, sy);
        ctx.bezierCurveTo(
          x + w * 0.3, sy + Math.sin(i * 0.7) * 6,
          x + w * 0.7, sy + Math.cos(i * 0.9) * 8,
          x + w, sy + Math.sin(i * 0.5) * 5,
        );
        ctx.strokeStyle = `rgba(${30 + (i%3)*8},${50 + (i%5)*6},${30 + (i%3)*5},${0.25 + (i%4)*0.04})`;
        ctx.lineWidth = 0.8 + (i % 3) * 0.3;
        ctx.stroke();
      }
      // Wood knots
      for (let i = 0; i < 5; i++) {
        const kx = x + 20 + (i * 47) % (w - 40);
        const ky = y + 40 + (i * 113) % (h - 80);
        ctx.beginPath();
        ctx.arc(kx, ky, 4 + (i % 3), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(20,40,20,0.5)';
        ctx.fill();
      }
      // Right bevel
      const bevel = ctx.createLinearGradient(x + w - 6, y, x + w, y);
      bevel.addColorStop(0, 'rgba(0,0,0,0)');
      bevel.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = bevel;
      ctx.fillRect(x + w - 6, y, 6, h);
      ctx.strokeStyle = 'rgba(80,160,90,0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + w - 1, y);
      ctx.lineTo(x + w - 1, y + h);
      ctx.stroke();
      ctx.restore();

      // Header
      ctx.save();
      ctx.font = `bold 14px ${MONO}`;
      ctx.fillStyle = '#9BD49F';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('▼ DEFENDERS ▼', x + w / 2, y + 22);
      ctx.restore();

      // Tower cards
      shopCards.forEach((card) => {
        const def = TOWER_DEFS_UI[card.id];
        const selected = st.selectedTower === card.id;
        const canAfford = st.atp >= def.cost;
        drawTowerCard(card.x, card.y, card.w, card.h, def, selected, canAfford, t);
      });
    }

    function drawTowerCard(x, y, w, h, def, selected, canAfford, t) {
      ctx.save();

      const bg = ctx.createLinearGradient(x, y, x, y + h);
      if (canAfford) {
        bg.addColorStop(0, selected ? '#2a4a2a' : '#1F3520');
        bg.addColorStop(1, selected ? '#162216' : '#0F1F10');
      } else {
        bg.addColorStop(0, '#161616');
        bg.addColorStop(1, '#0a0a0a');
      }
      ctx.fillStyle = bg;
      roundRect(ctx, x, y, w, h, 10);
      ctx.fill();

      ctx.strokeStyle = canAfford ? def.color : 'rgba(70,70,70,0.5)';
      ctx.lineWidth   = selected ? 3.5 : 2.5;
      ctx.shadowBlur  = canAfford ? (selected ? 22 : 14) : 0;
      ctx.shadowColor = def.color;
      roundRect(ctx, x + 1, y + 1, w - 2, h - 2, 10);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = canAfford ? `${def.color}55` : 'rgba(50,50,50,0.4)';
      ctx.lineWidth   = 1;
      roundRect(ctx, x + 6, y + 6, w - 12, h - 12, 7);
      ctx.stroke();

      ctx.globalAlpha = canAfford ? 1 : 0.3;

      // Tower icon drawn from EntityDraw
      const iconSize = Math.min(w * 0.6, h * 0.55);
      const ix = x + w / 2;
      const iy = y + iconSize * 0.55 + 8;
      // Pedestal shadow
      ctx.beginPath();
      ctx.arc(ix, iy + iconSize * 0.18, iconSize * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fill();
      def.drawFn(ctx, ix, iy, iconSize * 0.38, t, { noBubbles: true });

      // Name
      ctx.fillStyle = def.color;
      ctx.font = `bold 12px ${MONO}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.shadowBlur = 0;
      ctx.fillText(def.name, ix, y + h - 26);

      // Cost
      ctx.fillStyle = canAfford ? '#FFD700' : 'rgba(120,120,120,0.8)';
      ctx.font = `bold 11px ${MONO}`;
      ctx.fillText(`⚡ ${def.costLabel}`, ix, y + h - 10);

      // "Not enough ATP" banner
      if (!canAfford) {
        ctx.globalAlpha = 0.85;
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        roundRect(ctx, x + 4, y + h / 2 - 9, w - 8, 18, 4);
        ctx.fill();
        ctx.fillStyle = 'rgba(180,60,60,0.9)';
        ctx.font = `bold 9px ${MONO}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('NEED MORE ATP', ix, y + h / 2);
      }

      ctx.restore();
    }

    function drawHUD(t) {
      const st  = stRef.current;
      const L   = layoutRef.current;
      const h   = L.hudH;
      const phaseIdx = PHASE_IDX[st.phase] ?? 0;
      const phaseColor = MITOSIS_COLORS[phaseIdx];

      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.68)';
      ctx.fillRect(0, 0, W, h);
      // Bottom teal border
      const grad = ctx.createLinearGradient(0, h - 2, 0, h);
      grad.addColorStop(0, 'rgba(59,175,169,0)');
      grad.addColorStop(1, 'rgba(59,175,169,0.5)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, h - 2, W, 2);

      // Phase dots
      const dotsStart = 20;
      for (let i = 0; i < 6; i++) {
        const dx = dotsStart + i * 22, dy = h / 2;
        ctx.beginPath();
        ctx.arc(dx, dy, 7, 0, Math.PI * 2);
        if (i === phaseIdx) {
          const pulse = 0.6 + 0.4 * Math.abs(Math.sin(t * 0.06));
          ctx.shadowBlur  = 14 * pulse;
          ctx.shadowColor = MITOSIS_COLORS[i];
          ctx.fillStyle   = MITOSIS_COLORS[i];
        } else if (i < phaseIdx) {
          ctx.shadowBlur = 0;
          ctx.fillStyle  = MITOSIS_COLORS[i];
        } else {
          ctx.shadowBlur  = 0;
          ctx.fillStyle   = '#2a3340';
          ctx.strokeStyle = '#3a4350';
        }
        ctx.fill();
        if (i > phaseIdx) ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Phase name
      ctx.font = `bold 18px ${MONO}`;
      ctx.textBaseline = 'middle';
      ctx.textAlign   = 'left';
      ctx.fillStyle   = phaseColor;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = phaseColor;
      ctx.fillText(MITOSIS_NAMES[phaseIdx], dotsStart + 6 * 22 + 14, h / 2);
      ctx.shadowBlur = 0;

      // HP bar
      const mid = W * 0.5, hpX = mid - 60;
      ctx.fillStyle = '#FF6B6B';
      ctx.font = `bold 16px ${MONO}`;
      ctx.fillText('❤', hpX, h / 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(' HP:', hpX + 16, h / 2);
      const barX = hpX + 60, barY = h / 2 - 7, barW = 110, barH = 14;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      roundRect(ctx, barX, barY, barW, barH, 4);
      ctx.fill();
      const hpVal  = Math.max(0, Math.min(st.maxHp, st.hp));
      const fillW  = (hpVal / st.maxHp) * (barW - 2);
      const hpGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
      hpGrad.addColorStop(0, '#FF8080');
      hpGrad.addColorStop(1, '#CC2020');
      ctx.fillStyle = hpGrad;
      roundRect(ctx, barX + 1, barY + 1, fillW, barH - 2, 3);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = `bold 11px ${MONO}`;
      ctx.textAlign = 'center';
      ctx.shadowBlur  = 3;
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.fillText(`${st.hp} / ${st.maxHp}`, barX + barW / 2, h / 2);
      ctx.shadowBlur = 0;

      // ATP
      const atpX = barX + barW + 28;
      ctx.font = `bold 16px ${MONO}`;
      ctx.fillStyle   = '#FFD700';
      ctx.textAlign   = 'left';
      ctx.shadowBlur  = 8;
      ctx.shadowColor = '#FFD700';
      ctx.fillText('⚡', atpX, h / 2);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(' ATP:', atpX + 16, h / 2);
      ctx.fillStyle = '#FFD700';
      ctx.fillText(`${st.atp}`, atpX + 70, h / 2);

      // Wave counter
      if (st.wave > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = `12px ${MONO}`;
        ctx.fillText(
          `WAVE ${String(st.wave).padStart(2, '0')} / ${st.totalWaves}`,
          atpX + 130, h / 2,
        );
      }

      // Pause button
      const pb = L.pauseBtn;
      ctx.strokeStyle = '#FF8C42';
      ctx.lineWidth   = 1.5;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = '#FF8C42';
      roundRect(ctx, pb.x, pb.y, pb.w, pb.h, 8);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle  = '#FF8C42';
      if (st.paused) {
        // Play triangle
        ctx.beginPath();
        ctx.moveTo(pb.x + 11, pb.y + 10);
        ctx.lineTo(pb.x + 11, pb.y + 26);
        ctx.lineTo(pb.x + 27, pb.y + 18);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(pb.x + 11, pb.y + 10, 4, 16);
        ctx.fillRect(pb.x + 21, pb.y + 10, 4, 16);
      }

      // LIVE indicator
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = `10px ${MONO}`;
      ctx.textAlign = 'right';
      ctx.fillText('● LIVE', pb.x - 14, h / 2);

      ctx.restore();
    }

    function drawWaveQueue(t) {
      const st = stRef.current;
      const L  = layoutRef.current;
      const enemies = st.nextWaveEnemies;
      if (!enemies || enemies.length === 0) return;

      const pad = 16, pw = 250, ph = 90;
      const x = L.shopW + (W - L.shopW) - pw - pad;
      const y = H - ph - pad;

      ctx.save();
      roundRect(ctx, x, y, pw, ph, 10);
      ctx.fillStyle   = 'rgba(0,0,0,0.72)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(59,175,169,0.5)';
      ctx.lineWidth   = 1.5;
      ctx.stroke();

      ctx.fillStyle    = '#3BAFA9';
      ctx.font         = `bold 11px ${MONO}`;
      ctx.textAlign    = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('NEXT WAVE', x + 14, y + 10);

      const iconY = y + 38;
      let ix = x + 14;
      enemies.forEach(e => {
        for (let i = 0; i < e.count; i++) {
          ctx.save();
          ctx.translate(ix + 11, iconY);
          const type = e.type;
          if (type === 'viralHijacker' || type === 'viral') {
            ctx.fillStyle = '#8B00FF';
            ctx.beginPath();
            for (let k = 0; k < 6; k++) {
              const a = (k * 60 - 90) * Math.PI / 180;
              k === 0 ? ctx.moveTo(Math.cos(a) * 9, Math.sin(a) * 9) : ctx.lineTo(Math.cos(a) * 9, Math.sin(a) * 9);
            }
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#BB66FF';
            ctx.lineWidth   = 1;
            ctx.stroke();
          } else {
            ctx.fillStyle = '#7FFF00';
            ctx.beginPath();
            ctx.ellipse(0, 2, 8, 11, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#B8FF4A';
            ctx.lineWidth   = 1;
            ctx.stroke();
          }
          ctx.restore();
          ix += 26;
        }
      });

      // Countdown bar
      const cbX = x + 14, cbY = y + ph - 22, cbW = pw - 28, cbH = 10;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      roundRect(ctx, cbX, cbY, cbW, cbH, 5);
      ctx.fill();
      const max  = st.waveCountdownMax || 30;
      const pct  = max > 0 ? Math.max(0, Math.min(1, 1 - st.waveCountdown / max)) : 0.62 + 0.05 * Math.sin(t * 0.04);
      const fillG = ctx.createLinearGradient(cbX, 0, cbX + cbW, 0);
      fillG.addColorStop(0, '#FFB300');
      fillG.addColorStop(1, '#FF6B35');
      ctx.fillStyle = fillG;
      roundRect(ctx, cbX + 1, cbY + 1, (cbW - 2) * pct, cbH - 2, 4);
      ctx.fill();
      ctx.fillStyle    = 'rgba(255,255,255,0.7)';
      ctx.font         = `9px ${MONO}`;
      ctx.textAlign    = 'right';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(`00:${String(st.waveCountdown).padStart(2, '0')}`, cbX + cbW, cbY - 4);

      ctx.restore();
    }

    function drawMutationLog() {
      const st = stRef.current;
      if (!st.mutations || st.mutations.length === 0) return;
      const L   = layoutRef.current;
      const x   = L.shopW + 16;
      const y   = H - 80;
      const chipW = 190, chipH = 28, gap = 6;

      ctx.save();
      ctx.fillStyle    = 'rgba(255,120,120,0.7)';
      ctx.font         = `bold 10px ${MONO}`;
      ctx.textAlign    = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('MUTATION LOG', x, y - 8);

      st.mutations.slice(0, 4).forEach((m, i) => {
        const cy         = y + i * (chipH + gap);
        const label      = `⚠ ${(m.name ?? m).toUpperCase()}`;
        const pulseAlpha = 0.5 + 0.35 * Math.sin(timeRef.current * 0.06 + i * 1.3);
        ctx.save();
        ctx.shadowBlur  = 14;
        ctx.shadowColor = `rgba(255,40,40,${pulseAlpha})`;
        roundRect(ctx, x, cy, chipW, chipH, 6);
        ctx.fillStyle = 'rgba(80,10,10,0.78)';
        ctx.fill();
        ctx.shadowBlur  = 0;
        ctx.strokeStyle = `rgba(255,80,80,${pulseAlpha})`;
        ctx.lineWidth   = 1.4;
        ctx.stroke();
        ctx.fillStyle    = '#FF9090';
        ctx.font         = `bold 11px ${MONO}`;
        ctx.textAlign    = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + 12, cy + chipH / 2);
        ctx.restore();
      });
      ctx.restore();
    }

    // ── Animation loop ─────────────────────────────────────
    function frame() {
      timeRef.current++;
      const t = timeRef.current;
      ctx.clearRect(0, 0, W, H);
      drawShopPanel(t);
      drawHUD(t);
      drawWaveQueue(t);
      drawMutationLog();
      rafRef.current = requestAnimationFrame(frame);
    }

    // ── Input ──────────────────────────────────────────────
    function onClick(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width, scaleY = H / rect.height;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top)  * scaleY;
      const L  = layoutRef.current;

      // Shop cards
      for (const card of (L.shopCards ?? [])) {
        if (mx >= card.x && mx <= card.x + card.w && my >= card.y && my <= card.y + card.h) {
          onTowerSelect?.(card.id);
          return;
        }
      }
      // Pause button
      const pb = L.pauseBtn;
      if (pb && mx >= pb.x && mx <= pb.x + pb.w && my >= pb.y && my <= pb.y + pb.h) {
        onPause?.();
        return;
      }
      // Click was in the game arena — forward to Phaser canvas
      const phaserCanvas = phaserCanvasRef?.current;
      if (phaserCanvas && (mx >= L.shopW || my < 0)) {
        phaserCanvas.dispatchEvent(new PointerEvent('pointerdown', {
          bubbles: true, cancelable: true,
          clientX: e.clientX, clientY: e.clientY,
          pointerId: e.pointerId ?? 1,
          pointerType: 'mouse', isPrimary: true,
          button: 0, buttons: 1,
        }));
        phaserCanvas.dispatchEvent(new PointerEvent('pointerup', {
          bubbles: true, cancelable: true,
          clientX: e.clientX, clientY: e.clientY,
          pointerId: e.pointerId ?? 1,
          pointerType: 'mouse', isPrimary: true,
          button: 0, buttons: 0,
        }));
      }
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    canvas.addEventListener('click', onClick);
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener('click', onClick);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      data-ui-overlay="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 5,
        cursor: 'crosshair',
        fontFamily: MONO,
      }}
      aria-hidden="true"
    />
  );
}
