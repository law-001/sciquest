const VARIANT_LABEL = {
  solid: 'SOLID',
  liquid: 'LIQUID',
  gas: 'GAS',
  melting: 'MELTING',
  freezing: 'FREEZING',
  evaporating: 'EVAPORATING',
  condensing: 'CONDENSING',
  sublimating: 'SUBLIMATING',
  depositing: 'DEPOSITING',
};

// The slider runs both ways, so the transition label depends on direction:
// heating up melts/evaporates; cooling down freezes/condenses.
function badgeVariant(state, isTransitioning, fromState, toState) {
  if (!isTransitioning) return state;
  switch (`${fromState}-${toState}`) {
    case 'solid-liquid': return 'melting';
    case 'liquid-solid': return 'freezing';
    case 'liquid-gas':   return 'evaporating';
    case 'gas-liquid':   return 'condensing';
    case 'solid-gas':    return 'sublimating';
    case 'gas-solid':    return 'depositing';
    default:             return state;
  }
}

export function StateBadge({ state, substance, isTransitioning, fromState, toState, reducedMotion: _reducedMotion }) {
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
