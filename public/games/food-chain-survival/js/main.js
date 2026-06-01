/* ===========================================================================
   Main — boot, level-select cards, screen flow, HUD plumbing, modals, loop.
   =========================================================================== */
(function (global) {
  'use strict';
  const G = global.Game;
  const { clamp } = G;
  const $ = (s) => document.querySelector(s);
  const ACCENTS = { orange: '#EE6A1F', teal: '#13A597', gold: '#E2A41C' };
  const ACCENT_BAR = {
    orange: 'linear-gradient(90deg,#EE6A1F,#F5894A)',
    teal: 'linear-gradient(90deg,#13A597,#37BCAE)',
    gold: 'linear-gradient(90deg,#E2A41C,#F0BE48)',
  };
  const STAR = '<svg class="star" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>';
  const STAR_OFF = '<svg class="star off" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>';

  /* ---------------- progress ---------------- */
  const STORE = 'fcs_progress_v2';
  function loadProg() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } }
  function saveProg(p) { try { localStorage.setItem(STORE, JSON.stringify(p)); } catch (e) {} }
  let progress = loadProg(); // {1:{cleared:true,stars:3}, ...}

  function unlocked(meta) {
    if (meta.id === 1) return true;
    const prev = G.LEVELS.find((l) => l.id === meta.id - 1);
    return !!(progress[prev.id] && progress[prev.id].cleared);
  }

  /* ---------------- tweaks ---------------- */
  function tweaks() { return global.__tweaks || { difficulty: 0, enemySpeed: 1, playerSpeed: 1, showCones: true }; }

  /* ---------------- viewport fit ---------------- */
  // Size the root to the live *visible* browser viewport — never the monitor /
  // screen resolution. screen.avail* describes the whole display work area, which
  // inside an embed (iframe) or a non-maximized window is larger than the region
  // the game can actually use; sizing to it pushes the canvas past the visible
  // area and under the OS taskbar. visualViewport (falling back to innerWidth/
  // innerHeight) reports exactly the visible client box and tracks resize, zoom
  // and orientation changes, so the stage stays fully on-screen at any resolution.
  function fitViewport() {
    const vv = global.visualViewport;
    const w = Math.round(vv ? vv.width : global.innerWidth);
    const h = Math.round(vv ? vv.height : global.innerHeight);
    const root = document.documentElement.style;
    root.setProperty('--app-w', w + 'px');
    root.setProperty('--app-h', h + 'px');
  }
  fitViewport();
  ['resize', 'orientationchange', 'fullscreenchange'].forEach((e) => global.addEventListener(e, fitViewport));
  if (global.visualViewport) {
    global.visualViewport.addEventListener('resize', fitViewport);
    global.visualViewport.addEventListener('scroll', fitViewport);
  }

  /* ---------------- audio mute ---------------- */
  function setMute(m) { G.Audio.muted = m; document.body.classList.toggle('muted', m); try { localStorage.setItem('fcs_mute', m ? '1' : '0'); } catch (e) {} }
  setMute(localStorage.getItem('fcs_mute') === '1');
  $('#muteBtn').addEventListener('click', () => { setMute(!G.Audio.muted); if (!G.Audio.muted) G.Audio.blip(660, .08, 'triangle', .12); });

  /* ---------------- screens ---------------- */
  function show(name) {
    $('#menu').classList.toggle('show', name === 'menu');
    $('#game').classList.toggle('show', name === 'game');
    $('#backBtn').style.visibility = 'visible';
    $('#headTitle').textContent = name === 'menu' ? 'Food Chain Survival' : (current ? current.meta.title : 'Food Chain Survival');
    $('#headSub').style.display = name === 'menu' ? '' : 'none';
  }
  // NOTE: on the menu screen there is no level to quit, so the back arrow
  // exits the whole game back to the SciQuest games hub (host listens).
  $('#backBtn').addEventListener('click', () => {
    if (current) { quitToMenu(); }
    else { try { parent.postMessage({ type: 'fcs:exit' }, '*'); } catch (e) {} }
  });

  /* ---------------- cards ---------------- */
  function renderCards() {
    const wrap = $('#cards'); wrap.innerHTML = '';
    let cleared = 0;
    for (const meta of G.LEVELS) {
      const pr = progress[meta.id] || {};
      const isUnlocked = unlocked(meta);
      const done = !!pr.cleared; if (done) cleared++;
      const stars = pr.stars || 0;
      const card = document.createElement('div');
      card.className = 'card c-' + meta.color + (isUnlocked ? '' : ' locked');
      let pill;
      if (done) pill = `<span class="pill cleared"><svg viewBox="0 0 24 24" width="13" height="13"><path d="M5 12l4 4 10-10" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>Cleared</span>`;
      else if (!isUnlocked) pill = `<span class="pill locked"><svg viewBox="0 0 24 24" width="12" height="12"><path d="M7 10V7a5 5 0 0110 0v3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="5" y="10" width="14" height="10" rx="2" fill="currentColor"/></svg>Locked</span>`;
      else pill = `<span class="pill new">Ready</span>`;
      const starsHtml = [0, 1, 2].map((i) => (i < (done ? stars : 0) ? STAR : STAR_OFF)).join('');
      const btn = !isUnlocked
        ? `<button class="btn disabled">Locked</button>`
        : `<button class="btn play" data-id="${meta.id}">${done ? 'Play again' : 'Play'} <svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
      card.innerHTML = `
        <div class="card-top">
          <div><div class="card-kicker">LEVEL ${meta.num}</div><div class="card-num">${meta.num}</div></div>
          ${pill}
        </div>
        <div class="card-role">${meta.role}</div>
        <div class="card-title">${meta.title}</div>
        <div class="card-desc">${meta.desc}</div>
        <div class="card-meta">
          <div class="stars">${[0, 1, 2].map((i) => (i < meta.stars ? STAR : STAR_OFF)).join('')}</div>
          <div class="meta-goal">${meta.goal}</div>
        </div>
        ${btn}`;
      wrap.appendChild(card);
    }
    wrap.querySelectorAll('.play').forEach((b) => b.addEventListener('click', () => { G.Audio.ensure(); startLevel(+b.dataset.id); }));
    $('#progressLabel').textContent = cleared + ' / ' + G.LEVELS.length + ' links restored';
  }

  /* ---------------- modal ---------------- */
  function showModal({ accent, kicker, title, bodyHTML, actions }) {
    const card = $('#modalCard');
    card.style.setProperty('--accent', ACCENTS[accent] || ACCENTS.orange);
    card.style.setProperty('--accent-soft', ({ orange: '#FCEADD', teal: '#DCF0EC', gold: '#FBEFCF' })[accent] || '#FCEADD');
    $('#modalAccent').style.background = ACCENT_BAR[accent] || ACCENT_BAR.orange;
    $('#modalKicker').textContent = kicker || '';
    $('#modalKicker').style.color = ACCENTS[accent] || ACCENTS.orange;
    $('#modalTitle').textContent = title || '';
    $('#modalContent').innerHTML = bodyHTML || '';
    const act = $('#modalActions'); act.innerHTML = '';
    for (const a of actions) {
      const b = document.createElement('button');
      b.className = 'btn ' + (a.kind === 'ghost' ? 'ghost' : '');
      b.style.setProperty('--accent', ACCENTS[a.accent || accent] || ACCENTS.orange);
      b.innerHTML = a.label;
      b.addEventListener('click', () => { if (a.keep !== true) hideModal(); a.onClick && a.onClick(); });
      act.appendChild(b);
    }
    $('#modal').classList.add('show');
  }
  function hideModal() { $('#modal').classList.remove('show'); }

  function controlsHTML(kind) {
    if (kind === 'aim') {
      return `<div class="controls-row">
        <span class="ctrl"><span class="keycap">Mouse</span> Aim</span>
        <span class="ctrl"><span class="keycap">Space</span>/<span class="keycap">Click</span> Fling spore</span>
        <span class="ctrl"><span class="keycap">↑↓←→</span> Nudge aim</span></div>`;
    }
    if (kind === 'worm') {
      return `<div class="controls-row">
        <span class="ctrl"><span class="keycap">W</span><span class="keycap">A</span><span class="keycap">S</span><span class="keycap">D</span> / <span class="keycap">↑↓←→</span> Crawl</span>
        <span class="ctrl"><span class="keycap">Space</span> Hold to eat / heal</span>
        <span class="ctrl"><span class="keycap">Shift</span> Burrow</span></div>`;
    }
    return `<div class="controls-row">
      <span class="ctrl"><span class="keycap">W</span><span class="keycap">A</span><span class="keycap">S</span><span class="keycap">D</span> / <span class="keycap">↑↓←→</span> Move</span>
      <span class="ctrl"><span class="keycap">Shift</span> ${kind === 'fox' ? 'Sneak' : 'Sprint'}</span>
      ${kind === 'fox' ? '<span class="ctrl"><span class="keycap">Space</span> Pounce</span>' : ''}</div>`;
  }

  /* ---------------- level lifecycle ---------------- */
  let current = null;       // {meta, level}
  let env = null, raf = 0, lastTs = 0, paused = false;
  const canvas = $('#canvas'), ctx = canvas.getContext('2d');
  const cam = new G.Camera(canvas.width, canvas.height);
  // World-px before the bottom edge where the camera stops scrolling down.
  // 0 = stop exactly at the world's bottom edge; raise this to stop earlier.
  cam.bottomInset = -180;
  // Vertical framing of the followed player. screen-Y = vh/2 - offsetY, so a
  // positive value lifts the player up toward the centre of the view.
  cam.offsetY = 90;
  const fx = new G.FX();
  G.Input.bind(canvas);

  function startLevel(id) {
    const meta = G.LEVELS.find((l) => l.id === id);
    const kindKey = meta.key === 'fox' ? 'fox' : meta.key === 'worm' ? 'worm' : meta.key === 'mushroom' ? 'aim' : 'rabbit';
    showModal({
      accent: meta.color, kicker: 'BEFORE YOU PLAY', title: meta.edu.pre.title,
      bodyHTML: meta.edu.pre.html + (meta.edu.pre.controls ? controlsHTML(meta.edu.pre.controls === 'aim' ? 'aim' : meta.edu.pre.controls === 'worm' ? 'worm' : kindKey) : ''),
      actions: [
        { label: 'Back', kind: 'ghost', onClick: () => {} },
        { label: 'Start &nbsp;→', onClick: () => enterGame(meta) },
      ],
    });
  }

  function enterGame(meta) {
    show('game');
    cam.x = 0; cam.y = 0; fx.parts.length = 0; fx.texts.length = 0;
    const Cls = G.LevelClasses[meta.cls];
    const hud = makeHUD(meta);
    const level = new Cls({ ctx, canvas, cam, fx, hud, meta });
    level.hud = hud;
    current = { meta, level };
    global.__cur = current;
    level.init({ tweaks: tweaks() });
    paused = false; lastTs = performance.now();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }

  function loop(ts) {
    raf = requestAnimationFrame(loop);
    const dt = clamp((ts - lastTs) / 1000, 0, 0.045); lastTs = ts;
    if (!paused && current) { current.level.update(dt); fx.update(dt); current.level.draw(); }
    G.Input.endFrame();
    global.__cur = current;
    const h = current && current.level.hud; if (h) { h.actionPressed = false; h.burrowPressed = false; }
  }

  function quitToMenu() {
    cancelAnimationFrame(raf); raf = 0;
    if (current) { current.level.cleanup && current.level.cleanup(); current = null; }
    hideModal(); show('menu'); renderCards();
  }

  /* ---------------- HUD factory ---------------- */
  function makeHUD(meta) {
    const accent = ACCENTS[meta.color];
    const elBanner = $('#hudBanner'), elHint = $('#hudHint');
    // spores pill (level 3) created lazily
    let sporePill = $('#hudSpores');
    if (!sporePill) {
      sporePill = document.createElement('div'); sporePill.id = 'hudSpores'; sporePill.className = 'hud-stat';
      sporePill.innerHTML = '<span class="hud-ico">🍄</span><span id="hudSporeNum">0</span>';
      $('#hudCountWrap').insertAdjacentElement('beforebegin', sporePill);
    }
    const hud = {
      touchDir: null, actionDown: false, actionPressed: false, burrowPressed: false,
      config(c) {
        document.documentElement.style.setProperty('--accent', c.accent || accent);
        $('#hud').style.setProperty('--accent', c.accent || accent);
        $('#hudRole').textContent = c.role; $('#hudRole').style.background = c.accent || accent;
        $('#hudGoal').textContent = c.goal;
        $('#hudTimerWrap').style.display = c.showTimer ? '' : 'none';
        $('#hudPhaseWrap').style.display = c.showPhase ? '' : 'none';
        $('#barEnergyRow').style.display = c.showEnergy ? '' : 'none';
        $('#barEnergyLabel').textContent = c.energyLabel || 'Energy';
        $('#barThirstRow').style.display = c.showThirst ? '' : 'none';
        $('#barStaminaRow').style.display = c.showStamina ? '' : 'none';
        $('#hudCountMax').textContent = c.countMax;
        $('#hudCountWrap').style.display = c.countMax != null ? '' : 'none';
        sporePill.style.display = c.aim ? '' : 'none';
        $('#hudCount').style.color = c.accent || accent;
        // action button label
        const lbl = meta.key === 'fox' ? 'POUNCE' : meta.key === 'mushroom' ? 'SPORE' : meta.key === 'worm' ? 'ACT' : 'DASH';
        $('#actionBtn').textContent = lbl;
        $('#actionBtn').style.background = (c.accent || accent) + 'ee';
        const bb = $('#burrowBtn'); if (bb) { bb.style.display = meta.key === 'worm' ? '' : 'none'; bb.style.background = (c.accent || accent) + 'cc'; }
      },
      set(s) {
        if (s.energy != null) { const f = $('#barEnergy'); f.style.width = s.energy + '%'; f.classList.toggle('low', s.energy < 28); }
        if (s.thirst != null) { const f = $('#barThirst'); f.style.width = s.thirst + '%'; f.classList.toggle('low', s.thirst < 24); }
        if (s.stamina != null) { const f = $('#barStamina'); f.style.width = s.stamina + '%'; f.classList.toggle('low', s.stamina < 15); }
        if (s.phase) { $('#hudPhaseIco').textContent = s.phase.ico; $('#hudPhase').textContent = s.phase.name; const w = $('#hudPhaseWrap'); w.classList.toggle('evening', s.phase.key === 'evening'); w.classList.toggle('night', s.phase.key === 'night'); }
        if (s.count != null) $('#hudCount').textContent = s.count;
        if (s.timer != null) { $('#hudTimer').textContent = fmt(s.timer); $('#hudTimerWrap').classList.toggle('warn', s.timer < 16); }
        if (s.spores != null) $('#hudSporeNum').textContent = s.spores + ' / ' + (s.maxSpores || 12);
        if (s.danger != null) $('#hudObjective').classList.toggle('danger', s.danger);
      },
      banner(text, color, dur) {
        elBanner.textContent = text; elBanner.style.color = color || '#fff'; elBanner.classList.add('show');
        clearTimeout(hud._bt); hud._bt = setTimeout(() => elBanner.classList.remove('show'), (dur || 1.1) * 1000);
      },
      hint(text) { elHint.textContent = text; elHint.classList.add('show'); clearTimeout(hud._ht); hud._ht = setTimeout(() => elHint.classList.remove('show'), 5200); },
      flashLabel(text) { hud.hint(text); },
      flashDanger() { hud.banner('Spotted!', '#f1955a', .7); },
      flashGood() {},
      result(won, payload) { showResult(meta, won, payload); },
    };
    return hud;
  }
  function fmt(s) { s = Math.max(0, s | 0); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }

  /* ---------------- result + post-edu ---------------- */
  function showResult(meta, won, payload) {
    if (won) {
      const pr = progress[meta.id] || {};
      progress[meta.id] = { cleared: true, stars: Math.max(pr.stars || 0, payload.stars) };
      saveProg(progress);
      // NOTE: report the clear to the SciQuest host so it can persist progress.
      try {
        const allCleared = G.LEVELS.every((l) => progress[l.id] && progress[l.id].cleared);
        parent.postMessage({ type: 'fcs:cleared', levelId: meta.id, stars: payload.stars, allCleared }, '*');
      } catch (e) {}
    }
    const starsRow = `<div class="result-stars">${[0, 1, 2].map((i) => (i < payload.stars
      ? `<svg class="star pop" style="animation-delay:${.15 + i * .18}s" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>`
      : `<svg class="star off" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>`)).join('')}</div>`;
    const stats = payload.stats.map((s) => `<div class="stat-line"><span>${s[0]}</span><b>${s[1]}</b></div>`).join('');
    const nextMeta = G.LEVELS.find((l) => l.id === meta.id + 1);
    const actions = [];
    if (won) {
      actions.push({ label: 'What I learned &nbsp;→', onClick: () => showPostEdu(meta, nextMeta) });
      actions.push({ label: 'Replay', kind: 'ghost', onClick: () => enterGame(meta) });
    } else {
      actions.push({ label: 'Try again', onClick: () => enterGame(meta) });
      actions.push({ label: 'Map', kind: 'ghost', onClick: quitToMenu });
    }
    showModal({
      accent: meta.color, kicker: payload.resultKicker || (won ? 'CHALLENGE COMPLETE' : 'OUT OF ENERGY'),
      title: payload.resultTitle || (won ? 'You survived!' : 'Not this time'),
      bodyHTML: (won ? starsRow : '') + stats,
      actions,
    });
  }
  function showPostEdu(meta, nextMeta) {
    const nextUnlocked = nextMeta && unlocked(nextMeta);
    const actions = [];
    if (nextMeta && nextUnlocked) actions.push({ label: 'Next: ' + nextMeta.title + ' &nbsp;→', accent: nextMeta.color, onClick: () => startLevel(nextMeta.id) });
    actions.push({ label: 'Back to map', kind: nextMeta ? 'ghost' : undefined, onClick: quitToMenu });
    showModal({ accent: meta.color, kicker: 'DID YOU KNOW', title: meta.edu.post.title, bodyHTML: meta.edu.post.html, actions });
  }

  /* ---------------- pause ---------------- */
  $('#pauseBtn').addEventListener('click', () => {
    if (!current) return; paused = true;
    showModal({
      accent: current.meta.color, kicker: 'PAUSED', title: current.meta.title,
      bodyHTML: '<p style="color:#8d8478;font-weight:700">Take a breather.</p>',
      actions: [
        { label: 'Resume', onClick: () => { paused = false; lastTs = performance.now(); } },
        { label: 'Restart', kind: 'ghost', onClick: () => enterGame(current.meta) },
        { label: 'Map', kind: 'ghost', onClick: quitToMenu },
      ],
    });
  });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && current && !paused) $('#pauseBtn').click(); });

  /* ---------------- touch controls ---------------- */
  function setupTouch() {
    const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (!isTouch) return;
    $('#touch-controls').classList.remove('hidden');
    const dirs = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
    const held = {};
    function recompute() {
      let x = 0, y = 0; for (const k in held) if (held[k]) { x += dirs[k].x; y += dirs[k].y; }
      const m = Math.hypot(x, y); const h = current && current.level.hud; if (!h) return;
      h.touchDir = m ? { x: x / m, y: y / m } : null;
    }
    document.querySelectorAll('.dbtn').forEach((b) => {
      const d = b.dataset.dir;
      const on = (e) => { e.preventDefault(); held[d] = true; recompute(); };
      const off = (e) => { e.preventDefault(); held[d] = false; recompute(); };
      b.addEventListener('touchstart', on, { passive: false }); b.addEventListener('touchend', off); b.addEventListener('touchcancel', off);
    });
    const ab = $('#actionBtn');
    ab.addEventListener('touchstart', (e) => { e.preventDefault(); const h = current && current.level.hud; if (h) { h.actionDown = true; h.actionPressed = true; } }, { passive: false });
    ab.addEventListener('touchend', (e) => { e.preventDefault(); const h = current && current.level.hud; if (h) h.actionDown = false; });
    const burrowB = $('#burrowBtn');
    if (burrowB) burrowB.addEventListener('touchstart', (e) => { e.preventDefault(); const h = current && current.level.hud; if (h) h.burrowPressed = true; }, { passive: false });
  }

  /* ---------------- boot ---------------- */
  async function boot() {
    try {
      const res = await fetch('assets/manifest.json');
      const manifest = await res.json();
      await Promise.all([
        G.Assets.load(manifest),
        G.LogDecomp ? G.LogDecomp.preload() : Promise.resolve(),
        G.TreeArt ? G.TreeArt.preload() : Promise.resolve(),
      ]);
    } catch (e) {
      console.error('Asset load failed', e);
      $('#cards').innerHTML = '<div style="color:#8d8478;font-weight:700;padding:40px;text-align:center">Could not load sprites. Check the assets folder.</div>';
      return;
    }
    renderCards();
    setupTouch();
    show('menu');
  }
  boot();
})(window);
