const VARIANT_LABEL = {
  solid: 'SOLID',
  melting: 'MELTING',
  liquid: 'LIQUID',
  evaporating: 'EVAPORATING',
  gas: 'GAS',
};

function badgeVariant(state, isTransitioning, fromState, toState) {
  if (!isTransitioning) return state;
  const pair = `${fromState}-${toState}`;
  if (pair === 'solid-liquid' || pair === 'liquid-solid') return 'melting';
  if (pair === 'liquid-gas' || pair === 'gas-liquid') return 'evaporating';
  if (pair === 'solid-gas' || pair === 'gas-solid') return 'evaporating';
  return state;
}

export function StateBadge({ state, substance, isTransitioning, fromState, toState, reducedMotion }) {
  const variant = badgeVariant(state, isTransitioning, fromState, toState);

  const label = isTransitioning
    ? VARIANT_LABEL[variant]
    : (substance?.[`${state}Label`]?.toUpperCase() ?? VARIANT_LABEL[state] ?? state.toUpperCase());

  return (
    <div
      role="status"
      aria-live="polite"
      className={`sq-state-badge sq-state-badge--${variant}`}
    >
      <span className="swatch" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
