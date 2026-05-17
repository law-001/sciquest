const MONO = '"Courier New", Courier, monospace';

export function SlotActionMenu({ canvasX, canvasY, slotDef, atp, onSell, onUpgrade, onCancel }) {
  const PANEL_LEFT = 160;
  const HUD_TOP = 56;

  const rawLeft = PANEL_LEFT + canvasX - 80;
  const rawTop  = HUD_TOP + canvasY - 120;
  const left = Math.max(PANEL_LEFT + 4, Math.min(window.innerWidth - 180, rawLeft));
  const top  = Math.max(HUD_TOP + 4, rawTop);

  const sellRefund = slotDef ? Math.floor(slotDef.cost * 0.5) : 0;
  const upgradeCost = slotDef?.upgradeCost ?? 0;
  const canAffordUpgrade = atp >= upgradeCost && upgradeCost > 0;

  return (
    <div
      role="dialog"
      aria-label="Tower options"
      style={{
        position: 'absolute',
        left,
        top,
        zIndex: 20,
        background: '#0D1B2A',
        border: '1.5px solid rgba(59,175,169,0.4)',
        borderRadius: 12,
        padding: '10px 14px',
        fontFamily: MONO,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        minWidth: 168,
        boxShadow: '0 8px 28px rgba(0,0,0,0.6)',
      }}
    >
      <div style={{ color: '#3BAFA9', fontSize: 10, letterSpacing: '0.12em', marginBottom: 2 }}>
        TOWER OPTIONS
      </div>

      <button
        onClick={onSell}
        style={{
          padding: '7px 12px',
          borderRadius: 8,
          border: '1px solid rgba(255,107,53,0.5)',
          background: 'rgba(255,107,53,0.12)',
          color: '#FF6B35',
          fontSize: 11,
          cursor: 'pointer',
          fontFamily: MONO,
          fontWeight: 700,
          minHeight: 34,
          textAlign: 'left',
        }}
      >
        SELL — refund {sellRefund} ATP
      </button>

      {upgradeCost > 0 && (
        <button
          onClick={canAffordUpgrade ? onUpgrade : undefined}
          disabled={!canAffordUpgrade}
          aria-disabled={!canAffordUpgrade}
          style={{
            padding: '7px 12px',
            borderRadius: 8,
            border: `1px solid ${canAffordUpgrade ? 'rgba(59,175,169,0.5)' : 'rgba(59,175,169,0.2)'}`,
            background: canAffordUpgrade ? 'rgba(59,175,169,0.12)' : 'rgba(59,175,169,0.04)',
            color: canAffordUpgrade ? '#3BAFA9' : 'rgba(59,175,169,0.35)',
            fontSize: 11,
            cursor: canAffordUpgrade ? 'pointer' : 'not-allowed',
            fontFamily: MONO,
            fontWeight: 700,
            minHeight: 34,
            textAlign: 'left',
          }}
        >
          UPGRADE — {upgradeCost} ATP
        </button>
      )}

      <button
        onClick={onCancel}
        style={{
          padding: '5px 12px',
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'transparent',
          color: 'rgba(255,255,255,0.35)',
          fontSize: 10,
          cursor: 'pointer',
          fontFamily: MONO,
          minHeight: 28,
        }}
      >
        CANCEL
      </button>
    </div>
  );
}
