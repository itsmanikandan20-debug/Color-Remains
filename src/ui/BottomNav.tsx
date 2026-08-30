import type { Screen } from '../types';
import { ink, INK } from './tokens';

export function BottomNav({ screen, onNav }: { screen: Screen; onNav: (s: Screen) => void }) {
  const pillBg = (k: Screen) => (screen === k ? INK : 'transparent');
  const pillColor = (k: Screen) => (screen === k ? INK : ink(0.45));
  const iconColor = (k: Screen) => (screen === k ? '#FFFFFF' : ink(0.45));
  const labelOpacity = (k: Screen) => (screen === k ? 1 : 0.75);
  const centerBg = screen === 'colors' ? INK : ink(0.82);
  const centerFg = screen === 'colors' ? '#FFFFFF' : 'rgba(255,255,255,.85)';

  return (
    <div
      style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 15,
        padding: '34px 16px 16px',
        background: 'linear-gradient(to top,rgba(255,255,255,.97) 60%,rgba(255,255,255,0))',
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 4, padding: 5,
          background: '#FFFFFF', borderRadius: 22,
          boxShadow: `0 8px 24px rgba(28,27,26,.13), inset 0 0 0 1px ${ink(0.05)}`,
          position: 'relative',
        }}
      >
        <div
          onClick={() => onNav('balance')}
          style={{ flex: 1, cursor: 'pointer', height: 52, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 10.5, fontWeight: 500, color: pillColor('balance'), transition: 'color .2s ease' }}
        >
          <span style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s ease', background: pillBg('balance'), color: iconColor('balance') }}>
            <span style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 11 }}>
              <span style={{ width: 2.5, height: 6, background: 'currentColor', display: 'inline-block', borderRadius: 1 }} />
              <span style={{ width: 2.5, height: 11, background: 'currentColor', display: 'inline-block', borderRadius: 1 }} />
              <span style={{ width: 2.5, height: 4, background: 'currentColor', display: 'inline-block', borderRadius: 1 }} />
            </span>
          </span>
          <span style={{ whiteSpace: 'nowrap', opacity: labelOpacity('balance') }}>Journey</span>
        </div>

        <div style={{ width: 76, flex: 'none' }} />

        <div
          onClick={() => onNav('profile')}
          style={{ flex: 1, cursor: 'pointer', height: 52, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 10.5, fontWeight: 500, color: pillColor('profile'), transition: 'color .2s ease' }}
        >
          <span style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s ease', background: pillBg('profile'), color: iconColor('profile') }}>
            <span style={{ display: 'block', width: 10, height: 10, borderRadius: '50%', marginTop: -4, boxShadow: 'inset 0 0 0 1.5px currentColor, 0 7px 0 -3px currentColor' }} />
          </span>
          <span style={{ whiteSpace: 'nowrap', opacity: labelOpacity('profile') }}>Profile</span>
        </div>

        <div
          onClick={() => onNav('colors')}
          title="Log a color"
          style={{
            position: 'absolute', left: '50%', top: 0, transform: 'translate(-50%,-34%)',
            width: 62, height: 62, borderRadius: '50%', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: centerBg, boxShadow: '0 8px 22px rgba(28,27,26,.3), 0 0 0 6px #FFFFFF',
            transition: 'background .2s ease',
          }}
        >
          <span style={{ position: 'relative', width: 20, height: 20, display: 'block' }}>
            <span style={{ position: 'absolute', top: 9, left: 0, width: 20, height: 2, borderRadius: 1, background: centerFg }} />
            <span style={{ position: 'absolute', left: 9, top: 0, width: 2, height: 20, borderRadius: 1, background: centerFg }} />
          </span>
        </div>
      </div>
    </div>
  );
}
