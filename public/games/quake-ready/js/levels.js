/* ===========================================================================
   Levels — metadata, educational cards, and a small shared LevelBase.
   Individual level classes (Level1..3) register on Game.LevelClasses.
   =========================================================================== */
(function (global) {
  'use strict';
  const G = global.Game;

  const ICO = {
    wave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/><path d="M2 18c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
    gauge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20a8 8 0 1 1 8-8"/><path d="M12 12l5-3"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l1.5 12.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5L6 8Z"/><path d="M9 11V6a3 3 0 0 1 6 0v5"/></svg>',
    table: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="4" rx="1.5"/><path d="M6 11v7M18 11v7"/></svg>',
    siren: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19V13a5 5 0 0 1 10 0v6"/><path d="M4 21h16"/><path d="M12 3v2M4.9 5.9 6.3 7.3M19.1 5.9l-1.4 1.4"/></svg>',
    truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7h11v9H2zM13 10h5l3 3v3h-8z"/><circle cx="6.5" cy="18.5" r="2"/><circle cx="16.5" cy="18.5" r="2"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3.1A4.6 4.6 0 0 1 20 10c0 5.8-8 11-8 11Z"/></svg>',
  };
  const fact = (ico, html) => `<div class="fact"><span class="fico">${ico}</span><div>${html}</div></div>`;

  /* ----- level metadata (drives cards + edu modals + HUD) ----- */
  const LEVELS = [
    {
      id: 1, key: 'sim', cls: 'Level1', color: 'orange', num: '01',
      role: 'Seismologist', title: 'Fault Lab',
      desc: 'Run your own earthquakes on a slice of the Earth. Pick a spot on the fault, crank the magnitude, and watch waves, shaking towns — and tsunamis — follow the rules of real seismology.',
      stars: 3, goal: 'Make 4 discoveries',
      hudGoal: 'Complete the 4 discoveries',
      edu: {
        pre: {
          title: 'You are the Seismologist',
          html: `<p>Earthquakes start deep underground, where two blocks of the Earth's <b>crust</b> suddenly slip past each other along a crack called a <b>fault</b>.</p>
                 ${fact(ICO.target, `The slip starts at the <b>focus (hypocenter)</b>, underground. The point on the surface directly above it is the <b>epicenter</b> — that's where shaking arrives first.`)}
                 ${fact(ICO.gauge, `<b>Magnitude</b> measures the energy released. Each whole step (M6&nbsp;→&nbsp;M7) releases about <b>32× more energy</b> — M9 is a monster, not "a bit bigger" than M8.`)}
                 ${fact(ICO.wave, `A big, <b>shallow</b> quake <b>under the ocean</b> can shove the whole water column and launch a <b>tsunami</b>. Deep quakes shake the surface much less.`)}`,
          controls: 'sim',
        },
        post: {
          title: 'Focus, epicenter, and why depth matters',
          html: `<p>You just proved the three big rules: shaking is strongest near the <b>epicenter</b> and fades with distance; a <b>deeper focus</b> means the waves lose more energy before they reach the surface; and only large, shallow, <b>undersea</b> quakes displace enough water to make a tsunami. Next mission: you're inside the quake.</p>`,
        },
      },
    },
    {
      id: 2, key: 'survivor', cls: 'Level2', color: 'teal', num: '02',
      role: 'Survivor', title: 'Shake Safe',
      desc: 'An earthquake is coming — you just don\'t know when. Prepare your house, protect yourself when the shaking starts, and stay sharp afterwards. Everything you skip comes back to bite you.',
      stars: 3, goal: 'Survive before, during & after',
      hudGoal: 'Prepare the house',
      edu: {
        pre: {
          title: 'Before · During · After',
          html: `<p>Surviving an earthquake is mostly decided <b>before</b> it starts. You'll play all three phases — and your preparation in phase one changes what happens later.</p>
                 ${fact(ICO.bag, `<b>Before:</b> strap tall furniture, turn off hazards, pack a <b>go-bag</b> (water, flashlight, first-aid kit, radio), and know your exits and family meeting place.`)}
                 ${fact(ICO.table, `<b>During:</b> <b>DUCK</b> under a sturdy table, <b>COVER</b> your head, and <b>HOLD ON</b> until the shaking stops. Stay away from windows. Never use elevators or run outside mid-shake.`)}
                 ${fact(ICO.shield, `<b>After:</b> check people for injuries, shut off leaking gas if it's safe, take your go-bag, move to an open evacuation area — and expect <b>aftershocks</b>.`)}`,
          controls: 'survivor',
        },
        post: {
          title: 'Preparedness is a superpower',
          html: `<p>Notice what hurt you: it was almost always something that could have been prepared away — an unstrapped shelf, a missing first-aid kit, standing near glass. Real earthquakes last under a minute; the choices that save lives are made in the calm weeks before. Final mission: the whole town needs you.</p>`,
        },
      },
    },
    {
      id: 3, key: 'ops', cls: 'Level3', color: 'gold', num: '03',
      role: 'Commander', title: 'Rescue Ops',
      desc: 'A major quake just hit Bayside Town. Fires spread, the school collapsed, the bridge is blocked. Command rescue teams with limited fuel, crews, and time — and choose who gets help first.',
      stars: 3, goal: 'Save as many lives as you can',
      hudGoal: 'Command the response',
      edu: {
        pre: {
          title: 'You are the Incident Commander',
          html: `<p>After a disaster, responders never have enough people, fuel, or time. Commanders <b>triage</b>: life-saving first, spreading dangers second, everything else after.</p>
                 ${fact(ICO.siren, `Click a flashing <b>incident</b> on the map, then choose which unit to send from the Command Post. Trapped people have a <b>survival timer</b> — watch it.`)}
                 ${fact(ICO.truck, `Every dispatch burns <b>fuel</b> and units drive by road. A <b>blocked bridge</b> stops everyone — sometimes clearing a road saves more lives than a rescue.`)}
                 ${fact(ICO.heart, `Injured survivors must reach a <b>working hospital</b>. No electricity, no surgeons — infrastructure keeps people alive too.`)}`,
          controls: 'ops',
        },
        post: {
          title: 'How communities recover',
          html: `<p>You just ran a real emergency-management playbook: reopen routes, protect the hospital, stop fires before they spread, and always put lives first. Recovery isn't one hero — it's rescue teams, fire crews, medics, engineers and line workers, coordinated. That coordination is why prepared communities lose fewer people to the same size quake.</p>`,
        },
      },
    },
  ];

  /* ----- shared base class ----- */
  class LevelBase {
    constructor(env) {
      this.ctx = env.ctx; this.canvas = env.canvas; this.cam = env.cam;
      this.fx = env.fx; this.hud = env.hud; this.meta = env.meta;
      this.W = env.canvas.width; this.H = env.canvas.height;
      this.over = false; this.won = false;
      this.time = 0;
    }
    finish(won, payload) {
      if (this.over) return; this.over = true; this.won = won;
      if (won) G.Audio.win(); else G.Audio.lose();
      this.hud.banner(won ? 'Mission complete!' : 'Try again', won ? '#aee05a' : '#f1955a');
      setTimeout(() => this.hud.result(won, payload || this.scorePayload()), 1200);
    }
    scorePayload() { return { stars: 1, stats: [], feedback: [] }; }
    cleanup() {}
  }

  G.LEVELS = LEVELS;
  G.LevelBase = LevelBase;
  G.LevelClasses = {};
})(window);
