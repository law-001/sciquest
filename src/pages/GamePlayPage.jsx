/* eslint-disable react-hooks/static-components */
import React, { Suspense } from 'react';
import { getGame, getGameComponent } from '../lib/games/registry';
import { GameAuthGate } from '../components/games/GameAuthGate';
import { GameLoadingScreen } from '../components/games/GameLoadingScreen';
import { useReducedMotion } from '../games/_shared/hooks/useReducedMotion';

function detectDeviceTier() {
  const cores = navigator.hardwareConcurrency ?? 4;
  if (cores >= 8) return 'high';
  if (cores >= 4) return 'mid';
  return 'low';
}

export function GamePlayPage({ activeGameId, user, profile, onNavigate }) {
  const reducedMotion = useReducedMotion();
  const game = getGame(activeGameId);
  const GameComponent = getGameComponent(activeGameId);
  const deviceTier = detectDeviceTier();

  if (!game || !game.loader) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-stone-600 dark:text-stone-300 text-lg font-medium">
          {game ? 'This game isn\'t available yet.' : 'Game not found.'}
        </p>
        <button
          onClick={() => onNavigate('games')}
          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
        >
          Back to Games
        </button>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      <GameAuthGate user={user} onNavigateLogin={() => onNavigate('home')}>
        <Suspense fallback={<GameLoadingScreen progress={0} message="Loading game…" />}>
          <GameComponent
            user={user}
            profile={profile}
            onExit={() => onNavigate('games')}
            onProgressUpdate={() => {}}
            initialChallengeId={null}
            reducedMotion={reducedMotion}
            deviceTier={deviceTier}
          />
        </Suspense>
      </GameAuthGate>
    </div>
  );
}
