import type { AppState } from '../types';
import type { AppActions } from '../state/useAppState';
import type { Derived } from '../state/useDerived';
import { ink, INK, scrim } from '../ui/tokens';

export function FamilySheet({ state, derived, actions }: {
  state: AppState;
  derived: Extract<Derived, { acc: NonNullable<Derived['acc']> }>;
  actions: AppActions;
}) {
  const { sheetName, sheetItems, sheetEmpty, sheetEmptyNote, countByHex } = derived;
  if (!sheetName) return null;
  const close = () => actions.patch({ familyOpen: null });

  return (
    <>
      <div onClick={close} style={scrim(20)} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, top: 96, zIndex: 21,
        background: '#FFFFFF', borderRadius: '20px 20px 26px 26px', padding: '18px 22px 24px',
        boxShadow: '0 -8px 30px rgba(28,27,26,.16)', animation: 'cbUp .3s cubic-bezier(.2,.8,.25,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 24 }}>{sheetName}</div>
            <div style={{ fontSize: 10, color: ink(0.45), marginTop: 3 }}>
              {sheetItems.length ? sheetItems.length + ' logged · ' + (state.range === 'year' ? 'this year' : 'lifetime') : 'no entries'}
            </div>
          </div>
          <button onClick={close} style={{ border: `1px solid ${ink(0.16)}`, background: '#FAFAFA', borderRadius: 8, padding: '6px 11px', fontSize: 11.5, cursor: 'pointer', color: INK }}>Close</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {sheetEmpty && (
            <div style={{ border: `1px dashed ${ink(0.22)}`, borderRadius: 14, padding: '26px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 17, marginBottom: 6 }}>An untouched family</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.55, color: ink(0.55) }}>{sheetEmptyNote}</div>
            </div>
          )}
          {sheetItems.map((i) => (
            <div key={i.raw.id} onClick={() => actions.openEntry(i.raw)} style={{ display: 'flex', gap: 13, alignItems: 'center', paddingBottom: 13, borderBottom: `1px solid ${ink(0.07)}`, cursor: 'pointer' }}>
              <div style={{ position: 'relative', width: 52, height: 52, borderRadius: 11, flex: 'none', boxShadow: `inset 0 0 0 1px ${ink(0.13)}`, background: i.hex }}>
                {countByHex[i.hex] > 1 && (
                  <div style={{ position: 'absolute', bottom: 3, right: 3, minWidth: 15, height: 15, padding: '0 3px', borderRadius: 999, background: 'rgba(28,27,26,.72)', color: '#FFFFFF', fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ×{countByHex[i.hex]}
                  </div>
                )}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11.5, letterSpacing: '.04em' }}>{i.hex}</span>
                  {i.fav && <span style={{ fontSize: 11, lineHeight: 1, color: INK }}>★</span>}
                </div>
                <div style={{ fontSize: 12.5, lineHeight: 1.4, marginTop: 3 }}>{i.note}</div>
                <div style={{ fontSize: 9.5, color: ink(0.42), marginTop: 3 }}>{i.dateLabel}</div>
              </div>
              <span style={{ fontSize: 10, color: ink(0.35), flex: 'none' }}>Edit</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
