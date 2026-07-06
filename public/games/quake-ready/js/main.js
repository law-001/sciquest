/* ===========================================================================
   Main — boot, level-select cards, screen flow, HUD plumbing, modals, loop.
   Level-select card system reused from Food Chain Survival (shared SciQuest
   sq-level-* look); progress + messaging use this game's own keys.
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
  // HUD phase glyphs, keyed by the `ico` name each level emits.
  const HUD_ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/></svg>',
    quake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12h4l2-6 3 12 3-9 2 3h6"/></svg>',
    siren: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 19v-6a5 5 0 0 1 10 0v6"/><path d="M4 21h16"/><path d="M12 3v2M4.9 5.9 6.3 7.3M19.1 5.9l-1.4 1.4"/></svg>',
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

  /* ---------------- reduced motion ---------------- */
  G.REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- progress ---------------- */
  const STORE = 'qr_progress_v1';
  function loadProg() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } }
  function saveProg(p) { try { localStorage.setItem(STORE, JSON.stringify(p)); } catch (e) {} }
  let progress = loadProg(); // {1:{cleared:true,stars:3}, ...}

  function unlocked(meta) {
    // TESTING ONLY — all levels unlocked. REVERT before shipping: delete the
    // next line so real level-gating (clear the previous level) applies again.
    return true; // eslint-disable-line no-unreachable
    if (meta.id === 1) return true;
    const prev = G.LEVELS.find((l) => l.id === meta.id - 1);
    return !!(progress[prev.id] && progress[prev.id].cleared);
  }

  /* ---------------- viewport fit ---------------- */
  // Size the root to the live *visible* viewport (works inside the SciQuest
  // iframe and standalone); tracks resize, zoom and orientation changes.
  // Embedded (SciQuest iframe) vs standalone tab — the taskbar cut below only
  // applies standalone; embedded, the host page already sizes the frame.
  let isTopLevel = true;
  try { isTopLevel = global.self === global.top; } catch (e) { isTopLevel = false; }
  function fitViewport() {
    const vv = global.visualViewport;
    // Inside an iframe, visualViewport reflects the TOP-LEVEL page, so it can
    // over-report past the frame the host gave us and push the stage behind the
    // window's taskbar. Clamp both axes to this frame's own layout viewport so
    // --app-w/--app-h fill exactly the host container, never more.
    const frameW = document.documentElement.clientWidth || global.innerWidth;
    const w = Math.round(Math.min(vv ? vv.width : global.innerWidth, frameW));
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
  // A window MOVE fires no resize event but can slide the stage under the OS
  // taskbar — re-measure on a slow poll (standalone only; embedded, the host
  // page tracks the window and resizes the frame, which does fire resize).
  if (isTopLevel) setInterval(fitViewport, 1000);

  /* ---------------- audio mute ---------------- */
  function setMute(m) { G.Audio.muted = m; document.body.classList.toggle('muted', m); try { localStorage.setItem('qr_mute', m ? '1' : '0'); } catch (e) {} }
  setMute(localStorage.getItem('qr_mute') === '1');
  $('#muteBtn').addEventListener('click', () => { setMute(!G.Audio.muted); if (!G.Audio.muted) G.Audio.blip(660, .08, 'triangle', .12); });

  /* ---------------- screens ---------------- */
  function show(name) {
    $('#menu').classList.toggle('show', name === 'menu');
    $('#game').classList.toggle('show', name === 'game');
    document.body.classList.toggle('in-game', name === 'game');
    $('#headTitle').textContent = name === 'menu' ? 'Quake Ready' : (current ? current.meta.title : 'Quake Ready');
    $('#headSub').style.display = name === 'menu' ? '' : 'none';
  }
  // NOTE: on the menu screen there is no level to quit, so the back arrow
  // exits the whole game back to the SciQuest games hub (host listens).
  $('#backBtn').addEventListener('click', () => {
    if (current) { quitToMenu(); }
    else { try { parent.postMessage({ type: 'qr:exit' }, '*'); } catch (e) {} }
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
    $('#progressLabel').textContent = cleared + ' / ' + G.LEVELS.length + ' missions complete';
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
    if (kind === 'survivor') {
      return `<div class="controls-row">
        <span class="ctrl"><span class="keycap">W</span><span class="keycap">A</span><span class="keycap">S</span><span class="keycap">D</span> / <span class="keycap">↑↓←→</span> Move</span>
        <span class="ctrl"><span class="keycap">Space</span> Hold to interact / take cover</span></div>`;
    }
    // sim + ops are pointer-driven
    return `<div class="controls-row">
      <span class="ctrl"><span class="keycap">Mouse</span> ${kind === 'ops' ? 'Click incidents, dispatch from the Command Post' : 'Click the fault · set magnitude & depth · Start'}</span></div>`;
  }

  /* ---------------- level lifecycle ---------------- */
  let current = null;       // {meta, level}
  let raf = 0, lastTs = 0, paused = false;
  const canvas = $('#canvas'), ctx = canvas.getContext('2d');
  const cam = new G.Camera(canvas.width, canvas.height);
  const fx = new G.FX();
  G.Input.bind(canvas);

  function startLevel(id) {
    const meta = G.LEVELS.find((l) => l.id === id);
    showModal({
      accent: meta.color, kicker: 'BEFORE YOU PLAY', title: meta.edu.pre.title,
      bodyHTML: meta.edu.pre.html + (meta.edu.pre.controls ? controlsHTML(meta.edu.pre.controls) : ''),
      actions: [
        { label: 'Back', kind: 'ghost', onClick: () => {} },
        { label: 'Start &nbsp;→', onClick: () => enterGame(meta) },
      ],
    });
  }

  function enterGame(meta) {
    if (current && current.level.cleanup) current.level.cleanup();
    show('game');
    cam.x = 0; cam.y = 0; fx.parts.length = 0; fx.texts.length = 0;
    const Cls = G.LevelClasses[meta.cls];
    const hud = makeHUD(meta);
    const level = new Cls({ ctx, canvas, cam, fx, hud, meta });
    level.hud = hud;
    current = { meta, level };
    level.init();
    paused = false; lastTs = performance.now();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }

  function loop(ts) {
    raf = requestAnimationFrame(loop);
    const dt = clamp((ts - lastTs) / 1000, 0, 0.045); lastTs = ts;
    if (!paused && current) { current.level.update(dt); fx.update(dt); current.level.draw(); }
    G.Input.endFrame();
    const h = current && current.level.hud; if (h) h.actionPressed = false;
  }

  function quitToMenu() {
    cancelAnimationFrame(raf); raf = 0;
    if (current) { current.level.cleanup && current.level.cleanup(); current = null; }
    ['#taskPanel', '#simPanel', '#simSidebar', '#opsPanel'].forEach((s) => { $(s).style.display = 'none'; });
    $('#game').classList.remove('mode-shell');
    hideModal(); show('menu'); renderCards();
  }

  /* ---------------- HUD factory ---------------- */
  function makeHUD(meta) {
    const accent = ACCENTS[meta.color];
    const elBanner = $('#hudBanner'), elHint = $('#hudHint');
    const hud = {
      touchDir: null, actionDown: false, actionPressed: false,
      config(c) {
        document.documentElement.style.setProperty('--accent', c.accent || accent);
        $('#hud').style.setProperty('--accent', c.accent || accent);
        $('#hudRole').textContent = c.role || meta.role.toUpperCase();
        $('#hudRole').style.background = c.accent || accent;
        $('#hudGoal').textContent = c.goal || meta.hudGoal;
        $('#hudTimerWrap').style.display = c.showTimer ? '' : 'none';
        $('#hudPhaseWrap').style.display = c.showPhase ? '' : 'none';
        $('#barHealthRow').style.display = c.showHealth ? '' : 'none';
        $('#barHealthLabel').textContent = c.healthLabel || 'Health';
        $('#hudCountMax').textContent = c.countMax;
        $('#hudCountWrap').style.display = c.countMax != null ? '' : 'none';
        $('#hudCount').style.color = c.accent || accent;
        // Fault Lab dashboard (sidebar + console) rides the shell flag
        $('#simPanel').style.display = c.shell ? '' : 'none';
        $('#simSidebar').style.display = c.shell ? '' : 'none';
        $('#opsPanel').style.display = c.panel === 'ops' ? '' : 'none';
        $('#taskPanel').style.display = c.tasks ? '' : 'none';
        if (c.tasks) $('#taskTitle').textContent = c.tasks;
        $('#actionBtn').textContent = c.actionLabel || 'ACT';
        $('#actionBtn').style.background = (c.accent || accent) + 'ee';
        // pointer-driven levels don't need the joystick even on touch devices
        $('#touch-controls').classList.toggle('hidden', !(c.touch && touchAvailable));
        // shell layout (rail + framed stage + dock) — Fault Lab only
        $('#game').classList.toggle('mode-shell', !!c.shell);
      },
      set(s) {
        if (s.health != null) { const f = $('#barHealth'); f.style.width = clamp(s.health, 0, 100) + '%'; f.classList.toggle('low', s.health < 30); }
        if (s.phase) { $('#hudPhaseIco').innerHTML = HUD_ICONS[s.phase.ico] || ''; $('#hudPhase').textContent = s.phase.name; const w = $('#hudPhaseWrap'); w.classList.toggle('warn', !!s.phase.warn); }
        if (s.count != null) $('#hudCount').textContent = s.count;
        if (s.timer != null) { $('#hudTimer').textContent = fmt(s.timer); $('#hudTimerWrap').classList.toggle('warn', s.timer < 16); }
        if (s.danger != null) $('#hudObjective').classList.toggle('danger', s.danger);
        if (s.goal != null) $('#hudGoal').textContent = s.goal;
      },
      // ----- shared checklist panel (Level 1 discoveries / Level 2 tasks) -----
      setTasks(items) {
        const ul = $('#taskList'); ul.innerHTML = '';
        for (const it of items) {
          const li = document.createElement('li');
          li.dataset.task = it.id;
          li.innerHTML = `<span class="tick"></span><span>${it.label}</span>`;
          ul.appendChild(li);
        }
      },
      taskState(id, state) { // 'done' | 'fail' | ''
        const li = $('#taskList li[data-task="' + id + '"]');
        if (li) { li.classList.toggle('done', state === 'done'); li.classList.toggle('fail', state === 'fail'); }
      },
      banner(text, color, dur) {
        elBanner.textContent = text; elBanner.style.color = color || '#fff'; elBanner.classList.add('show');
        clearTimeout(hud._bt); hud._bt = setTimeout(() => elBanner.classList.remove('show'), (dur || 1.1) * 1000);
      },
      hint(text, dur) { elHint.textContent = text; elHint.classList.add('show'); clearTimeout(hud._ht); hud._ht = setTimeout(() => elHint.classList.remove('show'), (dur || 5.2) * 1000); },
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
        parent.postMessage({ type: 'qr:cleared', levelId: meta.id, stars: payload.stars, allCleared }, '*');
      } catch (e) {}
    }
    const starsRow = `<div class="result-stars">${[0, 1, 2].map((i) => (i < payload.stars
      ? `<svg class="star pop" style="animation-delay:${.15 + i * .18}s" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>`
      : `<svg class="star off" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>`)).join('')}</div>`;
    const stats = (payload.stats || []).map((s) => `<div class="stat-line"><span>${s[0]}</span><b>${s[1]}</b></div>`).join('');
    const feedback = (payload.feedback || []).length
      ? `<div style="margin-top:14px"><b style="font-size:13px;letter-spacing:.06em;color:var(--muted)">COACH'S NOTES</b>${payload.feedback.map((f) => `<p style="margin:7px 0 0;font-size:14px">${f}</p>`).join('')}</div>`
      : '';
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
      accent: meta.color, kicker: payload.resultKicker || (won ? 'MISSION REPORT' : 'MISSION FAILED'),
      title: payload.resultTitle || (won ? 'Well done!' : 'Not this time'),
      bodyHTML: (won ? starsRow : '') + stats + feedback,
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
        { label: 'Exit game', icon: MENU_ICONS.exit, kind: 'ghost', tone: 'danger', onClick: () => { try { parent.postMessage({ type: 'qr:exit' }, '*'); } catch (e) {} } },
      ],
    });
  }
  $('#pauseBtn').addEventListener('click', openPauseMenu);
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && current && !paused) $('#pauseBtn').click(); });

  /* ---------------- touch controls (Level 2 movement) ---------------- */
  const touchAvailable = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  function setupTouch() {
    if (!touchAvailable) return;

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

    // ---- action button (held) ----
    const ab = $('#actionBtn');
    ab.addEventListener('touchstart', (e) => { e.preventDefault(); const h = current && current.level.hud; if (h) { h.actionDown = true; h.actionPressed = true; } }, { passive: false });
    const abEnd = (e) => { e.preventDefault(); const h = current && current.level.hud; if (h) h.actionDown = false; };
    ab.addEventListener('touchend', abEnd); ab.addEventListener('touchcancel', abEnd);
  }

  /* ---------------- boot ---------------- */
  renderCards();
  setupTouch();
  show('menu');
})(window);
