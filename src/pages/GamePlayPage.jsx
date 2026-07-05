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

export function GamePlayPage({ activeGameId, user, profile, onNavigate, onProgressUpdate }) {
  const reducedMotion = useReducedMotion();
  // window.innerHeight can include pixels hidden behind the always-on-top OS
  // taskbar: a window sized or dragged past the work area keeps its full
  // content height — the taskbar just covers the bottom strip. Comparing
  // heights (screen.availHeight) can't catch that, because the window's
  // POSITION matters; instead measure how far the window's bottom edge
  // overhangs the work-area bottom and cut exactly that. visualViewport only
  // ever shrinks the base (iOS URL bar / pinch-zoom); real fullscreen hides
  // the taskbar, so nothing is cut there.
  const getViewportHeight = () => {
    const inner = window.innerHeight;
    const base = Math.min(inner, window.visualViewport?.height ?? inner);
    if (document.fullscreenElement) return base;
    const scr = window.screen;
    const workBottom = (scr?.availTop ?? 0) + (scr?.availHeight ?? Infinity);
    const overhang = Math.max(0, window.screenY + window.outerHeight - workBottom);
    return Math.max(200, base - overhang);
  };
  const [vh, setVh] = useState(getViewportHeight);

  useEffect(() => {
    const update = () => setVh(getViewportHeight());
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    window.addEventListener('fullscreenchange', update);
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    // Dragging the window (possibly under the taskbar) fires no resize event —
    // only polling can see the position change. setVh with an unchanged value
    // is a no-op re-render-wise, so the idle cost is four property reads.
    const poll = setInterval(update, 1000);
    return () => {
      clearInterval(poll);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.removeEventListener('fullscreenchange', update);
      window.visualViewport?.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('scroll', update);
    };
  }, []);

  // Lock body scrolling while the game is mounted so mobile browsers don't
  // intercept touch events (elastic scroll, URL-bar show/hide) from the canvas.
  useEffect(() => {
    const hs = document.documentElement.style;
    const bs = document.body.style;
    const prev = {
      htmlOverflow: hs.overflow,
      bodyOverflow: bs.overflow,
      bodyPosition: bs.position,
      bodyWidth: bs.width,
      bodyOverscroll: bs.overscrollBehavior,
    };
    hs.overflow = 'hidden';
    bs.overflow = 'hidden';
    bs.overscrollBehavior = 'none';
    // iOS Safari: position fixed on body stops elastic overscroll.
    // Pair with width:100% so body doesn't collapse to 0 when taken out of flow.
    bs.position = 'fixed';
    bs.width = '100%';
    return () => {
      hs.overflow = prev.htmlOverflow;
      bs.overflow = prev.bodyOverflow;
      bs.overscrollBehavior = prev.bodyOverscroll;
      bs.position = prev.bodyPosition;
      bs.width = prev.bodyWidth;
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
    <div style={{ position: 'fixed', left: 0, top: 0, width: '100%', height: vh, overflow: 'hidden', touchAction: 'none' }}>
      <GameAuthGate user={user} onNavigateLogin={() => onNavigate('home')}>
        <Suspense fallback={<GameLoadingScreen progress={0} message="Loading game…" />}>
          <GameComponent
            user={user}
            profile={profile}
            onExit={() => onNavigate('games')}
            onProgressUpdate={onProgressUpdate ?? (() => {})}
            initialChallengeId={null}
            reducedMotion={reducedMotion}
            deviceTier={deviceTier}
          />
        </Suspense>
      </GameAuthGate>
    </div>
  );
}
