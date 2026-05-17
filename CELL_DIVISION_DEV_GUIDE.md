# Cell Division: Divide & Defend — Step-by-Step Dev Guide

Each step is a self-contained prompt. Paste one at a time into a fresh Claude session.
Complete each step fully before moving to the next. Steps build on each other.

---

## STEP 1 — Folder scaffold + registry entry

```
I'm building a Phaser 3 tower defense game called "Cell Division: Divide & Defend" inside
an existing React 19 + Vite app called SciQuest. The game folder convention is:

  src/games/<game-slug>/
    index.jsx        ← GameComponent (default export)
    manifest.js      ← id, version, scenes list
    scenes/          ← Phaser scenes
    ui/              ← React HUD components
    data/            ← static game data
    systems/         ← game logic systems
    audio/           ← audio helpers

Create the following empty scaffold for src/games/cell-division-defense/:

1. manifest.js — export const manifest with id='cell-division-defense', version='0.1.0',
   scenes: ['BootScene','CellDefenseScene']

2. data/towers.js — export const TOWERS object with 3 entries:
   lysosome: { id, displayName:'Lysosome', cost:80, upgradeCost:40, range:120, damage:15,
     fireRate:1200, target:'single', slot:'membrane',
     description:'Digests invading pathogens. Drops ATP on kill.',
     upgrade:{ damage:25, splash:60 } }
   proteinKinase: { id, displayName:'Protein Kinase', cost:120, upgradeCost:60, range:160,
     damage:10, fireRate:1800, target:'single', slot:'membrane',
     description:'Slows enemies 40% with phosphorylation.',
     upgrade:{ slow:0.6, chain:true } }
   repairEnzyme: { id, displayName:'Repair Enzyme', cost:100, upgradeCost:50, range:0,
     damage:0, fireRate:0, target:'nucleus', slot:'membrane',
     description:'Regenerates 2 HP/sec to nucleus. Cannot attack.',
     upgrade:{ hpRegen:4, curesMutation:true } }

3. data/enemies.js — export const ENEMIES object with 3 entries:
   viralHijacker: { id, displayName:'Viral Hijacker', hp:60, speed:80, reward:20,
     onReachNucleus:'mutation:pointMutation', abilityLabel:'DNA Insert!' }
   radiationPulse: { id, displayName:'Radiation Pulse', hp:40, speed:50, reward:15,
     onReachNucleus:'mutation:frameshiftMutation', abilityLabel:'AOE Burst!',
     deathEffect:'aoe' }
   toxinDroplet: { id, displayName:'Toxin Droplet', hp:80, speed:70, reward:25,
     onReachNucleus:'mutation:pointMutation', abilityLabel:'Tower Silence!',
     silenceDuration:10000 }

4. data/mutations.js — export const MUTATIONS object:
   pointMutation: { id, name:'Point Mutation', effect:'hp:-5', biologyNote:'...' }
   frameshiftMutation: { id, name:'Frameshift Mutation', effect:'towerOutput:0.5',
     biologyNote:'...' }
   chromatinBridge: { id, name:'Chromatin Bridge', effect:'towerDisable:1wave',
     biologyNote:'...' }
   nondisjunction: { id, name:'Nondisjunction', effect:'splitImbalance',
     biologyNote:'In real cells this can cause Down syndrome.' }
   deletion: { id, name:'Deletion', effect:'maxHp:-10%', biologyNote:'...' }
   openNucleus: { id, name:'Open Nucleus', effect:'enemyDoubleDamage:1',
     biologyNote:'...' }

5. data/levels.js — export const LEVELS array with 5 entries for Act 1 (mitosis).
   All 3 enemy types appear in every level. Scale difficulty by increasing count and
   decreasing interval each level.
   Level 1 example: startAtp:300, phases:['interphase','prophase','metaphase',
   'anaphase','telophase','cytokinesis'],
   waves.prophase: [{type:'viralHijacker',count:2,interval:2500},
                    {type:'radiationPulse',count:1,interval:3000},
                    {type:'toxinDroplet',count:1,interval:3500}]

6. data/phases.js — export const PHASES object with 6 entries:
   interphase, prophase, metaphase, anaphase, telophase, cytokinesis.
   Each has: { id, displayName, color, minigameId (null for interphase),
   teachingText, mutationOnFail }

7. Add this entry to src/lib/games/registry.js inside the GAMES object:
   'cell-division-defense': {
     id: 'cell-division-defense',
     title: 'Cell Division: Divide & Defend',
     tagline: 'Defend the nucleus and guide your cell through mitosis',
     subject: 'Science',
     relatedLessonIds: ['week-07-cell-division','week-08-meiosis'],
     difficulty: 2,
     estimatedMinutes: 12,
     thumbnail: null,
     engine: 'phaser',
     category: 'Biology',
     loader: () => import('../../games/cell-division-defense/index.jsx'),
     minRole: 'student',
   }

No game logic yet — just the data files and registry entry. Use plain JSX (no TypeScript).
```

---

## STEP 2 — GameComponent shell + Phaser init

```
I'm building a Phaser 3 game called "Cell Division: Divide & Defend" inside a React 19 app
(SciQuest). I need to create src/games/cell-division-defense/index.jsx.

Context:
- The file must default-export a React component called CellDivisionDefense
- It accepts these props: { user, profile, onExit, onProgressUpdate, initialChallengeId,
  reducedMotion, deviceTier }
- Phaser.Game is created exactly ONCE per mount using a useRef guard (StrictMode safe)
- React ↔ Phaser communication is ONLY via the shared EventBus at
  src/games/_shared/eventBus.js — never pass React state/refs into Phaser scenes
- Phaser canvas goes in a div that fills the available space
- The existing pattern to follow is src/games/matter-state-sandbox/index.jsx

Create src/games/cell-division-defense/index.jsx that:
1. Imports EventBus from '../../_shared/eventBus'
2. Creates the Phaser.Game config in a useEffect with useRef guard:
   - renderer: Phaser.AUTO
   - width/height: match parent container (use scale manager: ScaleManager.FIT,
     autoCenter: CENTER_BOTH)
   - backgroundColor: '#0D1B2A'
   - physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } }
   - scene: [BootScene, CellDefenseScene] (import placeholders for now — these files
     don't exist yet so just comment them out and add an empty scene inline for now)
   - parent: the container div ref
3. Cleans up (game.destroy(true)) on unmount
4. Passes reducedMotion and deviceTier to the Phaser game via EventBus after game creates
5. Renders a full-height flex container: canvas area takes all remaining space
6. Renders a minimal React overlay div above the canvas (placeholder for HUD — empty for now)
7. Listens for EventBus 'runComplete' event and calls onProgressUpdate with the payload

Keep it minimal — no HUD components yet. Just the working Phaser shell.
```

---

## STEP 3 — BootScene + CellDefenseScene skeleton

```
I'm building a Phaser 3 tower defense game (Cell Division: Divide & Defend) inside SciQuest.

Create two Phaser scene files:

--- src/games/cell-division-defense/scenes/BootScene.js ---
Extends Phaser.Scene with key 'BootScene'.
preload(): load placeholder colored rectangles as named texture keys using
  this.make.graphics() + generateTexture() for these assets:
  'lysosome' 48×48 orange circle
  'proteinKinase' 48×48 blue ellipse
  'repairEnzyme' 48×48 green C-shape (just a circle for now)
  'viralHijacker' 44×44 purple hexagon
  'radiationPulse' 44×44 amber circle
  'toxinDroplet' 44×44 green teardrop (ellipse for now)
  'projectile' 12×12 yellow circle
  'atpPickup' 14×14 bright yellow circle
create(): this.scene.start('CellDefenseScene')

--- src/games/cell-division-defense/scenes/CellDefenseScene.js ---
Extends Phaser.Scene with key 'CellDefenseScene'.

Properties to declare in constructor:
  this.cellCX, this.cellCY  (center of cell — computed in create)
  this.cellR = 0            (membrane radius — computed in create)
  this.nucleusR = 0
  this.hp = 100
  this.atp = 300
  this.mutations = []
  this.phase = 'interphase'
  this.wave = 0
  this.paused = false
  this.towers = []           (active tower objects)
  this.enemies = []          (active enemy objects)
  this.projectiles = []
  this.atpPickups = []
  this.towerSlots = []       (12 radial positions on membrane)

create():
  1. Compute cellCX = game.scale.width * 0.55 (shifted right to leave space for tower panel)
     cellCY = game.scale.height * 0.5
     cellR = Math.min(game.scale.width, game.scale.height) * 0.36
     nucleusR = cellR * 0.22
  2. Draw hex grid using Graphics (size 36, rgba(255,255,255,0.04) stroke, 0.8 lineWidth,
     full canvas coverage)
  3. Draw cell membrane using Graphics:
     - Radial gradient fill: rgba(59,175,169,0.14) center → rgba(59,175,169,0.50) edge
     - Teal stroke #3BAFA9, lineWidth 3
     - Add a slow pulse tween on the Graphics alpha (0.85 → 1.0, yoyo, repeat -1, duration 2000)
  4. Draw nucleus orb using Graphics:
     - Radial gradient from #A8C8F0 to #5B8FD4, radius nucleusR
     - Shadow glow: add a larger semi-transparent circle beneath it for glow effect
     - Slow pulse tween on scale (0.96 → 1.04, yoyo, repeat -1, duration 2800)
  5. Compute towerSlots: 12 evenly spaced angles around cellR. Each slot = { angle, x, y,
     towerId: null }. Draw a small dim circle at each slot position.
  6. Listen to EventBus events:
     'pause' → this.physics.pause(), this.paused = true
     'resume' → this.physics.resume(), this.paused = false
     'placeTower' → stub (logs payload)
     'sellTower' → stub
     'minigameResult' → stub

update(time, delta):
  if paused return
  Emit 'stateChanged' with { hp, atp, mutations, phase, wave } every 60 frames
  (use a frame counter to throttle — not every frame)

No enemy movement, no combat yet. Just the visual skeleton.
Wire BootScene and CellDefenseScene into index.jsx (replace the inline placeholder scene).
```

---

## STEP 4 — React HUD (top bar + tower panel)

```
I'm building a Phaser 3 tower defense game inside a React 19 app (SciQuest).
The game is at src/games/cell-division-defense/.
React ↔ Phaser communication is ONLY via EventBus at src/games/_shared/eventBus.js.
The Phaser canvas fills the right ~82% of the screen. The left ~18% is a React tower panel.

Create these React components:

--- src/games/cell-division-defense/ui/CellDefenseHUD.jsx ---
Props: { hp, atp, phase, mutations, wave, totalWaves, onPause, onExit }

Renders a top bar spanning full width, position absolute top-0 left-0, height 56px,
background rgba(0,0,0,0.68), z-index 10, font-family Courier New.

Left section (flex row, gap 6px):
  - 6 phase dots (small circles 10px). Colors per phase:
    interphase:#3BAFA9, prophase:#9B59B6, metaphase:#00FFCC,
    anaphase:#FFD700, telophase:#A8C8F0, cytokinesis:#FF6B6B
    Filled = completed. Current = glowing with box-shadow matching color. Future = #333.
  - Phase name label in bold matching current phase color

Center section:
  - ❤ HP bar: red, text "HP: {hp}/100", show a thin bar beneath the text
  - ⚡ ATP: yellow, text "ATP: {atp}"

Right section:
  - [⏸] pause button, orange border, calls onPause
  - [← EXIT] button, calls onExit

--- src/games/cell-division-defense/ui/TowerPanel.jsx ---
Props: { towers (TOWERS data), selectedTower, onSelect, atp }

Renders a vertical left panel, width 160px, height 100%, background #1A2E1A,
border-right 1px solid rgba(59,175,169,0.2), padding 8px, display flex flex-col gap 8px.

Header: "DEFENDERS" in teal, font-size 11px, letter-spacing 2px, Courier New.

For each tower in towers (3 total):
  Render a tower card: rounded rect (border-radius 12px), background rgba(0,0,0,0.4),
  border 1.5px solid the tower's accent color (lysosome:#FF6B35, kinase:#1A6EFF,
  repair:#2ECC71). Padding 8px. Cursor pointer.

  Card contents (top to bottom):
    - Tower icon placeholder: a 48×48 colored circle in the tower's accent color
      (we'll replace with real sprites later)
    - Tower name in bold, 12px, matching accent color
    - Cost: "⚡{cost} ATP" in yellow, 10px
    - A 1-line description, 9px, rgba(255,255,255,0.6)

  If selectedTower === tower.id: add glowing orange border box-shadow
  If atp < tower.cost: 50% opacity, cursor not-allowed

  onClick: call onSelect(tower.id) if atp >= tower.cost

--- Wire into index.jsx ---
Add local state: hp=100, atp=300, phase='interphase', mutations=[], wave=0, selectedTower=null
Listen to EventBus 'stateChanged' and update all state.
Render CellDefenseHUD above the canvas (position absolute, z-index 10).
Render TowerPanel to the left of the canvas (flex layout).
When TowerPanel calls onSelect, emit EventBus 'towerSelected' with the tower id.
Pass onExit → props.onExit.

Use Tailwind where practical. No TypeScript. No new fonts.
```

---

## STEP 5 — Tower placement system

```
I'm building a Phaser 3 tower defense game (Cell Division: Divide & Defend) in SciQuest.
All files are at src/games/cell-division-defense/.

The game has 12 radial tower slots on the cell membrane ring.
Slots are computed in CellDefenseScene: evenly spaced by angle, positioned at (cellCX +
cos(angle)*cellR, cellCY + sin(angle)*cellR).

Create src/games/cell-division-defense/systems/TowerSystem.js:

class TowerSystem {
  constructor(scene, slots, towerDefs) — stores references

  placeTower(slotIndex, towerId):
    - if slot is occupied, return false
    - look up towerDef from TOWERS[towerId]
    - create a Phaser.GameObjects.Sprite at slot position using towerId as texture key
    - set depth 5
    - add a range indicator circle (Graphics) at slot position, radius=towerDef.range,
      rgba(255,255,255,0.06) fill, thin teal stroke — hidden by default, show on hover
    - add a slow idle tween: y ±4px, yoyo, repeat -1, duration 1500 + random offset
    - store in slots[slotIndex].tower = { id, sprite, rangeCircle, def, cooldown:0,
      silenced:false, disabled:false, upgraded:false }
    - return true

  sellTower(slotIndex):
    - destroy sprite and rangeCircle
    - clear slots[slotIndex].tower
    - return Math.floor(def.cost * 0.5) (sell refund)

  upgradeTower(slotIndex):
    - set slots[slotIndex].tower.upgraded = true
    - apply upgrade stats from towerDef.upgrade
    - tint sprite slightly brighter

  update(delta, enemies, onSpawnProjectile, atpCallback):
    - iterate slots with an active tower
    - skip if tower.silenced or tower.disabled
    - repairEnzyme: every 1000ms, call atpCallback('heal', 2) — heals nucleus not ATP
    - other towers: find nearest enemy in range (distance check),
      if cooldown elapsed: call onSpawnProjectile(towerPos, enemy, tower.def),
      reset cooldown to def.fireRate
    - tick down cooldown by delta

  silenceTower(slotIndex, duration): set tower.silenced=true, setTimeout to clear
  disableTower(slotIndex): set tower.disabled=true
  enableTower(slotIndex): set tower.disabled=false
  getOccupiedSlots(): returns array of slotIndex where tower exists
}

export default TowerSystem

--- In CellDefenseScene ---
Import TowerSystem. Instantiate in create() after slots are built.
Replace the 'placeTower' EventBus stub:
  EventBus.on('placeTower', ({ towerId, slotIndex }) => {
    const placed = this.towerSystem.placeTower(slotIndex, towerId)
    if (placed) {
      this.atp -= TOWERS[towerId].cost
      EventBus.emit('stateChanged', { ...state })
    }
  })

Replace 'sellTower' stub similarly.

When user clicks a tower slot in the scene (add pointerdown to each slot zone):
  EventBus.emit('towerSlotClicked', { slotIndex, isEmpty: !slot.tower })

No projectile logic yet — onSpawnProjectile is a stub that logs.
```

---

## STEP 6 — Enemy system + wave spawning

```
I'm building a Phaser 3 tower defense game (Cell Division: Divide & Defend) in SciQuest.
Files at src/games/cell-division-defense/.

Enemies spawn from 3 breach points on the canvas edge and walk curved arc paths
toward the nucleus center. They do NOT use dynamic pathfinding — they follow a
pre-baked Phaser.Curves.QuadraticBezier from their breach point to the nucleus.

Create src/games/cell-division-defense/systems/EnemySystem.js:

BREACH POINTS (computed relative to cellCX, cellCY):
  top-left: { x: cellCX - cellR*1.4, y: cellCY - cellR*1.2 }
  top-right: { x: cellCX + cellR*1.4, y: cellCY - cellR*1.2 }
  bottom:    { x: cellCX, y: cellCY + cellR*1.5 }

Each breach point has a QuadraticBezier to (cellCX, cellCY) with a control point
offset toward the membrane ring (so enemies curve around the outside slightly before
entering).

class EnemySystem {
  constructor(scene, breachPoints, cellCX, cellCY, enemyDefs)

  spawnEnemy(type, breachIndex):
    - look up enemyDef from ENEMIES[type]
    - pick the Phaser.Curves path for that breachIndex
    - create a PathFollower: this.scene.add.follower(path, startX, startY, type)
    - set follower.startFollow({ duration: pathDuration, repeat: 0 })
      pathDuration = (pathLength / enemyDef.speed) * 1000
    - add HP bar Graphics above the sprite (drawn each frame in update)
    - add name label Text (small, 8px, above HP bar)
    - store in this.enemies array: { sprite: follower, def, hp: def.hp, maxHp: def.hp,
        type, breachIndex, alive: true, silenceTarget: null }
    - on follower 'oncomplete': call this.onReachNucleus(enemy)

  spawnWave(waveConfig):
    — waveConfig is an array like [{type:'viralHijacker', count:3, interval:2000}]
    — use this.scene.time.addEvent to stagger spawns by interval across breach points
    — cycle breach points: enemy i goes to breach i % 3

  update(delta):
    - for each alive enemy: redraw HP bar above sprite (Graphics cleared and redrawn)
    - remove dead enemies (hp <= 0) from array, destroy sprite, emit 'atpPickupSpawned'
      with { x, y, amount: def.reward }

  damageEnemy(enemy, amount):
    enemy.hp -= amount
    if hp <= 0: mark alive=false, trigger death (see update)

  onReachNucleus(enemy):
    - emit EventBus 'enemyReachedNucleus' { enemyType: enemy.type,
        mutationType: enemy.def.onReachNucleus }
    - destroy sprite
    - remove from array

  silenceNearestTower(enemy, towerSystem, duration):
    find closest tower slot, call towerSystem.silenceTower(slotIndex, duration)
    show a small "Tower Silenced!" label for 2 seconds above that tower

  allEnemiesDead(): return this.enemies.filter(e=>e.alive).length === 0
}

export default EnemySystem

--- In CellDefenseScene ---
Instantiate EnemySystem in create().
Add a 'waveStarted' flow: when phase starts, call enemySystem.spawnWave(waveConfig)
  using LEVELS[currentLevel].waves[currentPhase].
In update(): call enemySystem.update(delta).
Listen to EventBus 'enemyReachedNucleus': apply damage to this.hp, trigger mutation
  via the mutation stub.
Wire 'waveCleared': after each wave check enemySystem.allEnemiesDead() — if true
  emit 'waveCleared' and trigger phase transition.
```

---

## STEP 7 — Projectile system + ATP pickups

```
I'm building a Phaser 3 tower defense game (Cell Division: Divide & Defend) in SciQuest.
Files at src/games/cell-division-defense/.

Create src/games/cell-division-defense/systems/ProjectileSystem.js:

class ProjectileSystem {
  constructor(scene)

  fire(fromX, fromY, target, towerDef):
    - create a Phaser.GameObjects.Arc (filled circle) at fromX,fromY
    - color: lysosome=0xFFEE00, proteinKinase=0xFFD700, repairEnzyme=0x00FF88
    - radius 6
    - set depth 8
    - tween it toward target sprite position:
        duration: based on distance / 320 (px per second)
        onUpdate: update position toward target.x, target.y each frame
        (use a manual update loop in update() — not a tween — for accuracy)
    - store { sprite, target, speed:320, def: towerDef, alive:true }

  update(delta):
    for each projectile:
      - if target is dead or not alive: destroy, remove
      - move toward target position by speed*delta/1000 px
      - if distance to target < 8: hit! call this.onHit(projectile)

  onHit(projectile):
    - call hitCallback(projectile.target, projectile.def)
    - if def has splash: apply damage to all enemies within splash radius
    - spawn 3 burst particles at hit position (small colored circles that fade out)
    - destroy projectile sprite, remove from array

  registerHitCallback(fn): stores fn(enemy, towerDef)
}

--- ATP Pickup system (inline in CellDefenseScene, small enough) ---
Listen to 'atpPickupSpawned' EventBus event:
  - Create a small yellow circle sprite at { x, y }
  - Add a gentle float tween (y -6px, yoyo, repeat 3)
  - Make it interactive (setInteractive)
  - On pointerdown: collect — add amount to this.atp, destroy sprite,
    emit stateChanged, show "+{amount} ATP" floating text that fades up

--- Wire everything in CellDefenseScene ---
Instantiate ProjectileSystem in create().
Pass onSpawnProjectile to TowerSystem:
  (fromPos, enemy, def) => this.projectileSystem.fire(fromPos.x, fromPos.y, enemy.sprite, def)
Register hit callback on ProjectileSystem:
  (enemy, def) => {
    this.enemySystem.damageEnemy(enemy, def.damage)
    if def has slow effect: apply slow to enemy (reduce pathFollower timeScale)
  }
In update(): call projectileSystem.update(delta).
```

---

## STEP 7.5 — Attack & ability animations

```
I'm building a Phaser 3 tower defense game (Cell Division: Divide & Defend) in SciQuest.
Files at src/games/cell-division-defense/. Steps 1–7 are complete:
- TowerSystem fires projectiles via ProjectileSystem
- EnemySystem moves enemies along Bezier paths to the nucleus
- All entities are Phaser.GameObjects drawn with Graphics/Arc/Text

I now need per-entity attack and ability animations. All animation must be implemented
using Phaser primitives only (Tweens, Graphics, Arc, Text, Particles). No external
sprite sheets or image files — the reference HTML files are the visual spec only.

Reference files (do NOT import these — read them for visual intent only):
  C:\Users\markd\Downloads\lysosome-defender.html
  C:\Users\markd\Downloads\protein-kinase-defender.html
  C:\Users\markd\Downloads\repair-enzyme-defender.html
  C:\Users\markd\Downloads\viral-hijacker.html
  C:\Users\markd\Downloads\radiation-pulse.html
  C:\Users\markd\Downloads\toxin-droplet.html

---

Create src/games/cell-division-defense/systems/AnimationSystem.js:

class AnimationSystem {
  constructor(scene)

  playTowerAttack(towerId, fromX, fromY, targetX, targetY):
    Dispatches to the correct per-tower animation below.

  playEnemyDeath(enemyId, x, y):
    Dispatches to the correct per-enemy death animation below.

  playEnemyReachNucleus(enemyId, nucleusX, nucleusY):
    Dispatches to the correct reach-nucleus animation below.

  --- TOWER ATTACK ANIMATIONS ---

  _lysosomeAttack(fromX, fromY, targetX, targetY):
    Visual spec: lysosome-defender.html triggerAttack() function.
    1. Body squash/stretch: use a Phaser.Tween on the tower sprite's scaleX/scaleY.
       - Frame 0-6: scaleX 1→0.88, scaleY 1→1.12 (anticipation squish)
       - Frame 7-12: scaleX 0.88→1.15, scaleY 1.12→0.85 (lunge stretch)
       - Then tween back to 1.0/1.0 over 300ms
    2. Membrane spikes: using scene.add.graphics(), draw 8 small triangles radiating
       from the tower position at BLOB_R distance, scaled from 0→1 in 6 frames then
       fade back to 0 in 10 frames. Use a tween on graphics.alpha.
    3. Enzyme spray: spawn 5 small yellow Arc objects (r=7, color 0xFFEE00) at the
       tower position with velocity toward target + random spread ±15°. Move them
       manually in update() like projectiles. Fade alpha over their 55-frame lifetime.
       Add a 3-dot trail: spawn smaller Arc (r=3) at each position before moving.
    4. Burst particles: 8 tiny yellow circles (r=3) at spray origin, radial velocities,
       fade in 12 frames.
    5. Comic word: use scene.add.text() at tower position + (60, -30) with one of
       ['ZAP!','SPLAT!','ACID!'], style bold gold, scale from 1.4→1.0 over 200ms,
       alpha from 1→0 over 500ms. Destroy after tween completes.
    6. Glow intensify: tween the tower sprite's tint from 0xFF6B35 to 0xFF0000 and
       back over 300ms using scene.tweens.addCounter.

  _proteinKinaseAttack(fromX, fromY, targetX, targetY):
    Visual spec: protein-kinase-defender.html, 70-frame attack cycle.
    1. Windup (frames 0-10): tween tower scaleX 1→0.94, scaleY 1→1.08 over 165ms.
    2. Slam (frames 11-22): tween tower scaleX 0.94→1.12, scaleY 1.08→0.88 over 200ms
       using easeInQuad. Also tween x +8px.
    3. On impact (frame 22, i.e. after 365ms delay):
       a. Shockwave ring: draw a Graphics circle at (targetX, targetY) radius 8,
          tween radius 8→40 and alpha 1→0 over 300ms. Color 0xFFD700, lineWidth 2.5.
       b. ~P stamp text: scene.add.text() at target position '~P', gold bold, alpha 1→0
          over 800ms, scale 1.0 (stays put — stamp mark).
       c. 10 gold particles: Arc objects (r=4, 0xFFD700) burst from target in all
          directions at speed 2-5, fade over 35 frames.
       d. Orb fire: create 1 gold Arc (r=4) at the tower, tween it toward target over
          200ms, destroy on arrival.
       e. Electric arcs: draw 3 zigzag lines from tower center to target using Graphics.
          Each: 6 intermediate points with random ±8px perpendicular offset. Redraw
          each frame for 8 frames (flicker), then destroy. Color rgba(0,200,255,0.85).
       f. Eye flash: tween tower tint to 0xFFFFFF for 50ms then back.
    4. Recoil (frames 36-55): tween tower back to x-8, scaleX/Y back to 1.0 over 300ms.
    5. Comic word: ['TAGGED!','~P!','KINASE!','ACTIVATE!'], gold bold, scale 1.5→1.0
       over 200ms, alpha 1→0 over 800ms. Destroy after.

  _repairEnzymeAttack(fromX, fromY, targetX, targetY):
    Visual spec: repair-enzyme-defender.html, 65-frame cycle.
    Note: Repair Enzyme targets the nucleus, not an enemy. targetX/Y is nucleus center.
    1. Windup (0-10): Arms open — tween tower scaleX 0.92, scaleY 1.1 over 165ms.
    2. Clamp (11-20): Arms snap inward — tween scaleX 1.14, scaleY 0.87 over 165ms
       with easeInQuad. Body lurches +10px toward nucleus.
    3. On impact (frame 20, ~330ms delay):
       a. Green beam: draw a Graphics rectangle from tower edge to nucleus center,
          width 16px, color 0x00FF88, alpha 0.9. Add a sine-wave pulse by tweening
          height between 10-20px over 200ms yoyo. Fade beam alpha 0→1 over 5 frames
          then hold for 20 frames then fade 1→0 over 15 frames. Destroy after.
       b. Scrolling helix on beam: 5 small Arc objects (r=4) equally spaced along beam,
          alternate #FF9999/#9999FF color. Tween x +80px over 400ms (loop 2 times)
          while beam is active. Destroy with beam.
       c. 12 green particles burst from nucleus in forward arc (±35° from tower direction).
       d. 4 patch flakes: cross-shaped Graphics (two 12×4 rects) burst from nucleus,
          rotate and fall with gravity over 50 frames. Color 0xAAFFCC.
       e. Electric arcs between arm tips (arm tips approximated as ±20px from tower
          center perpendicular to attack direction): 3 zigzag arcs, 15 frames, green.
    4. Release (41-55): tween body back to neutral. Beam already fading.
    5. Settle (56-65): tween scaleX/Y back to 1.0.
    6. Comic word: ['PATCHED!','FIXED!','REPAIR!','HEALED!'], green bold, scale pop
       1.5→1.0, alpha 1→0 over 1000ms. Destroy after.

  --- ENEMY MOVEMENT EFFECTS (called from EnemySystem.update on each enemy frame) ---

  playViralHijackerWalk(enemy, x, y):
    Called every frame while enemy is alive.
    - Ghost trail: every 18 frames, draw a small purple hexagon outline (r=26) at the
      enemy's current position. Tween alpha 0.15→0 and scale 1→0.4 over 1000ms.
      Maximum 5 ghosts active at once; destroy oldest if exceeded.
    - Ground corruption marks: when the enemy moves (every 30 frames), draw a tiny
      green hexagon outline (r=8, color 0x39FF14) at GROUND_Y below enemy, fade
      alpha 0.18→0 over 500ms.

  playRadiationPulseFloat(enemy, x, y):
    Called every frame while enemy is alive.
    - Pulse ring: every 22 frames, draw an expanding dashed circle at the enemy's
      current position. Tween radius 42→90, lineWidth 2→0.5, alpha 0.5→0 over 750ms.
      Color 0xFFB300. Use setLineDash([4,6]) equivalent via multiple arc segments.
      Maximum 6 rings active.

  playToxinDropletBounce(enemy, squashAmount):
    Called from EnemySystem when squashAmount > 12 (landing impact).
    - Splash ring: ellipse at GROUND_Y, tween x-radius 8→40, alpha 0.5→0 over 300ms.
      Color 0x7FFF00.
    - 6 droplets: small green Arc (r=3) objects burst from the ground point with random
      vx (-3 to 3) and vy (-2.5 to -4.5). Fall with gravity 0.25. Fade over 35 frames.

  --- ENEMY DEATH ANIMATIONS ---

  playViralHijackerDeath(x, y):
    Visual spec: viral body exploding — purple hex shatters.
    1. 6 purple triangle shards: Graphics objects shaped as thin triangles, radiate
       outward from center at hexagon vertex angles. Tween outward 40px over 400ms
       while rotating. Fade alpha 1→0. Destroy after.
    2. Toxic green burst: 8 neon green particles (0x39FF14, r=5) explode outward,
       fade over 300ms.
    3. Green corruption splash on ground: hex outline expands at GROUND_Y, alpha 0.4→0.

  playRadiationPulseDeath(x, y):
    Visual spec: radiation-pulse.html — AOE burst on death (this is the enemy's
    onReachNucleus ability: AOE damage). Same animation used for both death and
    reach-nucleus event.
    1. All 8 fins flare: spawn 8 elongated Graphics triangles at fin positions (evenly
       around the death point), tween length 28→80 and alpha 0.7→0 over 500ms.
       Color 0xFF6600 with amber glow.
    2. AOE shockwave: large circle (r=80, which is the splash radius), lineWidth 3,
       color 0xFFB300, alpha 0.8→0 over 600ms. Also a solid fill circle alpha 0.15→0.
    3. 5 crack flares: 5 lines from center outward at random angles, each 40-60px long,
       color 0xFFFDE0, flash bright then fade over 300ms.
    4. Eye flash: white circle at the enemy position, scale 1→3, alpha 0.9→0 over 200ms.
    NOTE: When this is triggered by onReachNucleus (not death), also emit EventBus
    'aoeBlast' { x, y, radius: 80 } so EnemySystem can apply area damage to all
    towers within range (call towerSystem.silenceInRadius if needed).

  playToxinDropletDeath(x, y):
    Visual spec: toxin-droplet.html landing impact at maximum — splat.
    1. Body splat: flatten the enemy sprite with a quick tween scaleX 2.5, scaleY 0.2
       over 80ms, then fade alpha 1→0 over 300ms.
    2. Splash ring: large ellipse (x-radius 60, y-radius 8) at y position, alpha 0.5→0.
    3. 10 green droplets burst radially, arc under gravity, fade over 500ms.
    4. Slime pool: flat ellipse Graphics drawn at y position, color 0x3A8C00,
       alpha 0.35→0 over 2000ms.
    NOTE: Toxin Droplet onReachNucleus silences towers. Emit EventBus 'towerSilence'
    { duration: 10000 } when this enemy reaches nucleus so TowerSystem can pause all
    tower fireRate timers for 10 seconds.

  --- REACH-NUCLEUS SPECIAL ANIMATIONS ---

  playViralHijackerInject(nucleusX, nucleusY):
    Visual spec: DNA injection port on the viral hijacker body (green circle at bottom).
    1. Green injection beam: short line (20px) from nucleus surface inward, color 0x39FF14,
       lineWidth 3, flash alpha 1→0 over 400ms with 3 rapid pulses (tween yoyo x3).
    2. DNA strand: 6 small dots alternating #FF9999/#9999FF traveling inward 20px along
       the injection line, staggered 50ms apart. Fade on arrival.
    3. Mutation flash on nucleus: tween nucleus tint 0x5B8FD4→0x39FF14→0x5B8FD4 over 600ms.

  --- WIRE INTO EXISTING SYSTEMS ---

Modify src/games/cell-division-defense/systems/TowerSystem.js:
- Import AnimationSystem (pass it in constructor from CellDefenseScene)
- In the fire(tower, target) method: after calling onSpawnProjectile,
  call animationSystem.playTowerAttack(tower.def.id, fromPos.x, fromPos.y, target.x, target.y)

Modify src/games/cell-division-defense/systems/EnemySystem.js:
- Import AnimationSystem
- In damageEnemy when hp <= 0: call animationSystem.playEnemyDeath(enemy.def.id, x, y)
- In the enemyReachedNucleus handler: call animationSystem.playEnemyReachNucleus(enemy.def.id, nucleusX, nucleusY)
- In update(), for Viral Hijacker enemies: call animationSystem.playViralHijackerWalk(enemy, x, y)
- In update(), for Radiation Pulse enemies: call animationSystem.playRadiationPulseFloat(enemy, x, y)
- In update(), for Toxin Droplet enemies: when squashAmount exceeds 12 (derive from
  sin of pathFollower.t * some frequency), call animationSystem.playToxinDropletBounce(enemy, squashAmount)

Modify CellDefenseScene.js:
- Instantiate AnimationSystem in create(), pass it to TowerSystem and EnemySystem.
- Listen for EventBus 'aoeBlast': apply AOE tower damage in radius.
- Listen for EventBus 'towerSilence': pause all tower cooldown timers for duration ms.

Use plain JSX/JS (no TypeScript). All Graphics objects must be destroyed after their
animation completes — use tween onComplete callbacks. No console.log in committed code.
```

---

## STEP 8 — Phase system + mutation system

```
I'm building a Phaser 3 tower defense game (Cell Division: Divide & Defend) in SciQuest.
Files at src/games/cell-division-defense/.

Create src/games/cell-division-defense/systems/PhaseSystem.js:

PHASE_ORDER = ['interphase','prophase','metaphase','anaphase','telophase','cytokinesis']

class PhaseSystem {
  constructor(scene, levelData, mutationSystem)

  Properties: currentPhaseIndex=0, interphaseTimer=null, waitingForMinigame=false

  start():
    Begin interphase: set a 30-second timer. When it expires, advance to prophase.
    Emit EventBus 'stateChanged' with current phase.
    During interphase, no enemies spawn.

  advancePhase():
    currentPhaseIndex++
    if currentPhaseIndex >= PHASE_ORDER.length: call this.endRun()
    const newPhase = PHASE_ORDER[currentPhaseIndex]
    Emit EventBus 'phaseTransition' { fromPhase, toPhase: newPhase }
    Start the wave for newPhase (call scene.enemySystem.spawnWave with level wave data)
    After wave clears (listen for 'waveCleared'): trigger minigame

  triggerMinigame(phase):
    waitingForMinigame = true
    Emit EventBus 'phaseTransition' { fromPhase: phase, toPhase: phase } to open overlay
    Listen once for 'minigameResult' { stars, phase }:
      waitingForMinigame = false
      if stars === 0: mutationSystem.addMutation(PHASES[phase].mutationOnFail)
      else if stars >= 2: add ATP bonus (stars===3 ? 100 : 50)
      this.advancePhase()

  endRun():
    const stars = mutationSystem.getStarRating()
    const xp = [0,40,80,120][stars]
    Emit EventBus 'runComplete' { stars, mutations: mutationSystem.mutations,
      hpLeft: scene.hp, xpEarned: xp }

  onWaveCleared(): call triggerMinigame(PHASE_ORDER[currentPhaseIndex])
}

---

Create src/games/cell-division-defense/systems/MutationSystem.js:

const MUTATION_CAP = 4

class MutationSystem {
  constructor(scene)
  mutations = []  (array of mutation ids)

  addMutation(mutationId):
    mutations.push(mutationId)
    const def = MUTATIONS[mutationId]
    Apply effect:
      'hp:-5' → scene.hp = Math.max(0, scene.hp - 5)
      'towerOutput:0.5' → pick random active tower, call towerSystem.silenceTower with long dur
      'towerDisable:1wave' → disable one random tower for next wave
      'maxHp:-10%' → lower scene.maxHp by 10%
      'enemyDoubleDamage:1' → set scene.doubleHitActive = true (consumed next time enemy hits)
    Emit 'mutationAdded' { mutation: def }
    if mutations.length >= MUTATION_CAP: emit 'gameOver' { reason:'tooManyMutations',
      mutationCount: MUTATION_CAP }

  getStarRating():
    if mutations.length === 0: return 3
    if mutations.length <= 2: return 2
    if mutations.length === 3: return 1
    return 0

  getAll(): return mutations.map(id => MUTATIONS[id])
  getMostRecent(): return MUTATIONS[mutations[mutations.length-1]]
  removeMostRecent(): mutations.pop() (used by Repair Enzyme upgrade cure)
}

---

Wire both systems into CellDefenseScene:
Instantiate MutationSystem and PhaseSystem in create() after other systems.
PhaseSystem.start() at end of create().
Listen 'waveCleared' → phaseSystem.onWaveCleared().
Listen 'enemyReachedNucleus' → mutationSystem.addMutation(...).
Listen 'gameOver' → stop all systems, emit 'stateChanged'.
```

---

## STEP 9 — Minigame overlay wrapper + Prophase minigame

```
I'm building a Phaser 3 tower defense game (Cell Division: Divide & Defend) in SciQuest.
Files at src/games/cell-division-defense/.
React ↔ Phaser communication is ONLY via EventBus at src/games/_shared/eventBus.js.

The MinigameOverlay is a React component that renders full-screen above the Phaser canvas
when a phase transition fires. The Phaser scene is paused while it's open.

Create src/games/cell-division-defense/ui/MinigameOverlay.jsx:

Props: { phase, onComplete }
  - phase: the current phase string ('prophase','metaphase', etc.)
  - onComplete: fn({ stars }) — called when minigame finishes

Renders:
  - Full-screen dark backdrop: position absolute, inset 0, background rgba(0,0,0,0.85),
    backdrop-filter blur(4px), z-index 20
  - A centered panel: max-width 560px, background #0D1B2A, border 1px solid rgba(59,175,169,0.3),
    border-radius 16px, padding 32px
  - Phase name header at top, countdown timer top-right (counts from 30 → 0)
  - Dynamic content area: renders the correct minigame component based on phase prop
  - Star display: 3 stars shown, filled as player progresses

Minigame routing (render the right component inside the panel):
  prophase → <ChromatinCondense onComplete={onComplete} />
  metaphase → <ChromosomeAlign onComplete={onComplete} />
  anaphase → <ChromatidPull onComplete={onComplete} />
  telophase → <NuclearEnvelope onComplete={onComplete} />
  cytokinesis → <CleavageFurrow onComplete={onComplete} />

Timer logic in MinigameOverlay: count down from 30. If timer hits 0, call onComplete({stars:0}).

---

Create src/games/cell-division-defense/ui/minigames/ChromatinCondense.jsx:

Props: { onComplete }

The Prophase minigame: condense chromatin strands into chromosomes.
Shows 4 chromatin strand targets (small animated squiggly lines using CSS animation).
One strand at a time glows/pulses — the "active" one to tap.
Player clicks/taps the active strand within a 1.5s window.

State: completedCount=0, missCount=0, activeIndex=0

Logic:
  - Highlight strands[activeIndex] with a green pulse
  - On click of highlighted strand: completedCount++, advance activeIndex, spawn a small
    "chromosome" icon where the strand was (condensed X shape using CSS or div)
  - On miss (1.5s expires without click): missCount++, still advance activeIndex
  - When all 4 complete: call onComplete({ stars: missCount===0?3 : missCount===1?2:1 })

Visual layout: 4 wavy line elements arranged in a 2×2 grid inside the panel.
Each strand: SVG path or div with a CSS animation (wavy/squiggle effect).
Active strand: glowing teal border, scale 1.1.
Completed strand: replaced by a small purple X shape.

Use only React state + CSS. No canvas. Tailwind for layout.
```

---

## STEP 10 — Metaphase + Anaphase minigames

```
I'm building a Phaser 3 tower defense game (Cell Division: Divide & Defend) in SciQuest.
Minigames are React components at src/games/cell-division-defense/ui/minigames/.
They accept { onComplete } and call onComplete({ stars }) when done.
Use React state + CSS only (no canvas). Tailwind for layout.

--- ChromosomeAlign.jsx (Metaphase) ---
Player drags 4 chromosome pairs onto a glowing horizontal "metaphase plate" line.

State: placed = {} (map of chromosomeId → boolean placed correctly)

Render:
  - A horizontal glowing line (the metaphase plate): white dashed line, centered vertically
    in panel, full width, box-shadow glow
  - 4 chromosome items (draggable divs) initially scattered above and below the plate.
    Each is a small purple X shape (two rotated rounded rectangles, CSS only).
    Color-code pairs: pair A=#9B59B6, pair B=#6C3483, pair C=#7D3C98, pair D=#5B2C6F
  - 4 snap zones on the plate (evenly spaced horizontal positions), shown as dim circles

Drag logic (use HTML5 drag and drop or React pointer events):
  - onPointerDown: store offset, begin drag (position: fixed following pointer)
  - onPointerUp: check if released within 40px of a snap zone → snap and mark placed
  - If wrong snap zone: return to original position
  - Chromosome placed correctly: show green ✓ above it

Scoring: all 4 placed = 3 stars. 3 placed = 2 stars. ≤2 placed = 1 star.
Auto-submit when all 4 placed OR timer (in MinigameOverlay) expires.

--- ChromatidPull.jsx (Anaphase) ---
4 chromosome pairs sit on the metaphase plate. Each pair shows a highlighted link.
Player clicks the link to sever it, then swipes/drags outward to pull the chromatids apart.

State: pairs = [
  { id:'A', severed:false, pulled:false, error:false },
  ... × 4
]

Render:
  - 4 chromosome pairs laid out horizontally in the center
  - Each pair: two X shapes side by side with a visible connecting link div between them
  - Link div: green flash animation when it's "ready" to sever (cycles through pairs in order)
  - Only one pair is active at a time (activeIndex state)

Logic:
  - Active pair's link has a pulsing green glow — player must click it
  - On link click: severed=true for that pair, show outward drag arrows
  - Player drags the chromatids outward (left X goes left, right X goes right)
  - If drag exceeds 60px before a 1s window closes: pulled=true, success
  - If drag too early (< 0.3s after severing): error=true → mutation risk flag
  - Advance to next pair

Scoring: errors===0 → 3 stars. errors===1 → 2 stars. errors>=2 → 1 star.
Auto-submit when all 4 pairs pulled OR timer expires.
```

---

## STEP 11 — Telophase + Cytokinesis minigames

```
I'm building a Phaser 3 tower defense game (Cell Division: Divide & Defend) in SciQuest.
Minigames at src/games/cell-division-defense/ui/minigames/.
Props: { onComplete }, call onComplete({ stars }) when done. React + CSS only.

--- NuclearEnvelope.jsx (Telophase) ---
Two chromosome clusters sit at opposite ends of the panel. Player draws a closed oval
around each one by clicking and dragging.

Use an SVG element filling the panel for drawing.
State: drawings = [null, null] (one per nucleus), currentDraw = 0, points = []

Logic:
  - onPointerDown: start recording pointer positions into points[]
  - onPointerMove: append current position
  - onPointerUp: check if shape is closed (last point within 30px of first point)
    and if it encloses the chromosome cluster (bounding box check)
    If valid: drawings[currentDraw] = points, advance currentDraw
    If invalid: clear points, show "Not closed!" hint

Render:
  - Two chromosome clusters: small groups of 2–3 purple X shapes at left-center and
    right-center of the panel
  - Player's drawn path as an SVG polyline in teal
  - When a drawing is valid: fill the enclosed area with rgba(168,200,240,0.15) and show ✓
  - Dashed target oval hint circles around each cluster (very faint, shows where to draw)

Scoring: both envelopes drawn = 3 stars. One drawn = 2 stars. None = 1 star.

--- CleavageFurrow.jsx (Cytokinesis) ---
A cell outline (circle) splits horizontally. A contractile ring shown as 6 arc sections
around the equator. Player must hold each section to "pinch" it closed.

State: sections = [0,0,0,0,0,0] (fill progress 0→1 per section), activeSection = 0

Render:
  - Cell outline: large circle SVG, teal stroke
  - 6 arc sections around the equator (each covers 60° of the circle's midline)
    Each section is an arc div or SVG arc. Fill color = teal, unfilled = dim
  - Active section pulses and shows a "hold here" indicator
  - Progress bar per section: fills while pointer is held down on it

Logic:
  - onPointerDown on a section: start filling (increment sections[i] by ~0.04 per frame
    using requestAnimationFrame or setInterval)
  - onPointerUp or pointer leaves: stop filling
  - When section reaches 1.0: mark complete, auto-advance to next section
  - Enemies attack during this (visual only — show warning flashes if mutations.length > 2)

Scoring: all 6 complete = 3 stars. 4–5 complete = 2 stars. 1–3 = 1 star. 0 = 0 stars.
If timer expires mid-progress: submit current score.
```

----------------------------------------------------------------------------------------------- dito na

## STEP 12 — Wave queue + mutation log + results screen

```
I'm building a Phaser 3 tower defense game (Cell Division: Divide & Defend) in SciQuest.
Files at src/games/cell-division-defense/ui/.
EventBus is at src/games/_shared/eventBus.js.

Create these 3 React components:

--- WaveQueue.jsx ---
Props: { nextWaveEnemies, waveCountdown, currentWave, totalWaves }
  nextWaveEnemies: array of { type, count } objects

Renders a small panel (position absolute, top 64px, right 8px, width 130px):
  Background: rgba(0,0,0,0.65), border 1px solid rgba(59,175,169,0.2), border-radius 10px,
  padding 10px, font-family Courier New

  Header: "NEXT WAVE" teal 10px
  Countdown bar: thin orange progress bar, fills over waveCountdown seconds
  Enemy list: for each enemy type in nextWaveEnemies:
    Small colored circle icon (viralHijacker=#8B00FF, radiationPulse=#FFB300,
    toxinDroplet=#7FFF00) + "×{count}" label
  Wave indicator: "Wave {currentWave}/{totalWaves}" small dim text at bottom

--- MutationLog.jsx ---
Props: { mutations } — array of mutation objects { name, effect }

Renders below WaveQueue (position absolute, adjusts top based on WaveQueue height):
  If mutations is empty: nothing renders
  Header: "⚠ MUTATIONS" in red, 10px
  Up to 4 mutation chips stacked: each a rounded pill,
    background rgba(127,0,0,0.7), border 1px solid #EF4444,
    text: mutation.name, 9px Courier New, white
    Pulse animation: box-shadow alternates between 0 and 0 0 8px #EF4444 on a 1.2s cycle

--- ResultsScreen.jsx ---
Props: { stars, mutations, hpLeft, xpEarned, levelTitle, onReplay, onExit }

Renders a full-screen overlay (position absolute, inset 0, z-index 30,
background rgba(0,13,26,0.96)).

Center panel (max-width 480px, centered):
  - Title: "DIVISION COMPLETE!" (or "CELL FAILED" if stars===0) in bold Courier New
  - Star display: 3 large stars — filled yellow (#FFD700) or empty dim grey.
    Stars animate in one by one with a scale pop.
  - HP remaining: "Daughter Cell Health: {hpLeft}%"
  - Mutations list: each mutation name in small red text
  - "+{xpEarned} XP" badge in teal with glow
  - Two buttons: [REPLAY] and [EXIT TO HUB], styled with orange/teal borders

--- MutationAlert.jsx ---
Props: { mutation } — shown briefly when a mutation is gained

Renders a toast notification (position absolute, top 64px, left 50%, transform -50%,
z-index 25). Auto-dismisses after 3 seconds.
  Background: rgba(127,0,0,0.9), border red, border-radius 8px, padding 12px 20px
  Content: "⚠ {mutation.name}" bold, then mutation.biologyNote in small italic below

--- Wire into index.jsx ---
Add state for: nextWaveEnemies, waveCountdown, currentMutationAlert=null, showResults=false,
  resultsData=null

Listen to EventBus:
  'waveStarted' → update nextWaveEnemies, start countdown timer
  'mutationAdded' → set currentMutationAlert, auto-clear after 3s
  'runComplete' → set showResults=true, resultsData=payload

Render WaveQueue and MutationLog (positioned absolute over canvas).
Render MutationAlert conditionally.
Render ResultsScreen conditionally when showResults=true.
```

---

## STEP 13 — Audio

```
I'm building a Phaser 3 tower defense game (Cell Division: Divide & Defend) in SciQuest.
The existing Matter State Sandbox game uses Web Audio API for music at
src/games/matter-state-sandbox/audio/GameMusic.js — follow that exact pattern.

Create src/games/cell-division-defense/audio/CellMusic.js using the same class structure.

The music should be:
  - A low ambient generative drone — not a file, procedurally generated using Web Audio API
  - Base oscillator: sine wave, frequency 55Hz (A1), gain 0.08
  - Second oscillator: sine wave, frequency 82.5Hz (E2, a fifth above), gain 0.05
  - Slow LFO on the first oscillator's frequency: rate 0.08Hz, depth ±4Hz
  - A third oscillator at 110Hz (A2) that pulses every 3 seconds (short attack 0.1s,
    decay 1.5s, gain peak 0.12) — gives a heartbeat feel

Minigame variant (CellMusic.setMinigameMode(true)):
  Boost the third oscillator pulse rate to every 1 second, raise base gain slightly.

Provide: start(), stop(), setMinigameMode(bool), setVolume(0-1)

In index.jsx:
  - Instantiate CellMusic in useEffect, call start()
  - Clean up with stop() on unmount
  - Listen to EventBus 'phaseTransition' → setMinigameMode(true)
  - Listen to EventBus 'resume' → setMinigameMode(false)
```

---

## STEP 14 — Slot click flow + tower panel placement UX

```
I'm building a Phaser 3 tower defense game (Cell Division: Divide & Defend) in SciQuest.
I need the full placement interaction to work end-to-end.

Current state:
- TowerPanel has onSelect(towerId) that emits 'towerSelected' via EventBus
- CellDefenseScene has 12 slot positions on the membrane
- Phaser emits 'towerSlotClicked' when a slot is clicked

Wire the full placement flow:

1. In CellDefenseScene create():
   - Make slot zones interactive using Graphics objects (invisible circles at each slot, setInteractive)
   - Store selectedTower=null on the scene
   - Listen to EventBus 'towerSelected' → this.selectedTower = towerId
     Show a selection indicator: highlight all EMPTY slots with a pulsing teal circle
   - On slot zone pointerdown (isEmpty && selectedTower set):
     emit 'placeTower' { towerId: this.selectedTower, slotIndex }
     clear this.selectedTower
     hide slot highlights
   - On slot zone pointerdown (occupied):
     emit 'towerSlotClicked' { slotIndex, isEmpty: false }
     show an action popup (sell / upgrade options)
   - On canvas pointerdown (not on a slot): clear selectedTower, hide highlights

2. In React (index.jsx / TowerPanel):
   - Listen to EventBus 'towerSlotClicked' with isEmpty=false
   - Show an inline action menu near the canvas (position absolute near click coords):
     [SELL — refund X ATP] [UPGRADE — cost Y ATP] [CANCEL]
   - These buttons emit 'sellTower' or 'upgradeTower' to Phaser

3. In CellDefenseScene handle 'placeTower':
   - Deduct ATP
   - Call towerSystem.placeTower(slotIndex, towerId)
   - Emit 'stateChanged'

4. Visual feedback during selection mode:
   - Cursor changes to crosshair on the canvas
   - All empty slots show a ghost preview of the selected tower's icon (faded, 40% alpha)
   - Slots where player can't afford show a red tint

Keep the flow minimal — no drag and drop, just click-to-select then click-to-place.
```

---

## STEP 15 — Polish, integration + SciQuest wiring

```
I'm building a Phaser 3 tower defense game (Cell Division: Divide & Defend) in SciQuest.
This is the final integration step. The game is functionally complete. Wire it into
the SciQuest platform and apply final polish.

1. PROGRESS INTEGRATION
   In index.jsx, when EventBus emits 'runComplete' { stars, xpEarned, levelId }:
   Call props.onProgressUpdate({
     gameId: 'cell-division-defense',
     levelId,
     stars,
     xpEarned,
     completedAt: new Date().toISOString(),
   })
   All Supabase writes go through src/lib/games/progress.js — do not write directly.
   Check if writeGameProgress exists in progress.js — if not, add it following the
   existing pattern in that file.

2. REDUCED MOTION
   Listen to EventBus 'config' event in CellDefenseScene.
   If reducedMotion=true:
     - Remove all tweens (membrane pulse, tower idle bounce, nucleus pulse)
     - Skip particle effects on projectile hit
     - Enemy path followers still move but at lower frame budget (no interpolation tweens)

3. DEVICE TIER
   If deviceTier==='low':
     - Reduce hex grid size to 54px (fewer cells drawn)
     - Skip canvas shadow effects (remove all shadowBlur/shadowColor calls)
     - Cap active projectiles to 6

4. MOBILE LAYOUT (≤768px)
   In index.jsx CSS:
     - TowerPanel moves from left column to a horizontal strip at the bottom (height 80px)
     - Tower cards become horizontal chips (icon + name + cost in a row)
     - WaveQueue badge simplifies to "Wave X/5" text in top bar
     - MutationLog becomes a ⚠ count badge, tap to open a bottom sheet
   Use a CSS media query or window.innerWidth check.

5. GAMES HUB CARD
   The registry entry added in Step 1 shows the game as "locked: false" with no thumbnail.
   The GamesHubPage already renders all games from GAMES in registry.js.
   Verify the card shows correctly by checking src/pages/GamesHubPage.jsx for how it
   renders each game — match the same card format.
   Set thumbnail to null for now (a placeholder grey card is fine).

6. FINAL CHECKS
   - Run npm run lint and fix any errors (no console.log in committed code)
   - Verify Phaser.Game is only created once (useRef guard in place)
   - Verify EventBus listeners are removed in the Phaser scene destroy() lifecycle
     (call EventBus.off for each listener registered in create())
   - Verify onExit calls game.destroy(true) and cleans up EventBus listeners

Run npm run dev to confirm the game loads and is playable end to end.
```

---

## Reference: File Checklist

Track completion by checking off each file as you build it.

```
src/games/cell-division-defense/
  [ ] index.jsx
  [ ] manifest.js
  [ ] scenes/BootScene.js
  [ ] scenes/CellDefenseScene.js
  [ ] ui/CellDefenseHUD.jsx
  [ ] ui/TowerPanel.jsx
  [ ] ui/WaveQueue.jsx
  [ ] ui/MutationLog.jsx
  [ ] ui/MutationAlert.jsx
  [ ] ui/MinigameOverlay.jsx
  [ ] ui/ResultsScreen.jsx
  [ ] ui/minigames/ChromatinCondense.jsx
  [ ] ui/minigames/ChromosomeAlign.jsx
  [ ] ui/minigames/ChromatidPull.jsx
  [ ] ui/minigames/NuclearEnvelope.jsx
  [ ] ui/minigames/CleavageFurrow.jsx
  [ ] data/towers.js
  [ ] data/enemies.js
  [ ] data/mutations.js
  [ ] data/phases.js
  [ ] data/levels.js
  [ ] systems/TowerSystem.js
  [ ] systems/EnemySystem.js
  [ ] systems/ProjectileSystem.js
  [ ] systems/PhaseSystem.js
  [ ] systems/MutationSystem.js
  [ ] audio/CellMusic.js

src/lib/games/
  [ ] registry.js (add entry)
  [ ] progress.js (add writeGameProgress if missing)
```

---

## Build Order Summary

| Step | What you build                        | Playable after?  |
| ---- | ------------------------------------- | ---------------- |
| 1    | Data files + registry                 | No               |
| 2    | GameComponent + Phaser shell          | Canvas appears   |
| 3    | BootScene + CellDefenseScene skeleton | Cell visible     |
| 4    | React HUD (top bar + tower panel)     | HUD visible      |
| 5    | Tower placement system                | Place towers     |
| 6    | Enemy system + wave spawning          | Enemies walk     |
| 7    | Projectile system + ATP pickups       | Combat works     |
| 8    | Phase + mutation systems              | Full game loop   |
| 9    | Minigame overlay + Prophase           | First minigame   |
| 10   | Metaphase + Anaphase minigames        | 3 minigames      |
| 11   | Telophase + Cytokinesis minigames     | All minigames    |
| 12   | Wave queue + mutation log + results   | Full UI          |
| 13   | Audio                                 | Sound            |
| 14   | Slot click UX polish                  | Smooth placement |
| 15   | Integration + SciQuest wiring         | Shippable        |
