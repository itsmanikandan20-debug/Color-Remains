import type { AppState } from '../types';
import type { AppActions } from '../state/useAppState';
import { familyOf } from '../lib/color';
import { ink, RED, inputStyle, primaryButton, sheetWrap, scrim, starStyle, favToggleButton } from '../ui/tokens';

export function EntrySheet({ state, actions }: { state: AppState; actions: AppActions }) {
  if (!state.entryId || !state.entryHex) return null;
  const close = () => actions.patch({ entryId: null, entryHex: null });
  const fav = starStyle(state.entryFav);

  return (
    <>
      <div onClick={close} style={scrim(22)} />
      <div style={{ ...sheetWrap, zIndex: 23, padding: '20px 22px 24px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 46, height: 46, borderRadius: 11, flex: 'none', boxShadow: `inset 0 0 0 1px ${ink(0.14)}`, background: state.entryHex }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 19 }}>Edit entry</div>
            <div style={{ fontSize: 11, color: ink(0.5), letterSpacing: '.04em' }}>{state.entryHex} · {familyOf(state.entryHex)}</div>
          </div>
          <button onClick={() => actions.patch((s) => ({ entryFav: !s.entryFav }))} title="Mark as favorite" style={favToggleButton(fav)}>{fav.glyph}</button>
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            value={state.entryNote}
            onChange={(e) => actions.patch({ entryNote: e.target.value })}
            placeholder="Project or where it was used"
            style={inputStyle}
          />
          <input type="date" value={state.entryDate} onChange={(e) => actions.patch({ entryDate: e.target.value })} style={{ ...inputStyle, fontSize: 12.5 }} />
        </div>
        <button onClick={() => actions.saveEntry()} style={{ ...primaryButton, marginTop: 14 }}>Save changes</button>
        <div style={{ display: 'flex', gap: 8, marginTop: 7 }}>
          <button onClick={close} style={{ flex: 1, padding: '9px 0', border: 'none', background: 'none', color: ink(0.5), fontSize: 12.5, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => actions.removeEntry()} style={{ flex: 1, padding: '9px 0', border: 'none', background: 'none', color: RED, fontSize: 12.5, cursor: 'pointer' }}>Remove from log</button>
        </div>
      </div>
    </>
  );
}
