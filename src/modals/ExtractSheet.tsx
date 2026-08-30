import type { AppState } from '../types';
import type { AppActions } from '../state/useAppState';
import type { Derived } from '../state/useDerived';
import { ink, INK, inputStyle, scrim, favToggleButton } from '../ui/tokens';

export function ExtractSheet({ state, derived, actions }: {
  state: AppState;
  derived: Extract<Derived, { acc: NonNullable<Derived['acc']> }>;
  actions: AppActions;
}) {
  if (!state.extractOpen) return null;
  const { selectedCount, allSelected, batchFav } = derived;
  const close = () => actions.patch({ extractOpen: false });

  const toggle = (hex: string) => {
    actions.patch((st) => {
      const p = { ...st.extractPicked };
      if (p[hex]) delete p[hex]; else p[hex] = true;
      return { extractPicked: p };
    });
  };
  const selectAll = () => {
    actions.patch((st) => {
      if (st.extractNew.length > 0 && st.extractNew.every((x) => st.extractPicked[x])) return { extractPicked: {} };
      const p: Record<string, boolean> = {};
      st.extractNew.forEach((x) => { p[x] = true; });
      return { extractPicked: p };
    });
  };

  return (
    <>
      <div onClick={close} style={scrim(22)} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, top: 120, zIndex: 23,
        background: '#FFFFFF', borderRadius: '20px 20px 26px 26px', padding: '18px 22px 22px',
        boxShadow: '0 -8px 30px rgba(28,27,26,.16)', animation: 'cbUp .3s cubic-bezier(.2,.8,.25,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 22 }}>Extracted colors</div>
            <div style={{ fontSize: 10, color: ink(0.45), marginTop: 3 }}>{state.extractNew.length} new · {state.extractDupes.length} already logged</div>
          </div>
          <div style={{ display: 'flex', gap: 7, flex: 'none' }}>
            <button onClick={selectAll} style={{ border: `1px solid ${ink(0.16)}`, background: '#FAFAFA', borderRadius: 8, padding: '6px 11px', fontSize: 11.5, cursor: 'pointer', color: INK }}>
              {allSelected ? 'Clear all' : 'Select all'}
            </button>
            <button onClick={close} style={{ border: `1px solid ${ink(0.16)}`, background: '#FAFAFA', borderRadius: 8, padding: '6px 11px', fontSize: 11.5, cursor: 'pointer', color: INK }}>Close</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginTop: 16 }}>
          {state.extractNew.length === 0 && (
            <div style={{ border: `1px dashed ${ink(0.22)}`, borderRadius: 12, padding: '20px 16px', textAlign: 'center', fontSize: 12.5, lineHeight: 1.5, color: ink(0.55) }}>
              Every color in this image is already in your log.
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {state.extractNew.map((hex) => {
              const selected = !!state.extractPicked[hex];
              return (
                <div key={hex} onClick={() => toggle(hex)} style={{ cursor: 'pointer' }}>
                  <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, background: hex, boxShadow: selected ? `inset 0 0 0 2px ${INK}` : `inset 0 0 0 1px ${ink(0.12)}` }}>
                    {selected && (
                      <div style={{ position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: '50%', background: INK, color: '#FFFFFF', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'cbTick .3s cubic-bezier(.2,.9,.3,1)' }}>✓</div>
                    )}
                  </div>
                  <div style={{ fontSize: 8.5, color: ink(0.45), marginTop: 4, textAlign: 'center' }}>{hex.replace('#', '')}</div>
                </div>
              );
            })}
          </div>

          {state.extractDupes.length > 0 && (
            <>
              <div style={{ fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: ink(0.42), margin: '22px 0 9px' }}>Already logged — tap to add a use</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                {state.extractDupes.map((hex) => (
                  <div key={hex} onClick={() => actions.openAddUsage(hex)} style={{ opacity: 0.7, cursor: 'pointer' }}>
                    <div style={{ aspectRatio: '1', borderRadius: 10, background: hex, boxShadow: `inset 0 0 0 1px ${ink(0.12)}`, filter: 'grayscale(.4)' }} />
                    <div style={{ fontSize: 8, color: ink(0.45), marginTop: 4, textAlign: 'center' }}>+ Add use</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ paddingTop: 14, borderTop: `1px solid ${ink(0.09)}` }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
            <input
              value={state.batchNote}
              onChange={(e) => actions.patch({ batchNote: e.target.value })}
              placeholder="Project/Design name"
              style={{ ...inputStyle, flex: 1, minWidth: 0 }}
            />
            <button onClick={() => actions.patch((s) => ({ batchFav: !s.batchFav }))} title="Mark all as favorite" style={favToggleButton(batchFav)}>{batchFav.glyph}</button>
          </div>
          <button
            onClick={() => actions.addBatch()}
            style={{ width: '100%', marginTop: 9, padding: '13px 0', border: 'none', borderRadius: 11, fontSize: 13.5, fontWeight: 500, cursor: 'pointer', background: selectedCount ? INK : ink(0.09), color: selectedCount ? '#FFFFFF' : ink(0.4) }}
          >
            {selectedCount ? `Add Selected (${selectedCount})` : 'Select colors to add'}
          </button>
          <div style={{ fontSize: 11, color: ink(0.42), marginTop: 8, textAlign: 'center' }}>One name applies to every color in this batch.</div>
        </div>
      </div>
    </>
  );
}
