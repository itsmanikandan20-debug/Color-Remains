import type { AppState } from '../types';
import type { AppActions } from '../state/useAppState';
import type { Derived } from '../state/useDerived';
import { INK, ink, sheetWrap, scrim, starStyle } from '../ui/tokens';

export function DetailSheet({ state, derived, actions }: {
  state: AppState;
  derived: Extract<Derived, { acc: NonNullable<Derived['acc']> }>;
  actions: AppActions;
}) {
  const open = !!state.detailHex && !state.entryId && !state.addUsageHex;
  if (!open) return null;
  const hex = state.detailHex as string;
  const { detailEntries, detailFamily, detailFav } = derived;
  const close = () => actions.patch({ detailHex: null });
  const fav = starStyle(detailFav);
  const latest = detailEntries[0];

  return (
    <>
      <div onClick={close} style={scrim(20)} />
      <div style={{ ...sheetWrap, padding: '18px 22px 20px', display: 'flex', flexDirection: 'column', maxHeight: '78%' }}>
        <div style={{ display: 'flex', gap: 13, alignItems: 'center', paddingBottom: 14, borderBottom: `1px solid ${ink(0.07)}` }}>
          <div style={{ width: 52, height: 52, borderRadius: 11, flex: 'none', boxShadow: `inset 0 0 0 1px ${ink(0.13)}`, background: hex }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 11.5, letterSpacing: '.04em' }}>{hex}</div>
            <div style={{ fontSize: 16, marginTop: 3 }}>{detailFamily}</div>
          </div>
          <button
            onClick={() => latest && actions.toggleFav(latest.id)}
            title="Favorite"
            style={{ flex: 'none', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, lineHeight: 1, border: fav.border, background: fav.bg, color: fav.color }}
          >
            {fav.glyph}
          </button>
          <div style={{ textAlign: 'right', flex: 'none' }}>
            <div style={{ fontSize: 20 }}>{detailEntries.length}</div>
            <div style={{ fontSize: 9.5, color: ink(0.45) }}>{detailEntries.length === 1 ? 'use' : 'uses'}</div>
          </div>
        </div>

        <div style={{ fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: ink(0.42), padding: '14px 0 8px' }}>Usage history</div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {detailEntries.map((e) => (
            <div key={e.id} onClick={() => actions.openEntry(e)} style={{ display: 'flex', gap: 10, alignItems: 'center', paddingBottom: 12, borderBottom: `1px solid ${ink(0.06)}`, cursor: 'pointer' }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 12.5, lineHeight: 1.4 }}>{e.note}</div>
                <div style={{ fontSize: 9.5, color: ink(0.42), marginTop: 3 }}>{new Date(e.date).toLocaleDateString()}</div>
              </div>
              <span style={{ fontSize: 10, color: ink(0.35), flex: 'none' }}>Edit</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button
            onClick={() => actions.openAddUsage(hex)}
            style={{ flex: 1, padding: '12px 0', border: 'none', borderRadius: 11, background: INK, color: '#FFFFFF', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
          >
            Add Usage
          </button>
          <button onClick={close} style={{ flex: 1, padding: '12px 0', border: `1px solid ${ink(0.18)}`, borderRadius: 11, background: '#FAFAFA', fontSize: 13, color: INK, cursor: 'pointer' }}>Close</button>
        </div>
      </div>
    </>
  );
}
