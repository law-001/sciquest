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
  const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>';
  const STAR_OFF = '<svg class="off" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>';
  // HUD glyphs — inline SVG (no emoji). Phase icons keyed by the `ico` name each level emits.
  const HUD_ICONS = {
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
    sunset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m16 6-4 4-4-4"/><path d="M16 18a4 4 0 0 0-8 0"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
    mushroom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11a8 8 0 0 1 16 0Z"/><path d="M10 11v6a2 2 0 0 0 4 0v-6"/></svg>',
  };
  // Menu-action glyphs — one distinct shape per pause-menu button so each reads
  // at a glance without its label (play / speaker / redo / grid / door-out).
  const MENU_ICONS = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.14-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z"/></svg>',
    soundOn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none"/><path d="M16 9.5a3.5 3.5 0 0 1 0 5"/><path d="M18.7 7a7 7 0 0 1 0 10"/></svg>',
    soundOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none"/><path d="M17 9.5l4.5 5M21.5 9.5l-4.5 5"/></svg>',
    redo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11.5a8 8 0 1 1-2.3-5.4"/><path d="M20 3.5V8h-4.5"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/></svg>',
    exit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8"/><path d="M18 15.5l3.5-3.5L18 8.5"/><path d="M21.5 12H9.5"/></svg>',
  };

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
  // Embedded (SciQuest iframe) vs standalone tab — the taskbar cut below only
  // applies standalone; embedded, the host page already sizes the frame.
  let isTopLevel = true;
  try { isTopLevel = global.self === global.top; } catch (e) { isTopLevel = false; }
  function fitViewport() {
    const vv = global.visualViewport;
    const w = Math.round(vv ? vv.width : global.innerWidth);
    // Inside an iframe, visualViewport reflects the TOP-LEVEL page, so it can
    // over-report past the frame the host gave us and push the stage behind the
    // window's taskbar. Clamp to this frame's own layout viewport so --app-h
    // fills exactly the host container, never more.
    const frameH = document.documentElement.clientHeight || global.innerHeight;
    let h = Math.round(Math.min(vv ? vv.height : global.innerHeight, frameH));
    // A window sized or dragged past the OS work area keeps its full
    // innerHeight while the always-on-top taskbar covers its bottom strip —
    // no height comparison can see that, only the window's position. Cut how
    // far the window's bottom edge overhangs the work-area bottom, so the
    // stage always ends above the taskbar. Real fullscreen hides the taskbar.
    if (isTopLevel && !document.fullscreenElement) {
      const scr = global.screen;
      const workBottom = ((scr && scr.availTop) || 0) + (scr ? scr.availHeight : Infinity);
      h = Math.max(200, h - Math.max(0, global.screenY + global.outerHeight - workBottom));
    }
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
    document.body.classList.toggle('in-game', name === 'game');
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
  const LOCK_SVG = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

  function renderCards() {
    const wrap = $('#cards'); wrap.innerHTML = '';
    let cleared = 0;
    for (const meta of G.LEVELS) {
      const pr = progress[meta.id] || {};
      const isUnlocked = unlocked(meta);
      const done = !!pr.cleared; if (done) cleared++;
      const accent = ACCENTS[meta.color] || ACCENTS.orange;
      const total = meta.stars;                 // max stars the level awards
      const earned = done ? (pr.stars || 0) : 0;

      let pill;
      if (!isUnlocked) pill = `<span class="sq-pill">${LOCK_SVG}Locked</span>`;
      else if (done) pill = `<span class="sq-pill sq-pill--teal"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6"/></svg>Cleared</span>`;
      else pill = `<span class="sq-pill sq-pill--orange">Ready</span>`;

      let stars = '';
      for (let i = 0; i < total; i++) stars += i < earned ? STAR : STAR_OFF;

      const foot = isUnlocked
        ? `<button class="sq-level-play" data-id="${meta.id}" style="background:${accent};border-color:${accent}">${done ? 'Play again' : 'Play'}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>`
        : `<p class="sq-level-lock">${LOCK_SVG}Complete Level ${meta.id - 1} first</p>`;

      const card = document.createElement('article');
      card.className = 'sq-level-card' + (isUnlocked ? '' : ' sq-level-card--locked');
      card.setAttribute('aria-disabled', String(!isUnlocked));
      if (isUnlocked) card.dataset.id = meta.id;
      card.innerHTML = `
        <div class="sq-level-card__accent" style="background:${accent}"></div>
        <div class="sq-level-badge">${pill}</div>
        <div class="sq-level-card__num" style="color:${isUnlocked ? accent : 'var(--sq-ink-4)'}">
          <small>Level ${meta.num}</small>${meta.num}
        </div>
        <div><div class="sq-level-card__name" style="color:${isUnlocked ? 'var(--sq-ink-1)' : 'var(--sq-ink-4)'}">${meta.title}</div></div>
        <div class="sq-level-card__goal">${meta.desc}</div>
        <div class="sq-level-card__foot">
          <span class="sq-stars" aria-label="${earned} of ${total} stars">${stars}</span>
          <span class="sq-level-card__count">${meta.goal}</span>
        </div>
        ${foot}`;
      wrap.appendChild(card);
    }
    wrap.querySelectorAll('.sq-level-card:not(.sq-level-card--locked)').forEach((c) => {
      c.addEventListener('click', () => { G.Audio.ensure(); startLevel(+c.dataset.id); });
    });
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
      b.className = 'btn' + (a.kind === 'ghost' ? ' ghost' : '') + (a.tone ? ' tone-' + a.tone : '');
      b.style.setProperty('--accent', ACCENTS[a.accent || accent] || ACCENTS.orange);
      b.innerHTML = (a.icon || '') + a.label;
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
  // 0 = stop exactly at the world's bottom edge (never reveal the void below the
  // terrain); raise this to stop earlier. Negative values overscroll past the
  // edge and expose the background fill, so keep this >= 0.
  cam.bottomInset = 0;
  // Vertical framing of the followed player. screen-Y = vh/2 - offsetY, so a
  // positive value lifts the player above centre; 0 keeps it dead-centre.
  cam.offsetY = 0;
  const fx = new G.FX();
  G.Input.bind(canvas);

  // Fill the game window: the drawing buffer (and camera viewport) track the live
  // size of the stage, so the map reaches every window edge — no letterbox border.
  // The viewport is capped to the world so the camera can never scroll past the
  // map into the void; a window larger than the whole map falls back to showing
  // it centred. Called on every level start and whenever the window resizes.
  // Height of the canvas box that is genuinely on screen. The box can extend
  // past what the player can see in three ways this frame cannot feel through
  // normal layout: the frame's own viewport, the HOST page's viewport (the
  // same-origin SciQuest embed can size the iframe taller than its window),
  // and an OS taskbar overlapping the window's bottom edge. Clamp against all
  // three so the camera viewport never includes rows nobody can see.
  function visibleCanvasHeight(rect) {
    let top = rect.top, bottom = rect.bottom, limit = global.innerHeight;
    try {
      if (!isTopLevel && global.frameElement) {
        const fr = global.frameElement.getBoundingClientRect();
        top += fr.top; bottom += fr.top;
        limit = global.top.innerHeight;
      }
    } catch (e) { /* cross-origin host: fall back to frame-local clipping */ }
    if (!document.fullscreenElement) {
      const scr = global.screen;
      const workBottom = ((scr && scr.availTop) || 0) + (scr ? scr.availHeight : Infinity);
      limit -= Math.max(0, global.screenY + global.outerHeight - workBottom);
    }
    return Math.max(0, Math.min(bottom, limit) - top);
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    let vw = Math.round(rect.width), vh = Math.round(visibleCanvasHeight(rect));
    if (vw < 2 || vh < 2) return;            // stage not visible (menu) — skip
    const world = current && current.level && current.level.world;
    if (world) { vw = Math.min(vw, world.w); vh = Math.min(vh, world.h); }
    if (canvas.width !== vw) canvas.width = vw;
    if (canvas.height !== vh) canvas.height = vh;
    cam.vw = vw; cam.vh = vh;
    if (current && current.level) { current.level.W = vw; current.level.H = vh; }
  }
  ['resize', 'orientationchange', 'fullscreenchange'].forEach((e) => global.addEventListener(e, resizeCanvas));
  if (global.visualViewport) global.visualViewport.addEventListener('resize', resizeCanvas);
  // A window MOVE fires no resize event but can slide the stage under the OS
  // taskbar — re-measure on a slow poll. Standalone only: embedded, the host
  // page tracks the window and resizes the frame, which does fire resize here.
  if (isTopLevel) setInterval(() => { fitViewport(); resizeCanvas(); }, 1000);

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
    // Size the viewport to the window (capped to this level's world) before init,
    // so level.init() sees the real W/H (level 3 centres its camera on them).
    resizeCanvas();
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
      sporePill.innerHTML = '<span class="hud-ico">' + HUD_ICONS.mushroom + '</span><span id="hudSporeNum">0</span>';
      $('#hudCountWrap').insertAdjacentElement('beforebegin', sporePill);
    }
    const hud = {
      touchDir: null, actionDown: false, actionPressed: false, burrowPressed: false, sneakDown: false,
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
        const bb = $('#burrowBtn');
        if (bb) {
          const secondary = meta.key === 'worm' ? 'BURROW' : meta.key === 'fox' ? 'SNEAK' : '';
          bb.style.display = secondary ? '' : 'none';
          bb.textContent = secondary;
          bb.style.background = (c.accent || accent) + 'cc';
        }
      },
      set(s) {
        if (s.energy != null) { const f = $('#barEnergy'); f.style.width = s.energy + '%'; f.classList.toggle('low', s.energy < 28); }
        if (s.thirst != null) { const f = $('#barThirst'); f.style.width = s.thirst + '%'; f.classList.toggle('low', s.thirst < 24); }
        if (s.stamina != null) { const f = $('#barStamina'); f.style.width = s.stamina + '%'; f.classList.toggle('low', s.stamina < 15); }
        if (s.phase) { $('#hudPhaseIco').innerHTML = HUD_ICONS[s.phase.ico] || ''; $('#hudPhase').textContent = s.phase.name; const w = $('#hudPhaseWrap'); w.classList.toggle('evening', s.phase.key === 'evening'); w.classList.toggle('night', s.phase.key === 'night'); }
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
      actions.push({ label: 'Level Select', kind: 'ghost', onClick: quitToMenu });
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
    actions.push({ label: 'Level Select', kind: nextMeta ? 'ghost' : undefined, onClick: quitToMenu });
    showModal({ accent: meta.color, kicker: 'DID YOU KNOW', title: meta.edu.post.title, bodyHTML: meta.edu.post.html, actions });
  }

  /* ---------------- pause = universal in-game menu ---------------- */
  // The top header is hidden during play, so the pause button is the single
  // entry point for everything the header used to offer: sound + back/exit.
  function openPauseMenu() {
    if (!current) return; paused = true;
    showModal({
      accent: current.meta.color, kicker: 'PAUSED', title: current.meta.title,
      bodyHTML: '<p style="color:#8d8478;font-weight:700">Take a breather.</p>',
      actions: [
        { label: 'Resume', icon: MENU_ICONS.play, onClick: () => { paused = false; lastTs = performance.now(); } },
        { label: G.Audio.muted ? 'Sound: Off' : 'Sound: On', icon: G.Audio.muted ? MENU_ICONS.soundOff : MENU_ICONS.soundOn, kind: 'ghost', tone: 'mute', keep: true, onClick: () => { setMute(!G.Audio.muted); if (!G.Audio.muted) G.Audio.blip(660, .08, 'triangle', .12); openPauseMenu(); } },
        { label: 'Restart', icon: MENU_ICONS.redo, kind: 'ghost', tone: 'warn', onClick: () => enterGame(current.meta) },
        { label: 'Level Select', icon: MENU_ICONS.grid, kind: 'ghost', tone: 'nav', onClick: quitToMenu },
        { label: 'Exit game', icon: MENU_ICONS.exit, kind: 'ghost', tone: 'danger', onClick: () => { try { parent.postMessage({ type: 'fcs:exit' }, '*'); } catch (e) {} } },
      ],
    });
  }
  $('#pauseBtn').addEventListener('click', openPauseMenu);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && current && !paused) $('#pauseBtn').click(); });

  /* ---------------- touch controls ---------------- */
  function setupTouch() {
    const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (!isTouch) return;
    $('#touch-controls').classList.remove('hidden');

    // ---- analog joystick → hud.touchDir (direction × tilt 0..1) ----
    const joy = $('#joystick'), knob = $('#joyKnob');
    const R = 46;         // max knob travel (px)
    const DEAD = 0.16;    // ignore tiny tilts so a resting thumb doesn't drift
    let joyId = null, cx = 0, cy = 0;
    function setDir(dx, dy) {
      let len = Math.hypot(dx, dy) || 0;
      if (len > R) { dx = dx / len * R; dy = dy / len * R; len = R; }
      knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      const h = current && current.level.hud; if (!h) return;
      const mag = len / R;
      h.touchDir = mag < DEAD ? null : { x: dx / len * mag, y: dy / len * mag };
    }
    function resetJoy() { joyId = null; knob.style.transform = 'translate(0,0)'; const h = current && current.level.hud; if (h) h.touchDir = null; }
    joy.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const t = e.changedTouches[0]; joyId = t.identifier;
      const r = joy.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      setDir(t.clientX - cx, t.clientY - cy);
    }, { passive: false });
    joy.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) if (t.identifier === joyId) { setDir(t.clientX - cx, t.clientY - cy); break; }
    }, { passive: false });
    const joyEnd = (e) => { for (const t of e.changedTouches) if (t.identifier === joyId) { resetJoy(); break; } };
    joy.addEventListener('touchend', joyEnd); joy.addEventListener('touchcancel', joyEnd);

    // ---- primary skill button: DASH / POUNCE / ACT (held) ----
    const ab = $('#actionBtn');
    ab.addEventListener('touchstart', (e) => { e.preventDefault(); const h = current && current.level.hud; if (h) { h.actionDown = true; h.actionPressed = true; } }, { passive: false });
    const abEnd = (e) => { e.preventDefault(); const h = current && current.level.hud; if (h) h.actionDown = false; };
    ab.addEventListener('touchend', abEnd); ab.addEventListener('touchcancel', abEnd);

    // ---- secondary skill button: BURROW (worm · tap) or SNEAK (fox · hold) ----
    const sb = $('#burrowBtn');
    if (sb) {
      sb.addEventListener('touchstart', (e) => {
        e.preventDefault(); const h = current && current.level.hud; if (!h) return;
        if (current.meta.key === 'worm') h.burrowPressed = true; else h.sneakDown = true;
      }, { passive: false });
      const sbEnd = (e) => { e.preventDefault(); const h = current && current.level.hud; if (h) h.sneakDown = false; };
      sb.addEventListener('touchend', sbEnd); sb.addEventListener('touchcancel', sbEnd);
    }
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
