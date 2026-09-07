/* ===========================================================================
   SciQuest — shared level-select renderer for iframe games.

   Attaches `window.SciQuest.LevelSelect` with the accent/star/icon constants
   and the card renderer that food-chain-survival + quake-ready ship. Each
   game keeps its own `levels.js` data + its own progress store; only the DOM
   shape + unlock chain live here.

   Requires the `sq-level-*` CSS from each game's ui.css (already present).
   Load BEFORE the game's own `main.js`:
     <script src="../_shared/level-select.js"></script>
   =========================================================================== */
(function (global) {
  'use strict';
  const NS = global.SciQuest = global.SciQuest || {};

  const ACCENTS = { orange: '#EE6A1F', teal: '#13A597', gold: '#E2A41C' };
  const ACCENT_BARS = {
    orange: 'linear-gradient(90deg,#EE6A1F,#F5894A)',
    teal:   'linear-gradient(90deg,#13A597,#37BCAE)',
    gold:   'linear-gradient(90deg,#E2A41C,#F0BE48)',
  };
  const ACCENT_SOFT = { orange: '#FCEADD', teal: '#DCF0EC', gold: '#FBEFCF' };

  const STAR     = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>';
  const STAR_OFF = '<svg class="off" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>';
  const LOCK_SVG  = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  const CHECK_SVG = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12l5 5L20 6"/></svg>';
  const ARROW_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* Default unlock chain: level 1 always open; level N unlocks once level N-1
     is cleared. Games with a custom rule (e.g. testing mode = all unlocked)
     pass their own `isUnlocked` fn to `render`. */
  function chainUnlock(meta, levels, progress) {
    if (meta.id === 1) return true;
    const prev = levels.find((l) => l.id === meta.id - 1);
    if (!prev) return true;
    return !!(progress[prev.id] && progress[prev.id].cleared);
  }

  /* Render level cards into `container` and wire click handlers.
     Returns { cleared, total } so the caller can update its own footer text.

     Options:
       container   — the .sq-level-grid element to fill
       levels      — array of level metadata (needs id/num/title/desc/goal/color/stars)
       progress    — plain object `{ [levelId]: {cleared, stars} }`
       isUnlocked  — optional (meta) => boolean; falls back to chainUnlock
       onPlay      — (levelId:number) => void, fired when an unlocked card is clicked
       footerEl    — optional element whose textContent gets the summary
       footerText  — optional (cleared, total) => string; only used with footerEl
  */
  function render({ container, levels, progress, isUnlocked, onPlay, footerEl, footerText }) {
    container.innerHTML = '';
    let cleared = 0;
    const unlockedFn = isUnlocked || ((m) => chainUnlock(m, levels, progress));

    for (const meta of levels) {
      const pr = progress[meta.id] || {};
      const isUnlk = unlockedFn(meta);
      const done = !!pr.cleared; if (done) cleared++;
      const accent = ACCENTS[meta.color] || ACCENTS.orange;
      const total = meta.stars;
      const earned = done ? (pr.stars || 0) : 0;

      let pill;
      if (!isUnlk) pill = '<span class="sq-pill">' + LOCK_SVG + 'Locked</span>';
      else if (done) pill = '<span class="sq-pill sq-pill--teal">' + CHECK_SVG + 'Cleared</span>';
      else pill = '<span class="sq-pill sq-pill--orange">New</span>';

      let stars = '';
      for (let i = 0; i < total; i++) stars += i < earned ? STAR : STAR_OFF;

      const foot = isUnlk
        ? '<button class="sq-level-play" data-id="' + meta.id + '" style="background:' + accent + ';border-color:' + accent + '">' + (done ? 'Continue' : 'Start') + ARROW_SVG + '</button>'
        : '<p class="sq-level-lock">' + LOCK_SVG + 'Complete Level ' + (meta.id - 1) + ' first</p>';

      const card = document.createElement('article');
      card.className = 'sq-level-card' + (isUnlk ? '' : ' sq-level-card--locked');
      card.setAttribute('aria-disabled', String(!isUnlk));
      if (isUnlk) card.dataset.id = meta.id;
      card.innerHTML =
        '<div class="sq-level-card__accent" style="background:' + accent + '"></div>' +
        '<div class="sq-level-badge">' + pill + '</div>' +
        '<div class="sq-level-card__num" style="color:' + (isUnlk ? accent : 'var(--sq-ink-4)') + '">' +
          '<small>Level ' + meta.num + '</small>' + meta.num +
        '</div>' +
        '<div><div class="sq-level-card__name" style="color:' + (isUnlk ? 'var(--sq-ink-1)' : 'var(--sq-ink-4)') + '">' + meta.title + '</div></div>' +
        '<div class="sq-level-card__goal">' + meta.desc + '</div>' +
        '<div class="sq-level-card__foot">' +
          '<span class="sq-stars" aria-label="' + earned + ' of ' + total + ' stars">' + stars + '</span>' +
          '<span class="sq-level-card__count">' + earned + ' / ' + total + ' stars</span>' +
        '</div>' +
        foot;
      container.appendChild(card);
    }

    container.querySelectorAll('.sq-level-card:not(.sq-level-card--locked)').forEach((c) => {
      c.addEventListener('click', () => { onPlay(+c.dataset.id); });
    });

    if (footerEl && footerText) footerEl.textContent = footerText(cleared, levels.length);
    return { cleared, total: levels.length };
  }

  /* ---------------- theme controller ----------------
     Class-based `sq-dark` on <html>. On load: read localStorage; if unset,
     follow OS `prefers-color-scheme`. Live-follow the OS pref if the user
     has NOT manually toggled. bindThemeToggle() rewires a button so it
     flips the class + persists the choice, and paints the sun/moon glyph.
     Call SciQuest.LevelSelect.initTheme() before rendering the menu. */
  const THEME_KEY = 'sq-theme';
  const SUN_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  const MOON_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function savedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function systemDark() {
    return !!(global.matchMedia && global.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function isDark() {
    const saved = savedTheme();
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return systemDark();
  }
  function applyDark(dark) {
    document.documentElement.classList.toggle('sq-dark', dark);
    for (const btn of document.querySelectorAll('[data-sq-theme-toggle]')) {
      btn.innerHTML = dark ? SUN_SVG : MOON_SVG;
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  let themeInited = false;
  function initTheme() {
    if (themeInited) return;
    themeInited = true;
    applyDark(isDark());
    if (global.matchMedia) {
      const mq = global.matchMedia('(prefers-color-scheme: dark)');
      const onChange = () => { if (!savedTheme()) applyDark(mq.matches); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  function bindThemeToggle(btn) {
    if (!btn) return;
    btn.setAttribute('data-sq-theme-toggle', '');
    applyDark(isDark());
    btn.addEventListener('click', () => {
      const nextDark = !document.documentElement.classList.contains('sq-dark');
      try { localStorage.setItem(THEME_KEY, nextDark ? 'dark' : 'light'); } catch (e) {}
      applyDark(nextDark);
    });
  }

  NS.LevelSelect = {
    ACCENTS, ACCENT_BARS, ACCENT_SOFT,
    STAR, STAR_OFF, LOCK_SVG, CHECK_SVG, ARROW_SVG,
    SUN_SVG, MOON_SVG,
    chainUnlock, render,
    initTheme, bindThemeToggle,
  };
})(window);
