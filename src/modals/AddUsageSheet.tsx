import type { AppState } from '../types';
import type { AppActions } from '../state/useAppState';
import type { Derived } from '../state/useDerived';
import { ink, inputStyle, primaryButton, ghostButton, sheetWrap, scrim, favToggleButton } from '../ui/tokens';

export function AddUsageSheet({ state, derived, actions }: {
  state: AppState;
  derived: Extract<Derived, { acc: NonNullable<Derived['acc']> }>;
  actions: AppActions;
}) {
  if (!state.addUsageHex) return null;
  const { addUsageFamily, addUsageFav: fav } = derived;
  const close = () => actions.patch({ addUsageHex: null });

  return (
    <>
      <div onClick={close} style={scrim(24)} />
      <div style={{ ...sheetWrap, zIndex: 25, padding: '20px 22px 24px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 46, height: 46, borderRadius: 11, flex: 'none', boxShadow: `inset 0 0 0 1px ${ink(0.14)}`, background: state.addUsageHex }} />
          <div>
            <div style={{ fontSize: 19 }}>Add usage</div>
            <div style={{ fontSize: 11, color: ink(0.5), letterSpacing: '.04em' }}>{state.addUsageHex} · {addUsageFamily}</div>
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
            <input
              value={state.addUsageNote}
              onChange={(e) => actions.patch({ addUsageNote: e.target.value })}
              placeholder="Where did you use it? e.g. Ledger app — chart line"
              style={{ ...inputStyle, flex: 1, minWidth: 0 }}
            />
            <button onClick={() => actions.patch((s) => ({ addUsageFav: !s.addUsageFav }))} title="Mark as favorite" style={favToggleButton(fav)}>{fav.glyph}</button>
          </div>
          <input type="date" value={state.addUsageDate} onChange={(e) => actions.patch({ addUsageDate: e.target.value })} style={{ ...inputStyle, fontSize: 12.5 }} />
        </div>
        <button onClick={() => actions.saveAddUsage()} style={{ ...primaryButton, marginTop: 14 }}>Save usage</button>
        <button onClick={close} style={ghostButton}>Cancel</button>
      </div>
    </>
  );
}
