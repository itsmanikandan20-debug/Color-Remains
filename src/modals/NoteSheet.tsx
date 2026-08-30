import type { AppState } from '../types';
import type { AppActions } from '../state/useAppState';
import { ink, inputStyle, primaryButton, ghostButton, sheetWrap, scrim, starStyle, favToggleButton } from '../ui/tokens';

export function NoteSheet({ state, previewHex, previewFamily, actions }: {
  state: AppState; previewHex: string; previewFamily: string; actions: AppActions;
}) {
  if (!state.noteOpen) return null;
  const close = () => actions.patch({ noteOpen: false });
  const fav = starStyle(state.fav);

  return (
    <>
      <div onClick={close} style={scrim(20)} />
      <div style={{ ...sheetWrap, padding: '20px 22px 24px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 46, height: 46, borderRadius: 11, flex: 'none', boxShadow: `inset 0 0 0 1px ${ink(0.14)}`, background: previewHex }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 19 }}>{previewFamily}</div>
            <div style={{ fontSize: 11, color: ink(0.5), letterSpacing: '.04em' }}>{state.hexInput}</div>
          </div>
          <button onClick={() => actions.patch((s) => ({ fav: !s.fav }))} title="Mark as favorite" style={favToggleButton(fav)}>{fav.glyph}</button>
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            value={state.note}
            onChange={(e) => actions.patch({ note: e.target.value })}
            placeholder="Where did you use it? e.g. Ledger app — chart line"
            style={inputStyle}
          />
          <input type="date" value={state.date} onChange={(e) => actions.patch({ date: e.target.value })} style={{ ...inputStyle, fontSize: 12.5 }} />
        </div>
        <button onClick={() => actions.save()} style={{ ...primaryButton, marginTop: 14 }}>Save to log</button>
        <button onClick={close} style={ghostButton}>Cancel</button>
      </div>
    </>
  );
}
