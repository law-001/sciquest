import { MUTATIONS } from '../data/mutations';

const MUTATION_CAP = 4;

class MutationSystem {
  constructor(scene) {
    this.scene = scene;
    this.mutations = [];
  }

  addMutation(mutationId) {
    if (!mutationId || !MUTATIONS[mutationId]) return;

    this.mutations.push(mutationId);
    const def = MUTATIONS[mutationId];

    this._applyEffect(def.effect);

    // Sync to scene so _emitState sees the current list
    this.scene.mutations = [...this.mutations];

    this.scene.bus?.emit('mutationAdded', { mutation: def });
    this.scene.bus?.emit('stateChanged', {
      hp:        this.scene.hp,
      atp:       this.scene.atp,
      mutations: this.scene.mutations,
      phase:     this.scene.phase,
      wave:      this.scene.wave,
    });

    if (this.mutations.length >= MUTATION_CAP) {
      this.scene.bus?.emit('gameOver', {
        reason: 'tooManyMutations',
        mutationCount: MUTATION_CAP,
      });
    }
  }

  _applyEffect(effect) {
    if (!effect) return;

    if (effect === 'hp:-5') {
      this.scene.hp = Math.max(0, this.scene.hp - 5);

    } else if (effect === 'towerOutput:0.5') {
      const idx = this._randomActiveTowerIdx();
      if (idx >= 0) this.scene.towerSystem?.silenceTower(idx, 15000);

    } else if (effect === 'towerDisable:1wave') {
      const idx = this._randomActiveTowerIdx();
      if (idx >= 0) {
        this.scene.towerSystem?.disableTower(idx);
        // Re-enable the tower once the next wave clears
        const resume = () => {
          this.scene.towerSystem?.enableTower(idx);
          this.scene.bus?.off('waveCleared', resume);
        };
        this.scene.bus?.on('waveCleared', resume);
      }

    } else if (effect === 'splitImbalance') {
      this.scene.splitImbalanceActive = true;

    } else if (effect === 'maxHp:-10%') {
      this.scene.maxHp = Math.max(10, Math.floor((this.scene.maxHp ?? 100) * 0.9));
      this.scene.hp = Math.min(this.scene.hp, this.scene.maxHp);

    } else if (effect === 'enemyDoubleDamage:1') {
      this.scene.doubleHitActive = true;
    }
  }

  _randomActiveTowerIdx() {
    const active = (this.scene.towerSlots ?? [])
      .map((s, i) => (s.tower ? i : -1))
      .filter(i => i >= 0);
    if (!active.length) return -1;
    return active[Math.floor(Math.random() * active.length)];
  }

  getStarRating() {
    if (this.mutations.length === 0) return 3;
    if (this.mutations.length <= 2) return 2;
    if (this.mutations.length === 3) return 1;
    return 0;
  }

  getAll() {
    return this.mutations.map(id => MUTATIONS[id]);
  }

  getMostRecent() {
    return MUTATIONS[this.mutations[this.mutations.length - 1]];
  }

  removeMostRecent() {
    this.mutations.pop();
    this.scene.mutations = [...this.mutations];
  }
}

export default MutationSystem;
