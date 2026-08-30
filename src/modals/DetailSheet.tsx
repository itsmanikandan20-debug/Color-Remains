import type { AppState } from '../types';
import type { AppActions } from '../state/useAppState';
import { dateLabel, familyOf } from '../lib/color';
import { ink, INK, sheetWrap, scrim } from '../ui/tokens';

export function DetailSheet({ state, actions }: { state: AppState; actions: AppActions }) {
  const entry = state.detailHex && !state.entryHex
    ? state.account?.log.find((c) => c.hex.toUpperCase() === state.detailHex) ?? null
    : null;
  if (!entry) return null;
  const close = () => actions.patch({ detailHex: null });
  const hex = entry.hex.toUpperCase();

  return (
    <>
      <div onClick={close} style={scrim(20)} />
      <div style={{ ...sheetWrap, padding: '18px 22px 24px' }}>
        <div style={{ display: 'flex', gap: 13, alignItems: 'center', paddingBottom: 14, borderBottom: `1px solid ${ink(0.07)}` }}>
          <div style={{ width: 52, height: 52, borderRadius: 11, flex: 'none', boxShadow: `inset 0 0 0 1px ${ink(0.13)}`, background: hex }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11.5, letterSpacing: '.04em' }}>{hex}</span>
              {entry.fav && <span style={{ fontSize: 11, lineHeight: 1, color: INK }}>★</span>}
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.4, marginTop: 3 }}>{entry.note}</div>
            <div style={{ fontSize: 9.5, color: ink(0.42), marginTop: 3 }}>{dateLabel(entry.date)}</div>
          </div>
          <button onClick={() => actions.openEntry(entry)} style={{ flex: 'none', border: 'none', background: 'none', fontSize: 10, color: ink(0.45), cursor: 'pointer', padding: 4 }}>Edit</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingTop: 13 }}>
          <span style={{ fontSize: 16 }}>{familyOf(hex)}</span>
          <span style={{ fontSize: 10, color: ink(0.45) }}>family</span>
        </div>
        <button onClick={close} style={{ width: '100%', marginTop: 16, padding: '12px 0', border: `1px solid ${ink(0.18)}`, borderRadius: 11, background: '#FAFAFA', fontSize: 13, color: INK, cursor: 'pointer' }}>Close</button>
      </div>
    </>
  );
}
