import type { AppState } from '../types';
import type { AppActions } from '../state/useAppState';
import type { Derived } from '../state/useDerived';
import { ink, INK, inputStyle, scrim } from '../ui/tokens';

export function ExtractSheet({ state, derived, actions }: {
  state: AppState;
  derived: Extract<Derived, { acc: NonNullable<Derived['acc']> }>;
  actions: AppActions;
}) {
  if (!state.extractOpen) return null;
  const { selectedCount, allNewSelected, allDupesSelected, countByHex } = derived;
  const close = () => actions.patch({ extractOpen: false });

  const toggle = (hex: string) => {
    actions.patch((st) => {
      const p = { ...st.extractPicked };
      if (p[hex]) delete p[hex]; else p[hex] = true;
      return { extractPicked: p };
    });
  };
  // Each "Select all" only ever adds/removes keys belonging to its own
  // section, so the other section's picks are never touched.
  const selectAllIn = (list: string[]) => {
    actions.patch((st) => {
      const allSel = list.length > 0 && list.every((x) => st.extractPicked[x]);
      const p = { ...st.extractPicked };
      list.forEach((x) => { if (allSel) delete p[x]; else p[x] = true; });
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
            <button onClick={() => selectAllIn(state.extractNew)} style={{ border: `1px solid ${ink(0.16)}`, background: '#FAFAFA', borderRadius: 8, padding: '6px 11px', fontSize: 11.5, cursor: 'pointer', color: INK }}>
              {allNewSelected ? 'Deselect all' : 'Select all'}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '22px 0 9px' }}>
                <div style={{ fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: ink(0.42) }}>Already logged</div>
                <button onClick={() => selectAllIn(state.extractDupes)} style={{ border: `1px solid ${ink(0.16)}`, background: '#FAFAFA', borderRadius: 7, padding: '4px 9px', fontSize: 10, cursor: 'pointer', color: INK, flex: 'none' }}>
                  {allDupesSelected ? 'Deselect all' : 'Select all'}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                {state.extractDupes.map((hex) => {
                  const selected = !!state.extractPicked[hex];
                  return (
                    <div key={hex} onClick={() => toggle(hex)} style={{ cursor: 'pointer' }}>
                      <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, background: hex, boxShadow: selected ? `inset 0 0 0 2px ${INK}` : `inset 0 0 0 1px ${ink(0.12)}`, filter: selected ? 'none' : 'grayscale(.4)', opacity: selected ? 1 : 0.7 }}>
                        {selected && (
                          <div style={{ position: 'absolute', top: 4, right: 4, width: 18, height: 18, borderRadius: '50%', background: INK, color: '#FFFFFF', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'cbTick .3s cubic-bezier(.2,.9,.3,1)' }}>✓</div>
                        )}
                        {countByHex[hex] > 1 && (
                          <div style={{ position: 'absolute', bottom: 3, right: 3, minWidth: 15, height: 15, padding: '0 3px', borderRadius: 999, background: 'rgba(28,27,26,.72)', color: '#FFFFFF', fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            ×{countByHex[hex]}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 8.5, color: ink(0.45), marginTop: 4, textAlign: 'center' }}>{hex.replace('#', '')}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div style={{ paddingTop: 14, borderTop: `1px solid ${ink(0.09)}` }}>
          <input
            value={state.batchNote}
            onChange={(e) => actions.patch({ batchNote: e.target.value })}
            placeholder="Project/Design name"
            style={inputStyle}
          />
          <button
            onClick={() => actions.addBatch()}
            style={{ width: '100%', marginTop: 9, padding: '13px 0', border: 'none', borderRadius: 11, fontSize: 13.5, fontWeight: 500, cursor: 'pointer', background: selectedCount ? INK : ink(0.09), color: selectedCount ? '#FFFFFF' : ink(0.4) }}
          >
            {selectedCount ? `Add ${selectedCount} color${selectedCount === 1 ? '' : 's'}` : 'Select colors to add'}
          </button>
          <div style={{ fontSize: 11, color: ink(0.42), marginTop: 8, textAlign: 'center' }}>One name applies to every color in this batch.</div>
        </div>
      </div>
    </>
  );
}
