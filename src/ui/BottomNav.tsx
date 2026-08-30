import type { ReactElement } from 'react';
import type { Screen } from '../types';
import { ink, INK } from './tokens';

function PaletteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="3" width="16" height="14" rx="4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="6.5" cy="8" r="1.3" fill="currentColor" />
      <circle cx="10.7" cy="6.8" r="1.3" fill="currentColor" />
      <circle cx="14.2" cy="9.3" r="1.3" fill="currentColor" />
      <circle cx="8" cy="12.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <span style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 11 }}>
      <span style={{ width: 2.5, height: 6, background: 'currentColor', display: 'inline-block', borderRadius: 1 }} />
      <span style={{ width: 2.5, height: 11, background: 'currentColor', display: 'inline-block', borderRadius: 1 }} />
      <span style={{ width: 2.5, height: 4, background: 'currentColor', display: 'inline-block', borderRadius: 1 }} />
    </span>
  );
}

function PersonIcon() {
  return (
    <span style={{ display: 'block', width: 10, height: 10, borderRadius: '50%', marginTop: -4, boxShadow: 'inset 0 0 0 1.5px currentColor, 0 7px 0 -3px currentColor' }} />
  );
}

const TABS: { key: Screen; label: string; icon: () => ReactElement }[] = [
  { key: 'colors', label: 'Colors', icon: PaletteIcon },
  { key: 'balance', label: 'Journey', icon: BarChartIcon },
  { key: 'profile', label: 'Profile', icon: PersonIcon },
];

export function BottomNav({ screen, onNav }: { screen: Screen; onNav: (s: Screen) => void }) {
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
        }}
      >
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = screen === key;
          return (
            <div
              key={key}
              onClick={() => onNav(key)}
              style={{ flex: 1, cursor: 'pointer', height: 52, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 10.5, fontWeight: 500, color: active ? INK : ink(0.45), transition: 'color .2s ease' }}
            >
              <span style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s ease', background: active ? INK : 'transparent', color: active ? '#FFFFFF' : ink(0.45) }}>
                <Icon />
              </span>
              <span style={{ whiteSpace: 'nowrap', opacity: active ? 1 : 0.75 }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
