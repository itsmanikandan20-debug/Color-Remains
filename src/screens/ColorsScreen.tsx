import { useEffect, useState, type MouseEvent, type RefObject } from 'react';
import type { AppState } from '../types';
import type { AppActions } from '../state/useAppState';
import type { Derived } from '../state/useDerived';
import { hsvToHex } from '../lib/color';
import { ink, INK } from '../ui/tokens';

function EyedropperIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M13.5 2.5L17.5 6.5L14.8 9.2L10.8 5.2L13.5 2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M11.5 7.5L3.5 15.5L2.5 18.5L5.5 17.5L13.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function ColorsScreen({
  state, derived, actions, imgRef,
}: {
  state: AppState;
  derived: Extract<Derived, { acc: NonNullable<Derived['acc']> }>;
  actions: AppActions;
  imgRef: RefObject<HTMLImageElement | null>;
}) {
  const { previewHex, previewFamily, existing, colorGroups, isEmpty, emptyTitle, emptyNote } = derived;

  const [pickPoint, setPickPoint] = useState<{ xPct: number; yPct: number } | null>(null);
  useEffect(() => { setPickPoint(null); }, [state.imageSrc]);

  const handleSample = (e: MouseEvent<HTMLImageElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const hex = actions.sampleFromImage(e.clientX, e.clientY);
    if (hex) {
      setPickPoint({
        xPct: ((e.clientX - r.left) / r.width) * 100,
        yPct: ((e.clientY - r.top) / r.height) * 100,
      });
    }
  };

  const satTrack = `linear-gradient(90deg,${hsvToHex(state.h, 0, state.v)},${hsvToHex(state.h, 100, state.v)})`;
  const valTrack = `linear-gradient(90deg,#1C1B1A,${hsvToHex(state.h, state.s, 100)})`;

  const markLabel = existing ? 'Already used ✓' : 'Mark as Used';
  const markBg = existing ? 'transparent' : INK;
  const markColor = existing ? ink(0.55) : '#FFFFFF';
  const markBorder = existing ? `1px solid ${ink(0.18)}` : 'none';

  const onMark = () => {
    if (existing) {
      actions.toast('You’ve already logged this color', existing.hex);
      return;
    }
    actions.patch({ noteOpen: true });
  };

  return (
    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '18px 22px 0' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
          <div style={{ width: 86, height: 86, borderRadius: 14, boxShadow: `inset 0 0 0 1px ${ink(0.14)}`, flex: 'none', background: previewHex }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
            <div>
              <div style={{ fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: ink(0.42) }}>Hex</div>
              <input
                value={state.hexInput}
                onChange={(e) => { actions.patch({ hexInput: e.target.value }); actions.setFromHex(e.target.value); }}
                spellCheck={false}
                style={{ width: '100%', marginTop: 4, padding: '8px 10px', border: `1px solid ${ink(0.16)}`, borderRadius: 9, background: '#FAFAFA', fontSize: 15, letterSpacing: '.04em', color: INK, outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 8 }}>
              <span style={{ fontSize: 17 }}>{previewFamily}</span>
              <span style={{ fontSize: 10, color: ink(0.45) }}>family</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span style={{ fontSize: 10, width: 14, color: ink(0.5) }}>H</span>
            <input
              type="range" min={0} max={360} value={state.h}
              onChange={(e) => actions.setFromHsv({ h: Number(e.target.value) })}
              style={{ flex: 1, height: 20, background: 'linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)', borderRadius: 3 }}
            />
            <span style={{ fontSize: 10, width: 30, textAlign: 'right', color: ink(0.5) }}>{Math.round(state.h)}°</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span style={{ fontSize: 10, width: 14, color: ink(0.5) }}>S</span>
            <input
              type="range" min={0} max={100} value={state.s}
              onChange={(e) => actions.setFromHsv({ s: Number(e.target.value) })}
              style={{ flex: 1, height: 20, borderRadius: 3, background: satTrack }}
            />
            <span style={{ fontSize: 10, width: 30, textAlign: 'right', color: ink(0.5) }}>{Math.round(state.s)}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span style={{ fontSize: 10, width: 14, color: ink(0.5) }}>B</span>
            <input
              type="range" min={0} max={100} value={state.v}
              onChange={(e) => actions.setFromHsv({ v: Number(e.target.value) })}
              style={{ flex: 1, height: 20, borderRadius: 3, background: valTrack }}
            />
            <span style={{ fontSize: 10, width: 30, textAlign: 'right', color: ink(0.5) }}>{Math.round(state.v)}%</span>
          </div>
        </div>

        <div style={{ marginTop: 15, display: 'flex', gap: 9 }}>
          <button onClick={onMark} style={{ flex: 1, padding: '13px 0', borderRadius: 11, fontSize: 13.5, fontWeight: 500, letterSpacing: '.01em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, whiteSpace: 'nowrap', border: markBorder, background: markBg, color: markColor }}>
            {markLabel}
          </button>
          <label style={{ flex: 'none', padding: '13px 14px', border: `1px solid ${ink(0.18)}`, borderRadius: 11, fontSize: 12.5, cursor: 'pointer', background: '#FAFAFA', display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', border: `1.5px solid ${ink(0.55)}`, display: 'inline-block' }} />
            <span>Image</span>
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) actions.onFile(f); }} style={{ display: 'none' }} />
          </label>
        </div>

        {existing && (
          <div style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', border: `1px solid ${ink(0.12)}`, borderRadius: 11, background: '#FAFAFA' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', flex: 'none', background: previewHex, boxShadow: `inset 0 0 0 1px ${ink(0.2)}` }} />
            <div onClick={() => actions.openEntry(existing)} style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}>
              <span style={{ fontSize: 12, lineHeight: 1.4, color: ink(0.6) }}>{existing.note} · {new Date(existing.date).toLocaleDateString()}</span>
            </div>
            <button
              onClick={() => actions.openAddUsage(existing.hex)}
              style={{ flex: 'none', padding: '7px 11px', borderRadius: 8, border: `1px solid ${ink(0.18)}`, background: '#FFFFFF', fontSize: 11.5, color: INK, cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              + Add
            </button>
          </div>
        )}

        {state.imageSrc && (
          <div style={{ marginTop: 13, border: `1px solid ${ink(0.12)}`, borderRadius: 12, padding: 9, background: '#FAFAFA' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: ink(0.55) }}>
                <EyedropperIcon />
                <span style={{ fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase', color: ink(0.42) }}>Tap image to pick a color</span>
              </div>
              <button onClick={() => actions.patch({ imageSrc: null, extractOpen: false })} style={{ border: 'none', background: 'none', fontSize: 9.5, color: ink(0.4), cursor: 'pointer', padding: '2px 4px' }}>Remove</button>
            </div>
            <div style={{ position: 'relative', width: '100%', height: 190, borderRadius: 6, overflow: 'hidden', background: '#1C1B1A' }}>
              <img
                src={state.imageSrc}
                ref={imgRef}
                onClick={handleSample}
                style={{ width: '100%', height: '190px', objectFit: 'contain', display: 'block', cursor: 'crosshair', borderRadius: 6 }}
              />
              <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', alignItems: 'center', gap: 5, padding: '5px 9px 5px 7px', borderRadius: 999, background: 'rgba(28,27,26,.72)', color: '#FFFFFF', pointerEvents: 'none' }}>
                <EyedropperIcon size={12} />
                <span style={{ fontSize: 10 }}>Eyedropper</span>
              </div>
              {pickPoint && (
                <div
                  style={{
                    position: 'absolute', left: pickPoint.xPct + '%', top: pickPoint.yPct + '%',
                    transform: 'translate(-50%,-50%)', width: 30, height: 30, borderRadius: '50%',
                    boxShadow: `0 0 0 2px #FFFFFF, 0 0 0 3px ${ink(0.5)}, 0 2px 8px rgba(0,0,0,.4)`,
                    background: previewHex, pointerEvents: 'none',
                  }}
                />
              )}
            </div>
            <button onClick={() => actions.extract()} style={{ width: '100%', marginTop: 9, padding: '11px 0', border: `1px solid ${ink(0.18)}`, borderRadius: 10, background: '#FFFFFF', fontSize: 12.5, color: INK, cursor: 'pointer' }}>
              Auto-Extract Colors
            </button>
          </div>
        )}
      </div>

      <div style={{ padding: '20px 22px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontSize: 19, fontWeight: 600 }}>Your Colors</div>
        <select
          value={state.gridFilter}
          onChange={(e) => actions.patch({ gridFilter: e.target.value as typeof state.gridFilter })}
          style={{ border: `1px solid ${ink(0.16)}`, borderRadius: 8, padding: '6px 9px', fontSize: 11, color: INK, background: '#FAFAFA', cursor: 'pointer', flex: 'none' }}
        >
          <option value="most">Most used</option>
          <option value="least">Least used</option>
        </select>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 22px 96px' }}>
        {isEmpty && (
          <div style={{ border: `1px dashed ${ink(0.22)}`, borderRadius: 14, padding: '30px 22px', textAlign: 'center' }}>
            <div style={{ fontSize: 17, marginBottom: 6, fontWeight: 600 }}>{emptyTitle}</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.55, color: ink(0.55) }}>{emptyNote}</div>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {colorGroups.map((g) => (
            <div key={g.hex} onClick={() => actions.patch({ detailHex: g.hex })} style={{ cursor: 'pointer' }}>
              <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, boxShadow: `inset 0 0 0 1px ${ink(0.12)}`, background: g.hex }}>
                {g.fav && (
                  <div style={{ position: 'absolute', top: 3, right: 4, fontSize: 11, lineHeight: 1, color: '#FFFFFF', textShadow: '0 1px 2px rgba(28,27,26,.55)' }}>★</div>
                )}
                {g.count > 1 && (
                  <div style={{ position: 'absolute', bottom: 3, right: 3, minWidth: 15, height: 15, padding: '0 3px', borderRadius: 999, background: 'rgba(28,27,26,.72)', color: '#FFFFFF', fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ×{g.count}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 8.5, color: ink(0.45), marginTop: 4, textAlign: 'center' }}>{g.hex.replace('#', '')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
