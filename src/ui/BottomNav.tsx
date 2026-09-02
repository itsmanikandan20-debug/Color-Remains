import type { Screen } from '../types';
import { ink, INK } from './tokens';

function PaletteIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="3" width="16" height="14" rx="4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="6.5" cy="8" r="1.3" fill="currentColor" />
      <circle cx="10.7" cy="6.8" r="1.3" fill="currentColor" />
      <circle cx="14.2" cy="9.3" r="1.3" fill="currentColor" />
      <circle cx="8" cy="12.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function JourneyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="3" y="10" width="3" height="6" rx="0.6" stroke="currentColor" strokeWidth="1.4" />
      <rect x="8.5" y="5" width="3" height="11" rx="0.6" stroke="currentColor" strokeWidth="1.4" />
      <rect x="14" y="12" width="3" height="4" rx="0.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function UserIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="6.3" r="3.3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 17c.8-3.6 3.6-5.6 6.5-5.6s5.7 2 6.5 5.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

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
            <JourneyIcon size={19} />
          </span>
          <span style={{ whiteSpace: 'nowrap', opacity: labelOpacity('balance') }}>Journey</span>
        </div>

        <div style={{ width: 76, flex: 'none' }} />

        <div
          onClick={() => onNav('profile')}
          style={{ flex: 1, cursor: 'pointer', height: 52, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 10.5, fontWeight: 500, color: pillColor('profile'), transition: 'color .2s ease' }}
        >
          <span style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s ease', background: pillBg('profile'), color: iconColor('profile') }}>
            <UserIcon size={19} />
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
          <span style={{ color: centerFg, display: 'block' }}>
            <PaletteIcon size={25} />
          </span>
        </div>
      </div>
    </div>
  );
}
