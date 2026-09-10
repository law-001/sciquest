import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { ACHIEVEMENTS, deriveUnlockedKeys, totalAchievementXp } from '../src/lib/achievements.js';
import { GAME_MEDALS, currentAchievementKey, visibleAchievementCatalog } from '../src/lib/game-achievements.js';

test('every level upgrades one medal, including after replay and reload', () => {
  for (const game of GAME_MEDALS) {
    const completedGames = [];
    for (let i = 0; i < game.levels.length; i++) {
      completedGames.push(...game.levels[i].map((challengeId) => ({ gameId: game.gameId, challengeId })));
      const keys = deriveUnlockedKeys({ completedGames });
      assert.deepEqual(keys, game.keys.slice(0, i + 1));
      const visible = visibleAchievementCatalog(ACHIEVEMENTS, keys).filter((a) => a.gameId === game.gameId);
      assert.equal(visible.length, 1);
      assert.equal(visible[0].key, game.keys[i]);
      assert.deepEqual(deriveUnlockedKeys({ completedGames: [...completedGames, ...completedGames] }), keys);
      assert.equal(totalAchievementXp([...keys, ...keys]), totalAchievementXp(keys));
      assert.equal(currentAchievementKey(game.keys[0], keys), game.keys[i]);
    }
  }
});

test('partial and out-of-order challenges do not prematurely evolve a medal', () => {
  const gameId = 'matter-state-sandbox';
  assert.deepEqual(deriveUnlockedKeys({ completedGames: [{ gameId, challengeId: 'ch_01' }] }), []);
  assert.deepEqual(deriveUnlockedKeys({ completedGames: [{ gameId, challengeId: 'ch_08' }] }), []);
  assert.deepEqual(deriveUnlockedKeys({ completedGames: [{ gameId: 'quake-ready', challengeId: 'l3' }] }), []);
  assert.deepEqual(deriveUnlockedKeys({ completedGames: [{ gameId: 'unknown', challengeId: 'l1' }] }), []);
});

test('legacy medals retain their identity and bonus XP', () => {
  const keys = ['matter-state-sandbox-complete', 'cell-division-lab-complete', 'mystery-lab-complete'];
  assert.equal(totalAchievementXp(keys), 185);
  for (const key of keys) assert.ok(visibleAchievementCatalog(ACHIEVEMENTS, keys).some((a) => a.key === key));
});

test('every catalog entry has its own local artwork and every game has one locked preview', () => {
  assert.equal(new Set(ACHIEVEMENTS.map((a) => a.key)).size, ACHIEVEMENTS.length);
  for (const a of ACHIEVEMENTS) assert.ok(existsSync(new URL(`../public/achievements/${a.key}.svg`, import.meta.url)), a.key);
  assert.equal(visibleAchievementCatalog(ACHIEVEMENTS, []).filter((a) => a.gameId).length, GAME_MEDALS.length);
});
