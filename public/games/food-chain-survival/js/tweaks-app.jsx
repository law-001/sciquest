/* Tiny React bridge: renders ONLY the Tweaks panel and mirrors its state to
   window.__tweaks (+ a 'tweakschange' event) so the vanilla canvas game can read
   live values. Keeps the game engine framework-free. */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "difficulty": "Forgiving",
  "enemySpeed": 1,
  "playerSpeed": 1,
  "showCones": true,
  "foxHunger": true,
  "rivals": true,
  "warrenNerves": 1
}/*EDITMODE-END*/;

function normalize(t) {
  return {
    difficulty: { Forgiving: 0, Balanced: 1, Tough: 2 }[t.difficulty] ?? 0,
    difficultyLabel: t.difficulty,
    enemySpeed: t.enemySpeed,
    playerSpeed: t.playerSpeed,
    showCones: t.showCones,
    foxHunger: t.foxHunger,
    rivals: t.rivals,
    warrenNerves: t.warrenNerves,
  };
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => {
    window.__tweaks = normalize(t);
    window.dispatchEvent(new CustomEvent('tweakschange', { detail: window.__tweaks }));
  }, [t]);
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Challenge" />
      <TweakRadio label="Difficulty" value={t.difficulty}
        options={['Forgiving', 'Balanced', 'Tough']}
        onChange={(v) => setTweak('difficulty', v)} />
      <TweakSlider label="Enemy speed" value={t.enemySpeed} min={0.6} max={1.5} step={0.05} unit="×"
        onChange={(v) => setTweak('enemySpeed', v)} />
      <TweakSlider label="Your speed" value={t.playerSpeed} min={0.7} max={1.6} step={0.05} unit="×"
        onChange={(v) => setTweak('playerSpeed', v)} />
      <TweakSection label="Helpers" />
      <TweakToggle label="Show vision cones" value={t.showCones}
        onChange={(v) => setTweak('showCones', v)} />
      <TweakSection label="Level 2 · Fox hunt" />
      <TweakToggle label="Fox hunger (energy)" value={t.foxHunger}
        onChange={(v) => setTweak('foxHunger', v)} />
      <TweakToggle label="Competing predators" value={t.rivals}
        onChange={(v) => setTweak('rivals', v)} />
      <TweakSlider label="Warren nerves" value={t.warrenNerves} min={0.6} max={1.6} step={0.05} unit="×"
        onChange={(v) => setTweak('warrenNerves', v)} />
    </TweaksPanel>
  );
}

window.__tweaks = normalize(TWEAK_DEFAULTS);
(function mountTweaks() {
  const el = document.createElement('div');
  el.id = 'tweaks-root';
  document.body.appendChild(el);
  ReactDOM.createRoot(el).render(<TweaksApp />);
})();
