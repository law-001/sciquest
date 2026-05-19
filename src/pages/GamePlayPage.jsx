/* eslint-disable react-hooks/static-components */
import React, { Suspense, useEffect, useState } from 'react';
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
  // visualViewport.height is the true on-screen area; window.innerHeight on iOS
  // Safari landscape excludes the URL bar and overstates the usable height.
  const getViewportHeight = () => window.visualViewport?.height ?? window.innerHeight;
  const [vh, setVh] = useState(getViewportHeight);

  useEffect(() => {
    const update = () => setVh(getViewportHeight());
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
    };
  }, []);

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
    <div style={{ position: 'fixed', left: 0, top: 0, width: '100%', height: vh, overflow: 'hidden' }}>
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
