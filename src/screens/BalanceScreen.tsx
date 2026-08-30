import type { AppState } from '../types';
import type { AppActions } from '../state/useAppState';
import type { Derived } from '../state/useDerived';
import { ink } from '../ui/tokens';

export function BalanceScreen({
  state, derived, actions,
}: {
  state: AppState;
  derived: Extract<Derived, { acc: NonNullable<Derived['acc']> }>;
  actions: AppActions;
}) {
  const { filtered, stats, familyRows, coverageNote, pips } = derived;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 110px' }}>
      <div style={{ display: 'flex', gap: 7, padding: 3, background: ink(0.055), borderRadius: 10, marginBottom: 20 }}>
        <button
          onClick={() => actions.patch({ range: 'lifetime' })}
          style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer', background: state.range === 'lifetime' ? '#FFFFFF' : 'transparent', color: '#1C1B1A', boxShadow: state.range === 'lifetime' ? '0 1px 3px rgba(28,27,26,.14)' : 'none' }}
        >
          Lifetime
        </button>
        <button
          onClick={() => actions.patch({ range: 'year' })}
          style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: 8, fontSize: 12, cursor: 'pointer', background: state.range === 'year' ? '#FFFFFF' : 'transparent', color: '#1C1B1A', boxShadow: state.range === 'year' ? '0 1px 3px rgba(28,27,26,.14)' : 'none' }}
        >
          This year
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, paddingBottom: 18, borderBottom: `1px solid ${ink(0.09)}` }}>
        <div style={{ fontSize: 64, lineHeight: 0.85, letterSpacing: '-.03em' }}>{filtered.length}</div>
        <div style={{ paddingBottom: 5 }}>
          <div style={{ fontSize: 12.5, lineHeight: 1.4, color: ink(0.6) }}>unique colors<br />marked as used</div>
        </div>
      </div>

      <div style={{ padding: '18px 0 20px', borderBottom: `1px solid ${ink(0.09)}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 22 }}>{stats.touched}/15 families</div>
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
          {pips.map((p, i) => (
            <div key={i} style={{ flex: 1, height: 7, borderRadius: 2, background: p.bg, boxShadow: p.ring }} />
          ))}
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.5, color: ink(0.55), marginTop: 11 }}>{coverageNote}</div>
      </div>

      <div style={{ fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: ink(0.42), padding: '18px 0 10px' }}>Families</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {familyRows.map((f) => (
          <div key={f.name} onClick={() => actions.patch({ familyOpen: f.name })} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 15.5, opacity: f.nameOpacity }}>{f.name}</span>
              <span style={{ fontSize: 10, color: ink(0.45) }}>{f.meta}</span>
            </div>
            <div style={{ height: 12, borderRadius: 3, background: ink(0.045), boxShadow: f.trackRing, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 3, transition: 'width .5s cubic-bezier(.2,.7,.3,1)', width: f.width, background: f.fill }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
